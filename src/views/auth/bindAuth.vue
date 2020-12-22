<template>
    <div>
        <div class="content-title">
            <span>授权列表</span>
            <el-button type="primary" @click="add" size="mini" class="btn-right"><i class="el-icon-check"></i><span>新增</span></el-button>
        </div>
        <el-table
            :data="tableData"
            highlight-current-row
            style="width: 100%">
            <el-table-column
                prop="funcName"
                label="功能名称"
                >
            </el-table-column>
            <el-table-column
                prop="strategyName"
                label="策略名称"
            >
            </el-table-column>
            
            <el-table-column
                width="120"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="showDialog('edit', scope.row)" class="el-button el-button--primary is-circle  el-button--mini" type="button">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button @click="del(scope.row)" class="el-button el-button--danger is-circle el-button--mini" type="button">
                        <i class="el-icon-delete"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            :totalCount="totalCount"
            :pageNo="pageNo"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
            >
        </pagination>
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogVisible"
            custom-class="add-dialog"
            width="60%">
            <el-form ref="form" :model="addParam" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="功能树">
                            <el-tree
                                class="tree"
                                :key="bizLineId"
                                v-if="bizLineId"
                                :props="props"
                                node-key="id"
                                icon-class="tree-node-icon"
                                ref="tree"
                                :load="loadNode"
                                lazy
                                show-checkbox>
                            </el-tree>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="策略">
                             <el-select v-model="addParam.strategyId" size="mini" placeholder="请选择">
                                <el-option
                                v-for="item in searchStragegyList"
                                :key="item.id"
                                :label="item.cnName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="save" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {saveBind,roleToFunc,roleFuncList} from '@/api/auth/index';
import {findFuncTree} from '@/api/func/index';
import {searchStrategyAll} from '@/api/strategy/index';
import pagination from '@/components/pagination';

export default {
    data() {
        return {
            props: {
                label: 'cnName',
                children: 'children'
            },
            dialogVisible: false,
            titleDialog: '新增授权列表',
            addParam: {},
            param: {},
            tableData: [],
            totalCount: 0,
            pageNo: 1,
            pageSize: 20,
        };
    },
    props: {
        bizLineId: {
            type: String | Number,
            default: '',
        },
        currRow: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    components: {pagination},
    watch: {
        bizLineId(val) {
            this.searchStragegyList();
        },
        currRow(val) {
            this.findRoleToFunc();
            this.searchData();
        }
    },
    mounted() {
    },
    methods: {
        add() {
            this.dialogVisible = true;
            this.addParam = {};
        },
        async searchData() {
            this.param.bizLineId = this.bizLineId;
            this.param.id = this.currRow.id;
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await roleFuncList(this.param);
                let data = res.data || {};
                this.totalCount = data.totalCount;
                this.tableData = data.dataList || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 功能树
        async loadNode(node, resolve) {
            if (node.level === 0) {
                let list = await this.findFuncTree(-1);
                return resolve(list);
            }
            else{
                let list = await this.findFuncTree(node.data.id);
                return resolve(list);
            }
        },
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.bizLineId,
                parentId
            }
            try {
                let res = await findFuncTree(param);
                let treeList = res.data || [];
                return treeList
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查询角色已绑定的功能
        async findRoleToFunc() {
            try {
                let param = {
                    bizLineId: this.bizLineId,
                    roleId: this.currRow.id
                }
                let res = await roleToFunc();
                let data = res.data || [];
                this.$refs.tree.setCheckedKeys(data);
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查询策略
        async searchStragegyList() {
            try {
                let param = {
                    bizLineId: this.bizLineId,
                }
                let res = await searchStrategyAll(param);
                this.searchStragegyList = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }

        },
        async save() {
            if (!this.currRow.id) {
                this.$message({
                    message: '请选择角色！',
                    type: 'warning'
                })
                return;
            }
            this.addParam.bizLineId = this.bizLineId;
            this.addParam.id = this.currRow.id;
            this.addParam.funcIds = this.$refs.tree.getCheckedKeys();
            
            try {
                let res = await saveBind(this.addParam);
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
                this.dialogVisible = false;
            }
            catch (e) {
                this.$message({
                    message: e || '保存失败！',
                    type: 'error'
                })
            }
        },
        // 分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageNo = 1;
            this.search();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
        },
    }
};
</script>
<style lang="less">
</style>



