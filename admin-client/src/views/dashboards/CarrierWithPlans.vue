<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Teal</VCardTitle>

      <template #append>
        <div class="me-n3">
          <VBtn icon size="x-small" variant="text" color="default">
            <VIcon size="24" icon="mdi-dots-vertical" />
          </VBtn>
        </div>
      </template>
    </VCardItem>

    <VCardText class="pt-4">
      <VContainer>
        <VRow class="mb-1">
          <VCol cols="1">
            Description
          </VCol>
          <VCol cols="11">
            Connect any IoT device on 3,500+ global cellular networks, at the click of a button. TEAL gives you the
            freedom to choose the network you want within on eSIM platform you control.
          </VCol>
        </VRow>
        <VRow class="mb-1">
          <VCol cols="1">
            Number of SIMs
          </VCol>
          <VCol cols="1">
            6
          </VCol>
          <VCol cols="10" class="d-flex justify-end">
            <VBtn color="primary" to="/devices">
              View SIMs
            </VBtn>
          </VCol>
        </VRow>
        <VRow class="mb-1">
          <VCol cols="1">
            Services
          </VCol>
          <VCol cols="11">
            <VBtn color="error" class="me-2">
              Multi-Carrier
            </VBtn>
            <VBtn color="warning" class="me-2">
              Global
            </VBtn>
            <VBtn color="info" class="me-2">
              PPU
            </VBtn>
            <VBtn color="success" class="me-2">
              US Domestic
            </VBtn>
          </VCol>
        </VRow>
        <VRow class="mb-1">
          <VCol cols="1">

          </VCol>
          <VCol cols="11">
            <VRow>
              <VCol cols="4" v-for="i in 10" :key="i">
                <CardStatisticsVertical v-bind="newProject" style="background-color: #232b39;" />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VContainer>
    </VCardText>
  </VCard>
</template>
<script setup lang="ts">
import CardStatisticsVertical from '@core/components/CardStatisticsVertical.vue'
const newProject = {
  title: 'PlanName',
  color: 'primary',
  icon: 'mdi-briefcase-variant-outline',
  stats: '$.003 per MB',
  change: -0,
  subtitle: 'Cost',
}
</script>


<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 2.625rem;
}
</style>
