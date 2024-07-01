<template>
  <el-container ref="listContainer" class="list-container">
    <el-form class="list-search" ref="form" :inline="true" :model="query" :rules="rules">
      <slot name="search"></slot>
      <el-button type="primary" @click="onSearch" v-if="hasSearchBtn">查询</el-button>
      <el-form-item class="search-active-container">
        <!-- <el-button type="default" @click="onReset">清空</el-button> -->
        <slot name="active"></slot>
      </el-form-item>
    </el-form>
    <slot name="tools"></slot>
    <!--
      :height="tableHeight" -->
    <el-table
      ref="table"
      v-loading="loading"
      stripe
      :data="state.tableData"
      row-key="id"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <slot name="table"></slot>
    </el-table>
    <el-pagination
      ref="pagination"
      background
      layout="prev, pager, next, sizes, jumper, total"
      :current-page="state.currentPage"
      :total="state.count"
      :page-sizes="props.sizes"
      :page-size="state.page.size"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </el-container>
</template>

<script setup lang="ts">
  import { debounce } from 'lodash';
  import { ref, reactive, ComponentPublicInstance, onMounted, onUnmounted } from 'vue';
  import { AxiosRequestConfig } from 'axios';
  import type { ElForm as ElFormType } from 'element-plus';
  import type { FormRules } from 'element-plus';
  import type { PropType } from 'vue';

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
    // 参数位置
    queryPosition: {
      type: String,
      default: 'params',
    },
    rules: {
      type: Object as PropType<FormRules>,
      default: () => {},
    },
    init: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    hasSearchBtn: {
      type: Boolean,
      default: true,
    },
    // 高度偏移量
    offsetHeight: {
      type: Number,
      default: 0,
    },
    // 页码
    sizes: {
      type: Array,
      default: () => [20, 50, 100, 200],
    },
  });

  const emits = defineEmits(['select-change', 'resetQuery', 'add']);

  const state = reactive({
    tableData: [] as any[],
    page: {
      from: 1,
      size: 20,
    },
    currentPage: 1,
    count: 10,
  });

  const form = ref<ComponentPublicInstance<typeof ElFormType>>();
  const loading = ref(false);

  const onSearch = () => {
    state.page.from = 1;
    getList();
  };

  // const onReset = () => {
  //   state.page.from = 1;
  //   state.currentPage = 1;
  //   if (form.value) {
  //     form.value.resetFields();
  //   }
  //   emits('resetQuery');
  //   getList();
  // };

  const onSizeChange = (size: number) => {
    state.page.size = size;
    state.page.from = 1;
    state.currentPage = 1;
    getList();
  };

  const onCurrentChange = (index: number) => {
    state.currentPage = index;
    state.page.from = index;
    getList();
  };

  const getList = () => {
    loading.value = true;
    state.tableData = [];
    const data = Object.assign({}, props.query);
    if (props.queryPosition === 'params') {
      Object.assign(data.params, {
        ...state.page,
      });
    }
    // 不是所有情况数据都放在 params 里面 暂时处理
    else {
      Object.assign(data.data, {
        ...state.page,
      });
    }
    // 因为 request[变量]的类型推断问题没有搞定 暂时先拿到外部处理请求函数
    props
      .requestFn(data)
      .then((response: ResponsePageData<any>) => {
        state.count = response.total;
        state.tableData = response.data;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  };

  const onSelectionChange = (rows: any[]) => {
    return emits('select-change', rows);
  };

  // 自动计算表格高度
  const tableHeight = ref(0);
  const listContainer = ref<ComponentPublicInstance<HTMLDivElement>>();
  const pagination = ref<ComponentPublicInstance<HTMLDivElement>>();

  const computedTableHeight = () => {
    const $container = listContainer.value?.$el;
    const $form = form.value?.$el;
    const $pagination = pagination.value?.$el;
    const containerHeight = parseFloat(window.getComputedStyle($container).height);
    const formHeight = parseFloat(window.getComputedStyle($form).height);
    const paginationHeight = parseFloat(window.getComputedStyle($pagination).marginTop);
    tableHeight.value =
      containerHeight - (formHeight || 0) - paginationHeight - props.offsetHeight - 30;
  };

  const debounceComputedTableHeight = debounce(() => {
    computedTableHeight();
  }, 500);

  // const registerResizeEvent = (isBind = true) => {};

  onMounted(() => {
    props.init && getList();
    computedTableHeight();
    window.addEventListener('resize', debounceComputedTableHeight);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', debounceComputedTableHeight);
  });

  defineExpose({
    getList,
  });
</script>
