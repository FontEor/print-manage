<template>
  <div
    class="affix-right-container"
    @click="state.active = !state.active"
    :class="{
      active: state.active,
    }"
  >
    <div class="affix-right-button"></div>
    <div class="affix-right-content">
      <CreateButton />
    </div>
    <div class="affix-right-content">
      <CreateButton />
    </div>
    <div class="affix-right-content">
      <CreateButton />
    </div>
    <div class="affix-right-content">
      <CreateButton />
    </div>
    <div class="affix-right-content">
      <CreateButton />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import CreateButton from '../buttons/CreateButton.vue';
  const state = reactive({
    active: false,
  });
</script>

<script lang="ts">
  export default {
    name: 'AffixRight',
  };
</script>

<style>
  a {
    bottom: 20px;
    position: absolute;
    right: 2rem;
  }
</style>
