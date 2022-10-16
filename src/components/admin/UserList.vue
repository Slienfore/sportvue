<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--用户列表主体部分-->
    <el-card>
      <!--栅格系统-->
      <!--添加列宽-->
      <el-row :gutter="30">
        <el-col :span="10">
          <!--双向绑定数据-->
          <!--搜索框清除后还需要进行渲染数据-->
          <el-input v-model="queryInfo.query"
                    @clear="getUserList"
                    clearable
                    placeholder="请输入搜索内容">
            <!--点击搜索后进行搜索(页码还有页数不需要进行绑定)-->
            <el-button @click="getNewUserList"
                       slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <el-col :span="5">
          <el-button @click="addDialogVisible = true"
                     type="primary">添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--用户列表部分-->
      <el-table :data="userList"
                border
                stripe>
        <el-table-column type="index"
                         label="ID"
                         align="center"></el-table-column>
        <el-table-column prop="username"
                         align="center"
                         label="用户名"></el-table-column>
        <el-table-column prop="email"
                         align="center"
                         label="邮箱"></el-table-column>
        <el-table-column prop="password"
                         align="center"
                         label="密码"></el-table-column>
        <el-table-column paop="role"
                         align="center"
                         label="角色"></el-table-column>
        <el-table-column prop="state"
                         align="center"
                         label="状态">
          <!--作用域插槽-->
          <template slot-scope="scope">
            <!--&lt;!--每一行的数据--&gt;
            {{ scope.row }}
            { "id": 1, "username": "admin", "password": "123456", "email": "123@qq.com", "role": "超级管理员", "state": true }-->
            <!--传递当前行的用户信息-->
            <el-switch @change="userStateChange(scope.row)"
                       v-model="scope.row.state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作">
          <!--作用域插槽-->
          <template slot-scope="scope">
            <!--修改-->
            <el-button @click="showEditDialog(scope.row.id)"
                       type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--删除-->
            <el-button @click="deleteUser(scope.row.id)"
                       type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!--消息提示-->
            <el-tooltip :enterable="true"
                        effect="dark" content="分配权限" placement="top-start">
              <!--权限-->
              <el-button
                  type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <!--
            current-page    当前页数
            page-size       每页显示条目个数
            page-sizes      每页显示条目个数 选择器的选项设置
            total           总条目个数
            @size-change    控制每页显示的条目个数
            @current-change current-page 改变时候触发
        -->
        <el-pagination @size-change="handleMaxSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryInfo.pageStart"
                       :page-sizes="[1, 2, 5, 10]"
                       :page-size="queryInfo.pageSize"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-card>

    <!--新增用户-->
    <el-dialog @close="addDialogClosed"
               :visible="addDialogVisible"
               width="50%"
               title="添加用户">
      <el-form :model="addForm"
               :rules="addRules"
               ref="addFormRef"
               label-width="70px">
        <!--用户名-->
        <el-form-item prop="username"
                      label="用户名">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password"
                      label="密码">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!--邮箱-->
        <el-form-item prop="email"
                      label="邮箱">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dia-footer">
        <!--点击之后关闭对话框-->
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button @click="addUser"
                   type="primary">确定</el-button>
      </span>
    </el-dialog>

    <!--修改用户-->
    <el-dialog @close="editDialogClosed"
               :visible="editDialogVisible"
               width="50%"
               title="修改用户信息">
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="70px">
        <!--用户名-->
        <el-form-item prop="username"
                      label="用户名">
          <!--用户名不可修改-->
          <el-input disabled
                    v-model="editForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password"
                      label="密码">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!--邮箱-->
        <el-form-item prop="email"
                      label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dia-footer">
        <!--点击之后关闭对话框-->
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button @click="editUser"
                   type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserList",
  data() {
    return {
      // 查询信息实体
      queryInfo: {
        query: '',// 查询信息
        pageStart: 1,// 当前页(后端已经处理了下标)
        pageSize: 5// 每页最大记录数
      },
      userList: [],// 用户列表
      total: 0,// 用户数量
      // 添加用户表单验证规则
      addRules: {
        username: [
          // 必填项验证
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          // 长度验证
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          // 必填项验证
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          // 长度验证
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        email: [
          // 必填项验证
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          // 长度验证
          {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
        ]
      },
      addDialogVisible: false,// 添加对话框
      addForm: {// 添加用户信息
        username: '',
        password: '',
        email: ''
      },
      // 修改用户信息
      editForm: {},
      // 更改信息对话框
      editDialogVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList() {
      this.$http.get('/allUser', {
            // 路径请求参数
            params: this.queryInfo
          }
      ).then(({data: res}) => {
        // 用户列表
        this.userList = res['users']
        // 总用户数
        this.total = res['num']
      }).catch(err => {
        this.$message.error('获取用户列表失败!')
      })
    },
    // 获取新的用户列表
    getNewUserList() {
      // 重置页码
      this.queryInfo.pageStart = 1
      this.getUserList()
    },
    // 处理请求页面显示条数
    handleMaxSizeChange(size) {
      this.queryInfo.pageSize = size
      this.getUserList()
    },
    // 进行翻页
    handleCurrentChange(start) {
      this.queryInfo.pageStart = start
      this.getUserList()
    },
    // 更改用户状态信息
    userStateChange(info) {
      this.$http.put(`/updateUserState?id=${info.id}&state=${info.state}`).then(({data: res}) => {

        if (res === 'error') {
          // 修改失败 回退
          info.state = !info.state
          return this.$message.error('操作失败!!!')
        }

        this.$message.success('操作成功!!!')
      }).catch(err => {
        this.$message.error('操作失败!!!')
      })
    },
    // 监听对话框关闭
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return this.$message.error('表单验证失败!')

        this.$http.post('/addUser', this.addForm).then(({data: res}) => {
          if (res === 'error') return this.$message.error('添加用户信息失败!!')

          this.$message.success('操作成功!!!')

          this.addDialogVisible = false
          this.getUserList()
        }).catch(err => {
          this.$message.error('添加用户信息失败!!')
        })
      })
    },
    // 删除用户
    deleteUser(id) {
      this.$confirm('此操作将永久删除用户, 是否继续', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        if (res !== 'confirm') return this.$message.info('取消删除!')

        this.$http.delete(`/deleteUser?id=${id}`).then(({data: res}) => {
          if (res === 'error') return this.$message.error('删除用户失败!!')

          this.$message.success('操作成功!!!')
          this.getUserList()
        }).catch(err => {
          this.$message.error('删除用户失败!!')
        })
      }).catch(err => {
        this.$message.error('删除用户失败!!')
      })
    },
    // 显示对话框
    showEditDialog(id) {
      this.$http.get('/getUpdateUser', {
        params: {id}
      }).then(({data: res}) => {
        this.editForm = res
        // 开启编辑对话框
        this.editDialogVisible = true
      }).catch(err => {
        this.$message.error('查询用户失败!!')
      })
    },
    // 监听对话框关闭
    editDialogClosed() {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    editUser() {
      this.$http.put("/editUser", this.editForm).then(({data: res}) => {
        if (res === 'error') return this.$message.error('修改用户信息失败!!')

        this.$message.success('操作成功!!!')

        this.editDialogVisible = false
        this.getUserList()
      }).catch(err => {
        this.$message.error('修改用户失败!!')
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
}

.el-card {
  margin-top: 15px;
}

.el-table {
  min-width: 1100px;
  margin-top: 10px;
}
</style>