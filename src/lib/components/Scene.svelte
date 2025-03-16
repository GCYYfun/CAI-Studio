<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { DEG2RAD } from 'three/src/math/MathUtils.js';
  import { onMount, onDestroy } from 'svelte';
  import { get, writable } from 'svelte/store';
  
  // 为了确保渲染更稳定，使用更简单的动画解决方案
  let frameId = null;
  let lastTime = performance.now();
  let isRendering = false;
  
  // 创建一个store来跟踪渲染状态
  const renderState = writable({
    isActive: true,
    frameCount: 0,
    lastRenderTime: Date.now()
  });
  
  let group: any;
  let time = 0;
  let mountTime = Date.now();
  
  const particlesCount = 50;
  const particles = Array.from({ length: particlesCount }, () => ({
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ],
    scale: Math.random() * 0.5 + 0.1,
    rotation: [0, 0, 0],
    color: Math.random() < 0.5 ? 0x64ffda : 0xff6464
  }));
  
  let meshRefs: any[] = [];
  
  // 简化场景，减少复杂度
  const simplifiedParticleCount = 20; // 降低粒子数量
  
  // 初始化网格缓存
  let initializedMeshes = new Array(simplifiedParticleCount).fill(false);
  
  // 更安全的渲染循环
  function renderLoop(currentTime) {
    if (!isRendering) return;
    
    frameId = requestAnimationFrame(renderLoop);
    
    try {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      if (delta > 0.5) return;
      
      time += delta;
      
      // 更新组旋转（如果可用）
      if (group && group.rotation) {
        group.rotation.y = time * 0.1;
      }
      
      // 更安全地更新网格
      for (let i = 0; i < Math.min(meshRefs.length, simplifiedParticleCount); i++) {
        const mesh = meshRefs[i];
        
        // 检查网格是否已初始化且有rotation属性
        if (mesh && mesh.rotation) {
          initializedMeshes[i] = true;
          
          // 只有在确认初始化后才设置旋转
          mesh.rotation.x = time * (0.1 + i * 0.005) * DEG2RAD;
          mesh.rotation.y = time * (0.2 + i * 0.002) * DEG2RAD;
        }
      }
      
      // 记录渲染状态
      const currentState = get(renderState);
      currentState.frameCount++;
      currentState.lastRenderTime = Date.now();
      
      if (currentState.frameCount % 60 === 0) { // 每60帧记录一次
        console.log('Scene渲染中:', {
          frameCount: currentState.frameCount,
          runTime: ((Date.now() - mountTime)/1000).toFixed(1) + '秒',
          fps: Math.round(1 / delta)
        });
      }
      
      renderState.set(currentState);
    } catch (e) {
      console.error('渲染循环错误:', e);
      // 发生错误时不停止渲染，保持动画继续
    }
  }
  
  // 启动渲染循环
  function startRendering() {
    if (isRendering) return;
    
    console.log('开始渲染循环');
    isRendering = true;
    lastTime = performance.now();
    frameId = requestAnimationFrame(renderLoop);
  }
  
  // 停止渲染循环
  function stopRendering() {
    if (!isRendering) return;
    
    console.log('停止渲染循环');
    isRendering = false;
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }
  
  onMount(() => {
    console.log('Scene 组件已挂载', new Date().toISOString());
    mountTime = Date.now();
    
    // 确保在挂载后立即启动渲染
    setTimeout(() => {
      startRendering();
    }, 100);
    
    // 监听可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      console.log('Scene 组件将被卸载');
      stopRendering();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
  
  function handleVisibilityChange() {
    const isVisible = document.visibilityState === 'visible';
    console.log('页面可见性变化:', isVisible);
    
    if (isVisible) {
      console.log('页面重新可见，恢复渲染');
      startRendering();
    } else {
      console.log('页面不可见，暂停渲染');
      stopRendering();
    }
  }
  
  // 全局监听强制重渲染事件
  onMount(() => {
    const handleForceRerender = () => {
      console.log('收到强制重渲染事件，尝试重启渲染循环');
      stopRendering();
      
      // 先检查所有mesh是否已正确初始化
      let allValid = true;
      meshRefs.forEach((mesh, i) => {
        if (mesh && !mesh.rotation && i < simplifiedParticleCount) {
          allValid = false;
          console.warn(`检测到网格 ${i} 没有rotation属性`);
        }
      });
      
      // 延长重启时间，确保Three.js有足够时间初始化
      setTimeout(startRendering, allValid ? 50 : 200);
    };
    
    window.addEventListener('force-rerender', handleForceRerender);
    
    return () => {
      window.removeEventListener('force-rerender', handleForceRerender);
    };
  });
  
  // 在网格引用更新时添加验证
  function validateMeshRefs() {
    let validCount = 0;
    meshRefs.forEach((mesh, i) => {
      if (mesh && mesh.rotation) validCount++;
    });
    console.log(`有效网格数量: ${validCount}/${meshRefs.length}`);
  }
</script>

<T.PerspectiveCamera
  position={[0, 0, 15]}
  fov={50}
>
  <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} intensity={1.5} />

<T.Group bind:ref={group} on:create={() => setTimeout(validateMeshRefs, 500)}>
  {#each particles.slice(0, simplifiedParticleCount) as particle, i}
    <T.Mesh
      bind:this={meshRefs[i]}
      position={particle.position}
      scale={particle.scale}
    >
      {#if i % 3 === 0}
        <T.BoxGeometry args={[1, 1, 1]} />
      {:else if i % 3 === 1}
        <T.SphereGeometry args={[0.5, 16, 16]} /> <!-- 降低几何体精度 -->
      {:else}
        <T.TetrahedronGeometry args={[0.7, 0]} />
      {/if}
      
      <T.MeshStandardMaterial
        color={particle.color}
        metalness={0.5}
        roughness={0.2}
      />
    </T.Mesh>
  {/each}
</T.Group>
