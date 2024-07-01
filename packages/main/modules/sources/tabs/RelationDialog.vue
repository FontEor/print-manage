<template>
  <el-dialog
    width="530px"
    custom-class="relation-enum-dialog source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="关联枚举项"
    center
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="">
        <el-input placeholder="输入枚举项名称或编码搜索" v-model="state.keyword" clearable>
          <template #append>
            <el-button type="primary" @click="onSearch">搜索</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="data.code">
        <el-radio-group v-model="state.form.id" class="ml-4">
          <el-radio v-for="item in state.enumsList" :label="item.id">{{
            `${item.enumName}-${item.enumCode}`
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, watch } from 'vue';
  import { ElForm } from 'element-plus';
  import { nextTick, PropType } from 'vue';
  import type { FormRules } from 'element-plus';

  import { Property } from '../../../types/apis/sourceData';
  import { EnumsManage } from '../../../types/apis/enumManage';
  import selectListMixins from '../../../mixins/selectList';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    id: [
      {
        required: true,
        message: '请选择枚举项',
      },
    ],
  };

  const state = reactive({
    visible: true,
    form: {
      id: undefined as number | undefined,
    },
    enumsList: [] as EnumsManage.Instance[],
    keyword: '',
  });

  const { getEnumsList } = selectListMixins(state);

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    data: {
      type: Object as PropType<Property.Instance | Property.InstanceBySource>,
    },
    confirmFn: {
      type: Function as PropType<
        (
          data: Property.Instance | Property.InstanceBySource,
          relation: 0 | 1,
          enumData?: EnumsManage.Instance,
        ) => void
      >,
      required: true,
    },
  });

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        getEnumsList();
      }
    },
    {
      immediate: true,
    },
  );

  watch(
    () => props.data,
    (n) => {
      if (n) {
        state.form.id = n.enumItemId;
      } else {
        state.form.id = undefined;
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['closed']);

  const onClosed = ({ refresh }: { refresh: boolean } = { refresh: false }) => {
    state.form.id = undefined;
    nextTick(() => {
      form.value?.clearValidate();
    });
    emits('closed', {
      refresh,
    });
  };

  const onConfirm = () => {
    form.value?.validate().then(() => {
      const form = state.form;
      const enumData = state.enumsList.find((item) => item.id === form.id);
      if (enumData && props.data) {
        props.confirmFn(props.data, 1, enumData);
      }
    });
  };

  const onSearch = () => {
    getEnumsList(state.keyword);
  };
</script>

<script lang="ts">
  export default {
    name: 'RelationEnumDialog',
  };
</script>
