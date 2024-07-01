<template>
  <div class="element-overview">
    <el-form
      class="form-element"
      ref="elementFormRef"
      :model="state.elementForm"
      :rules="state.rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="要素ID" prop="data.id">
        <span>{{ state.elementForm.data.id }}</span>
      </el-form-item>
      <el-form-item label="要素名称" prop="data.name">
        <el-input
          v-if="state.editState"
          v-model="state.elementForm.data.name"
          placeholder="请输入要素名称"
        />
        <span v-else>{{ state.elementForm.data.name }}</span>
      </el-form-item>
      <el-form-item label="要素类型" prop="data.elementType">
        <span>{{ formatElementType(state.elementForm.data.elementType) }}</span>
      </el-form-item>

      <el-form-item label="是否必填" prop="data.required">
        <span v-if="!state.editState">{{
          state.elementForm.data.required === 1 ? '必填' : '非必填'
        }}</span>
        <el-radio-group v-else v-model="state.elementForm.data.required">
          <el-radio :label="0">非必填</el-radio>
          <el-radio :label="1">必填</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="取值形式"
        prop="data.valueType"
        v-if="
          state.elementForm.data.elementType === 'text' ||
          state.elementForm.data.elementType === 'image'
        "
      >
        {{ state.elementForm.data.valueType === 0 ? '绑定数据源' : '固定值' }}
      </el-form-item>
      <el-form-item
        label="绑定数据源"
        prop="data.parentIds"
        v-if="
          state.editState &&
          !(
            state.elementForm.data.valueType === 1 &&
            (state.elementForm.data.elementType === 'text' ||
              state.elementForm.data.elementType === 'image')
          )
        "
      >
        <div v-loading="loading">
          <el-cascader
            v-if="showCascader"
            style="width: 100%"
            ref="cascaderRef"
            placeholder="选择数据源"
            v-model="state.elementForm.data.parentIds"
            :props="sourceProps"
            :options="state.cascaderOptions"
            :disabled="true"
          />
          <el-cascader
            v-else
            style="width: 100%"
            ref="cascaderRef"
            placeholder="选择数据源"
            v-model="state.elementForm.data.parentIds"
            :props="sourceProps"
            :options="state.cascaderOptions"
            :disabled="true"
          />
        </div>
      </el-form-item>

      <el-form-item v-if="state.elementForm.data.valueType === 0" label="取值（路径）">
        <span>{{ state.elementForm.data.propertyPath }}</span>
      </el-form-item>
      <el-form-item
        label="要素值"
        prop="data.fixedValue"
        v-if="
          (state.elementForm.data.elementType === 'text' ||
            state.elementForm.data.elementType === 'water') &&
          state.elementForm.data.valueType === 1
        "
      >
        <el-input
          v-if="state.editState"
          v-model="state.elementForm.data.fixedValue"
          placeholder="请输入文本内容"
        />
        <span v-else>{{ state.elementForm.data.fixedValue }}</span>
      </el-form-item>

      <el-form-item
        label="要素值"
        prop="fixedValue"
        v-if="
          state.elementForm.data.elementType === 'image' && state.elementForm.data.valueType === 1
        "
      >
        <el-upload
          v-if="state.editState"
          v-model="state.elementForm.data.fixedValue"
          class="upload"
          :http-request="uploadImage"
          multiple
          :limit="1"
          :file-list="state.fileList"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">上传图片</el-button>
          <template #tip>
            <span class="el-upload__tip">仅支持jpg/png/gif格式</span>
          </template>
        </el-upload>
        <el-image
          v-else
          style="max-width: 140px; max-height: 140px"
          :src="state.imgUrl"
          fit="contain"
        >
          <template #error>
            <div class="image-loading">图片加载中...</div>
          </template>
        </el-image>
      </el-form-item>
      <el-row v-if="state.editState">
        <el-col :span="10">
          <el-form-item label="最小尺寸" prop="data.width">
            <el-input v-model="state.elementForm.data.width" placeholder="宽度">
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
          <el-form-item label-width="0" prop="data.height">
            <el-input v-model="state.elementForm.data.height" placeholder="高度">
              <template #suffix>mm</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-else label="最小尺寸" prop="data.width">
        <span>{{
          state.elementForm.data.width + 'mm x ' + state.elementForm.data.height + 'mm'
        }}</span>
      </el-form-item>

      <el-form-item
        v-if="
          state.elementForm.data.elementType === 'text' ||
          state.elementForm.data.elementType === 'water'
        "
        label="最小字号"
        prop="data.fontSize"
      >
        <el-input
          v-if="state.editState"
          placeholder="请输入要求的最小字号"
          v-model="state.elementForm.data.fontSize"
        />
        <span v-else>{{ state.elementForm.data.fontSize }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="data.remark">
        <el-input v-if="state.editState" v-model="state.elementForm.data.remark" />
        <span v-else>{{ state.elementForm.data.remark }}</span>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" v-if="!state.editState" @click="handleEdit">编辑</el-button>
      <div v-if="state.editState">
        <el-button type="primary" @click="confrimSave(elementFormRef)">确定</el-button>
        <el-button @click="resetForm(elementFormRef)">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { PropType, watch } from 'vue';
  import { requestV1 } from '@/axios/request';
  import type { FormRules } from 'element-plus';
  import { SystemData } from '../../../../types/apis/systemData';
  import type { elementData } from '../../../../types/apis/elementData';
  import type { ElForm } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';
  import elementTypeList from '../../../../enums/element';
  import selectListMixins from '../../../../mixins/selectList';
  import { Session } from '../../../../utils/session';

  // props
  const props = defineProps({
    detail: {
      type: Object as PropType<elementData.Instance>,
    },
  });

  const emits = defineEmits(['getElementDetail']);

  interface ValueTypeMap {
    [key: number]: Function;
  }

  interface LevelMap {
    [key: number]: Function;
  }
  type FormInstance = InstanceType<typeof ElForm>;
  const elementFormRef = ref<FormInstance>();
  const formLabelWidth = '130px';
  const showCascader = ref(false);
  const loading = ref(false);
  const cascaderRef = ref();
  const formData = (): elementData.UpdateAxios => ({
    data: {
      id: '',
      orgId: Session.getOrgId(),
      sourceId: '',
      name: '',
      elementType: '',
      propertyId: '',
      propertyPath: '',
      fontSize: null,
      width: 0,
      height: 0,
      remark: '',
      valueType: 0,
      fixedValue: '',
      parentIds: [],
      required: 1,
    },
    replacements: {
      elementId: '',
    },
  });
  const rules: FormRules = {
    'data.orgId': [
      {
        required: true,
        message: '请选择所属系统',
      },
    ],
    'data.sourceId': [
      {
        required: true,
        message: '请选择数据源',
      },
    ],
    'data.name': [
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
    'data.elementType': [
      {
        required: true,
        message: '请选择要素类型',
      },
    ],
    'data.valueType': [
      {
        required: true,
      },
    ],
    'data.fixedValue': [
      {
        required: true,
        message: '请填写要素值',
      },
    ],
    'data.parentIds': [
      {
        required: true,
        message: '请绑定数据源',
      },
    ],
    'data.height': [
      {
        required: true,
        message: '请填写最小尺寸',
      },
      {
        pattern: /^[0-9]*$/,
        message: '仅支持填写数字',
      },
    ],
    'data.width': [
      {
        required: true,
        message: '请填写最小尺寸',
      },
      {
        pattern: /^[0-9]*$/,
        message: '仅支持填写数字',
      },
    ],
    'data.fontSize': [
      {
        required: true,
        message: '请填写最小字号要求',
      },
      {
        pattern: /^[0-9]*$/,
        message: '仅支持填写数字',
      },
    ],
    'data.remark': [
      {
        min: 0,
        max: 50,
        message: '备注不能超过50个字符',
      },
    ],
    'data.required': [
      {
        required: true,
        message: '请选择是否为必填要素',
      },
    ],
  };
  const state = reactive({
    elementForm: formData(),
    rules,
    editState: false,
    elementTypeOptionList: elementTypeList(),
    orgOptions: [] as SystemData.Instance[], //系统类型
    cascaderOptions: [],
    imgUrl: '',
    fileList: [{}],
    selectSourceId: '',
  });

  const { formatElementType } = selectListMixins(state);

  watch(
    () => props.detail,
    (val) => {
      if (val) {
        restoreData(val);
        val.elementType === 'image' && val.valueType && loadFile();
      } else {
        state.elementForm = formData();
      }
    },
    {
      immediate: true,
    },
  );

  // 获取图片
  const loadFile = async () => {
    const params = { sourcePath: state.elementForm.data.fixedValue };
    const response = await requestV1.loadImg({ params }).catch(() => {
      throw new Error('图片下载失败');
    });
    const blob = new Blob([response.data]);
    const imageUrl = URL.createObjectURL(blob);
    state.imgUrl = imageUrl;
  };

  onMounted(() => {});

  const restoreData = (val: elementData.Instance | undefined) => {
    if (val) {
      state.elementForm.data.id = val.id;
      state.elementForm.data.orgId = val.orgId ? `${val.orgId}` : '';
      state.elementForm.data.name = val.name;
      state.elementForm.data.elementType = val.elementType;
      state.elementForm.data.valueType = val.valueType;
      state.elementForm.data.width = val.width;
      state.elementForm.data.height = val.height;
      state.elementForm.data.fontSize = val.fontSize;
      state.elementForm.data.remark = val.remark;
      state.elementForm.data.propertyPath = val.propertyPath;
      state.elementForm.data.fixedValue = val.fixedValue;
      state.elementForm.data.parentIds = val.parentIds;
      state.elementForm.data.required = val.required;
      state.fileList = [{ name: val.fixedValue, url: val.fixedValue }];
    }
  };

  // const handleOrgChange = (val: number) => {
  //   // 选择所属系统变更，则清空绑定数据源
  //   state.cascaderOptions = [];
  //   showCascader.value = true;
  // };

  const uploadImage = async (params: any) => {
    const { file } = params;
    const data = new FormData();
    data.append('file', file);
    const response = await requestV1.uploadImage({ data });
    state.elementForm.data.fixedValue = response.data.path;
  };

  // 超出上传文件限制
  const handleExceed = () => {
    ElMessage.warning('只能同时上传一张图片');
  };

  const sourceProps = reactive({
    lazy: true,
    lazyLoad: async (node: any, resolve: any) => {
      const { level, value } = node;
      let params = {};
      if (state.elementForm.data.orgId) {
        const levelMap: LevelMap = {
          0: () => {
            params = { level, hasChild: 1, id: state.elementForm.data.orgId };
          },
          1: () => {
            params = {
              level,
              hasChild: 1,
              id: state.elementForm.data.orgId,
              sourceId: value,
              parentId: 0,
            };
            state.selectSourceId = value;
          },
        };
        level > 1
          ? (params = {
              level: 1,
              hasChild: 1,
              id: state.elementForm.data.orgId,
              sourceId: state.selectSourceId,
              parentId: value,
            })
          : levelMap[level] && levelMap[level]();
        if (
          state.elementForm.data.parentIds &&
          level === state.elementForm.data.parentIds.length - 1
        ) {
          loading.value = false;
        }
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

  // 编辑按钮
  const handleEdit = () => {
    state.editState = true;
    state.elementForm.data.valueType === 0 && (loading.value = true);
  };

  // 确认保存弹框
  const confrimSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        ElMessageBox.confirm(
          `含此要素的未发布模板可能会出现校验异常，需要手动修改模板，您确认修改吗？`,
          '修改提示',
          {
            confirmButtonText: '修改',
            cancelButtonText: '不修改',
          },
        ).then(() => {
          handleSave();
        });
      } else {
        return false;
      }
    });
  };

  // 确认按钮
  const handleSave = () => {
    let sourceId = null;
    let propertyId = null;
    let propertyPath = '';
    const valueTypeMap: ValueTypeMap = {
      0: () => {
        sourceId = state.elementForm.data.parentIds[0];
        state.elementForm.data.parentIds.length > 1
          ? (propertyId =
              state.elementForm.data.parentIds[state.elementForm.data.parentIds.length - 1])
          : (propertyId = null);
        propertyPath = cascaderRef.value.getCheckedNodes(true)[0].data.path;
        state.elementForm.data.fixedValue = '';
      },
      1: () => {
        sourceId = null;
        propertyId = null;
        propertyPath = '';
      },
    };
    state.elementForm.data.elementType !== 'text' &&
      state.elementForm.data.elementType !== 'image' &&
      (state.elementForm.data.valueType = 0);
    valueTypeMap[state.elementForm.data.valueType] &&
      valueTypeMap[state.elementForm.data.valueType]();
    // 如果不是文本并且 不是水印那么 忽略fontSize的值 虽然不知道为什么
    // 为什么二次相同业务逻辑
    if (
      !(
        state.elementForm.data.elementType === 'text' ||
        state.elementForm.data.elementType === 'water'
      )
    ) {
      state.elementForm.data.fontSize = null;
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
    } = state.elementForm.data;
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
    requestV1
      .elementUpdate({ data, replacements: { elementId: state.elementForm.data.id } })
      .then(() => {
        ElMessage.success('保存成功');
        state.editState = false;
        emits('getElementDetail');
      });
  };

  // 关闭重置表单
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    restoreData(props.detail);
    state.editState = false;
  };
</script>

<style lang="less" scoped>
  .element-overview {
    width: 520px;
    margin: 20px;
    .connected-icon {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }
    :deep(.el-form-item__content) {
      text-align: left;
    }
    .upload {
      .el-upload__tip {
        margin-left: 10px;
      }
    }
    .image-loading {
      color: #3c6ef0;
    }
  }
</style>
