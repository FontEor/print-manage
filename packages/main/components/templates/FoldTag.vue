<template>
  <div class="tag-content">
    <div class="tag-wrap" :id="`_Code_${props.code}`">
      <el-tag
        :class="`${code}fold-tag-item fold-tag-item`"
        :attr-label="item"
        size="small"
        type="info"
        v-for="item in props.tagList"
        :key="item"
        >{{ item }}</el-tag
      >
    </div>
    <div class="tag-show-wrap">
      <el-tag
        :class="`fold-tag-item`"
        size="small"
        type="info"
        v-for="item in state.showTagList"
        :key="item"
        >{{ item.label }}</el-tag
      >
      <el-tooltip class="box-item" effect="light" placement="bottom-start">
        <template #content>
          <el-tag
            class="template-tooltip-tag-item"
            size="small"
            type="info"
            v-for="item in state.toolTipTags"
            :key="item"
            >{{ item.label }}</el-tag
          >
        </template>
        <el-tag
          v-if="state.toolTipTags.length"
          :class="`fold-tag-item fold-tag-number ${state.numTagUseNextLine && 'use-next-line'}`"
          size="small"
          type="info"
          >+{{ state.toolTipTags.length }}</el-tag
        >
        <span v-else></span>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { nextTick, onMounted, PropType, reactive, watch } from 'vue';
  import lodash from 'lodash';
  import { TemplateTag } from '@/types/apis/template-tag';
  const props = defineProps({
    tagList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    code: {
      type: String as PropType<string>,
      default: '',
    },
  });
  const state = reactive({
    container: {
      width: 0,
      height: 0,
    },
    tagRectInfo: {} as Record<string, TemplateTag.TagRect>,
    showTagList: [] as Array<TemplateTag.TagRect>,
    toolTipTags: [] as Array<TemplateTag.TagRect>,
    numTagUseNextLine: false,
  });
  const getContainerSize = () => {
    const container = document.getElementById(`_Code_${props.code}`);
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    state.container = {
      width,
      height,
    };
  };
  const getTagsSize = () => {
    state.tagRectInfo = {};
    const tagsDom = document.getElementsByClassName(`${props.code}fold-tag-item`);
    Array.from(tagsDom).forEach((item) => {
      const label = lodash.get(item, 'attributes["attr-label"].value', '');
      const width = item.clientWidth;
      const height = item.clientHeight;
      state.tagRectInfo[label] = Object.assign(
        {},
        {
          width: width + 4,
          height: height + 4,
          label,
          line: 0,
        },
      );
    });
  };

  const computeTagsPosition = () => {
    const tagRectList = Object.values(state.tagRectInfo);
    const maxWidth = state.container.width;
    let line = 1;
    let totalWidth = 0;
    tagRectList.forEach((item, index) => {
      // 当前元素如果是第一个元素，并且宽度大于最大值，则行数不变，元素累计宽度为当前元素宽度，否则按照下一条规则
      if (index === 0 && item.width >= maxWidth) {
        item.line = line;
        totalWidth = item.width;
        return;
      }
      // 当前元素与前几个元素宽度相加的值是否大于最大值，大于最大值行数+1（当前元素换行），元素累计宽度为当前元素宽度；否则累计宽度加当前元素宽度
      if (totalWidth + item.width > maxWidth) {
        line += 1;
        totalWidth = item.width;
      } else {
        totalWidth += item.width;
      }
      item.line = line;
    });
  };
  const shuntTags = () => {
    const numTagWidth = 30;
    const maxWidth = state.container.width;
    const tagLists = Object.values(state.tagRectInfo);
    const prepareShowTagList = tagLists.filter((item) => item.line <= 2);
    const prepareToolTipTagList = tagLists.filter((item) => item.line > 2);
    const lastLineTagList = tagLists.filter((item) => item.line === 2);
    let totalWidth = 0;
    lastLineTagList.forEach((item) => {
      totalWidth += item.width;
    });
    // 第二行元素是否大于宽度总和，大于的话，数字换行，否则不换行
    state.numTagUseNextLine = lastLineTagList[0] && lastLineTagList[0].width >= maxWidth;
    // 第二行标签宽度总和 + numTagWidth 是否大于最大宽度，如果大于最大宽度，则不展示最后一个标签，否则展示最后一个标签
    if (totalWidth + numTagWidth > maxWidth) {
      const lastTag = prepareShowTagList.pop();
      if (lastTag) {
        state.toolTipTags = [lastTag].concat(prepareToolTipTagList);
      }
    } else {
      state.toolTipTags = prepareToolTipTagList;
    }
    state.showTagList = prepareShowTagList;
  };
  watch(
    () => props.tagList,
    (newList) => {
      if (newList && newList.length) {
        nextTick(() => {
          getTagsSize();
          getContainerSize();
          computeTagsPosition();
          shuntTags();
        });
      }
    },
    {
      immediate: true,
    },
  );

  onMounted(() => {});
</script>
<script lang="ts">
  export default {
    name: 'FoldTag',
  };
</script>
