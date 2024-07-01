<template>
  <div v-if="state.isRegister" class="choose-system-new flex-center">
    <div class="choose-system-new__content">
      <div class="choose-system-new__left"></div>
      <div class="choose-system-new__right">
        <h3>选择您的系统</h3>
        <el-form :model="state.form" ref="formRef" :rules="rules">
          <el-form-item prop="orgId">
            <el-select
              id="choose-system-select"
              class="page-header-system w100p"
              v-model="state.form.orgId"
              value-key="id"
              placeholder="系统名称"
              filterable
              popper-class="system-apply"
              @change="handleBlur"
            >
              <!-- v-for="item in state.orgOptions" -->
              <el-option
                v-for="item in state.orgNewOptions"
                :key="item.code"
                :label="item.name"
                :value="item.id"
                class="system-apply-option"
              >
                <div class="apply-option-item">
                  <div class="apply-option-name">{{ item.name }}</div>
                  <div class="apply-option-code">{{ item.code }}</div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-button class="w100p el-button--big" type="primary" @click="onConfirm()"
            >确认登录</el-button
          >
        </el-form>
        <div class="choose-system-new__link">
          <el-link
            @click="onApplyJoin"
            type="primary"
            href="javascript: void 0;"
            :underline="false"
            target="_self"
          >
            申请加入系统
          </el-link>
        </div>
      </div>
    </div>
    <ApplyJoinSystemDialog v-if="state.showJoin" :visible="state.showJoin" @close="onClose" />
  </div>
  <EmptyPage v-else :type="1" />
</template>

<script lang="ts" setup>
  import { ref, reactive, ComponentPublicInstance, onMounted, nextTick } from 'vue';
  import { clone } from 'lodash';
  import selectListMixins from '../mixins/selectList';
  import { useRoute } from 'vue-router';
  import { useGo } from '@/hooks/web/usePage';

  import type { SystemData } from '@/types/apis/systemData';
  import type { SystemList } from '@/types/apis/join-system';
  import type { ElForm as ElFormType } from 'element-plus';

  import { Session } from '@/utils/session';
  import ApplyJoinSystemDialog from '@/components/ApplyJoinSystemDialog.vue';
  import EmptyPage from '@/components/EmptyPage.vue';
  import { requestV2 } from '@/axios/request';

  const route = useRoute();
  const go = useGo();
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
    showJoin: false,
    orgOptions: [] as SystemData.Instance[], // 系统
    orgNewOptions: [] as SystemList.Instance[], // 根据USF注册情况获取的系统列表
    form: {
      orgId: undefined as number | undefined,
    },
    isRegister: false,
  });

  // getOrgList
  const { getOrgListNew } = selectListMixins(state);

  const onConfirm = () => {
    formRef.value?.validate().then(() => {
      const data = clone(state.form);
      const orgId = data.orgId;
      Session.setOrgId(orgId);
      // const item = state.orgOptions.find((item) => item.id.toString() === orgId);
      const item = state.orgNewOptions.find((item) => item.id === orgId);
      if (item) {
        Session.setOrgName(`${item.name}`);
        const saveId = Session.getOrgId();
        const query = {
          ...route.query,
          orgId,
          orgName: item.name,
        };
        if (orgId === saveId) {
          const path = {
            path: '/TemplateManage',
            query,
          };
          go(path, false, true);
        }
      }
    });
  };

  // 选择默认系统（只在当前浏览器Session存在时判断）
  const chooseDefaultSystem = () => {
    const saveOrgId = Session.getOrgId();
    state.form.orgId = saveOrgId;
  };

  const onApplyJoin = () => {
    state.showJoin = true;
  };

  const onClose = () => {
    state.showJoin = false;
    // 同时立刻申请通过的 应该暂时不需要处理后续逻辑
    // getOrgList().then(chooseDefaultSystem);
    // chooseDefaultSystem();
  };
  const ableToJoinSystem = () => {
    return requestV2.ableToJoinSystem({}).then((response) => {
      state.isRegister = response.data;
      return response.data;
    });
  };
  onMounted(() => {
    // 获取用户是否存在可使用的系统，不具备可用能力则不发起后续进入系统请求
    ableToJoinSystem().then((isRegister: boolean) => {
      if (isRegister) {
        // getOrgList().then(chooseDefaultSystem);
        getOrgListNew().then(chooseDefaultSystem);
        chooseDefaultSystem();
      }
    });
  });

  const handleBlur = () => {
    nextTick(async () => {
      const systemSelect = await document.getElementById('choose-system-select');
      systemSelect && systemSelect?.blur();
    });
  };
</script>
