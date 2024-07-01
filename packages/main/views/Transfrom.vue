<template>
  <div class="transfrom-template-container">
    <div>
      <p>模板样式与旧版稍有不同，具体区别可参考下方预览图，您确认修改吗？</p>
      <div class="transfrom-template-content">
        <div>
          <el-image :src="state.prevSrc" fit="contain" />
          <el-button type="default" @click="onCancel">不修改</el-button>
        </div>
        <div>
          <el-image :src="state.nextSrc" fit="contain" />
          <el-button type="primary" @click="onSave">修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
  import { requestV1 } from '@/axios/request';
  import { useRoute } from 'vue-router';
  import { JWMS } from '../types/apis/jwms';
  import broadcastMessage, { BroadcastMessage } from '../utils/broadcast/message';
  import qs from 'qs';

  const route = useRoute();

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    prevSrc: '',
    nextSrc: '',
  });

  const onTransfrom = () => {
    const query = route.query as unknown as JWMS.LocationSearch;
    console.log('#######', query);
    requestV1
      .jwmsTransfromTemplate({
        replacements: {
          temId: query.temId,
          id: query.orgId,
        },
      })
      .then((response) => {
        console.log('response', response);
        state.prevSrc = response.data.jwmsImage;
        state.nextSrc = response.data.image;
      });
  };

  onMounted(() => {
    onTransfrom();
  });

  const onSave = () => {
    const query = route.query as unknown as JWMS.LocationSearch;
    console.log('#######', query);
    requestV1
      .jwmsTransfromSave({
        replacements: {
          orgId: query.orgId,
          temId: query.temId,
        },
        params: {
          sourceId: query.sourceId,
          isPublish: query.isPublish,
          verId: query.verId,
        },
      })
      .then((instance) => {
        const query = {
          ...route.query,
          verId: instance.data.id,
        };
        const queryString = qs.stringify(query);
        const url = `/editor/?${queryString}`;
        location.href = url;
      });
  };

  const onCancel = () => {
    broadcastMessage.sendMessage({
      type: 'close',
      data: null,
    });
    window.close();
  };
</script>
<script lang="ts">
  export default {
    name: 'TransfromTemplate',
  };
</script>

<style></style>
