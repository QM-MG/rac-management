<template>
    <div class="pagination-wrap">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNoCopy"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="20"
            layout="sizes, prev, pager, next"
            :total="totalCount">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pageNoCopy: 1
        };
    },
    props: {
        totalCount: {
            type: Number,
            default: 0
        },
        pageNo: {
            type: Number,
            default: 1
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        // pageSize
        handleSizeChange(val) {
            this.$emit('handleSizeChange', val);
        },
        // currentPage
        handleCurrentChange(val) {
            this.$emit('handleCurrentChange', val);
        }
    }
};
</script>
<style lang="less">
.pagination-wrap {
    margin-top: 10px;
    float: right;
}
</style>