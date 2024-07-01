<template>
  <div class="new-element-dialog">
    <el-dialog
      v-model="props.dialogFormVisible"
      @closed="resetForm(elementFormRef, false)"
      width="600px"
      center
      title="新建要素"
      :close-on-click-modal="false"
    >
      <el-form
        class="dialog-form"
        ref="elementFormRef"
        :model="form"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <el-form-item label="数据源" prop="sourceId">
          <el-select v-model="form.sourceId" placeholder="选择数据源" clearable>
            <el-option
              v-for="source in state.sourceOptions"
              :key="source.id"
              :label="source.name"
              :value="`${source.id}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="要素名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入要素名称" />
        </el-form-item>
        <el-form-item label="要素类型" prop="elementType">
          <el-select v-model="form.elementType" placeholder="请选择要素类型" style="width: 100%">
            <el-option
              v-for="item in state.elementTypeOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否必填" prop="required">
          <el-radio-group v-model="form.required">
            <el-radio :label="0">非必填</el-radio>
            <el-radio :label="1">必填</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="取值形式"
          prop="valueType"
          v-if="form.elementType === 'text' || form.elementType === 'image'"
        >
          <el-radio v-model="form.valueType" :label="0">绑定数据源</el-radio>
          <el-radio v-model="form.valueType" :label="1">固定值</el-radio>
        </el-form-item>
        <el-form-item
          label="绑定数据源"
          prop="source"
          v-if="
            !(form.valueType === 1 && (form.elementType === 'text' || form.elementType === 'image'))
          "
        >
          <!-- 绑定的props是cascader组件渲染时则执行，本需求是依赖所属系统的值来加载cascader的数据 -->
          <el-cascader
            style="width: 100%"
            ref="cascaderRef"
            placeholder="选择数据源"
            v-model="form.source"
            :props="sourceProps"
            :options="state.cascaderOptions"
          />
        </el-form-item>
        <el-form-item
          label="要素值"
          prop="fixedValue"
          v-if="form.elementType === 'text' && form.valueType === 1"
        >
          <el-input v-model="form.fixedValue" placeholder="请输入文本内容" />
        </el-form-item>
        <el-form-item
          label="要素值"
          prop="fixedValue"
          v-if="form.elementType === 'image' && form.valueType === 1"
        >
          <el-upload
            v-model="form.fixedValue"
            action="none"
            class="upload"
            :http-request="uploadImage"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">上传图片</el-button>
            <template #tip>
              <span class="el-upload__tip">仅支持jpg/png/gif格式</span>
            </template>
          </el-upload>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="最小尺寸" prop="width">
              <el-input v-model="form.width" placeholder="宽度">
                <template #suffix>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="connected-icon" :span="3">
            <el-icon :size="24">
              <close-bold />
            </el-icon>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0" prop="height">
              <el-input v-model="form.height" placeholder="高度">
                <template #suffix>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="form.elementType === 'text' || form.elementType === 'water'"
          label="最小字号"
          prop="fontSize"
        >
          <el-input placeholder="请输入要求的最小字号" v-model="form.fontSize" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSave(elementFormRef)">确定</el-button>
          <el-button @click="resetForm(elementFormRef, false)">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits } from 'vue';
  import { ElMessage } from 'element-plus';
  import { nextTick, onMounted, PropType } from 'vue';
  import { requestV1 } from '@/axios/request';
  import type { FormRules } from 'element-plus';
  import { SystemData } from '../../../types/apis/systemData';
  import type { elementData } from '../../../types/apis/elementData';
  import type { ElForm } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';
  import { openTemplateData } from '../../../types/apis/openTemplateData';
  import elementTypeList from '../../../enums/element';
  import { Business } from '../../../types/apis/business';
  import selectListMixins from '../../../mixins/selectList';
  import { Session } from '../../../utils/session';
  import { SourceData } from '../../../types/apis/sourceData';

  // props
  const props = defineProps({
    dialogFormVisible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  });
  // emits
  const emit = defineEmits(['closed']);
  interface ValueTypeMap {
    [key: number]: Function;
  }
  interface LevelMap {
    [key: number]: Function;
  }
  type FormInstance = InstanceType<typeof ElForm>;
  const elementFormRef = ref<FormInstance>();
  const formLabelWidth = '130px';
  const form = reactive({
    orgId: Session.getOrgId(),
    code: '',
    name: '',
    sourceId: '',
    elementType: '',
    fontSize: '',
    width: '',
    height: '',
    source: [],
    remark: '',
    valueType: 0,
    fixedValue: '',
    required: 1,
  });
  const cascaderRef = ref();
  const state = reactive({
    elementTypeOptionList: elementTypeList(),
    selectSourceId: '',
    cascaderOptions: [],
    sourceOptions: [] as SourceData.Instance[],
  });

  const { getSourceList } = selectListMixins(state);

  const sourceProps = reactive({
    lazy: true,
    lazyLoad: async (node: any, resolve: any) => {
      const { level, value } = node;
      let params = {};
      if (form.orgId) {
        const levelMap: LevelMap = {
          0: () => {
            params = { level, hasChild: 1, id: form.orgId };
          },
          1: () => {
            params = { level, hasChild: 1, id: form.orgId, sourceId: value, parentId: 0 };
            state.selectSourceId = value;
          },
        };
        level > 1
          ? (params = {
              level: 1,
              hasChild: 1,
              id: form.orgId,
              sourceId: state.selectSourceId,
              parentId: value,
            })
          : levelMap[level] && levelMap[level]();
        const response = await requestV1.systemSourcePropertyList({ params });
        const { data } = response;
        const nodes = data.map((item: elementData.Instance) => ({
          value: item.cascaderValue,
          label: item.cascaderLabel,
          leaf: item.hasChild !== 1,
          disabled: item.hasChild !== 1 && (item.dataType === 0 || item.dataType === 1), //当叶子节点为对象或数组时禁用
          path: item.path,
        }));
        resolve(nodes);
      } else {
        resolve([]);
      }
    },
  });

  const rules: FormRules = {
    orgId: [
      {
        required: true,
        message: '请选择所属系统',
      },
    ],
    sourceId: [
      {
        required: true,
        message: '请选择数据源',
      },
    ],
    name: [
      {
        required: true,
        message: '请填写要素名称',
      },
      {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
        message: '要素名称仅支持汉字、字母及数字',
      },
      {
        min: 0,
        max: 50,
        message: '要素名称不能超过50个字符',
      },
    ],
    elementType: [
      {
        required: true,
        message: '请选择要素类型',
      },
    ],
    valueType: [
      {
        required: true,
      },
    ],
    fixedValue: [
      {
        required: true,
        message: '请填写要素值',
      },
    ],
    source: [
      {
        required: true,
        message: '请绑定数据源',
      },
    ],
    height: [
      {
        required: true,
        message: '请填写最小尺寸',
      },
      {
        pattern: /^[0-9]*$/,
        message: '仅支持填写数字',
      },
    ],
    width: [
      {
        required: true,
        message: '请填写最小尺寸',
      },
      {
        pattern: /^[0-9]*$/,
        message: '仅支持填写数字',
      },
    ],
    fontSize: [
      {
        required: true,
        message: '请填写最小字号要求',
      },
      {
        pattern: /^[0-9]*$/,
        message: '仅支持填写数字',
      },
    ],
    remark: [
      {
        min: 0,
        max: 50,
        message: '备注不能超过50个字符',
      },
    ],
    required: [
      {
        required: true,
        message: '请选择是否为必填要素',
      },
    ],
  };

  const uploadImage = async (params: any) => {
    const { file } = params;
    const data = new FormData();
    data.append('file', file);
    const response = await requestV1.uploadImage({ data });
    form.fixedValue = response.data.path;
  };

  // 超出上传文件限制
  const handleExceed = () => {
    ElMessage.warning('只能同时上传一张图片');
  };

  const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        let sourceId = null;
        let propertyId = null;
        let propertyPath = '';
        const valueTypeMap: ValueTypeMap = {
          0: () => {
            sourceId = form.source[0];
            form.source.length > 1
              ? (propertyId = form.source[form.source.length - 1])
              : (propertyId = null);
            propertyPath = cascaderRef.value.getCheckedNodes(true)[0].data.path;
            form.fixedValue = '';
          },
          1: () => {
            sourceId = null;
            propertyId = null;
            propertyPath = '';
          },
        };
        form.elementType !== 'text' && form.elementType !== 'image' && (form.valueType = 0);
        valueTypeMap[form.valueType] && valueTypeMap[form.valueType]();
        // 如果不是文本并且 不是水印那么 忽略fontSize的值 虽然不知道为什么
        if (!(form.elementType === 'text' || form.elementType === 'water')) {
          form.fontSize = '';
        }
        const {
          orgId,
          name,
          elementType,
          width,
          height,
          fontSize,
          remark,
          fixedValue,
          valueType,
          required,
        } = form;
        const data = {
          orgId,
          sourceId,
          propertyId,
          propertyPath,
          name,
          elementType,
          width,
          height,
          fontSize,
          remark,
          fixedValue,
          valueType,
          required,
        };
        requestV1.elementCreate({ data }).then((res) => {
          ElMessage.success('创建成功');
          resetForm(formEl, true);
        });
      } else {
        return false;
      }
    });
  };

  onMounted(() => {
    getSourceList(form.orgId);
  });

  const handleBusinessChange = (val: string) => {
    state.cascaderOptions = [];
  };

  // 关闭重置表单
  const resetForm = (formEl: FormInstance | undefined, refresh = false) => {
    emit('closed', refresh);
    nextTick(() => {
      if (!formEl) return;
      formEl.resetFields();
      state.cascaderOptions = [];
    });
  };
</script>

<style lang="less" scoped>
  .new-element-dialog {
    :deep(.el-dialog__body) {
      max-height: 600px;
      overflow-y: auto;
    }
    .connected-icon {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }
    .upload {
      .el-upload__tip {
        margin-left: 10px;
      }
    }
  }
</style>
