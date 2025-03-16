<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	let mounted = false;
	
	// 确保布局组件完全挂载
	onMount(() => {
		console.log('Layout组件已挂载');
		mounted = true;
		
		// 添加WebGL上下文丢失事件监听
		window.addEventListener('webglcontextlost', (event) => {
			console.error('WebGL上下文丢失:', event);
			event.preventDefault();
		});
	});
</script>

<!-- 为确保3D渲染不受干扰，添加特殊容器 -->
<div class="app-container">
	<Navbar />
	<main class="main-content">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.app-container {
		position: relative;
		width: 100%;
		min-height: 100vh;
		/* 确保容器不干扰3D渲染 */
		overflow-x: hidden;
	}
	
	.main-content {
		position: relative;
		width: 100%;
		/* 确保内容区域不受布局干扰 */
		z-index: 1;
	}
	
	/* 确保global样式不会干扰WebGL canvas */
	:global(canvas) {
		display: block !important;
	}
</style>
