<template>
  <el-container class="page-content-header-container">
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="page-content-header">
      <h1>
        <el-icon>
          <Grid />
        </el-icon>
        详情页面
        <small> 从这里开始 都是当前模块的基本描述. </small>
      </h1>
    </div>
    <slot></slot>
  </el-container>
</template>
<script setup lang="ts"></script>
