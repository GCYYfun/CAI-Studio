<!--
  流星效果组件
  创建快速飞过的流星轨迹
-->

<script lang="ts">
  import { T } from '@threlte/core';
  import { onMount, onDestroy } from 'svelte';
  
  interface Meteor {
    position: [number, number, number];
    velocity: [number, number, number];
    trail: [number, number, number][];
    life: number;
    maxLife: number;
    size: number;
    active: boolean;
    color: number;
  }
  
  /** 流星数量 */
  const METEOR_COUNT = 4;
  /** 轨迹长度 */
  const TRAIL_LENGTH = 15;
  /** 流星生成间隔 */
  const SPAWN_INTERVAL = 2;
  /** 动画请求ID */
  let animationId: number | null = $state(null);
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  /** 上次生成流星时间 */
  let lastSpawnTime = $state(0);
  /** 流星网格引用 */
  let meteorMeshes: any[] = $state([]);
  /** 轨迹网格引用 */
  let trailMeshes: any[] = $state([]);
  
  /** 生成流星数据 */
  const meteors = $derived(
    Array.from({ length: METEOR_COUNT }, (_, index): Meteor => ({
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      trail: Array(TRAIL_LENGTH).fill(null).map(() => [0, 0, 0]),
      life: 0,
      maxLife: 3,
      size: 0.3 + Math.random() * 0.2,
      active: false,
      color: [0x64ffda, 0xff6464, 0xffd700, 0xffffff][index % 4]
    }))
  );
  
  // 初始化轨迹网格数组
  $effect(() => {
    trailMeshes = Array(METEOR_COUNT * TRAIL_LENGTH).fill(null);
  });
  
  /** 生成新流星 */
  function spawnMeteor(): void {
    const inactiveMeteor = meteors.find(m => !m.active);
    if (!inactiveMeteor) return;
    
    // 随机起始位置（屏幕边缘外）
    const side = Math.floor(Math.random() * 4);
    const distance = 35;
    
    switch (side) {
      case 0: // 上方
        inactiveMeteor.position[0] = (Math.random() - 0.5) * 60;
        inactiveMeteor.position[1] = distance;
        inactiveMeteor.position[2] = (Math.random() - 0.5) * 40;
        break;
      case 1: // 右方
        inactiveMeteor.position[0] = distance;
        inactiveMeteor.position[1] = (Math.random() - 0.5) * 60;
        inactiveMeteor.position[2] = (Math.random() - 0.5) * 40;
        break;
      case 2: // 下方
        inactiveMeteor.position[0] = (Math.random() - 0.5) * 60;
        inactiveMeteor.position[1] = -distance;
        inactiveMeteor.position[2] = (Math.random() - 0.5) * 40;
        break;
      case 3: // 左方
        inactiveMeteor.position[0] = -distance;
        inactiveMeteor.position[1] = (Math.random() - 0.5) * 60;
        inactiveMeteor.position[2] = (Math.random() - 0.5) * 40;
        break;
    }
    
    // 设置朝向中心的速度
    const speed = 20 + Math.random() * 15;
    const targetX = (Math.random() - 0.5) * 20;
    const targetY = (Math.random() - 0.5) * 20;
    const targetZ = (Math.random() - 0.5) * 20;
    
    const dx = targetX - inactiveMeteor.position[0];
    const dy = targetY - inactiveMeteor.position[1];
    const dz = targetZ - inactiveMeteor.position[2];
    
    const distance_to_target = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    inactiveMeteor.velocity[0] = (dx / distance_to_target) * speed;
    inactiveMeteor.velocity[1] = (dy / distance_to_target) * speed;
    inactiveMeteor.velocity[2] = (dz / distance_to_target) * speed;
    
    // 重置状态
    inactiveMeteor.life = 0;
    inactiveMeteor.maxLife = 2 + Math.random() * 2;
    inactiveMeteor.active = true;
    
    // 初始化轨迹
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      inactiveMeteor.trail[i] = [...inactiveMeteor.position];
    }
  }
  
  /** 流星动画循环 */
  function animateMeteors(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (deltaTime > 0.1) {
      animationId = requestAnimationFrame(animateMeteors);
      return;
    }
    
    time += deltaTime;
    
    // 检查是否需要生成新流星
    if (time - lastSpawnTime > SPAWN_INTERVAL) {
      spawnMeteor();
      lastSpawnTime = time;
    }
    
    try {
      meteors.forEach((meteor, meteorIndex) => {
        const mesh = meteorMeshes[meteorIndex];
        if (!meteor.active || !mesh) return;
        
        // 更新生命周期
        meteor.life += deltaTime;
        
        if (meteor.life > meteor.maxLife) {
          meteor.active = false;
          mesh.scale.setScalar(0);
          return;
        }
        
        // 更新轨迹
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
          meteor.trail[i][0] = meteor.trail[i - 1][0];
          meteor.trail[i][1] = meteor.trail[i - 1][1];
          meteor.trail[i][2] = meteor.trail[i - 1][2];
        }
        meteor.trail[0] = [...meteor.position];
        
        // 更新位置
        meteor.position[0] += meteor.velocity[0] * deltaTime;
        meteor.position[1] += meteor.velocity[1] * deltaTime;
        meteor.position[2] += meteor.velocity[2] * deltaTime;
        
        // 更新主流星mesh
        mesh.position.set(meteor.position[0], meteor.position[1], meteor.position[2]);
        
        // 根据生命周期调整大小
        const lifeRatio = 1 - (meteor.life / meteor.maxLife);
        mesh.scale.setScalar(meteor.size * lifeRatio);
        
        // 旋转效果
        mesh.rotation.x = time * 10 + meteorIndex;
        mesh.rotation.y = time * 8 + meteorIndex * 0.7;
        mesh.rotation.z = time * 6 + meteorIndex * 0.5;
        
        // 更新轨迹
        meteor.trail.forEach((trailPos, trailIndex) => {
          const trailMeshIndex = meteorIndex * TRAIL_LENGTH + trailIndex;
          const trailMesh = trailMeshes[trailMeshIndex];
          if (!trailMesh) return;
          
          trailMesh.position.set(trailPos[0], trailPos[1], trailPos[2]);
          
          const trailRatio = 1 - (trailIndex / TRAIL_LENGTH);
          const trailScale = meteor.size * trailRatio * 0.8 * lifeRatio;
          const trailOpacity = trailRatio * 0.9 * lifeRatio;
          
          trailMesh.scale.setScalar(trailScale);
          
          if (trailMesh.material) {
            trailMesh.material.opacity = trailOpacity;
            trailMesh.material.emissiveIntensity = trailOpacity;
          }
        });
      });
      
    } catch (error) {
      console.warn('流星动画更新错误:', error);
    }
    
    animationId = requestAnimationFrame(animateMeteors);
  }
  
  /** 开始流星动画 */
  function startMeteorAnimation(): void {
    if (animationId) return;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animateMeteors);
  }
  
  /** 停止流星动画 */
  function stopMeteorAnimation(): void {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  onMount(() => {
    const timer = setTimeout(() => {
      startMeteorAnimation();
      // 立即生成第一个流星
      setTimeout(spawnMeteor, 500);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      stopMeteorAnimation();
    };
  });
  
  onDestroy(() => {
    stopMeteorAnimation();
  });
</script>

<!-- 流星系统 -->
<T.Group>
  {#each meteors as meteor, meteorIndex}
    <!-- 主流星 -->
    <T.Mesh
      bind:this={meteorMeshes[meteorIndex]}
      position={meteor.position}
      scale={meteor.size}
    >
      <T.SphereGeometry args={[1, 8, 6]} />
      <T.MeshStandardMaterial
        color={meteor.color}
        metalness={0.8}
        roughness={0.2}
        emissive={meteor.color}
        emissiveIntensity={1.2}
        transparent={false}
      />
    </T.Mesh>
    
    <!-- 流星轨迹 -->
    {#each meteor.trail as trailPos, trailIndex}
      {@const trailMeshIndex = meteorIndex * TRAIL_LENGTH + trailIndex}
      <T.Mesh
        bind:this={trailMeshes[trailMeshIndex]}
        position={trailPos}
        scale={meteor.size * (1 - trailIndex / TRAIL_LENGTH) * 0.8}
      >
        <T.SphereGeometry args={[1, 6, 4]} />
        <T.MeshStandardMaterial
          color={meteor.color}
          metalness={0.6}
          roughness={0.4}
          emissive={meteor.color}
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1 - trailIndex / TRAIL_LENGTH}
        />
      </T.Mesh>
    {/each}
  {/each}
</T.Group>
