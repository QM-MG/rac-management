<template>
    <div>
        <div class="content-title">
            <span>定义字典枚举</span>
            <el-button type="primary" class="btn-right" @click="showTreeDialog('add')" size="mini">
                <i class="el-icon-plus"></i>
                <span>新增</span>
            </el-button>
        </div>
        <el-tree
            v-if="bizLineId && currRow && currRow.id"
            :props="props"
            :key = "treeKey"
            :load="loadNode"
            class="tree"
            icon-class="el-icon-caret-right tree-node-icon"
            lazy
            ref="tree"
            @node-click="nodeCheck">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span style="margin-left: 10px;">
                <el-button
                    type="text"
                    size="mini"
                    @click="() => treeEdit(node, data)">
                    <i class="el-icon-edit"></i>
                </el-button>
                <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    <i class="el-icon-delete tree-del-icon"></i>
                </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogTreeVisible"
            custom-class="add-dialog"
            width="60%">
            <el-form ref="form" :model="addTreeParam" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="英文名">
                            <el-input v-model="addTreeParam.enName" size="mini" :disabled="treeStatus=='edit'"></el-input>
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
                            <el-select v-model="addTreeParam.bizLineId" size="mini" placeholder="请选择" disabled>
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
                        <el-form-item label="字典值">
                            <el-input v-model="addTreeParam.value" size="mini" :disabled="treeStatus=='edit'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="父节点">
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
                        <el-form-item label="备注">
                            <el-input v-model="addTreeParam.remark" size="mini"></el-input>
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
import {isEmptyObj} from '@/utils/index.js';
export default {
    data() {
        let me = this;
        return {
            props: {
                label: 'cnName',
                children: 'children'
            },
            addTreeParam: {
                parentId: -1,
            },
            dialogTreeVisible: false,
            treeStatus: false,
            titleDialog: '新增字典',
            parentIdList: [],
            treeKey: '',
            count: 0,
            funcProps: {
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
        },
        bizLineList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        bizLineId(val) {
        },
        currRow(val) {
        },
        parentIdList(val) {
            if (val.length > 0) {
                this.addTreeParam.parentId = val[val.length - 1];
                if (this.addTreeParam.parentId !== -1) {
                    this.lineDisabled = true;
                }
                else {
                    this.lineDisabled = false;
                }
            }
        }
    },
    mounted() {
    },
    methods: {
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
        // 点击树
        nodeCheck(node) {
            this.$emit('getDicNode', node);
        },
        // 维度节点树
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.bizLineId,
                dictionaryId: this.currRow.id,
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
        async treeEdit(node, data) {
            this.showTreeDialog('edit', data);
        },
        showTreeDialog(status, row) {
            this.count++;
            if (isEmptyObj(this.currRow)) {
                this.$message({
                    message: '请选择一项字典',
                    type: 'error'
                })
                return;
            }
            if (status === 'add') {
                this.treeStatus = 'add';
                this.titleDialog = '新增字典节点';
                this.addTreeParam = {
                    parentId: -1
                };
                this.addTreeParam.bizLineId = this.bizLineId;
            }
            else {
                this.treeStatus = 'edit';
                this.addTreeParam = row;
                this.parentIdList = [row.parentId];
                this.titleDialog = '编辑字典节点';
            }
            this.dialogTreeVisible = true;
        },
        async addTree() {
            try {
                let res = await treeAdd(this.addTreeParam);
                this.dialogTreeVisible = false;
                this.$emit('search');
            }
            catch (e) {
                this.$message({
                    message: e || '新增失败！',
                    type: 'error'
                })
            }
        },
        async editTree() {
            try {
                let res = await treeEdit(this.addTreeParam);
                this.dialogTreeVisible = false;
                this.$emit('search');
            }
            catch (e) {
                this.$message({
                    message: e || '新增失败！',
                    type: 'error'
                })
            }
        },
        async treeSave() {
            this.addTreeParam.dictionaryId = this.currRow.id;
            if (this.treeStatus === 'add') {
                this.addTree();
            }
            else {
                this.editTree();
            }
        },
        // 刷新key值，重新渲染tree
        renderTree() {
            this.treeKey = +new Date();
        },
    }
};
</script>
<style lang="less">
</style>



















