<template>
  <div class="version-card-item">
    <div
      :class="`version-card-content ${
        props.cardInfo.version === props.activeCardInfo.version && 'version-card-active'
      }`"
    >
      <el-image :src="props.cardInfo.imgCover" fit="contain" />
      <div class="card-description">
        <span class="version-number">{{ props.cardInfo.version }}</span>
        <p class="default-version" v-if="props.cardInfo.isDefault">
          <span>默认版本</span>
        </p>
      </div>
    </div>
    <p class="version-card-time">{{ cardInfo.time }}</p>
    <div class="version-card-buttons">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue';
  import { VersionManage } from '../../types/apis/version-manage';

  const props = defineProps({
    cardInfo: {
      type: Object as PropType<VersionManage.Instance>,
      default: () => {},
    },
    activeCardInfo: {
      type: Object as PropType<VersionManage.Instance>,
      default: () => {},
    },
  });
</script>
