<template>
  <div style="width: 150;">
    <IconBtn class="action-icon" icon="mdi-pencil" color="primary" @click="() => { info() }"></IconBtn>
    <v-icon class="action-icon" icon="mdi-play" @click="confirmActivate" color="success" />
    <v-icon class="action-icon" icon="mdi-pause" @click="confirmSuspend" color="info" />
    <v-icon class="action-icon" icon="mdi-delete" @click="confirmDelete" color="warning" />
  </div>
  <EditDeviceModal :device="device" v-model:is-dialog-visible="isDialogVisible" :data="params.data" />
</template>

<script lang="ts">
import EditDeviceModal from './EditDeviceModal.vue';
export default {
  name: 'ActionsComponent',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  methods: {
    confirmActivate() {
      if(window.confirm('Are you sure you want to activate this device?')) {
        this.activate();
      }
    },
    confirmSuspend() {
      if(window.confirm('Are you sure you want to suspend this device?')) {
        this.suspend();
      }
    },
    confirmDelete() {
      if(window.confirm('Are you sure you want to delete this device?')) {
        this.deleteItem();
      }
    },
    activate() {
      // Logic for Activate action
      console.log('Activate action clicked');
    },
    suspend() {
      // Logic for Suspend action
      console.log('Suspend action clicked');
    },
    info() {
      this.device = this.$props.params.data;
      this.isDialogVisible = !this.isDialogVisible;
      console.log(this.$props.params.data)
    },
    deleteItem() {
      // Logic for Delete action
      console.log('Delete action clicked');
    },
  },
  setup() {
    const isDialogVisible = ref(false);
    const device = ref();
    return {
      isDialogVisible,
      device,

    };
  },
  components: { EditDeviceModal }
}
</script>

<style>
/* Add styling for action icons if needed */
.actions-icons {
  display: flex;
  justify-content: space-around;
  /* align-items: center; */
}

.action-icon {
  cursor: pointer;
  margin: 0 5px;
  font-size: 18px;
}

/* Add any additional styling as per your requirements */
</style>
      