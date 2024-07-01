<template>
  <el-input
    v-model="props.value"
    placeholder="地址URL"
    class="upload-component"
    readonly
    @input="handleInput"
  >
    <template #append>
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        action="none"
        :limit="1"
        :show-file-list="false"
        :http-request="handleUpload"
      >
        <el-button class="upload-button" type="primary">上传</el-button>
      </el-upload>
    </template>
  </el-input>
</template>

<script setup lang="ts">
  import { requestV1 } from '@/axios/request';
  import { ElMessage, ElUpload } from 'element-plus';
  import type { UploadRequestOptions as ElUploadRequestOptions } from 'element-plus/es/components/upload/src/upload.d';
  import { ComponentPublicInstance, PropType, reactive, ref, watch } from 'vue';

  const uploadRef = ref<ComponentPublicInstance<typeof ElUpload>>();

  const props = defineProps({
    value: {
      type: String as PropType<string | undefined>,
    },
    maxSize: {
      type: Number as PropType<number>,
      default: 10240,
    },
  });

  const emits = defineEmits(['update:modelValue']);

  const state = reactive({
    innerValue: '' as undefined | string,
  });

  watch(
    () => props.value,
    (n) => {
      state.innerValue = n;
    },
    {
      immediate: true,
    },
  );

  const handleUpload = (options: ElUploadRequestOptions) => {
    const form = new FormData();
    form.append('file', options.file);
    if (props.maxSize * 1024 < options.file.size) {
      uploadRef.value?.clearFiles();
      return ElMessage.error(`图片上传体积过大，最大为${props.maxSize}KB`);
    }
    return requestV1
      .expressUploadLogo({
        data: form,
      })
      .then((response) => {
        const path = response.data.path;
        uploadRef.value?.clearFiles();
        emits('update:modelValue', path);
      })
      .catch(() => {
        uploadRef.value?.clearFiles();
      });
  };

  const handleInput = (val: string) => emits('update:modelValue', val);
</script>

<style></style>
