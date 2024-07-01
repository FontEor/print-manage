<template>
  <div class="sub-menu">
    <template v-for="item in props.menus" :key="item.id">
      <el-sub-menu v-if="item.children.length" :index="item.code">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
        <SubMenu :menus="item.children" />
      </el-sub-menu>
      <el-menu-item v-else :index="item.code">
        <template #title>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { Menu } from '@/types/menu';

  const props = defineProps<{
    menus: Menu.Instance[];
  }>();
</script>

<script lang="ts">
  export default {
    name: 'SubMenu',
  };
</script>
