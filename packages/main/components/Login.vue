<template>
  <!-- <div class="test">
    登陆页面
  </div> -->
  <div class="login-container">
    <!-- 用户表单登陆区域 -->
    <el-form class="login-form" :rules="loginValidata" :model="loginInfo">
      <h3 class="login-head">欢迎登录</h3>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input
          class="login-item"
          v-model="loginInfo.username"
          placeholder="请输入用户名"
          prefix-icon="el-icon-printer"
          clearable
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          class="login-item"
          v-model="loginInfo.password"
          placeholder="请输入密码"
          type="password"
          prefix-icon="el-icon-printer"
          clearable
        />
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item>
        <el-button type="primary" class="login-confirm" @click="login">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  // 导入ref computed watch Store
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';

  // 定义用户信息类型
  type User = { username: string; password: string };
  // 定义账号密码
  const loginInfo = reactive<User>({
    username: '',
    password: '',
  } as User);

  // 对账号密码进行校验
  const loginValidata = reactive<Object>({
    username: [
      { required: true, message: '请输入用户账号', trigger: 'blur' },
      { min: 3, max: 12, message: '长度在A-B个字符以内', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入用户密码', trigger: 'blur' },
      { min: 3, max: 12, message: '长度在A-B个字符以内', trigger: 'blur' },
    ],
  });
  // 创建路由实例
  const router = useRouter();

  // 登录行为
  const login = () => {
    router.push('/home');
  };
</script>
