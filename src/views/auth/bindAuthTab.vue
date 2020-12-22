<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="添加功能" name="first">
                <bind-func
                    :bizLineId="bizLineId"
                    :currRow="currRow"
                ></bind-func>
            </el-tab-pane>
            <el-tab-pane label="添加菜单" name="second">
                <bind-menu
                    :bizLineId="bizLineId"
                    :currRow="currRow"
                ></bind-menu>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import bindFunc from './bindFunc.vue';
import bindMenu from './bindMenu.vue';

export default {
    components: { bindFunc, bindMenu},
    data() {
        return {
            activeName: 'first',
        };
    },
    props: {
        bizLineId: {
            type: String | Number,
            default: ''
        },
        currRow: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    mounted() {
    },
    methods: {
    }
};
</script>
<style lang="less">
</style>



