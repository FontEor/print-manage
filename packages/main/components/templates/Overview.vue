<template>
  <div class="template-manage-basic-info-overview">
    <div class="overview-form">
      <el-form
        ref="templateFormRef"
        :class="`form-template detail-from disabled-form ${!state.editState && 'detail-form-view'}`"
        :model="formData"
        :rules="rules"
        :label-width="'152px'"
        :disabled="!state.editState"
      >
        <el-form-item v-if="state.detail.parentCode" label="基于创建的模板提示：">
          <p>基于：「{{ state.detail.parentCode }}」(「{{ state.detail.parentName }}」)创建</p>
        </el-form-item>
        <el-form-item label="模板编码：">
          <p>{{ state.detail.code }}</p>
        </el-form-item>
        <el-form-item label="模板名称：" prop="name">
          <el-input v-if="state.editState" v-model="formData.name" placeholder="请输入模板名称" />
          <p v-else>{{ state.detail.name }}</p>
        </el-form-item>
        <el-form-item label="模板分类：" prop="category">
          <el-cascader
            v-if="state.editState"
            :disabled="!!state.detail.parentCode"
            placeholder="请选择模板分类"
            v-model="formData.category"
            :options="state.categoryList"
            :props="{
              value: 'code',
              label: 'name',
            }"
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="list-search_item"
          />
          <p v-else>{{ state.detail.category }}</p>
        </el-form-item>
        <!-- 添加数据源 -->
        <el-form-item label="数据源：" prop="sourceId">
          <el-select
            v-model="formData.sourceId"
            v-if="state.editState"
            placeholder="未选择数据源"
            clearable
            :clear-icon="CircleClose"
          >
            <el-option
              v-for="item in state.sourceOptions"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}`"
            />
          </el-select>
          <p v-else>{{ state.detail.sourceName }}</p>
        </el-form-item>
        <el-form-item label="纸张尺寸：" :rules="{ required: true }">
          <div class="use-template-by-copy-size-wrap">
            <el-form-item prop="width" v-if="state.editState && !state.detail.parentCode">
              <el-select
                filterable
                allow-create
                default-first-option
                v-model="formData.width"
                placeholder="mm"
              >
                <template #prefix>宽</template>
                <el-option
                  v-for="item in widthList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <p v-else>{{ state.detail.width }}mm</p>
            <el-icon class="multiply"><Close /></el-icon>
            <el-form-item prop="height" v-if="state.editState && !state.detail.parentCode">
              <el-select
                filterable
                allow-create
                default-first-option
                v-model="formData.height"
                placeholder="mm"
              >
                <template #prefix>高</template>
                <el-option
                  v-for="item in heightList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <p v-else>{{ state.detail.height }}mm</p>
          </div>
        </el-form-item>
        <el-form-item label="是否含自定义区：" prop="hasCustom">
          <el-radio-group v-model="formData.hasCustom" v-if="state.editState">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <p v-else>
            {{ state.detail.hasCustom ? '是' : '否' }}
          </p>
        </el-form-item>
        <el-form-item label="标签：" prop="tags" class="tag-form-item">
          <template v-if="state.editState">
            <el-select
              multiple
              v-model="formData.tagIds"
              @change="handleSelectTag"
              placeholder="选择标签"
            >
              <el-option
                v-for="item in state.tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
            <TagManage @close="handleChangeTagList" />
          </template>
          <template v-else>
            <p class="basic-info-tag-item el-tag" v-for="item in state.detail.tags" :key="item.id">
              {{ item.name }}
            </p>
          </template>
        </el-form-item>
        <el-form-item class="form-item-instruction" label="使用说明：" prop="des">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.des"
            placeholder="可以填写模板描述或用途，帮助其他用户快速了解"
            v-if="state.editState"
          />
          <span v-else>{{ state.detail.des }}</span>
        </el-form-item>
        <el-form-item label="模板url：" prop="tempUrl">
          <span>{{ state.detail.tempUrl }}</span>
        </el-form-item>
        <el-form-item label="模板默认版本：">
          <span>{{ state.detail.currentDefaultVer }}</span>
        </el-form-item>
        <el-form-item v-if="props.allowEdit" label="开放至公网查询接口：">
          <el-switch v-model="formData.publicNetwork" :active-value="1" :inactive-value="0" />
          <!--  :before-change="beforePublishChange"  -->
        </el-form-item>
        <el-form-item label="扩展字段1：" prop="extend1">
          <el-input v-if="state.editState" v-model="formData.extend1" placeholder="请输入" />
          <span v-else>{{ state.detail.extend1 }}</span>
        </el-form-item>
        <el-form-item label="扩展字段2：" prop="extend2">
          <el-input v-if="state.editState" v-model="formData.extend2" placeholder="请输入" />
          <span v-else>{{ state.detail.extend2 }}</span>
        </el-form-item>
        <el-form-item label="扩展字段3：" prop="extend3">
          <el-input v-if="state.editState" v-model="formData.extend3" placeholder="请输入" />
          <span v-else>{{ state.detail.extend3 }}</span>
        </el-form-item>
        <el-form-item label="扩展字段4：" prop="extend4">
          <el-input v-if="state.editState" v-model="formData.extend4" placeholder="请输入" />
          <span v-else>{{ state.detail.extend4 }}</span>
        </el-form-item>
        <el-form-item label="扩展字段5：" prop="extend5">
          <el-input v-if="state.editState" v-model="formData.extend5" placeholder="请输入" />
          <span v-else>{{ state.detail.extend5 }}</span>
        </el-form-item>
        <el-form-item label="更新人：">
          <span>{{ state.detail.updateUser }}</span>
        </el-form-item>
        <el-form-item label="更新时间：">
          <span>{{ state.detail.updateTime }}</span>
        </el-form-item>
        <el-form-item label="创建人：">
          <span>{{ state.detail.createUser }}</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>{{ state.detail.createTime }}</span>
        </el-form-item>
      </el-form>
      <div v-if="props.allowEdit">
        <el-button type="primary" v-if="!state.editState" @click="handleEdit">编辑</el-button>
        <div v-if="state.editState">
          <el-button type="primary" @click="handleSave">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </div>
      </div>
    </div>
    <div class="overview-preview">
      <p class="preview-title">
        <span>默认版本预览图：</span>
        <span>默认版本：{{ state.detail.currentDefaultVer }}</span>
      </p>
      <el-image
        v-if="state.detail.defaultCoverImage"
        class="preview-image"
        :src="state.detail.defaultCoverImage"
        fit="contain"
      >
        <template #error>
          <div></div>
        </template>
      </el-image>
      <div v-else class="preview-image">
        <img src="@/assets/img/open-template/no-pic.png" alt="预览图" />
        <span class="demonstration">还未生成预览图</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, UnwrapNestedRefs } from 'vue';
  import { watch } from 'vue';
  import { useRoute } from 'vue-router';
  import type { ElForm } from 'element-plus';
  import { ElMessage } from 'element-plus';
  import CircleClose from '@/components/icon/CircleClose.vue';
  import { TemplateNew } from '@/types/apis/template-new';
  import TagManage from './TagManage.vue';
  import { requestV2 } from '@/axios/request';
  import { Session } from '@/utils/session';
  import { SourceData } from '@/types/apis/sourceData';
  import { TemplateCategory } from '@/types/apis/template-category';
  import { TemplateTag } from '@/types/apis/template-tag';
  import { rules } from './create-blank-template/rules';
  import selectList from '@/mixins/selectList';
  import { widthList, heightList } from './create-blank-template/sizes';

  type FormInstance = InstanceType<typeof ElForm>;
  const templateFormRef = ref<FormInstance>();
  const route = useRoute();

  const props = defineProps({
    code: {
      type: String,
      default: '',
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
  });

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    editState: false,
    detail: {} as TemplateNew.ListInstance,
    sourceOptions: [] as SourceData.Instance[],
    hasCustomOptionList: [
      {
        value: 0,
        label: '否',
      },
      {
        value: 1,
        label: '是',
      },
    ],
    id: 0,
    temId: 0,
    categoryList: [] as TemplateCategory.Instance[],
    tagList: [] as TemplateTag.Instance[],
  });

  const detailDataToFormData = (detail: TemplateNew.ListInstance): TemplateNew.EditForm => {
    return {
      code: detail.code,
      name: detail.name,
      hasCustom: detail.hasCustom,
      width: `${detail.width || ''}`,
      height: `${detail.height || ''}`,
      des: detail.des,
      orgId: detail.orgId,
      tagIds: (detail.tags || []).map((item) => item.id),
      category: [detail.templateFirstCategoryCode, detail.templateSecondCategoryCode],
      sourceId: `${detail.sourceId || ''}`,
      extend1: detail.extend1,
      extend2: detail.extend2,
      extend3: detail.extend3,
      extend4: detail.extend4,
      extend5: detail.extend5,
      publicNetwork: detail.publicNetwork,
    };
  };

  const formData: UnwrapNestedRefs<TemplateNew.EditForm> = reactive(
    detailDataToFormData({} as TemplateNew.ListInstance),
  );

  const { getSourceList, getCurrentSystemTagList, getCategoryList } = selectList(state);

  const getTemplateDetail = () => {
    const code = props.code;
    requestV2
      .templateDetail({
        replacements: {
          orgId: Session.getOrgId(),
          code: code,
        },
      })
      .then((response) => {
        if (response.code === 200) {
          state.detail = response.data;
          state.detail.category = setDetailCategory(
            response.data.templateFirstCategoryName,
            response.data.templateSecondCategoryName,
          );
          Object.assign(formData, detailDataToFormData(response.data));
        }
      });
  };

  const setDetailCategory = (
    templateFirstCategoryName?: string,
    templateSecondCategoryName?: string,
  ) => {
    let val = templateFirstCategoryName;
    if (templateSecondCategoryName) {
      val += '/' + templateSecondCategoryName;
    }
    return val;
  };

  const handleChangeTagList = () => {
    getCurrentSystemTagList();
  };

  onMounted(() => {
    const route = useRoute();
    state.id = Number(route.query.id);
    state.temId = Number(route.query.temId);
    getCategoryList();
    getSourceList(Session.getOrgId());
    getCurrentSystemTagList();
  });

  watch(
    [() => props.code],
    ([newCode]) => {
      if (newCode) {
        getTemplateDetail();
      }
    },
    {
      immediate: true,
    },
  );

  //  编辑按钮
  const handleEdit = () => {
    state.editState = true;
  };

  const fromDataToUpdateData = function (data: TemplateNew.EditForm): TemplateNew.UpdateData {
    return {
      code: data.code,
      name: data.name,
      hasCustom: data.hasCustom,
      width: `${data.width}`,
      height: `${data.height}`,
      des: data.des,
      orgId: data.orgId,
      tagIdList: data.tagIds,
      firstCategoryCode: data.category[0],
      secondCategoryCode: data.category[1],
      sourceId: data.sourceId,
      publicNetwork: data.publicNetwork,
      extend1: data.extend1,
      extend2: data.extend2,
      extend3: data.extend3,
      extend4: data.extend4,
      extend5: data.extend5,
    };
  };

  // 确认按钮
  const handleSave = () => {
    templateFormRef.value?.validate((valid: any) => {
      if (valid) {
        requestV2
          .templateUpdate({
            data: fromDataToUpdateData(formData),
            replacements: {
              orgId: Session.getOrgId(),
              code: route.query.templateCode as string,
            },
          })
          .then(() => {
            // 接口请求成功后交互
            ElMessage.success('保存成功');
            state.editState = false;
            getTemplateDetail();
          });
      }
    });
  };

  const resetForm = () => {
    state.editState = false;
    templateFormRef.value?.resetFields();
    Object.assign(formData, detailDataToFormData(state.detail));
  };

  // const beforePublishChange = (): Promise<boolean> => {
  //   console.log('更改开放至公网查询接口');
  //   let title: string, buttonText: string, publishText: string, status: 0 | 1;
  //   if (formData.publicNetwork == 1) {
  //     // 取消发布
  //     title = '确定取消发布吗？';
  //     buttonText = '确定取消';
  //     publishText = '取消发布';
  //     status = 0;
  //   } else {
  //     // 发布
  //     title = '确定发布吗？';
  //     buttonText = '确定发布';
  //     publishText = '发布';
  //     status = 1;
  //   }
  //   return new Promise((res, rej) => {
  //     ElMessageBox.confirm(title, '', {
  //       confirmButtonText: buttonText,
  //       cancelButtonText: '再想想',
  //       type: 'warning',
  //     })
  //       .then(() => {
  //         // 发布/取消发布
  //         requestV2
  //           .templatePublish({
  //             replacements: {
  //               orgId: Session.getOrgId(),
  //               code: props.code as string,
  //             },
  //             params: {
  //               status,
  //             },
  //           })
  //           .then(() => {
  //             ElMessage({
  //               type: 'success',
  //               message: `${publishText}成功`,
  //             });
  //             getTemplateDetail();
  //             return res(Boolean(status));
  //           })
  //           .catch(() => {
  //             ElMessage({
  //               type: 'error',
  //               message: `${publishText}失败`,
  //             });
  //             // 失败不更改状态
  //             return rej(Boolean(formData.publicNetwork));
  //           });
  //       })
  //       .catch(() => {
  //         return rej(false);
  //       });
  //   });
  // };
  const handleSelectTag = () => {
    if (formData.tagIds.length > 5) {
      ElMessage({
        message: '标签数量不超过5个',
        type: 'warning',
      });
      formData.tagIds.splice(-1);
    }
  };
</script>
