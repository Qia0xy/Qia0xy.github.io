/**
 * 文章目录（TOC）核心功能
 * 包含：目录高亮、滚动定位、移动端目录切换
 */
document.addEventListener('DOMContentLoaded', function() {
  // ===================== 基础配置 =====================
  const tocConfig = {
    tocSelector: '#toc',          // 目录容器
    linkSelector: '#toc a',       // 目录链接
    activeClass: 'toc-active',    // 激活状态类名
    offsetTop: 80,                // 锚点偏移（适配顶部导航）
    mobileBreakpoint: 768         // 移动端断点
  };

  // ===================== 桌面端：目录高亮 + 滚动定位 =====================
  function initDesktopToc() {
    const tocLinks = document.querySelectorAll(tocConfig.linkSelector);
    const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
    
    // 无目录/无标题时直接返回
    if (!tocLinks.length || !headings.length) return;

    // 1. 目录链接点击事件（平滑滚动）
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // 平滑滚动到目标位置（偏移适配）
          window.scrollTo({
            top: targetElement.offsetTop - tocConfig.offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // 2. 滚动时高亮当前目录
    function highlightCurrentToc() {
      let currentId = '';
      
      // 遍历标题，判断当前视口内的标题
      headings.forEach(heading => {
        const headingTop = heading.offsetTop - tocConfig.offsetTop - 20;
        if (window.scrollY >= headingTop) {
          currentId = heading.getAttribute('id');
        }
      });

      // 移除所有激活状态，给当前标题对应目录添加激活态
      tocLinks.forEach(link => {
        link.classList.remove(tocConfig.activeClass);
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add(tocConfig.activeClass);
        }
      });
    }

    // 滚动事件监听（节流优化）
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(highlightCurrentToc, 50);
    });

    // 初始化高亮
    highlightCurrentToc();
  }

  // ===================== 移动端：目录切换 + 交互 =====================
  function initMobileToc() {
    const toggleBtn = document.querySelector('.toc-toggle');
    const toc = document.querySelector(tocConfig.tocSelector);
    const overlay = document.querySelector('.toc-overlay');
    
    // 无移动端元素时返回
    if (!toggleBtn || !toc || !overlay) return;

    // 1. 切换目录显示/隐藏
    function toggleToc() {
      toc.classList.toggle('toc-visible');
      overlay.classList.toggle('visible');
      // 显示目录时禁止页面滚动，隐藏时恢复
      document.body.style.overflow = toc.classList.contains('toc-visible') ? 'hidden' : '';
    }

    // 2. 绑定点击事件
    toggleBtn.addEventListener('click', toggleToc);
    overlay.addEventListener('click', toggleToc);

    // 3. 点击目录项后自动隐藏目录（移动端）
    const tocLinks = document.querySelectorAll(tocConfig.linkSelector);
    tocLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= tocConfig.mobileBreakpoint) {
          toggleToc();
        }
      });
    });

    // 4. 窗口大小变化时适配
    window.addEventListener('resize', function() {
      if (window.innerWidth > tocConfig.mobileBreakpoint) {
        toc.classList.remove('toc-visible');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }

  // ===================== 初始化所有功能 =====================
  // 桌面端目录高亮
  initDesktopToc();
  
  // 移动端目录切换（仅移动端生效）
  if (window.innerWidth <= tocConfig.mobileBreakpoint) {
    initMobileToc();
  } else {
    // 桌面端强制显示目录
    const toc = document.querySelector(tocConfig.tocSelector);
    if (toc) toc.style.right = 'auto';
  }
});