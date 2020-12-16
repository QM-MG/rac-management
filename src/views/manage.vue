<template>
    <div class="func">
        <div class="func-search">
            <el-input v-model="param.searchVal" placeholder="请输入内容" size="mini"></el-input>
            <el-select v-model="param.bizLineId" placeholder="请选择" size="mini">
                <el-option
                v-for="item in bizLineList"
                :key="item.id"
                :label="item.cnName"
                :value="item.id">
                </el-option>
            </el-select>
            <el-button type="success" @click="search" size="mini">搜索</el-button>
            <el-button type="warning" @click="reset" size="mini">重置</el-button>
            <el-button type="success" class="func-add" @click="showDialog('add')" size="mini">新增</el-button>
        </div>
        <!-- default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}" -->
         <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="enName"
                label="英文名"
                >
            </el-table-column>
            <el-table-column
                prop="cnName"
                label="中文"
            >
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="更新时间">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="showDialog('edit', scope.row)" type="text">
                        编辑
                    </el-button>
                    <el-button @click="del(scope.row)" type="text">
                        删除
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
                        <el-form-item label="英文名">
                            <el-input v-model="addParam.enName" size="mini" :disabled="status === 'edit'"></el-input>
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
                        <el-form-item label="产品线">
                            <el-select v-model="addParam.bizLineId" size="mini" placeholder="请选择" :disabled="lineDisabled || status=='edit'">
                                <el-option
                                v-for="item in bizLineList"
                                :key="item.id"
                                :label="item.cnName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="功能">
                            <el-tree
                                :props="props"
                                :load="loadNode"
                                lazy
                                ref="tree"
                                @node-click="nodeCheck">
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="功能url">
                            <el-input v-model="addParam.content" size="mini" :disabled="status === 'edit'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
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
import {searchFuncList,edit,del,add, findFuncTree} from '@/api/func/index';
import {searchBizLine} from '@/api/bizline/index';
export default {
    data() {
        return {
            tableData: [],
            param: {
                searchVal: '',
                bizLineId: ''
            },
            status: 'add',
            addParam: {
                parentId: -1,
            },
            dialogVisible: false,
            bizLineList: [],
            totalCount: 0,
            pageNo: 1,
            pageSize: 20,
            titleDialog: '新增功能',
            props: {
                label: 'cnName',
                children: 'children'
            },
            lineDisabled: false
        };
    },
    components: {pagination},
    mounted() {
        this.searchbizLineList();
    },
    methods: {
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchFuncList(this.param);
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
        showDialog(status, row) {
            if (status === 'add') {
                this.status = 'add';
                this.titleDialog = '新增功能';
                this.addParam = {
                    parentId : -1
                };
                if (this.bizLineList.length > 0) {
                    this.addParam.bizLineId = this.bizLineList[0].id;
                }
            }
            else {
                this.status = 'edit';
                this.titleDialog = '编辑功能';
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
                id: row.id
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
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.param.bizLineId,
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
        // 功能树
        async loadNode(node, resolve) {
            if (node.level === 0) {
                let list = await this.findFuncTree(-1);
                return resolve(list);
            }
            else{
                let list = await this.findFuncTree(node.id);
                return resolve(list);
            }
        },
        nodeCheck(node) {
            this.addParam.parentId = node.id;
            if (node.parentId !== -1) {
                this.addParam.bizLineId = '';
                this.lineDisabled = true;
            }
            else {
                this.lineDisabled = false;
            }
        },
        reset() {
            this.param = {};
            if (this.bizLineList.length > 0) {
                this.param.bizLineId = this.bizLineList[0].id;
            }
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
        }
    }
};
</script>

<style lang="less">
.func {
    .func-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .func-add {
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





