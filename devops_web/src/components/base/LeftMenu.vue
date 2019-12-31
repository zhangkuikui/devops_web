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
          <div v-for="(iterm,i) in menus" :key="i">
            <el-submenu :index="iterm.menu_id" v-if="iterm.children">
              <template slot="title">
                <i :class="iterm.icon"></i>
                <span>{{iterm.description}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(iterm2,i2) in iterm.children" :key="i2" :index="iterm2.router">{{iterm2.description}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item  :index="iterm.router" v-else>
              <i :class="iterm.icon"></i>
              <span>{{iterm.description}}</span>
            </el-menu-item>
          </div>


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
        activerouter:'/',
        menus:[],
      };
    },
    mounted(){
    this.activerouter = window.location.pathname;
    this.up()
    },
    methods: {
      getCurrentMenu(data_,self,callBack){
        this.$axios({
          url:this.$apiUrl.site.sitemenu_current+data_
        }).then(res=>{
          callBack(self,res.data)
        })
      },
      up(){
        let that = this;
        // pages,page_count,sort,order,search

        let data='';
        that.getCurrentMenu(data,that,function (self,ret_data){
          if(ret_data.status==='ok'){
            that.menus=ret_data.data;
          }else{
            self.$notify({
              title: ret_data.status,
              // message: '本次调用已报错'
              dangerouslyUseHTMLString: true,
              message: '<i>'+ret_data.describe+'</i>',
              type:'error',
              duration:1000,
            });
          }
        })
      },

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
