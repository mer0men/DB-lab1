<template>
  <div>
    <div class="row ml-4 mr-4 form-group">
      <label for="tableName"><h1>Table name</h1></label>
      <input class="form-control" id="tableName" v-model="tableName" placeholder="Table name" type="text"/>
    </div>
    <hr>
    <div v-for="(field, id) in tableFields" :key="field.id"  class="form-row form-group">
      <div class="col ml-4">
        <input class="form-control" :id="id" v-model="tableFields[id].name" placeholder="Field name" type="text"/>
      </div>
      <div class="col">
        <select class="form-control" v-model="tableFields[id].type">
          <option disabled value="">Type</option>
          <option>NULL</option>
          <option>INTEGER</option>
          <option>REAL</option>
          <option>TEXT</option>
          <option>BLOB</option>
        </select>
      </div>
      <div class="col">
          <p-check class="p-switch" v-model="tableFields[id].option.NOT_NULL.need">NOT NULL </p-check>
          <p-check class="p-switch" v-model="tableFields[id].option.UNIQUE.need">UNIQUE </p-check>
          <p-check class="p-switch" v-model="tableFields[id].option.PRIMARY_KEY.need">PRIMARY KEY </p-check>
          <p-check class="p-switch" v-model="tableFields[id].option.DEFAULT.need">DEFAULT</p-check>
          <input class="form-control" :id="-id" :disabled="!tableFields[id].option.DEFAULT.need" v-model="tableFields[id].option.DEFAULT.value" placeholder="DEFAULT value" type="text" />        
      </div>
      <div class="col-1 ">
        <button type="button" @click="removeField(field.id)" class="close float-left text-danger" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>      
    </div>
    <div class="row">
      <button class="btn btn-primary btn-lg btn-block offset-1 col-10" @click="addField((tableFields.length > 0) ? tableFields[tableFields.length - 1].id + 1 : 1)">Add field</button>
    </div>
    <div class="row mt-3">
      <button class="btn btn-lg btn-outline-success btn-block offset-1 col-10" @click="createTable">Create table</button>
    </div>
  </div>
</template>

<script>
class TableField {
  constructor (id) {
    this.id = id
    this.name = ''
    this.type = ''
    this.option = {
      'NOT_NULL': {
        'need': false
      },
      'UNIQUE': {
        'need': false
      },
      'PRIMARY_KEY': {
        'need': false
      },
      'DEFAULT': {
        'need': false,
        'value': ''
      }
    }
  }
}

export default {
  data () {
    return {
      tableName: '',
      tableFields: []
    }
  },
  methods: {
    addField: function (id) {
      this.tableFields.push(new TableField(id))
    },
    removeField: function (id) {
      const indx = this.tableFields.map(item => item.id).indexOf(id)
      this.tableFields.splice(indx, 1)
    },
    createTable: function () {
      console.log()
      for (let item in this.tableFields) {
        let arrayName = this.tableFields[item].name.split(' ')
        console.log(arrayName)
        this.tableFields[item].name = arrayName.length > 1 ? arrayName.join('_') : this.tableFields[item].name
      }

      let obj = {
        'tableName': this.tableName,
        'tableFields': this.tableFields
      }

      const url = 'http://localhost:8000/db/tablecreate'

      this.axios.post(url, obj, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }}).then((res) => {
        if (res.status !== 200) {
          console.log('Error:', res.status)
        } else {
          console.log(res)
          this.$router.go()
        }
      })
    }
  }
}
</script>
