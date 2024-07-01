<template>
  <nav class="page-header">
    <el-menu
      :default-active="menuCurrentStore"
      mode="horizontal"
      :ellipsis="false"
      @select="onSelect"
      ref="menuRef"
    >
      <div class="page-header-logo"></div>
      <el-menu-item
        v-for="menu in menusStore"
        :key="menu.id"
        :index="menu.code"
        @click.capture="handleMenuClick($event, menu)"
        >{{ menu.name }}</el-menu-item
      >
    </el-menu>
    <div class="page-header-book">
      <el-link
        href="http://lcp.jdl.com/#/docSoftwareSystem/64/54780"
        type="primary"
        :underline="false"
        target="_blank"
      >
        操作手册
      </el-link>
    </div>
    <div class="page-header-orgName" v-if="showSystem"
      >当前系统&emsp;
      <el-select
        class="page-header-system"
        v-model="state.form.orgId"
        value-key="id"
        placeholder="系统名称"
        @change="onSystemChange"
        filterable
        popper-class="system-apply"
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
        <div class="apply-option-enmpty el-select-dropdown__item"></div>

        <div @click.capture="onApplyJoin" class="system-apply-item el-select-dropdown__item">
          申请加入系统
        </div>
      </el-select>
    </div>
    <div class="page-header-user flex-center">
      <el-dropdown @command="onCommand" popper-class="header-system-popper">
        <span class="el-dropdown-link">
          <i class="page-header-avatar"></i>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="" disabled>{{ state.pin }}</el-dropdown-item>
            <el-dropdown-item command="logout" divided> 退出登录 </el-dropdown-item>
            <!--            <el-dropdown-item command="switchSystem">切换系统</el-dropdown-item>-->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </nav>
  <ApplyJoinSystemDialog v-if="state.showJoin" :visible="state.showJoin" @close="onClose" />
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { Store } from 'vuex';
  import { requestV1 } from '@/axios/request';
  import { useStore } from '@/store';
  import RootStateTypes from '../../types/store';
  import { Session } from '@/utils/session';
  import { clone } from 'lodash';
  import { useRoute } from 'vue-router';

  import { router, ROUTER_CODE_MAP } from '@/router';
  import { ArrowDown } from '@element-plus/icons-vue';
  import { ElMenu } from 'element-plus';
  import { OLD_ROUTER_CODE_MAP } from '@/menus/menu';
  import selectListMixins from '@/mixins/selectList';
  import type { SystemData } from '@/types/apis/systemData';
  import type { SystemList } from '@/types/apis/join-system';
  import type { MenuPermission } from '@/types/apis/menu';
  import ApplyJoinSystemDialog from '@/components/ApplyJoinSystemDialog.vue';
  import { useGo } from '@/hooks/web/usePage';

  const go = useGo();

  const menuRef = ref<typeof ElMenu>();

  const store: Store<RootStateTypes> = useStore();

  const state = reactive({
    showJoin: false,
    pin: '',
    orgOptions: [] as SystemData.Instance[], // 系统
    orgNewOptions: [] as SystemList.Instance[], // 新系统列表-根据USF注册情况获取
    form: {
      orgId: undefined,
      orgName: undefined,
    } as SystemList.OrgForm,
  });

  // getOrgList
  const { getOrgListNew } = selectListMixins(state);
  // 选择默认系统
  const chooseDefaultSystem = () => {
    const saveOrgId = Session.getOrgId();
    state.form.orgId = saveOrgId;
  };
  const menusStore = computed(() => store.state.menus);
  const menuCurrentStore = computed(() => store.state.menuCurrent);
  const route = useRoute();
  const showSystem = computed(() => {
    return (
      (menuCurrentStore.value === 'template_management' ||
        menuCurrentStore.value === 'template_management_old') &&
      route.name !== 'ChooseSystemNew'
    );
  });

  const onSystemChange = () => {
    const data = clone(state.form);
    const orgId = data.orgId;
    Session.setOrgId(orgId);
    // const item = state.orgOptions.find((item) => item.id.toString() === orgId);
    const item = state.orgNewOptions.find((item) => item.id === orgId);
    if (item) {
      Session.setOrgName(`${item.name}`);
      const saveId = Session.getOrgId();
      if (orgId === saveId) {
        const query = {
          ...route.query,
          orgId,
          orgName: item.name,
        };
        if (orgId === saveId) {
          const path = {
            path: '/',
            query,
          };
          go(path, false, true);
        }
      }
    }
  };
  onMounted(() => {
    getUserInfo();
    // getOrgList().then(chooseDefaultSystem);
    getOrgListNew().then(chooseDefaultSystem);
    state.form.orgName = Session.getOrgName();
    // 默认跳转逻辑
    defaultRoutePush();
  });
  const logout = async () => {
    Session.removeOrgId();
    await requestV1.logout();
    window.location.href =
      `//${window.VITE_APP_ERP}logout?ReturnUrl=${encodeURIComponent(window.location.origin)}` ||
      '';
  };
  const switchSystem = () => {
    router.push({
      name: 'ChooseSystemNew',
    });
  };

  const getUserInfo = () => {
    requestV1.getUserInfo({}).then((response) => {
      const { data } = response;
      state.pin = data.pin;
      store.commit('updateUserInfo', data);
    });
  };

  const onCommand = (command: string) => {
    console.log('command', command);
    switch (command) {
      case 'logout':
        logout();
        break;
      case 'switchSystem':
        switchSystem();
        break;
      default:
        break;
    }
  };

  // 选中回调函数
  const onSelect = (code: string) => {
    store.commit('updateMenuCurrent', code);
    // 并且选中第一个
    const instance = store.state.menus.find((menu) => {
      return menu.code === code;
    });
    const routeName = traverseMenu(instance);
    if (routeName) {
      router.push({
        name: routeName,
      });
    }
  };
  const traverseMenu = (instance: MenuPermission.MenuInstance): string => {
    if (instance && instance.children && instance.children.length > 0) {
      return traverseMenu(instance?.children[0]);
    } else {
      const routeName = (instance?.code || '') ?? '';
      return getRouteName(routeName);
    }
  };
  const getRouteName = (routeName: string): string => {
    const newRoute = ROUTER_CODE_MAP[routeName];
    const oldRoute = OLD_ROUTER_CODE_MAP[routeName];
    return newRoute || oldRoute || routeName;
  };

  const handleMenuClick = ($event: MouseEvent, menu: MenuPermission.MenuInstance) => {
    const orgId = String(Session.getOrgId());
    if (
      // 如果当前需要选择系统 但是 菜单不选择运维新版旧版即可跳转
      !orgId &&
      menu.code !== 'operation_old' &&
      menu.code !== 'operation'
    ) {
      $event.preventDefault();
      $event.stopPropagation();
      store.commit('updateMenuCurrent', -1);
      router.replace({ name: 'ChooseSystemNew' });
    }
  };

  const onApplyJoin = ($event: MouseEvent) => {
    $event.preventDefault();
    $event.stopPropagation();
    state.showJoin = true;
  };

  const onClose = () => {
    state.showJoin = false;
    // 同时立刻申请通过的 应该暂时不需要处理后续逻辑
    // getOrgList().then(chooseDefaultSystem);
    // chooseDefaultSystem();
  };
  const defaultRoutePush = () => {
    // 如果当前进入默认首页 则判断是否具有模板权限 据此进入模板首页或运维首页
    if (route.path === '/' && !menuCurrentStore.value) {
      go(getFirstAvailableMenu(store.state.menus));
    }
  };
  // 获取可用权限菜单
  const getFirstAvailableMenu = (menuList: MenuPermission.MenuInstance[]) => {
    let menuName = '';
    for (let i = 0; i < menuList.length; i++) {
      if (menuName) break;
      if (menuList[i].code === 'no_template_permission') break;
      if ((menuList[i].children?.length ?? 0) > 0) {
        menuName = getFirstAvailableMenu(menuList[i].children || []);
      } else if ((menuList[i].children?.length ?? 0) === 0) {
        menuName = menuList[i].url;
        break;
      }
    }
    return menuName;
  };
</script>
