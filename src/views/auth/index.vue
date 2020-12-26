<template>
    <div class="auth">
        <div class="auth-search">
            <el-input v-model="searchVal" placeholder="请输入内容" size="mini"></el-input>
            <el-select v-model="bizLineId" placeholder="请选择" size="mini">
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
                <auth-table :bizLineId="bizLineId" ref="authTable" @getTableRow="getTableRow" @showDialog="showDialog"></auth-table>
            </el-col>
            <el-col :span="9"  :offset="1"  class="content-border">
                <bind-auth-tab :bizLineId="bizLineId" :currRow="currRow"></bind-auth-tab>
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="save" size="mini">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import {searchAuthList,edit,del,add,saveBind,roleToFunc} from '@/api/auth/index';
import {searchBizLine} from '@/api/bizline/index';
import authTable from './authTable.vue';
import bindAuthTab from './bindAuthTab.vue';

export default {
    data() {
        return {
            searchVal: '',
            bizLineId: '',
            status: 'add',
            addParam: {
            },
            dialogVisible: false,
            bizLineList: [],
            titleDialog: '新增角色',
            saveParam: {},
            currRow: {},
        };
    },
    components: {authTable, bindAuthTab},
    mounted() {
        this.searchbizLineList();
    },
    methods: {
        search() {
            this.$refs.authTable.searchName(this.searchVal);
        },
        reset() {
            this.searchVal = '';
            this.bizLineId = this.bizLineList[0].id;
            this.$refs.authTable.reset();
        },
        // 得到表格当前行数据
        getTableRow(row) {
            this.currRow = row;
        },
        async searchbizLineList() {
            try {
                let res = await searchBizLine();
                this.bizLineList = res.data || [];
                if (this.bizLineList.length > 0) {
                    this.bizLineId = this.bizLineList[0].id;
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
                this.titleDialog = '新增角色';
                this.addParam = {};
                this.addParam.bizLineId = this.bizLineId;
            }
            else {
                this.status = 'edit';
                this.titleDialog = '编辑角色';
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
            }
            catch (e) {
                this.$message({
                    message: e || '修改失败！',
                    type: 'error'
                })
            }
        },
    }
};
</script>

<style lang="less">
.auth {
    .auth-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .auth-add {
        float: right;
    }
    .tree {
        clear: both;
        font-size: 14px;
    }
    .tree-node-icon {
        font-weight: 900;
    }
}
</style>





