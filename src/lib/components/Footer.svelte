<script>
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <div class="container">
    <div class="footer-content">
      <div class="footer-logo">
        <strong>CAI Game Studio</strong>
        <p>打造前沿的游戏体验</p>
      </div>
      
      <div class="footer-links">
        <div class="link-group">
          <h4>关注我们</h4>
          <div class="social-links">
            <a href="#" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© {currentYear} CAI Game Studio. 保留所有权利。</p>
    </div>
  </div>
</footer>

<style>
  footer {
    background: #0a192f;
    color: white;
    padding: 4rem 0 1rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 3rem;
  }
  
  .footer-logo {
    flex: 1;
    min-width: 200px;
    margin-bottom: 2rem;
  }
  
  .footer-logo strong {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .footer-logo p {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .footer-links {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .link-group {
    margin-bottom: 1.5rem;
    min-width: 150px;
  }
  
  .link-group h4 {
    color: #64ffda;
    margin-bottom: 1rem;
  }
  
  .link-group ul {
    list-style: none;
    padding: 0;
  }
  
  .link-group li {
    margin-bottom: 0.5rem;
  }
  
  .link-group a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .link-group a:hover {
    color: #64ffda;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-bottom p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
</style>
