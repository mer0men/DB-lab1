<template>
  <div>
    <simplert 
      :useRadius="true"
      :useIcon="false"
      refs="simplert">
    </simplert>
    <vue-good-table :rows="tableData" :columns="columns"/>
    <form-json v-if="insertForm" :formFields="schema" :formName="name" v-model="newItem"></form-json>
    <button class="btn btn-dark" @click="openAlert">asd</button>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import 'bulma/css/bulma.min.css'
import 'vue-form-json/dist/vue-form-json.css'
import formJson from 'vue-form-json'
import Simplert from 'vue2-simplert'
require('vue2-simplert/dist/simplert.css')

export default {
  components: {
    VueGoodTable,
    formJson,
    Simplert
  },
  props: {
    tableName: {
      requier: true
    }
  },
  data () {
    return {
      obj: {
        title: 'Custom Function',
        message: 'Click close to trigger custom function',
        type: 'info',
        onClose: this.onClose
      },
      name: 'name',
      columns: [],
      tableData: [],
      actions: [],
      schema: [],
      newItem: {},
      insertForm: false
    }
  },
  methods: {
    onClose: function () {
      console.log("alert closed")
    },
    openAlert: function () {
      console.log(this.$refs.simplert)
    }
  },
  created () {
    this.axios.get(`http://localhost:8000/db/viewtable/${this.tableName}`, {headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then((res) => {
      this.tableData = res.data
      console.log(res.data)
      this.axios.get(`http://localhost:8000/db/tableschema/${this.tableName}`, {headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then((res) => {
        let schemaObj = [
          {
          'html' : `<h1>Добавить элемент в таблицу ${this.tableName}</h1>`,
          }
        ]

        for (let item of res.data) {
          this.columns.push({
            'field': item.name,
            'label': item.name
          })

          schemaObj.push({
            'label': item.name,
            'placeholde' : item.name
          })          
        }
        console.log(schemaObj)
        this.schema = schemaObj
        this.insertForm = true
        console.log(this.schema)
      })
    })
  }
}
</script>

