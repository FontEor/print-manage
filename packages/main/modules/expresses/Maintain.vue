<template>
  <div class="account-list-container">
    <el-container ref="listContainer" class="list-container">
      <el-form class="list-search" ref="form" :inline="true" :model="query">
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.nameOrCode" placeholder="输入编码或名称" />
        </el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-form-item class="search-active-container">
          <el-button :disabled="state.edit" type="primary" @click="onEditor">维护映射码</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe :height="tableHeight" :data="state.tableData" row-key="id">
        <el-table-column prop="deliveryNum" label="承运商ID" min-width="120px" />
        <el-table-column prop="code" label="承运商编码" min-width="100px" />
        <el-table-column prop="name" label="承运商名称" min-width="100px" />
        <el-table-column prop="logoPath" label="Logo图地址" min-width="120px">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 40px"
              :src="state.urlPrefix + scope.row.logoPath"
              :preview-src-list="[state.urlPrefix + scope.row.logoPath]"
              :initial-index="1"
              fit="cover"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" width="180px" />
        <el-table-column prop="remark" label="映射码" min-width="120px">
          <template #default="scope">
            <el-input
              v-show="state.edit"
              v-model="scope.row.relation"
              placeholder="请输入内容,多个映射使用英文,分隔"
            />
            <span v-show="!state.edit">{{ scope.row.relation }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="state.edit" class="text-right p-14">
        <el-button type="primary" @click="onCancel">取消</el-button>
        <el-button @click="onSave">保存</el-button>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';

  import type { SourceData } from '@/types/apis/sourceData';
  import { requestV1 } from '@/axios/request';
  import type { ElForm as ElFormType } from 'element-plus';
  import { Express } from '@/types/apis/express';
  import { Session } from '@/utils/session';

  // 查询条件数据
  const query: SourceData.ListQueryAxios = reactive({
    params: {
      isPage: 0,
      nameOrCode: '',
      id: undefined,
    },
    replacements: {
      // 这个需要替换
      orgId: Session.getOrgId(),
    },
  });

  // data数据
  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    tableData: [] as Express.InstanceRelation[],
    edit: false,
  });

  // 重置查询
  // const onResetQuery = () => {
  //   query.params.id = undefined;
  //   query.params.nameOrCode = '';
  //   getList();
  // };

  const onEditor = () => {
    state.edit = true;
  };

  const onCancel = () => {
    state.edit = false;
    getList();
    // 取消编辑
  };

  const onSave = () => {
    // 保存
    const list = state.tableData || [];
    const results: Express.RelationUpdate[] = Array.from(list).map((item) => {
      return {
        deliveryId: item.id,
        relation: item.relation || '',
      };
    });
    const message: string[] = [];
    // datas.forEach((data) => {
    //   if (data.relation) {
    //     const relations = data.relation.split(",");
    //     for (let index = 0; index < relations.length; index++) {
    //       const relation = relations[index];
    //       // 验证长度
    //       const validLength =
    //         relation.trim().length <= 10 && relation.trim().length >= 0;
    //       // 验证字符
    //       const validWord = CN_EN_NUM.test(relation);
    //       // 验证数据
    //       if (validLength && validWord) {
    //       } else {
    //         message.push(
    //           `${data.name}的映射值验证失败，中英文字符1-10位，英文,分隔`
    //         );
    //       }
    //     }
    //   }
    // });
    if (message.length) {
      ElMessage.error(message.join('；'));
    } else {
      requestV1
        .expressRelation({
          data: results,
          replacements: {
            orgId: Session.getOrgId(),
          },
        })
        .then(() => {
          state.edit = false;
          getList();
        });
    }
  };

  const onSearch = () => {
    getList();
  };

  const getList = () => {
    state.tableData = [];
    const data = Object.assign(
      {
        isPage: 0,
        form: 0,
        size: 10000,
        replacements: {
          orgId: Session.getOrgId(),
        },
      },
      query,
    );
    console.log('####### data', data);
    // 因为 request[变量]的类型推断问题没有搞定 暂时先拿到外部处理请求函数
    requestV1.expressRelationList(data).then((response) => {
      state.tableData = response.data || [];
    });
  };

  // 自动计算表格高度
  const form = ref<ComponentPublicInstance<typeof ElFormType>>();

  const tableHeight = ref(0);
  const listContainer = ref<ComponentPublicInstance<HTMLDivElement>>();

  const computedTableHeight = () => {
    const $container = listContainer.value?.$el;
    const $form = form.value?.$el;
    const containerHeight = parseFloat(window.getComputedStyle($container).height);
    const formHeight = parseFloat(window.getComputedStyle($form).height);
    tableHeight.value = containerHeight - formHeight - 66;
  };

  onMounted(() => {
    getList();
    computedTableHeight();
  });
</script>
<script lang="ts">
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
  import { ComponentPublicInstance } from 'vue';
  export default {
    name: 'ExpressMaintain',
    beforeRouteEnter(
      to: RouteLocationNormalized,
      form: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
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
  };
</script>
