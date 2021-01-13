<template>
    <div>
        <div class="content-title">
            <span>属性列表</span>
            <el-button type="primary" @click="showDialog" size="mini" class="btn-right">新增</el-button>
        </div>
        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
            width="60"
            prop="id"
            label="ID">
        </el-table-column>
        <el-table-column
            prop="extPropertyName"
            label="扩展属性名称">
        </el-table-column>
        <el-table-column
            prop="text"
            label="扩展属性值">
        </el-table-column>
        <el-table-column
            prop="text"
            label="操作">
            <template slot-scope="scope">
                <el-button @click="del(scope.row)" class="el-button el-button--danger is-circle el-button--mini" type="button">
                    <i class="el-icon-delete"></i>
                </el-button>
            </template>
        </el-table-column>
        </el-table>
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogVisible"
            custom-class="add-dialog"
            width="60%">
            <el-form ref="form" :model="addParam" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="扩展属性">
                            <el-select
                                size="mini"
                                placeholder="请选择"
                                v-model="addParam.extPropertyId"
                                @change="changeEntity"
                                >
                                <el-option v-for="item in entityList" :key="item.id" :value="item.id" :label="item.cnName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="扩展属性值" v-if="activeData && activeData.type==1">
                            <el-cascader
                                v-if="activeData.dictionaryId"
                                :key="count"
                                v-model="parentIdList"
                                :props="funcProps"
                                size="mini"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="扩展属性值" v-if="activeData && activeData.type==0">
                            <el-input v-model="addParam.value" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="saveProperty" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    findDictionaryTreeList,
} from '@/api/dictionary/index';
import{
    userToPropertyList,
    userToPropertySave,
    propertyToDel
} from '@/api/user/index';
import{
    propertyToEntity,
} from '@/api/property/index';
export default {
    data() {
        let me = this;
        return {
            tableData: [],
            entityList: [],
            type: null,
            titleDialog: '新增用户扩展属性',
            dialogVisible: false,
            addParam: {
                extPropertyId: null
            },
            activeData: {},
            treeKey: '',
            count: 0,
            parentIdList: [],
            funcProps: {
                value: 'value',
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
            default: '',
        },
        currRow: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    mounted() {
    },
    watch: {
        bizLineId(val) {
            this.tableData = [];
            if (val) {
            }
        },
        currRow(val) {
            if (val) {
                this.findPropertyToUser();
                this.findPropertyList();
            }
        },
        parentIdList(val) {
            if (val.length > 0) {
                this.addParam.value = val[val.length - 1];
            }
        }
    },
    methods: {
        // 查关联的维度列表
        async findPropertyList() {
            let param = {
                bizLineId: this.bizLineId,
                userId: this.currRow.id
            }
            try {
                let res = await userToPropertyList(param);
                this.tableData = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查关联的用户的属性
        async findPropertyToUser() {
            if (!this.currRow && !this.currRow.id) {
                return;
            }
            let param = {
                bizLineId: this.bizLineId,
                bizEntityEnName: 'user',
            }
            try {
                let res = await propertyToEntity(param);
                this.entityList = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        showDialog() {
            this.addParam = {};
            this.dialogVisible = true;
            this.activeData = {};
            this.parentIdList = [];
            this.count++;
        },
        // 切换实体 查对应的type
        changeEntity(val) {
            this.count++;
            this.activeData = {};
            this.entityList.forEach(item => {
                if (item.id === val) {
                    this.activeData = item;
                }
            })
        },
        // 维度节点树
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.bizLineId,
                dictionaryId: this.activeData.dictionaryId,
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
        // 删除
        async del(row) {
            console.log(row)
            let param = {
                bizLineId: this.bizLineId,
                bizDataId: this.currRow.id,
                extPropertyId: row.extPropertyId,
                value: row.value
            }
            try {
                let res = await propertyToDel(param);
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
                this.findPropertyList();
            }
            catch (e) {
                this.$message({
                    message: e || '删除失败！',
                    type: 'error'
                })
            }
        },
        async saveProperty() {
            if (!this.currRow || !this.currRow.id) {
                this.$message({
                    message: '请选择用户！',
                    type: 'warning'
                })
                return;
            }
            this.addParam.bizLineId = this.bizLineId;
            this.addParam.bizDataId = this.currRow.id;
            this.addParam.decentralizedControlId = this.currRow.decentralizedControlId;
            try {
                let res = await userToPropertySave(this.addParam);
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
                this.dialogVisible = false;
                this.findPropertyList();
            }
            catch (e) {
                this.$message({
                    message: e || '保存失败！',
                    type: 'error'
                })
            }
        }
    }
};
</script>
<style lang="less">
</style>



