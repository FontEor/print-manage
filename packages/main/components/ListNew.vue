<template>
  <SearchForm v-if="props.hasSearch">
    <template #default>
      <slot name="form"></slot>
    </template>
    <template #search>
      <el-button @click.stop="onReset">重置</el-button>
      <el-button type="primary" @click.stop="onSearch">查询</el-button>
    </template>
  </SearchForm>
  <div class="template-list-content">
    <slot name="notification"></slot>
    <slot name="action"></slot>
    <div class="table-content">
      <el-table
        :data="state.list"
        header-row-class-name="template-list-table-header"
        height="100%"
        style="width: 100%"
        :row-key="props.isTree ? 'id' : undefined"
        :default-expand-all="props.isTree"
      >
        <slot name="column"></slot>
      </el-table>
    </div>
    <el-pagination
      v-model:current-page="pager.from"
      v-model:page-size="pager.size"
      :page-sizes="[20, 50, 100, 200]"
      :total="pager.total"
      background
      class="pagination"
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ComponentPublicInstance, onMounted, PropType, reactive, ref } from 'vue';
  import { AxiosRequestConfig } from 'axios';
  import { ResponsePageData } from '@/types/response';
  import { ElForm } from 'element-plus';
  import SearchForm from '@/components/AdjustmentSearchForm.vue';

  const props = defineProps({
    requestFn: {
      type: Function as PropType<Function>,
      default: () => {},
    },
    query: {
      type: Object as PropType<AxiosRequestConfig & { replacements?: object }>,
      default: () => ({}),
    },
    pagePosition: {
      type: String as PropType<'params' | 'data'>,
      default: 'params',
    },
    isTree: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    hasSearch: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  });
  const state = reactive({
    list: [] as unknown[],
  });

  const pager = reactive({
    from: 1,
    size: 20,
    total: 0,
    loading: false,
  });

  const emits = defineEmits(['select-change', 'resetQuery', 'refresh']);

  const getList = () => {
    pager.loading = true;
    state.list = [];
    const options = Object.assign(
      {
        params: {},
        data: {},
        replacements: {},
      },
      props.query,
    );
    switch (props.pagePosition) {
      case 'data':
        options.data.from = pager.from;
        options.data.size = pager.size;
        break;
      case 'params':
        options.params.from = pager.from;
        options.params.size = pager.size;
        break;
    }
    props
      .requestFn(options)
      .then((response: ResponsePageData<any>) => {
        if (options.params.isPage == 0) {
          //@ts-ignore
          response.total = null; // 后台不按照之前的规范走了，这里先这样处理
        }
        pager.total = response.total;
        state.list = response.data;
        pager.loading = false;
      })
      .catch(() => {
        pager.loading = false;
      });
  };

  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();

  const onSearch = () => {
    pager.from = 1;
    getList();
  };

  const onReset = () => {
    pager.from = 1;
    if (formRef.value) {
      formRef.value.resetFields();
    }
    emits('resetQuery');
    getList();
  };

  const onSizeChange = (size: number) => {
    pager.size = size;
    pager.from = 1;
    pager.total = 0;
    getList();
  };

  const onCurrentChange = (index: number) => {
    pager.from = index;
    getList();
  };

  onMounted(() => {
    getList();
  });

  // defineSlots<{
  //   form: () => JSX.Element;
  //   column: () => JSX.Element;
  // }>();

  defineExpose({
    onSearch,
    onReset,
    getList,
  });
</script>
