<template>
    <div class="login-container">
        <el-form :model="loginForm" :rules="loginRules"
         status-icon
         ref="loginForm"
         label-position="left"
         label-width="0px"
         class="demo-ruleForm login-page">
            <h3 class="title">运维系统DevOps</h3>
            <el-form-item prop="username">
                <el-input type="text"
                    v-model="loginForm.username"
                    placeholder="用户名"
                ></el-input>
            </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password"  v-model="loginForm.password" placeholder="密码"></el-input>
                </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            logining: false,
            loginForm: {
                username: '',
                password: '',
            },
            loginRules: {
                username: [{required: true, message: 'please enter your account'}],
                password: [{required: true, message: 'enter your password'}]
            },
            checked: false
        }
    },
    methods: {
        login(data_,self,callBack){
            this.$axios({
                        url:this.$apiUrl.login,
                        method:"post",
                        data:data_,
            }).then(res=>{
                callBack(self,res.data)
            })
        },
        handleSubmit(event){
            this.$refs.loginForm.validate((valid) => {
                if(valid){
                    let that = this;
                    let data=new URLSearchParams();
                    data.append("username",that.loginForm.username);
                    data.append("password",that.loginForm.password);
                    this.login(data,that,function (self,ret_data){
                        if(ret_data.status==='ok'){
                            self.$notify({
                                title: '成功',
                                dangerouslyUseHTMLString: true,
                                message: '<i>'+'用户验证成功'+'</i>',
                                type: 'success',
                                duration:1000,
                                });
                                let redirect = decodeURIComponent(self.$route.query.redirect || '/'); 
                                console.log(redirect);
                                // that.$router.push({ path: redirect })// 获取登录成功后要跳转的路由。decodeURIComponent函数编码的 URI 进行解码--xlz

                                that.$router.push({path: '/'});
                        }else{
                                self.$notify({
                                title: ret_data.status,
                                dangerouslyUseHTMLString: true,
                                message: '<i>'+ret_data.describe+'</i>',
                                type:'error',
                                duration:1000,
                                });
                        }
                    })
                    // if(that.loginForm.username==='zhangkuikui' && that.loginForm.password==='123'){
                    //     console.log('aa')
                    //     this.$router.push({path: '/'});
                    // }else{
                    //     console.log('用户名或密码不正确')
                    // }
                }else{
                    console.log('error submit!');
                    return false;
                }
            })
        }
    },
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
h3{
    margin-top: 10px;
    color: #f36a5a;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
.el-button--primary{
    background-color: #f36a5a;
    border-color: #f36a5a;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>
