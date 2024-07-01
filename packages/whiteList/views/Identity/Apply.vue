<template>
  <div class="white-list-page">
    <div class="white-list-container">
      <div class="white-list-title">
        <el-badge :value="statusFilter(form.status)" :type="statusTypeFilter(form.status)">
          <span class="underline">商家白名单验证</span>
        </el-badge>
      </div>
      <TooltipVue :status="form.status" :message="form.auditMind" />
      <el-form
        ref="formRef"
        label-position="top"
        label-width="100px"
        :model="form"
        :rules="formRules"
        :disabled="state.disabled"
      >
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>签约信息</span>
            </div>
          </template>
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="form.companyName" />
          </el-form-item>
          <el-form-item label="企业社会信用代码" prop="companyCode">
            <el-input v-model="form.companyCode" />
          </el-form-item>
          <el-form-item label="商家编码" prop="companyMerchantCode">
            <el-input v-model="form.companyMerchantCode" />
          </el-form-item>
          <el-form-item label="联系人" prop="companyContact">
            <el-input v-model="form.companyContact" />
          </el-form-item>
          <el-form-item label="联系电话" prop="companyNumber">
            <el-input v-model="form.companyNumber" />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="companyMail">
            <el-input v-model="form.companyMail" />
          </el-form-item>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>应用信息</span>
            </div>
          </template>
          <el-form-item label="您是通过哪个平台对接使用京东接口的？" prop="platformType">
            <el-radio-group v-model="form.platformType" class="ml-4">
              <el-radio :label="0" size="large">JOS平台</el-radio>
              <el-radio :label="1" size="large">京东物流开放平台</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="平台给您分配的AppKey是？" prop="appKey">
            <el-input v-model="form.appKey" />
          </el-form-item>
          <el-form-item label="系统名称" prop="sysName">
            <el-input v-model="form.sysName" />
          </el-form-item>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>面单信息</span>
            </div>
          </template>
          <el-form-item label="您打印的样例面单上的运单号是？" prop="waybillCode">
            <el-input v-model="form.waybillCode" />
            <el-alert
              v-show="form.generateTempUrl"
              type="warning"
              :closable="false"
              :center="false"
            >
              <span>为了方便您检查面单是否合格，系统自动生成了标准面单，您可以</span
              ><el-link type="primary" :underline="false" @click="handleDownloadPdf"
                >点此下载</el-link
              ><span>标准面单图片，与您自行打印出来的面单做详细对比</span>
            </el-alert>
          </el-form-item>
          <el-form-item label="是否含京东物流电子面单标准元素外的自定义元素？" prop="hasCustomArea">
            <el-radio-group v-model="form.hasCustomArea" class="ml-4">
              <el-radio :label="1" size="large">是</el-radio>
              <el-radio :label="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请将面单打印出来并拍照上传" prop="imageUrl">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              accept="image/jpeg,image/png,image/jpg"
              :show-file-list="false"
              :http-request="onUpload"
              :before-upload="onBeforeUpload"
              :disabled="state.disabled"
            >
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" alt="面单" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <el-input v-model="form.imageUrl" type="hidden" />
          </el-form-item>
        </el-card>
      </el-form>
      <!-- 不是认证成功 -->
      <div v-if="form.status !== 2">
        <el-button
          v-if="!state.disabled"
          @click.prevent="onSubmit"
          class="w100p"
          type="primary"
          size="large"
          >提交认证</el-button
        >
        <div v-else-if="state.disabled">
          <el-button @click.prevent="onRecall" class="w100p" type="danger" size="large"
            >撤回&emsp;<sub>(撤回后您可重新提交信息申请认证)</sub></el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ComponentPublicInstance, onMounted, reactive, ref, UnwrapNestedRefs } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import {
    ElForm,
    ElUpload,
    UploadRawFile,
    UploadRequestOptions,
    ElMessage,
    UploadRequestHandler,
  } from 'element-plus';
  import { useRoute } from 'vue-router';
  import axios from 'axios';

  import { WhiteList } from '../../types/apis/whiteList';
  import rules from './rules';
  import formData from './form';
  import { request } from '../../axios';
  import { statusFilter, statusTypeFilter } from './filters';
  import TooltipVue from '../../components/Tooltip.vue';
  import { router } from '../../router';
  import { ValidateFieldsError } from 'async-validator';
  const route = useRoute();

  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();
  const form: UnwrapNestedRefs<WhiteList.SubmitExamine> = reactive(formData());

  // 编辑状态缓存
  const state = reactive({
    disabled: false,
  });

  const uploadRef = ref<ComponentPublicInstance<typeof ElUpload>>();

  onMounted(() => {
    const scene = useRoute().query.scene;
    form.scene = Number(scene);
  });

  const formRules = rules(form);

  const handleDownloadPdf = () => {
    axios({
      url: form.generateTempUrl,
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

  const getDetail = (id?: number) => {
    const route = useRoute();
    const routeId = route?.query.id;
    id = id || Number(routeId);
    if (!id) {
      return console.log('ID 不存在无法获取详情');
    }
    request
      .whiteExamineOuterDetail({
        params: {
          id,
        },
      })
      .then((response) => {
        const { code, message, data } = response;
        if (+code === 0) {
          ElMessage.error(message);
        } else {
          // 如果是认证中 或者是 认证失败 那么禁止
          if (data.status === 0 || data.status === 2) {
            state.disabled = true;
          }
          Object.assign(form, data);
        }
      });
  };

  const onSubmit = () => {
    formRef.value?.validate((valid: boolean, invalidFields: ValidateFieldsError) => {
      console.log(valid, invalidFields);
      if (!valid) {
        const keys = Object.keys(invalidFields);
        formRef.value?.scrollToField(keys[0]);
      } else {
        request
          .whiteBusinessSubmitExamine({
            data: form,
          })
          .then((response) => {
            const { code, data, message } = response || {};
            if (+code === 0) {
              ElMessage.error(message);
            } else {
              state.disabled = true;
              router
                .replace({
                  name: route.name as string,
                  query: {
                    id: data,
                  },
                })
                .then(() => {
                  getDetail(data);
                });
            }
          });
      }
    });
  };

  const onRecall = () => {
    if (form.id) {
      request
        .whiteBusinessRevokeExamine({
          params: {
            id: form.id,
          },
        })
        .then((response) => {
          const { code, message } = response;
          if (+code === 0) {
            ElMessage.error(message);
          } else {
            state.disabled = false;
            form.status = 4;
            ElMessage.success('撤回成功');
          }
        });
    } else {
      return console.log('数据不全，未能取得详情返回的id数据');
    }
  };

  const onBeforeUpload = (rawFile: UploadRawFile): boolean => {
    if (!/.(jpg|jpeg|png)$/.test(rawFile.type)) {
      ElMessage.error('只能上传jpg/png文件');
      return false;
    }
    if (rawFile.size > 500 * 1024) {
      ElMessage.error('图片大小不能超过500kb');
      return false;
    }
    return true;
  };

  const onUpload: UploadRequestHandler = (options: UploadRequestOptions) => {
    const formData: WhiteList.ExamineFileUpload = new FormData();
    formData.append('file', options.file);
    formData.append('appKey', form.appKey);
    formData.append('scene', `${form.scene}`);
    return request.whiteExamineFileUpload({ data: formData }).then((response) => {
      const { code, data, message } = response || {};
      uploadRef.value?.clearFiles();
      if (+code === 0) {
        ElMessage.error(message);
      } else {
        form.imageUrl = data;
        ElMessage.success('上传成功');
      }
    });
  };

  defineExpose({
    getDetail,
  });
</script>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        // @ts-ignore
        vm.getDetail(to.query.id);
        try {
          document.getElementsByTagName('main')[0].scrollTop = 0;
        } catch (e) {}
      });
    },
  });
</script>
