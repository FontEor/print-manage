<template>
  <div class="template-list-wrap">
    <List ref="listRef" :request-fn="requestFn" :query="query" @reset-query="resetQuery">
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item class="width-adjustment width-fixed" label="名称/编码" prop="codeOrName">
          <el-input
            v-model="query.params.codeOrName"
            class="list-search_item"
            placeholder="请输入名称或编码"
          />
        </el-form-item>
        <el-form-item class="width-adjustment width-fixed" label="模板分类">
          <el-cascader
            v-model="query.params.categories"
            :options="state.categoryList"
            :props="state.multiProps"
            class="list-search_item template-filterable-cascader"
            clearable
            collapse-tags
            collapse-tags-tooltip
            filterable
            placeholder="选择模板分类"
          />
        </el-form-item>
        <el-form-item class="width-adjustment width-fixed" label="尺寸">
          <SizeInput
            v-model:width="query.params.width"
            v-model:height="query.params.height"
            class="list-search_item"
          />
        </el-form-item>
        <el-form-item class="width-adjustment width-fixed" label="标签">
          <el-select
            v-model="query.params.tags"
            class="list-search_item"
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="输入模板标签"
          >
            <el-option v-for="item in state.tagList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </template>
      <template #action>
        <p class="template-list-btn">
          <el-button
            class="template-list-btn-new-template"
            type="primary"
            @click="state.createBlankTemplateVisible = true"
            >新建空白模板
          </el-button>
          <el-button class="template-list-btn-market" type="info" @click="go('/templateMarket')"
            >模板市场
          </el-button>
        </p>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="模板编码" prop="code" width="160">
          <template #default="scope">
            <span class="cursor-pointer" @click="handleCopy(scope.row.code || '')">
              <span>
                {{ scope.row.code }}
              </span>
              <i class="search-list-copy jdl-icon-document-copy cursor-pointer"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="模板名称" prop="name" width="160" />
        <el-table-column label="预览图" prop="coverImage">
          <template #default="scope">
            <div class="image_wrap">
              <el-image
                :id="`${scope.row.coverImage}${scope.row.code}`"
                :initial-index="1"
                :preview-src-list="[`${state.urlPrefix}${scope.row.coverImage}`]"
                :src="`${state.urlPrefix}${scope.row.coverImage}`"
                class="image"
                fit="contain"
                preview-teleported
              >
                <template #error>
                  <div class="image-slot">
                    <img
                      src="https://storage.jd.com/print-images/no-cover.png"
                      alt="预览图不存在"
                    />
                  </div>
                </template>
              </el-image>
              <div
                v-if="scope.row.coverImage"
                class="mask-view-mixin flex-center"
                @click="handlePreview(`${scope.row.coverImage}${scope.row.code}`)"
              >
                <el-icon>
                  <ViewIcon />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模板分类" width="220">
          <template #default="scope">
            {{ scope.row.templateFirstCategoryName }}&nbsp;/&nbsp;{{
              scope.row.templateSecondCategoryName
            }}
          </template>
        </el-table-column>
        <!--        <el-table-column label="状态" width="120">-->
        <!--          <template #default="scope">-->
        <!--            <span v-if="scope.row.status === 1" class="el-link el-link&#45;&#45;success">已发布</span>-->
        <!--            <span v-else>未发布</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="尺寸(mm)" width="120">
          <template #default="scope"> {{ scope.row.width }}*{{ scope.row.height }} </template>
        </el-table-column>
        <el-table-column label="标签" prop="tags" width="140">
          <template #default="scope">
            <FoldTag :code="scope.row.code" :tagList="scope.row.tagList || []" />
          </template>
        </el-table-column>
        <el-table-column label="模板提供方" prop="orgName" min-width="160px" />
        <el-table-column label="更新人" prop="updateUser" width="120" />
        <el-table-column label="更新时间" prop="updateTime" width="220" />
        <el-table-column fixed="right" label="操作" width="160px">
          <template #default="scope">
            <VersionButton
              :currentOrgIdByStore="currentOrgIdByStore"
              :row="scope.row"
              @switch-page="handleSwitchPage"
            />
            <template v-if="currentOrgIdByStore === scope.row.orgId">
              <CancelShareButton
                v-if="scope.row.shared"
                type="link"
                :data="scope.row"
                @refresh="handleRefreshList"
              />
              <ShareButton v-else type="link" :data="scope.row" @refresh="handleRefreshList" />
            </template>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateBlankTemplate
      :visible="state.createBlankTemplateVisible"
      @close="state.createBlankTemplateVisible = false"
      @open="state.createBlankTemplateVisible = true"
      @success="handleRefreshList"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    computed,
    onMounted,
    reactive,
    UnwrapNestedRefs,
    ref,
    ComponentPublicInstance,
  } from 'vue';
  import { View as ViewIcon } from '@element-plus/icons-vue';
  import { copyFn } from '@/hooks/copy';
  import FoldTag from '@/components/templates/FoldTag.vue';
  import CreateBlankTemplate from '@/components/templates/create-blank-template/Index.vue';
  import { requestV2 } from '@/axios/request';
  import { Session } from '@/utils/session';
  import { useGo } from '@/hooks/web/usePage';
  import { TemplateCategory } from '@/types/apis/template-category';
  import { TemplateNew } from '@/types/apis/template-new';
  import selectListMixins from '../../mixins/selectList';
  import CancelShareButton from './components/CancelShareButton.vue';
  import ShareButton from './components/ShareButton.vue';
  import VersionButton from './components/VersionButton.vue';
  import SizeInput from '@/components/templates/SizeInput.vue';
  import List from '../../components/ListNew.vue';

  import store from '@/store';
  import Qs from 'qs';

  const go = useGo();

  const currentOrgIdByStore = computed(() => store.state.currentOrgId);

  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    categoryList: [] as TemplateCategory.Instance[],
    tagList: [] as string[],
    tableData: [] as TemplateNew.Instance[],
    paginationInfo: {
      pageSize: 20,
      currentPage: 1,
      total: 0,
    },
    createBlankTemplateVisible: false,
    query: {} as TemplateNew.SearchData,
    multiProps: { multiple: true, value: 'code', label: 'name' },
  });
  const query: UnwrapNestedRefs<TemplateNew.ListWebAxios> = reactive({
    params: {
      orgId: Session.getOrgId(),
      codeOrName: '',
      categories: [],
      tags: [],
      height: undefined,
      width: undefined,
    },
  });

  const resetQuery = () => {
    query.params = {
      orgId: Session.getOrgId(),
      codeOrName: '',
      categories: [],
      tags: [],
      height: undefined,
      width: undefined,
    };
  };

  const { getCategoryList, getTempListAndRelationTemplateTagList } = selectListMixins(state);

  const requestFn = requestV2.templateList;

  const handleCopy = (text = '') => copyFn(text);
  const handlePreview = (imgUrl: string) => {
    const dom = document.getElementById(imgUrl);
    if (dom) {
      dom.click();
    }
  };
  const handleRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };

  const handleSwitchPage = (row: TemplateNew.Instance) => {
    // TODO 详情页面 为啥自己跳转回来了
    const query = {
      orgId: Session.getOrgId(),
      templateCode: row.code,
      templateId: row.id,
      templateType: row.type,
    };
    window.open(`/#/templateManageDetail?${Qs.stringify(query)}`);
  };

  onMounted(() => {
    getCategoryList();
    getTempListAndRelationTemplateTagList();
  });
</script>
