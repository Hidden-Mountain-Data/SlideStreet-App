<template>
  <VRow class="match-height">
    <VCol cols="12">
      <CarrierWithPlans v-if="!devices" @show-device-table="showDeviceTable" />
      <DevicesTable v-if="devices" @hide-device-table="hideDeviceTable" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue'
import DeviceService from '@/services/deviceServices'
import CarrierWithPlans from '@/@layouts/components/CarrierWithPlans.vue';
import DevicesTable from '@/@layouts/components/DevicesTable.vue';
import dataTable from './tables/data-table.vue';

let devices = ref(true);
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

