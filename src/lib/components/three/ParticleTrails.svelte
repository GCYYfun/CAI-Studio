<!--
  粒子轨迹效果组件
  为快速移动的粒子添加动态轨迹效果
-->

<script lang="ts">
  import { T } from '@threlte/core';
  import { onMount, onDestroy } from 'svelte';
  
  interface TrailParticle {
    position: [number, number, number];
    velocity: [number, number, number];
    life: number;
    maxLife: number;
    size: number;
  }
  
  /** 轨迹粒子数量 */
  const TRAIL_COUNT = 25;
  /** 动画请求ID */
  let animationId: number | null = $state(null);
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  /** 轨迹粒子网格引用 */
  let trailMeshes: any[] = $state([]);
  
  /** 生成轨迹粒子数据 */
  const trailParticles = $derived(
    Array.from({ length: TRAIL_COUNT }, (_, index): TrailParticle => {
      const angle = (index / TRAIL_COUNT) * Math.PI * 2;
      const radius = 12 + Math.random() * 8;
      
      return {
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 10,
          Math.sin(angle) * radius
        ],
        velocity: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 4
        ],
        life: Math.random(),
        maxLife: 2 + Math.random() * 3,
        size: 0.1 + Math.random() * 0.2
      };
    })
  );
  
  /** 轨迹动画循环 */
  function animateTrails(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (deltaTime > 0.1) {
      animationId = requestAnimationFrame(animateTrails);
      return;
    }
    
    time += deltaTime;
    
    try {
      trailMeshes.forEach((mesh, index) => {
        if (!mesh?.position) return;
        
        const particle = trailParticles[index];
        if (!particle) return;
        
        // 更新生命周期
        particle.life += deltaTime;
        
        // 更新速度（添加随机扰动和向心力）
        const centerForce = 0.8;
        particle.velocity[0] += -particle.position[0] * centerForce * deltaTime;
        particle.velocity[1] += -particle.position[1] * centerForce * deltaTime;
        particle.velocity[2] += -particle.position[2] * centerForce * deltaTime;
        
        // 添加随机湍流
        const turbulence = 5;
        particle.velocity[0] += (Math.random() - 0.5) * turbulence * deltaTime;
        particle.velocity[1] += (Math.random() - 0.5) * turbulence * deltaTime;
        particle.velocity[2] += (Math.random() - 0.5) * turbulence * deltaTime;
        
        // 添加螺旋运动
        const spiralForce = 2;
        const spiralTime = time * 2 + index * 0.5;
        particle.velocity[0] += Math.sin(spiralTime) * spiralForce * deltaTime;
        particle.velocity[2] += Math.cos(spiralTime) * spiralForce * deltaTime;
        
        // 更新位置
        particle.position[0] += particle.velocity[0] * deltaTime * 12;
        particle.position[1] += particle.velocity[1] * deltaTime * 12;
        particle.position[2] += particle.velocity[2] * deltaTime * 12;
        
        // 重置粒子
        if (particle.life > particle.maxLife) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 15 + Math.random() * 5;
          
          particle.position[0] = Math.cos(angle) * radius;
          particle.position[1] = (Math.random() - 0.5) * 12;
          particle.position[2] = Math.sin(angle) * radius;
          
          const speed = 2 + Math.random() * 3;
          particle.velocity[0] = -particle.position[0] * 0.1 * speed;
          particle.velocity[1] = -particle.position[1] * 0.1 * speed;
          particle.velocity[2] = -particle.position[2] * 0.1 * speed;
          
          particle.life = 0;
          particle.maxLife = 2 + Math.random() * 3;
        }
        
        // 更新mesh
        mesh.position.set(particle.position[0], particle.position[1], particle.position[2]);
        
        // 基于生命周期的透明度
        const lifeRatio = 1 - (particle.life / particle.maxLife);
        const opacity = Math.max(0.1, lifeRatio * 0.8);
        
        // 更新材质透明度
        if (mesh.material) {
          mesh.material.opacity = opacity;
        }
        
        // 动态缩放
        const scale = particle.size * (1 + Math.sin(time * 4 + index) * 0.3);
        mesh.scale.setScalar(scale);
        
        // 旋转
        mesh.rotation.x = time * 2 + index;
        mesh.rotation.y = time * 1.5 + index * 0.5;
        mesh.rotation.z = time + index * 0.3;
      });
      
    } catch (error) {
      console.warn('轨迹动画更新错误:', error);
    }
    
    animationId = requestAnimationFrame(animateTrails);
  }
  
  /** 开始轨迹动画 */
  function startTrailAnimation(): void {
    if (animationId) return;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animateTrails);
  }
  
  /** 停止轨迹动画 */
  function stopTrailAnimation(): void {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  onMount(() => {
    const timer = setTimeout(startTrailAnimation, 200);
    
    return () => {
      clearTimeout(timer);
      stopTrailAnimation();
    };
  });
  
  onDestroy(() => {
    stopTrailAnimation();
  });
</script>

<!-- 轨迹粒子系统 -->
<T.Group>
  {#each trailParticles as particle, index}
    <T.Mesh
      bind:this={trailMeshes[index]}
      position={particle.position}
      scale={particle.size}
    >
      <T.SphereGeometry args={[1, 8, 6]} />
      <T.MeshStandardMaterial
        color={index % 3 === 0 ? 0x64ffda : (index % 3 === 1 ? 0xff6464 : 0xffd700)}
        metalness={0.9}
        roughness={0.1}
        emissive={index % 3 === 0 ? 0x64ffda : (index % 3 === 1 ? 0xff6464 : 0xffd700)}
        emissiveIntensity={0.6}
        transparent={true}
        opacity={0.7}
      />
    </T.Mesh>
  {/each}
</T.Group>
