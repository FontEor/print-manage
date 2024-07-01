<template>
  <div :class="props.data.isApprove ? 'system-card under' : 'system-card'">
    <div class="system-card__top">
      <h4 class="flex-center-between">
        <span class="text-overflow" v-html="name"></span>
        <el-link
          class="text-overflow"
          href="javascript: void 0;"
          :underline="false"
          @click.stop="onCopy"
        >
          {{ props.data.code }}
          <i class="jdl-icon-document-copy"></i>
        </el-link>
      </h4>
      <el-tooltip
        v-if="props.data.remark"
        effect="dark"
        :content="props.data.remark"
        placement="top"
      >
        <p class="text-overflow">{{ props.data.remark }}</p>
      </el-tooltip>
      <p v-else class="text-overflow">{{ props.data.remark }}</p>
    </div>
    <div class="divider"></div>
    <div class="system-card__bottom">
      <p>负责人：{{ props.data.owner }}</p>
      <p>创建时间：{{ props.data.createTime }}</p>
    </div>
    <div class="system-card__bottom--under"></div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
  import { copyFn } from '@/hooks/copy';
  import { JoinSystem } from '@/types/apis/join-system';

  export default defineComponent({
    name: 'SystemCard',
    props: {
      data: {
        type: Object as PropType<JoinSystem.Instance>,
        default: () => ({}),
      },
      keyword: {
        type: String as PropType<string>,
        default: '',
      },
    },
    setup(props) {
      const onCopy = () => {
        copyFn(props.data?.code || '');
      };
      const name = computed(() => {
        if (props.keyword) {
          const regexp = new RegExp(props.keyword, 'g');
          return (props.data.name || '').replace(regexp, `<strong>${props.keyword}</strong>`);
        } else {
          return props.data.name || '';
        }
      });
      return {
        name,
        props,
        onCopy,
      };
    },
  });
</script>
