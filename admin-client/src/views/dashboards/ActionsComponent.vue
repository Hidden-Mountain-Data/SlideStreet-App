<template>
  <div style="width: 150;">
    <v-icon class="action-icon" icon="mdi-information" @click="info" color="info"></v-icon>
    <v-icon class="action-icon" icon="mdi-play" @click="activate" color="success"></v-icon>
    <v-icon class="action-icon" icon="mdi-pause" @click="suspend" color="info"></v-icon>
    <v-icon class="action-icon" icon="mdi-delete" @click="deleteItem" color="warning"></v-icon>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ActionsComponent',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  methods: {
    activate() {
      // Logic for Activate action
      console.log('Activate action clicked', this.params.data.iccid)
    },
    suspend() {
      // Logic for Suspend action
      console.log('Suspend action clicked')
    },
    info() {
      // Logic for Info action
      console.log('Info action clicked')
    },
    deleteItem() {
      // Logic for Delete action
      console.log('Delete action clicked')
    },
  },
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
