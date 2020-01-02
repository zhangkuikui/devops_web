<template>
    <div id="siteMenu">
      <h1>菜单管理</h1>
      <!-- 表格部分 ⬇️-->
      <el-button type="danger" size="medium" @click="dialogVisible = true">添加菜单+</el-button>
      <el-button @click="up" type="success" size="medium">刷新</el-button>
      <!-- Dialog弹出框⬇️ -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <!-- form表单 ⬇️ -->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" size="small" class="demo-ruleForm">
          <el-form-item label="菜单名称" prop="menu_name" >
            <el-input v-model="ruleForm.menu_name"></el-input>
          </el-form-item>
          <el-form-item label="菜单ID" prop="menu_id">
            <el-input v-model="ruleForm.menu_id"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="路由">
            <el-input v-model="ruleForm.router"></el-input>
          </el-form-item>
          <el-form-item label="图标" >
            <el-input v-model="ruleForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="父ID"  >
            <el-input v-model="ruleForm.parent_id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :plain="true">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- form表单 ⬆️ -->
      </el-dialog>
      <!-- Dialog弹出框⬆️ -->
      <!--"tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"-->
      <el-table
        :data="tableData.slice((current_page-1)*page_size,current_page*page_size)"

        style="width: 100%"
        border
        id="mtab">
        <el-table-column label="菜单名称" prop="menu_name" align="center"></el-table-column>
        <el-table-column label="描述" prop="description" align="center"></el-table-column>
        <el-table-column label="菜单ID" prop="menu_id" align="center"></el-table-column>
        <el-table-column label="路由" prop="router" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.router">{{scope.row.router}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="图标"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.icon">{{scope.row.icon}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="父ID" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.parent_id">{{scope.row.parent_id}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
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
  name: "site-menu",

  data(){
    return {
      //表格相关数据
      tableData:[],

      //分页部分
      total:0,
      page_size:10,
      current_page:1,
      page_sizes:[10,20,25],


      // dialog相关参数
      dialogVisible: false,
      dialogVisibleWebSSH:false,

      // form表单相关参数
      ruleForm: {
        menu_name: '',
        menu_id: '',
        router: '',
        icon:'',
        parent_id:'',
        description:'',
      },
      rules: {
        menu_name: [
          { required: true, message: 'menu_name不能为空'}
        ],
        menu_id:[
          { required: true, message: 'menu_id不能为空'}
        ],
        description:[
          { required: true, message: 'description不能为空'}
        ]
      }
    }
  },

  methods:{
    //获取菜单列表
    getMenuList(data_,self,callBack){
      this.$axios({
        url:this.$apiUrl.site.sitemenu_list+data_
      }).then(res=>{
        callBack(self,res.data)
      })
    },
    //添加菜单
    menuAdd(data_,self,callBack){
      this.$axios({
        url:this.$apiUrl.site.sitemenu_add,
        method:"post",
        data:data_
      }).then(res=>{
        callBack(self,res.data)
      })
    },
    //删除菜单
    menuDel(data_,self,callBack){
      this.$axios({
        url:this.$apiUrl.site.sitemenu_del,
        method:"post",
        data:data_
      }).then(res=>{
        callBack(self,res.data)
      })
    },

    // 关闭dialog
    handleClose(done) {
      done();
    },

    // 刷新表格按钮
    up(){
        let that = this;
        // pages,page_count,sort,order,search

        let data='';
        that.getMenuList(data,that,function (self,ret_data){
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

    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let data=new URLSearchParams();
          data.append("menu_name",that.ruleForm.menu_name);
          data.append("menu_id",that.ruleForm.menu_id);
          data.append("router",that.ruleForm.router);
          data.append("icon",that.ruleForm.icon);
          data.append("parent_id",that.ruleForm.parent_id);
          data.append("description",that.ruleForm.description);
          // this.$message.error('ret_data.describe')
          this.menuAdd(data,that,function (self,ret_data){
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
    // 删除
    handleDelete(index, row) {
      let that = this;
      let data=new URLSearchParams();
      data.append("menu_id",row.menu_id);
      this.menuDel(data,that,function (self,ret_data){
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

    // 分页部分
    handleSizeChange(val) {

      this.page_size=val;


      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {

      this.current_page=val;

      // console.log(`当前页: ${val}`);
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

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;

  }

  .el-table__row span{
    /*border-bottom: 1px dashed #666666;*/
  }

  #siteMenu>button{
    margin-bottom:10px;
  }



  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
