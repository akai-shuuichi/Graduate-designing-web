<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.title"
        placeholder="请输入您要查询的窗口"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
<!--      <el-select
        v-model="listQuery.importance"
        placeholder="Imp"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>-->
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="sortByType"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
<!--      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加新菜品
      </el-button>-->
<!--      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        export
      </el-button>-->
<!--      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        reviewer
      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->


      <!-- <el-table-column label="用户id" sortable="custom" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="窗口名称"  align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.shopinfo.shopName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="窗口介绍"  align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.shopinfo.shopRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价" align="center" width="450">
        <template slot-scope="{ row }">
          <span>{{ row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID"  align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ formatDate(row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统评价" sortable="custom" align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ formatscore(row.score) }}</span>
        </template>
      </el-table-column>



    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />


  </div>
</template>

<script>

import request from '@/utils/request'
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle, fetchByName, fetchByType
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
const calendarTypeOptions =  [{ key: '好评优先', display_name: '好评优先' }, { key: '差评优先', display_name: '差评优先' }]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination, PanThumb },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      picurl: {},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id:5,
        orderbysorce: 0,
        importance: undefined,
        title: undefined,
        type: '',
        sort: '差评优先'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      // statusOptions: ['published', 'draft', 'deleted'],
      statusOptions: ['主食','配菜','小吃','饮品'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: '主食'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatDate(time) {
     var date = new Date(time);
      var year=date.getFullYear();
      var month=date.getMonth()+1;
      var date=date.getDate();
       return   year+"-"+month+"-"+date
         }
     ,
    getList() {
      this.listLoading = true
      request({
        url: '/quality/queryAll',
        method: 'get',
        params: this.listQuery
        }).then((res)=>{
            this.list=res.data;
            this.total = res.data.length
            setTimeout(() => {
            this.listLoading = false
            }, 1.5 * 1000)
        })
    },
         formatscore(score){
        if(score>0.5){
          return "好评"
        }else if(score>=0){
          return "一般"
        }else if(score>-0.5){
          return "差评"
        }else{
          return "非常差"
        }
     },
    handleFilter() {
      this.listQuery.page = 1
      this.sortItem()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortItem() {
      this.listLoading = true
      fetchByName(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.data.length
        if (this.listQuery.title) {
          const newListData = []
          this.list.filter(item => {
            if (item.name.indexOf(this.listQuery.title) !== -1) {
              newListData.push(item)
            }
          })
          this.list = newListData
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    sortByType() {
      this.listLoading = true
      if (this.listQuery.sort == '差评优先') {
        this.listQuery.orderbysorce = 0
      } else if(this.listQuery.sort == '好评优先') {
        this.listQuery.orderbysorce = 1
      }
      request({
        url: '/quality/queryAll',
        method: 'get',
        params: this.listQuery
      }).then((res)=>{
        this.list=res.data;
        this.total = res.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = [
          'timestamp',
          'title',
          'type',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.image-uploader {
  width: 60%;
  height: 10%;
}
</style>
