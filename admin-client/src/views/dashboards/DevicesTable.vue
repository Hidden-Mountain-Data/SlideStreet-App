<template>
  <div style="width: 100%; height: 500px;">
    <ag-grid-vue style="width: 100%; height: 100%;"
      :class="String(vuetifyTheme.global.name.value) === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
      :gridOptions="gridOptions" @gridReady="onGridReady"></ag-grid-vue>
  </div>
  <!--FIXME Class for dark/light mode not reactive with mode switch  -->
</template>

<script lang="ts">
import { useTheme } from 'vuetify'
import { AgGridVue } from 'ag-grid-vue3'
import ActionsComponent from './ActionsComponent.vue'
import DeviceService from '@/services/deviceServices';
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
        rowData: [],
      },
      vuetifyTheme: useTheme(),
    }
  },
  mounted() {
    this.fetchData();
    this.$watch(
      () => this.$vuetify.theme.global.name.value,
      () => { this.updateAGGridTheme() },
    );
  },

  methods: {
    async fetchData() {
      try {
        console.log("api URL", process.env.NEST_API_URL);
        const response = await DeviceService.getAll();
        this.gridOptions.rowData = response;
      } catch(error) {
        console.error('Error fetching data:', error);
      }
    },
    updateAGGridTheme() {
      const agGridTheme = String(this.vuetifyTheme.global.name.value) === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';

      const gridDiv = document.querySelector('.ag-theme-custom') as HTMLElement;
      gridDiv.classList.remove('ag-theme-alpine', 'ag-theme-alpine-dark');
      gridDiv.classList.add(agGridTheme);
    },
    onGridReady(params: any) {
      const api = params.api;

      // Auto-size columns after the grid is ready and data is loaded
      api.sizeColumnsToFit();
    },
  },
}
</script>
