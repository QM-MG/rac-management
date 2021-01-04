<template>
    <div class="user">
        <div class="user-search">
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
            <el-col :span="12" class="content-border">
                <div class="content-title">
                    <span>用户列表</span>
                </div>
                <el-table
                    :data="tableData"
                    highlight-current-row
                    @current-change="handleRowChange"
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
                        width="50"
                        label="性别"
                        >
                        <template slot-scope="scope">
                            <span v-show="scope.row.gender == 0">男</span>
                            <span v-show="scope.row.gender == 1">女</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="email"
                        label="邮箱">
                    </el-table-column> -->
                    <el-table-column
                        prop="mobilePhone"
                        label="手机号">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="remark"
                        label="备注">
                    </el-table-column> -->
                    <el-table-column
                        prop="updateTime"
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
            <el-col :span="11"  :offset="1" class="content-border">
                <bind-user-tab
                :bizLineId='param.bizLineId'
                :currRow="currRow"
                ></bind-user-tab>
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
                        <el-form-item label="性别">
                            <template>
                                <el-radio v-model="addParam.gender" :label="0">男</el-radio>
                                <el-radio v-model="addParam.gender" :label="1">女</el-radio>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="email">
                            <el-input v-model="addParam.email" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号">
                            <el-input v-model="addParam.mobilePhone" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
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
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input v-model="addParam.remark" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <!-- 0 启用 1禁用 -->
                        <el-form-item label="状态">
                            <el-switch
                                v-model="addParam.status"
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
    searchUserList,
    edit,
    del,
    add,
    userToDimensionAuthSave,
} from '@/api/user/index';
import {searchBizLine} from '@/api/bizline/index';
import bindUserTab from './bindUserTab.vue';
import {findDictionaryTreeByName,findDictionaryAllTree} from '@/api/dictionary/index';

export default {
    data() {
        let me = this;
        return {
            tableData: [],
            param: {
                searchVal: '',
                bizLineId: ''
            },
            addParam: {
                gender: 0,
                status: 0
            },
            currRow: {},
            status: 'add',
            dialogVisible: false,
            bizLineList: [],
            totalCount: 0,
            pageNo: 1,
            pageSize: 20,
            titleDialog: '用户新增',
            count: 0,
            canChooseDimension: false,
            dictionaryId: null,
            parentIdList: [],
            funcProps: {
                value: 'id',
                label: 'cnName',
                children: 'childList',
                checkStrictly: true
            },
            treeList: []
        };
    },
    components: {pagination, bindUserTab},
    mounted() {
        this.searchbizLineList();
    },
    watch: {
    },
    methods: {
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchUserList(this.param);
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
                    this.canChooseDimension = this.bizLineList[0].decentralizedControl === 0 ? true: false;
                    this.enName = this.bizLineList[0].decentralizedControlEnName;
                    this.search();
                    this.findDictionaryId();
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
                this.findAllTree();
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查字典节点树
        async findAllTree(dictionaryId) {
            let param = {
                bizLineId: this.param.bizLineId,
                dictionaryId: this.dictionaryId
            }
            try {
                let res = await findDictionaryAllTree(param);
                this.treeList = res.data || [];
                console.log(this.treeList)
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
                this.addParam.decentralizedControlId = list[list.length - 1];
            }
            else {
                this.addParam.decentralizedControlId = -1;
            }
        },
        showDialog(status, row) {
            if (status === 'add') {
                this.status = 'add';
                this.addParam = {
                    status: 0,
                    gender: 0
                };
                this.parentIdList = [];
                this.titleDialog = '用户新增';
                if (this.bizLineList.length > 0) {
                    this.addParam.bizLineId = this.param.bizLineId
                }
            }
            else {
                this.status = 'edit';
                this.addParam = row;
                this.titleDialog = '用户编辑';
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
                this.search();
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
        handleRowChange(row) {
            this.currRow = row;
            // if (row) {
            //     this.saveParam.userId = row.id;
            //     this.findUserToDomesion();
            // }
        },
        async saveBind() {
            if (!this.saveParam.userId) {
                this.$message({
                    message: '请选择用户！',
                    type: 'warning'
                })
                return;
            }
            this.saveParam.roleIds = this.$refs.roleTree.getCheckedKeys();
            if (!this.saveParam.roleIds) {
                this.$message({
                    message: '请选择角色！',
                    type: 'warning'
                })
                return;
            }
            this.saveParam.dimensionNodeIds = []
            this.dimensionChildActiveList.forEach(item => {
                this.saveParam.dimensionNodeIds.push(item.id);
            })
            if (this.saveParam.dimensionNodeIds.length <= 0) {
                this.$message({
                    message: '请选择维度！',
                    type: 'warning'
                })
                return;
            }
            try {
                let res = await userToDimensionAuthSave(this.saveParam);
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

        }
    }
};
</script>

<style lang="less">
.user {
    .user-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .user-add {
        float: right;
    }
    .tree-title {
        p {
            float: left;
            line-height: 36px;
        }
        .save-btn {
            float: right;
        }
    }
    .tree-wrap {
        margin-top: 10px;
    }
    .child-text {
        height: 25px;
    }
    .tag-wrap {
        margin-bottom: 15px;
    }
}
</style>





