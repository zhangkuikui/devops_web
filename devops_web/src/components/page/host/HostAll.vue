<template>

    <div id="hostAll">
        <h1>全部机器</h1>
        <!-- 表格部分 ⬇️-->
        <el-button type="danger" size="medium" @click="dialogVisible = true">添加机器+</el-button>
        <el-button @click.native="up" type="success" size="medium">刷新</el-button>

        <el-col :span="4" id="search_input">
          <el-input
            placeholder="搜索"
            v-model="search_input" @keyup.enter.native="up">
          </el-input>
        </el-col>


            <!-- Dialog弹出框⬇️ -->
                <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">
                    <!-- form表单 ⬇️ -->
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                            <el-form-item label="主机名" prop="host_name" >
                                <el-select v-model="ruleForm.host_name" placeholder="请选择主机">
                                    <el-option v-for="(v,index) in hostlist" :label=v :value=v :key=index></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="业务组" prop="group_name">
                                <el-input v-model="ruleForm.group_name"></el-input>
                            </el-form-item>
                            <el-form-item label="内网地址" prop="ip_inside">
                                <el-input v-model="ruleForm.ip_inside"></el-input>
                            </el-form-item>
                            <el-form-item label="外网地址" >
                                <el-input v-model="ruleForm.ip_outside"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')" :plain="true">提交</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    <!-- form表单 ⬆️ -->
                </el-dialog>
            <!-- Dialog弹出框⬆️ -->
        <el-table
            :data="tableData"
            style="width: 100%"
            border
            @sort-change='sortChange'
            id="mtab">
            <el-table-column label="id" prop="id" sortable='custom' align="center"></el-table-column>
            <el-table-column label="主机名" prop="host_name" sortable='custom' align="center">
              <template slot-scope="scope">
                <!--el-popover 点击弹出输入框 修改文件内容-->
                <el-popover trigger="click" placement="top"
                            width="100"
                            :ref="`${scope.column.property}-${scope.$index}`">
                  <div>
                    <el-input  :rows="5" maxlength="300" placeholder="请输入内容" v-model="scope.row.host_name"></el-input>
                    <div style="text-align: left; margin-top: 10px">
                      <el-button size="mini" plain @click.native="cancelClick(scope)">取消</el-button>
                      <el-button type="primary" size="mini" @click.native="sureClick(scope)">确定</el-button>
                    </div>
                  </div>
                  <div slot="reference">
                    <span v-if="scope.row.host_name" style="cursor: pointer;">{{scope.row.host_name}}</span>
                    <span v-else style="cursor: pointer;">暂无</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="业务组" prop="group_name" sortable='custom' align="center"></el-table-column>
            <!-- show-overflow-tooltip 内容过长以...代替 -->
            <el-table-column label="内网地址" prop="ip_inside" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <!--el-popover 点击弹出输入框 修改文件内容-->
                <el-popover trigger="click" placement="top"
                            width="100"
                            :ref="`${scope.column.property}-${scope.$index}`">
                  <div>
                    <el-input  :rows="5" maxlength="300" placeholder="请输入内容" v-model="scope.row.ip_inside"></el-input>
                    <div style="text-align: left; margin-top: 10px">
                      <el-button size="mini" plain @click.native="cancelClick(scope)">取消</el-button>
                      <el-button type="primary" size="mini" @click.native="sureClick(scope)">确定</el-button>
                    </div>
                  </div>
                  <div slot="reference">
                    <span v-if="scope.row.ip_inside" style="cursor: pointer;">{{scope.row.ip_inside}}</span>
                    <span v-else style="cursor: pointer;">暂无</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="外网地址" prop="ip_outside"  align="center">
              <template slot-scope="scope">
                <!--el-popover 点击弹出输入框 修改文件内容-->
                <el-popover trigger="click" placement="top"
                            width="100"
                            :ref="`${scope.column.property}-${scope.$index}`">
                  <div>
                    <el-input  :rows="5" maxlength="300" placeholder="请输入内容" v-model="scope.row.ip_outside"></el-input>
                    <div style="text-align: left; margin-top: 10px">
                      <el-button  size="mini" plain @click.native="cancelClick(scope)">取消</el-button>
                      <el-button type="danger" size="mini" @click.native="sureClick(scope)">确定</el-button>
                    </div>
                  </div>
                  <div slot="reference">
                    <span v-if="scope.row.ip_outside" style="cursor: pointer;">{{scope.row.ip_outside}}</span>
                    <span v-else style="cursor: pointer;">暂无</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleConnet(scope.$index, scope.row)">链接
                </el-button>

              </template>
            </el-table-column>
        </el-table>
        <!-- 表格部分 ⬆️-->

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
import WebSSH from '../../WebSSH'
export default {
    components:{
      WebSSH
    },
    data() {
      return {
        //
        popoverShow:true,
        popoverId:'',

        //搜索字符
        search_input:'',

        //分页部分
        total:0,
        page_size:10,
        current_page:1,
        page_sizes:[10,20,25],
        order:'asc',
        sort:'id',

        // 表格中的数据
        tableData: [],
        showEdit: [], //显示编辑框

        // dialog相关参数
        dialogVisible: false,
        dialogVisibleWebSSH:false,

        // form表单相关参数
        hostlist:['xifeng1','baochai','baoyu','yinjiao','jinjiao'],
        ruleForm: {
          host_name: '',
          group_name: '',
          ip_inside: '',
          ip_outside:''
        },
        rules: {
          host_name: [
            { required: true, message: '主机名不能为空'}
          ],
          group_name:[
              { required: true, message: '业务组不能为空'}
          ],
          ip_inside:[
              { required: true, message: '内网地址不能为空'}
          ]
        }

      }
    },
    methods:{
        getHostAll(data_,self,callBack){
            this.$axios({
                url:this.$apiUrl.host.get_hostAll+data_
            }).then(res=>{
                callBack(self,res.data)
            })
        },
        hostadd(data_,self,callBack){
            this.$axios({
                        url:this.$apiUrl.host.post_hostAdd,
                        method:"post",
                        data:data_
            }).then(res=>{
                callBack(self,res.data)
            })
        },
        hostdel(data_,self,callBack){
            this.$axios({
                        url:this.$apiUrl.host.hostdel,
                        method:"post",
                        data:data_
            }).then(res=>{
                callBack(self,res.data)
            })
        },
        hostdit(data_,self,callBack){
          this.$axios({
            url:this.$apiUrl.host.hostedit,
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

          let data=`?pages=${this.current_page}&page_count=${this.page_size}&sort=${this.sort}&order=${this.order}&search=${this.search_input}`;
          that.getHostAll(data,that,function (self,ret_data){
                if(ret_data.status==='ok'){
                    self.tableData=ret_data.rows;
                    self.total=ret_data.total;
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

        //取消编辑
        cancelClick(scope){

          this.$refs[`${scope.column.property}-${scope.$index}`].doClose();

          // console.log('取消编辑');
        },
        //确认编辑
        sureClick(scope){
            //更新数据库

          let that = this;
          let data=new URLSearchParams();
          data.append("group_name",scope.row.group_name);
          data.append("host_name",scope.row.host_name);
          data.append("ip_inside",scope.row.ip_inside);
          data.append("ip_outside",scope.row.ip_outside);
          data.append("id",scope.row.id);
          this.hostdit(data,that,function (self,ret_data){
            if(ret_data.status==='ok'){
              that.up();
              self.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '</i>'+'本次调用已成功'+'</i>',
                type: 'success',
                duration:1000,
              });
            }else{
              that.up();
              self.$notify({
                title: ret_data.status,
                // message: '本次调用已报错'
                dangerouslyUseHTMLString: true,
                message: '<i>'+ret_data.describe+'</i>',
                type:'error',
                duration:1000,
              });
            }
          });
          this.$refs[`${scope.column.property}-${scope.$index}`].doClose();
          },

        // 删除
        handleDelete(index, row) {
            let that = this;
            let data=new URLSearchParams();
            data.append("id",row.id);
            this.hostdel(data,that,function (self,ret_data){
                if(ret_data.status==='ok'){
                    that.up();
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

        //链接handleConnet
        handleConnet(index,row){
          this.$router.push({
            path:'/ssh',
            query: {
              hostid: row.id
            }
          });
          // console.log(row)
        },

        // 分页部分
        handleSizeChange(val) {

            this.page_size=val;
            this.up()

            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {

            this.current_page=val;
            this.up()

        // console.log(`当前页: ${val}`);
        },
        //后端排序
        sortChange: function(column) {

          if(column.order=='ascending'){
            this.order='asc';
            this.sort=column['prop'];
            this.up()
          }else if(column.order=='descending'){
            this.order='desc';
            this.sort=column['prop'];
            this.up()
          }else{
            this.order='asc';
            this.sort='id';
            this.up()
          }
          // console.log(column + '-' + column.prop + '-' + column.order)
        },

        // 关闭dialog
        handleClose(done) {
            done();
        },

        //webssh
        handleCloseWebSSH(done){
          done()
          // console.log(done);
        },

        // 表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let that = this;
                    let data=new URLSearchParams();
                    data.append("group_name",that.ruleForm.group_name);
                    data.append("host_name",that.ruleForm.host_name);
                    data.append("ip_inside",that.ruleForm.ip_inside);
                    data.append("ip_outside",that.ruleForm.ip_outside);
                    // this.$message.error('ret_data.describe')
                    this.hostadd(data,that,function (self,ret_data){
                        if(ret_data.status==='ok'){
                            self.dialogVisible=false
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
            }
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
  border-bottom: 1px dashed #666666;
}




.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

#search_input{
  float: right;
  margin-right:50px;
  margin-bottom: 10px;
}




</style>
