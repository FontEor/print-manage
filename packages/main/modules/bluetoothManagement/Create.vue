<template>
  <el-dialog
    width="600px"
    custom-class="bluetooth-create-dialog express-create-dialog source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    center
    :title="state.title"
    :close-on-click-modal="false"
  >
    <el-form
      class="disabled-form"
      :inline="true"
      ref="form"
      :model="state.form"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="设备厂商名称" prop="data.tradeName">
        <el-input
          placeholder="示例：快麦"
          v-model="state.form.data.tradeName"
          :disabled="props.action !== 'create'"
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="data.model">
        <el-input
          placeholder="示例：KM-306"
          v-model="state.form.data.model"
          :disabled="props.action !== 'create'"
        />
      </el-form-item>
      <el-form-item label="设备蓝牙名称" prop="data.regep">
        <el-input placeholder="示例：KM-306" v-model="state.form.data.regep" />
      </el-form-item>
      <el-form-item prop="data.channelStart">
        <template #label>
          蓝牙信道
          <el-tooltip
            effect="dark"
            content="请填写蓝牙打印的信道的service、characteristic信息，示例：FFF0  FFF2"
            placement="top-start"
          >
            <el-icon :size="15" class="ty50p">
              <InfoFilled />
            </el-icon>
          </el-tooltip>
        </template>
        <el-col :span="11">
          <el-input v-model="state.form.data.channelStart" placeholder="示例：FFF0" />
        </el-col>
        <el-col class="slice-line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="data.channelEnd">
            <el-input v-model="state.form.data.channelEnd" placeholder="示例：FFF2" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="支持的打印方式" prop="data.printType">
        <el-cascader
          v-model="state.form.data.printType"
          :options="state.printTypeTree"
          :props="{ multiple: true, emitPath: false }"
          clearable
          placeholder="请选择"
          size="small"
        />
      </el-form-item>
      <el-form-item label="推荐的打印方式" prop="data.recomandPrintType">
        <el-cascader
          v-model="state.form.data.recomandPrintType"
          :options="state.printTypeTree"
          :props="{ multiple: false, emitPath: false }"
          clearable
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="最大发送数据量" prop="data.maxByte">
        <el-input placeholder="示例：400" v-model.number="state.form.data.maxByte">
          <span slot="suffix">字节/次</span>
          <template #append>
            <span>字节/次</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import type { FormRules } from 'element-plus';
  import { InfoFilled } from '@element-plus/icons-vue';
  import { requestV1 } from '@/axios/request';

  import { CN_EN_NUM, EN_NUM_, NUM } from '../../const/regexp';
  import { Bluetooth } from '../../types/apis/bluetooth';
  import selectListMixins from '../../mixins/selectList';
  import { ENUMS } from '../../types/enums';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.tradeName': [
      {
        required: true,
        message: '请输入设备厂商名称',
      },
      {
        pattern: CN_EN_NUM,
        message: '请输入2-20位中文英文数字',
      },
      {
        min: 2,
        max: 20,
        message: '请输入2-20位中文英文数字',
      },
    ],
    'data.model': [
      {
        required: true,
        message: '请输入设备型号',
      },
      {
        pattern: EN_NUM_,
        message: '请输入2-20位英文数字-_',
      },
      {
        min: 2,
        max: 20,
        message: '请输入2-20位英文数字-_',
      },
    ],
    'data.regep': [
      {
        required: true,
        message: '请输入设备蓝牙名称',
      },
      // {
      //   pattern: EN_NUM_,
      //   message: "请输入2-20位英文数字-_",
      // },
      // {
      //   min: 2,
      //   max: 20,
      //   message: "请输入2-20位英文数字-_",
      // },
    ],
    'data.printType': [
      {
        required: true,
        message: '请选择支持的打印方式',
      },
    ],
    'data.recomandPrintType': [
      {
        required: true,
        message: '请选择推荐的打印方式',
      },
    ],
    'data.channelStart': [
      {
        pattern: EN_NUM_,
        message: '请输入0-50位英文数字-_',
      },
      {
        min: 0,
        max: 50,
        message: '请输入0-50位英文数字-_',
      },
    ],
    'data.channelEnd': [
      {
        pattern: EN_NUM_,
        message: '请输入0-50位英文数字-_',
      },
      {
        min: 0,
        max: 50,
        message: '请输入0-50位英文数字-_',
      },
    ],
    'data.maxByte': [
      {
        pattern: NUM,
        message: '请输入正整数',
      },
      // {
      //   type: 'number',
      //   min: 1,
      //   message: "请大于1",
      // },
    ],
  };

  const formData = (data?: Bluetooth.Instance): Bluetooth.CreateAxios | Bluetooth.UpdateAxios => {
    if (data) {
      return {
        replacements: {
          id: data.id,
        },
        data: {
          tradeName: data.tradeName,
          model: data.model,
          regep: data.regep,
          printType: data.printType,
          recomandPrintType: data.recomandPrintType,
          channelStart: data.channelStart,
          channelEnd: data.channelEnd,
          maxByte: data.maxByte,
        },
      };
    }
    return {
      data: {
        tradeName: '',
        model: '',
        regep: '',
        printType: [],
        recomandPrintType: '',
        channelStart: '',
        channelEnd: '',
        maxByte: undefined,
      },
    };
  };

  const state = reactive({
    visible: true,
    form: formData(),
    title: '',
    printTypes: [] as Bluetooth.PrintType[], // 打印方式
    printTypeTree: [] as ENUMS.LEVEL[], // 打印方式
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    action: {
      type: String as PropType<string>,
      default: 'create',
    },
    data: {
      type: Object as PropType<Bluetooth.Instance>,
    },
  });

  const { getPrintType } = selectListMixins(state);

  const emits = defineEmits(['closed']);

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        switch (props.action) {
          case 'create':
            state.title = '新增支持的蓝牙设备';
            getPrintType(true);
            break;
          case 'edit':
            state.title = '编辑支持的蓝牙设备';
            getPrintType(true).then(() => {
              state.form = formData(props.data);
            });
            break;
          case 'info':
            state.title = '查看支持的蓝牙设备';
            getPrintType(true).then(() => {
              state.form = formData(props.data);
            });
            break;
          default:
            break;
        }
      }
    },
  );

  const onClosed = ({ refresh }: { refresh: boolean } = { refresh: false }) => {
    state.form = formData();
    nextTick(() => {
      form.value?.clearValidate();
    });
    emits('closed', {
      refresh,
    });
  };

  const onConfirm = () => {
    form.value?.validate().then(() => {
      const data = clone(state.form);
      if ((data as Bluetooth.UpdateAxios).replacements?.id) {
        requestV1.bluetoothUpdate(data as Bluetooth.UpdateAxios).then(() => {
          ElMessage.success('更新成功');
          onClosed({ refresh: true });
        });
      } else {
        requestV1.bluetoothCreate(data as Bluetooth.CreateAxios).then(() => {
          ElMessage.success('创建成功');
          onClosed({ refresh: true });
        });
      }
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'BluetoothCreateDialog',
  };
</script>
