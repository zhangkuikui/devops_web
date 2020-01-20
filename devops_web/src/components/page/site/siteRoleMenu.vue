<template>
    <div id="sitRoleMenu">
      <h1>角色绑定菜单</h1>

      <el-select class="myclass" v-model="select_value" placeholder="请选择"  @change="selectTrigger(select_value)"
                 filterable
      >
        <el-option
          v-for="item in select_cities"
          :key="item.value"
          :value="item.value">
          <span style="float: left">{{ item.value }}</span>
        </el-option>
      </el-select>

      <el-button type="danger" size="medium" @click=dialog()>添加</el-button>
      <el-button @click="up" type="success" size="medium">刷新</el-button>
      <!-- Dialog弹出框⬇️ -->
      <el-dialog
        title="角色绑定菜单"
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose">
        <!--form表单 ⬇️-->
        <el-form id="sitRoleMenuForm" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" size="small" class="demo-ruleForm">
          <el-form-item label="角色名称" >
            <el-select v-model="fromSelectrole.value" placeholder="请选择"
                       filterable
                       disabled>
              <el-option
                v-for="item in fromSelectrole.cities"
                :key="item.value"
                :value="item.value">
                <span style="float: left">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称">
            <!--<el-input v-model="ruleForm.desc"></el-input>-->
            <el-select v-model="fromSelectMenu.value" placeholder="请选择"
                       filterable>
              <el-option
                v-for="item in fromSelectMenu.cities"
                :key="item.value"
                :value="item.value">
                <span style="float: left">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :plain="true">提交</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
        <!--form表单 ⬆️-->
      </el-dialog>
      <!-- Dialog弹出框⬆️ -->

      <!--数据展示-->
      <div id="data">
        <h4>此角色下的菜单名称</h4>
        <div v-for="(iterm,i) in menu_obj" :key="i">
          <p>
            <span>{{iterm.menu_name}}({{iterm.description}})</span>
            <b v-if="iterm.isrole==='true'"><i class="el-icon-check"></i></b>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "site-role-menu",
      data() {
        return {
          //select 下拉框
          select_cities:'',
          select_value: '',

          fromSelectrole:{
            cities: [],
            value: '',
          },
          fromSelectMenu:{
            cities: [],
            value: '',
          },

          // dialog相关参数
          dialogVisible: false,
          dialogVisibleWebSSH:false,

          //表格相关数据
          tableData:[],

          //分页部分
          total:0,
          page_size:10,
          current_page:1,
          page_sizes:[10,20,25],


          // form表单相关参数
          ruleForm: {
          },
          rules: {
          },

        //  菜单展示数据
          menu_obj:'',
        };
      },
      methods: {

        selectTrigger(cities){
          this.up();
          // console.log(cities);
        },

        //角色名称数组
        getRoleName(){
          this.$axios({
            url:this.$apiUrl.site.siteRoleName_list
          }).then(res=>{
            this.select_cities=res.data.data;
            this.fromSelectrole.cities=res.data.data;
          })
        },
        //菜单名称数组
        getMenuName(){
          this.$axios({
            url:this.$apiUrl.site.siteMenuName_list
          }).then(res=>{
            if(res.data.status==='ok'){
              this.fromSelectMenu.cities=res.data.data;
              this.fromSelectMenu.value=res.data.data[0].value;
              this.fromSelectMenu.cities=res.data.data;
            }else{
              this.$notify({
                title: res.data.status,
                // message: '本次调用已报错'
                dangerouslyUseHTMLString: true,
                message: '<i>'+res.data.describe+'</i>',
                type:'error',
                duration:1000,
              });
            }
          })
        },

        //添加角色菜单绑定关系
        roleMenuAdd(data_,self,callBack){
          this.$axios({
            url:this.$apiUrl.site.siteRoleMenuAdd,
            method:"post",
            data:data_
          }).then(res=>{
            callBack(self,res.data)
          })
        },

        //获取角色菜单绑定关系表
        getRoleMenu(){
          let data_='?role='+this.select_value;
          this.$axios({
            url:this.$apiUrl.site.siteRoleMenu_list+data_
          }).then(res=>{
            if(res.data.status==='ok'){
              this.menu_obj=res.data.data;
            }else{
              this.$notify({
                title: res.data.status,
                // message: '本次调用已报错'
                dangerouslyUseHTMLString: true,
                message: '<i>'+res.data.describe+'</i>',
                type:'error',
                duration:1000,
              });
            }

          })
        },

        up(){
          this.getRoleMenu();
          this.getRoleName();
        },
        // 关闭dialog
        dialog(){
          this.fromSelectrole.value=this.select_value;
          this.dialogVisible=true
        },
        handleClose() {

        },

        // 表单提交
        submitForm(formName) {

          // console.log(this.fromSelectrole.value);
          // console.log(this.fromSelectMenu.value);
          let that = this;
          let data=new URLSearchParams();
          var menu_id='';
          var role_id='';

          for(let i=0;i<this.fromSelectMenu.cities.length;i++){
            if(this.fromSelectMenu.value===this.fromSelectMenu.cities[i].value){
              menu_id=this.fromSelectMenu.cities[i].id
            }
          }

          for(let i=0;i<this.fromSelectrole.cities.length;i++){
            console.log(this.fromSelectrole.cities[i].value);
            console.log(this.fromSelectrole.cities[i].id);
            if(this.fromSelectrole.value===this.fromSelectrole.cities[i].value){
              role_id=this.fromSelectrole.cities[i].id
            }
          }
          data.append("role_id",role_id);
          data.append("menu_id",menu_id);


          this.roleMenuAdd(data,that,function (self,ret_data){
            if(ret_data.status==='ok'){
              self.dialogVisible=false;
              that.up();
              self.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '</i>'+'本次调用已成功'+'</i>',
                type: 'success',
                duration:1000,
              });
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
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
      },
      mounted() {
        var __this = this;
        __this.getMenuName();

        //通过Promise处理需要有先后顺序请求的接口
        new Promise(((resolve, reject) => {
            __this.$axios({
              url:__this.$apiUrl.site.siteRoleName_list
            }).then(res=>{
              if(res.data.status==='ok'){
                __this.select_cities=res.data.data;
                __this.select_value=res.data.data[0].value;
                __this.fromSelectrole.cities=res.data.data;
              }else{
                __this.$notify({
                  title: res.data.status,
                  // message: '本次调用已报错'
                  dangerouslyUseHTMLString: true,
                  message: '<i>'+res.data.describe+'</i>',
                  type:'error',
                  duration:1000,
                });
              }
              resolve(1)
            });

            })
        ).then(res => {
          var data_='';
          if(__this.select_value===undefined){
            data_='?role='
          }else{
            data_='?role='+__this.select_value;
          }
          this.$axios({
            url:__this.$apiUrl.site.siteRoleMenu_list+data_
          }).then(res=>{
            if(res.data.status==='ok'){
              __this.menu_obj=res.data.data;
            }else{
              __this.$notify({
                title: res.data.status,
                // message: '本次调用已报错'
                dangerouslyUseHTMLString: true,
                message: '<i>'+res.data.describe+'</i>',
                type:'error',
                duration:1000,
              });
            }

          })
        })

      }
    }
</script>

<style>
  h1{
    color: #555555;
  }

  #data{
    background-color: #fff;
    /*height:500px;*/
    border: 1px solid #dddddd;
  }

  #data>div{
    /*float: left;*/
    display: inline-block;
    width: 49%;
    position: relative;

  }
  /*#data>div:nth-child(1){*/
  #data>div:nth-child(even){
    border-right: 1px solid #dddddd;
  }
  #data>div>p{
    margin:10px 0;
  }

  #data>div>p>span{
    margin-left: 10px;
  }
  #data>div>p>b{
    position:absolute;
    right: 20px;
  }
  h4{
    background-color: #f5f5f5;
    color: #333333;
    margin:0;
    height: 35px;
    line-height: 35px;
    font-weight: 500;
    border-bottom: 1px solid #dddddd;
    text-align: center;
  }

  #sitRoleMenuForm .el-input--small .el-input__inner{
    width: 500px;
  }

  #sitRoleMenu>button{
    margin-bottom:10px;
  }

</style>
