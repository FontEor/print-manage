<template>
  <div class="template-version-preview">
    <i
      :class="`jdl-icon-arrow-left arrow left ${state.activeIndex <= 0 && 'no-more'}`"
      @click="handlePrevious"
    ></i>
    <el-carousel
      ref="carouselRef"
      indicator-position="none"
      arrow="never"
      :loop="false"
      :autoplay="false"
      class="template-version-preview-carousel"
    >
      <el-carousel-item v-for="(item, index) in props.cardList" :key="item" :name="`${index}`">
        <div class="preview-image-wrap">
          <el-image :src="item.imgCover" fit="contain" />
          <div class="version-description"> 版本{{ item.version }} </div>
          <div class="version-bg" v-if="item.isDefault">
            <el-image :src="versionBgImage" />
            <span class="description">默认版本</span>
          </div>
        </div>
        <div class="preview-description">
          <p class="description-item-wrap">
            <span class="description-weaken">定稿说明：</span>
            <span>{{ item.reason }}</span>
          </p>
          <p
            class="description-item-wrap"
            v-for="(timeItem, index) in item.updateRecordList"
            :key="timeItem.updateTime"
          >
            <span class="description-weaken">{{ index === 0 ? '更新' : '创建' }}记录：</span>
            <span>{{ timeItem.regenerator }}</span>
            <span class="description-weaken">{{ timeItem.updateTime }}</span>
          </p>
          <div class="preview-button-wrap">
            <template v-if="props.isOwner">
              <template v-if="item.published">
                <el-button @click="onCreateDuplicate(item, true)" type="info" text bg
                  >创建副本</el-button
                >
                <el-button v-if="!item.isDefault" @click="handleSetDefault(item)" type="primary"
                  >设为默认</el-button
                >
              </template>
              <template v-else>
                <DeleteButton :data="item" type="button" @confirm="handleDelete" />
                <el-button @click="onDraw(item)" type="primary" plain>绘制</el-button>
                <PublishButton :data="item" @confirm="emit('refresh')" type="button" />
              </template>
            </template>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <i
      :class="`jdl-icon-arrow-right arrow right ${
        state.activeIndex >= props.cardList.length - 1 && 'no-more'
      }`"
      @click="handleNext"
    ></i>
    <!-- <div class="version-bg">
      <el-image :src="versionBgImage" />
      <span class="description">默认版本</span>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
  import type { ElCarousel } from 'element-plus';
  import { VersionManage } from '@/types/apis/version-manage';
  import { ComponentPublicInstance, PropType, reactive, ref, watch } from 'vue';
  import versionBgImage from '../../assets/img/template/version_bg.png';
  import { onDraw, onSetDefault } from '@/hooks/components/click-event.hook';
  import PublishButton from '@/modules/templates/components/PublishButton.vue';
  import DeleteButton from '@/modules/templates/components/DeleteButton.vue';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['update:cardInfo', 'refresh']);
  const props = defineProps({
    cardInfo: {
      type: Object as PropType<VersionManage.Instance>,
      default: () => ({}),
    },
    cardList: {
      type: Array as PropType<VersionManage.Instance[]>,
      default: () => [],
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
  });

  const state = reactive({
    activeIndex: 0,
  });

  const carouselRef = ref<ComponentPublicInstance<typeof ElCarousel>>();
  const handlePrevious = () => {
    state.activeIndex > 0 && (state.activeIndex -= 1);
    emit('update:cardInfo', props.cardList[state.activeIndex] || {});
  };

  const handleNext = () => {
    state.activeIndex < props.cardList.length - 1 && (state.activeIndex += 1);
    emit('update:cardInfo', props.cardList[state.activeIndex] || {});
  };

  const handleSetDefault = (data: VersionManage.Instance) => {
    onSetDefault(data).then(() => {
      emit('refresh');
    });
  };

  const handleDelete = () => {
    emit('refresh');
  };

  // 创建副本之前验证
  const onCreateDuplicate = (data: VersionManage.Instance, isCopy: boolean) => {
    const instance = props.cardList.find((item) => item.published === false);
    if (instance) {
      return ElMessage.error('模板存在未定稿版本，请勿重复创建。');
    }
    onDraw(data, isCopy);
  };

  watch(
    () => props.cardInfo.version,
    (newVersion, oldVersion) => {
      console.log('newVersion', newVersion, props.cardList);
      if (newVersion !== oldVersion) {
        state.activeIndex = props.cardList.findIndex((item) => item.version === newVersion);
        carouselRef.value?.setActiveItem(String(state.activeIndex));
      }
    },
    {
      immediate: true,
    },
  );
</script>
