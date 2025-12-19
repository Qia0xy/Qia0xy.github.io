document.addEventListener('DOMContentLoaded', function() {
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 1. 给标题自动补全ID（确保跳转生效）
  headings.forEach((heading, idx) => {
    if (!heading.id) {
      heading.id = `toc-heading-${idx}`;
    }
    // 同步目录链接的href
    const headingText = heading.textContent.trim();
    tocLinks.forEach(link => {
      if (link.textContent.trim() === headingText) {
        link.href = `#${heading.id}`;
      }
    });
  });

  // 2. 高亮页面顶部的内容目录
  function highlightTopHeading() {
    const viewportTop = window.scrollY + 80;
    let topHeading = null;

    // 找到视口内最顶部的标题
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].offsetTop <= viewportTop) {
        topHeading = headings[i];
      } else {
        break;
      }
    }

    // 高亮对应目录
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    if (topHeading) {
      const activeLink = Array.from(tocLinks).find(link => link.href.includes(topHeading.id));
      if (activeLink) {
        activeLink.classList.add('toc-active');
        // 目录滚动到高亮项
        tocContainer.scrollTop = activeLink.offsetTop - 20;
      }
    }
  }

  // 3. 目录点击跳转（平滑滚动）
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.href.split('#')[1];
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 绑定事件
  window.addEventListener('scroll', highlightTopHeading);
  // 初始化高亮
  highlightTopHeading();
});