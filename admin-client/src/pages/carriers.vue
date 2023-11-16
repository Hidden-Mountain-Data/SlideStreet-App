<template>
  <VRow class="match-height">
    <VCol cols="12">
      <DeviceDataTable />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DeviceDataTable from '@/views/dashboards/DeviceDataTable.vue'
import DeviceService from '@/services/deviceServices'
const deviceService = new DeviceService()

onMounted(async () => {
  try {
    const devices = await deviceService.getAll()
    console.log(devices)
  } catch(error) {
    console.error(error)
  }
})
</script>
