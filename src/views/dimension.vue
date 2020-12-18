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
        </div>
        <el-row class="content-wrap">
            <el-col :span="12" class="content-border">
                <div class="content-title">
                    <span>维度列表</span>
                    <el-button type="success" class="dimension-add" @click="showDialog('add')" size="mini">新增</el-button>
                </div>
                <el-table
                    :data="tableData"
                    @row-click="rowClick"
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
            </el-col>
            <el-col :span="10" :offset="2"  class="content-border">
                <div class="content-title">
                    <span>维度节点树</span>
                    <el-button class="dimension-add" type="success" @click="showTreeDialog('add')" size="mini">新增</el-button>
                </div>
                <el-tree
                    v-if="this.param.bizLineId && currRow.nodeTypeId"
                    class="tree"
                    :props="props"
                    :load="loadNode"
                    :key="treeKey"
                    lazy
                    ref="tree"
                    @node-click="nodeCheck">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => treeEdit(node, data)">
                            编辑
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            删除
                        </el-button>
                        </span>
                    </span>
                </el-tree>
            </el-col>
        </el-row>
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
                        <el-form-item label="业务线">
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
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogTreeVisible"
            custom-class="add-dialog"
            width="60%">
            <el-form ref="form" :model="addTreeParam" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="英文名">
                            <el-input v-model="addTreeParam.enName" size="mini" :disabled="status=='edit'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="中文名">
                            <el-input v-model="addTreeParam.cnName" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="业务线">
                            <el-select v-model="addTreeParam.bizLineId" size="mini" placeholder="请选择" :disabled="status=='edit'">
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
                            <el-cascader
                                v-model="parentIdList"
                                :props="funcProps"
                                size="mini"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="父节点">
                            <el-cascader
                                v-model="parentOwnIdList"
                                :props="funcOwnProps"
                                size="mini"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-switch
                                v-model="addTreeParam.status"
                                active-value="0"
                                inactive-value="1"
                                active-text="启用"
                                inactive-text="禁用">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTreeVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="treeSave" size="mini">确 定</el-button>
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
    findTreeList,
    treeAdd,
    treeEdit,
    treeDel
    } from '@/api/dimension/index';
import {findDictionaryTreeList} from '@/api/dictionary/index';
import {searchBizLine} from '@/api/bizline/index';
// import {searchDictionaryAll} from '@/api/dictionary/index';

export default {
    data() {
        let me = this;
        return {
            tableData: [],
            param: {
                searchVal: ''
            },
            props: {
                label: 'cnName',
                children: 'children'
            },
            parentIdList: [],
            parentOwnIdList: [],
            titleDialog: '新增维度管理',
            bizLineList: [],
            addParam: {},
            addTreeParam: {
                parentId: -1,
                type: -1,
                status: '1'
            },
            dictionaryList: [],
            dialogVisible: false,
            dialogTreeVisible: false,
            funcProps: {
                value: 'id',
                label: 'cnName',
                checkStrictly: true,
                lazy: true,
                async lazyLoad (node, resolve) {
                    if (node.level === 0) {
                        let list = await me.findDictionaryTreeList(-1);
                        return resolve(list);
                    }
                    else{
                        let list = await me.findDictionaryTreeList(node.value);
                        return resolve(list);
                    }
                }
            },
            funcOwnProps: {
                value: 'id',
                label: 'cnName',
                checkStrictly: true,
                lazy: true,
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
            treeKey: '',
            totalCount: 0,
            status: 'add',
            treeStatus: 'add',
            currRow: {},
            pageNo: 1,
            pageSize: 20
        };
    },
    mounted() {
        this.searchBizLineList();
    },
    watch: {
        parentIdList(val) {
            if (val.length > 0) {
                this.addTreeParam.type = val[val.length - 1];
                if (this.addTreeParam.type !== -1) {
                    this.lineDisabled = true;
                }
                else {
                    this.lineDisabled = false;
                }
            }
            else {
                this.addTreeParam.type = -1;
            }
        },
        parentOwnIdList(val) {
            if (val.length > 0) {
                this.addTreeParam.parentId = val[val.length - 1];
                if (this.addTreeParam.parentId !== -1) {
                    this.lineDisabled = true;
                }
                else {
                    this.lineDisabled = false;
                }
            }
            else {
                this.addTreeParam.parentId = -1;
            }
        },
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
                if (this.tableData.length > 0) {
                    this.currRow = this.tableData[0];
                }
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
                    // this.searchDictionaryAll();
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
                let dictionaryList = res.data || [];
                return dictionaryList;
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 维度节点树
        async findDictionaryTreeList(parentId) {
            let param = {
                bizLineId: this.param.bizLineId,
                dictionaryId: this.currRow.nodeTypeId,
                parentId
            }
            try {
                let res = await findDictionaryTreeList(param);
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
        showTreeDialog(status, row) {
            console.log(row)
            if (status === 'add') {
                this.treeStatus = 'add';
                this.titleDialog = '新增维度节点';
                this.addTreeParam = {
                    parentId: -1
                };
                if (this.bizLineList.length > 0) {
                    this.addTreeParam.bizLineId = this.bizLineList[0].id;
                }
            }
            else {
                this.treeStatus = 'edit';
                this.addTreeParam = row;
                this.parentIdList = [row.type];
                this.pparentOwnIdList = [row.parentId]
                this.titleDialog = '编辑维度节点';
            }
            this.dialogTreeVisible = true;
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
        async treeSave() {
            this.addTreeParam.dimensionId = this.currRow.id;
            try {
                let res = await treeAdd(this.addTreeParam);
                this.dialogTreeVisible = false;
                this.renderTree();
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
        // 点击当前行
        rowClick(row) {
            this.currRow = {};
            setTimeout(() => {
                this.currRow = row;
            }, 0)
        },
        // 维度节点树
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.param.bizLineId,
                dimensionId: this.currRow.id,
                parentId
            }
            try {
                let res = await findTreeList(param);
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
        async treeEdit(node, data) {
            this.showTreeDialog('edit', data);
        },
        // 删除节点
        async remove(node, data) {
            try {
                let res = await treeDel({id: data.id});
                this.search;
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        async loadNode(node, resolve) {
            if (node.level === 0) {
                let list = await this.findFuncTree(-1);
                return resolve(list);
            }
            else{
                console.log(2)
                let list = await this.findFuncTree(node.data.id);
                return resolve(list);
            }
        },
        // 刷新key值，重新渲染tree
        renderTree() {
            this.treeKey = +new Date();
        },
        // 点击树
        nodeCheck(node) {
            this.currNode = node;
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
    .tree-wrap {
        .content-title {
            float: left;
        }
        .tree-add {
            float: right;
        }
    }
}
</style>





