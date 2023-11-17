<script>
import { AgGridVue } from "ag-grid-vue3"  // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue"


// Example load data from server
import axios from "axios"
import "ag-grid-community/styles/ag-grid.css" // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css" // Optional theme CSS

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  setup() {
    const gridApi = ref(null) // Optional - for accessing Grid's API

    // Obtain API from grid's onGridReady event
    const onGridReady = (params) => {
      gridApi.value = params.api
    }

    // const rowData = reactive({}) // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const columnDefs = reactive({
      value: [
        { field: "Active" },
        { field: "Status" },
        { field: "Device Name" },
        { field: "Usage" },
        { field: "Cap" },
        { field: "Plan" },
        { field: "ICCID" },
        { field: "IMEI" },
        { field: "eID" },
        {
          field: "Actions",
          cellRenderer: (params) => {
            const rowData = params.data
            return `<v-icon icon="mdi-information" size="24" color="info"></v-icon>`
          },
        },
      ],
    })

    const rowData = reactive({
      value: [
        {
          Active: true,
          Status: "Online",
          "Device Name": "Device 1",
          Usage: 50,
          Cap: 100,
          Plan: "Basic",
          ICCID: "1234567890",
          IMEI: "9876543210",
          eID: "EID123",
        },
        {
          Active: false,
          Status: "Offline",
          "Device Name": "Device 2",
          Usage: 30,
          Cap: 100,
          Plan: "Premium",
          ICCID: "0987654321",
          IMEI: "1234567890",
          eID: "EID456",
        },
        // Add more examples here...
      ],
    })

    // DefaultColDef sets props common to all Columns
    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1
    }
    //TODO add api call for data

    return {
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
      cellWasClicked: (event) => {
        console.log("cell was clicked", event)
      },
      deselectRows: () => {
        gridApi.value.deselectAll()
      }
    }
  },
}
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title>Devices</v-card-title>

      <template #append>
        <div class="me-n3">
          <v-btn icon size="x-small" variant="text" color="default">
            <v-icon size="24" icon="mdi-dots-vertical" />
            <v-icon icon="mdi-information" size="24" color="info"></v-icon>
          </v-btn>
        </div>
      </template>
    </v-card-item>
    <v-container>
      <v-row>
        <v-col cols="12">
          <ag-grid-vue class="ag-theme-alpine-dark" style="height: 500px" :columnDefs="columnDefs.value"
            :rowData="rowData.value" :defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true"
            @cell-clicked="cellWasClicked" @grid-ready="onGridReady">
          </ag-grid-vue>
        </v-col>
      </v-row>
    </v-container>

  </v-card>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 2.625rem;
}
</style>
