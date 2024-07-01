<template>
  <div class="access-system-dialog">
    <el-dialog
      v-model="props.dialogFormVisible"
      @closed="resetForm(systemFormRef, false)"
      width="600px"
      center
      title="接入系统"
      :close-on-click-modal="false"
    >
      <el-form
        class="dialog-form"
        ref="systemFormRef"
        :model="form"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="所属父系统" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择所属父系统" style="width: 100%">
            <el-option label="无" :value="0" />
            <el-option
              v-for="item in state.orgOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="系统编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入系统唯一编码" />
        </el-form-item>
        <el-form-item label="系统名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入系统名称" />
        </el-form-item>
        <el-form-item label="系统来源">
          <el-radio-group v-model="form.type" prop="type">
            <el-radio :label="1">京东内部系统</el-radio>
            <el-radio :label="2">京东外部系统</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <UserSelect
            v-model="form.owner"
            v-model:deptName.sync="form.ownerDep"
            v-model:name.sync="form.ownerName"
            placeholder="请输入系统归属团队负责人账号，支持ERP"
            :userType="form.type"
            :mustBPin="true"
          />
        </el-form-item>
        <el-form-item label="系统归属" prop="ownerDep">
          <el-input v-model="form.ownerDep" disabled />
        </el-form-item>
        <el-form-item label="相关成员" prop="members">
          <UserSelect
            v-model="form.members"
            v-model:name.sync="form.membersName"
            :multiple="true"
            placeholder="请输入添加成员"
            :userType="form.type"
          />
        </el-form-item>
        <el-form-item v-permission:系统开放 label="系统开放" prop="isOpen">
          <el-switch
            v-model="form.isOpen"
            class="ml-2"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="系统说明" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="可填写系统描述或用途，以便其他用户快速了解。"
            :rows="2"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSave(systemFormRef)">保存</el-button>
          <el-button @click="resetForm(systemFormRef, false)">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits } from 'vue';
  import { cloneDeep } from 'lodash';
  import { ElMessage } from 'element-plus';
  import { nextTick, PropType, watch } from 'vue';
  import { requestV1 } from '@/axios/request';
  import { SystemData } from '../../types/apis/systemData';
  import type { ElForm, FormRules } from 'element-plus';
  import selectListMixins from '../../mixins/selectList';
  import UserSelect from '../../components/select/user.vue';

  type FormInstance = InstanceType<typeof ElForm>;
  const systemFormRef = ref<FormInstance>();

  const form = reactive({
    parentId: null as number | null,
    code: '',
    type: 1,
    owner: '',
    // 所有者中文名
    ownerName: '',
    name: '',
    members: '',
    membersName: '',
    // 成员中文名
    ownerDep: '',
    remark: '',
    isOpen: 0,
  });

  const state = reactive({
    orgOptions: [] as SystemData.Instance[], // 系统
  });

  const { getOrgList } = selectListMixins(state);

  // onMounted(() => {
  //   getOrgList();
  // });

  // 默认选中第一个组织 如果接口后返回
  watch(
    () => state.orgOptions,
    (values) => {
      if (values && values.length && !form.parentId) {
        form.parentId = values[0].id;
      }
    },
    {
      immediate: true,
    },
  );

  // 默认选中第一个组织 如果接口先返回
  watch(
    () => props.dialogFormVisible,
    (visible) => {
      if (visible) {
        getOrgList();
        if (state.orgOptions && state.orgOptions.length && !form.parentId) {
          form.parentId = state.orgOptions[0].id;
        }
      }
    },
  );

  watch(
    () => form.type,
    () => {
      // 系统类型变化 清理之前选择的人员数据
      Object.assign(form, {
        owner: '',
        ownerDep: '',
        ownerName: '',
        members: '',
        membersName: '',
      });
    },
  );

  const rules: FormRules = {
    parentId: [
      {
        required: true,
        message: '请选择父系统',
      },
    ],
    code: [
      {
        required: true,
        message: '请输入系统唯一编码',
      },
      // {
      //   pattern: /^[0-9a-zA-Z]*$/,
      //   message: "系统编码只支持英文字符及数字",
      // },
      {
        // min: 0,
        min: 1,
        max: 50,
        message: '系统编码不能超过50个字符',
      },
    ],
    name: [
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
    type: [
      {
        required: true,
        message: '请选择系统类型',
      },
    ],
    owner: [
      {
        required: true,
        message: '请输入系统归属团队负责人账号，支持ERP',
      },
    ],
    remark: [
      {
        min: 0,
        max: 50,
        message: '系统说明不能超过50个字符',
      },
    ],
  };
  // props
  const props = defineProps({
    dialogFormVisible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  });
  // emits
  const emit = defineEmits(['closed']);

  const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        // 相关成员字段后端定义为字符串类型,所以需要转为字符串
        const data = cloneDeep(form);
        data.members = data.members.toString();
        data.membersName = data.membersName.toString();
        // 如果没有ID 那么不能传
        if (data.parentId === 0) {
          data.parentId = null;
        }
        requestV1.systemCreate({ data }).then(() => {
          ElMessage.success('创建成功');
          resetForm(formEl, true);
        });
      } else {
        return false;
      }
    });
  };

  // 关闭重置表单
  const resetForm = (formEl: FormInstance | undefined, refresh = false) => {
    emit('closed', refresh);
    nextTick(() => {
      if (!formEl) return;
      formEl.resetFields();
    });
  };
</script>

<style lang="less" scoped>
  .access-system-dialog {
    :deep(.el-dialog__body) {
      max-height: 600px;
      overflow-y: auto;
    }
  }
</style>
