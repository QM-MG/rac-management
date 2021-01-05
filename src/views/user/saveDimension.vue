<template>
    <div>
        <div class="content-title" style="margin: 20px 0;">
            <span>维度树</span>
            <el-button type="primary" @click="saveDimension" size="mini" class="btn-right">保存</el-button>
        </div>
        <div class="tag-wrap">
            <el-tag
                v-for="tag in dimensionChildActiveList"
                :key="tag.id"
                closable
                @close="delDimensionChild(tag)"
                >
                {{tag.cnName}}
            </el-tag>
        </div>
        <el-select
            :disabled="!this.currRow || !this.currRow.id"
            v-model="dimensionId"
            placeholder="请选择"
            @change="dimensionChange">
                <el-option
                v-for="item in dimensionList"
                :key="item.id"
                :label="item.cnName"
                :value="item.id">
                </el-option>
        </el-select>
        <el-tree
            class="tree-wrap"
            :key="treeKey"
            v-if="dimensionId"
            :expand-on-click-node="false"
            :props="props"
            node-key="id"
            ref="dimensionTree"
            @node-click="handleNodeClick"
            :load="loadNode"
            lazy
            >
        </el-tree>
    </div>
</template>
<script>
import{
    userToDimension,
    userToDimensionSave
} from '@/api/user/index';
import {findDimensionList, findTreeList} from '@/api/dimension/index';
export default {
    data() {
        return {
            dimensionChildActiveList: [], // 已被关联的子节点
            dimensionId: '',
            dimensionList: [],
            treeKey: '',
            props: {
                label: 'cnName',
                children: 'children'
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
        }
    },
    watch: {
        bizLineId(val) {
            this.dimensionId = '';
            this.dimensionChildActiveList = [];
            this.dimensionList = [];
            this.renderTree();
            if (val) {
                this.findDimensionList();
            }
        },
        currRow(val) {
            if (val) {
                this.findUserToDomesion();
            }
        }
    },
    mounted() {
    },
    methods: {
        // 查用户绑定维度
        async findUserToDomesion() {
            try {
                if (this.currRow.userId) {
                    return;
                }
                let param = {
                    bizLineId: this.bizLineId,
                    userId: this.currRow.id
                }
                let res = await userToDimension(param);
                let data = res.data || [];
                this.dimensionChildActiveList = data;
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 维度节点变化查维度子节点
        dimensionChange(val) {
            this.findFuncTree(val);
            this.$nextTick(() => {
                this.renderTree();
            })
        },
        // 查维度
        async findDimensionList() {
            try {
                let param = {
                    bizLineId: this.bizLineId
                }
                let res = await findDimensionList(param);
                this.dimensionList = res.data || [];
                if (this.dimensionList.length > 0) {
                    this.dimensionId = this.dimensionList[0].id;
                }
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查维度节点树
        async findFuncTree(dimensionId, parentId) {
            let param = {
                bizLineId: this.bizLineId,
                dimensionId,
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
        // 加载维度树
        async loadNode(node, resolve) {
            if (node.level === 0) {
                let list = await this.findFuncTree(this.dimensionId, -1);
                return resolve(list);
            }
            else {
                let list = await this.findFuncTree(this.dimensionId, node.data.id);
                return resolve(list);
            }
        },
        handleNodeClick(node) {
            this.dimensionChildActiveList.forEach((item, index) => {
                if (node.dimensionId === item.dimensionId) {
                    this.dimensionChildActiveList.splice(index, 1, node);
                }
                else if (node.id !== item.id) {
                    this.dimensionChildActiveList.push(node)
                }
            })
            if (this.dimensionChildActiveList.length <= 0) {
                this.dimensionChildActiveList.push(node)
            }
        },
        delDimensionChild(tag) {
            this.dimensionChildActiveList.forEach((item, index) => {
                if (item.id === tag.id) {
                    this.dimensionChildActiveList.splice(index, 1);
                }
            })
        },
        // 保存维度
        async saveDimension() {
            if (!this.currRow || !this.currRow.id) {
                this.$message({
                    message: '请选择用户！',
                    type: 'warning'
                })
                return;
            }
            let dimensionNodeIds = []
            this.dimensionChildActiveList.forEach(item => {
                dimensionNodeIds.push(item.id);
            })
            if (dimensionNodeIds.length <= 0) {
                this.$message({
                    message: '请选择维度！',
                    type: 'warning'
                })
                return;
            }
            let param = {
                bizLineId: this.bizLineId,
                userId: this.currRow.id,
                decentralizedControlId: this.currRow.decentralizedControlId,
                dimensionNodeIds
            }
            try {
                let res = await userToDimensionSave(param);
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
            }
            catch (e) {
                this.$message({
                    message: e || '保存失败！',
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
</style>



