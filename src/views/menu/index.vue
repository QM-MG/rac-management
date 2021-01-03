<template>
    <div class="menu">
        <!-- 切换产品线 -->
        <div class="menu-search">
            <el-input v-model="param.searchVal" placeholder="请输入内容" size="mini"></el-input>
            <el-select v-model="bizLineId" placeholder="请选择" size="mini" @change="changeBiz">
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
        <!-- 表格 -->
        <div class="menu-content">
            <tree-table
            :tableData="treeList"
            :bizLineId="bizLineId"
            :tableConfig="tableConfig"
            @changeRow="changeRow"
            >
            </tree-table>
        </div>
        <!-- 新增或编辑弹框 -->
        <menu-change-dialog
        :bizLineId="bizLineId"
        :bizLineList="bizLineList"
        :dialogVisible="dialogVisible"
        :editRow="editRow"
        :status="status"
        :treeList="treeList"
        @changeDialgVis="changeDialgVis"
        @saveParam="saveParam">
        </menu-change-dialog>
    </div>
</template>
<script>
import {searchMenuList,edit,del,add, findMenuTree,findMenuAllTree} from '@/api/menu/index';
import {searchBizLine} from '@/api/bizline/index';
import {isEmptyObj} from '@/utils/index.js';
import treeTable from '@/components/treeTable';
import menuChangeDialog from './menuChangeDialog.vue';

export default {
    data() {
        return {
            param: {},
            bizLineList: [], // 业务线
            bizLineId: '', // 业务线id
            status: 'add', // 新建 add 编辑 edit
            dialogVisible: false,
            treeList: [],
            tableConfig:[{
                label:'ID',
                props:'id',
            }, {
                label:'英文名',
                props:'enName',//当前表头对应的来自父组件数据源的字段
            }, {
                label:'中文名',
                props:'cnName'
            },
            {
                label:'序号',
                props:'seq'
            }, 
            {
                label:'url',
                props:'url'
            }, {
                label:'层级',
                props:'level'
            }, {
                label:'更新时间',
                props:'updateTime'
            }],
            editRow: {} // 选择编辑的当前行
        };
    },
    components: {
        treeTable,
        menuChangeDialog
    },
    mounted() {
        this.searchbizLineList();
    },
    computed: {
    },
    watch: {
    },
    methods: {
        // 查功能树数据
        async search(parentId) {
            this.param.bizLineId = this.bizLineId;
            try {
                let res = await findMenuAllTree(this.param);
                this.treeList = res.data || [];
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查询产品线
        async searchbizLineList() {
            try {
                let res = await searchBizLine();
                this.bizLineList = res.data || [];
                if (this.bizLineList.length > 0) {
                    this.bizLineId = this.bizLineList[0].id;
                }
                this.search();
            }
            catch (e) {
                this.$message({
                    message: e || '查询失败！',
                    type: 'error'
                })
            }
        },
        // 查功能树
        async findMenuTree(parentId) {
            let param = {
                bizLineId: this.bizLineId,
                parentId
            }
            try {
                let res = await findMenuTree(param);
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
        changeBiz(val) {
            this.search();
        },
        changeDialgVis(flag) {
            this.editRow = {};
            this.dialogVisible = flag;
        },
        // 判断是新建还是编辑
        showDialog(status, row) {
            if (status === 'add') {
                this.status = 'add';
            }
            else {
                this.status = 'edit';
            }
            this.dialogVisible = true;
        },
        // 获取当前行数据
        changeRow(row, flag) {
            if (flag === 'edit') {
                this.status = 'edit';
                this.editRow = row;
                this.dialogVisible = true;
            }
            else if (flag === 'del') {
                this.delRow = row;
                this.del();
            }
            else if (flag === 'click') {
                this.currRow = row;
            }
        },
        async del() {
            let param = {
                id: this.delRow.id,
                bizLineId: this.delRow.bizLineId
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
        async add(param) {
            try {
                param.bizLineId = this.bizLineId;
                let res = await add(param);
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
        async edit(param) {
            try {
                param.bizLineId = this.bizLineId;
                let res = await edit(param);
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
        // 将要保存的数据
        saveParam(param) {
            if (this.status === 'add') {
                this.add(param);
            }
            else {
                this.edit(param);

            }
        },
        reset() {
            this.param.searchVal = '';
            this.bizLineId = this.bizLineList[0].id;
            this.search();
        }
    }
};
</script>

<style lang="less">
.menu {
    .menu-search {
        .el-input {
            width: 180px;
            margin-right: 10px;
        }
    }
    .menu-content {
        margin-top: 20px;
    }
}
</style>





