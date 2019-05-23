<template>
  <el-row class="container">
    <!-- 头部样式 -->
    <el-col :span="24" class="header">
      <!-- 头部项目名称，绑定sysName属性 -->
      <el-col
        :span="10"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >{{collapsed?'':sysName}}</el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-container style="height: 100%; border: 1px solid #eee">
          <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1', '3']">
              <el-submenu index="1">
                <template slot="title">
                  <!-- 左侧导航栏名 -->
                  <i class="el-icon-edit"></i>审核
                </template>
                <!-- 左侧导航栏显示页面 -->
                <el-menu-item index="1-1" @click="tableClick()" ref="tabDefault">新用户审核</el-menu-item>
                <el-menu-item index="1-2" @click="examineClick()">修改信息审核</el-menu-item>
                <el-menu-item index="1-3" @click="orderClick()">聚会订单</el-menu-item>
                <el-menu-item index="1-4" @click="userAllClick()">用户查询</el-menu-item>
                <el-menu-item index="1-5" @click="recordClick()">提现纪录</el-menu-item>
                <!-- <el-menu-item index="1-3">选项3</el-menu-item> -->
              </el-submenu>
            </el-menu>
          </el-aside>
        </el-container>
      </aside>
      <!-- 主体部分 -->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      sysName: "PartyParty",
	  collapsed:false,
    };
  },
  methods: {
    tableClick() {
      this.$router.push({ path: "/table" });
  },
  examineClick(){
      this.$router.push({ path: "/examine" });
  },
  orderClick(){
      this.$router.push({ path: "/order" });
  },
	userAllClick(){
    this.$router.push({ path: "/userAll" });
	},
	recordClick(){
    this.$router.push({ path: "/record" });
	}
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
// @import '~scss_vars';
$color-primary: #20a0ff;

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;

    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;

      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      background: #ccc;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
    }

    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>