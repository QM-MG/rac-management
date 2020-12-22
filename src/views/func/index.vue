<template>
    <div class="func">
        <!-- 切换产品线 -->
        <div class="func-search">
            <el-select v-model="bizLineId" placeholder="请选择" size="mini" @change="changeBiz">
                <el-option
                v-for="item in bizLineList"
                :key="item.id"
                :label="item.cnName"
                :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" @click="showDialog('add')" size="mini">新增</el-button>
        </div>
        <!-- 表格 -->
        <div class="func-content">
            <lazy-table
            ref="lazyTable"
            :tableData="treeList"
            :bizLineId="bizLineId"
            @changeRow="changeRow"
            >
            </lazy-table>
        </div>
        <!-- 新增或编辑弹框 -->
        <func-change-dialog
        :bizLineId="bizLineId"
        :bizLineList="bizLineList"
        :dialogVisible="dialogVisible"
        :editRow="editRow"
        :status="status"
        :treeList="treeList"
        @changeDialgVis="changeDialgVis"
        @saveParam="saveParam">
        </func-change-dialog>
    </div>
</template>
<script>
import {searchFuncList,edit,del,add, findFuncTree,findFuncAllTree} from '@/api/func/index';
import {searchBizLine} from '@/api/bizline/index';
import {isEmptyObj} from '@/utils/index.js';
import lazyTable from './lazyTable.vue';
import funcChangeDialog from './funcChangeDialog.vue';

export default {
    data() {
        return {
            bizLineList: [], // 业务线
            bizLineId: 0, // 业务线id
            status: 'add', // 新建 add 编辑 edit
            dialogVisible: false,
            treeList: [],
            editRow: {} // 选择编辑的当前行
        };
    },
    components: {
        lazyTable,
        funcChangeDialog
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
            let param = {
                bizLineId: this.bizLineId
            }
            try {
                let res = await findFuncAllTree(param);
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
        async findFuncTree(parentId) {
            let param = {
                bizLineId: this.bizLineId,
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
                id: this.delRow.id
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
        }
    }
};
</script>

<style lang="less">
.func {
    .func-content {
        margin-top: 20px;
    }
}
</style>





