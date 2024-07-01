<template>
  <el-form
    class="isv-form"
    :inline="true"
    ref="formRef"
    :model="state.form"
    :rules="state.rules"
    label-width="120px"
  >
    <div class="modle-wrap">
      <h4 class="title">1、应用信息</h4>
      <el-form-item class="item-wrap item" label="对接平台：" label-width="92px">
        <el-radio-group v-model="state.form.platformType" :disabled="true">
          <el-radio :label="0">JOS平台</el-radio>
          <el-radio :label="1">京东物流开放平台</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="item-wrap item" label="AppKey：" label-width="92px">
        <span>{{ state.form.appKey }}</span>
      </el-form-item>
    </div>
    <div class="modle-wrap">
      <h4 class="title">2、企业信息</h4>
      <div class="item-wrap item">
        <el-form-item label="企业名称：" class="form-item-left" label-width="92px">
          <span>{{ state.form.companyName }}</span>
        </el-form-item>
        <el-form-item label="企业社会信用代码：" label-width="92px">
          <span>{{ state.form.companyCode }}</span>
        </el-form-item>
      </div>
      <div class="item-wrap item">
        <el-form-item label="研发联系人：" class="form-item-left" label-width="92px">
          <span>{{ state.form.companyContact }}</span>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="92px">
          <span>{{ state.form.companyNumber }}</span>
        </el-form-item>
      </div>
      <div class="item-wrap item">
        <el-form-item label="联系邮箱：" label-width="92px">
          <span>{{ state.form.companyMail }}</span>
        </el-form-item>
      </div>
    </div>
    <div class="modle-wrap">
      <h4 class="title">3、产品信息</h4>
      <el-form-item class="item-wrap item" label="产品名称：" label-width="92px">
        <span>{{ state.form.productName }}</span>
      </el-form-item>
      <el-form-item class="item-wrap item" label="产品提供打印服务的方式：" label-width="92px">
        <el-radio-group v-model="state.form.hasCustomArea" :disabled="true">
          <el-radio :label="0">仅支持使用标准模板</el-radio>
          <el-radio :label="1">支持使用自定义区域</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item label="审核意见" label-width="92px" prop="auditMind">
      <el-input
        :disabled="+state.form.status === 1 || +state.form.status === 2"
        v-model="state.form.auditMind"
        placeholder="请输入至少10字的审核意见，明确告诉客户审核不通过的原因"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { PropType, watch } from 'vue';

  import { requestV1 } from '@/axios/request';
  import { WhiteList } from '@/types/apis/examine';

  const formData = (): WhiteList.Instance => {
    return {
      pinType: 0,
      companyCode: '',
      companyName: '',
      sysName: '',
      appKey: '',
      updateTime: '',
      status: 0,
      auditTime: '',
      applyUser: '',
      applyTime: '',
      platformType: 0, // 0：JOS平台 1：京东物流开放平台
      productName: '',
      hasCustomArea: 0,
      companyContact: '',
      companyNumber: '',
      companyMail: '',
      id: 0,
      auditMind: '',
    };
  };
  const state = reactive({
    form: formData(),
    rules: {
      auditMind: [
        {
          required: true,
          trigger: 'blur',
          message: '审核不通过时审核意见不能为空',
        },
        {
          min: 10,
          trigger: 'blur',
          message: '审核意见至少10个字',
        },
      ],
    },
  });

  const props = defineProps({
    row: {
      type: Object as PropType<WhiteList.Instance>,
      default: () => ({}),
    },
  });
  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();
  const getFormInfo = async () => {
    console.log('获取isv详情');
    const { appKey, id } = props.row;
    try {
      const { code, data, message } = await requestV1.whiteListsQueryIsvReview({
        params: { appKey, id },
      });
      if (code === 200) {
        state.form = data;
      } else {
        ElMessage({
          type: 'error',
          message: message,
        });
      }
    } catch (err) {
      ElMessage({
        type: 'error',
        message: '失败',
      });
    }
  };
  const validateRejectRule = async () => {
    return new Promise((res) => {
      formRef.value?.validate((valid: boolean) => {
        console.log('valid', valid);
        res(valid);
      });
    });
  };
  getFormInfo();
  watch(
    () => props.row.id,
    () => {
      getFormInfo();
    },
  );
  const resetFieldsFn = () => {
    formRef.value?.resetFields();
  };
  defineExpose({
    validateRejectRule,
    form: () => state.form,
    resetFieldsFn,
  });
</script>
