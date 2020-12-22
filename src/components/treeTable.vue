<template>
    <div>
        <el-table
            :data="tableData"
            ref="table"
            style="width: 100%"
            row-key="id"
            :expand-row-keys="expandArr"
            highlight-current-row
            @row-click="rowClick"
            @expand-change="expandChange"
            :tree-props="{children: 'childList'}">
            <el-table-column
                v-for="item in tableConfig"
                :key="item.props"
                :prop="item.props"
                :label="item.label"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" class="el-button el-button--primary is-circle  el-button--mini" type="button">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button @click="del(scope.row)" class="el-button el-button--danger is-circle el-button--mini" type="button">
                        <i class="el-icon-delete"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {
    findFuncTree
} from '@/api/func/index';
export default {
    data() {
        return {
            expandArr: [],
        };
    },
    props: {
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        },
        bizLineId: {
            type: Number | String,
            default: 0
        },
        tableConfig: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        expandChange(row, extendFlag) {
            // 展开
            if (extendFlag) {
                let flag = false
                this.expandArr.some(item => {
                    if (item === row.id) { // 判断当前节点是否存在， 存在不做处理
                        flag = true
                        return true
                    }
                })
                if (!flag) { // 不存在则存到数组里
                    this.expandArr.push(row.id)
                }
            }
            else {
                this.expandArr.some((item, i) => {
                    if (item === row.id) {
                        this.expandArr.splice(i, 1)
                    }
                })
            }
        },
        // 获取当前行的数据
        rowClick(row) {
            this.$emit('changeRow', row, 'click');
        },
        edit(row) {
            this.$emit('changeRow', row, 'edit');
        },
        del(row) {
            this.$emit('changeRow', row, 'del');
        },
    }
};
</script>
<style lang="less">
</style>
