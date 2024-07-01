<template>
  <!-- // 0：待审核   1：审核未通过  2： 审核通过  3：撤回 -->
  <!-- 认证中 -->
  <el-alert v-if="props.status === 0" class="white-list-message" :closable="false" type="warning">
    一般两个工作日内审核完成，如需加急，请邮件至dmzd@jd.com。
  </el-alert>
  <!-- 认证失败 -->
  <el-alert
    v-else-if="props.status === 1"
    class="white-list-message"
    :closable="false"
    type="error"
  >
    {{ message }}，请核对<el-link
      type="primary"
      href="https://cloud.jdl.com/#/open-business-document/access-guide/157/54231"
      :underline="false"
      class="link"
      target="_blank"
      >《京东电子面单标准》</el-link
    >，重新提交认证
  </el-alert>
  <!-- 认证成功 -->
  <el-alert
    v-else-if="props.status === 2"
    class="white-list-message"
    :closable="false"
    type="success"
  >
    认证通过，您可正常调用京东接口获取打印数据。
  </el-alert>
  <!-- 未认证 props.status === 3 || "" -->
  <el-alert v-else class="white-list-message" :closable="false" type="info">
    您需要对接JOS平台或京东物流开放平台的接口，并使用与京东物流签约的商家编码实际下一单，下单后将面单打印出来，并提交至系统，打单后即可取消运单，以免产生费用。具体请查看
    <el-link
      type="primary"
      :underline="false"
      href="https://cloud.jdl.com/#/open-business-document/access-guide/157/54292"
      >《商家白名单认证手册》</el-link
    >
  </el-alert>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';

  const props = defineProps({
    status: {
      type: Number as PropType<number>,
    },
    message: {
      type: String as PropType<string>,
      default: '',
    },
  });
</script>
<script lang="ts">
  export default {
    name: 'WhiteListTooltip',
  };
</script>
