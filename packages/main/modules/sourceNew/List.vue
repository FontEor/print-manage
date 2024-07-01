<template>
  <div class="template-list-wrap action-close-searh">
    <List ref="listRef" :query="query" :request-fn="requestFn" @reset-query="onResetQuery">
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item class="width-adjustment width-fixed" label="名称/编码" label-width="100px">
          <el-input
            v-model="query.params.nameOrCode"
            clearable
            placeholder="输入数据源编码或名称"
          />
        </el-form-item>
      </template>
      <template #action>
        <p class="template-list-btn">
          <el-button type="primary" @click="onAdd">新建数据源</el-button>
        </p>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="数据源编码" min-width="100px" prop="code" />
        <el-table-column label="数据源名称" min-width="100px" prop="name" />
        <el-table-column label="所属系统编码" min-width="120px" prop="orgCode" />
        <el-table-column label="更新人" prop="updateUser" />
        <el-table-column label="更新时间" prop="updateTime" width="180px" />
        <el-table-column label="操作" prop="id" width="220px">
          <template #default="scope">
            <el-link
              class="source-new-link"
              type="primary"
              :underline="false"
              @click="onDetail(scope.row, 'summary')"
              >编辑详情
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="onDetail(scope.row, 'data')"
              class="ml-16 source-new-link"
              >数据模型</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              @click="onDelete(scope.row)"
              class="ml-16 source-new-link"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog :visible="state.showCreate" @closed="onClosed" @get-data="getResourceData" />
    <SuccessDialog
      :visible="state.showSuccessDialog"
      :hasTitle="false"
      @close="state.showSuccessDialog = false"
      class="create-blank-success"
    >
      <template #content>
        <div class="template-market-success-message">
          创建成功！<br />
          <!-- 下期做 -->
          <!-- 你可以在【京Me-流程中心】查看申请成为数据源负责人的审批进度 -->
        </div>
      </template>
      <template #footer>
        <el-button @click="state.showSuccessDialog = false">关闭</el-button>
        <el-button @click="gotoSourcesDetailNew" type="primary">去维护数据模型</el-button>
      </template>
    </SuccessDialog>
  </div>
</template>
<script lang="ts" setup>
  import { ComponentPublicInstance, defineComponent, onMounted, reactive, ref, h } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import List from '@/components/ListNew.vue';
  import CreateDialog from './Create.vue';
  import SuccessDialog from '@/components/templates/SuccessDialog.vue';

  import type { SourceData } from '@/types/apis/sourceData';
  import type { SourceNew } from '@/types/apis/source-new.d';
  import type { System } from '@/types/apis/system';
  import { requestV2 } from '@/axios/request';
  import { router } from '@/router';
  import { Session } from '@/utils/session';
  import { useGo } from '@/hooks/web/usePage';

  const go = useGo();
  const requestFn = requestV2.sourceList;
  const getSystem = (needGetList = true) => {
    requestV2
      .systemNoPageList({
        params: {
          isPage: 0,
        },
      })
      .then((response) => {
        state.systems = response.data;
        needGetList && listRef.value?.getList();
      });
  };

  // 查询条件数据
  const query: SourceData.ListQueryAxios = reactive({
    params: {
      isPage: 1,
      nameOrCode: '',
      id: Session.getOrgId(),
    },
    replacements: {
      // 这个需要替换
      id: '',
    },
  });

  // data数据
  const state = reactive({
    showCreate: false,
    systems: [] as System.Instance[],
    showSuccessDialog: false,
    params: {} as SourceNew.ResourceData,
  });

  // 重置查询
  const onResetQuery = () => {
    query.params.nameOrCode = '';
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 加载
  onMounted(() => {
    getSystem();
  });

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.showCreate = false;
  };

  const onAdd = () => {
    state.showCreate = true;
  };

  // 查看详情
  const onDetail = (data: SourceData.Instance, tag: string) => {
    router.push({
      name: 'SourcesDetailNew',
      query: {
        id: data.id,
        sourceId: data.orgId,
        tag,
      },
    });
  };

  const onDelete = (data: SourceData.Instance) => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '是否确认删除'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          '数据源基本信息及数据模型都将被删除，您确认要删除该数据源吗？',
        ),
      ]),
      '',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'el-message-box-confirm',
      },
    )
      .then(() => {
        requestV2
          .sourceDelete({
            replacements: {
              id: data.orgId,
              sourceId: `${data.id}`,
            },
          })
          .then(() => {
            ElMessage.success('删除成功');
            listRef.value?.getList();
          });
      })
      .catch(() => {});
  };

  const getResourceData = (data: SourceNew.ResourceData) => {
    state.params = data;
    state.showSuccessDialog = true;
  };
  // 修改数据 -> 取创建成功数据
  const gotoSourcesDetailNew = () => {
    const path = {
      path: '/sourcesDetailNew',
      query: {
        ...state.params,
        tag: 'data',
      },
    };
    state.showSuccessDialog = false;
    go(path);
  };
  defineComponent({
    name: 'SourceList',
    beforeRouteEnter(to, form, next) {
      next(
        (
          vm: ComponentPublicInstance & {
            getSystem?: (needGetList: boolean) => void;
            resetQuery?: Function;
          },
        ) => {
          if (vm.getSystem && vm.resetQuery) {
            vm.getSystem(false);
            vm.resetQuery();
          }
        },
      );
    },
  });
  defineExpose({
    getSystem,
    resetQuery: onResetQuery,
  });
</script>
