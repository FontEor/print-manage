<template>
  <el-aside :class="asideWidthClass" class="page-aside">
    <div class="page-menu">
      <el-menu
        :default-active="defaultActive"
        :default-openeds="defaultOpenedList"
        :collapse="isCollapse"
        :ellipsis="true"
        @select="onSelect"
      >
        <template v-for="item in menuSides" :key="item.id">
          <el-sub-menu v-if="item.children.length > 0" :index="item.code">
            <template #title>
              <el-icon><IconMenu /></el-icon>
              <span>{{ item.name }}</span>
            </template>
            <SubMenu class="menu__submenu" :menus="item.children" />
          </el-sub-menu>
          <el-menu-item v-else :index="item.code">
            <el-icon><IconMenu /></el-icon>
            <template #title>
              <span>
                {{ item.name }}
              </span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </el-aside>
  <!-- 收起展开 -->
  <div class="hamburger" @click="toggleIsCollapse">
    <i :class="isCollapse ? 'jdl-icon-arrow-right' : 'jdl-icon-arrow-left'"></i>
    <img src="../../assets/img/header/hamburger-default.png" class="default-icon" alt="收起" />
    <img src="../../assets/img/header/hamburger-hover.png" class="hover-icon" alt="展开" />
  </div>
</template>

<script setup lang="ts">
  import { Store } from 'vuex';
  import { Menu as IconMenu } from '@element-plus/icons-vue';
  import { useStore } from '@/store';
  import RootStateTypes from '../../types/store';
  import { ref, reactive, computed, defineAsyncComponent, watch } from 'vue';
  import { router, ROUTER_CODE_MAP } from '@/router';
  import { OLD_ROUTER_CODE_MAP } from '@/menus/menu';
  import { Menu } from '@/types/menu';
  import type { PropType } from 'vue';

  const props = defineProps({
    menuData: {
      type: Array as PropType<Menu.Instance[]>,
      default: () => [],
    },
  });
  const menuListData = reactive([] as Menu.Instance[]);

  const menuSides = computed(() => store.state.menuSides);
  const defaultOpenedList = computed(() => store.state.menuSideOpened);

  watch(
    () => props.menuData,
    (val) => {
      if (val) {
        menuListData.splice(0, menuListData.length);
        menuListData.push(...val);
      }
    },
    {
      immediate: true,
    },
  );

  const store: Store<RootStateTypes> = useStore();

  const SubMenu = defineAsyncComponent(() => import('./SubMenu.vue'));

  const defaultActive = computed(() => store.state.menuSideActive);

  const isCollapse = ref(false);

  const asideWidthClass = computed(() => {
    return {
      asideWidth: isCollapse.value,
    };
  });

  const onSelect = (routeName: string) => {
    console.log('side menu select: ', routeName, ROUTER_CODE_MAP[routeName] || routeName);
    if (routeName) {
      const newRoute = ROUTER_CODE_MAP[routeName];
      const oldRoute = OLD_ROUTER_CODE_MAP[routeName];
      console.log('side menu select: ', newRoute, oldRoute, routeName);
      router.push({
        name: newRoute || oldRoute || routeName,
      });
    }
  };

  const toggleIsCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
</script>
