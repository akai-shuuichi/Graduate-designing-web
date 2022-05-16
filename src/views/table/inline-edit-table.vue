<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="餐厅id" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="餐厅楼层" width="80">
        <template slot-scope="{row}">
          <span>{{ row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="负责人">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="手机号">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="任职状态" width="110">
        <template >
          <span>在职</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="餐厅负责人信息">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.originalTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            确认
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchDiningList } from '@/api/article'

export default {
  name: 'InlineEditTable',
  /* filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  }, */
  data() {
    return {
      title: undefined,
      edit: false,
      originalTitle: undefined,
      tablekey: 0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      fetchDiningList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.data.length
        for (let i = 0; i < this.total; i++) {
          this.list[i].edit = false
          this.list[i].title = this.list[i].name + ': ' + this.list[i].phone
          this.list[i].originalTitle = this.list[i].title
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      /* const items = data.items
      console.log(items)
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      }) */
      this.listLoading = false
    },
    cancelEdit(row) {
      console.log(row)
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: '已取消修改值',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: '已保存修改值',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
