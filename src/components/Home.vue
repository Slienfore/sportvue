<template>
  <!--整体布局-->
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div class="leftWrap">
        <img src="../assets/img/avatar.jpg" alt="Slienfore">
        <span>个人运动平台</span>
      </div>
      <el-button @click="logout"
                 type="primary"
                 round>安全退出
      </el-button>
    </el-header>

    <!--主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--伸缩侧边栏-->
        <div @click="toggleCollapse"
             class="toggle-button">|||
        </div>

        <!--:router 绑定路由-->
        <!--:default-active 防止刷新后再次回到初始位置-->
        <!--:collapse 绑定是否展开-->
        <el-menu :router="true"
                 :default-active="activePath"
                 :collapse="isCollapse"
                 background-color="#55ce8b"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <!--此处的 :index => 唯一标明菜单的点击变色(字符串)-->
          <el-submenu v-for="mainMenu in menuList"
                      :key="mainMenu.id"
                      :index="mainMenu + ''">
            <!--一级菜单-->
            <template slot="title">
              <i class="el-icon-eleme"></i>
              <span>{{ mainMenu.title }}</span>
            </template>
            <!--二级菜单-->
            <!--右侧路由是根据 :index 进行跳转-->
            <el-menu-item :index="subMenu.path + ''"
                          @click="saveNavPath(subMenu.path)"
                          v-for="subMenu in mainMenu['sList']"
                          :key="subMenu.id">
              <template slot="title">
                <i class="el-icon-eleme"></i>
                <span>{{ subMenu.title }}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体内容-->
      <el-main>
        <!--随着侧边栏内容变化而变化(添加路由)-->
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 激活路径
      activePath: '/welcome',
      // 是否展开侧边栏
      isCollapse: false
    }
  },
  // 页面挂载
  created() {
    // 查询 menuList
    this.getMenuList()
    // 路径记忆
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 安全退出
    logout() {
      // 清除所有 session
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取导航栏菜单
    getMenuList() {
      this.$http.get('/menus').then(({data: res}) => {
        if (!res.flag) return this.$message.error('请求页面菜单失败!')

        console.log('菜单 => ', res.menus)
        this.menuList = res.menus
      }).catch(err => {
        this.$message.error('请求页面菜单失败!')
      })
    },
    // 伸缩侧边栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 路径记忆(方便侧边栏 => 激活与展开)
    saveNavPath(path) {
      // 激活路径保存 session 中 => 防止刷新后没了
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;

  .el-header {
    background-color: #BBE6D6;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .leftWrap {
      display: flex;
      align-items: center;

      img {
        width: 45px;
        height: 45px;
        border-radius: 3px;
      }

      span {
        font-weight: bold;
        font-size: 18px;
        padding: 0 5px;
        color: #011627;
      }
    }
  }

  .el-aside {
    background-color: #E4F5EF;
    transition: .2s ease-in-out width;

    // 伸缩菜单栏
    .toggle-button {
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #55ce8b;
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 3px;
      color: #ffffff;
      cursor: pointer;
    }
  }

  // 侧边栏会撑出父盒子高度
  .el-menu {
    border-right: none;
  }

  .el-main {
    background-color: #C8EBDF;
  }
}
</style>