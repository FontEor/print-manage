<template>
  <el-dialog
    width="530px"
    custom-class="property-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="新增字段"
    center
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="字段标识" prop="data.propertyCode">
        <el-input placeholder="请输入字段标识" v-model="state.form.data.propertyCode" />
      </el-form-item>
      <el-form-item label="字段名称" prop="data.propertyName">
        <el-input placeholder="请输入字段名称" v-model="state.form.data.propertyName" />
      </el-form-item>
      <el-form-item label="字段类型" prop="data.dataType">
        <el-select v-model="state.form.data.dataType" placeholder="选择字段类型">
          <el-option
            v-for="dataType in state.dataTypes"
            :key="dataType.value"
            :label="dataType.label"
            :value="dataType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="state.form.data.dataType === 2"
        label="示例值"
        prop="data.simpData"
        :rules="[
          {
            required: true,
            message: '请输入示例值',
          },
        ]"
      >
        <el-input placeholder="请输入示例值" v-model="state.form.data.simpData" />
      </el-form-item>
      <el-form-item label="字段说明" prop="data.remark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="可填写字段用途或描述"
          v-model="state.form.data.remark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="default" @click="onClosed">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, onMounted } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType } from 'vue';
  import type { FormRules } from 'element-plus';
  import { passwordMD5 } from '../../../utils/md5';
  import { requestV1 } from '@/axios/request';
  import { AccountPostData } from '../../../types/apis/account';

  import { dataTypes } from '../../../const/enums';
  import { getSystem } from '../../../mixins/system';
  import { System } from '../../../types/apis/system';
  import { Property, SourceData } from '../../../types/apis/sourceData';
  import { CN_EN_NUM, EN_NUM } from '../../../const/regexp';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.propertyCode': [
      {
        required: true,
        message: '请输入字段标识',
      },
      {
        pattern: EN_NUM,
        message: '支持英文字符大小写及阿拉伯数字，不得超过50个字符',
      },
      {
        min: 0,
        max: 50,
        message: '不得超过50个字符',
      },
    ],
    'data.propertyName': [
      {
        required: true,
        message: '请输入字段名称',
      },
      {
        pattern: CN_EN_NUM,
        message: '支持中英文字符、阿拉伯数字，不得超过50个字符',
      },
      {
        min: 0,
        max: 50,
        message: '不得超过50个字符',
      },
    ],
    'data.dataType': [
      {
        required: true,
        message: '请选择字段类型',
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

  const formData = (): Property.CreateDataAxios => ({
    data: {
      dataType: 2,
      parentId: 0,
      propertyCode: '',
      propertyName: '',
      remark: '',
      simpData: '',
    },
    replacements: {
      id: '',
      sourceId: '',
    },
  });

  const state = reactive({
    visible: true,
    form: formData(),
    systems: [] as System.Instance[],
    dataTypes: dataTypes,
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    detail: {
      type: Object as PropType<SourceData.Instance>,
    },
    property: {
      type: Object as PropType<Property.Instance | Property.InstanceBySource>,
    },
  });

  const emits = defineEmits(['closed']);

  onMounted(() => {
    getSystem(state);
  });

  // 提取数据到query
  const pickData = () => {
    if (props.property) {
      // 子节点
      state.form.data.parentId = props.property.id;
    } else {
      // 根节点
      state.form.data.parentId = 0;
    }
    if (props.detail) {
      state.form.replacements.id = `${props.detail.orgId}`;
      state.form.replacements.sourceId = `${props.detail.id}`;
    }
  };

  const onClosed = ({ refresh } = { refresh: false }) => {
    emits('closed', {
      refresh,
    });
  };

  const onConfirm = () => {
    pickData();
    form.value?.validate().then(() => {
      const data = clone(state.form);
      requestV1.propertyCreate(data).then(() => {
        ElMessage.success('创建成功');
        state.form = formData();
        onClosed({ refresh: true });
        nextTick(() => {
          form.value?.clearValidate();
        });
      });
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CreateDialog',
  };
</script>
