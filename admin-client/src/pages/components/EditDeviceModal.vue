<script setup lang="ts">
interface Props {
  device?: Device
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: Device): void
}

const props = withDefaults(defineProps<Props>(), {
  device: () => ({
    routerId: 0,
    simId: 0,
    userId: 0,
    name: '',
    notes: '',
    imei: '',
    iccid: '',
    serialNumber: '',
    dataUsage: '',
    eid: '',
    active: false,
    embedded: false,
    provider: '',
    createdAt: '2023-11-11 05:05:01.955',
    updatedAt: '2023-11-11 05:05:01.955',
    deletedAt: '2023-11-11 05:05:01.955',

  }),
})

const emit = defineEmits<Emit>()

const device = ref<Device>(structuredClone(toRaw(props.device)))
console.log('device on modal', device.value)
const resetForm = () => {
  emit('update:isDialogVisible', false)
  device.value = structuredClone(toRaw(props.device))
}

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', device.value)
}
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)">
    <VCard v-if="props.device?.name" class="pa-sm-8 pa-5">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="small" @click="resetForm" />

      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 text-center">
          {{ props.device.name ? 'Edit' : 'Add New' }}
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Subtitle -->
        <VCardSubtitle class="text-center mb-9">
          Device Details
        </VCardSubtitle>

        <!-- <VRow>
          <VCol v-for="type in addressTypes" :key="type.title" cols="12" sm="6">
            <div class="rounded border cursor-pointer border-opacity-100 pa-4"
              :class="selectedAddress === type.title ? 'bg-light-primary text-primary border-primary' : 'bg-var-theme-background text-high-emphasis border-secondary'"
              @click="selectedAddress = type.title">
              <div class="d-flex align-center font-weight-medium gap-2 text-xl mb-1">
                <VIcon size="24" :icon="type.icon" />
                <span>{{ type.title }}</span>
              </div>
              <span>{{ type.time }}</span>
            </div>
          </VCol>
        </VRow> -->

        <!-- 👉 Form -->
        <VForm class="mt-4" @submit.prevent="onFormSubmit">
          <VRow>
            <!-- 👉 Company Name -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.simId" label="Company Name" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.imei" label="Email" />
            </VCol>

            <!-- 👉 Tax ID -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.iccid" label="Tax ID" />
            </VCol>

            <!-- 👉 VAT Number -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.eid" label="VAT Number" />
            </VCol>

            <!-- 👉 Billing Address -->
            <VCol cols="12">
              <VTextarea v-model="device.serialNumber" rows="2" label="Billing Address" />
            </VCol>

            <!-- 👉 Contact -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.active" label="Contact" />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.embedded" label="Country" />
            </VCol>

            <!-- 👉 State -->
            <VCol cols="12" md="6">
              <VTextField v-model="device.provider" label="State" />
            </VCol>

            <!-- 👉 Zip Code -->
            <!-- <VCol cols="12" md="6">
              <VTextField v-model="device.zipCode" label="Zip Code" type="number" />
            </VCol> -->

            <!-- 👉 Submit and Cancel button -->
            <VCol cols="12" class="d-flex flex-wrap gap-4 gap-y-6 flex-column">
              <div>
                <VSwitch label="Make this default shipping address" />
              </div>

              <div class="d-flex justify-center gap-4">
                <VBtn type="submit">
                  submit
                </VBtn>

                <VBtn variant="tonal" color="secondary" @click="resetForm">
                  Cancel
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
