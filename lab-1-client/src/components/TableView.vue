<template>
  <div>
    <vue-good-table  
      max-height="250px" 
      :fixed-header="true" 
      :rows="tableData" 
      :columns="columns"
      :selectOptions="selectOption"
      @on-selected-rows-change="selectionChanged">
      <div slot="selected-row-actions">
        <button class="btn btn-danger" @click="deleteRows" >Delete</button>
      </div>
    </vue-good-table>
    <div>
      <form-json v-if="formShow" class="shadow-lg p-3 mb-5 bg-white rounded fixed-top container-fluid h-100 justify-content-center align-items-center border-solid" :formFields="schema" :formName="name" v-model="newItem"></form-json>
    </div>

    <button v-if="this.tableName !== `custom`" class="btn btn-lg btn-outline-success btn-block mt-2 offset-1 col-10" @click="insertData">Insert Data</button>
    <hr>
    <div class="row mt-2">
      <div class="col-sm ml-2 mr-2">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Add column</h5>
            <label for="newColInput">Column name</label>
            <input id="newColInput" v-model="newColumn.name" placeholder="Name" type="text" name="" class="form-control">
            <select placeholder="option" class="form-control mt-2" v-model="newColumn.type">
              <option disabled value="">Type</option>
              <option>NULL</option>
              <option>INTEGER</option>
              <option>REAL</option>
              <option>TEXT</option>
              <option>BLOB</option>
            </select>
            <label for="newColInputOpt">Options</label>
            <input id="newColInputOpt" placeholder="Options" v-model="newColumn.option" type="text" name="" class="form-control">
            <button class="btn btn-outline-success mt-2" @click="addColumn">Add</button>
          </div>
        </div>
      </div>

      <!-- <div class="col-sm mr-2">
        <div class="card">
          <div class="card-body">
              <h5 class="card-title">Delete column</h5>
              <select class="form-control" v-model="columnForDelete">
                <option v-for="item in columnsForDelete" :key="item">{{ item }}</option>
              </select>
              <button class="btn mt-2 btn-outline-danger" @click="deleteColumn">Delete</button>
          </div>
        </div>
      </div>             -->
    </div>
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
    }, 
    customTableData: {
      requier: false
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
      newItem: {},
      selectedRows: [],
      newColumn: {},
      columnForDelete: "",
      columnsForDelete: [],
      selectOption: {
        enabled: true,
        selectOnCheckboxOnly: true,
        selectionInfoClass: 'custom-class',
        selectionText: 'rows selected',
        clearSelectionText: 'clear',
      }
    }
  },
  methods: {
    insertData: function () {
      this.formShow = true
    },
    selectionChanged: function (params) {
      this.selectedRows = params.selectedRows.map(item => item.rowid)
      console.log(this.selectedRows)
    },
    deleteRows: function () {
      this.axios.post(`http://localhost:8000/db/rowsdelete/${this.tableName}`, this.selectedRows, {headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then((res) => {
        console.log(res.data)
        this.$router.go()
      }).catch((err) => {
        console.log(err)
      })
    },
    addColumn: function () {
      this.axios.post(`http://localhost:8000/db/addcolumn/${this.tableName}`, this.newColumn,  {headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then(() => {
        console.log("OK")
        this.$router.go()
      }).catch(err => {
        console.log(err)
      }) 
    },
    deleteColumn: function () {
      this.axios.post(`http://localhost:8000/db/deletecolumn/${this.tableName}`, this.columnForDelete,  {headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then(() => {
        console.log("OK")
        this.$router.go()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    if (this.tableName !== 'custom') {
      this.axios.get(`http://localhost:8000/db/viewtable/${this.tableName}`, {headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then((res) => {
        this.tableData = res.data
        console.log(res.data)
        this.axios.get(`http://localhost:8000/db/tableschema/${this.tableName}`, {headers: {
          'Access-Control-Allow-Origin': '*'
        }}).then((res) => {
          console.log('rows:', res.data)          
          let schemaObj = [
            {
              'html' : `<h1>Добавить элемент в таблицу ${this.tableName}</h1>`,
            }
          ] 

          this.columns.push({
            'field': 'rowid',
            'label': 'rowid'
          })
          
          for (let item of res.data) {
            this.columns.push({
              'field': item.name,
              'label': item.name
            })

            this.columnsForDelete.push(item.name)

            schemaObj.push({
              'label': item.name,
              'placeholder' : item.name
            })          
          }
          console.log(schemaObj)
          this.schema = schemaObj
          this.insertForm = true
          console.log('schema: ', this.schema)
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    } else {
      console.log('tablename', this.tableName)
      console.log(Object.keys(this.customTableData[0]))
      this.schema.push({'html' : `<h1>Добавить элемент в таблицу ${this.tableName}</h1>`})
      Object.keys(this.customTableData[0]).forEach((item) => {
        console.log(item)
        this.columns.push({'field' : item, 'label' : item})
        this.schema.push({'label' : item, 'placeholder' : item})
      })
      console.log('schema: ',this.schema)
      this.tableData = this.customTableData
    }
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
          this.$router.go()
        }).catch(err => {
          alert(err)
        })
    })
  }
}
</script>

