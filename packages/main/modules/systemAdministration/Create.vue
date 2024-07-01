<template>
  <el-dialog
    :model-value="state.visible"
    :title="state.isEdit ? '申请编辑系统' : '申请创建系统'"
    width="520px"
    :close-on-click-modal="false"
    modal-class="create-template-dialog system-admin-create"
    @closed="handleClose(false)"
  >
    <el-form
      ref="systemFormRef"
      :model="state.form"
      :rules="rules"
      label-position="right"
      label-width="90px"
      class="create-template-form"
    >
      <el-form-item label="编码" prop="code">
        <el-input v-model="state.form.code" placeholder="示例：JDLSJM" :disabled="state.isEdit" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.form.name" placeholder="示例：京东零售京麦工作台" />
      </el-form-item>
      <el-form-item label="负责人" prop="owner">
        <OnlyERPUser
          v-model="state.form.owner"
          v-model:deptName.sync="state.form.ownerDep"
          v-model:name.sync="state.form.ownerName"
          @update:model-value="ownerSelectChange"
          :placeholder="state.ownerPlaceholder"
        />
      </el-form-item>
      <el-form-item label="系统归属" prop="ownerDep">
        <el-input v-model="state.form.ownerDep" disabled />
      </el-form-item>
      <el-form-item label="成员" prop="members">
        <OnlyERPUser
          class="members-multiple"
          v-model="state.form.members"
          v-model:name.sync="state.form.membersName"
          @update:model-value="membersSelectChange"
          :placeholder="state.membersPlaceholder"
          :multiple="true"
        />
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input
          v-model="state.form.remark"
          placeholder="可以填写系统描述或用途，帮助其他用户快速了解"
          :rows="2"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="callSystem" prop="channels">
        <el-input
          v-model="state.form.channels"
          placeholder="调用云打印接口时callSystem字段的传值内容，如：seller-order1，seller-order2；"
          :rows="2"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose(false)">取消</el-button>
      <el-button type="primary" @click="handleSave(systemFormRef)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, PropType, reactive, watchEffect, ref } from 'vue';
  import type { SystemData } from '@/types/apis/systemData';
  import type { SystemAdministration } from '@/types/apis/system-administration';
  import type { ElForm, FormRules } from 'element-plus';
  import { ElMessage } from 'element-plus';
  import OnlyERPUser from '@/components/select/OnlyERPUser.vue';
  import { cloneDeep } from 'lodash';
  import { requestV2 } from '@/axios/request';

  export default defineComponent({
    name: 'SystemCreate',
    components: { OnlyERPUser },
    props: {
      visible: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      row: {
        type: Object as PropType<SystemData.Instance>,
        default: () => {},
      },
      currentOrgIdByStore: {
        type: Number as PropType<Number>,
        default: 0,
      },
    },
    emits: ['close'],
    setup(props, { emit }) {
      type FormInstance = InstanceType<typeof ElForm>;
      const systemFormRef = ref<FormInstance>();
      const state = reactive({
        id: 0,
        visible: false,
        form: {
          code: '',
          name: '',
          owner: '',
          ownerDep: '',
          ownerName: '',
          remark: '',
          members: '',
          membersName: '',
          channels: '',
        } as SystemAdministration.Instance,
        isEdit: false,
        ownerPlaceholder: '负责审批加入系统的申请',
        membersPlaceholder: '请输入系统团队成员账号',
      });
      const rules: FormRules = reactive({
        code: [
          {
            required: true,
            message: '请输入系统唯一编码',
          },
          {
            pattern: /^[0-9a-zA-Z_-]+$/,
            message: '支持英文字符大小写及阿拉伯数字，不得超过30个字符',
          },
          {
            min: 2,
            max: 30,
            message: '系统编码长度应为：2-30个字符',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入系统名称',
          },
          {
            min: 2,
            max: 15,
            message: '系统名称长度应为：2-15个字符',
          },
        ],
        owner: [
          {
            required: true,
            message: '请输入系统归属团队负责人账号，支持ERP',
          },
        ],
        members: [
          {
            required: true,
            message: '请输入系统归属团队成员，支持ERP',
          },
        ],
        remark: [
          {
            required: true,
            message: '请输入系统说明',
          },
          {
            min: 10,
            max: 50,
            message: '系统说明长度应为：10-50个字符',
          },
        ],
        channels: [
          {
            min: 0,
            max: 300,
            message: '0-300个字符',
          },
        ],
      });
      watchEffect(async () => {
        state.visible = props.visible;
        state.isEdit = !!props?.row?.code;
        if (props?.row?.code) {
          await getOrgsDetail();
        }
      });
      function handleClose(refresh: boolean) {
        state.visible = false;
        systemFormRef?.value?.resetFields();
        emit('close', refresh);
      }
      function handleSave(formEl: FormInstance | undefined) {
        if (!formEl) return;
        formEl.validate((valid: any) => {
          if (valid) {
            // 相关成员字段后端定义为字符串类型,所以需要转为字符串
            const data = cloneDeep(state.form);
            data.members = data.members.toString();
            data.membersName = data.membersName.toString();
            if (props?.row?.code) {
              requestV2.systemUpdate({ data, replacements: { id: state.id } }).then(() => {
                ElMessage.success('保存成功');
                handleClose(true);
              });
            } else {
              requestV2.systemCreate({ data }).then(() => {
                ElMessage.success('创建成功');
                handleClose(true);
              });
            }
          } else {
            return false;
          }
        });
      }
      function ownerSelectChange(val: string) {
        state.form.owner = val;
        systemFormRef?.value?.validateField('owner');
      }
      function membersSelectChange(val: string) {
        state.form.members = val;
        systemFormRef?.value?.validateField('members');
      }
      async function getOrgsDetail() {
        const { id } = props.row;
        state.id = id;
        const response = await requestV2.systemDetail({
          replacements: { id },
        });
        const { data } = response;
        const { code, name, owner, ownerDep, ownerName, remark, members, membersName, channels } =
          data;
        state.form = {
          code,
          name,
          owner,
          ownerDep,
          ownerName,
          remark,
          members,
          membersName,
          channels,
        };
        restoreData(state.form);
      }
      /**
       * 去除成员中不带姓名的的负责人数据
       */
      function removeMemberOnwer(members = '', owner: string) {
        const membersList = (members || '').split(',');
        const result = membersList.filter((member) => {
          return member != owner;
        });
        return result.join(',');
      }

      //赋初始值
      function restoreData(val: SystemAdministration.Instance | undefined) {
        if (val) {
          state.form.members = removeMemberOnwer(state.form.members, state.form.owner);
        }
      }
      return {
        emit,
        props,
        state,
        rules,
        systemFormRef,
        handleClose,
        handleSave,
        ownerSelectChange,
        membersSelectChange,
        getOrgsDetail,
      };
    },
  });
</script>
