<template>
    <div class="dimension">
        <div class="dimension-search">
            <el-input v-model="param.searchVal" placeholder="请输入内容" size="mini"></el-input>
            <el-select v-model="param.bizLineId" placeholder="请选择" size="mini" @change="changeLine">
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
                    <span>维度列表</span>
                </div>
                <el-table
                    :data="tableData"
                    @row-click="rowClick"
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                        width="60"
                        prop="id"
                        label="ID">
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
                        width="200"
                        label="更新时间">
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
            <el-col :span="9" :offset="1"  class="content-border">
                <bind-dimension
                ref="bindDimension"
                :bizLineId="param.bizLineId"
                :currRow="currRow"
                :dictionaryId="dictionaryId"
                :bizLineList="bizLineList"
                @getDimNode="getDimNode"></bind-dimension>
                <div style="margin-top:40px;">
                    <save-property
                        v-if="currRow && currRow.useExtProperty === 0"
                        :bizLineId="param.bizLineId"
                        :currRow="currRow"
                        :dimNode="dimNode">
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
                <el-row>
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
import bindDimension from './bindDimension';
import pagination from '@/components/pagination';
import saveProperty from './saveProperty';
import {
    searchData,
    edit,
    del,
    add,
    findTreeList,
    treeAdd,
    treeEdit,
    treeDel
    } from '@/api/dimension/index';
import {searchBizLine} from '@/api/bizline/index';
import {searchDictionaryAll,findDictionaryTreeByName} from '@/api/dictionary/index';


export default {
    data() {
        return {
            tableData: [],
            param: {
                searchVal: ''
            },
            titleDialog: '新增维度管理',
            bizLineList: [],
            addParam: {
                useExtProperty: 1
            },
            dictionaryId: null,
            dictionaryList: [],
            dialogVisible: false,
            totalCount: 0,
            status: 'add',
            dimNode: {},
            currRow: {},
            pageNo: 1,
            pageSize: 20,
        };
    },
    mounted() {
        this.searchBizLineList();
    },
    components: {pagination,bindDimension,saveProperty},
    methods: {
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchData(this.param);
                let data = res.data || {};
                this.totalCount = data.totalCount;
                this.tableData = data.dataList || [];
                if (this.tableData.length > 0) {
                    this.currRow = this.tableData[0];
                }
                this.searchDictionaryAll();
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
                    this.canChooseDimension = this.bizLineList[0].decentralizedControl === 0 ? true: false;
                    this.enName = this.bizLineList[0].decentralizedControlEnName;
                    this.search();
                    this.findDictionaryId();
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
        changeLine(val) {
            for(let i = 0; i < this.bizLineList.length; i++) {
                if (this.bizLineList[i].id ===  val) {
                    let decentralizedControl = this.bizLineList[i].decentralizedControl;
                    this.canChooseDimension = decentralizedControl === 0 ? true: false;
                    this.enName = this.bizLineList[i].decentralizedControlEnName;
                }
            }
            this.findDictionaryId();
            this.search();
        },
        // 查字典
        async findDictionaryId() {
            if (!this.enName) {
                return;
            }
            try {
                let param = {
                    bizLineId: this.param.bizLineId,
                    enName: this.enName
                }
                let res = await findDictionaryTreeByName(param);
                let data = res.data || {};
                this.dictionaryId = data.id;
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
        async edit() {
            try {
                let res = await edit(this.addParam);
                this.dialogVisible = false;
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
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
                this.renderTree();
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
        // 刷新key值，重新渲染tree
        renderTree() {
            this.treeKey = +new Date();
        },
        getDimNode(val) {
            this.dimNode = val;
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
    .tree {
        clear: both;
        font-size: 14px;
        .content-title {
            float: left;
        }
        .tree-add {
            float: right;
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
}
</style>





