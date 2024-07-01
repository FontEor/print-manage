<template>
  <el-dialog
    width="530px"
    custom-class="express-create-dialog source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    center
    :title="state.title"
    :close-on-click-modal="false"
  >
    <el-form
      class="disabled-form"
      :inline="true"
      ref="form"
      :model="state.form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="承运商编码" prop="data.code">
        <el-input
          placeholder="请输入承运商唯一编码"
          v-model="state.form.data.code"
          :disabled="props.action !== 'create'"
        />
      </el-form-item>
      <el-form-item label="承运商名称" prop="data.name">
        <el-input placeholder="请输入承运商名称" v-model="state.form.data.name" />
      </el-form-item>
      <el-form-item label="承运商ID号码" prop="data.deliveryNum">
        <el-input
          placeholder="请输入承运商ID号码"
          v-model="state.form.data.deliveryNum"
          :disabled="props.action !== 'create'"
        />
      </el-form-item>
      <el-form-item label="承运商Logo" prop="data.logoPath">
        <UploadImage v-model="state.form.data.logoPath" />
        <span class="form-item-toast">支持JPG、JPEG、PNG格式，图片大小不超过5MB。</span>
      </el-form-item>
      <el-form-item label="备注" prop="data.remark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="可填写承运商描述或用途，以便其他用户快速了解"
          v-model="state.form.data.remark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, onMounted } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import type { FormRules } from 'element-plus';
  import { requestV1 } from '@/axios/request';
  import UploadImage from '../../components/upload/Image.vue';

  import { getSystem } from '../../mixins/system';
  import { EN_NUM, CN_EN, NUM } from '../../const/regexp';
  import { Express } from '../../types/apis/express';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.code': [
      {
        required: true,
        message: '请输入承运商编码',
      },
      {
        pattern: EN_NUM,
        message: '请输入3-10位英文字母或数字',
      },
      {
        min: 2,
        max: 10,
        message: '请输入3-10位英文字母或数字',
      },
    ],
    'data.name': [
      {
        required: true,
        message: '请输入承运商名称',
      },
      {
        pattern: CN_EN,
        message: '请输入3到10位字母或汉字',
      },
      {
        min: 3,
        max: 10,
        message: '请输入3到10位字母或汉字',
      },
    ],
    'data.deliveryNum': [
      {
        required: true,
        message: '请输入承运商ID',
      },
      {
        pattern: NUM,
        message: '请输入3-10位阿拉伯数据数字',
      },
      {
        min: 3,
        max: 10,
        message: '请输入3-10位阿拉伯数据数字',
      },
    ],
    'data.logoPath': [
      {
        required: true,
        message: '请上传承运商Logo',
      },
    ],
    'data.remark': [
      {
        min: 0,
        max: 100,
        message: '不得超过100个字符',
      },
    ],
  };

  const formData = (data?: Express.Instance): Express.CreateAxios => {
    if (data) {
      return {
        data: {
          id: data.id,
          code: data.code,
          name: data.name,
          remark: data.remark,
          logoPath: data.logoPath,
          deliveryNum: data.deliveryNum,
        },
      };
    }
    return {
      data: {
        code: '',
        name: '',
        remark: '',
        logoPath: '',
        deliveryNum: '',
      },
    };
  };

  const state = reactive({
    visible: true,
    form: formData(),
    title: '',
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    action: {
      type: String as PropType<string>,
      default: 'create',
    },
    data: {
      type: Object as PropType<Express.Instance>,
    },
  });

  const emits = defineEmits(['closed']);

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        switch (props.action) {
          case 'create':
            state.title = '新建承运商';
            break;
          case 'edit':
            state.title = '编辑承运商';
            state.form = formData(props.data);
            break;
          case 'info':
            state.title = '查看承运商';
            state.form = formData(props.data);
            break;
          default:
            break;
        }
      }
    },
  );

  const onClosed = ({ refresh }: { refresh: boolean } = { refresh: false }) => {
    state.form = formData();
    nextTick(() => {
      form.value?.clearValidate();
    });
    emits('closed', {
      refresh,
    });
  };

  const onConfirm = () => {
    form.value?.validate().then(() => {
      const data = clone(state.form);
      if (data.data.id) {
        requestV1.expressUpdate(data).then(() => {
          ElMessage.success('保存成功');
          onClosed({ refresh: true });
        });
      } else {
        requestV1.expressCreate(data).then(() => {
          ElMessage.success('创建成功');
          onClosed({ refresh: true });
        });
      }
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CreateDialog',
  };
</script>
