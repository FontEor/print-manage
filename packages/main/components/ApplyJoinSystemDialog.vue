<template>
  <el-dialog
    class="apply-join-system-dialog dark-close"
    v-model="state.visible"
    title=""
    width="780"
    :before-close="onClose"
  >
    <template #header="{ titleId, titleClass }">
      <div class="apply-join-system-dialog__header flex-center-between">
        <p :id="titleId" :class="titleClass">申请加入系统</p>
        <div>
          <el-input
            class="w-240"
            v-model="query.params.name"
            placeholder="请输入系统名称或编码"
            :suffix-icon="Search"
            clearable
            @blur="onSearch"
            @keyup.enter="onSearch"
            @clear="onSearch"
          />
        </div>
      </div>
    </template>
    <div class="apply-join-system-dialog__content">
      <el-alert
        class="apply-join-system-dialog__alert"
        title="如果您需要创建新系统，请咚咚联系jiaoyuxiu3"
        type="warning"
        show-icon
        :closable="false"
      >
        <template #title>
          如果您需要创建新系统，请咚咚联系
          <el-link href="timline://chat/?topin=jiaoyuxiu3" :underline="false" target="_self">
            jiaoyuxiu3
            <el-icon><ChatDotRound /></el-icon>
          </el-link>
        </template>
      </el-alert>
      <div class="apply-join-system-dialog__cards">
        <template v-if="state.systemList.length">
          <SystemCard
            :class="{
              active: state.currentItem.code === item.code,
            }"
            v-for="item in state.systemList"
            :key="item.code"
            :data="item"
            :keyword="query.params.name"
            @click="onChoose(item)"
          />
        </template>
        <EmptyTemplate v-else style="margin-top: 80px" type="4" />
      </div>
    </div>
    <template #footer>
      <div class="apply-join-system-dialog__footer flex-center-between">
        <el-form class="login-form" :model="form">
          <el-form-item prop="username" label="申请原因" v-show="state.systemList.length">
            <el-input v-model="form.reason" placeholder="请输入" class="w-240" clearable />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="onApply"
          :disabled="!state.currentItem.code || state.isApprove"
          >申请</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, watch } from 'vue';
  import { ChatDotRound, Search } from '@element-plus/icons-vue';
  import SystemCard from '@/components/card/System.vue';
  import EmptyTemplate from '@/components/EmptyTemplate.vue';
  import { requestV2 } from '@/axios/request';
  import type { JoinSystem } from '@/types/apis/join-system';
  import { ElMessage } from 'element-plus';

  export default defineComponent({
    name: 'ApplyJoinSystemDialog',
    components: { ChatDotRound, SystemCard, EmptyTemplate },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['close'],
    setup(props, { emit }) {
      const state = reactive({
        currentItem: {
          code: '',
          name: '',
        },
        visible: false,
        systemList: [] as JoinSystem.Instance[],
        isApprove: false,
      });
      const query = reactive({
        params: {
          name: '',
        },
      });
      const form = reactive({
        reason: '',
      });
      const onClose = () => {
        emit('close');
        state.visible = false;
      };
      const onSearch = () => {
        getSystemList();
      };
      const onChoose = ({ code, name, isApprove }: JoinSystem.Instance) => {
        if (isApprove) return;
        state.isApprove = isApprove;
        state.currentItem = { code, name };
      };
      const onApply = () => {
        const data = {
          ...state.currentItem,
          description: form.reason,
        };
        requestV2.applyToJoinSystem({ data }).then(() => {
          ElMessage.success('申请成功');
          onClose();
        });
      };
      const getSystemList = () => {
        const data: JoinSystem.ListAxios = {
          params: {
            name: query.params.name,
          },
        };
        requestV2.applySystemList(data).then((res) => {
          // state.systemList = res.data;
          state.systemList = formatsystemData(res.data);
        });
      };
      const formatsystemData = (data: JoinSystem.Instance[]) => {
        const isApproveArray = [];
        const notApproveArray = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].isApprove) {
            isApproveArray.push(data[i]);
          } else {
            notApproveArray.push(data[i]);
          }
        }
        return isApproveArray.concat(notApproveArray);
      };
      watch(
        () => props.visible,
        (val) => {
          state.visible = val;
        },
        {
          immediate: true,
        },
      );
      onMounted(() => {
        getSystemList();
      });
      return {
        form,
        query,
        state,
        onClose,
        onSearch,
        onChoose,
        onApply,
        Search,
        formatsystemData,
      };
    },
  });
</script>
