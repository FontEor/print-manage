<template>
  <el-dialog
    width="580px"
    custom-class="source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="新建半自定义模板"
    center
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="140px">
      <el-form-item label="模板编码" prop="customTempCode">
        <el-input placeholder="请输入模板唯一编码" v-model="state.form.customTempCode" />
      </el-form-item>
      <el-form-item label="模板名称" prop="customTempName">
        <el-input placeholder="请输入模板名称" v-model="state.form.customTempName" />
      </el-form-item>
      <!-- 添加数据源 -->
      <el-form-item label="数据源" prop="sourceId">
        <el-select v-model="state.form.sourceId" placeholder="选择数据源" clearable>
          <el-option
            v-for="source in state.sourceOptions"
            :key="source.id"
            :label="source.name"
            :value="`${source.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否分页" prop="isPage">
        <el-radio-group v-model="state.form.isPage">
          <el-radio :label="1">分页</el-radio>
          <el-radio :label="0">不分页</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="des">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="可填写模板描述或用途，以便其他用户快速了解"
          v-model="state.form.des"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, onMounted } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import { FormRules } from 'element-plus';
  import { requestV1 } from '@/axios/request';

  import { getSystem } from '../../mixins/system';
  import { System } from '../../types/apis/system';
  import { EN_NUM, CN_EN_NUM } from '../../const/regexp';
  import { TemplateImages } from '../../types/apis/template';
  import { Standard } from '../../types/apis/standard';
  import { Custom } from '../../types/apis/custom';
  import { SourceData } from '../../types/apis/sourceData';
  import selectListMixins from '../../mixins/selectList';
  import { Session } from '../../utils/session';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    customTempCode: [
      {
        required: true,
        message: '请填写模板编码',
      },
      {
        pattern: EN_NUM,
        message: '模板编码仅支持英文字母及数字',
      },
      {
        min: 0,
        max: 50,
        message: '模板编码不能超过50个字符',
      },
    ],
    customTempName: [
      {
        required: true,
        message: '请填写模板名称',
      },
      // {
      //   pattern: CN_EN_NUM,
      //   message: "模板名称只支持汉字、字母及数字"
      // },
      {
        min: 2,
        max: 50,
        message: '模板名称不能超过50个字符',
      },
    ],
    des: [
      {
        min: 0,
        max: 50,
        message: '备注不能超过50字符',
      },
    ],
    isPage: [
      {
        required: true,
        message: '请选择是否分页',
      },
    ],
  };

  const formData = (): Standard.CreateUserTemplateInfo => ({
    customTempCode: '',
    customTempName: '',
    des: '',
    isPage: 1,
    sourceId: '',
  });

  const state = reactive({
    visible: true,
    form: formData(),
    systems: [] as System.Instance[],
    sourceOptions: [] as SourceData.Instance[], //承运商
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    data: {
      type: Object as PropType<TemplateImages.Instance>,
    },
  });

  const emits = defineEmits(['close']);
  const { getSourceList } = selectListMixins(state); // 重置查询

  onMounted(() => {
    getSystem(state);
    getSourceList(Session.getOrgId());
  });

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        getSystem(state);
        getSourceList(Session.getOrgId());
      }
    },
  );

  const onClosed = () => {
    state.form = formData();
    nextTick(() => {
      form.value?.clearValidate();
    });
    emits('close');
  };

  const onConfirm = () => {
    form.value?.validate().then(() => {
      const data = clone(state.form);
      if (props.data) {
        const item = props.data;
        const params: Standard.CreateUserTemplateRelationAxios = {
          replacements: {
            orgId: Session.getOrgId(),
          },
          data: {
            createUser: item.createUser,
            customTempCode: data.customTempCode,
            customTempName: data.customTempName,
            deliveryCode: item.deliveryCode,
            specifId: item.specifId,
            des: data.des,
            hasCustom: item.hasCustom,
            height: item.height,
            isPage: data.isPage,
            tempCode: item.code,
            tempId: item.id,
            width: item.width,
            sourceId: data.sourceId,
          },
        };
        requestV1.userTemplateCreate(params).then((response) => {
          const data = response.data;
          ElMessage.success('创建成功');
          onClosed();
          window.open(
            `/editor/?tempType=2&orgId=${data.orgId || ''}&temId=${data.tempId}&sourceId=${
              data.sourceId || ''
            }&verId=&cid=${data.id}&templateCode=${data.code}`,
            '_blank',
          );
        });
      }
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CreateCustomDialog',
  };
</script>
