<script>
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<header>
  <div class="container">
    <div class="logo">
      <a href="/">
        <strong>CAI Game Studio</strong>
      </a>
    </div>
    
    <button class="menu-button" on:click={toggleMenu} aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    
    <nav class:open={isMenuOpen}>
      <ul>
        <li><a href="/" on:click={closeMenu}>首页</a></li>
        <li><a href="/projects" on:click={closeMenu}>项目</a></li>
        <li><a href="/about" on:click={closeMenu}>关于</a></li>
        <li><a href="/contact" on:click={closeMenu}>联系</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .logo a {
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
  }
  
  nav ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  nav a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }
  
  nav a:hover {
    color: #64ffda;
  }
  
  .menu-button {
    display: none;
  }
  
  @media (max-width: 768px) {
    .menu-button {
      display: block;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }
    
    .menu-button span {
      display: block;
      width: 25px;
      height: 3px;
      margin: 5px 0;
      background: white;
      transition: 0.3s;
    }
    
    nav {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.9);
      clip-path: circle(0% at top right);
      transition: clip-path 0.5s ease-in-out;
    }
    
    nav.open {
      clip-path: circle(150% at top right);
    }
    
    nav ul {
      flex-direction: column;
      padding: 2rem;
      gap: 1rem;
    }
  }
</style>
