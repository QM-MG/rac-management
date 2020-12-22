<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="添加角色" name="first">
                <save-role
                    :bizLineId="bizLineId"
                    :currRow="currRow"
                ></save-role>
            </el-tab-pane>
            <el-tab-pane label="添加维度" name="second">
                <save-dimension
                    :bizLineId="bizLineId"
                    :currRow="currRow"
                ></save-dimension>
            </el-tab-pane>
            <el-tab-pane label="添加属性" name="third">
                <save-property
                    :bizLineId="bizLineId"
                    :currRow="currRow">
                </save-property>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import saveRole from './saveRole.vue';
import saveDimension from './saveDimension.vue';
import saveProperty from './saveProperty.vue';

export default {
    components: { saveRole, saveDimension ,saveProperty},
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



