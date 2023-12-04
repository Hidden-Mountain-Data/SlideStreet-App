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
      :rowData="rowData" :defaultColDef="defaultColDef" @grid-ready="onGridReady" :autoSizeStrategy="autoSizeStrategy" />
  </div>
</template>

<script lang="ts">
import * as demoCode from '@/views/demos/components/dialog/demoCodeDialog'
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
      // flex: 1,
    })
    const onFilterTextBoxChanged = () => {
      gridApi.value.setGridOption(
        'quickFilterText',
        // @ts-ignore value is a HTTPInputElement but it's not recognized
        document.getElementById('filter-text-box')?.value
      );
    };
    const autoSizeStrategy = ref();
    onBeforeMount(() => {
      autoSizeStrategy.value = {
        type: 'fitGridWidth',
        defaultMinWidth: 100,
        columnLimits: [
          {
            colId: 'Actions',
            minWidth: 900,
          },
        ],
      };
    });
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
      { headerName: 'Network Status', field: 'status', sortable: true, filter: true, resizable: true },
      { headerName: 'Name', field: 'name', sortable: true, filter: true, resizable: true },
      { headerName: 'Activation Date', field: 'created_at', sortable: true, filter: true, resizable: true },
      { headerName: 'Usage', field: 'data_usage', sortable: true, filter: true, resizable: true },
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
        width: 300,
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
      rowData,
      demoCode,
      autoSizeStrategy,
    }
  },
}
</script>


<route lang="yaml">
meta:
  action: read
  subject: Admin
</route>
