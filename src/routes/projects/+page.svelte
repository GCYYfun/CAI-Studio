<script>
  import { onMount } from 'svelte';
  
  let isVisible = [];
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible[parseInt(entry.target.dataset.index)] = true;
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.project-card').forEach((el, index) => {
      el.dataset.index = index;
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>项目 | CAI Game Studio</title>
  <meta name="description" content="CAI Game Studio的游戏项目展示" />
</svelte:head>

<section class="projects-hero">
  <div class="container">
    <h1>我们的项目</h1>
    <p>探索CAI Game Studio打造的创新游戏世界</p>
  </div>
</section>

<section class="projects-grid">
  <div class="container">
    {#each Array(6) as _, i}
      <div class="project-card" class:visible={isVisible[i]}>
        <div class="project-image" style="background-image: url('/images/project{(i % 3) + 1}.jpg')"></div>
        <div class="project-content">
          <h2>项目名称 {i + 1}</h2>
          <p>这是项目{i + 1}的简短描述，介绍游戏的核心玩法和亮点特色。</p>
          <div class="project-tags">
            <span>类型标签</span>
            <span>平台</span>
            <span>技术</span>
          </div>
          <a href={`/projects/project-${i + 1}`} class="button">了解更多</a>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .projects-hero {
    height: 50vh;
    background: linear-gradient(to bottom, rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.95)),
                url('/images/project1.jpg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 60px; /* 导航栏高度 */
  }
  
  .projects-hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
  
  .projects-hero p {
    font-size: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.8;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .projects-grid {
    padding: 5rem 0;
    background: var(--secondary-background);
  }
  
  .projects-grid .container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 3rem;
  }
  
  .project-card {
    background: rgba(16, 33, 65, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .project-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .project-image {
    height: 200px;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease;
  }
  
  .project-card:hover .project-image {
    transform: scale(1.05);
  }
  
  .project-content {
    padding: 1.5rem;
  }
  
  .project-content h2 {
    margin-bottom: 0.5rem;
    color: var(--accent-color);
  }
  
  .project-content p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }
  
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .project-tags span {
    background: rgba(100, 255, 218, 0.2);
    color: var(--accent-color);
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.85rem;
  }
  
  .button {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: var(--accent-color);
    color: var(--background-color);
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
</style>
