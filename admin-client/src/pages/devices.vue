<template>
  <v-card>
    <v-card-item>
      <v-card-title>Devices</v-card-title>
      <template #append>
        <div class="me-n3">
          <v-btn icon size="x-small" variant="text" color="default">
            <v-icon size="24" icon="mdi-dots-vertical" />
          </v-btn>
        </div>
      </template>
    </v-card-item>
    <v-container>
      <v-row>
        <v-col cols="12">
          <DevicesTable />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import DevicesTable from '@/views/dashboards/DevicesTable.vue';
</script>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 2.625rem;
}
</style>
