<template>
  <el-select
    v-model="state.innerValue"
    :placeholder="props.placeholder"
    :filterable="true"
    :remote="true"
    :remote-method="remoteOwnerMethod"
    :multiple="props.multiple"
    @change="onChange"
    style="width: 100%"
  >
    <el-option v-for="item in state.userList" :key="item.pin" :label="item.pin" :value="item.pin" />
  </el-select>
</template>

<script setup lang="ts">
  import { PropType, reactive, watch } from 'vue';
  import { uniq, compact } from 'lodash';
  import userMixins from '@/mixins/userOnlyERP';
  import { UserData } from '@/types/apis/userData';
  const { getERP } = userMixins();

  const props = defineProps({
    // 请输入系统归属团队负责人账号，支持ERP
    placeholder: {
      type: String as PropType<string>,
      default: '请输入系统归属团队负责人账号，支持ERP',
    },
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    multiple: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    // 名称
    name: {
      type: String as PropType<string>,
    },
  });

  const state = reactive({
    userList: [] as UserData.UserAndErpInstance[],
    innerValue: '' as string | string[],
  });

  const emits = defineEmits(['update:modelValue', 'update:deptName', 'update:name']);

  /**
   * 格式化后台返回的数据 后台每次都会给一个系统管理员相同的数据 然而我并不需要
   */
  const formatNames = (names = ''): string[] => {
    const list = (names || '').split(',');
    const result: string[] = [];
    list.forEach((item) => {
      const [erp, name] = item.split(':');
      if (erp && name) {
        result.push(item);
      }
    });
    return uniq(result);
  };

  watch(
    () => props.modelValue,
    (n) => {
      if (props.multiple) {
        state.innerValue = compact(uniq(n.split(',')));
      } else {
        state.innerValue = n;
      }
    },
    {
      immediate: true,
    },
  );

  const onChange = () => {
    if (state.innerValue) {
      if (props.multiple) {
        // 切割之前的姓名 可能是删除某个数据
        let names = formatNames(props.name);
        const instance = state.userList.find((user) => {
          return state.innerValue.includes(user.pin);
        });
        names = names.filter((name) => {
          const pin = name.split(':')[0];
          return state.innerValue.includes(pin);
        });
        if (instance) {
          names.push(`${instance.pin}:${instance.name}`);
        }
        emits('update:name', uniq(names).join(','));
      } else {
        const instance = state.userList.find((user) => {
          return user.pin === state.innerValue;
        });
        if (instance) {
          emits('update:deptName', instance.deptName);
          emits('update:name', instance.name);
        }
      }
    }
    emits('update:modelValue', state.innerValue.toString());
  };

  const remoteOwnerMethod = async (query: string) => {
    if (query !== '') {
      getERP(query).then((data) => {
        if (data && data.pin) {
          state.userList = [data];
        } else {
          state.userList = [];
        }
      });
    } else {
      state.userList = [];
    }
  };
</script>
