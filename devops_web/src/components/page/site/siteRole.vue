<template>
    <div id="siteRole">
      <h1>角色管理</h1>

      <el-button type="danger" size="medium" @click="dialogVisible = true">添加角色+</el-button>
      <el-button @click="up" type="success" size="medium">刷新</el-button>
      <!-- Dialog弹出框⬇️ -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
         <!--form表单 ⬇️-->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" size="small" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="role" >
            <el-input v-model="ruleForm.role"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :plain="true">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
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
        <el-table-column label="ID" prop="id" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="role" align="center"></el-table-column>
        <el-table-column label="描述" prop="desc" align="center"></el-table-column>
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
        name: "siteRole.vue",
        data(){
          return{
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
              role: '',
              desc: '',
            },
            rules: {
              role: [
                { required: true, message: '角色不能为空'}
              ],
              desc:[
                { required: true, message: '描述不能为空'}
              ],
            }
          }
        },
        methods:{
          // 关闭dialog
          handleClose(done) {
            done();
          },
          //获取角色列表
          getRoleList(data_,self,callBack){
            this.$axios({
              url:this.$apiUrl.site.siterole_list+data_
            }).then(res=>{
              callBack(self,res.data)
            })
          },

          //添加角色
          roleAdd(data_,self,callBack){
            this.$axios({
              url:this.$apiUrl.site.siterole_add,
              method:"post",
              data:data_
            }).then(res=>{
              callBack(self,res.data)
            })
          },
          //删除角色
          roleDel(data_,self,callBack){
            this.$axios({
              url:this.$apiUrl.site.siterole_del,
              method:"post",
              data:data_
            }).then(res=>{
              callBack(self,res.data)
            })
          },

          // 刷新表格按钮
          up(){
            let that = this;
            // pages,page_count,sort,order,search

            let data='';
            that.getRoleList(data,that,function (self,ret_data){
              if(ret_data.status==='ok'){
                self.tableData=ret_data.data;
                self.total=ret_data.data.length;
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

          // 表单提交
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                let that = this;
                let data=new URLSearchParams();
                data.append("role",that.ruleForm.role);
                data.append("desc",that.ruleForm.desc);
                // this.$message.error('ret_data.describe')
                this.roleAdd(data,that,function (self,ret_data){
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
              } else {
                // console.log('error submit!!');
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
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

          // 删除
          handleDelete(index, row) {
            let that = this;
            let data=new URLSearchParams();
            data.append("id",row.id);
            this.roleDel(data,that,function (self,ret_data){
              if(ret_data.status==='ok'){
                that.up();
                if((self.current_page - 1) * self.page_size>self.total-2){
                  self.current_page-=1;
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
          this.up()
      }

    }
</script>

<style scoped>
  h1{
    color: #555555;
  }
  #siteRole>button{
    margin-bottom:10px;
  }


</style>
