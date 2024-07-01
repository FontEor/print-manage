<template>
  <AdjustmentSearchForm ref="searchForm" :model="searchData">
    <template #default>
      <el-form-item class="width-adjustment width-fixed" label="名称/编码" prop="codeOrName">
        <el-input
          v-model="searchData.codeOrName"
          class="list-search_item"
          placeholder="请输入名称或编码"
        />
      </el-form-item>
      <el-form-item class="width-adjustment width-fixed" label="模板分类">
        <el-cascader
          v-model="searchData.categories"
          :options="typeList"
          :props="{ multiple: true, value: 'code', label: 'name' }"
          class="list-search_item"
          clearable
          collapse-tags
          collapse-tags-tooltip
          filterable
          placeholder="选择模板分类"
        />
      </el-form-item>
      <el-form-item
        v-if="hasProvider"
        class="width-adjustment width-fixed"
        label="提供方"
        prop="org"
      >
        <el-input v-model="searchData.org" class="list-search_item" placeholder="输入模板提供方" />
      </el-form-item>
      <el-form-item class="width-adjustment width-fixed" label="尺寸">
        <SizeInput
          v-model:width="searchData.width"
          v-model:height="searchData.height"
          class="list-search_item"
        />
      </el-form-item>
      <el-form-item class="width-adjustment width-fixed" label="标签">
        <el-select
          v-model="searchData.tags"
          class="list-search_item"
          filterable
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="输入模板标签"
        >
          <el-option v-for="item in tagList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </template>
    <template #search>
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleSearch">查询</el-button>
    </template>
  </AdjustmentSearchForm>
</template>

<script lang="ts">
  import { defineComponent, PropType, reactive, UnwrapNestedRefs, ref } from 'vue';
  import { Session } from '@/utils/session';
  import AdjustmentSearchForm from '@/components/AdjustmentSearchForm.vue';
  import SizeInput from '@/components/templates/SizeInput.vue';
  import { TemplateCategory } from '@/types/apis/template-category';
  import { TemplateMarket } from '@/types/apis/template-market';
  import { ElMessage } from 'element-plus';

  export default defineComponent({
    components: { AdjustmentSearchForm, SizeInput },
    props: {
      tagList: {
        type: Array as PropType<string[]>,
      },
      typeList: {
        type: Array as PropType<TemplateCategory.Instance[]>,
      },
      hasProvider: {
        type: Boolean as PropType<Boolean>,
        default: true,
      },
    },
    emits: ['search'],
    setup(props, { emit }) {
      const searchForm = ref<InstanceType<typeof AdjustmentSearchForm>>();
      const initQuery = function (): TemplateMarket.SearchData {
        return {
          codeOrName: '',
          org: '',
          categories: [],
          width: undefined,
          height: undefined,
          tags: [],
          orgId: Session.getOrgId(),
        };
      };
      const searchData: UnwrapNestedRefs<TemplateMarket.SearchData> = reactive(initQuery());
      function handleReset() {
        if (searchForm.value) {
          searchForm.value.formReset();
          Object.assign(searchData, initQuery());
          emit('search', searchData);
        }
      }
      async function handleSearch() {
        if (!searchForm.value) return;
        const passCheck = await searchForm.value.fromCheck();
        if (!passCheck) return;
        let regex = /^[1-9]\d*$/;
        if (
          (searchData.width && !regex.test(String(searchData.width))) ||
          (searchData.height && !regex.test(String(searchData.height)))
        ) {
          return ElMessage.error('尺寸请输入正整数');
        }

        console.log('searchData', searchData);
        emit('search', searchData);
      }
      return {
        ElMessage,
        searchForm,
        searchData,
        handleReset,
        handleSearch,
      };
    },
  });
</script>
