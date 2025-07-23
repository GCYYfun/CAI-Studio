<!--
  3D场景组件
  渲染3D粒子系统，提供沉浸式的视觉体验
  
  Props:
  - particleCount: 粒子数量
  - autoRotate: 是否自动旋转
  - rotationSpeed: 旋转速度
  - className: 自定义CSS类名
-->

<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { onMount, onDestroy } from 'svelte';
  import { DEG2RAD } from 'three/src/math/MathUtils.js';
  import type { Scene3DConfig } from '../../types';
  import { SCENE_3D_CONFIG } from '../../utils/constants';
  
  interface Scene3DProps {
    particleCount?: number;
    autoRotate?: boolean;
    rotationSpeed?: number;
    className?: string;
  }
  
  /** 组件属性 */
  let {
    particleCount = SCENE_3D_CONFIG.particleCount,
    autoRotate = true,
    rotationSpeed = SCENE_3D_CONFIG.rotationSpeed,
    className = ''
  }: Scene3DProps = $props();
  
  /** 3D场景组引用 */
  let sceneGroup: any = $state();
  /** 粒子网格引用数组 */
  let particleMeshes: any[] = $state([]);
  /** 动画请求ID */
  let animationId: number | null = $state(null);
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  
  /** 生成粒子数据 */
  const particles = $derived(
    Array.from({ length: particleCount }, (_, index) => ({
      /** 粒子位置 */
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      ] as [number, number, number],
      /** 粒子缩放 */
      scale: Math.random() * 0.4 + 0.2,
      /** 粒子颜色（青色或红色） */
      color: Math.random() < 0.6 ? 0x64ffda : 0xff6464,
      /** 几何体类型 */
      geometryType: index % 3 as 0 | 1 | 2,
      /** 旋转偏移 */
      rotationOffset: {
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
      }
    }))
  );
  
  /** 动画渲染循环 */
  function animate(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // 防止异常的deltaTime值
    if (deltaTime > 0.1) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    time += deltaTime;
    
    try {
      // 更新场景组旋转
      if (sceneGroup && autoRotate) {
        sceneGroup.rotation.y = time * rotationSpeed;
      }
      
      // 更新粒子旋转
      particleMeshes.forEach((mesh, index) => {
        if (!mesh?.rotation) return;
        
        const particle = particles[index];
        if (!particle) return;
        
        // 为每个粒子添加独特的旋转动画
        mesh.rotation.x = (time * 0.3 + particle.rotationOffset.x) * DEG2RAD;
        mesh.rotation.y = (time * 0.2 + particle.rotationOffset.y) * DEG2RAD;
        mesh.rotation.z = time * 0.1 * DEG2RAD;
      });
      
    } catch (error) {
      console.warn('3D动画更新错误:', error);
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  /** 开始动画 */
  function startAnimation(): void {
    if (animationId) return;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);
  }
  
  /** 停止动画 */
  function stopAnimation(): void {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  /** 组件挂载时启动动画 */
  onMount(() => {
    // 延迟启动动画，确保Three.js完全初始化
    const timer = setTimeout(startAnimation, 100);
    
    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startAnimation();
      } else {
        stopAnimation();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(timer);
      stopAnimation();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
  
  /** 组件销毁时清理 */
  onDestroy(() => {
    stopAnimation();
  });
</script>

<!-- 相机设置 -->
<T.PerspectiveCamera
  position={SCENE_3D_CONFIG.cameraPosition}
  fov={SCENE_3D_CONFIG.fov}
>
  <!-- 相机控制 -->
  <OrbitControls 
    enableZoom={false} 
    enablePan={false} 
    autoRotate={autoRotate}
    autoRotateSpeed={SCENE_3D_CONFIG.autoRotateSpeed}
  />
</T.PerspectiveCamera>

<!-- 光照设置 -->
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight 
  position={[10, 10, 10]} 
  intensity={1.2}
  castShadow={false}
/>

<!-- 粒子系统 -->
<T.Group bind:ref={sceneGroup} class={className}>
  {#each particles as particle, index}
    <T.Mesh
      bind:this={particleMeshes[index]}
      position={particle.position}
      scale={particle.scale}
    >
      <!-- 根据索引选择不同的几何体 -->
      {#if particle.geometryType === 0}
        <T.BoxGeometry args={[1, 1, 1]} />
      {:else if particle.geometryType === 1}
        <T.SphereGeometry args={[0.6, 12, 8]} />
      {:else}
        <T.TetrahedronGeometry args={[0.8, 0]} />
      {/if}
      
      <!-- 材质设置 -->
      <T.MeshStandardMaterial
        color={particle.color}
        metalness={0.6}
        roughness={0.3}
        emissive={particle.color}
        emissiveIntensity={0.1}
      />
    </T.Mesh>
  {/each}
</T.Group>
