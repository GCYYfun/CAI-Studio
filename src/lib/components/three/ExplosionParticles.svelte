<!--
  爆炸粒子效果组件
  创建周期性的粒子爆炸效果
-->

<script lang="ts">
  import { T } from '@threlte/core';
  import { onMount, onDestroy } from 'svelte';
  
  interface ExplosionParticle {
    position: [number, number, number];
    velocity: [number, number, number];
    life: number;
    maxLife: number;
    size: number;
    color: number;
    active: boolean;
  }
  
  /** 每次爆炸的粒子数量 */
  const EXPLOSION_PARTICLE_COUNT = 35;
  /** 爆炸间隔（秒） */
  const EXPLOSION_INTERVAL = 3;
  /** 动画请求ID */
  let animationId: number | null = $state(null);
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  /** 上次爆炸时间 */
  let lastExplosionTime = $state(0);
  /** 爆炸粒子网格引用 */
  let explosionMeshes: any[] = $state([]);
  
  /** 生成爆炸粒子数据 */
  const explosionParticles = $derived(
    Array.from({ length: EXPLOSION_PARTICLE_COUNT }, (_, index): ExplosionParticle => ({
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      life: 0,
      maxLife: 2,
      size: 0.3 + Math.random() * 0.4,
      color: [0x64ffda, 0xff6464, 0xffd700, 0x6464ff][index % 4],
      active: false
    }))
  );
  
  /** 触发爆炸效果 */
  function triggerExplosion(): void {
    // 随机爆炸位置
    const explosionPos: [number, number, number] = [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    ];
    
    explosionParticles.forEach((particle, index) => {
      // 设置爆炸中心位置
      particle.position[0] = explosionPos[0];
      particle.position[1] = explosionPos[1];
      particle.position[2] = explosionPos[2];
      
      // 计算随机发射方向
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const speed = 12 + Math.random() * 18;
      
      particle.velocity[0] = Math.sin(theta) * Math.cos(phi) * speed;
      particle.velocity[1] = Math.sin(theta) * Math.sin(phi) * speed;
      particle.velocity[2] = Math.cos(theta) * speed;
      
      // 重置生命周期
      particle.life = 0;
      particle.maxLife = 1.5 + Math.random() * 2;
      particle.active = true;
    });
  }
  
  /** 爆炸动画循环 */
  function animateExplosion(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (deltaTime > 0.1) {
      animationId = requestAnimationFrame(animateExplosion);
      return;
    }
    
    time += deltaTime;
    
    // 检查是否需要触发新的爆炸
    if (time - lastExplosionTime > EXPLOSION_INTERVAL) {
      triggerExplosion();
      lastExplosionTime = time;
    }
    
    try {
      explosionMeshes.forEach((mesh, index) => {
        if (!mesh?.position) return;
        
        const particle = explosionParticles[index];
        if (!particle || !particle.active) {
          // 隐藏非活跃粒子
          mesh.scale.setScalar(0);
          return;
        }
        
        // 更新生命周期
        particle.life += deltaTime;
        
        // 如果粒子生命结束，停用它
        if (particle.life > particle.maxLife) {
          particle.active = false;
          mesh.scale.setScalar(0);
          return;
        }
        
        // 应用重力和阻尼
        const gravity = -5;
        const damping = 0.98;
        
        particle.velocity[1] += gravity * deltaTime;
        particle.velocity[0] *= damping;
        particle.velocity[1] *= damping;
        particle.velocity[2] *= damping;
        
        // 更新位置
        particle.position[0] += particle.velocity[0] * deltaTime;
        particle.position[1] += particle.velocity[1] * deltaTime;
        particle.position[2] += particle.velocity[2] * deltaTime;
        
        // 更新mesh位置
        mesh.position.set(particle.position[0], particle.position[1], particle.position[2]);
        
        // 基于生命周期的缩放和透明度
        const lifeRatio = particle.life / particle.maxLife;
        const scale = particle.size * (1 - lifeRatio * 0.7);
        const opacity = Math.max(0.1, 1 - lifeRatio);
        
        mesh.scale.setScalar(scale);
        
        // 更新材质透明度
        if (mesh.material) {
          mesh.material.opacity = opacity;
          mesh.material.emissiveIntensity = opacity * 0.8;
        }
        
        // 旋转效果
        mesh.rotation.x += deltaTime * 5;
        mesh.rotation.y += deltaTime * 3;
        mesh.rotation.z += deltaTime * 4;
      });
      
    } catch (error) {
      console.warn('爆炸动画更新错误:', error);
    }
    
    animationId = requestAnimationFrame(animateExplosion);
  }
  
  /** 开始爆炸动画 */
  function startExplosionAnimation(): void {
    if (animationId) return;
    lastTime = performance.now();
    lastExplosionTime = time;
    animationId = requestAnimationFrame(animateExplosion);
  }
  
  /** 停止爆炸动画 */
  function stopExplosionAnimation(): void {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  onMount(() => {
    const timer = setTimeout(() => {
      startExplosionAnimation();
      // 延迟触发第一次爆炸
      setTimeout(triggerExplosion, 1000);
    }, 300);
    
    return () => {
      clearTimeout(timer);
      stopExplosionAnimation();
    };
  });
  
  onDestroy(() => {
    stopExplosionAnimation();
  });
</script>

<!-- 爆炸粒子系统 -->
<T.Group>
  {#each explosionParticles as particle, index}
    <T.Mesh
      bind:this={explosionMeshes[index]}
      position={particle.position}
      scale={particle.size}
    >
      <T.SphereGeometry args={[1, 8, 6]} />
      <T.MeshStandardMaterial
        color={particle.color}
        metalness={0.7}
        roughness={0.2}
        emissive={particle.color}
        emissiveIntensity={0.8}
        transparent={true}
        opacity={1}
      />
    </T.Mesh>
  {/each}
</T.Group>
