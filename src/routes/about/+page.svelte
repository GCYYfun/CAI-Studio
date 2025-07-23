<script>
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { ROUTES } from '$lib/utils/constants';
  
  let isVisible = {
    story: false,
    purpose: false,
    contact: false
  };
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && sectionId in isVisible) {
            isVisible[sectionId] = true;
          }
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>关于我们 | CAI Game Studio</title>
  <meta name="description" content="了解CAI Game Studio的团队背景和游戏开发理念" />
</svelte:head>

<section class="about-hero">
  <div class="container">
    <h1>关于 CAI Game Studio</h1>
    <p>用创新技术打造独特游戏体验</p>
  </div>
</section>

<section class="section" id="story" class:visible={isVisible.story}>
  <div class="container">
    <h2>我们的团队</h2>
    <div class="story-content">
      <div class="story-text">
        <p>CAI Game Studio 是一支年轻而充满激情的独立游戏开发团队。我们的成员来自不同的技术背景，包括前端开发、游戏引擎、3D建模和用户体验设计等领域。</p>
        
        <p>虽然我们每个人的专业方向不同，但我们都有一个共同的信念：游戏不仅仅是娱乐产品，更是一种能够传达情感、启发思考和连接人心的艺术形式。</p>
        
        <p>我们相信技术与创意的结合能够创造出令人难忘的互动体验，让玩家在虚拟世界中感受到真实的情感共鸣。</p>
      </div>
    </div>
  </div>
</section>

<section class="section purpose-section" id="purpose" class:visible={isVisible.purpose}>
  <div class="container">
    <h2>我们的目标</h2>
    <div class="purpose-grid">
      <div class="purpose-card">
        <div class="purpose-icon">🎮</div>
        <h3>探索新的游戏体验</h3>
        <p>我们致力于探索游戏设计的边界，创造前所未有的交互方式和沉浸式体验。</p>
      </div>
      
      <div class="purpose-card">
        <div class="purpose-icon">🚀</div>
        <h3>推动技术创新</h3>
        <p>运用最新的技术栈和开发工具，将创意想法转化为现实，推动游戏行业的技术进步。</p>
      </div>
      
      <div class="purpose-card">
        <div class="purpose-icon">🤝</div>
        <h3>连接全球玩家</h3>
        <p>打造能够跨越文化和语言障碍的游戏，让全世界的玩家都能享受到优质的游戏体验。</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="contact" class:visible={isVisible.contact}>
  <div class="container">
    <div class="contact-content">
      <h2>欢迎交流</h2>
      <p>我们热忱欢迎对游戏开发、技术创新或合作机会感兴趣的朋友与我们交流。无论您是:</p>
      
      <ul class="welcome-list">
        <li>对我们的项目感兴趣的玩家</li>
        <li>希望探讨技术问题的开发者</li>
        <li>寻求合作机会的伙伴</li>
        <li>想要了解游戏开发的学习者</li>
      </ul>
      
      <p>我们都非常期待与您的交流。让我们一起探索游戏世界的无限可能！</p>
      
      <div class="contact-actions">
        <Button
          text="查看项目"
          variant="primary"
          size="large"
          href={ROUTES.PROJECTS}
        />
        <a href="mailto:info@caistudio.com" class="contact-email">
          📧 info@caistudio.com
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .about-hero {
    height: 50vh;
    background: linear-gradient(to bottom, rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.95)),
                url('/images/placeholder.svg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 60px; /* 导航栏高度 */
  }
  
  .about-hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
  
  .about-hero p {
    font-size: 1.5rem;
    opacity: 0.8;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section {
    padding: 5rem 0;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .section.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--accent-color);
  }
  
  .story-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .story-text {
    text-align: center;
  }
  
  .story-text p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }
  
  .purpose-section {
    background: linear-gradient(to bottom, #112240, #0a192f);
  }
  
  .purpose-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .purpose-card {
    background: rgba(16, 33, 65, 0.8);
    padding: 2.5rem 2rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(100, 255, 218, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .purpose-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .purpose-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  
  .purpose-card h3 {
    color: var(--accent-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .purpose-card p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .contact-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .contact-content p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
  
  .welcome-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    text-align: left;
  }
  
  .welcome-list li {
    background: rgba(100, 255, 218, 0.1);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    border-left: 3px solid var(--accent-color);
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .contact-actions {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-top: 3rem;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .contact-email {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: rgba(100, 255, 218, 0.1);
    color: var(--accent-color);
    text-decoration: none;
    border-radius: 6px;
    border: 2px solid rgba(100, 255, 218, 0.3);
    font-weight: 600;
    font-size: 1.125rem;
    transition: all 0.3s ease;
  }
  
  .contact-email:hover {
    background: rgba(100, 255, 218, 0.2);
    border-color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(100, 255, 218, 0.3);
  }
  
  @media (max-width: 768px) {
    .about-hero h1 {
      font-size: 2.5rem;
    }
    
    .about-hero p {
      font-size: 1.25rem;
    }
    
    .purpose-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .welcome-list {
      grid-template-columns: 1fr;
      text-align: center;
    }
    
    .contact-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .contact-actions :global(.btn) {
      width: 100%;
      max-width: 300px;
    }
    
    .contact-email {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 0 1rem;
    }
    
    .section {
      padding: 3rem 0;
    }
    
    .purpose-card {
      padding: 2rem 1.5rem;
    }
  }
</style>
