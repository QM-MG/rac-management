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
        <el-row style="margin-top: 25px;">
            <el-col :span="6" :offset="3" class="content-wrap">
                <p class="content-title">功能管理树</p>
                <el-tree
                    v-if="this.param.bizLineId"
                    :props="props"
                    :load="loadNode"
                    lazy
                    ref="tree"
                    @node-click="nodeCheck">
                </el-tree>
            </el-col>
            <el-col :span="11" :offset="2" class="content-wrap">
                <p class="content-title">功能管理详情</p>
                <el-form ref="form" :model="addParam" label-width="80px" v-show="isShow">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="英文名">
                                <span>{{currNode.enName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="中文名">
                                <span>{{currNode.cnName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="功能url">
                                <span>{{currNode.content}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        </el-col>
                    </el-row>
                </el-form>
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
import {searchFuncList,edit,del,add, findFuncTree} from '@/api/func/index';
import {searchBizLine} from '@/api/bizline/index';
import {isEmptyObj} from '@/utils/index.js';
export default {
    data() {
        let me = this;
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
            props: {
                label: 'cnName',
                children: 'children'
            },
            parentIdList: [],
            dialogVisible: false,
            bizLineList: [],
            titleDialog: '新增功能',
            lineDisabled: false,
            currNode: {},
            funcProps: {
                value: 'id',
                label: 'cnName',
                checkStrictly: true,
                lazy: true,
                async lazyLoad (node, resolve) {
                    console.log(node, me)
                    if (node.level === 0) {
                        let list = await me.findFuncTree(-1);
                        return resolve(list);
                    }
                    else{
                        let list = await me.findFuncTree(node.value);
                        return resolve(list);
                    }
                }
            }
        };
    },
    components: {},
    mounted() {
        this.searchbizLineList();
    },
    computed: {
        isShow: function() {
            return !isEmptyObj(this.currNode);
        }
    },
    watch: {
        parentIdList(val) {
            if (val.length > 0) {
                this.addParam.parentId = val[val.length - 1];
                if (this.addParam.parentId !== -1) {
                    // this.addParam.bizLineId = '';
                    this.lineDisabled = true;
                }
                else {
                    this.lineDisabled = false;
                }
            }
        }
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
                    // this.search();
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
            console.log(this.addParam)
            try {
                let res = await add(this.addParam);
                this.dialogVisible = false;
                // this.search();
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
                // this.search();
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
                console.log(list)
                return resolve(list);
            }
            else{
                console.log(2)
                let list = await this.findFuncTree(node.data.id);
                return resolve(list);
            }
        },
        // 点击树
        nodeCheck(node) {
            this.currNode = node;
            console.log(1, node)
        },
        reset() {
            this.param = {};
            if (this.bizLineList.length > 0) {
                this.param.bizLineId = this.bizLineList[0].id;
            }
            this.pageSize = 20;
            this.pageNo = 1;
            // this.search();
        },
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
    .content-title {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .content-wrap {
        border: 1px solid #eee;
        padding: 25px;
    }
}
.add-dialog {
    .el-input {
        width: 180px;
        margin-right: 10px;
    }
}
</style>





