<template>
  <div class="new-template-dialog">
    <el-dialog
      v-model="props.dialogFormVisible"
      @closed="resetForm(templateFormRef, false)"
      width="600px"
      center
      title="新建全自定义模板"
      :close-on-click-modal="false"
    >
      <el-form
        class="dialog-form"
        ref="templateFormRef"
        :model="form"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <el-form-item label="模板编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入模板唯一编码" />
        </el-form-item>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
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
        <el-form-item label="承运商" prop="deliveryCode">
          <el-select v-model="form.deliveryCode" placeholder="请选择承运商类型" style="width: 100%">
            <el-option
              v-for="item in props.deliveryCodeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否含自定义区" prop="hasCustom">
          <el-select
            v-model="form.hasCustom"
            placeholder="请选择是否含自定义区"
            style="width: 100%"
          >
            <el-option
              v-for="item in state.hasCustomOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="耗材尺寸" prop="width">
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
        <el-form-item label="备注" prop="des">
          <el-input v-model="form.des" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSave(templateFormRef)">确定</el-button>
          <el-button @click="resetForm(templateFormRef, false)">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits } from 'vue';
  import { clone } from 'lodash';
  import { ElMessage } from 'element-plus';
  import { nextTick, PropType, watch } from 'vue';
  import { requestV1 } from '@/axios/request';
  import type { FormRules } from 'element-plus';
  import { SystemData } from '../../../types/apis/systemData';
  import type { openTemplateData } from '../../../types/apis/openTemplateData';
  import type { ElForm } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';
  import selectListMixins from '../../../mixins/selectList';
  import { Session } from '../../../utils/session';
  import { SourceData } from '../../../types/apis/sourceData';

  // props
  const props = defineProps({
    dialogFormVisible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    specifIdOptions: {
      type: Array as PropType<openTemplateData.Instance[]>,
      required: true,
    },
    deliveryCodeOptions: {
      type: Array as PropType<openTemplateData.Instance[]>,
      required: true,
    },
  });
  // emits
  const emit = defineEmits(['closed']);

  type FormInstance = InstanceType<typeof ElForm>;
  const templateFormRef = ref<FormInstance>();
  const formLabelWidth = '130px';
  const form = reactive({
    code: '',
    orgId: Session.getOrgId(),
    name: '',
    sourceId: '',
    deliveryCode: '',
    des: '',
    hasCustom: '',
    specifId: '',
    width: '',
    height: '',
  });
  const state = reactive({
    hasCustomOptionList: [
      {
        value: 0,
        label: '否',
      },
      {
        value: 1,
        label: '是',
      },
    ],
    sourceOptions: [] as SourceData.Instance[],
  });

  const { getSourceList } = selectListMixins(state);

  const rules: FormRules = {
    code: [
      {
        required: true,
        message: '请填写模板编码',
      },
      {
        pattern: /^[0-9a-zA-Z]*$/,
        message: '模板编码仅支持英文字母及数字',
      },
      {
        min: 0,
        max: 50,
        message: '模板编码不能超过50个字符',
      },
    ],
    name: [
      {
        required: true,
        message: '请填写模板名称',
      },
      // {
      //   pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
      //   message: "模板名称只支持汉字、字母及数字"
      // },
      {
        min: 2,
        max: 50,
        message: '模板名称不能超过50个字符',
      },
    ],
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
    // deliveryCode: [
    //   {
    //     required: true,
    //     message: '请选择承运商类型',
    //   }
    // ],
    // specifId: [
    //   {
    //     required: true,
    //     message: '请选择面单样式',
    //   }
    // ],
    hasCustom: [
      {
        required: true,
        message: '请选择是否含自定义区',
      },
    ],
    height: [
      {
        required: true,
        message: '高度',
      },
      {
        pattern: /^[0-9]*$/,
        message: '请填写数字',
      },
    ],
    width: [
      {
        required: true,
        message: '宽度',
      },
      {
        pattern: /^[0-9]*$/,
        message: '请填写数字',
      },
    ],
    des: [
      {
        min: 0,
        max: 50,
        message: '备注不能超过50字符',
      },
    ],
  };

  watch(
    () => props.dialogFormVisible,
    () => {
      // 选择所属系统变更，则清空绑定数据源
      getSourceList(Session.getOrgId());
    },
  );

  const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        const data = clone(form);
        const replacements = { id: form.orgId };
        requestV1.openTemplateCreate({ data, replacements }).then((res) => {
          ElMessage.success('创建成功');
          resetForm(formEl, true);
        });
      } else {
        return false;
      }
    });
  };

  // 关闭重置表单
  const resetForm = (formEl: FormInstance | undefined, refresh = false) => {
    emit('closed', refresh);
    nextTick(() => {
      if (!formEl) return;
      formEl.resetFields();
    });
  };
</script>

<style lang="less" scoped>
  .new-template-dialog {
    :deep(.el-dialog__body) {
      max-height: 600px;
      overflow-y: auto;
    }
    .connected-icon {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }
  }
</style>
