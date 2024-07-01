<template>
  <div class="account-list-container">
    <el-tabs v-model="state.active">
      <el-tab-pane label="插件版本" name="version">
        <Version />
      </el-tab-pane>
      <el-tab-pane label="装机清单" name="install">
        <Install />
      </el-tab-pane>
      <el-tab-pane label="强制升级" name="listen">
        <Upgrade />
      </el-tab-pane>
      <el-tab-pane label="消息推送" name="message">
        <MessagePush />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import { reactive } from 'vue';

  import Install from './tabs/Install.vue';
  import Version from './tabs/Version.vue';
  import Upgrade from './tabs/Upgrade.vue';
  import MessagePush from './tabs/MessagePush.vue';

  // data数据
  const state = reactive({
    active: 'message',
  });

  defineExpose({});
</script>
<script lang="ts">
  export default {
    name: 'PluginInstall',
  };
</script>
