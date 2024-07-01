<template>
  <div class="empty-page_wrap">
    <template v-if="props.type === 1">
      <el-image class="empty-image" :src="image" fit="contain" />
      <p class="empty-des"
        ><span>您还未加入任何系统，请先</span
        ><el-link @click="onJoinSystem" type="primary" :underline="false">申请加入系统</el-link></p
      >
    </template>
    <template v-if="props.type === 2">
      <el-image class="empty-image" :src="image" fit="contain" />
      <p class="empty-des">如需使用问题排查工具，排查打印相关问题，</p>
      <p class="empty-des">
        请先<el-link
          type="primary"
          href="http://usf3.jdl.com/apply/useinfo?applyType=applyUser&tenantCode=CPSP"
          target="_blank"
          >申请权限</el-link
        >
      </p>
    </template>
    <template v-if="props.type === 3">
      <el-image class="empty-image" :src="image" fit="contain" />
      <p class="empty-des">
        你没有【运维运营（旧）】菜单的权限，如想使用请联系jiaoyuxiu3申请权限
      </p>
    </template>
    <ApplyJoinSystemDialog
      v-if="state.showJoin"
      :visible="state.showJoin"
      @close="state.showJoin = false"
    />
  </div>
</template>

<script lang="ts" setup>
  import image from '../assets/img/empty.png';
  import type { PropType } from 'vue';
  import { Empty } from '@/types/components/empty';
  import ApplyJoinSystemDialog from '@/components/ApplyJoinSystemDialog.vue';
  import { reactive } from 'vue';
  const props = defineProps({
    type: {
      type: Number as PropType<Empty.Type>,
      default: 1,
    },
  });

  const state = reactive({
    showJoin: false,
  });

  const onJoinSystem = () => {
    state.showJoin = true;
  };
</script>
