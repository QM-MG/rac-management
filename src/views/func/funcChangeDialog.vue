<template>
    <el-dialog
        :title="titleDialog"
        custom-class="add-dialog"
        :visible.sync="dialogVisibleC"
        @close="closeDialog"
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
                        <el-select v-model="bizLineId" size="mini" placeholder="请选择" disabled>
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
                    <el-form-item label="父节点">
                        <el-cascader
                            :options="treeList"
                            v-model="parentIdList"
                            :props="funcProps"
                            size="mini"
                            ref="cascader"
                            @change="cascaderChange"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="功能url">
                        <el-input v-model="addParam.content" size="mini" style="width: 593px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="mini">取 消</el-button>
            <el-button type="primary" @click="save" size="mini">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        let me = this;
        return {
            titleDialog: '新增功能',
            addParam: {},
            dialogVisibleC: false,
            count: 0,
            parentIdList: [],
            funcProps: {
                value: 'id',
                label: 'cnName',
                children: 'childList',
                checkStrictly: true
                // checkStrictly: true,
                // lazy: true,
                // async lazyLoad (node, resolve) {
                //     if (node.level === 0) {
                //         let list = await me.$parent.findFuncTree(-1);
                //         return resolve(list);
                //     }
                //     else{
                //         let list = await me.$parent.findFuncTree(node.value);
                //         return resolve(list);
                //     }
                // }
            }
        };
    },
    mounted() {
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: 'add'
        },
        bizLineList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        bizLineId: {
            type: Number | String,
            default: 0
        },
        editRow: {
           type: Object,
            default: () => {
                return {};
            } 
        },
        treeList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        dialogVisible(val) {
            this.count++;
            this.parentIdList = [];
            this.dialogVisibleC = val;
            this.addParam = {};
        },
        status(val) {
            if (val === 'add') {
                this.titleDialog = '新增功能';
            }
            else {
                this.titleDialog = '编辑功能';
            }
        },
        editRow(val) {
            this.addParam = val;
            this.parentIdList = val.parentId || [];
        }
    },
    methods: {
        // 编辑时查询功能已选中的数据
        async findCheckedData(parentIdList) {
            let treeList = [];
            this.treeList = [];
            const queue = parentIdList.map(id => {
                return this.$parent.findFuncTree(id);
            })
            await Promise.all(queue).then(result => {
                result.forEach(i => {
                    treeList.push(i)
                })
            })
            treeList = Array.from(new Set(treeList.flat()))
            this.toTree1(treeList, this.treeList, -1);
            this.$nextTick(() => {
                this.parentIdList = parentIdList;
            })
        },
        toTree(list, data, fatherId) {
            list.forEach(item => {
                if (item.parentId === fatherId) {
                    this.child = {
                        cnName: item.cnName,
                        parentId: item.parentId,
                        id: item.id,
                        children: []
                    }
                    this.toTree(list, this.child.children, item.id)
                    data.push(this.child)
                }
            })
        },
        cascaderChange(list) {
            if(list.length > 0) {
                this.addParam.parentId = list[list.length - 1];
            }
            else {
                this.addParam.parentId = -1;
            }
        },
        closeDialog() {
            this.$emit('changeDialgVis', false);
        },
        save() {
            if (!this.addParam.parentId) {
                this.addParam.parentId = -1;
            }
            if (this.status === 'add') {
                this.$emit('saveParam', this.addParam);
            }
            else if (this.status === 'edit') {
                this.$emit('saveParam', this.addParam);
            }
            this.closeDialog();
        },
    }
};
</script>
<style lang="less">
</style>



