<template>
    <div class="left-menu">
        <el-menu
            class="el-menu-vertical-demo"
            router
            :default-active = "path"
            :collapse="toggleMenuShow"
            @open="handleOpen"
            @close="handleClose"
            @select="selectMenu"
            background-color="#304156"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
                </template>
                <el-menu-item index="/bizline">业务线管理</el-menu-item>
                <el-menu-item index="/user">用户管理</el-menu-item>
                <el-menu-item index="/auth">角色管理</el-menu-item>
                <el-menu-item index="/func">功能管理</el-menu-item>
                <el-menu-item index="/dictionary">字典管理</el-menu-item>
                <el-menu-item index="/property">扩展属性</el-menu-item>
                <el-menu-item index="/bizentity">实体管理</el-menu-item>
                <el-menu-item index="/dimension">维度管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            path: ''
        };
    },
    mounted() {
        this.init();
    },
    props: {
        toggleMenuShow: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        init() {
            this.path  = this.$route.path
        },
        handleOpen() {

        },
        handleClose() {

        },
        selectMenu(index) {
        }
    }
};
</script>

<style lang="less">
.left-menu {
    .el-menu {
        border-right: 0;
    }
}
</style>





