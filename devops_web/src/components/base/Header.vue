<template>
    <el-container>
        <el-header>
            <el-menu
                :default-active="activeIndex2"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#fff"
                text-color="#555555"
                active-text-color="#f39185"
                id="headerMenu"
                router>
                <el-menu-item id="logo">
                    <img src="../../assets/t.png" alt="logo">
                </el-menu-item>
                <el-menu-item>
                    <span id="obj_name"><b>DevOps</b></span>
                </el-menu-item>
                <el-submenu index="1" class="right" v-if="username !==''">
                    <template slot="title">{{username}}</template>
                    <el-menu-item index="1-1">我的用户</el-menu-item>
                    <el-menu-item index="/login" @click.native="logout">注销用户</el-menu-item>
                </el-submenu>
                <el-menu-item v-if="username ==''" class="right" @click.native="getuser">登录</el-menu-item>
                <el-menu-item index="3" class="right">消息中心</el-menu-item>
            </el-menu>
        </el-header>
        <LeftMenu></LeftMenu>

    </el-container>
</template>

<script>
import LeftMenu from './LeftMenu'
export default {
    components:{
      LeftMenu
    },
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        url:"../../assets/t.png",
        username:''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
      getuser(){
        this.$axios({
                url:this.$apiUrl.getuser,
            }).then(res=>{
                if(res.data.status==='ok'){
                  this.username=res.data.data.username;
                }else{
                  this.$notify({
                        title: res.data.status,
                        dangerouslyUseHTMLString: true,
                        message: '<i>'+res.data.describe+'</i>',
                        type:'error',
                        duration:1000,
                      });
                  this.$router.push({path:'/login'})
                }
            })
      },
      logout(){
        let that = this;
        let data=new URLSearchParams();
        that.$axios({url:that.$apiUrl.logout,
                        method:"post",
                        data:data,
            }).then(res=>{
                if(res.status=='error'){
                  that.$notify({
                        title: res.status,
                        dangerouslyUseHTMLString: true,
                        message: '<i>'+res.describe+'</i>',
                        type:'error',
                        duration:1000,
                      });
                }
            })
      }
    },
    mounted(){
      this.getuser();
    }
}
</script>

<style>
.el-header, .el-footer {
    background-color: #ddd;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-header{
      padding: 0;
  }

  .el-aside {
    background-color: #3e3e3e;
    color: #b8b8b8;
    /* text-align: center; */
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    overflow: hidden;
    /* text-align: center; */
    /* line-height: 160px; */
  }
  body{
      padding: 0;margin: 0;
      }
  body > .el-container {
    margin-bottom: 40px;
  }

  #headerMenu>li.right{
      float: right;
  }

  #logo>img{
      width: 50px;
      height: 50px;
  }

  #obj_name{
      font-size: 20px;
      color: #f36a5a;
  }
  .el-notification__content{
    word-break: break-all;
  }


</style>
