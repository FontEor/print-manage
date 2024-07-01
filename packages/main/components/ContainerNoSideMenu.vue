<template>
  <div class="page-layout">
    <el-container class="page-container">
      <Header />
      <el-container>
        <el-container class="page-content-wrapper">
          <el-main class="page-content">
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
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import Header from './layout/Header.vue';
</script>
