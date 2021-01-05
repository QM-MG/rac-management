<template>
    <div>
        <div class="content-title">
            <span>角色列表</span>
            <el-button type="primary" @click="saveRole" size="mini" class="btn-right">保存</el-button>
        </div>
        <el-tree
            :key="bizLineId"
            class="tree-wrap"
            :data="roleAll"
            node-key="id"
            ref="roleTree"
            :props="defaultProps"
            show-checkbox
            >
        </el-tree>
    </div>
</template>
<script>
import {
    userToRole,
    userToRoleSave
} from '@/api/user/index';
import {
    roleListAll,
} from '@/api/auth/index';
export default {
    data() {
        return {
            roleAll: [],
            defaultProps: {
                label: 'cnName',
                children: 'children',
                isLeaf: 'leaf'
            },
        };
    },
    mounted() {
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
    watch: {
        bizLineId(val) {
            if (val) {
                this.findRoleListAll();
            }
        },
        currRow(val) {
            if (val) {
                this.findUserToRole();
            }
        }
    },
    methods: {
        // 查全部角色
        async findRoleListAll() {
            let param = {
                bizLineId: this.bizLineId
            }
            try {
                let res = await roleListAll(param);
                this.roleAll = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查询用户已绑定的角色
        async findUserToRole() {
            let param = {
                bizLineId: this.bizLineId,
                userId: this.currRow.id
            }
            try {
                let res = await userToRole(param);
                let data = res.data || [];
                this.$refs.roleTree.setCheckedKeys(data);
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 保存角色
        async saveRole() {
            let roleIds = this.$refs.roleTree.getCheckedKeys();
            if (!this.currRow || !this.currRow.id) {
                this.$message({
                    message: '请选择用户！',
                    type: 'warning'
                })
                return;
            }
            let param = {
                bizLineId: this.bizLineId,
                userId: this.currRow.id,
                decentralizedControlId: this.currRow.decentralizedControlId,
                roleIds
            }
            try {
                let res = await userToRoleSave(param);
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
            }
            catch (e) {
                this.$message({
                    message: e || '保存失败！',
                    type: 'error'
                })
            }

        },
    }
};
</script>
<style lang="less">
</style>



