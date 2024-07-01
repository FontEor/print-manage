<template>
  <el-dialog
    :model-value="props.visible"
    title="编辑广告计划"
    width="550px"
    :before-close="handleClose"
    modal-class="create-template-dialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="121px"
      class="create-template-form detail-from"
    >
      <el-form-item label="计划标题" prop="title">
        <div class="detail-form-view-field">
          {{ props.data.title }}
        </div>
      </el-form-item>
      <h3 class="el-form-item--title">投放时间</h3>
      <el-form-item label="投放时间范围" prop="timeRange">
        <el-date-picker
          v-model="form.timeRange"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          date-format="YYYY-MM-DD"
          time-format="HH:mm"
          :default-time="defaultTime"
          :disabled-date="disabledDateCb"
          :clearable="false"
        />
      </el-form-item>
      <h3 class="el-form-item--title">投放范围</h3>
      <el-form-item label="打印渠道" prop="channelRange">
        <el-select
          v-model="form.channelRange"
          placeholder="请选择打印渠道"
          clearable
          filterable
          multiple
        >
          <el-option
            v-for="item in state.adChannelList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="承运商" prop="deliveryRange">
        <el-select
          class="text-left"
          v-model="form.deliveryRange"
          placeholder="请选择承运商"
          clearable
          filterable
          multiple
        >
          <el-option
            v-for="item in state.expressList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收件人地址" prop="cityRange">
        <el-cascader
          v-model="form.cityRange"
          :props="{ value: 'name', label: 'name', multiple: true }"
          :options="state.adCityList"
          filterable
          placeholder="请选择收件人一级地址、二级地址"
        />
      </el-form-item>
      <h3 class="el-form-item--title">投放内容</h3>
      <el-form-item label="图片" prop="image">
        <UploadImage v-model="form.image" :max-size="1024" />
        <span class="form-item-toast">支持JPG、JPEG、PNG格式，图片大小不超过1MB。</span>
      </el-form-item>
      <el-form-item label="二维码" prop="qrcode">
        <el-input
          type="textarea"
          :rows="3"
          v-model.trim="form.qrcode"
          placeholder="如：https://www.jd.com/"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm(formRef)">保存</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ref, watch, reactive, PropType } from 'vue';
  import type { FormInstance } from 'element-plus';
  import lodash from 'lodash';
  import UploadImage from '@/components/upload/Image.vue';
  import { requestV2 } from '@/axios/request';
  import { rules as createRules } from './rules';
  import { AdvertisingPlan } from '@/types/apis/advertising-plan';
  import { ElMessage } from 'element-plus';
  import selectListMixins from '@/mixins/selectList';
  import { Express } from '@/types/apis/express';
  import { getTodayTimestamp, millisecondToString } from '@/utils/time';
  import { defaultTime } from './other';

  const rules = lodash.omit(createRules, 'title');

  const emit = defineEmits(['close', 'success']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as PropType<AdvertisingPlan.Detail>,
      default: () => ({}) as AdvertisingPlan.Detail,
    },
  });

  const formRef = ref<FormInstance>();

  const today = getTodayTimestamp();

  const disabledDateCb = (date: string) => {
    return new Date(date).getTime() < (today);
  };

  const initForm = function (): AdvertisingPlan.UpdateData {
    const data = props.data;
    console.log('props.data', props.data);
    return {
      id: data.id,
      timeRange: [
        millisecondToString(data.startTime, 'YYYY-MM-DD HH:mm:ss'),
        millisecondToString(data.endTime, 'YYYY-MM-DD HH:mm:ss'),
      ],
      channelRange: data.channelRange || [],
      deliveryRange: data.deliveryRange || [],
      cityRange: (data.cityRange || []).map((item) => {
        return [item.province, item.city];
      }),
      image: data.image || '',
      qrcode: data.qrcode || '',
    };
  };

  const form = reactive(initForm());

  const state = reactive({
    detail: {} as AdvertisingPlan.Instance,
    adChannelList: [] as AdvertisingPlan.ChannelInstance[],
    expressList: [] as Express.Instance[],
    adCityList: [] as AdvertisingPlan.CityTree[],
  });

  const { getExpressList, getAdChannelList, getAdCityList } = selectListMixins(state);

  const handleClose = (ifResetField = true) => {
    emit('close');
    if (ifResetField) {
      formRef.value?.resetFields();
    } else {
      formRef.value?.clearValidate();
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleConfirm = (formEl: FormInstance | undefined) => {
    formEl?.validate((valid) => {
      if (valid) {
        requestV2.adUpdate({ data: form }).then(() => {
          ElMessage.success('保存成功');
          emit('success');
          handleClose();
        });
      }
    });
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (!newVal) return;
      getExpressList();
      getAdChannelList();
      getAdCityList();
      Object.assign(form, initForm());
    },
    { immediate: true },
  );
</script>
<script lang="ts">
  export default {
    name: 'UpdateAdvertisingDialog',
  };
</script>
