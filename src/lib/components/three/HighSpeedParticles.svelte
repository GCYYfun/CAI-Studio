<!--
  高速粒子组件
  创建快速飞行的粒子，带有拖尾效果
-->

<script lang="ts">
  import { T } from '@threlte/core';
  import { onMount, onDestroy } from 'svelte';
  
  interface HighSpeedParticle {
    position: [number, number, number];
    velocity: [number, number, number];
    trail: [number, number, number][];
    life: number;
    maxLife: number;
    size: number;
    color: number;
    active: boolean;
    speed: number;
  }
  
  /** 高速粒子数量 */
  const HIGH_SPEED_COUNT = 8;
  /** 轨迹长度 */
  const TRAIL_LENGTH = 12;
  /** 动画请求ID */
  let animationId: number | null = $state(null);
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  /** 高速粒子网格引用 */
  let speedMeshes: any[] = $state([]);
  /** 轨迹网格引用 */
  let trailMeshes: any[][] = $state([]);
  /** 单个轨迹网格引用（用于绑定） */
  let singleTrailMeshes: any[] = $state([]);
  
  /** 生成高速粒子数据 */
  const speedParticles = $derived(
    Array.from({ length: HIGH_SPEED_COUNT }, (_, index): HighSpeedParticle => {
      const angle = (index / HIGH_SPEED_COUNT) * Math.PI * 2;
      const radius = 25;
      
      const startPos: [number, number, number] = [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 20,
        Math.sin(angle) * radius
      ];
      
      const speed = 15 + Math.random() * 10;
      const targetAngle = angle + Math.PI + (Math.random() - 0.5) * 0.5;
      
      return {
        position: [...startPos],
        velocity: [
          Math.cos(targetAngle) * speed,
          (Math.random() - 0.5) * speed * 0.3,
          Math.sin(targetAngle) * speed
        ],
        trail: Array(TRAIL_LENGTH).fill(null).map(() => [...startPos]),
        life: 0,
        maxLife: 3 + Math.random() * 2,
        size: 0.4 + Math.random() * 0.3,
        color: [0x64ffda, 0xff6464, 0xffd700, 0x6464ff, 0xff64da][index % 5],
        active: true,
        speed: speed
      };
    })
  );
  
  // 初始化轨迹网格数组
  $effect(() => {
    trailMeshes = Array(HIGH_SPEED_COUNT).fill(null).map(() => Array(TRAIL_LENGTH).fill(null));
    singleTrailMeshes = Array(HIGH_SPEED_COUNT * TRAIL_LENGTH).fill(null);
  });
  
  /** 重置粒子 */
  function resetParticle(particle: HighSpeedParticle, index: number): void {
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 5;
    
    particle.position[0] = Math.cos(angle) * radius;
    particle.position[1] = (Math.random() - 0.5) * 20;
    particle.position[2] = Math.sin(angle) * radius;
    
    const speed = 15 + Math.random() * 10;
    const targetAngle = angle + Math.PI + (Math.random() - 0.5);
    
    particle.velocity[0] = Math.cos(targetAngle) * speed;
    particle.velocity[1] = (Math.random() - 0.5) * speed * 0.3;
    particle.velocity[2] = Math.sin(targetAngle) * speed;
    
    particle.life = 0;
    particle.maxLife = 3 + Math.random() * 2;
    particle.speed = speed;
    particle.active = true;
    
    // 重置轨迹
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      particle.trail[i] = [...particle.position];
    }
  }
  
  /** 高速粒子动画循环 */
  function animateHighSpeed(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (deltaTime > 0.1) {
      animationId = requestAnimationFrame(animateHighSpeed);
      return;
    }
    
    time += deltaTime;
    
    try {
      speedParticles.forEach((particle, particleIndex) => {
        if (!particle.active) return;
        
        const mesh = speedMeshes[particleIndex];
        if (!mesh) return;
        
        // 更新生命周期
        particle.life += deltaTime;
        
        // 如果粒子生命结束，重置它
        if (particle.life > particle.maxLife) {
          resetParticle(particle, particleIndex);
        }
        
        // 更新轨迹位置
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
          particle.trail[i][0] = particle.trail[i - 1][0];
          particle.trail[i][1] = particle.trail[i - 1][1];
          particle.trail[i][2] = particle.trail[i - 1][2];
        }
        particle.trail[0] = [...particle.position];
        
        // 添加随机扰动
        const turbulence = 2;
        particle.velocity[0] += (Math.random() - 0.5) * turbulence;
        particle.velocity[1] += (Math.random() - 0.5) * turbulence;
        particle.velocity[2] += (Math.random() - 0.5) * turbulence;
        
        // 向心力效果
        const centerForce = 0.3;
        particle.velocity[0] += -particle.position[0] * centerForce * deltaTime;
        particle.velocity[1] += -particle.position[1] * centerForce * deltaTime;
        particle.velocity[2] += -particle.position[2] * centerForce * deltaTime;
        
        // 更新位置
        particle.position[0] += particle.velocity[0] * deltaTime;
        particle.position[1] += particle.velocity[1] * deltaTime;
        particle.position[2] += particle.velocity[2] * deltaTime;
        
        // 更新主粒子mesh
        mesh.position.set(particle.position[0], particle.position[1], particle.position[2]);
        
        // 动态缩放和旋转
        const velocityMagnitude = Math.sqrt(
          particle.velocity[0] * particle.velocity[0] +
          particle.velocity[1] * particle.velocity[1] +
          particle.velocity[2] * particle.velocity[2]
        );
        
        const scale = particle.size * (1 + velocityMagnitude * 0.05);
        mesh.scale.setScalar(scale);
        
        mesh.rotation.x = time * 8 + particleIndex;
        mesh.rotation.y = time * 6 + particleIndex * 0.7;
        mesh.rotation.z = time * 4 + particleIndex * 0.3;
        
        // 更新轨迹mesh
        particle.trail.forEach((trailPos, trailIndex) => {
          const meshIndex = particleIndex * TRAIL_LENGTH + trailIndex;
          const trailMesh = singleTrailMeshes[meshIndex];
          if (!trailMesh) return;
          
          trailMesh.position.set(trailPos[0], trailPos[1], trailPos[2]);
          
          // 轨迹透明度和大小递减
          const trailRatio = 1 - (trailIndex / TRAIL_LENGTH);
          const trailScale = particle.size * trailRatio * 0.6;
          const trailOpacity = trailRatio * 0.8;
          
          trailMesh.scale.setScalar(trailScale);
          
          if (trailMesh.material) {
            trailMesh.material.opacity = trailOpacity;
            trailMesh.material.emissiveIntensity = trailOpacity * 0.5;
          }
        });
      });
      
    } catch (error) {
      console.warn('高速粒子动画更新错误:', error);
    }
    
    animationId = requestAnimationFrame(animateHighSpeed);
  }
  
  /** 开始高速动画 */
  function startHighSpeedAnimation(): void {
    if (animationId) return;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animateHighSpeed);
  }
  
  /** 停止高速动画 */
  function stopHighSpeedAnimation(): void {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  onMount(() => {
    const timer = setTimeout(startHighSpeedAnimation, 400);
    
    return () => {
      clearTimeout(timer);
      stopHighSpeedAnimation();
    };
  });
  
  onDestroy(() => {
    stopHighSpeedAnimation();
  });
</script>

<!-- 高速粒子系统 -->
<T.Group>
  {#each speedParticles as particle, particleIndex}
    <!-- 主粒子 -->
    <T.Mesh
      bind:this={speedMeshes[particleIndex]}
      position={particle.position}
      scale={particle.size}
    >
      <T.SphereGeometry args={[1, 12, 8]} />
      <T.MeshStandardMaterial
        color={particle.color}
        metalness={0.9}
        roughness={0.1}
        emissive={particle.color}
        emissiveIntensity={0.8}
        transparent={false}
      />
    </T.Mesh>
    
    <!-- 粒子轨迹 -->
    {#each particle.trail as trailPos, trailIndex}
      {@const meshIndex = particleIndex * TRAIL_LENGTH + trailIndex}
      <T.Mesh
        bind:this={singleTrailMeshes[meshIndex]}
        position={trailPos}
        scale={particle.size * (1 - trailIndex / TRAIL_LENGTH) * 0.6}
      >
        <T.SphereGeometry args={[1, 6, 4]} />
        <T.MeshStandardMaterial
          color={particle.color}
          metalness={0.7}
          roughness={0.3}
          emissive={particle.color}
          emissiveIntensity={0.3}
          transparent={true}
          opacity={1 - trailIndex / TRAIL_LENGTH}
        />
      </T.Mesh>
    {/each}
  {/each}
</T.Group>
