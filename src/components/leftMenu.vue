<template>
    <div class="left-menu">
        <el-scrollbar>
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
                <el-menu-item class="sidebar-logo-container">
                    <img src="../assets/img/logo_icon.png" class="sidebar-logo">
                    <span slot="title">Rac权限管理系统</span>
                </el-menu-item>
                <div v-for="(menu, index) in menuList" :key="index">
                    <el-submenu v-if="menu.path == '#'" :index="menu.id">
                        <template slot="title" v-if="menu.level == 1">
                            <i class="el-icon-location"></i>
                            <span>{{menu.cnName}}</span>
                        </template>
                        <div v-if="menu.childList.length > 0" >
                            <el-menu-item
                                v-for="item in menu.childList"
                                :index="item.path"
                                :key="item.path">{{item.cnName}}
                            </el-menu-item> 
                            <!-- <menu-tree :menuList="menu.childList"></menu-tree>-->
                        </div>
                    </el-submenu>
                    <el-menu-item :index="menu.path" v-else>
                        <i class="el-icon-document"></i>
                        <span slot="title">{{menu.cnName}}</span>
                    </el-menu-item>
                </div>
                <!-- <menu-tree :menuList="menuList"></menu-tree> -->
            </el-menu>
        </el-scrollbar>
        <!-- 
            <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.id">
                <template slot="title">
                <i :class="menu.icon" ></i>
                <span slot="title">{{menu.name}}</span>
                </template>
                <MenuTree v-for="item in menu.children" :key="item.id" :menu="item"></MenuTree>
            </el-submenu>
            <el-menu-item v-else :index="'' + menu.id" @click="handleRoute(menu)">
                <i :class="menu.icon"></i>
                <span slot="title">{{menu.name}}</span>
            </el-menu-item>
         -->
    </div>
</template>
<script>
import menuTree from './menuTree.vue';
export default {
    components: { menuTree },
    data() {
        return {
            path: ''
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        menuList() {
            return global.menuList
        }
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
    height: 100%;
    .el-scrollbar {
        height: 100%;
    }
    .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
    .el-menu {
        border-right: 0;
    }
    .sidebar-logo {
        width:30px;
        height:30px;
        padding-right: 10px;
    }
}
</style>





