<!--
  3D场景组件
  渲染炫酷的3D粒子系统，包含快速飞行效果和动态轨迹
  
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
  import ParticleTrails from './ParticleTrails.svelte';
  import ExplosionParticles from './ExplosionParticles.svelte';
  import StarField from './StarField.svelte';
  import MeteorShower from './MeteorShower.svelte';
  
  interface Scene3DProps {
    particleCount?: number;
    autoRotate?: boolean;
    rotationSpeed?: number;
    className?: string;
  }
  
  interface ParticleData {
    position: [number, number, number];
    velocity: [number, number, number];
    scale: number;
    color: number;
    geometryType: 0 | 1 | 2 | 3;
    rotationOffset: { x: number; y: number; z: number };
    initialPosition: [number, number, number];
    lifecycle: number;
    trailPositions: [number, number, number][];
  }
  
  /** 组件属性 */
  let {
    particleCount = SCENE_3D_CONFIG.particleCount * 3, // 增加粒子数量
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
  /** 黑洞吸收状态 */
  let blackHoleAbsorbing = $state(false);
  /** 下次吸收时间 */
  let nextAbsorptionTime = $state(5);
  /** 被吸收的粒子索引 */
  let absorbedParticles = $state(new Set<number>());
  /** 动画时间 */
  let time = $state(0);
  /** 上次更新时间 */
  let lastTime = $state(performance.now());
  
  /** 生成粒子数据 */
  const particles = $derived(
    Array.from({ length: particleCount }, (_, index): ParticleData => {
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // 创建向中心的初始速度
      const speed = 2 + Math.random() * 4;
      const vx = -x * 0.1 * speed + (Math.random() - 0.5) * 2;
      const vy = -y * 0.1 * speed + (Math.random() - 0.5) * 2;
      const vz = -z * 0.1 * speed + (Math.random() - 0.5) * 2;
      
      return {
        position: [x, y, z],
        velocity: [vx, vy, vz],
        scale: Math.random() * 0.6 + 0.3,
        color: Math.random() < 0.4 ? 0x64ffda : (Math.random() < 0.7 ? 0xff6464 : 0xffd700),
        geometryType: index % 4 as 0 | 1 | 2 | 3,
        rotationOffset: {
          x: Math.random() * Math.PI * 2,
          y: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI * 2,
        },
        initialPosition: [x, y, z],
        lifecycle: 0,
        trailPositions: []
      };
    })
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
    
    // 黑洞吸收逻辑
    if (time > nextAbsorptionTime && !blackHoleAbsorbing) {
      // 开始黑洞吸收
      blackHoleAbsorbing = true;
      
      // 随机选择一个未被吸收的粒子
      const availableParticles = particles
        .map((_, index) => index)
        .filter(index => !absorbedParticles.has(index));
      
      if (availableParticles.length > 0) {
        const targetIndex = availableParticles[Math.floor(Math.random() * availableParticles.length)];
        absorbedParticles.add(targetIndex);
        
        // 设置下次吸收时间（1-3秒后，更频繁）
        nextAbsorptionTime = time + 1 + Math.random() * 2;
        
        // 1.5秒后停止吸收效果
        setTimeout(() => {
          blackHoleAbsorbing = false;
        }, 1500);
      }
    }
    
    try {
      // 更新场景组旋转
      if (sceneGroup && autoRotate) {
        sceneGroup.rotation.y = time * rotationSpeed;
      }
      
      // 更新粒子位置和旋转
      particleMeshes.forEach((mesh, index) => {
        if (!mesh?.position || !mesh?.rotation) return;
        
        const particle = particles[index];
        if (!particle) return;
        
        // 检查是否被黑洞吸收
        const isBeingAbsorbed = absorbedParticles.has(index);
        
        if (isBeingAbsorbed) {
          // 被吸收的粒子行为
          const distanceToCenter = Math.sqrt(
            particle.position[0] * particle.position[0] +
            particle.position[1] * particle.position[1] +
            particle.position[2] * particle.position[2]
          );
          
          if (distanceToCenter > 0.3) {
            // 计算到黑洞中心的方向
            const dirX = -particle.position[0];
            const dirY = -particle.position[1];
            const dirZ = -particle.position[2];
            const distance = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
            
            // 归一化方向向量
            const normalizedDirX = dirX / distance;
            const normalizedDirY = dirY / distance;
            const normalizedDirZ = dirZ / distance;
            
            // 强烈的向心力，速度越来越快
            const absorptionForce = 25 / (distanceToCenter + 0.1);
            particle.velocity[0] = normalizedDirX * absorptionForce;
            particle.velocity[1] = normalizedDirY * absorptionForce;
            particle.velocity[2] = normalizedDirZ * absorptionForce;
            
            // 更新位置
            particle.position[0] += particle.velocity[0] * deltaTime;
            particle.position[1] += particle.velocity[1] * deltaTime;
            particle.position[2] += particle.velocity[2] * deltaTime;
            
            // 粒子随着接近黑洞而拉伸和缩小
            const stretchFactor = Math.max(0.1, distanceToCenter / 5);
            mesh.scale.x = particle.scale * stretchFactor;
            mesh.scale.y = particle.scale * stretchFactor * (2 - stretchFactor); // 拉伸效果
            mesh.scale.z = particle.scale * stretchFactor;
            
            // 材质变化 - 变得更亮更红
            if (mesh.material) {
              mesh.material.emissiveIntensity = 0.8 / stretchFactor;
              mesh.material.opacity = Math.max(0.3, stretchFactor);
              // 变成红色表示即将被吞噬
              mesh.material.color.setHex(0xff4444);
              mesh.material.emissive.setHex(0xff2222);
            }
          } else {
            // 粒子被完全吸收，隐藏它
            mesh.scale.setScalar(0);
            
            // 3秒后重生粒子
            if (particle.lifecycle > 3) {
              absorbedParticles.delete(index);
              
              // 重新初始化粒子
              const radius = 20 + Math.random() * 5;
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.random() * Math.PI;
              
              particle.position[0] = radius * Math.sin(phi) * Math.cos(theta);
              particle.position[1] = radius * Math.sin(phi) * Math.sin(theta);
              particle.position[2] = radius * Math.cos(phi);
              
              const speed = 3 + Math.random() * 3;
              particle.velocity[0] = -particle.position[0] * 0.05 * speed;
              particle.velocity[1] = -particle.position[1] * 0.05 * speed;
              particle.velocity[2] = -particle.position[2] * 0.05 * speed;
              
              particle.lifecycle = 0;
              
              // 重置材质
              if (mesh.material) {
                mesh.material.color.setHex(particle.color);
                mesh.material.emissive.setHex(particle.color);
                mesh.material.emissiveIntensity = 0.3;
                mesh.material.opacity = 0.9;
              }
            }
          }
        } else {
          // 正常粒子行为（原有逻辑）
          // 更新粒子生命周期
          particle.lifecycle += deltaTime;
          
          // 复杂的飞行轨迹算法
          const cycleFactor = particle.lifecycle * 0.5;
          const spiralFactor = Math.sin(cycleFactor * 2) * 3;
          const waveFactor = Math.cos(cycleFactor * 3) * 2;
          
          // 计算新的速度（螺旋飞行效果）
          const centripetal = 0.02;
          const turbulence = 0.5;
          
          // 向心力和湍流效果
          particle.velocity[0] += (-particle.position[0] * centripetal + (Math.sin(time * 5 + index) * turbulence));
          particle.velocity[1] += (-particle.position[1] * centripetal + (Math.cos(time * 3 + index) * turbulence));
          particle.velocity[2] += (-particle.position[2] * centripetal + (Math.sin(time * 4 + index) * turbulence));
          
          // 添加螺旋运动
          const spiralSpeed = 0.3;
          particle.velocity[0] += Math.sin(time * spiralSpeed + index) * 0.5;
          particle.velocity[2] += Math.cos(time * spiralSpeed + index) * 0.5;
          
          // 应用阻尼
          const damping = 0.98;
          particle.velocity[0] *= damping;
          particle.velocity[1] *= damping;
          particle.velocity[2] *= damping;
          
          // 更新位置
          particle.position[0] += particle.velocity[0] * deltaTime * 5;
          particle.position[1] += particle.velocity[1] * deltaTime * 5;
          particle.position[2] += particle.velocity[2] * deltaTime * 5;
          
          // 边界检测和重置
          const maxDistance = 25;
          const distance = Math.sqrt(
            particle.position[0] * particle.position[0] +
            particle.position[1] * particle.position[1] +
            particle.position[2] * particle.position[2]
          );
          
          if (distance > maxDistance || particle.lifecycle > 15) {
            // 重新初始化粒子
            const radius = 20 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particle.position[0] = radius * Math.sin(phi) * Math.cos(theta);
            particle.position[1] = radius * Math.sin(phi) * Math.sin(theta);
            particle.position[2] = radius * Math.cos(phi);
            
            const speed = 3 + Math.random() * 3;
            particle.velocity[0] = -particle.position[0] * 0.05 * speed;
            particle.velocity[1] = -particle.position[1] * 0.05 * speed;
            particle.velocity[2] = -particle.position[2] * 0.05 * speed;
            
            particle.lifecycle = 0;
          }
          
          // 动态缩放效果
          const pulseFactor = 1 + Math.sin(time * 3 + index) * 0.3;
          const velocityScale = Math.min(2, Math.sqrt(
            particle.velocity[0] * particle.velocity[0] +
            particle.velocity[1] * particle.velocity[1] +
            particle.velocity[2] * particle.velocity[2]
          ) * 0.5);
          mesh.scale.setScalar(particle.scale * pulseFactor * (1 + velocityScale));
        }
        
        // 更新mesh位置（所有粒子共同）
        mesh.position.set(particle.position[0], particle.position[1], particle.position[2]);
        
        // 复杂的旋转动画
        const rotSpeed = 1 + Math.sin(time + index) * 0.5;
        mesh.rotation.x = (time * rotSpeed + particle.rotationOffset.x) * DEG2RAD;
        mesh.rotation.y = (time * rotSpeed * 0.7 + particle.rotationOffset.y) * DEG2RAD;
        mesh.rotation.z = (time * rotSpeed * 0.3 + particle.rotationOffset.z) * DEG2RAD;
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
    enableZoom={true} 
    enablePan={false} 
    autoRotate={autoRotate}
    autoRotateSpeed={SCENE_3D_CONFIG.autoRotateSpeed * 0.3}
    minDistance={8}
    maxDistance={30}
  />
</T.PerspectiveCamera>

<!-- 增强光照设置 -->
<T.AmbientLight intensity={0.6} />
<T.DirectionalLight 
  position={[15, 15, 15]} 
  intensity={1.5}
  castShadow={false}
/>
<T.DirectionalLight 
  position={[-15, -10, 10]} 
  intensity={0.8}
  color={0x6464ff}
  castShadow={false}
/>
<T.PointLight 
  position={[0, 0, 0]} 
  intensity={2}
  color={0x64ffda}
  distance={30}
/>

<!-- 粒子系统 -->
<T.Group bind:ref={sceneGroup} class={className}>
  <!-- 星空背景 -->
  <StarField />
  
  <!-- 主要粒子 -->
  {#each particles as particle, index}
    <T.Mesh
      bind:this={particleMeshes[index]}
      position={particle.position}
      scale={particle.scale}
    >
      <!-- 根据索引选择不同的几何体 -->
      {#if particle.geometryType === 0}
        <T.BoxGeometry args={[0.8, 0.8, 0.8]} />
      {:else if particle.geometryType === 1}
        <T.SphereGeometry args={[0.5, 16, 12]} />
      {:else if particle.geometryType === 2}
        <T.TetrahedronGeometry args={[0.7, 0]} />
      {:else}
        <T.OctahedronGeometry args={[0.6, 0]} />
      {/if}
      
      <!-- 增强材质设置 -->
      <T.MeshStandardMaterial
        color={particle.color}
        metalness={0.8}
        roughness={0.2}
        emissive={particle.color}
        emissiveIntensity={0.3}
        transparent={true}
        opacity={0.9}
      />
    </T.Mesh>
  {/each}
  
  <!-- 添加粒子轨迹效果 -->
  <!-- <ParticleTrails /> -->
  
  <!-- 添加爆炸粒子效果 -->
  <!-- <ExplosionParticles /> -->
  
  <!-- 添加流星雨效果 -->
  <!-- <MeteorShower /> -->
  
  <!-- 中心球体 - 简洁版本 -->
  <T.Mesh 
    position={[0, 0, 0]} 
    scale={1 + Math.sin(time) * 0.1}
  >
    <T.SphereGeometry args={[0.5, 32, 32]} />
    <T.MeshStandardMaterial
      color={0x222222}
      metalness={0.9}
      roughness={0.1}
      emissive={0x111111}
      emissiveIntensity={0.3}
      transparent={true}
      opacity={0.8}
    />
  </T.Mesh>
  
  <!-- 黑洞吸积盘 - 只在吸收时显示 -->
  {#if blackHoleAbsorbing}
    <T.Group
      rotation.x={90 * DEG2RAD}
      rotation.z={time * 5}
    >
      <T.Mesh scale={4}>
        <T.RingGeometry args={[0.8, 1.2, 32]} />
        <T.MeshStandardMaterial
          color={0xff4400}
          metalness={0.5}
          roughness={0.3}
          emissive={0xff2200}
          emissiveIntensity={0.8 + Math.sin(time * 15) * 0.4}
          transparent={true}
          opacity={0.6 + Math.sin(time * 8) * 0.3}
          side={2}
        />
      </T.Mesh>
    </T.Group>
    
    <T.Group
      rotation.x={90 * DEG2RAD}
      rotation.z={-time * 3}
    >
      <T.Mesh scale={3}>
        <T.RingGeometry args={[1.2, 1.5, 32]} />
        <T.MeshStandardMaterial
          color={0xffaa00}
          metalness={0.5}
          roughness={0.3}
          emissive={0xff6600}
          emissiveIntensity={0.6 + Math.sin(time * 12) * 0.3}
          transparent={true}
          opacity={0.4 + Math.sin(time * 6) * 0.2}
          side={2}
        />
      </T.Mesh>
    </T.Group>
  {/if}
  
  <!-- 简化的旋转能量环 -->
  <T.Group rotation.x={90 * DEG2RAD}>
    <T.Mesh scale={6}>
      <T.RingGeometry args={[1.5, 1.8, 32]} />
      <T.MeshStandardMaterial
        color={0x333333}
        metalness={0.8}
        roughness={0.2}
        emissive={0x111111}
        emissiveIntensity={0.2}
        transparent={true}
        opacity={0.4}
        side={2}
      />
    </T.Mesh>
  </T.Group>
</T.Group>
