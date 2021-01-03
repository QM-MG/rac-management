<template>
    <div class="strategy">
        <div class="strategy-search">
            <el-input v-model="param.searchVal" placeholder="请输入内容" size="mini"></el-input>
            <el-select v-model="param.bizLineId" placeholder="请选择" size="mini" @change="search">
                <el-option
                v-for="item in bizLineList"
                :key="item.id"
                :label="item.cnName"
                :value="item.id">
                </el-option>
            </el-select>
            <el-button type="success" @click="search" size="mini">
                <i class="el-icon-search"></i>
                <span>搜索</span>
            </el-button>
            <el-button type="warning" @click="reset" size="mini">
                <i class="el-icon-refresh-left"></i>
                <span>重置</span>
            </el-button>
            <el-button type="primary" @click="showDialog('add')" size="mini">
                <i class="el-icon-plus"></i>
                <span>新增</span>
            </el-button>
        </div>
        <el-row class="content-wrap">
            <el-col class="content-border">
                <div class="content-title">
                    <span>策略列表</span>
                </div>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        width="60"
                        prop="id"
                        label="ID">
                    </el-table-column>
                    <el-table-column
                        prop="enName"
                        label="英文名">
                    </el-table-column>
                    <el-table-column
                        prop="cnName"
                        label="中文">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="类型">
                        <template slot-scope="scope">
                            <span v-show="scope.row.type == 1">全部数据</span>
                            <span v-show="scope.row.type == 2">用户扩展属性</span>
                            <span v-show="scope.row.type == 3">维度节点管控</span>
                            <span v-show="scope.row.type == 4">固定值</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="expression"
                        label="表达式">
                    </el-table-column>
                    <el-table-column
                        prop="priority"
                        label="优先级">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注">
                    </el-table-column>
                    <el-table-column
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
            </el-col>
        </el-row>
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogVisible"
            custom-class="add-dialog"
            width="60%">
            <el-form ref="form" :model="addParam" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="英文名">
                            <el-input v-model="addParam.enName" size="mini" :disabled="status=='edit'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="中文名">
                            <el-input v-model="addParam.cnName" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型">
                            <el-select v-model="addParam.type" placeholder="请选择" size="mini">
                                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="表达式">
                            <el-input v-model="addParam.expression" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="优先级">
                            <el-input v-model="addParam.priority" size="mini" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input v-model="addParam.remark" size="mini"></el-input>
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
import pagination from '@/components/pagination';
import {searchStrategy,edit,del,add} from '@/api/strategy/index';
import {searchBizLine} from '@/api/bizline/index';

export default {
    data() {
        return {
            tableData: [],
            bizLineList:[],
            titleDialog: '新增策略',
            param: {
                searchVal: ''
            },
            options: [{
                id: 1,
                name: '全部数据'
            }, {
                id: 2,
                name: '用户扩展属性'
            }, {
                id: 3,
                name: '维度节点管控'
            }, {
                id: 4,
                name: '全部固定值数据'
            }],
            addParam: {},
            status: 'add',
            dialogVisible: false,
            totalCount: 0,
            pageNo: 1,
            pageSize: 20
        };
    },
    mounted() {
        this.searchbizLineList();
    },
    components: {pagination},
    methods: {
        async searchbizLineList() {
            try {
                let res = await searchBizLine();
                this.bizLineList = res.data || [];
                if (this.bizLineList.length > 0) {
                    this.param.bizLineId = this.bizLineList[0].id;
                    this.search();
                }
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchStrategy(this.param);
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
        showDialog(status, row) {
            if (status === 'add') {
                this.status = 'add';
                this.titleDialog = '新增策略';
                this.addParam = {};
            }
            else {
                this.status = 'edit';
                this.titleDialog = '编辑策略';
                this.addParam = row;
            }
            this.dialogVisible = true;
        },
        save() {
            if (this.status === 'add') {
                this.add();
            }
            else {
                this.edit();
            }
            
        },
        async add() {
            try {
                this.addParam.bizLineId = this.param.bizLineId;
                let res = await add(this.addParam);
                this.dialogVisible = false;
                this.search();
            }
            catch (e) {
                this.$message({
                    message: e || '新增失败！',
                    type: 'error'
                })
            }
        },
        async edit(row) {
            try {
                let res = await edit(this.addParam);
                this.dialogVisible = false;
            }
            catch (e) {
                this.$message({
                    message: e || '修改失败！',
                    type: 'error'
                })
            }
        },
        async del(row) {
            let param = {
                id: row.id,
                bizLineId: row.bizLineId
            }
            try {
                let res = await del(param);
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
                this.search();
            }
            catch (e) {
                this.$message({
                    message: e || '删除失败！',
                    type: 'error'
                })
            }
        },
        reset() {
            this.param = {
                bizLineId: this.bizLineList[0].id
            };
            this.pageSize = 20;
            this.pageNo = 1;
            this.search();
        },
        // 分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageNo = 1;
            this.search();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.search();
        }
    }
};
</script>

<style lang="less">
.strategy {
    .strategy-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .strategy-add {
        float: right;
    }
}
.add-dialog {
    .el-input {
        width: 180px;
        margin-right: 10px;
    }
}
</style>





