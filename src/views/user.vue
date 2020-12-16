<template>
    <div class="user">
        <div class="user-search">
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
            <el-button type="success" class="user-add" @click="showDialog('add')" size="mini">新增</el-button>
        </div>
        <el-row class="content-wrap">
            <el-col :span="17">
                <el-table
                    :data="tableData"
                    highlight-current-row
                    @current-change="handleRowChange"
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
                        width="50"
                        label="性别"
                        >
                        <template slot-scope="scope">
                            <span v-show="scope.row.gender == 0">男</span>
                            <span v-show="scope.row.gender == 1">女</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱">
                    </el-table-column>
                    <el-table-column
                        prop="mobilePhone"
                        label="手机号">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注">
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
            <el-col :span="6"  :offset="1">
                <div class="tree-title">
                    <p>角色列表</p>
                    <el-button type="primary" @click="saveBind" size="mini" class="save-btn">保存</el-button>
                </div>
                <el-tree
                    class="tree-wrap"
                    :data="roleAll"
                    node-key="id"
                    ref="tree"
                    :props="defaultProps"
                    show-checkbox
                    >
                </el-tree>
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
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input v-model="addParam.remark" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-switch
                                v-model="addParam.status"
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
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="save" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from '@/components/pagination';
import {searchUserList,edit,del,add,userToRole,userToRoleSave} from '@/api/user/index';
import {roleListAll} from '@/api/auth/index';
import {searchBizLine} from '@/api/bizline/index';
export default {
    data() {
        return {
            tableData: [],
            param: {
                searchVal: '',
                bizLineId: ''
            },
            addParam: {
                gender: 0,
                status: '1'
            },
            status: 'add',
            dialogVisible: false,
            bizLineList: [],
            totalCount: 0,
            pageNo: 1,
            pageSize: 20,
            titleDialog: '用户新增',
            roleAll: [],
            defaultProps: {
                label: 'cnName',
                children: 'children',
                isLeaf: 'leaf'
            },
            saveParam: {
            }
        };
    },
    components: {pagination},
    mounted() {
        this.searchbizLineList();
        this.findRoleListAll();
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
        // 查全部角色
        async findRoleListAll() {
            try {
                let res = await roleListAll();
                this.roleAll = res.data || [];
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
                this.addParam = {};
                this.titleDialog = '用户新增';
                if (this.bizLineList.length > 0) {
                    this.addParam.bizLineId = this.bizLineList[0].id;
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
            this.saveParam.userId = row.id;
            this.findUserToRole();
        },
        // 查询用户已绑定的功能
        async findUserToRole() {
            try {
                let res = await userToRole(this.saveParam);
                let data = res.data || [];
                this.$refs.tree.setCheckedKeys(data);
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        async saveBind() {
            if (!this.saveParam.userId) {
                this.$message({
                    message: '请选择用户！',
                    type: 'warning'
                })
                return;
            }
            this.saveParam.roleIds = this.$refs.tree.getCheckedKeys();
            try {
                let res = await userToRoleSave(this.saveParam);
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
    .tree-wrap{
        clear: both;
    }
    .content-wrap {
        margin-top: 20px;
    }
}
.add-dialog {
    .el-input {
        width: 180px;
        margin-right: 10px;
    }
}
</style>





