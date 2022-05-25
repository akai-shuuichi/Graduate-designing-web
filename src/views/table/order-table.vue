<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.title"
        placeholder="查询订单编号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
<!--      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>-->
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
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        export
      </el-button>-->
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
      <!--      <template slot-scope="{ row }">
        &lt;!&ndash; <span>{{ row.item_url }}</span> &ndash;&gt;
        <img :src="row.item_url" width="110" height="110">
      </template>-->
      <el-table-column
        label="订单编号"
        sortable="custom"
        align="center"
        width="120"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商家名称"
        align="center"
        width="120"
      >
        <template slot-scope="{ row }">
          <span>{{ row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商家编号"
        align="center"
        width="120"
      >
        <template slot-scope="{ row }">
          <span>{{ row.shop_id  }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户编号"
        align="center"
        width="120"
      >
        <template slot-scope="{ row }">
          <span>{{ row.user_id  }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="成交价格"
        align="center"
        width="60"
      >
        <template slot-scope="{row}">
          <span>{{ row.order_price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易时间"
        align="center"
        width="280"
      >
        <template slot-scope="{row}">
          <span>{{ row.update_time | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易状态"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.ispay | statusFilter }}</span>
        </template>
      </el-table-column>



<!--            <el-table-column label="Date" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.createdata | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>-->
      <!--      <el-table-column label="Title" min-width="150px">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>-->
      <!--          <el-tag>{{ row.type | typeFilter }}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Author" width="110px" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.author }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span style="color:red;">{{ row.reviewer }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Imp" width="80px">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Readings" align="center" width="95">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>-->
      <!--          <span v-else>0</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Status" class-name="status-col" width="100">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <el-tag :type="row.status | statusFilter">-->
      <!--            {{ row.status }}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        label="操作"
        align="center"
        width="260"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row,$index)">
            详细信息
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            交易关闭
          </el-button>
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

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :key>
          <el-table :data="list[nowindex].order_items" border fit>
            <el-table-column
              label="商家编号"
              align="center">
              <template slot-scope="{ row }">
                {{row.shopid}}
              </template>
            </el-table-column>
            <el-table-column
              label="菜品编号"
              align="center">
              <template slot-scope="{ row }">
                {{row.id}}
              </template>
            </el-table-column>
            <el-table-column
              label="菜品名称"
              align="center">
              <template slot-scope="{ row }">
                {{row.name}}
              </template>
            </el-table-column>
            <el-table-column
              label="菜品种类"
              align="center">
              <template slot-scope="{ row }">
                {{row.cate}}
              </template>
            </el-table-column>
            <el-table-column
              label="原价"
              align="center">
              <template slot-scope="{ row }">
                {{row.baseprice}}
              </template>
            </el-table-column>
            <el-table-column
              label="现价"
              align="center">
              <template slot-scope="{ row }">
                {{row.nowprice}}
              </template>
            </el-table-column>
            <el-table-column
              label="用户评价"
              align="center">
              <template slot-scope="{ row }">
                {{row.user_talk | commentFilter }}
              </template>
            </el-table-column>
          </el-table>
<!--      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="图例" prop="item_url">
          <el-upload
            :data="picurl"
            :multiple="false"
            :show-file-list="false"
            drag
            action="http://127.0.0.1:8081/api/upload"
          >
            <img :src="temp.order_items" height="100%" width="100%">
          </el-upload>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          {{temp.name}}
        </el-form-item>
        <el-form-item label="分类" prop="title">
          {{temp.cate}}
        </el-form-item>
        <el-form-item label="商家编号" prop="title">
          {{temp.shopid}}
        </el-form-item>
        <el-form-item label="交易价格" prop="title">
          {{temp.nowprice}}
        </el-form-item>
        <el-form-item label="用户评价">
          <el-input
            v-model="temp.user_talk"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>-->

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
<!--        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>-->
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchOrderList,
  fetchPv,
  createArticle,
  updateArticle, fetchByType
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [{ key: '已支付', display_name: '已支付' }, { key: '未支付', display_name: '未支付' }, { key: '全部', display_name: '全部' }]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'OrderTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      if(status === 1)return '已支付'
      else if(status === 0)return '未支付'
      return '交易关闭'
    },
    commentFilter(comment){
      const leng = comment.length
      comment = comment.trim().substring(1,leng-2)
      return comment
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    dateFilter(date){
      date = new Date(date)
      const Y = date.getFullYear() + '-';
      const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      const D = date.getDate() + ' ';
      const h = date.getHours() + ':';
      const m = date.getMinutes() + ':';
      const s = date.getSeconds();
      return Y+M+D+h+m+s
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
        shopid:1,
        importance: undefined,
        title: undefined,
        size: 1,
        type: '',
        sort: '+id'
      },
      importanceOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
      nowindex:0,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then((response) => {
        // this.list = response.data
        // this.total = response.data.length
        const catedata = []
        const data = response.data
        const idToMap = new Map()
        const len = response.data.length
        // eslint-disable-next-line no-empty
        for (let i = 0; i < len; i++) {
          let item = data[i]
          for (let j = 0; j < item.length; j++) {
            let objs = item[j]
            // console.log(objs.order_items)
            objs.order_items = JSON.parse(objs.order_items)
            /* for (let k = 0; k < lover.length; k++) {
              const obj = lover[k]
              // if (obj !== null)console.log(obj)
              idToMap.set(obj.id, obj)
            } */
            console.log(objs.order_items)
            if(objs !== null)catedata.push(objs)
            // idToMap.set(objs.id, objs)
          }
        }
        this.list = catedata
        console.log(this.list)
        this.total = len
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    /* sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    }, */
    sortItem() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.data.length
        // if (this.listQuery.title) {
        //   const newListData = []
        //   this.list.filter(item => {
        //     if (item.name.indexOf(this.listQuery.title) !== -1) {
        //       newListData.push(item)
        //     }
        //   })
        //   this.list = newListData
        // }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    sortByID(order) {
      console.log(order)
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    sortByType() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.data.length
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      /*  if (this.listQuery.type === '全部') {
        fetchOrderList(this.listQuery).then((response) => {
          this.list = response.data
          this.total = response.data.length
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      } else {
        fetchByType(this.listQuery).then((response) => {
          this.list = response.data
          this.total = response.data.length
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      } */
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
    handleUpdate(row,index) {
      this.nowindex=index
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
