<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="餐厅编号" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="餐厅楼层">
        <template slot-scope="{row}">
          <span>{{ row.floor }}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="楼层负责人">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码" width="150">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="入职状态" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.status | statusfilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入职时间" width="150">
        <template slot-scope="{row}">
          <span>{{ row.indate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="离职时间" width="150">
        <template slot-scope="{row}">
          <span>{{ row.outdate | timefilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="楼层窗口数量" width="120">
        <template slot-scope="{row}">
          <span>{{ row.windowcount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="楼层商家数量" width="120">
        <template slot-scope="{row}">
          <span>{{ row.shopercount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            详细信息
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Drag" width="120">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->

        <el-form-item label="负责人编号" prop="title" label-width="60">
          {{temp.id}}
        </el-form-item>
        <el-form-item label="餐厅楼层" prop="title">
          {{temp.floor}}
        </el-form-item>
        <el-form-item label="名称" prop="title">
          {{temp.name}}
        </el-form-item>
        <el-form-item label="手机号" prop="title">
          {{temp.phone}}
        </el-form-item>
        <el-form-item label="入职时间" prop="title">
          {{temp.indate}}
        </el-form-item>
        <el-form-item label="入职时间" prop="title">
          {{temp.outdate | timefilter}}
        </el-form-item>
        <!--        <el-form-item label="分类">
                  <el-select
                    v-model="temp.status"
                    class="filter-item"
                    placeholder="分类"
                  >
                    <el-option
                      v-for="item in statusOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>-->
        <el-form-item label="备注">
          <el-input
            v-model="temp.extra"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <div class="show-d">
      <el-tag>The default order :</el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>The after dragging order :</el-tag> {{ newList }}
    </div>
  </div>


</template>

<script>
import { fetchDiningList, fetchList, fetchPv, fetchShoperList, updateArticle } from '@/api/article'
import Sortable from 'sortablejs'

export default {
  name: 'DragTable',
  data() {
    return {
      list: [],
      total: 0,
      tablekey:0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: true,
      oldList: [],
      newList: [],
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
      pvData: []
    }
  },
  filters:{
    statusfilter(val){
      if(val == 1)return '在职'
      return '离职'
    },
    timefilter(val){
      if(val !== null)return val
      return '-'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
       this.listLoading = true
       const { data } = await fetchDiningList(this.listQuery)
      console.log(data)
      this.list = data
      this.total = data.length
      this.listLoading = false
      this.oldList = this.list.map(v => v.id)
       this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
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
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
         this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
         const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
