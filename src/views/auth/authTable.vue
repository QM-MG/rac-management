<template>
    <div>
        <div class="content-title">
        <span>角色列表</span>
        </div>
        <el-table
            :data="tableData"
            highlight-current-row
            @current-change="handleRowChange"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="ID"
                width="60">
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
                prop="updateTime"
                label="更新时间">
            </el-table-column>
            <el-table-column
                width="120"
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
    </div>
</template>
<script>
import {searchAuthList,edit,del,add,saveBind,roleToFunc} from '@/api/auth/index';
import pagination from '@/components/pagination';
export default {
    data() {
        return {
            param: {},
            tableData: [],
            totalCount: 0,
            pageNo: 1,
            pageSize: 20,
        };
    },
    props: {
        bizLineId: {
            type: String | Number,
            default: '',
        },
    },
    watch: {
        bizLineId(val) {
            if (val) {
                this.param.bizLineId = val;
                this.search();
            }
        }
    },
    components: {pagination},
    mounted() {
    },
    methods: {
        async search() {
            this.param.pageNo = this.pageNo;
            this.param.pageSize = this.pageSize;
            try {
                let res = await searchAuthList(this.param);
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
        searchName(searchVal) {
            this.pageNo = 1;
            this.param.searchVal = searchVal;
            this.search();
        },
        showDialog(status, row) {
            this.$emit('showDialog',status, row);
        },
        async del(row) {
            let param = {
                id: row.id,
                bizLineId: row.bizLineId
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
            if (row && row.id) {
                this.$emit('getTableRow', row);
            }
        },
        reset() {
            this.param = {};
            this.param.bizLineId = this.bizLineId;
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
        },
    }
};
</script>
<style lang="less">
</style>



