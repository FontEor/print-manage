<template>
  <div class="template-list-tools">
    <div class="template-list-tools-left">
      <slot name="tool-left"></slot>
    </div>
    <div class="template-list-tools-right">
      <slot name="tool-right"></slot>
    </div>
  </div>
  <div class="template-list-content p-0">
    <div class="table-content">
      <el-table
        :data="state.list"
        header-row-class-name="template-list-table-header"
        height="100%"
        style="width: 100%"
      >
        <slot name="column"></slot>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, PropType, reactive } from 'vue';
  import { AxiosRequestConfig } from 'axios';
  import { ResponsePageData } from '@/types/response';

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
    dataCallback: {
      type: Function as PropType<(data: any) => any>,
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
        pager.total = response.total;
        if (props.dataCallback) {
          state.list = props.dataCallback(response.data);
        } else {
          state.list = response.data;
        }
        pager.loading = false;
      })
      .catch(() => {
        pager.loading = false;
      });
  };

  const onSearch = () => {
    pager.from = 1;
    getList();
  };

  onMounted(() => {
    getList();
  });

  defineExpose({
    onSearch,
    getList,
  });
</script>
