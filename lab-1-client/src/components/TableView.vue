<template>
  <div>
    <vue-good-table  max-height="500px" :fixed-header="true" :rows="tableData" :columns="columns"/>
    <div>
      <form-json v-if="formShow" class="shadow-lg p-3 mb-5 bg-white rounded fixed-top container-fluid h-100 justify-content-center align-items-center border-solid" :formFields="schema" :formName="name" v-model="newItem"></form-json>
    </div>

      <button class="btn btn-lg btn-outline-success btn-block mt-2 offset-1 col-10" @click="insertData">Insert Data</button>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import 'bulma/css/bulma.min.css'
import 'vue-form-json/dist/vue-form-json.css'
import formJson from 'vue-form-json'

export default {
  components: {
    VueGoodTable,
    formJson
  },
  props: {
    tableName: {
      requier: true
    }
  },
  data () {
    return {
      name: 'name',
      formShow: false,
      columns: [],
      tableData: [],
      actions: [],
      schema: [],
      newItem: {}
    }
  },
  methods: {
    insertData: function () {
      this.formShow = true;
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
  },
  mounted () {
    this.$root.$on('formSubmitted', values => {
      console.log('bug')
      this.formShow = false;
      console.log(values)
      this.axios.post(`http://localhost:8000/db/tableinsert/${this.tableName}`, values, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }}).then(() => {
          this.$router.go(`tableview/${this.tableName}`)
        }).catch(err => {
          alert(err)
        })
    })
  }
}
</script>

