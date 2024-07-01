<template>
  <SelfDialog
    :title="props.title"
    @close="handleClose"
    :visible="props.visible"
    :append-to-body="true"
    :width="props.width"
    class="success-dialog"
  >
    <template #content>
      <p v-if="hasTitle" class="success-dialog-title text-center">
        <slot name="title"></slot>
      </p>
      <div v-if="!hasTitle" @click.stop.prevent="handleClose" class="success-dialog-close">
        <el-icon><Close /></el-icon>
      </div>
      <div v-if="hasContent" class="success-dialog-content text-center">
        <p class="text-center success-icon">
          <el-icon size="29px" color="#12B35D">
            <CircleCheckSolid />
          </el-icon>
        </p>
        <slot name="content"></slot>
      </div>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </SelfDialog>
</template>
<script lang="ts" setup>
  import CircleCheckSolid from '@/components/icon/CircleCheckSolid.vue';
  import { Close } from '@element-plus/icons-vue';
  import SelfDialog from './SelfDialog.vue';
  import { PropType } from 'vue/dist/vue';
  const emit = defineEmits(['close']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    hasTitle: {
      type: Boolean,
      default: true,
    },
    hasContent: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '提示',
    },
    width: {
      type: String as PropType<string>,
      default: undefined,
      required: false,
    },
  });
  const handleClose = () => {
    emit('close');
  };
</script>
<script lang="ts">
  export default {
    name: 'SuccessDialog',
  };
</script>
