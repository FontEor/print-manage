<template>
  <el-dialog
    v-model="state.dialogVisible"
    :show-close="false"
    class="template-preview-dialog"
    :before-close="cancel"
  >
    <div class="template-preview-body">
      <div class="template-preview-img">
        <img
          :src="reactiveInstance.coverImage || 'https://storage.jd.com/print-images/no-cover.png'"
          alt=""
        />
      </div>
      <div class="template-preview-context">
        <div class="preview-context-header">
          <div class="context-header-act">
            <div class="context-header-title" @click.stop="onClickCopy(reactiveInstance.code)">
              {{ reactiveInstance.code }}&nbsp;<i class="card-title-icon jdl-icon-document-copy"></i
            ></div>
            <div @click.stop.prevent="onClose" class="preview-icon-close">
              <el-icon><Close /></el-icon>
            </div>
          </div>
          <div class="context-content-title">
            {{ reactiveInstance.name }}
          </div>
        </div>
        <el-divider />
        <!-- body -->
        <div class="preview-context-body">
          <el-form :model="reactiveInstance" label-position="right" label-width="70px">
            <el-form-item label="自定义区：">
              <el-tag
                v-if="reactiveInstance.hasCustom"
                class="ml-2"
                type="danger"
                effect="dark"
                size="small"
                >有自定义区</el-tag
              >
              <el-tag
                v-else
                class="ml-2 context-body-no-custom"
                type="info"
                effect="dark"
                size="small"
                >无自定义区</el-tag
              >
            </el-form-item>
            <el-form-item label="分类：">
              {{ reactiveInstance.templateFirstCategoryName || state.empty }} &ensp;/&ensp;{{
                reactiveInstance.templateSecondCategoryName || state.empty
              }}
            </el-form-item>
            <el-form-item label="尺寸：">
              {{ reactiveInstance.width }}*{{ reactiveInstance.height }}mm
            </el-form-item>
            <el-form-item label="提供方：">
              {{ reactiveInstance.orgName || state.empty }}
            </el-form-item>
            <el-form-item label="标签：">
              <template v-for="item in reactiveInstance.tags" :key="item">
                <el-tag
                  class="ml-2 context-body-no-custom"
                  type="info"
                  effect="dark"
                  size="small"
                  >{{ item }}</el-tag
                >
              </template>
            </el-form-item>
            <el-form-item label="使用说明：">
              {{ reactiveInstance.des || state.empty }}
            </el-form-item>
            <el-form-item label="更新人：">
              {{ reactiveInstance.updateUser || state.empty }}
            </el-form-item>
            <el-form-item label="更新时间：">
              {{ formatData || state.empty }}
            </el-form-item>
          </el-form>
        </div>
        <!-- footer -->
        <div class="preview-context-footer">
          <el-dropdown placement="bottom-start" popper-class="template-list-card-dropdown">
            <el-button class="context-footer-button" type="primary" size="small">使用</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-tooltip
                  v-if="reactiveInstance.addTemplateFlag === 1"
                  class="box-item"
                  effect="dark"
                  content="此模板已在你的模板列表中，不能重复选用"
                  placement="top"
                >
                  <span class="template-list-card-dropdown-disable">直接添加到列表</span>
                </el-tooltip>
                <el-dropdown-item @click="addToList" v-else>直接添加到列表</el-dropdown-item>
                <el-dropdown-item v-if="instance.hasCustom === 1" @click="editCustom"
                  >绘制自定义区</el-dropdown-item
                >
                <el-dropdown-item v-if="instance.type === 1" @click="editAllCustom"
                  >绘制整个模板</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, PropType, reactive, ref, onMounted } from 'vue';
  import { Close } from '@element-plus/icons-vue';
  import type { FormInstance } from 'element-plus';
  import { TemplateMarket } from '@/types/apis/template-market';
  import { copyFn } from '@/hooks/copy';

  export default defineComponent({
    components: { Close },
    props: {
      visible: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      instance: {
        type: Object as PropType<TemplateMarket.TemplateMarketListResponse>,
        required: true,
      },
      formatData: {
        type: String as PropType<string>,
        default: '',
      },
    },
    emits: ['close', 'edit-custom-list', 'edit--all-custom', 'add-to-list'],
    setup(props, { emit }) {
      const state = reactive({
        dialogVisible: false,
        empty: '-',
      });
      const reactiveInstance = reactive({
        ...props.instance,
      });
      const formRef = ref<FormInstance>();

      onMounted(async () => {
        state.dialogVisible = props.visible;
      });

      function addToList() {
        emit('add-to-list');
      }
      function editCustom() {
        emit('edit-custom-list');
      }
      function editAllCustom() {
        emit('edit--all-custom');
      }
      const onClickCopy = async (text: string) => {
        copyFn(text, {
          emptyMessage: '复制内容不存在',
        });
      };

      function cancel() {
        emit('close');
      }

      const onClose = () => {
        emit('close');
      };
      return {
        emit,
        state,
        props,
        reactiveInstance,
        formRef,
        addToList,
        editCustom,
        editAllCustom,
        cancel,
        onClickCopy,
        onClose,
      };
    },
  });
</script>
