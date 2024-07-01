<template>
  <el-dialog
    width="530px"
    class="property-create-dialog left-footer-buttons"
    @closed="onClosed"
    v-model="state.visible"
    :title="props?.property?.propertyCode === undefined ? '新增字段' : '编辑字段'"
    center
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="字段名" prop="data.propertyCode">
        <el-input
          placeholder="请输入字段名"
          v-model="state.form.data.propertyCode"
          :disabled="!!props?.property?.propertyCode"
        />
      </el-form-item>
      <el-form-item label="中文名" prop="data.propertyName">
        <el-input placeholder="请输入中文名" v-model="state.form.data.propertyName" />
      </el-form-item>
      <el-form-item label="类型" prop="data.dataType">
        <el-select v-model="state.form.data.dataType" placeholder="选择类型">
          <el-option
            v-for="dataType in state.dataTypes"
            :key="dataType.value"
            :label="dataType.label"
            :value="dataType.value"
          />
        </el-select>
      </el-form-item>

      <!-- 修改枚举获取 -->
      <el-form-item v-if="state.form.data.dataType === 2" label="枚举" prop="data.enumItemId">
        <el-select v-model="state.form.data.enumItemId" placeholder="选择枚举">
          <el-option
            v-for="enmuItem in props.enmusList"
            :key="enmuItem.id"
            :label="enmuItem.enumName"
            :value="enmuItem.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="state.form.data.dataType === 2" label="示例值" prop="data.simpData">
        <el-input placeholder="请输入示例值" v-model="state.form.data.simpData" />
      </el-form-item>
      <el-form-item label="使用说明" prop="data.remark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="可填写使用说明或描述"
          v-model="state.form.data.remark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClosed">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, onMounted, watchEffect } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType } from 'vue';
  import type { FormRules } from 'element-plus';
  import { requestV2 } from '@/axios/request';
  import { SourcePropertyNew, EnmusProperty } from '@/types/apis/source-new.d';

  import { dataTypes } from '@/const/enums';
  import { getSystem } from '@/mixins/system';
  import { System } from '@/types/apis/system';
  import { Property, SourceData } from '@/types/apis/sourceData';
  import { EN_NUM } from '@/const/regexp';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.propertyCode': [
      {
        required: true,
        message: '请输入字段名',
      },
      {
        min: 1,
        max: 50,
        message: '不得超过50个字符',
      },
    ],
    'data.propertyName': [
      {
        required: true,
        message: '请输入中文名',
      },
      {
        min: 2,
        max: 50,
        message: '中文名长度应为：2-50个字符',
      },
    ],
    'data.dataType': [
      {
        required: true,
        message: '请选择类型',
      },
    ],
    'data.simpData': [
      {
        required: true,
        message: '请输入示例值',
      },
      {
        min: 1,
        max: 100,
        message: '示例值长度应为：1-100个字符',
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

  const formData = (): SourcePropertyNew.ChangeDataAxios => ({
    data: {
      id: 0,
      sourceId: 0,
      dataType: 2,
      parentId: 0,
      propertyCode: '',
      propertyName: '',
      remark: '',
      simpData: '',
      enumItemId: undefined,
    },
    replacements: {
      id: undefined,
      sourceId: '',
    },
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
      type: Object as PropType<Property.Instance>,
    },
    addProperty: {
      type: Object as PropType<SourcePropertyNew.AddProperty>,
    },
    enmusList: {
      type: Array as PropType<EnmusProperty.Instance[]>,
    },
  });

  const state = reactive({
    visible: false,
    form: formData(),
    systems: [] as System.Instance[],
    dataTypes: dataTypes,
  });

  const emits = defineEmits(['closed']);

  onMounted(() => {
    getSystem(state);
  });

  watchEffect(() => {
    state.visible = props.visible;
    // 初始化参数
    if (!props?.addProperty) {
      const {
        id = 0,
        remark,
        sourceId = 0,
        dataType = 2,
        parentId = 0,
        simpData = '',
        enumItemId,
        propertyCode = '',
        propertyName = '',
      } = props.property || {};
      // 给后端兼容 enumItemId 为0的情况
      const enumId = enumItemId || undefined;
      state.form.data = {
        id,
        remark: remark || '',
        sourceId,
        dataType,
        parentId,
        simpData,
        enumItemId: enumId,
        propertyCode,
        propertyName,
      };
    }
  });

  // 提取数据到query
  const pickData = () => {
    if (props?.addProperty) {
      // 子节点
      state.form.data.parentId = props?.addProperty.parentId as number;
    } else {
      // 根节点
      state.form.data.parentId = 0;
    }
    if (props.detail) {
      state.form.replacements.id = props.detail.orgId || undefined;
      state.form.replacements.sourceId = `${props.detail.id}`;
    }
  };

  const onClosed = ({ refresh } = { refresh: false }) => {
    state.visible = false;
    emits('closed', {
      refresh,
    });
  };

  const onConfirm = () => {
    pickData();
    form.value?.validate().then(() => {
      const data = clone(state.form);
      if (props?.addProperty) {
        requestV2.propertyCreate(data).then(() => {
          ElMessage.success('创建成功');
          state.form = formData();
          onClosed({ refresh: true });
          nextTick(() => {
            form.value?.clearValidate();
          });
        });
      } else {
        requestV2.propertyUpdate(data).then(() => {
          ElMessage.success('修改成功');
          state.form = formData();
          onClosed({ refresh: true });
          nextTick(() => {
            form.value?.clearValidate();
          });
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
