<template>
  <div style="width: 100%; height: 500px;">
    <VBtn color="primary" @click="$emit('hideDeviceTable')">
      <VIcon icon="mdi-arrow-left" /> View Carriers
    </VBtn>
    <ag-grid-vue style="width: 100%; height: 100%;" class="ag-theme-alpine-dark" :gridOptions="gridOptions" />
  </div>
</template>

<script lang="ts">
import { useTheme } from 'vuetify'
import { AgGridVue } from 'ag-grid-vue3'
import ActionsComponent from './ActionsComponent.vue'
export default {
  components: {
    AgGridVue,
    ActionsComponent
  },
  setup() {
    return {
      gridOptions: {
        columnDefs: [
          { headerName: 'Active', field: 'active', sortable: true, resizable: true },
          { headerName: 'Status', field: 'status', sortable: true, filter: true, resizable: true },
          { headerName: 'Activation Date', field: 'activationDate', sortable: true, filter: true, resizable: true },
          { headerName: 'Usage', field: 'usage', sortable: true, filter: true, resizable: true },
          { headerName: 'Cap', field: 'cap', sortable: true, filter: true, resizable: true },
          { headerName: 'Plan', field: 'plan', sortable: true, filter: true, resizable: true },
          { headerName: 'ICCID', field: 'iccid', sortable: true, filter: true, resizable: true },
          { headerName: 'IMEI', field: 'imei', sortable: true, filter: true, resizable: true },
          { headerName: 'eID', field: 'eid', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Actions',
            cellRenderer: 'ActionsComponent',
            sortable: false,
            filter: false,
            cellRendererParams: function (params: any) {
              return {
                data: params.data,
              };
            },
          },
        ],
        rowData: [
          {
            active: true,
            status: 'Active',
            activationDate: '2021-01-01',
            usage: '1.2 GB',
            cap: '2 GB',
            plan: 'Unlimited',
            iccid: '12345678901234567890',
            imei: '123456789012345',
            eid: '12345678901234567890',
          },
          {
            active: false,
            status: 'Inactive',
            activationDate: '2021-01-01',
            usage: '1.2 GB',
            cap: '2 GB',
            plan: 'Unlimited',
            iccid: '12345678901234567890',
            imei: '123456789012345',
            eid: '12345678901234567890',
          }

        ],
      },
      vuetifyTheme: useTheme(),
    }
  },
}
</script>

