<template>
  <div class="standard-management-choose list-container p-20">
    <el-form class="list-search" ref="form" :inline="true" :model="query">
      <el-form-item>
        <el-select
          clearable
          v-model="query.params.hasCustom"
          class="m-2"
          placeholder="是否含自定义区"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.params.codeOrName" placeholder="输入模板编码查询" />
      </el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button type="primary" @click="onDrawTemplate">绘制自定义模板</el-button>
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
        <div class="bc-fa p-14">
          <h4>{{ item.name }}-{{ item.width }}mmx{{ item.height }}mm</h4>
          <div class="standard-management-choose-card-bottom">
            <div></div>
            <el-button
              type="primary"
              v-show="item.hasCustom === 0"
              @click="onUse(item)"
              class="button"
              >确认选用</el-button
            >
            <el-button
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
    <ChooseJWMSConfirm
      :data="state.currentTemplate"
      :visible="state.showToast"
      @close="onConfirmClosed"
    />
  </div>
</template>

<script setup lang="ts">
  import { reactive, UnwrapNestedRefs } from 'vue';
  import { onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import qs from 'qs';
  // 组件部分
  import CreateCustomDialog from './createCustom.vue';
  import ChooseJWMSConfirm from './ChooseJWMSConfirm.vue';
  // import CreateTemplateDialog from "@/views/templateManagement/openTemplate/createTemplateDialog.vue"
  // 类型部分
  import { openTemplateData } from '../../types/apis/openTemplateData';
  import { SystemData } from '../../types/apis/systemData';
  import { TemplateImages } from '../../types/apis/template';
  // 工具部分
  import selectListMixins from '../../mixins/selectList';
  import { requestV1 } from '@/axios/request';
  import broadcastMessage, { BroadcastMessage } from '../../utils/broadcast/message';
  import { get } from 'lodash';
  import { useRoute } from 'vue-router';
  import { SourceData } from '../../types/apis/sourceData';

  const route = useRoute();

  // 查询条件数据
  const query: UnwrapNestedRefs<TemplateImages.ListQueryAxios> = reactive({
    params: {
      orgId: get(route, 'query.orgId', '') as string,
      sourceId: get(route, 'query.sourceId', '') as string, // 数据源
      codeOrName: '', // 名称或编码
      deliveryCode: get(route, 'query.deliveryCode', '') as string, // 承运商编码
      hasCustom: undefined, // 是否包含自定义区
      id: undefined, // 系统ID
      isIssUed: 1, // 是否发布
      isPage: 0, // 是否分页
      needImage: undefined, // 是否需要查询coverImage
      specifId: undefined,
    },
  });

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    orgOptions: [] as SystemData.Instance[], //系统类型
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    showCreate: false,
    showCreateTemplate: false,
    showToast: false,
    standardList: [] as openTemplateData.Instance[],
    currentTemplate: undefined as undefined | TemplateImages.Instance,
    sourceOptions: [] as SourceData.Instance[],
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

  const onConfirmClosed = () => {
    state.showToast = false;
    state.currentTemplate = undefined;
  };

  // const onTemplateClosed = () => {
  //   state.showCreateTemplate = false
  //   state.currentTemplate = undefined;
  // }

  const onSearch = () => {
    getStandardList(query);
  };

  const onUse = (item: openTemplateData.Instance) => {
    const orgId = (route.query.orgId || '') as string;
    if (orgId) {
      state.currentTemplate = item;
      requestV1
        .userTemplateCreate({
          replacements: {
            orgId: orgId,
            // orgId: `${item.orgId}`
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
          },
        })
        .then(() => {
          state.showToast = true;
        });
    } else {
      ElMessage.error('系统参数错误，请检查跳转逻辑');
    }
  };

  const onDrawCustom = (item: openTemplateData.Instance) => {
    const ordId = get(route, 'query.orgId') as string;
    const sourceId = get(route, 'query.sourceId') as string;
    const deliveryCode = item.deliveryCode;
    requestV1
      .jwmsCreateCustom({
        replacements: {
          orgId: ordId,
        },
        data: {
          sourceId: sourceId,
          deliveryCode: deliveryCode,
          orgId: ordId,
          tempId: item.id,
        },
      })
      .then((response) => {
        const code = response.data.code;
        const id = response.data.id;
        const tempId = response.data.tempId;
        informJWMS({
          templateCode: code,
          tempId: tempId,
          tempType: 2,
          customId: id,
        });
      });
  };

  const onDrawTemplate = () => {
    const ordId = get(route, 'query.orgId') as string;
    const sourceId = get(route, 'query.sourceId') as string;
    const deliveryCode = get(route, 'query.deliveryCode') as string;
    requestV1
      .jwmsCreateTemplate({
        replacements: {
          orgId: ordId,
        },
        data: {
          sourceId: sourceId,
          deliveryCode: deliveryCode,
          orgId: ordId,
        },
      })
      .then((response) => {
        const code = response.data.code;
        const id = response.data.id;
        // 创建成功
        informJWMS({
          templateCode: code,
          tempId: id,
          tempType: 1,
        });
      });
  };

  // 通知JWMS创建模板成功以及ID是啥
  const informJWMS = (data: BroadcastMessage.MessageDataT) => {
    console.log('####### informJWMS sendMessage', data);
    broadcastMessage
      .sendMessage({
        type: 'create-template',
        data,
      } as BroadcastMessage.SendMessageArgs)
      .then((response) => {
        const result = response as BroadcastMessage.MessageData<any>;
        if (result.success) {
          const query = {
            ...route.query,
            templateCode: data.templateCode,
            cid: data.customId,
            temId: data.tempId,
            tempType: data.tempType,
          };
          const queryString = qs.stringify(query);
          const url = `/editor/?${queryString}`;
          location.href = url;
        }
      });
  };
</script>
<script lang="ts">
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
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
