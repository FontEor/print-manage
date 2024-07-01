<template>
  <el-popover
    @before-leave="handleClose"
    @before-enter="getCurrentSystemTagList"
    placement="right"
    :width="600"
    trigger="click"
  >
    <template #reference>
      <el-link type="primary" class="tag-manage-button" :underline="false">标签管理</el-link>
    </template>
    <div class="create-tag-wrap">
      <div class="tag-item" v-for="tagItem in state.list" :key="tagItem.name">
        <el-form
          :model="{}"
          class="tag-manage-form"
          :ref="onFromRef($el, tagItem.id)"
          v-if="state.updateTagId === tagItem.id && state.updateTagNameVisible"
          @submit.prevent
        >
          <el-form-item :rules="inputRule">
            <el-input
              v-model="state.updateTagName"
              class="tag-manage-add-input"
              size="small"
              @keyup.enter="handleConfirmUpdateTagName(tagItem.name, tagItem.id)"
              @blur="handleConfirmUpdateTagName(tagItem.name, tagItem.id)"
            />
          </el-form-item>
        </el-form>

        <el-tag
          v-else
          :key="tagItem.name"
          closable
          :disable-transitions="false"
          @close="handleCloseTag(tagItem)"
          :type="tagItem.type"
          @click="handleUpdateTagName(tagItem)"
          >{{ tagItem.name }}</el-tag
        >
      </div>
      <el-form
        class="tag-manage-form"
        :model="state.formData"
        ref="formRef"
        v-if="state.inputVisible"
        @submit.prevent
      >
        <el-form-item :rules="inputRule" prop="newTagName">
          <el-input
            v-model="state.formData.newTagName"
            class="tag-manage-add-input"
            size="small"
            @keyup.enter="handleInputConfirm(formRef)"
            @blur="handleInputConfirm(formRef)"
          />
        </el-form-item>
      </el-form>
      <el-tag v-else type="info" class="button-new-tag tag-item" @click="showInput">
        添加新标签
      </el-tag>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
  import { reactive, watch, nextTick, ref } from 'vue';
  import { ElInput, FormInstance, ElFormItem } from 'element-plus';
  import { TemplateTag } from '@/types/apis/template-tag';
  import { requestV2 } from '@/axios/request';
  import { Session } from '@/utils/session';
  import selectList from '@/mixins/selectList';
  import lodash from 'lodash';
  import { InternalRuleItem } from 'async-validator/dist-types/interface';

  const InputRef = ref<InstanceType<typeof ElInput>>();
  const formRef = ref<FormInstance>();
  const tagRefList: Record<string, typeof ElFormItem> = {};
  const emit = defineEmits(['close']);
  const setItemRef = (el: typeof ElFormItem, key: string) => {
    tagRefList[key] = el;
  };

  const state = reactive({
    list: [] as TemplateTag.TypeInstance[],
    tagList: [] as TemplateTag.Instance[],
    inputVisible: false,
    formData: {
      newTagName: '',
    },
    updateTagId: 0,
    updateTagNameVisible: false,
    updateTagName: '',
  });
  const { getCurrentSystemTagList } = selectList(state);
  const tagNameValidator = (
    rule: InternalRuleItem,
    value: string,
    callback: (arg?: Error | undefined) => void,
  ) => {
    if (value.length > 10) {
      callback(new Error('长度不超过10个字符'));
      return;
    }
    if (
      state.tagList.some((item: TemplateTag.Instance) => item.name === state.formData.newTagName)
    ) {
      callback(new Error('此标签名已经存在，请选择其他标签名'));
      return;
    }
    callback();
  };
  const inputRule = [
    {
      validator: tagNameValidator,
      trigger: 'change',
    },
  ];

  const typeList: TemplateTag.StyleType[] = ['', 'success', 'info', 'warning', 'danger'];
  const computeTagType = (): TemplateTag.StyleType => {
    const random = Math.floor(Math.random() * 5);
    return typeList[random];
  };

  const handleCloseTag = (tag: TemplateTag.TypeInstance) => {
    requestV2
      .tagDelete({
        replacements: {
          orgId: tag.orgId,
          id: tag.id,
        },
      })
      .then(() => {
        lodash.remove(state.list, (item) => item.id === tag.id);
      });
  };

  const handleClose = () => {
    emit('close');
  };

  const handleInputConfirm = (domRef: FormInstance | undefined) => {
    if (!domRef) return;
    if (!state.formData.newTagName) {
      state.inputVisible = false;
      return;
    }
    domRef.validate((valid) => {
      if (valid) {
        // 创建新标签
        requestV2
          .tagCreate({
            replacements: {
              orgId: Session.getOrgId(),
            },
            data: {
              tagName: state.formData.newTagName,
            },
          })
          .then(({ data }) => {
            const newTagItem: TemplateTag.TypeInstance = {
              id: data.id,
              orgId: data.orgId,
              name: data.name,
              type: computeTagType(),
            };
            state.list.push(newTagItem);
            state.formData.newTagName = '';
            state.inputVisible = false;
          });
      }
    });
  };
  const showInput = () => {
    state.inputVisible = true;
    nextTick(() => {
      InputRef.value!.input!.focus();
    });
  };

  const tagInstanceToTypeInstance = (tag: TemplateTag.Instance): TemplateTag.TypeInstance => {
    return {
      id: tag.id,
      orgId: tag.orgId,
      name: tag.name,
      type: computeTagType(),
    };
  };
  const handleUpdateTagName = (tagInfo: TemplateTag.Instance) => {
    state.updateTagId = tagInfo.id;
    state.updateTagNameVisible = true;
    state.updateTagName = tagInfo.name;
  };
  const handleConfirmUpdateTagName = (tagName: string, tagId: number) => {
    if (!tagName) {
      return;
    }
    if (state.updateTagName === tagName) {
      state.updateTagNameVisible = false;
      state.updateTagName = '';
      return;
    }
    const key = `InputRef${tagId}`;
    const activeItem = tagRefList[key];
    if (activeItem) {
      activeItem.validate((valid: boolean) => {
        console.log('valid', valid);
        if (valid) {
          // 更新标签
          requestV2
            .tagUpdate({
              replacements: {
                orgId: Session.getOrgId(),
                id: tagId,
              },
              data: {
                tagName: state.updateTagName,
              },
            })
            .then((response) => {
              console.log('response====', response);
              state.list.forEach((item) => {
                if (item.id === tagId) {
                  item.name = state.updateTagName;
                }
              });
              state.updateTagNameVisible = false;
              state.updateTagName = '';
            });
        }
      });
    }
  };

  const onFromRef = (el: typeof ElFormItem, id: number) => setItemRef(el, `InputRef${id}`);

  watch(
    () => state.tagList,
    (newVal) => {
      state.list = newVal.map(tagInstanceToTypeInstance);
    },
  );
</script>
