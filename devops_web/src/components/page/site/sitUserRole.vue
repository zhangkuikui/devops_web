<template>
    <div id="siteUserRole">
      <h1>用户绑定角色</h1>

      <el-select v-model="select_value" placeholder="请选择"  @change="selectTrigger(select_value)"
                 filterable
      >
        <el-option
          v-for="item in select_cities"
          :key="item.value"
          :value="item.value"
          >
          <span style="float: right;color: #8492a6; font-size: 13px">{{ item.cn }}</span>
          <span style="float: left">{{ item.value }}</span>
        </el-option>
      </el-select>
      <!--两个按钮-->
      <el-button type="danger" size="medium" @click=dialog()>添加</el-button>
      <el-button @click="up" type="success" size="medium">刷新</el-button>

      <!-- Dialog弹出框⬇️ -->
      <el-dialog
        title="角色绑定菜单"
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose">
        <!--form表单 ⬇️-->
        <el-form id="sitRoleMenuForm"  status-icon label-width="100px" size="small" class="demo-ruleForm">
          <el-form-item label="用户名称" >
            <el-select v-model="fromSelectUser.value" placeholder="请选择"
                       filterable
                       disabled>
              <el-option
                v-for="item in fromSelectUser.cities"
                :key="item.value"
                :value="item.value">
                <span style="float: left">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称">
            <!--<el-input v-model="ruleForm.desc"></el-input>-->
            <el-select v-model="fromSelectrole.value" placeholder="请选择"
                       filterable>
              <el-option
                v-for="item in fromSelectrole.cities"
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

      <el-table
        :data="tableData.slice((current_page-1)*page_size,current_page*page_size)"

        style="width: 100%"
        border
        id="mtab">
        <!--{"id": 4, "username": "zhangkuikui", "cn": "张奎", "role": "HostAdmin", "desc": "主机管理员"}-->
        <el-table-column label="ID" prop="id" align="center"></el-table-column>
        <el-table-column label="用户" prop="username" align="center"></el-table-column>
        <el-table-column label="角色" prop="role" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="desc" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页⬇️ -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current_page"
        :page-sizes="page_sizes"
        :page-size="page_size"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total">
      </el-pagination>
      <!-- 分页⬆️ -->


    </div>

</template>

<script>
    export default {
        name: "sit-user-role",
      data(){
          return {
            //select 下拉框
            select_cities:'',
            select_value: '',

            fromSelectUser:{
              cities: '',
              value: '',
            },

            fromSelectrole:{
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


          }
      },
      methods:{
        selectTrigger(cities){
          this.up();
        },

        //用户名称列表
        getUserName(){
          this.$axios({
            url:this.$apiUrl.site.siteUserName_list
          }).then(res=>{
            this.select_cities=res.data.data;
            this.fromSelectUser.cities=res.data.data;
          })
        },

        //用户角色列表
        getUserRoleList(){
          let data_='?username='+this.select_value;
          this.$axios({
            url:this.$apiUrl.site.siteUserRole_list+data_
          }).then(res=>{
            this.tableData=res.data.data;
            this.total=res.data.data.length;
          })
        },

        //角色名称数组
        getRoleName(){
          this.$axios({
            url:this.$apiUrl.site.siteRoleName_list
          }).then(res=>{
            // this.select_cities=res.data.data;
            this.fromSelectrole.cities=res.data.data;
          })
        },

        //添加用户角色绑定关系
        userRoleAdd(data_,self,callBack){
          this.$axios({
            url:this.$apiUrl.site.siteUserRole_add,
            method:"post",
            data:data_
          }).then(res=>{
            callBack(self,res.data)
          })
        },

        up(){
            this.getUserName();
            this.getRoleName();
            this.getUserRoleList();
        },

        //删除用户角色绑定关系
        userRoleDel(data_,self,callBack){
          this.$axios({
            url:this.$apiUrl.site.siteUserRole_del,
            method:"post",
            data:data_
          }).then(res=>{
            callBack(self,res.data)
          })
        },

        // 关闭dialog
        dialog(){
          this.fromSelectUser.value=this.select_value;
          this.dialogVisible=true
        },


        handleClose() {

        },

        // 分页部分
        handleSizeChange(val) {

          this.page_size=val;


          // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {

          this.current_page=val;

          // console.log(`当前页: ${val}`);
        },

        // 表单提交
        submitForm(formName) {

          // console.log(this.fromSelectrole.value);
          // console.log(this.fromSelectMenu.value);
          let that = this;
          let data=new URLSearchParams();
          var user_id='';
          var role_id='';

          for(let i=0;i<this.fromSelectUser.cities.length;i++){
            if(this.fromSelectUser.value===this.fromSelectUser.cities[i].value){
              user_id=this.fromSelectUser.cities[i].id
            }
          }

          for(let i=0;i<this.fromSelectrole.cities.length;i++){
            if(this.fromSelectrole.value===this.fromSelectrole.cities[i].value){
              role_id=this.fromSelectrole.cities[i].id
            }
          }
          data.append("role_id",role_id);
          data.append("user_id",user_id);


          this.userRoleAdd(data,that,function (self,ret_data){
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


        // 删除
        handleDelete(index, row) {
          let that = this;
          let data=new URLSearchParams();
          data.append("id",row.id);
          this.userRoleDel(data,that,function (self,ret_data){
            if(ret_data.status==='ok'){
              that.up();
              if((self.current_page - 1) * self.page_size>self.total-2){
                if(self.current_page-1<=0){
                  self.current_page=1
                }else{
                  self.current_page-=1;
                }
              }
              self.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '<i>'+'本次调用已成功'+'</i>',
                type: 'success',
                duration:1000,
              });
            }else{
              self.$notify({
                title: ret_data.status,
                // message: '本次调用已报错'
                dangerouslyUseHTMLString: true,
                message: `<i>${ret_data.describe}</i>`,
                type:'error',
                duration:1000,
              });
            }
          })
        },

      },
      mounted(){

        var __this = this;
        // __this.up()
        // __this.getUserName();

        //通过Promise处理需要有先后顺序请求的接口
        new Promise(((resolve, reject) => {
            __this.$axios({
              url:__this.$apiUrl.site.siteUserName_list
            }).then(res=>{
              if(res.data.status==='ok'){
                __this.select_cities=res.data.data;
                __this.select_value=res.data.data[0].value;
                __this.fromSelectUser.cities=res.data.data;
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
          // console.log(__this.select_value);
          if(__this.select_value===undefined){
            data_='?username='
          }else{
            data_='?username='+__this.select_value;
          }
          this.$axios({
            url:__this.$apiUrl.site.siteUserRole_list+data_
          }).then(res=>{
            if(res.data.status==='ok'){
              __this.tableData=res.data.data;
              __this.total=res.data.data.length;
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
#siteUserRole .el-input--small .el-input__inner{
  width: 500px;
}

</style>
