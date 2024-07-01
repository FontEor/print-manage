<template>
  <!-- 登录 -->
  <div class="choose-system">
    <div class="login-index">
      <header class="login-head">
        <div class="cbox head-con">
          <h1 class="logo ti">物流云打印系统</h1>
        </div>
      </header>
      <div class="con-box">
        <div class="con-left"></div>
        <div class="logo-form">
          <h3 class="title">选择您的系统</h3>
          <el-form :model="state.form" ref="formRef" :rules="rules">
            <el-form-item prop="orgId">
              <el-select
                v-model="state.form.orgId"
                value-key="id"
                placeholder="系统名称"
                size="large"
                filterable
              >
                <el-option
                  v-for="item in state.orgOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="`${item.id}`"
                />
              </el-select>
            </el-form-item>
            <div class="create">
              <!-- <el-button link type="primary" @click="createTeam">创建我的团队</el-button> -->
            </div>
            <el-button type="primary" @click="onConfirm()">确认登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, ComponentPublicInstance, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { clone, get } from 'lodash';
  import selectListMixins from '../mixins/selectList';

  import { SystemData } from '../types/apis/systemData';
  import type { ElForm as ElFormType } from 'element-plus';

  import { Session } from '../utils/session';

  const router = useRouter();

  const formRef = ref<ComponentPublicInstance<typeof ElFormType>>();

  const rules = {
    orgId: [
      {
        required: true,
        message: '请选择系统',
      },
    ],
  };

  const state = reactive({
    orgOptions: [] as SystemData.Instance[], // 系统
    form: {
      orgId: '',
    },
  });

  const { getOrgList } = selectListMixins(state);

  const onConfirm = () => {
    formRef.value?.validate().then(() => {
      const data = clone(state.form);
      const orgId = data.orgId;
      Session.setOrgId(orgId);
      const item = state.orgOptions.find((item) => item.id.toString() === orgId);
      if (item) {
        Session.setOrgName(`${item.name}`);
        const saveId = Session.getOrgId();
        if (orgId === saveId) {
          router.push('/TemplateManage');
        }
      }
    });
  };

  // 选择默认系统
  const chooseDefaultSystem = () => {
    const saveOrgId = Session.getOrgId();
    let firstOrgId = get(state.orgOptions, '[0].id', '');
    if (firstOrgId) {
      firstOrgId = `${firstOrgId}`;
    }
    state.form.orgId = saveOrgId || firstOrgId;
  };

  onMounted(() => {
    getOrgList().then(chooseDefaultSystem);
    chooseDefaultSystem();
  });
</script>
