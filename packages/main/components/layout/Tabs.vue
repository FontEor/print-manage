<template>
  <el-tabs v-model="currentTabValue" type="card" @tab-remove="removeTab">
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.name"
      :name="item.name"
      :closable="item.closable"
    />
  </el-tabs>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Store } from 'vuex';
  import { useStore } from '../../store';
  import RootStateTypes from '../../types/store';
  const store: Store<RootStateTypes> = useStore();

  // 渲染使用tabs
  const tabs = computed(() => store.state.tabs);

  // 删除tab页
  const removeTab = (name: string) => {
    store.commit('removeTab', name);
  };

  // 监听store中的当前选择tab
  const currentTab = computed(() => store.state.currentTab);
  const currentTabValue = ref('首页');
  watch(
    currentTab,
    (newValue) => {
      if (newValue && newValue.name !== currentTabValue.value) {
        currentTabValue.value = newValue.name;
      }
    },
    {
      immediate: true,
    },
  );
  // 监听当前选择tab
  watch(
    currentTabValue,
    (newValue) => {
      store.dispatch('changeTab', newValue);
    },
    {
      immediate: true,
    },
  );
</script>
