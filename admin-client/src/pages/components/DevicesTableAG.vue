<template>
  <div style="width: 100%; height: 500px;">
    <VBtn color="primary" @click="$emit('hideDeviceTable')">
      <VIcon icon="mdi-arrow-left" /> View Carriers
    </VBtn>
    <div class="my-1">
      <span>Quick Filter:</span>
      <input type="text" id="filter-text-box" placeholder="Filter..." v-on:input="onFilterTextBoxChanged()">
    </div>
    <ag-grid-vue style="width: 100%; height: 100%;" class="ag-theme-alpine-dark" :columnDefs="columnDefs"
      :rowData="rowData" :defaultColDef="defaultColDef" @grid-ready="onGridReady" />
  </div>
</template>

<script lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import ActionsComponent from './ActionsComponent.vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import axios from '@axios'
export default {
  name: 'DevicesTableAG',
  components: {
    AgGridVue,
    ActionsComponent
  },
  setup() {
    const gridApi = ref()
    const defaultColDef = ref({
      flex: 1,
    })
    const onFilterTextBoxChanged = () => {
      gridApi.value.setGridOption(
        'quickFilterText',
        // @ts-ignore value is a HTTPInputElement but it's not recognized
        document.getElementById('filter-text-box')?.value
      );
    };
    const onGridReady = async (params: any) => {
      gridApi.value = params.api;

      const updateData = (data: Device[]) => (rowData.value = data);

      const results = await axios.get('device-actions/devices')
      updateData(results.data.data)
      console.log(results.data)
    };
    const columnDefs = ref([
      {
        headerName: 'Active',
        field: 'active',
        sortable: true,
        cellRenderer: (params: { value: boolean }) => {
          return params.value ? 'Active' : 'Deactivated'
        }
      },
      { headerName: 'Status', field: '', sortable: true, filter: true, resizable: true },
      { headerName: 'Name', field: 'name', sortable: true, filter: true, resizable: true },
      { headerName: 'Activation Date', field: 'createdAt', sortable: true, filter: true, resizable: true },
      { headerName: 'Usage', field: 'dataUsage', sortable: true, filter: true, resizable: true },
      { headerName: 'Cap', field: '', sortable: true, filter: true, resizable: true },
      { headerName: 'Plan', field: '', sortable: true, filter: true, resizable: true },
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
      }
    ])
    const rowData = ref()


    return {
      onGridReady,
      onFilterTextBoxChanged,
      defaultColDef,
      gridApi,
      columnDefs,
      rowData

    }
  },
}
</script>


<route lang="yaml">
meta:
  action: read
  subject: Admin
</route>
