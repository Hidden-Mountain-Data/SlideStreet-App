<template>
  <VRow class="match-height">
    <VCol cols="12">
      <CarrierWithPlans />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DeviceService from '@/services/deviceServices'
import CarrierWithPlans from '@/views/dashboards/CarrierWithPlans.vue'
const deviceService = new DeviceService()

// onMounted(async () => {
//   try {
//     const devices = await deviceService.getAll()
//     console.log(devices)
//   } catch(error) {
//     console.error(error)
//   }
// })
</script>
