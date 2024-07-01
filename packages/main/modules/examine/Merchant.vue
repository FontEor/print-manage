<template>
  <el-form
    class="merchant-form"
    :inline="true"
    ref="formRef"
    :model="state.form"
    :rules="state.rules"
    label-width="120px"
  >
    <div class="modle-wrap">
      <h4 class="title">1、签约信息</h4>
      <div class="item-wrap item">
        <el-form-item class="form-item-left" label="企业名称：" label-width="92px">
          <span>{{ state.form.companyName }}</span>
        </el-form-item>
        <el-form-item label="企业社会信用代码：" label-width="92px">
          <span>{{ state.form.companyCode }}</span>
        </el-form-item>
      </div>
      <div class="item-wrap item">
        <el-form-item class="form-item-left" label="商家编码：" label-width="92px">
          <span>{{ state.form.companyMerchantCode }}</span>
        </el-form-item>
        <el-form-item label="研发联系人：" label-width="92px">
          <span>{{ state.form.companyContact }}</span>
        </el-form-item>
      </div>
      <div class="item item-wrap">
        <el-form-item class="form-item-left" label="联系电话：" label-width="92px">
          <span>{{ state.form.companyNumber }}</span>
        </el-form-item>
        <el-form-item label="联系邮箱：" label-width="92px">
          <span>{{ state.form.companyMail }}</span>
        </el-form-item>
      </div>
    </div>
    <div class="modle-wrap">
      <h4 class="title">2、应用信息</h4>
      <el-form-item class="item" label="对接平台：" label-width="92px">
        <el-radio-group v-model="state.form.platformType" :disabled="true">
          <el-radio :label="0">JOS平台</el-radio>
          <el-radio :label="1">京东物流开放平台</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="item" label="AppKey：" label-width="92px">
        <span>{{ state.form.appKey }}</span>
      </el-form-item>
    </div>
    <div class="modle-wrap">
      <h4 class="title">3、面单信息</h4>
      <el-form-item class="item" label="样例运单号：" label-width="92px">
        <span>{{ state.form.waybillCode }}</span>
      </el-form-item>
      <div class="flex">
        <div class="img-wrap flex-2">
          <span>客户提交的面单图片</span>
          <el-image class="img img_left" fit="contain" :src="state.form.imageUrl" />
          <a class="img-link" @click="handleDownloadImg(state.form.imageUrl)">下载</a>
        </div>
        <div class="img-wrap flex-1">
          <span>系统打印的标准面单</span>
          <embed :src="state.form.generateTempUrl" type="application/pdf" class="img img_right" />
          <a class="img-link" @click="handleDownloadPdf(state.form.generateTempUrl)">下载</a>
        </div>
      </div>
    </div>
    <el-form-item label="审核意见：" prop="auditMind" label-width="92px">
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

  import { WhiteList } from '../../types/apis/examine';
  import axios from '../../axios/intercepts/cloud-print';
  const formData = (): WhiteList.MerchantInstance => {
    return {
      appKey: '',
      applyTime: '',
      applyUser: '',
      auditMind: '',
      auditTime: '',
      auditUser: '',
      companyCode: '',
      companyContact: '',
      companyMail: '',
      companyMerchantCode: '',
      companyName: '',
      companyNumber: '',
      generateTempUrl: '',
      hasCustomArea: 0,
      id: 0,
      imageUrl: '',
      pin: '',
      pinType: 1,
      platformType: 0,
      productName: '',
      scene: 1,
      status: 0,
      sysName: '',
      waybillCode: '',
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
      default: () => {},
    },
  });
  const getFormInfo = async () => {
    const { appKey, id } = props.row;
    try {
      const { code, data, message } = await requestV1.whiteListsQueryMerchantReview({
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
  getFormInfo();
  watch(
    () => props.row.id,
    () => {
      getFormInfo();
    },
  );
  const handleDownloadImg = (imgUrl: string) => {
    axios({
      url: imgUrl,
      method: 'get',
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
    }).then((response) => {
      const exit = imgUrl.split('.').at(-1);
      const blob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${imageUrl}.${exit}` || `default.${exit}`;
      a.click();
      URL.revokeObjectURL(imageUrl);
    });
  };
  const handleDownloadPdf = (pefurl: string) => {
    axios({
      url: pefurl,
      method: 'get',
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
    }).then((response) => {
      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });
      const imageUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = imageUrl + '.pdf' || 'default.pdf';
      a.click();
      URL.revokeObjectURL(imageUrl);
    });
  };
  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();
  const validateRejectRule = () => {
    return new Promise((res) => {
      formRef.value?.validate((valid: boolean) => {
        res(valid);
      });
    });
  };
  const resetFieldsFn = () => {
    formRef.value?.resetFields();
  };
  defineExpose({
    validateRejectRule,
    form: () => state.form,
    resetFieldsFn,
  });
</script>
