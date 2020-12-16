<template>
    <div class="title-style" :style="{width:toggleMenuShow? 'calc(100% - 64px)': 'calc(100% - 250px)'}">
        <i class="el-icon-menu" @click="toggleMenu"></i>
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
export default {
    data() {
        return {};
    },
    mounted() {
    },
    props: {
        toggleMenuShow: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        toggleMenu() {
            this.$emit("toggleMenu")
        },
        handleCommand(command) {
            if (command === 'a') {
                this.$router.push('/login')
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
}
</style>



