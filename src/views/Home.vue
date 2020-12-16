<template>
	<div class="wrap">
		<div class="aside left" :style="{width:toggleMenuShow? '64px': '250px'}">
			<left-menu :toggleMenuShow="toggleMenuShow"></left-menu>
		</div>
		<div class="aside main" :style="{marginLeft:toggleMenuShow?'64px': '250px'}"> 
			<top :toggleMenuShow="toggleMenuShow" @toggleMenu="toggleMenu"></top>
			<div class="main-container">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
import leftMenu from '@/components/leftMenu.vue';
import top from '@/components/top.vue';

export default {
    data() {
        return {
			toggleMenuShow: false
		};
	},
	components: {
		leftMenu,
		top
	},
    mounted() {
    },
    methods: {
		toggleMenu() {
			this.toggleMenuShow = !this.toggleMenuShow;
		}
	}
};
</script>
</script>
<style lang="less">
.wrap {
	height: 100%;
	.aside.left{
		height: 100%;
    	background-color: #304156;
		position:absolute;
		top:0px;
		left:0px;
		transition: widcth .28s;
		z-index: 1001;
	}
	.aside.main{
		-webkit-transition: margin-left .28s;
		transition: margin-left .28s;
		height: calc(100% - 70px);
		padding-top: 60px;
		padding-bottom: 10px;
		position: relative;
		overflow: auto;
		.main-container {
			padding: 10px;
		}
	}
}
</style>
