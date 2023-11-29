<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Devices</VCardTitle>
      <template #append>
        <div class="me-n3">
          <VBtn icon size="x-small" variant="text" color="default">
            <VIcon size="24" icon="mdi-dots-vertical" />
          </VBtn>
        </div>
      </template>
    </VCardItem>
    <VContainer>
      <VRow>
        <VCol cols="12">
          <DevicesTable />
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>

<script lang="ts">
import DevicesTable from '@/@layouts/components/DevicesTable.vue';
export default {
  name: 'devices',
  components: {
    DevicesTable
  }
}


</script>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 2.625rem;
}
</style>

<route lang="yaml">
meta:
  action: read
  subject: Admin
</route>
