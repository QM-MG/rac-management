<template>
    <div class="title-style" :style="{width:toggleMenuShow? 'calc(100% - 64px)': 'calc(100% - 250px)'}">
        <i class="el-icon-menu" @click="toggleMenu"></i>
        <el-breadcrumb  separator-class="el-icon-arrow-right" class="bread-wrap">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-show="showBread">{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown  @command="handleCommand">
            <span class="el-dropdown-link">
                <img src="../assets/img/avatar.jpg" class="avatar-img" />
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import {
    logout
} from '@/api/common/index';
export default {
    name: 'top',
    data() {
        return {
            showBread: true
        };
    },
    mounted() {
    },
    props: {
        toggleMenuShow: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        '$route' (to, from) {
            if (to.path !== '/') {
                this.showBread = true;
            }
        }
    },
    methods: {
        toggleMenu() {
            this.$emit("toggleMenu")
        },
        handleCommand(command) {
            if (command === 'a') {
                this.logout();
            }
        },
        async logout() {
            try {
                let res = await logout();
                this.$router.push({
                    path: '/login'
                })
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        }
        
    }
};
</script>
<style lang="less">
.title-style {
    width: 100%;
    height: 50px;
    margin-bottom: 5px;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
    position: fixed;
    background-color: #fff;
    top: 0;
    right: 0;
    z-index: 9;
    .el-icon-menu {
        font-size: 24px;
        color: #304156;
        line-height: 50px;
        margin-left: 5px;
        cursor: pointer;
        float: left;
    }
    .el-dropdown {
        float: right;
    }
    .avatar-img {
        width: 40px;
        height: 40px;
        float: right;
        margin-right: 20px;
        margin-top: 5px;
    }
    .bread-wrap {
        float: left;
        margin-top: 17px;
        margin-left: 20px;
    }
}
</style>



