<template>
  <div class="page-layout">
    <el-container class="page-container">
      <Header />
      <el-container v-if="noPermission === false">
        <MenuList :menu-data="menuData" />
        <el-container class="page-content-wrapper">
          <el-main class="page-content">
            <!-- <Tabs /> -->
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
              </keep-alive>
              <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
            </router-view>
          </el-main>
          <!-- <Footer /> -->
        </el-container>
      </el-container>
      <EmptyPage v-else :type="type" />
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import Header from './layout/Header.vue';
  import MenuList from './layout/Menu.vue';
  import { Menu } from '@/types/menu';
  import EmptyPage from '../components/EmptyPage.vue';
  import { Empty } from '@/types/components/empty';

  const menuData = ref([] as Menu.Instance[]);
  const noPermission = ref(false);
  const type = ref<Empty.Type>(1);
</script>
