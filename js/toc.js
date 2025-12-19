document.addEventListener('DOMContentLoaded', function() {
  // ===================== 核心：分状态固定目录 =====================
  const tocEl = document.querySelector('.toc-wrap');
  const searchEl = document.querySelector('.search'); // 替换为你的搜索框选择器
  if (tocEl && searchEl) {
    // 1. 获取搜索框高度，设置初始top值（目录在搜索框下方）
    const searchHeight = searchEl.offsetHeight;
    document.documentElement.style.setProperty('--search-height', `${searchHeight}px`);
    
    // 2. 滚动监听：超过搜索框则固定，否则回到搜索下方
    function toggleTocFixed() {
      const searchBottom = searchEl.getBoundingClientRect().bottom;
      if (searchBottom < 20) { // 搜索框滚出视野
        tocEl.classList.add('fixed'); // 强制fixed固定
      } else { // 还在页面顶部，搜索框可见
        tocEl.classList.remove('fixed'); // 回到sticky，在搜索下方
      }
    }

    // 绑定滚动事件
    window.addEventListener('scroll', toggleTocFixed);
    toggleTocFixed(); // 初始化
  }

  // ===================== 保留跳转+高亮功能 =====================
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 补全标题ID
  headings.forEach((heading, index) => {
    if (!heading.id) {
      const cleanText = heading.textContent.trim().replace(/[\s|~|!|@|#|$|%|^|&|*]/g, '-').toLowerCase();
      heading.id = cleanText ? cleanText : `toc-heading-${index}`;
    }
    const headingText = heading.textContent.trim();
    tocLinks.forEach(link => {
      if (link.textContent.trim() === headingText) {
        link.setAttribute('href', `#${heading.id}`);
      }
    });
  });

  // 高亮当前目录
  function highlightTopHeading() {
    const viewportTop = window.scrollY + 80;
    let currentTopHeading = null;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].offsetTop <= viewportTop) {
        currentTopHeading = headings[i];
      } else break;
    }
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    if (currentTopHeading) {
      const activeLink = Array.from(tocLinks).find(link => link.href.includes(currentTopHeading.id));
      if (activeLink) {
        activeLink.classList.add('toc-active');
        tocContainer.scrollTop = activeLink.offsetTop - 20;
      }
    }
  }

  // 点击跳转
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.href.replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({top: target.offsetTop - 80, behavior: 'smooth'});
      }
    });
  });

  // 绑定高亮事件
  window.addEventListener('scroll', highlightTopHeading);
  highlightTopHeading();
});