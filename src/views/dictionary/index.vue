<template>
    <div class="dictionary">
        <div class="dictionary-search">
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
            <el-col :span="14" class="content-border">
                <div class="content-title">
                    <span>字典列表</span>
                </div>
                <el-table
                    :data="tableData"
                    @row-click="rowClick"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="ID"
                        >
                    </el-table-column>
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
                        width="100"
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
            <el-col :span="9" :offset="1" class="content-border">
                <define
                    ref="define"
                    :bizLineId="param.bizLineId"
                    :bizLineList="bizLineList"
                    :currRow="currRow"
                    @search="search"
                    @getDicNode="getDicNode"
                    ></define>
                <div style="margin-top:40px;">
                    <save-property
                        v-if="currRow && currRow.useExtProperty === 0"
                        :bizLineId="param.bizLineId"
                        :currRow="currRow"
                        :dicNode="dicNode">
                    </save-property>
                </div>
            </el-col>
        </el-row>
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogVisible"
            custom-class="add-dialog"
            width="60%">
            <el-form ref="form" :model="addParam" label-width="130px">
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
                        <el-form-item label="业务线">
                            <el-select v-model="addParam.bizLineId" size="mini" placeholder="请选择" disabled>
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
                        <el-form-item label="是否需要扩展属性">
                            <template>
                                <el-radio v-model="addParam.useExtProperty" :label="0">是</el-radio>
                                <el-radio v-model="addParam.useExtProperty" :label="1">否</el-radio>
                            </template>
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
import {
    searchData,
    edit,
    del,
    add,
    findDictionaryTreeList,
    treeAdd,
    treeEdit,
    treeDel
} from '@/api/dictionary/index';
import {searchBizLine} from '@/api/bizline/index';
import define from './define.vue';
import saveProperty from './saveProperty';

export default {
    data() {
        return {
            tableData: [],
            bizLineList: [],
            param: {
                bizLineId: '',
                searchVal: ''
            },
            titleDialog: '新增字典',
            addParam: {
                useExtProperty: 1
            },
            dicNode: {},
            dictionaryList: [],
            dialogVisible: false,
            totalCount: 0,
            status: 'add',
            currRow: null,
            pageNo: 1,
            pageSize: 20,
        };
    },
    mounted() {
        this.searchbizLineList();
    },
    watch: {
    },
    components: {pagination, define, saveProperty},
    methods : {
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchData(this.param);
                let data = res.data || {};
                this.totalCount = data.totalCount;
                this.tableData = data.dataList || [];
                if (this.tableData.length > 0  && !this.currRow) {
                    this.currRow = this.tableData[0];
                }
                this.$refs.define.renderTree();
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
        // 删除节点
        async remove(node, data) {
            try {
                let res = await treeDel({id: data.id, bizLineId: data.bizLineId, dictionaryId: data.dictionaryId});
                this.refs.define.renderTree();
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
                this.titleDialog = '新增字典';
                this.addParam = {
                    useExtProperty: 1
                };
                if (this.bizLineList.length > 0) {
                    this.addParam.bizLineId = this.param.bizLineId;
                }
            }
            else {
                this.status = 'edit';
                this.addParam = row;
                this.titleDialog = '编辑字典';
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
        // 点击当前行
        rowClick(row) {
            this.currRow = {};
            setTimeout(() => {
                this.currRow = row;
            }, 0)
        },
        // 得到字典枚举节点
        getDicNode(node) {
            this.dicNode = node;
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
            this.search();
        }
    }
};
</script>

<style lang="less">
.dictionary {
    .dictionary-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .dictionary-add {
        float: right;
    }
    .tree-wrap {
        .content-title {
            float: left;
        }
        .tree-add {
            float: right;
        }
    }
    .tree {
        clear: both;
        font-size: 14px;
    }
    .tree-node-icon {
        font-weight: 900;
        color:#3f9eff;
    }
    .tree-del-icon {
         font-size: 12px;
         color:#F56C6C;
    }
}
.add-dialog {
    .el-input {
        width: 180px;
        margin-right: 10px;
    }
}
</style>





