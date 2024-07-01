<template>
  <div class="login-container">
    <div class="login-header">
      <div class="login-header-logo-container">
        <span class="login-header-logo"> JDL </span>
        <span class="login-logo-text">模板管理</span>
      </div>
    </div>
    <div class="login-content">
      <el-card class="login-card" shadow="always">
        <template #header>
          <div>登陆</div>
        </template>
        <el-form
          status-icon
          ref="form"
          label-width="100px"
          class="login-form"
          label-suffix="："
          :model="state.form"
          :rules="state.rules"
          :hide-required-asterisk="false"
        >
          <el-form-item label="账户名" prop="account">
            <el-input v-model="state.form.account" type="account" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密&emsp;码" prop="password">
            <el-input v-model="state.form.password" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="state.form.code">
              <template #append>
                <el-image
                  @click="state.t++"
                  class="login-code"
                  :src="`${state.HOST}/code?t=${state.t}`"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-button class="login-button" type="primary" @click="onSubmit" @keyup.enter="onSubmit"
            >提交</el-button
          >
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElForm } from 'element-plus';
  import { clone } from 'lodash';

  import logo from '../assets/logo.png';

  import { requestV1 } from '@/axios/request';
  import { router } from '../router';
  import { passwordMD5 } from '../utils/md5';

  const state = reactive({
    HOST: import.meta.env.VITE_APP_HOST,
    t: 0,
    form: {
      account: '',
      password: '',
      code: '',
    },
    rules: {
      account: [{ required: true, message: '请输入账户名' }],
      password: [{ required: true, message: '请输入密码' }],
      code: [
        { required: true, message: '请输入验证码' },
        { max: 4, message: '验证码错误' },
        { min: 4, message: '验证码错误' },
      ],
    },
  });

  const form = ref<ComponentPublicInstance<typeof ElForm>>();

  const onSubmit = () => {
    form.value?.validate().then(() => {
      const data = clone(state.form);
      data.password = passwordMD5(data.password);
      requestV1
        .login({
          data: data,
        })
        .then(() => {
          router.replace({
            name: 'home',
          });
        });
    });
  };
</script>

<style></style>
