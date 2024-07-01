<template>
  <div class="template-manage-version_wrap">
    <div class="template-version-list_wrap">
      <p class="version-type-title">未定稿</p>
      <div class="version-card-wrap">
        <TemplateVersionCard
          v-for="item in state.unPublishedCardList"
          :key="item.version"
          :cardInfo="item"
          :activeCardInfo="state.activeCard"
          @click="handleChangeActiveCard(item)"
        >
          <template v-if="item.status === 2">
            <!-- 如果是审核中状态 -->
            <el-tooltip effect="dark" content="定稿版本正在审核中，不允许进行修改" placement="top">
              <el-link type="primary" disabled :underline="false">定稿</el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="定稿版本正在审核中，不允许进行修改" placement="top">
              <el-link type="primary" disabled :underline="false">绘制</el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="定稿版本正在审核中，不允许进行修改" placement="top">
              <el-link type="primary" disabled :underline="false">删除</el-link>
            </el-tooltip>
          </template>
          <template v-else-if="props.isOwner">
            <PublishButton :data="item" @confirm="getVersionList" type="link" />
            <el-link type="primary" @click="onDraw(item)" :underline="false">绘制</el-link>
            <DeleteButton :data="item" type="link" @confirm="getVersionList" />
          </template>
        </TemplateVersionCard>
      </div>
      <p class="version-type-title published-title">已定稿</p>
      <div class="version-card-wrap">
        <TemplateVersionCard
          v-for="item in state.publishedCardList"
          :key="item.version"
          :cardInfo="item"
          @click="handleChangeActiveCard(item)"
          :activeCardInfo="state.activeCard"
        />
      </div>
    </div>
    <div class="template-manage-version-preview_wrap">
      <VersionPreview
        :cardList="allCards"
        v-model:cardInfo="state.activeCard"
        @refresh="getVersionList"
        :isOwner="props.isOwner"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, nextTick, onMounted, PropType, reactive, watch } from 'vue';
  import TemplateVersionCard from './TemplateVersionCard.vue';
  import { VersionManage } from '@/types/apis/version-manage';
  import VersionPreview from './VersionPreview.vue';
  import { requestV2 } from '@/axios/request';
  import { Session } from '@/utils/session';
  import { TemplateNew } from '@/types/apis/template-new';
  import { Version } from '@/types/apis/version';
  import lodash from 'lodash';
  import { onBeforeRouteLeave, useRoute } from 'vue-router';
  import { onDraw } from '@/hooks/components/click-event.hook'; // onDelete
  import PublishButton from '@/modules/templates/components/PublishButton.vue';
  import DeleteButton from '@/modules/templates/components/DeleteButton.vue';
  import broadcast from '@/utils/broadcast';

  const route = useRoute();

  const props = defineProps({
    code: {
      type: String,
      required: true,
    },
    type: {
      type: Number as PropType<TemplateNew.TypeStatusKeys>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
  });
  const state = reactive({
    unPublishedCardList: [] as VersionManage.Instance[],
    publishedCardList: [] as VersionManage.Instance[],
    activeCard: {} as VersionManage.Instance,
  });

  const versionInstanceToVersionManageInstance = (
    data: Version.Instance,
  ): VersionManage.Instance => {
    const result: VersionManage.Instance = {
      status: data.status,
      id: data.id,
      templateId: data.customTempId,
      templateCode: route.query.templateCode as string,
      sourceId: data.sourceId,
      orgId: Session.getOrgId() as number,
      version: data.tempVersion,
      isDefault: Boolean(data.defaultVersion),
      time: data.updateTime,
      imgCover: data.coverImage
        ? `${import.meta.env.VITE_APP_DOWNLOAD_PRE}${data.coverImage}&ts=${Date.now()}`
        : '',
      reason: data.remark,
      published: data.status === 1,
      parentTemplateId: data.tempId,
      parentTemplateCode: data.tempCode,
      type: data.type,
      updateRecordList: [
        {
          regenerator: data.updateUser,
          updateTime: data.updateTime,
        },
        {
          regenerator: data.createUser,
          updateTime: data.createTime,
        },
      ],
    };
    // 如果是标准模板
    if (data.type === 1) {
      result.parentTemplateId = undefined;
      result.parentTemplateCode = undefined;
      result.templateId = data.tempId;
      result.templateCode = route.query.templateCode as string;
    }
    return result;
  };
  const getVersionList = () => {
    requestV2
      .versionList({
        replacements: {
          id: Session.getOrgId(),
          temId: props.id,
        },
        params: {
          tempType: props.type,
          templateCode: props.code,
          isPage: 0,
        },
      })
      .then((response) => {
        const data: Version.Instance[] = response.data || [];
        const unPublish = data.filter((item) => item.status === 0 || item.status === 2);
        const publish = data.filter((item) => item.status === 1);
        state.publishedCardList = publish.map(versionInstanceToVersionManageInstance);
        state.unPublishedCardList = unPublish.map(versionInstanceToVersionManageInstance);
        if (Object.keys(state.activeCard).length) {
          state.activeCard =
            lodash.find(
              state.unPublishedCardList,
              (item) => item.version === state.activeCard.version,
            ) ||
            lodash.find(
              state.publishedCardList,
              (item) => item.version === state.activeCard.version,
            ) ||
            ({} as VersionManage.Instance);
          return;
        }
        // 为啥要这么(activeCard computed allCards)控制？先nextTick了 问完再优化
        nextTick(() => {
          const defaultVersion = [...state.unPublishedCardList, ...state.publishedCardList].find(
            (item) => item.isDefault,
          );
          state.activeCard =
            lodash.get(state.unPublishedCardList, '[0]') ||
            defaultVersion ||
            lodash.get(state.publishedCardList, '[0]') ||
            ({} as VersionManage.Instance);
        });
      });
  };

  const handleChangeActiveCard = (cardInfo: VersionManage.Instance) => {
    state.activeCard = cardInfo;
  };

  const allCards = computed(() => {
    return state.unPublishedCardList.concat(state.publishedCardList);
  });

  // const handleDelete = (data: VersionManage.Instance) => {
  //   onDelete(data).then(() => {
  //     getVersionList();
  //   });
  // };

  watch(
    () => props.id,
    (value) => {
      console.log(' && value === oldValue', value);
      if (value) {
        getVersionList();
      }
    },
  );

  const channelMessageHandler = () => {
    getVersionList();
    state.activeCard = {} as VersionManage.Instance;
  };

  onMounted(() => {
    getVersionList();
    broadcast.addListener('refreshList', channelMessageHandler);
  });

  onBeforeRouteLeave(() => {
    broadcast.removeListener('refreshList', channelMessageHandler);
  });
</script>
