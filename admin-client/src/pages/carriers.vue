<template>
  <VRow class="match-height">
    <VCol cols="12">
      <CarrierWithPlans v-if="!devices" @show-device-table="showDeviceTable" />
      <DevicesTableAG v-if="devices" @hide-device-table="hideDeviceTable" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CarrierWithPlans from '@/@layouts/components/CarrierWithPlans.vue';
import DevicesTableAG from './components/DevicesTableAG.vue';

let devices = ref(false);
const showDeviceTable = () => {
  devices.value = true;
};
const hideDeviceTable = () => {
  devices.value = false;
};


// const i18n = {
//   messages: {
//     en: {
//       Carriers: 'Carriers',
//     },
//   },
// };
</script>

<route lang="yaml">
meta:
  action: read
  subject: Admin
</route>

