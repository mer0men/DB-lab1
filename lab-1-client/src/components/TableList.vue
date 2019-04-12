<template>
  <div>
    <vue-good-table :rows="tableData" :columns="columns" @on-row-click="viewTable"/>
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
    }
  },
  methods: {
    viewTable: function (params) {
      this.$router.push(`/tableview/${params.row.tableName}`)
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
