<template>
    <div class="title">
        <i class="el-icon-menu" @click="toggleMenu"></i>
        <img src="../assets/img/avatar.jpg" class="avatar-img" />
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
    },
    methods: {
        toggleMenu() {
            this.$emit("toggleMenu")
        }
    }
};
</script>
<style lang="less">
.title {
    height: 50px;
    margin-bottom: 5px;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
    .el-icon-menu {
        font-size: 24px;
        color: #304156;
        line-height: 50px;
        margin-left: 5px;
        cursor: pointer;
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



