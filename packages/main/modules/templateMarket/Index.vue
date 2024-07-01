<template>
  <div class="detail-container template-manage-wrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="breadcrumb-parent-item" to="TemplateManage"
        >模板</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ state.activeName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <div class="template-market-divider"></div>
    <div class="template-list-wrap">
      <TemplateForm
        :tagList="state.tagList"
        :typeList="state.categoryList"
        @search="handleSearch"
      />
      <div class="template-list-content template-list-content-card">
        <!-- 卡片区域 -->
        <div class="template-list-card-container" v-if="state.list.length">
          <div class="template-list-total">共{{ state.paginationInfo.total }}条记录</div>
          <div class="template-list-card">
            <template v-for="item in state.list" :key="item.id + new Date().getTime()">
              <!-- 自定义区组件 -->
              <TemplateMarketItems :data="item" @refresh-list="refreshList" />
            </template>
          </div>
        </div>

        <div v-else class="flex-center" style="flex: 1; height: 100%; display: flex">
          <EmptyTemplate :status="0" @add="state.createBlankTemplateVisible = true" />
        </div>
        <el-pagination
          v-if="state.list.length"
          v-model:current-page="state.paginationInfo.currentPage"
          v-model:page-size="state.paginationInfo.pageSize"
          :page-sizes="[20, 50, 100, 200]"
          :total="state.paginationInfo.total"
          background
          class="pagination"
          layout="prev, pager, next, sizes, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <CreateBlankTemplate
      :visible="state.createBlankTemplateVisible"
      @close="state.createBlankTemplateVisible = false"
      @open="state.createBlankTemplateVisible = true"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, UnwrapNestedRefs, onMounted } from 'vue';
  import TemplateForm from './components/SearchFrom.vue';
  import TemplateMarketItems from './components/Items.vue';
  import CreateBlankTemplate from '@/components/templates/create-blank-template/Index.vue';
  import { TemplateCategory } from '@/types/apis/template-category';
  import { TemplateMarket } from '@/types/apis/template-market';
  import selectListMixins from '../../mixins/selectList';
  import EmptyTemplate from '@/components/EmptyTemplate.vue';

  import { Session } from '@/utils/session';
  import { requestV2 } from '@/axios/request';
  export default defineComponent({
    components: { TemplateForm, TemplateMarketItems, EmptyTemplate, CreateBlankTemplate },
    setup() {
      const state = reactive({
        activeName: '模板市场',
        categoryList: [] as TemplateCategory.Instance[],
        tagList: [] as string[],
        list: [] as TemplateMarket.TemplateMarketListResponse[],
        paginationInfo: {
          pageSize: 20,
          currentPage: 1,
          total: 0,
        },
        createBlankTemplateVisible: false,
      });

      const { getCategoryList, getAllSystemTagList } = selectListMixins(state);
      onMounted(async () => {
        await getCategoryList();
        await getAllSystemTagList();
        await getList();
      });
      // 获取列表
      const getList = (searchData: UnwrapNestedRefs<TemplateMarket.TemplateMarketQuery> = {}) => {
        console.log('state.paginationInfo', state.paginationInfo);
        const params = {
          ...searchData,
          orgId: Session.getOrgId(),
          from: state.paginationInfo.currentPage, // 起始行数量
          size: state.paginationInfo.pageSize, // 单页展示数量
        };
        console.log('params', params);
        requestV2
          .templateMarketList({
            data: params,
          })
          .then((response) => {
            state.list = response.data;
            state.paginationInfo.total = response.total || 0;
          })
          .finally(() => {
            // state.list = [
            //   {
            //     id: 0,
            //     templateId: 0,
            //     orgId: 0,
            //     orgName: '系统提供方',
            //     name: '模板名称模板名称模板名称模板名称模板名称模板名称模板名称模板名称模板名称模板名称',
            //     code: 'xxxxx',
            //     coverImage:
            //       'https://ydy-download.jdl.com/common/download?sourcePath=12/1/555/1/coverImage_555_1_1.jpg',
            //     addTemplateFlag: 0,
            //     hasCustom: 0,
            //     deliveryCode: '123123',
            //     des: '使用说明',
            //     height: 70,
            //     width: 70,
            //     templateFirstCategoryCode: 'ElectronicWaybill',
            //     templateSecondCategoryCode: 'JD',
            //     templateFirstCategoryName: '电子面单',
            //     templateSecondCategoryName: '京东快递',
            //     tags: ['1', '2', '3', '123', '12'],
            //     createUser: 'ddd',
            //     updateUser: 'eee',
            //     createTime: '2023-09-01 15:36:42',
            //     updateTime: '2023-09-01 15:36:42',
            //   },
            // ];
            // state.paginationInfo.total = 0;
          });
      };

      async function handleSearch(
        searchData: UnwrapNestedRefs<TemplateMarket.TemplateMarketQuery> = {},
      ) {
        state.paginationInfo.currentPage = 1;
        await getList(searchData);
      }
      async function refreshList() {
        await getList();
        console.log('refreshList');
      }

      async function handleSizeChange(size = 20) {
        state.paginationInfo.currentPage = 1;
        state.paginationInfo.pageSize = size;
        await getList();
      }
      const handleCurrentChange = (currentPage: number) => {
        state.paginationInfo.currentPage = currentPage;
        getList();
      };

      return {
        state,
        handleSearch,
        handleSizeChange,
        handleCurrentChange,
        getList,
        refreshList,
      };
    },
  });
</script>
