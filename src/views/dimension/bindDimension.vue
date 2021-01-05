<template>
    <div>
        <div class="content-title">
            <span>定义维度节点</span>
            <el-button type="primary" class="btn-right" @click="showObjectDialog" size="mini">
                <i class="el-icon-plus"></i>
                <span>新增客体节点</span>
            </el-button>
            <el-button type="primary" class="btn-right" @click="showTreeDialog('add')" size="mini" style="margin-right:10px;">
                <i class="el-icon-plus"></i>
                <span>新增</span>
            </el-button>
        </div>
        <div class="tag-wrap">
            <el-tag
                closable
                @close="delDimensionObj()"
                v-if="dimensionObj && dimensionObj.cnName"
                >
                {{dimensionObj.cnName}}
            </el-tag>
        </div>
        <el-tree
            v-if="this.bizLineId && currRow.nodeTypeId"
            class="tree"
            :props="props"
            :load="loadNode"
            :key="treeKey"
            lazy
            ref="tree"
            @node-click="nodeCheck">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span  style="margin-left: 10px;">
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
                        <el-form-item label="维度节点类型">
                            <el-cascader
                                :key="count"
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
                                :key="count"
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
                                :active-value="0"
                                :inactive-value="1"
                                active-text="启用"
                                inactive-text="禁用">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="dictionaryId">
                        <el-form-item label="分级管控ID">
                            <el-cascader
                                :options="treeList"
                                v-model="dimparentIdList"
                                :props="dimProps"
                                size="mini"
                                ref="cascader"
                                @change="cascaderChange"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTreeVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="treeSave" size="mini">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="titleObjDialog"
            :visible.sync="dialogObjVisible"
            custom-class="add-dialog"
            width="30%">
            <el-form ref="form" :model="addTreeParam" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客体节点">
                            <el-cascader
                                :key="count"
                                v-model="objIdList"
                                :props="funcOwnProps"
                                size="mini"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogObjVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="objSave" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {findDictionaryTreeList,findDictionaryAllTree} from '@/api/dictionary/index';
import {
    searchData,
    edit,
    del,
    add,
    findTreeList,
    treeAdd,
    treeEdit,
    treeDel,
    bindNode,
    unbindNode,
    findNode
    } from '@/api/dimension/index';
export default {
    data() {
        let me = this;
        return {
            treeKey: '',
            props: {
                label: 'cnName',
                children: 'children'
            },
            titleDialog: '新增维度管理',
            titleObjDialog: '新增客体节点',
            dialogTreeVisible: false,
            dialogObjVisible: false,
            addTreeParam: {
                parentId: -1,
                type: -1,
                status: 0
            },
            treeStatus: 'add',
            count: 0,
            parentIdList: [],
            dimparentIdList: [],
            objIdList: [],
            parentOwnIdList: [],
            dimensionObj: {}, // 客体维度节点
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
            dimProps: {
                value: 'id',
                label: 'cnName',
                children: 'childList',
                checkStrictly: true
            },
            treeList: []
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
        },
        dictionaryId: {
            type: String | Number,
            default: ''
        }
    },
    watch: {
        currRow(val) {
            if(val) {
            }
        },
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
        objIdList(val) {
            if (val.length > 0) {
                this.objectNodeId = val[val.length - 1];
            }
            else {
                this.objectNodeId = -1;
            }
        },
        dictionaryId(val) {
            this.findAllTree();
        }
    },
    mounted() {
    },
    methods: {
        // 点击树
        nodeCheck(node) {
            if (node) {
                this.currNode = node;
                this.$emit('getDimNode', this.currNode);
                this.searchNode();
            }
        },
        // 新增维度
        showTreeDialog(status, row) {
            this.count++;
            this.parentOwnIdList = [];
            this.dimparentIdList = [];
            this.parentIdList = [];
            if (status === 'add') {
                this.treeStatus = 'add';
                this.titleDialog = '新增维度节点';
                this.addTreeParam = {
                    parentId: -1,
                    status: 0,
                    dimensionId: this.currRow.id
                };
                if (this.bizLineList.length > 0) {
                    this.addTreeParam.bizLineId = this.bizLineId;
                }
            }
            else {
                this.treeStatus = 'edit';
                this.addTreeParam = row;
                this.parentIdList = [row.type];
                this.dimparentIdList = [row.decentralizedControlId];
                this.parentOwnIdList = [row.parentId]
                this.titleDialog = '编辑维度节点';
            }
            this.dialogTreeVisible = true;
        },
        // 新增客体维度
        showObjectDialog() {
            if (!this.currNode) {
                this.$message({
                    message: '请选择维度节点',
                    type: 'warning'
                })
                return;
            }
            this.dimparentIdList = [];
            this.dialogObjVisible = true;
        },
        // 维度节点树(查字典)
        async findDictionaryTreeList(parentId) {
            let param = {
                bizLineId: this.bizLineId,
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
        // 管控节点树
        async findAllTree() {
            let param = {
                bizLineId: this.bizLineId,
                dictionaryId: this.dictionaryId,
            }
            try {
                let res = await findDictionaryAllTree(param);
                this.treeList = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        cascaderChange(list) {
            if(list.length > 0) {
                this.addTreeParam.decentralizedControlId = list[list.length - 1];
            }
            else {
                this.addTreeParam.decentralizedControlId = -1;
            }
        },
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
        // 维度节点树
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.bizLineId,
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
        treeSave() {
            if (this.treeStatus === 'add') {
                this.addTree();
            }
            else {
                this.editTree();
            }
            this.addTreeParam.dimensionId = this.currRow.id;
        },
        async addTree() {
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
        async editTree() {
            try {
                let res = await treeEdit(this.addTreeParam);
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
        // 删除节点
        async remove(node, data) {
            try {
                let res = await treeDel({id: data.id, bizLineId: data.bizLineId, dimensionId: data.dimensionId, decentralizedControlId: data.decentralizedControlId});
                this.renderTree();
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查询客体节点
        async searchNode() {
            let param = {
                bizLineId: this.bizLineId,
                dimensionId: this.currRow.id,
                id: this.currNode.id
            }
            try {
                let res = await findNode(param);
                this.dimensionObj = res.data;
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }

        },
        // 保存客体
        async objSave() {
            let param = {
                bizLineId: this.bizLineId,
                dimensionId: this.currRow.id,
                id: this.currNode.id,
                decentralizedControlId: this.currNode.decentralizedControlId,
                objectNodeId: this.objectNodeId
            }
            try {
                let res = await bindNode(param);
                this.dialogObjVisible = false;
                this.searchNode();
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }

        },
        // 删除客体节点
        async delDimensionObj() {
            try {
                let param = {
                    bizLineId: this.bizLineId,
                    dimensionId: this.currRow.id,
                    id: this.currNode.id,
                    decentralizedControlId: this.currNode.decentralizedControlId,
                    objectNodeId: this.dimensionObj.id
                }
                let res = await unbindNode(param);
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
                this.searchNode();
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
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
.tag-wrap {
    margin-top: 20px;
}
</style>



















