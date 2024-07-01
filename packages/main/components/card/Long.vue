<template>
  <el-card :class="`long-card ${props.canClick && 'cursor'}`" shadow="never" @click="onClickCard">
    <div class="long-card__body">
      <div class="card-image-container mr-12">
        <el-image
          :class="{ 'container-empty-img': imgUrl, container__border: !imgUrl }"
          :src="imgUrl || 'https://storage.jd.com/print-images/no-cover.png'"
          fit="contain"
        />
        <div v-if="imgUrl" @click.stop="onPreview" class="mask-view-mixin flex-center cursor">
          <el-icon><ViewIcon /></el-icon>
        </div>
        <div class="container-cover">
          <div class="container-cover-text">{{ orgName }}</div>
        </div>
      </div>
      <div class="body__content">
        <div class="content__header">
          <span class="header__title" @click.stop="onClickCopy(templateName)">
            {{ templateName }}<i class="card-title-icon jdl-icon-document-copy"></i>
          </span>
          <slot name="icon"></slot>
        </div>
        <!-- v-show-tip -->
        <div>
          <el-tooltip effect="dark" :content="name" placement="top">
            <div class="content__title">{{ name }}</div>
          </el-tooltip>
        </div>

        <div class="content__info"
          >{{ templateFirstCategoryName }} / {{ templateSecondCategoryName }}</div
        >

        <div class="content__info">{{ type }}</div>
        <div class="content__info">{{ size }}</div>

        <div class="content__tag" v-if="(privateTags && privateTags.length > 0) || hasCustom === 1">
          <!-- 自定义区 -->
          <el-tag v-if="hasCustom === 1" class="ml-2" type="danger" effect="dark" size="small"
            >有自定义区</el-tag
          >
          <!-- 小长度 -->
          <template v-if="privateTags.length <= 3">
            <template v-for="tag in privateTags" :key="tag">
              <el-tag v-if="tag" class="ml-2" size="small" type="info">{{ tag }}</el-tag>
            </template>
          </template>
          <!-- 大长度 -->
          <template v-if="privateTags.length > 3">
            <el-tag v-if="privateTags[0]" class="ml-2" size="small" type="info">{{
              privateTags[0]
            }}</el-tag>
            <el-tag class="ml-2" size="small" type="info">{{ privateTags[1] }}</el-tag>
            <el-tag class="ml-2" size="small" type="info">{{ privateTags[2] }}</el-tag>
            <el-tag class="ml-2 content__tag-tips" type="info">
              +{{ privateTags.length - 3 }}</el-tag
            >
          </template>
        </div>

        <div class="content__time">{{ time }}</div>
      </div>
    </div>
    <div v-if="showDivider" class="long-card__divider"></div>
    <div v-if="showFooter" class="long-card__footer">
      <div class="footer__ellipsis">
        <slot name="ellipsis"></slot>
      </div>
      <div class="footer__button">
        <slot name="button"></slot>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
  import { PropType, defineComponent, onMounted, reactive } from 'vue';
  import { View as ViewIcon } from '@element-plus/icons-vue';
  import { copyFn } from '@/hooks/copy';
  import { showTip } from '@/hooks/web/directives';

  export default defineComponent({
    name: 'LongCard',
    components: {
      ViewIcon,
    },
    directives: {
      'show-tip': showTip,
    },
    props: {
      imgUrl: {
        type: String,
        default: 'https://storage.jd.com/print-images/no-cover.png',
      },
      templateName: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: '',
      },
      templateFirstCategoryName: {
        type: String,
        default: '',
      },
      templateSecondCategoryName: {
        type: String,
        default: '',
      },
      tags: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      time: {
        type: String,
        default: '',
      },
      showDivider: {
        type: Boolean,
        default: true,
      },
      showFooter: {
        type: Boolean,
        default: true,
      },
      canClick: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      orgName: {
        type: String,
        default: '',
      },
      hasCustom: {
        type: Number as PropType<Number>,
        default: 0,
      },
    },
    emits: ['click-card', 'preview'],
    setup(props, ctx) {
      const onClickCard = () => {
        ctx.emit('click-card');
      };
      const onClickCopy = async (text: string) => {
        copyFn(text, {
          emptyMessage: '复制内容不存在',
        });
      };
      const onPreview = () => {
        ctx.emit('preview');
      };
      const privateTags = reactive([...props.tags]);
      onMounted(() => {
        if (props.hasCustom === 1) {
          privateTags?.unshift('');
        }
      });
      return { onClickCopy, onClickCard, onPreview, props, privateTags };
    },
  });
</script>
