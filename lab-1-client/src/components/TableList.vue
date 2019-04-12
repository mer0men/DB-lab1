<template>
  <div>
    <vue-good-table 
      :rows="tableData" 
      :columns="columns" 
      :selectOptions="selectOption"
      @on-row-dblclick="viewTable"
      @on-selected-rows-change="selectionChanged">
      <div slot="selected-row-actions">
        <button class="btn btn-danger" @click="deleteTable" >Delete</button>
      </div>
    </vue-good-table>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'

export default {
  components: {
    VueGoodTable
  },
  data () {
    return {
      tableList: [],
      tableData: [],      
      columns: [{'field': 'tableName', 'label': 'Table name' }],
      selectOption: {
        enabled: true,
        selectOnCheckboxOnly: true,
        selectionInfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
      },
      selectedTables: []
    }
  },
  methods: {
    viewTable: function (params) {
      this.$router.push(`/tableview/${params.row.tableName}`)
    },
    deleteTable: function () {
      this.axios.post(`http://localhost:8000/db/tabledelete`, this.selectedTables, {headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then((res) => {
        console.log(res)
        this.$router.go()
      }).catch((err) => {
        alert(err)
      })
    },
    selectionChanged: function (params) {
      this.selectedTables = params.selectedRows.map(item => item.tableName)
      console.log(this.selectedTables)
    }
  }, 
  created () {
    this.axios.get('http://localhost:8000/db/tablelist/', {headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then((res) => {
      this.tableList = res.data
      res.data.forEach(item => {
        this.tableData.push({'tableName' : item.name})
      })
    })
  }
}
</script>
