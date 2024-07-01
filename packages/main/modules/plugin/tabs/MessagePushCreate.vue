<template>
  <el-dialog
    width="1000px"
    custom-class="express-create-dialog source-create-dialog"
    @closed="onClosed"
    :modelValue="props.visible"
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
      label-width="120px"
      :disabled="props.action === 'info'"
    >
      <el-form-item label="消息名称" prop="data.name">
        <el-input placeholder="请输入消息名称" v-model="state.form.data.name" />
      </el-form-item>
      <el-form-item label="消息内容" prop="data.content">
        <div
          style="width: 100%; height: 300px; overflow: scroll"
          v-if="props.action === 'info'"
          v-html="decodeURIComponent(state.form.data.content)"
        ></div>
        <div
          v-if="props.visible && props.action !== 'info'"
          v-show="props.action !== 'info'"
          class="wang-editor-style"
        >
          <Toolbar :default-config="toolbarConfig" :editor="editorRef" />
          <Editor
            :defaultConfig="editorConfig"
            v-model="state.form.data.content"
            @on-created="onEditorCreated"
            style="width: 100%; height: 300px"
          />
        </div>
      </el-form-item>
      <el-form-item label="跳转链接" prop="data.link">
        <el-input placeholder="请输入组件端【点击查看】的跳转链接" v-model="state.form.data.link" />
      </el-form-item>
      <el-form-item label="推送类型" prop="data.type">
        <el-select v-model="state.form.data.type" placeholder="请选择推送类型" :filterable="true">
          <el-option
            v-for="item in pushTypeEnumList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="state.form.data.type !== 5"
        prop="data.codes"
        :rules="[{ required: true, message: '请选择展示时间' }]"
      >
        <template #label>
          {{ formatTypeLabel(state.form.data.type) }}
        </template>
        <el-input
          type="textarea"
          row="3"
          :placeholder="'请输入' + formatTypeLabel(state.form.data.type) + ',多个以英文逗号隔开'"
          v-model="state.form.data.codes"
        />
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="展示时机" prop="data.action">
            <el-select
              v-model="state.form.data.action"
              placeholder="请选择展示时机"
              :filterable="true"
            >
              <el-option
                v-for="item in actionEnumList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-if="state.form.data.action === 2"
            label=""
            label-width="0"
            prop="data.time"
            :rules="[{ required: true, message: '请选择展示时间' }]"
          >
            <el-time-picker
              v-model="state.form.data.time"
              format="HH:mm"
              placeholder="选择展示时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="state.form.data.action === 2" label="是否重复展示" prop="data.action">
            <el-select v-model="state.form.data.isRepeat" placeholder="请选择是否重复展示">
              <el-option :value="1" label="否" />
              <el-option :value="2" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="停留时长" prop="data.duration">
            <el-input
              placeholder="请输入在组件上弹框的停留时长"
              v-model.number="state.form.data.duration"
            >
              <template #suffix> 秒 </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button v-show="props.action !== 'info'" type="primary" @click="onConfirm">提交</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, shallowRef, onBeforeUnmount } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import type { FormRules } from 'element-plus';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IDomEditor, IToolbarConfig } from '@wangeditor/editor';

  import { requestV1 } from '@/axios/request';

  import { URL_REGEXP } from '../../../const/regexp';
  import { MessagePush } from '../../../types/apis/messagePush';

  import { timeHMSToISO } from '../../../utils/format/time';

  import {
    pushType as pushTypeEnumList,
    actions as actionEnumList,
    formatTypeLabel,
  } from '../../../enums/messagePush';

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
      type: Object as PropType<MessagePush.Instance>,
    },
  });

  /********* 富文本编辑器相关 开始 */
  // 编辑器唯一id值
  const editorRef = shallowRef<IDomEditor | undefined>(undefined);
  const toolbarRef = shallowRef<IToolbarConfig | undefined>(undefined);

  // 编辑器相关配置
  const editorConfig = {
    placeholder: '请输入内容...',
    readOnly: props.action === 'info',
  };
  // 工具栏相关配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['uploadImage', 'uploadVideo', 'fullScreen'],
  };

  const onEditorCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
  };

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });
  /********* 富文本编辑器相关 结束 */

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.name': [
      {
        required: true,
        message: '请输入消息名称',
      },
      {
        max: 50,
        message: '名称不能超过50个字符',
      },
    ],
    'data.content': [
      {
        required: true,
        message: '请输入消息内容',
      },
      {
        max: 5000,
        message: '内容不能超过5000个字符',
      },
      {
        validator: (rule, value, callback) => {
          console.log(rule, value, callback);
          const text = editorRef.value?.getText();
          if (text === '') {
            return callback(new Error('请输入内容'));
          } else {
            return callback();
          }
        },
      },
    ],
    'data.link': [
      {
        pattern: URL_REGEXP,
        message: '请输入正确的URL地址',
      },
      {
        max: 500,
        message: '链接不超过500个字符',
      },
    ],
    'data.type': [
      {
        required: true,
        message: '请选择推送类型',
      },
    ],
    'data.action': [
      {
        required: true,
        message: '请选择展示时机',
      },
    ],
    'data.duration': [
      {
        required: true,
        message: '请输入停留时长',
      },
      {
        type: 'number',
      },
    ],
  };

  const formData = (
    data?: MessagePush.Instance,
  ): MessagePush.CreateAxios | MessagePush.ChangeAxios => {
    if (data) {
      return {
        replacements: {
          id: data.id,
        },
        data: {
          name: data.name,
          content: data.content,
          link: data.link,
          type: data.type,
          action: data.action,
          isRepeat: data.isRepeat,
          time: timeHMSToISO(data.time),
          duration: data.duration,
          codes: data.codes,
        },
      };
    }
    return {
      data: {
        name: '',
        content: '',
        link: '',
        type: 5, // 类型默认
        action: 1, // 行为默认
        isRepeat: 1, // 行为默认
        time: undefined, // 行为默认
        duration: 30, // 行为默认
        codes: '', // 行为默认
      },
    };
  };

  const state = reactive({
    visible: true,
    form: formData(),
    title: '',
  });

  const emits = defineEmits(['closed']);

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        switch (props.action) {
          case 'create':
            state.title = '创建消息';
            break;
          case 'edit':
            state.title = '编辑消息';
            state.form = formData(props.data);
            break;
          case 'info':
            state.title = '查看消息';
            state.form = formData(props.data);
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
      const data: MessagePush.CreateAxios | MessagePush.ChangeAxios = clone(state.form);
      if ((data as MessagePush.ChangeAxios).replacements?.id) {
        requestV1.messagePushUpdate(data).then(() => {
          ElMessage.success('保存成功');
          onClosed({ refresh: true });
        });
      } else {
        requestV1.messagePushCreate(data).then(() => {
          ElMessage.success('创建成功');
          onClosed({ refresh: true });
        });
      }
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CreateDialog',
  };
</script>
