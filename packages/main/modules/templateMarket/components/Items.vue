<template>
  <LongCard
    class="template-list-card-item"
    :imgUrl="instance.coverImage"
    :templateName="instance.code"
    :templateFirstCategoryName="instance.templateFirstCategoryName"
    :templateSecondCategoryName="instance.templateSecondCategoryName"
    :tags="instance.tags || []"
    :name="instance.name"
    :size="instance.width + '*' + instance.height + 'mm'"
    :canClick="props.canClick"
    :orgName="instance.orgName"
    :hasCustom="instance.hasCustom"
    @preview="onPreview"
    @click-card="handleClickCard"
  >
    <!-- 更多信息 -->
    <template #ellipsis>
      <el-dropdown placement="bottom-start" popper-class="template-list-card-dropdown">
        <div class="el-dropdown-link">
          <div class="template-list-card-preview-more">更多信息</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="template-list-card-more-message">
            <el-dropdown-item v-if="instance.des">
              {{ instance.des }}
            </el-dropdown-item>
            <el-dropdown-item v-if="instance.createUser">
              <div class="template-list-card-content">
                <a
                  :href="`timline://chat/?topin=${instance.updateUser || instance.createUser}`"
                  class="template-list-card-link"
                >
                  <span class="link-erp">{{ instance.updateUser || instance.createUser }} </span>
                  <el-icon><ChatDotRound /></el-icon>
                </a>
                <span class="link-create-time">{{ formatData }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <!-- 右侧按钮 -->
    <template #button>
      <el-dropdown placement="bottom-start" popper-class="template-list-card-dropdown">
        <el-button plain type="primary" size="small">使用</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-tooltip
              v-if="instance.addTemplateFlag === 1"
              class="box-item"
              effect="dark"
              content="此模板已在你的模板列表中，不能重复选用"
              placement="top"
            >
              <span class="template-list-card-dropdown-disable">直接添加到列表</span>
            </el-tooltip>
            <el-dropdown-item @click="addToList" v-else>直接添加到列表</el-dropdown-item>
            <el-dropdown-item v-if="instance.hasCustom === 1" @click="state.addDetailVisible = true"
              >绘制自定义区</el-dropdown-item
            >
            <el-dropdown-item v-if="instance.type === 1" @click="editAllCustom"
              >绘制整个模板</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </LongCard>

  <SuccessDialog
    :visible="state.showSuccessDialog"
    :hasTitle="false"
    @close="state.showSuccessDialog = false"
    class="create-blank-success"
    width="460px"
  >
    <template #content>
      <!-- 自定义区 -->
      <template v-if="state.withCustomArea">
        <div class="template-market-success-message">
          <h4>创建成功！</h4>
          <p>快去绘制模板内容吧！</p>
        </div>
      </template>
      <!-- 直接添加 -->
      <template v-else>
        <div class="template-market-success-message">
          <h4>模板选用成功！</h4>
          <p
            >快去看看如何使用模板吧！
            <el-link
              :underline="false"
              type="primary"
              href="http://lcp.jdl.com/#/docSoftwareSystem/64/54776"
              target="_blank"
              >文档链接</el-link
            >
          </p>
        </div>
      </template>
    </template>
    <template #footer>
      <!-- 绘制自定义区/绘制整个模板  -->
      <template v-if="state.withCustomArea">
        <el-button @click="handleTemplate">管理模板</el-button>
        <el-button @click="handleDrawTemplate" type="primary">
          {{ state.detailWithCustom?.isAllCustom ? '绘制模板内容' : '绘制自定义区内容' }}
        </el-button>
      </template>
      <!-- 直接添加 -->
      <template v-else>
        <el-button class="mw-72" @click="state.showSuccessDialog = false" type="primary"
          >确定</el-button
        >
      </template>
    </template>
  </SuccessDialog>

  <AddCustomDetail
    v-if="state.addDetailVisible"
    :visible="state.addDetailVisible"
    @close="closeTemplateAddDetail"
    :instance="instance"
  />
  <AddAllCustomDetail
    v-if="state.editAllCustomVisible"
    :visible="state.editAllCustomVisible"
    @close="closeTemplateAddDetail"
    :instance="instance"
  />
  <Preview
    v-if="state.previewVisible"
    :visible="state.previewVisible"
    @close="state.previewVisible = false"
    @add-to-list="addToList"
    @edit-custom-list="editCustomList"
    @edit--all-custom="editAllCustom"
    :instance="instance"
    :formatData="formatData"
  />
</template>
<script lang="ts">
  import { defineComponent, PropType, reactive, computed } from 'vue';
  import LongCard from '@/components/card/Long.vue';
  import { ChatDotRound } from '@element-plus/icons-vue';
  import { requestV2 } from '@/axios/request';
  import { redirectCustomEditor, redirectTemplateEditor } from '@/hooks/web/redirect';
  import { useGo } from '@/hooks/web/usePage';
  import { formatToDate } from '@/hooks/web/dateUtil';
  import { Session } from '@/utils/session';
  import SuccessDialog from '@/components/templates/SuccessDialog.vue';
  import type { TemplateMarket } from '@/types/apis/template-market';
  import type { TemplateNew } from '@/types/apis/template-new'; // detailAllCustom
  import AddCustomDetail from './AddDetail.vue';
  import AddAllCustomDetail from './AddAllCustomDetail.vue';
  import Preview from '@/components/templates/Preview.vue';
  import { ElMessage } from 'element-plus';
  import Qs from 'qs';

  export default defineComponent({
    name: 'TemplateCard',
    components: {
      LongCard,
      ChatDotRound,
      SuccessDialog,
      AddCustomDetail,
      AddAllCustomDetail,
      Preview,
    },
    props: {
      data: {
        type: Object as PropType<TemplateMarket.TemplateMarketListResponse>,
        required: true,
      },
      canClick: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
    },
    emits: ['editEvent', 'deleteEvent', 'refresh-list'],

    // setup(props, { emit }) {
    setup(props) {
      const go = useGo();

      const state = reactive({
        addDetailVisible: false,
        editAllCustomVisible: false,
        previewVisible: false,
        previewImages: [],
        showSuccessDialog: false, // 是否显示成功弹窗
        withCustomArea: false, // 是否含有自定义区域
        detail: {} as TemplateMarket.StateDetail,
        detailWithCustom: {} as TemplateMarket.StateDetailCustom,
        editData: {} as TemplateNew.ListInstance,
      });
      const instance: TemplateMarket.TemplateMarketListResponse = reactive(props.data);
      // 格式化时间
      const formatData = computed(() => {
        let data;
        if (instance.updateTime) {
          data = formatToDate(instance.updateTime);
        } else {
          data = formatToDate(instance.createTime);
        }
        if (data) {
          data = data.replaceAll('-', '/');
        }
        return data || '';
      });

      const onPreview = () => {
        console.log('pre');
        state.previewVisible = true;
      };
      const handleClickCard = () => {};

      function addToList() {
        const params = {
          id: instance.id,
          orgId: Session.getOrgId(),
        };
        requestV2
          .templateAddToList({
            params,
          })
          .then(() => {
            state.withCustomArea = false;
            state.showSuccessDialog = true;
            state.previewVisible = false;
          });
      }

      function editCustomList() {
        // 绘制自定义区
        state.previewVisible = false;
        state.addDetailVisible = true;
        state.withCustomArea = true;
      }

      function editAllCustom() {
        // 绘制整个模板
        state.previewVisible = false;
        state.editAllCustomVisible = true;
        state.withCustomArea = true;
      }

      // 绘制自定义区内容
      function handleDrawTemplate() {
        if (state.detailWithCustom?.isAllCustom) {
          // 绘制整个模板
          redirectTemplateEditor(state.editData, state?.editData?.verId);
        } else {
          // 绘制自定义区
          redirectCustomEditor(state.detailWithCustom);
        }
      }
      function handleTemplate() {
        // 跳转 管理模板
        const query = {
          tag: 'versionManagement',
          orgId: state?.detailWithCustom?.orgId,
          templateId: state?.detailWithCustom?.id,
          templateCode: state?.detailWithCustom?.code,
          templateType: state?.detailWithCustom?.templateType,
        };
        window.open(`/#/templateManageDetail?${Qs.stringify(query)}`);
      }
      function closeTemplateAddDetail(
        isSuccess: boolean,
        customData: TemplateMarket.StateDetailCustom,
        editData: TemplateNew.ListInstance,
      ) {
        // 关闭添加到自定义区弹窗
        state.addDetailVisible = false;
        state.editAllCustomVisible = false;
        // 关闭弹窗
        if (isSuccess) {
          state.showSuccessDialog = true;
          state.withCustomArea = true;
        }
        // 当前系统跳转数据
        if (customData) {
          state.detailWithCustom = customData;
        }
        // 绘制全模板数据
        if (editData) {
          state.editData = editData;
        }
        console.log('state.addDetailVisible', state.addDetailVisible);
      }
      return {
        go,
        instance,
        formatData,
        state,
        ElMessage,
        onPreview,
        handleClickCard,
        props,
        addToList,
        handleDrawTemplate,
        handleTemplate,
        editCustomList,
        editAllCustom,
        closeTemplateAddDetail,
      };
    },
  });
</script>
