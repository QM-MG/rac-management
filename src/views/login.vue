<template>
    <div class="login-container">
        <el-form ref="form" :model="login" label-width="80px" class="login-form">
            <p class="login-title">rac权限管理系统</p>
            <el-form-item label="用户名">
                <el-input v-model="login.name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="login.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" class="login-btn">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            login: {}
        };
    },
    mounted() {
    },
    methods: {
        onSubmit() {
            this.$router.push({
                path: '/bizline'
            })
        }
    }
};
</script>
<style lang="less">
.login-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
    background-size: cover;
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



