<template>
  <div class="empty-template-container text-center">
    <div class="empty-image"></div>
    <template v-if="props.status === 0">
      <h3 class="mt-16">还没有相关内容</h3>
      <p class="mb-16">可点击下方“新增模板”按钮进行创建～</p>
      <el-button @click="onAdd" type="primary">新增模板</el-button>
    </template>
    <template v-else-if="props.status === 1">
      <h3 class="mt-16">还没有发布模板</h3>
      <p class="mb-16">可在未发布模板中点击发布~</p>
    </template>
    <template v-else-if="props.status === 2">
      <h3 class="mt-16">暂无数据</h3>
    </template>
    <template v-else-if="props.status === 3">
      <h3 class="mt-16">暂无数据</h3>
      <el-button @click="cancelSearch" type="primary">取消搜索</el-button>
    </template>
    <template v-else>
      <h3 class="mt-16">暂无搜索结果</h3>
      <!-- <el-link type="primary" @click="onAdd">新建空白模板</el-link> -->
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  export default defineComponent({
    name: 'EmptyTemplate',
    props: {
      status: {
        type: Number as PropType<0 | 1 | 2 | 3>,
      },
    },
    emits: ['add', 'cancel'],
    setup(props, ctx) {
      return {
        props,
        onAdd: () => {
          ctx.emit('add');
        },
        cancelSearch: () => {
          ctx.emit('cancel');
        },
      };
    },
  });
</script>
