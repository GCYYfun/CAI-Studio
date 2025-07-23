<!--
  星空背景组件
  创建动态星空背景效果
-->

<script lang="ts">
  import { T } from '@threlte/core';
  import { onMount, onDestroy } from 'svelte';
  
  interface Star {
    position: [number, number, number];
    size: number;
    brightness: number;
    twinkleSpeed: number;
    color: number;
  }
  
  /** 星星数量 */
  const STAR_COUNT = 100;
  /** 动画请求ID */
  let animationId: number | null = $state(null);
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  /** 星星网格引用 */
  let starMeshes: any[] = $state([]);
  
  /** 生成星星数据 */
  const stars = $derived(
    Array.from({ length: STAR_COUNT }, (_, index): Star => {
      // 在球面上随机分布
      const radius = 45 + Math.random() * 15;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      return {
        position: [
          radius * Math.sin(theta) * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(theta)
        ],
        size: 0.05 + Math.random() * 0.15,
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 1 + Math.random() * 3,
        color: [0xffffff, 0x64ffda, 0xff6464, 0xffd700, 0x6464ff][Math.floor(Math.random() * 5)]
      };
    })
  );
  
  /** 星空动画循环 */
  function animateStars(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (deltaTime > 0.1) {
      animationId = requestAnimationFrame(animateStars);
      return;
    }
    
    time += deltaTime;
    
    try {
      starMeshes.forEach((mesh, index) => {
        if (!mesh) return;
        
        const star = stars[index];
        if (!star) return;
        
        // 闪烁效果
        const twinkle = Math.sin(time * star.twinkleSpeed + index) * 0.5 + 0.5;
        const finalBrightness = star.brightness * (0.3 + twinkle * 0.7);
        
        // 更新材质
        if (mesh.material) {
          mesh.material.emissiveIntensity = finalBrightness;
          mesh.material.opacity = finalBrightness;
        }
        
        // 轻微的位置变化（模拟大气扰动）
        const flutter = Math.sin(time * 0.5 + index) * 0.1;
        mesh.position.y = star.position[1] + flutter;
        
        // 缩放变化
        const scaleVariation = 1 + Math.sin(time * star.twinkleSpeed * 2 + index) * 0.3;
        mesh.scale.setScalar(star.size * scaleVariation);
      });
      
    } catch (error) {
      console.warn('星空动画更新错误:', error);
    }
    
    animationId = requestAnimationFrame(animateStars);
  }
  
  /** 开始星空动画 */
  function startStarAnimation(): void {
    if (animationId) return;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animateStars);
  }
  
  /** 停止星空动画 */
  function stopStarAnimation(): void {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  onMount(() => {
    const timer = setTimeout(startStarAnimation, 100);
    
    return () => {
      clearTimeout(timer);
      stopStarAnimation();
    };
  });
  
  onDestroy(() => {
    stopStarAnimation();
  });
</script>

<!-- 星空背景系统 -->
<T.Group>
  {#each stars as star, index}
    <T.Mesh
      bind:this={starMeshes[index]}
      position={star.position}
      scale={star.size}
    >
      <T.SphereGeometry args={[1, 8, 6]} />
      <T.MeshStandardMaterial
        color={star.color}
        metalness={0.5}
        roughness={0.5}
        emissive={star.color}
        emissiveIntensity={star.brightness}
        transparent={true}
        opacity={star.brightness}
      />
    </T.Mesh>
  {/each}
</T.Group>
