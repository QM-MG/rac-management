<template>
    <div class="login-container">
        <form method="post" action="/rac/login" label-width="70px" class="el-form login-form" style="background-color: black;">
            <p class="login-title">rac权限管理系统</p>
            
            <div class="el-form-item">
                <label class="el-form-item__label" style="width:70px;color:white;">用户名：</label>
                <div class="el-form-item__content">
                    <div class="el-input" style="display:inline;width:315px;">
                    <input type="text" class="el-input__inner" id="userName" name="userName" style="display:inline;width:305px;"
                    placeholder="请输入用户名">
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label" style="width:70px;color:white;">密码：</label>
                <div class="el-form-item__content">
                    <div class="el-input" style="display:inline;width:315px;">
                        <input type="password" class="el-input__inner" id="password" name="password" style="display:inline;width:305px;"
                            placeholder="请输入密码">
                    </div>
                </div>
            </div>
            <button type="submit" class="el-button login-btn el-button--primary" style="margin-left:70px">登录</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import {
    login,
    loginAxios
} from '@/api/common/index';
export default {
    data() {
        return {
            param: {}
        };
    },
    mounted() {

    },
    methods: {
        onSubmit() {
            console.log(qs.stringify(this.param))
            axios({
                url: '/rac/login',
                method: 'post',
                data: qs.stringify(this.param),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            // try {
            //     let res = await login(this.param);
            //     this.$router.push({
            //         path: '/'
            //     })
            // }
            // catch (e) {
            //     this.$message({
            //         message: e || '查询失败！',
            //         type: 'error'
            //     })
            // }
        }
    }
};
</script>
<style lang="less">
.login-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    color: white;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
    background-size: cover;
    background-image: url('../assets/img/login-bg.jpeg');
    .login {
        &-form {
            border-radius: 6px;
            width: 385px;
            border: 1px solid #eee;
            padding: 50px;
        }
        &-title {
            text-align: center;
            margin-bottom: 20px;
        }
        &-btn {
            width: 307px;
        }
    }
}
</style>



