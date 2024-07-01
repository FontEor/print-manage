<template>
  <div class="overview detail-container">
    <el-form
      class="overview-form detail-from"
      :class="{
        'detail-form-view': !state.editState,
      }"
      ref="overviewFormRef"
      :model="state.form"
      :rules="state.rules"
      label-width="90px"
    >
      <el-form-item label="父系统" prop="data.parentId">
        <div class="detail-form-view-field">
          {{ formatOrgId(state.form.data.parentId || 0) || '无' }}
        </div>
      </el-form-item>
      <el-form-item label="系统编码" prop="data.code">
        <div class="detail-form-view-field">{{ state.form.data.code }}</div>
      </el-form-item>
      <el-form-item label="系统名称" prop="data.name">
        <el-input
          v-if="state.editState"
          v-model="state.form.data.name"
          placeholder="请输入系统名称"
        />
        <div v-else class="detail-form-view-field">{{ state.form.data.name }}</div>
      </el-form-item>
      <el-form-item label="系统来源" prop="data.type">
        <div class="detail-form-view-field">{{ formatSystemSource(state.form.data.type) }}</div>
      </el-form-item>
      <el-form-item label="负责人" prop="data.owner">
        <UserSelect
          v-if="state.editState"
          v-model="state.form.data.owner"
          v-model:deptName.sync="state.form.data.ownerDep"
          v-model:name.sync="state.form.data.ownerName"
          placeholder="请输入系统归属团队负责人账号，支持ERP"
          :userType="state.form.data.type"
          :mustBPin="true"
        />
        <div v-else class="detail-form-view-field">{{
          state.form.data.ownerName || state.form.data.owner
        }}</div>
      </el-form-item>
      <el-form-item label="系统归属" prop="data.ownerDep">
        <div class="detail-form-view-field">{{ state.form.data.ownerDep }}</div>
      </el-form-item>
      <el-form-item label="相关成员" prop="data.members">
        <UserSelect
          v-if="state.editState"
          v-model="state.form.data.members"
          v-model:name.sync="state.form.data.membersName"
          :multiple="true"
          placeholder="请输入添加成员"
          :userType="state.form.data.type"
        />
        <div v-else class="detail-form-view-field">{{ state.form.data.memberDisplay }}</div>
      </el-form-item>
      <el-form-item
        v-permission:系统开放
        class="overview-switch"
        label="系统开放"
        prop="data.isOpen"
      >
        <el-switch
          v-model="state.form.data.isOpen"
          :active-value="1"
          :inactive-value="0"
          :disabled="!state.editState"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="系统说明" prop="data.remark">
        <el-input
          v-if="state.editState"
          v-model="state.form.data.remark"
          placeholder="可填写系统描述或用途，以便其他用户快速了解。"
          :rows="5"
          type="textarea"
        />
        <div v-else class="detail-form-view-field">{{ state.form.data.remark }}</div>
      </el-form-item>
    </el-form>
    <div class="overview-button-group">
      <el-button type="primary" v-if="!state.editState" @click="handleEdit">编辑</el-button>
      <div v-if="state.editState">
        <el-button type="primary" @click="handleSave(overviewFormRef)">保存</el-button>
        <el-button @click="resetForm(overviewFormRef)">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits } from 'vue';
  import { onMounted, PropType, watch } from 'vue';
  import { clone, pick, compact } from 'lodash';
  import { requestV1 } from '@/axios/request';
  import { SystemData } from '../../../types/apis/systemData';
  import type { FormRules } from 'element-plus';
  import type { ElForm } from 'element-plus';
  import { ElMessage } from 'element-plus';
  import selectListMixins from '../../../mixins/selectList';
  import { UserData } from '../../../types/apis/userData';
  import UserSelect from '../../../components/select/user.vue';

  const loading = ref(false);
  type FormInstance = InstanceType<typeof ElForm>;
  const overviewFormRef = ref<FormInstance>();
  const props = defineProps({
    detail: {
      type: Object as PropType<SystemData.Instance>,
    },
  });
  const emits = defineEmits(['getOrgsDetail']);

  // 格式化成员数据 去除系统负责人
  const memberDisplayFormat = (membersName = '', owner: string, ownerName: string) => {
    console.log('####### membersName', membersName);
    let members = (membersName || '').split(',');
    members = members.map((member = '') => {
      const [key, value] = member.split(':');
      if (key === owner) {
        return '';
      }
      if (value === ownerName) {
        return '';
      }
      return value;
    });
    members = compact(members);
    return members.join(',');
  };

  const formatSystemSource = (source: number) => {
    switch (source) {
      case 1:
        return '京东内部系统';
      case 2:
        return '京东外部系统';
      default:
        return '';
    }
  };

  const formData = (): SystemData.UpdateAxios => ({
    data: {
      parentId: null,
      code: '',
      type: 1,
      isOpen: 0,
      members: '',
      memberDisplay: '',
      membersName: '',
      name: '',
      owner: '',
      ownerDep: '',
      ownerName: '',
      remark: '',
    },
    replacements: {
      id: 0,
    },
  });

  const rules: FormRules = {
    'data.name': [
      {
        required: true,
        message: '请输入系统名称',
      },
      {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
        message: '系统名称只支持汉字、字母及数字',
      },
      {
        min: 0,
        max: 50,
        message: '系统名称不能超过50个字符',
      },
    ],
    'data.owner': [
      {
        required: true,
        message: '请输入系统归属团队负责人账号，支持ERP',
      },
    ],
    'data.remark': [
      {
        min: 0,
        max: 50,
        message: '系统说明不能超过50个字符',
      },
    ],
  };

  const state = reactive({
    form: formData(),
    editState: false,
    rules,
    ownerOptionList: [] as UserData.UserAndErpInstance[],
    optionsMembersList: [] as SystemData.Instance[],
    id: 0,

    orgOptions: [] as SystemData.Instance[], // 系统
  });

  const { getOrgList, formatOrgId } = selectListMixins(state);

  onMounted(() => {
    getOrgList();
  });

  watch(
    () => props.detail,
    (val) => {
      if (val) {
        restoreData(val);
      } else {
        state.form = formData();
      }
    },
    {
      immediate: true,
    },
  );

  /**
   * 去除成员中不带姓名的的负责人数据
   */
  const removeMemberOnwer = (members = '', owner: string) => {
    const membersList = (members || '').split(',');
    const result = membersList.filter((member) => {
      return member != owner;
    });
    return result.join(',');
  };

  //赋初始值
  const restoreData = (val: SystemData.Instance | undefined) => {
    if (val) {
      Object.assign(state.form.data, val, {
        memberDisplay: memberDisplayFormat(val.membersName, val.owner, val.ownerName),
      });
      state.id = val.id;
      state.form.data.members = removeMemberOnwer(state.form.data.members, state.form.data.owner);
    }
  };
  const handleEdit = () => {
    state.editState = true;
  };
  const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        // 相关成员字段后端定义为字符串类型,所以需要转为字符串
        const data: SystemData.UpdateData = pick(state.form.data, [
          'parentId',
          'code',
          'type',
          'isOpen',
          'name',
          'owner',
          'ownerDep',
          'ownerName',
          'members',
          'membersName',
          'remark',
        ]);
        // 这里准备处理数据
        console.log('########', data);
        requestV1.systemUpdate({ data, replacements: { id: state.id } }).then((res) => {
          ElMessage.success('保存成功');
          state.editState = false;
          emits('getOrgsDetail');
        });
      } else {
        return false;
      }
    });
  };

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    restoreData(props.detail);
    state.editState = false;
  };
</script>
<style lang="less" scoped>
  .overview {
    width: 450px;

    .overview-form {
      margin-top: 20px;
      :deep(.el-form-item__content) {
        text-align: left;
      }
    }
  }
</style>
