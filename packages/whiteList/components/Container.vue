<template>
  <div class="page-layout">
    <el-container class="page-container">
      <Header />
      <el-container>
        <el-container class="page-content-wrapper">
          <el-main>
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" :key="$route.name" />
              </keep-alive>
            </router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import Header from './layout/Header.vue';
</script>
