<template>
  <div style="width: 100%; height: 500px;">
    <ag-grid-vue style="width: 100%; height: 100%;" class="ag-theme-alpine" :gridOptions="gridOptions"
      @gridReady="onGridReady"></ag-grid-vue>
    <!-- <ag-grid-vue :gridOptions="gridOptions" style="width: 100%; height: 100%;" class="ag-theme-alpine-dark" /> -->
  </div>
</template>

<script lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import ActionsComponent from './ActionsComponent.vue'
export default {
  components: {
    AgGridVue,
    ActionsComponent
  },
  data() {
    return {
      gridOptions: {
        columnDefs: [
          { headerName: 'Active', field: 'active', sortable: true, resizable: true },
          { headerName: 'Status', field: 'status', sortable: true, filter: true, resizable: true },
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
            // width: 150,
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
            usage: 123456,
            cap: 54321,
            plan: 'Premium',
            iccid: '123456789',
            imei: '987654321',
            eid: 'e123',
          },
          {
            active: false,
            status: 'Inactive',
            usage: 123453,
            cap: 54321,
            plan: 'Basic',
            iccid: '987654321',
            imei: '123456789',
            eid: 'e456',
          },
        ] as Device[],
      },
    }
  },

  methods: {
    onGridReady(params: any) {
      const api = params.api;

      // Auto-size columns after the grid is ready and data is loaded
      api.sizeColumnsToFit();
    },
  },
}
</script>