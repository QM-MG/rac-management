<template>
    <div class="dimension">
        <div class="dimension-search">
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
            <el-button type="success" class="dimension-add" @click="showDialog('add')" size="mini">新增</el-button>
        </div>
         <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="enName"
                label="英文名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="cnName"
                label="中文"
                width="180">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间">
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
            <el-form ref="form" :model="addParam" label-width="100px">
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
                        <el-form-item label="产品线">
                            <el-select v-model="addParam.bizLineId" size="mini" placeholder="请选择" :disabled="status=='edit'">
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
                        <el-form-item label="维度节点类型">
                            <el-select v-model="addParam.nodeTypeId" size="mini" placeholder="请选择" :disabled="status=='edit'">
                                <el-option
                                v-for="item in dictionaryList"
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
import pagination from '@/components/pagination';
import {searchData,edit,del,add} from '@/api/dimension/index';
import {searchBizLine} from '@/api/bizline/index';
import {searchDictionaryAll} from '@/api/dictionary/index';

export default {
    data() {
        return {
            tableData: [],
            param: {
                searchVal: ''
            },
            titleDialog: '新增维度管理',
            bizLineList: [],
            addParam: {},
            dialogVisible: false,
            totalCount: 0,
            status: 'add',
            pageNo: 1,
            pageSize: 20
        };
    },
    mounted() {
        this.searchBizLineList();
    },
    components: {pagination},
    methods: {
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchData(this.param);
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
        async searchBizLineList() {
            try {
                let res = await searchBizLine();
                this.bizLineList = res.data || [];
                if (this.bizLineList.length > 0) {
                    this.param.bizLineId = this.bizLineList[0].id;
                    this.search();
                    this.searchDictionaryAll();
                }
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        async searchDictionaryAll() {
            try {
                let res = await searchDictionaryAll(this.param);
                this.dictionaryList = res.data || [];
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
                this.titleDialog = '新增维度管理';
                this.addParam = {};
                if (this.bizLineList.length > 0) {
                    this.addParam.bizLineId = this.bizLineList[0].id;
                }
            }
            else {
                this.status = 'edit';
                this.addParam = row;
                this.titleDialog = '编辑维度管理';
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
        reset() {
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
.dimension {
    .dimension-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .dimension-add {
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





