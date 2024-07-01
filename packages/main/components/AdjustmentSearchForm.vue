<template>
  <el-form
    :model="props.model"
    :rules="props.rules"
    :disabled="props.disabled"
    class="adjustment-search-form-wrap"
    ref="searchForm"
  >
    <slot></slot>
    <el-form-item :class="`search-buttons`" ref="childRef">
      <slot name="search"></slot>
      <div
        class="row-wrap"
        v-if="showSpread"
        @click="() => (!state.spread ? handleSpreed() : handleFewer())"
      >
        <span v-if="!state.spread" class="description">展开</span>
        <span v-else class="description">收起</span>
        <i
          :class="`jdl-icon-arrow-down arrow ${!state.spread ? 'spread-active' : 'fewer-active'}`"
        ></i>
      </div>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive, PropType, onMounted, computed, defineComponent, onUnmounted } from 'vue';
  import { FormInstance, FormRules } from 'element-plus';
  import { throttle } from 'lodash';
  import { AdjustForm } from '@/types/apis/template-new';

  const props = defineProps({
    model: {
      type: Object as PropType<Record<string, any>>,
    },
    rules: {
      type: Object as PropType<FormRules>,
      default: () => {},
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });

  const searchForm = ref<FormInstance>();
  const state = reactive({
    spread: false,
    contentHeight: 0,
    childHeight: 0,
    contentWidth: 0,
    contentChildren: [] as AdjustForm.IContentChild[],
  });
  const formReset = () => {
    if (!searchForm.value) return;
    searchForm.value.resetFields();
  };
  const fromCheck = () => {
    return new Promise((resolve) => {
      if (!searchForm.value) {
        resolve(false);
        return;
      }
      searchForm.value.validate((valid) => {
        resolve(valid);
      });
    });
  };

  /*
    - 获取content 宽度
    - 获取content元素的所有子元素，将子元素存到一个对象中
    - 计算所有的这些子元素都应该展示在第几行
    - 这些元素中所在的行数有超过3行的，展示“展开收起”按钮
    - 展示“展开”时，计算最后一个元素是否需要隐藏
    - 展示“收起”时，所有元素展示
*/
  const childRef = ref<FormInstance | null>(null);
  const getContentWidthAndChildren = () => {
    if (searchForm.value) {
      state.contentWidth = searchForm.value.$el.clientWidth - 16;
      const children = Array.from(searchForm.value.$el.childNodes as HTMLDivElement[])
        .map((item) => {
          if (item && item.nodeName === 'DIV' && !item.className.includes('search-buttons')) {
            item.className = item.className.replace('hide-item', '');
            return {
              dom: item,
              line: 0,
            };
          }
          return {
            dom: '' as unknown as HTMLDivElement,
            line: 0,
          };
        })
        .filter((item) => item.dom);
      state.contentChildren = children;
    }
  };
  const hideItem = (item: AdjustForm.IContentChild) => {
    // 超过三行隐藏
    if (item.line > 3 && !item.dom.className.includes('search-buttons')) {
      item.dom.className += ' hide-item';
    } else {
      item.dom.className = item.dom.className.replace('hide-item', '');
    }
  };

  const computeChildrenLine = () => {
    const maxWidth = state.contentWidth;
    let line = 1;
    let totalWidth = 0;
    state.contentChildren.forEach((item, index) => {
      const itemWidth = item.dom.clientWidth;
      if (index === 0 && itemWidth >= maxWidth) {
        item.line = line;
        totalWidth = itemWidth;
        return;
      }
      if (totalWidth + itemWidth > maxWidth) {
        line += 1;
        totalWidth = itemWidth;
      } else {
        totalWidth += itemWidth;
      }
      item.line = line;
      // 超过三行的隐藏
      hideItem(item);
    });
  };
  const computeIfShowLastNode = () => {
    // 找出第三行的元素
    const maxWidth = state.contentWidth;
    const lineThreeNodes = state.contentChildren.filter((item) => item.line === 3);
    // const lastItem = lineThreeNodes.at(-1); // 兼容太差了
    const lastItem = lineThreeNodes[lineThreeNodes.length - 1];
    if (!lastItem) return;
    const buttonWidth = state.contentChildren.at(-1)!.dom.clientWidth;
    const totalLineWidth = lineThreeNodes.reduce((preWidth, curItem) => {
      return preWidth + curItem.dom.clientWidth;
    }, 0);
    if (totalLineWidth + buttonWidth > maxWidth) {
      lastItem.dom.className += ' hide-item';
    } else {
      lastItem.dom.className = lastItem.dom.className.replace('hide-item', '');
    }
  };
  const handleSpreed = () => {
    state.contentChildren.forEach((item) => {
      item.dom.className = item.dom.className.replace('hide-item', '');
    });
    state.spread = true;
  };
  const handleFewer = () => {
    state.contentChildren.forEach((item) => {
      // 超过三行的隐藏
      hideItem(item);
    });
    computeIfShowLastNode();
    state.spread = false;
  };
  const showSpread = computed(() => {
    return state.contentChildren.filter((item) => item.line > 3).length > 0;
  });

  const start = () => {
    state.contentChildren = [];
    getContentWidthAndChildren();
    computeChildrenLine();
    computeIfShowLastNode();
  };
  const resize = throttle(
    () => {
      if (!searchForm.value || !searchForm.value.$el) {
        return;
      }
      start();
    },
    1000,
    {
      trailing: true,
      leading: true,
    },
  );

  onMounted(() => {
    start();
    window.addEventListener('resize', resize);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', resize);
  });
  defineExpose({
    formReset,
    fromCheck,
  });
  defineComponent({
    name: 'AdjustmentSearchForm',
  });
</script>
