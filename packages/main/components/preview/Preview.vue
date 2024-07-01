<template>
  <div class="preview-images-dialog" @click.stop.prevent="onClose">
    <div ref="previewRef">
      <img style="display: none" v-for="url in previewImageList" :key="url" :src="url" alt="" />
    </div>
    <div @click.stop.prevent="onClose" class="preview-images-close">
      <el-icon><Close /></el-icon>
    </div>
    <!-- LATER 「版本删除」 版本不能删除 先这么处理就行了 -->
    <div class="preview-images-title" v-if="imageList.length > 1">
      <span>版本{{ imageList[state.index].versionNumber }}</span>
    </div>
    <div class="preview-images-tools">
      <template v-if="props.showSwitch">
        <div @click.stop.prevent="onPrev" class="preview-button">
          <el-tooltip popper-class="preview-tooltip" effect="dark" content="上一张" placement="top">
            <el-icon><ArrowLeft /></el-icon>
          </el-tooltip>
        </div>
        <div class="preview-button preview-index">
          <div>{{ state.index + 1 }}/{{ previewImageList.length }}</div>
        </div>
        <div @click.stop.prevent="onNext" class="preview-button">
          <el-tooltip popper-class="preview-tooltip" effect="dark" content="下一张" placement="top">
            <el-icon><ArrowRight /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <div @click.stop.prevent="onLarge" class="preview-button">
        <el-tooltip popper-class="preview-tooltip" effect="dark" content="放大" placement="top">
          <el-icon><ZoomIn /></el-icon>
        </el-tooltip>
      </div>
      <div @click.stop.prevent="onSmall" class="preview-button">
        <el-tooltip popper-class="preview-tooltip" effect="dark" content="缩小" placement="top">
          <el-icon><ZoomOut /></el-icon>
        </el-tooltip>
      </div>
      <div @click.stop.prevent="onPrint" class="preview-button">
        <el-tooltip popper-class="preview-tooltip" effect="dark" content="打印" placement="top">
          <el-icon><Printer /></el-icon>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    onUnmounted,
    PropType,
    reactive,
    ref,
    watch,
  } from 'vue';
  import printJs from 'print-js';
  import Viewer from 'viewerjs';
  import { PreviewImages } from '@/types/components/previewImages';

  import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Printer, Close } from '@element-plus/icons-vue';
  import { FragmentHistory } from '@/types/components/fragmentHistory.d';

  export default defineComponent({
    name: 'PreviewImages',
    components: {
      ArrowLeft,
      ArrowRight,
      ZoomIn,
      ZoomOut,
      Printer,
      Close,
    },
    props: {
      list: {
        type: Array as PropType<FragmentHistory.PreviewItem[]>,
        default: () => [],
      },
      historyImages: {
        type: Array as PropType<FragmentHistory.PreviewItem[]>,
        default: () => [],
      },
      index: {
        type: Number as PropType<number>,
        default: 0,
      },
      width: {
        type: Number as PropType<number>,
        default: 0,
      },
      height: {
        type: Number as PropType<number>,
        default: 0,
      },
      showSwitch: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
    },
    emits: ['close'],
    setup(props, ctx) {
      const previewRef = ref<HTMLDivElement>();
      let instance: Viewer | undefined = undefined;
      const state = reactive({
        index: 0,
      });
      const versionNumber = computed(() => {
        return props.list.length - state.index;
      });
      const imageList = computed(() => {
        return props.historyImages.concat(props.list).filter((item) => item.imageUrl);
      });
      const previewImageList = computed(() => {
        return imageList.value.map((item) => item.imageUrl);
      });
      const currentIndex = computed(() => {
        if (props.index === -1) {
          const len = imageList.value.length;
          return len - 1;
        }
        return props.index;
      });
      watch(
        () => currentIndex.value,
        (newIndex) => {
          state.index = newIndex;
        },
        {
          immediate: true,
        },
      );

      onMounted(() => {
        nextTick(() => {
          createInstance();
        });

        // const target = lodash.get(props, "list[0]");
        // if (props.versionNo && target) {
        //   new PasteVersionImage(target).start().then((res) => {
        //     state.list = [res];
        //     nextTick(() => {
        //       createInstance();
        //     });
        //   });
        // } else {
        //   state.list = props.list;
        //   nextTick(() => {
        //     createInstance();
        //   });
        // }
      });
      onUnmounted(() => {
        instance?.destroy();
      });

      const createInstance = () => {
        if (!instance) {
          if (previewRef.value) {
            instance = new Viewer(previewRef.value, {
              initialViewIndex: currentIndex.value,
              inline: true,
              button: false,
              navbar: false,
              title: false,
              toolbar: false,
              tooltip: false,
              movable: true,
              zoomable: true,
              rotatable: false,
              scalable: false,
              transition: true,
              fullscreen: false,
              keyboard: false,
              zoomRatio: 0.5,
              zIndex: 2000,
              view(event: PreviewImages.CustomEvent) {
                state.index = event.detail.index;
              },
            });
          } else {
            console.log('元素初始化失败');
          }
        } else {
          instance.update();
        }
      };

      const onPrev = () => {
        if (instance) {
          instance.prev(true);
        }
      };
      const onNext = () => {
        if (instance) {
          instance.next(true);
        }
      };
      const onLarge = () => {
        if (instance) {
          instance.zoom(0.1, true);
        }
      };
      const onSmall = () => {
        if (instance) {
          instance.zoom(-0.1, true);
        }
      };
      const onPrint = () => {
        printJs({
          printable: props.list[state.index].imageUrl,
          type: 'image',
          imageStyle: `width: ${props.width}mm;height: ${props.height}mm;`,
        });
      };
      const onClose = () => {
        instance?.hide();
        ctx.emit('close');
      };
      return {
        props,
        state,
        onPrev,
        onNext,
        onLarge,
        onSmall,
        onPrint,
        onClose,
        previewRef,
        versionNumber,
        previewImageList,
        imageList,
      };
    },
  });
</script>
