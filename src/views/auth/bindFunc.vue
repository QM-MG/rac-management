<template>
    <div>
        <div class="content-title">
            <span>功能列表</span>
            <el-button type="primary" @click="add" size="mini" class="btn-right"><i class="el-icon-plus"></i><span>新增</span></el-button>
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
                label="策略名称">
            </el-table-column>
            <el-table-column
                width="120"
                label="操作">
                <template slot-scope="scope">
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
                            <el-cascader
                                :key="count"
                                v-model="parentIdList"
                                :props="funcProps"
                                size="mini"
                                clearable>
                            </el-cascader>
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
import {saveBind,saveUnbind,roleToFunc,roleFuncList} from '@/api/auth/index';
import {findFuncTree} from '@/api/func/index';
import {searchStrategyAll} from '@/api/strategy/index';
import pagination from '@/components/pagination';

export default {
    data() {
        let me = this;
        return {
            funcProps: {
                value: 'id',
                label: 'cnName',
                multiple: true,
                lazy: true,
                checkStrictly: true,
                async lazyLoad (node, resolve) {
                    if (node.level === 0) {
                        let list = await me.findFuncTree(-1);
                        return resolve(list);
                    }
                    else{
                        let list = await me.findFuncTree(node.value);
                        return resolve(list);
                    }
                }
            },
            searchStragegyList: [],
            parentIdList: [],
            dialogVisible: false,
            titleDialog: '新增授权列表',
            addParam: {},
            param: {},
            count: 0,
            tableData: [],
            totalCount: 0,
            pageNo: 1,
            pageSize: 20,
            parList: []
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
            this.searchStragegyListFun();
        },
        currRow(val) {
            this.searchData();
            this.count++;
        },
        parentIdList(list) {
            this.parList = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i] && list[i].length > 0) {
                    this.parList.push(list[i][list[i].length - 1])
                }
            }
        }
    },
    mounted() {
    },
    methods: {
        add() {
            if (!this.currRow.id) {
                this.$message({
                    message: '请选择角色！',
                    type: 'warning'
                })
                return;
            }
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
        async searchStragegyListFun() {
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
            this.addParam.funcIds = this.parList;
            this.addParam.bizLineId = this.bizLineId;
            this.addParam.roleId = this.currRow.id;
            try {
                let res = await saveBind(this.addParam);
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
                this.dialogVisible = false;
                this.searchData();
            }
            catch (e) {
                this.$message({
                    message: e || '保存失败！',
                    type: 'error'
                })
            }
        },
        async del(row) {
            let param = {
                bizLineId: this.bizLineId,
                roleId: this.currRow.id,
                strategyId: row.strategyId,
                funcIds: [row.funcId]
            }
            try {
                let res = await saveUnbind(param);
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
                this.searchData();
            }
            catch (e) {
                this.$message({
                    message: e || '删除失败！',
                    type: 'error'
                })
            }
        },
        // 分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageNo = 1;
            this.searchData();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.searchData();
        },
    }
};
</script>
<style lang="less">
</style>



