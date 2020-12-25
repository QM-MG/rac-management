<template>
    <div>
        <div v-for="(menu, index) in menuList" :key="index">
            <el-submenu v-if="menu.path == '#'" :index="menu.seq">
                <template slot="title" v-if="menu.level == 1">
                    <i class="el-icon-location"></i>
                    <span>{{menu.cnName}}</span>
                </template>
                <div v-if="menu.childList.length > 0" >
                    <!-- <el-menu-item
                        v-for="item in menu.childList"
                        :index="item.path"
                        :key="item.path">{{item.cnName}}
                    </el-menu-item> -->
                    <menu-tree :menuList="menu.childList"></menu-tree>
                </div>
            </el-submenu>
            <el-menu-item :index="menu.path" v-else>
                <i class="el-icon-document"></i>
                <span slot="title">{{menu.cnName}}</span>
            </el-menu-item>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        menuList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    mounted() {
    },
    methods: {}
};
</script>

<style lang="less">
</style>





















