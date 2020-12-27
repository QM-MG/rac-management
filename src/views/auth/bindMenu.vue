<template>
    <div>
        <div class="content-title">
            <span>菜单列表</span>
            <el-button type="primary" @click="save" size="mini" class="btn-right"><i class="el-icon-check"></i><span>保存</span></el-button>
        </div>
        <el-tree
            :data="treeList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
        </el-tree>
        
    </div>
</template>
<script>
import {findMenuAllTree} from '@/api/menu/index';
import {saveBindMenu, findMenuToBind} from '@/api/auth/index';
export default {
    data() {
        return {
            treeList: [],
            addParam: {},
            defaultProps: {
                label: 'cnName',
                children: 'childList',
                isLeaf: 'leaf'
            },
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
    watch: {
        bizLineId(val) {
            this.findMenuListAll();
        },
        currRow(val) {
            this.findMenuToBind();
        },
    },
    mounted() {
    },
    methods: {
        // 查全部菜单
        async findMenuListAll() {
            let param = {
                bizLineId: this.bizLineId
            }
            try {
                let res = await findMenuAllTree(param);
                this.treeList = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查询已绑定的菜单
        async save() {
            // let halfKeys = this.$refs.tree.getHalfCheckedKeys();
            // let checkedKeys = this.$refs.tree.getCheckedKeys();
            let menuIds = this.$refs.tree.getCheckedKeys(true);
            console.log(menuIds)
            this.addParam.menuIds = menuIds;
            this.addParam.bizLineId = this.bizLineId;
            this.addParam.roleId = this.currRow.id;
            try {
                let res = await saveBindMenu(this.addParam);
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
                this.dialogVisible = false;
                this.findMenuToBind();
            }
            catch (e) {
                this.$message({
                    message: e || '保存失败！',
                    type: 'error'
                })
            }
        },
        // 查询已绑定的菜单
        async findMenuToBind() {
            try {
                let param = {
                    bizLineId: this.bizLineId,
                    roleId: this.currRow.id
                }
                let res = await findMenuToBind(param);
                let data = res.data || [];
                this.$refs.tree.setCheckedKeys(data);
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
</style>



