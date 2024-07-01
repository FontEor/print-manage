<template>
  <div class="standard-management-choose list-container">
    <el-form class="list-search" ref="form" :inline="true" :model="query">
      <el-form-item>
        <el-select
          clearable
          v-model="query.params.deliveryCode"
          class="m-2"
          placeholder="选择承运商"
        >
          <el-option
            v-for="item in state.deliveryCodeOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.params.sourceId" placeholder="选择数据源" clearable>
          <el-option
            v-for="source in state.sourceOptions"
            :key="source.id"
            :label="source.name"
            :value="`${source.id}`"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
    </el-form>
    <div class="standard-management-choose-card-container">
      <el-card
        v-for="item in state.standardList"
        :key="item.id"
        class="standard-management-choose-card"
        :body-style="{ padding: '0px' }"
      >
        <el-image
          :src="item.coverImage ? state.urlPrefix + item.coverImage : ''"
          fit="cover"
          :preview-src-list="[state.urlPrefix + item.coverImage]"
          :initial-index="1"
        />
        <div style="padding: 14px">
          <h4>{{ item.name }}-{{ item.width }}mmx{{ item.height }}mm</h4>
          <div class="standard-management-choose-card-bottom">
            <el-button
              link
              type="primary"
              v-show="item.hasCustom === 0"
              @click="onUse(item)"
              class="button"
              >确认选用</el-button
            >
            <el-button
              link
              type="primary"
              v-show="item.hasCustom === 1"
              @click="onDrawCustom(item)"
              class="button"
              >确认选用</el-button
            >
          </div>
        </div>
      </el-card>
    </div>
    <CreateCustomDialog
      :data="state.currentTemplate"
      :visible="state.showCreate"
      @close="onClosed"
    />
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { onMounted, PropType, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import CreateCustomDialog from './createCustom.vue';
  import selectListMixins from '../../mixins/selectList';
  import { openTemplateData } from '../../types/apis/openTemplateData';
  import { SystemData } from '../../types/apis/systemData';
  import { Standard } from '../../types/apis/standard';
  import { ElMessage } from 'element-plus';
  import { TemplateImages } from '../../types/apis/template';
  import { requestV1 } from '@/axios/request';
  import { Store } from 'vuex';
  import { useStore } from '../../store';
  import RootStateTypes from '../../types/store';
  const route = useRoute();

  const emits = defineEmits(['closed']);
  const props = defineProps({});
  const store: Store<RootStateTypes> = useStore();

  // 查询条件数据
  const query: TemplateImages.ListQueryAxios = reactive({
    params: {
      orgId: Session.getOrgId(),
      sourceId: '',
      codeOrName: '', // 名称或编码
      deliveryCode: '', // 承运商编码
      hasCustom: route.query.hasCustom as string, // 是否包含自定义区
      id: undefined, // 系统ID
      isIssUed: 1, // 是否发布
      isPage: 0, // 是否分页
      needImage: undefined, // 是否需要查询coverImage
      specifId: undefined,
    },
  });

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    showCreate: false,
    standardList: [] as openTemplateData.Instance[],
    currentTemplate: undefined as undefined | TemplateImages.Instance,
    sourceOptions: [] as SourceData.Instance[], // 数据源
  });

  const { getSourceList, getDeliveryList, getStandardList } = selectListMixins(state);

  onMounted(() => {
    getSourceList();
    getDeliveryList();
    getStandardList(query);
  });

  const onClosed = () => {
    state.showCreate = false;
    state.currentTemplate = undefined;
  };

  const onSearch = () => {
    getStandardList(query);
  };

  const onUse = (item: openTemplateData.Instance, justBind = 0) => {
    if (item) {
      requestV1
        .userTemplateCreate({
          replacements: {
            orgId: Session.getOrgId(),
          },
          data: {
            sourceId: item.sourceId,
            createUser: item.createUser,
            customTempCode: undefined,
            customTempName: undefined,
            deliveryCode: item.deliveryCode,
            specifId: item.specifId,
            des: undefined,
            hasCustom: item.hasCustom,
            height: item.height,
            isPage: undefined,
            tempCode: item.code,
            tempId: item.id,
            width: item.width,
            // 是否仅绑定
            justBind: justBind,
          },
        })
        .then(() => {
          ElMessage.success('绑定成功');
        });
    } else {
      ElMessage.error('请选择系统');
    }
  };

  const onDrawCustom = (item: openTemplateData.Instance) => {
    // 如果跳过创建流程那么
    if (route.query.skipCreate === '1') {
      return onUse(item, +route.query.skipCreate);
    }
    if (item) {
      const data = cloneDeep(item);
      data.orgId = +Session.getOrgId();
      state.currentTemplate = item;
      state.showCreate = true;
    } else {
      ElMessage.error('请选择系统');
    }
  };
</script>
<script lang="ts">
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
  import { ComponentPublicInstance } from 'vue';
  import { Business } from '../../types/apis/business';
  import { Session } from '../../utils/session';
  import { cloneDeep } from 'lodash';
  import { SourceData } from '../../types/apis/sourceData';
  export default {
    name: 'ChooseStandard',
    beforeRouteEnter(
      to: RouteLocationNormalized,
      form: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
      console.log('######## to', to);
      next();
    },
  };
</script>
