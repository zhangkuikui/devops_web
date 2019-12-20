<template>
<el-container id="leftMenu">
    <el-aside width="200px">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <!-- <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"> -->
        <el-menu
        :default-active="activerouter"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#3d3d3d"
        text-color="#b8b8b8"
        router>
            <el-menu-item index="/">
                <i class="el-icon-s-home"></i>
                <span>首页</span>
            </el-menu-item>
            <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-s-operation"></i>
                        <span>机器管理</span>
                    </template>
                    <el-menu-item-group>
                        <!-- <template slot="title">分组一</template>  -->
                        <el-menu-item index="/host/hostAll">全部机器</el-menu-item>
                        <el-menu-item index="/a/b">分组管理</el-menu-item>
                        <el-menu-item index="2-3">标签管理</el-menu-item>
                    </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>机器配置</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="3-1">配置管理</el-menu-item>
                    <el-menu-item index="3-2">SSH管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </el-aside>

     <el-main>
         <router-view></router-view>
     </el-main>


</el-container>

</template>

<script>

export default {
    data() {
      return {
        isCollapse: false,
        activerouter:'/'
      };
    },
    mounted(){
    this.activerouter = window.location.pathname;
    },
    methods: {
        // handleOpen(key, keyPath) {
        //     console.log(key, keyPath);
        // },
        // handleClose(key, keyPath) {
        //     console.log(key, keyPath);
        // }
        }
}


</script>

<style>

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 780px;
  }

#leftMenu .is-active{
    color:#f39185;
    /* background-color: #fff ! important; */
}



</style>
