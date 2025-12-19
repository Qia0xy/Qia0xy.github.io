document.addEventListener('DOMContentLoaded', function() {
  // 1. 初始化元素
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 2. 给无ID的标题自动生成ID（确保跳转生效）
  headings.forEach((heading, index) => {
    if (!heading.id) {
      // 生成唯一ID（基于标题文本）
      const cleanText = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
      heading.id = cleanText || `heading-${index}`;
    }
    // 同步更新目录链接的href
    const headingText = heading.textContent.trim();
    tocLinks.forEach(link => {
      if (link.textContent.trim() === headingText) {
        link.href = `#${heading.id}`;
      }
    });
  });

  // 3. 滚动时高亮页面最顶部的内容目录
  function highlightCurrentHeading() {
    const viewportTop = window.scrollY + 80; // 顶部偏移
    let currentHeading = null;

    // 找到视口最顶部的第一个标题
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (heading.offsetTop <= viewportTop) {
        currentHeading = heading;
      } else {
        break; // 找到第一个超过视口的标题，停止循环
      }
    }

    // 高亮对应目录
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    if (currentHeading) {
      const activeLink = Array.from(tocLinks).find(link => link.href.includes(currentHeading.id));
      if (activeLink) {
        activeLink.classList.add('toc-active');
        // 目录滚动到高亮项（可选）
        tocContainer.scrollTop = activeLink.offsetTop - 20;
      }
    }
  }

  // 4. 目录点击跳转（平滑滚动）
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

  // 5. 绑定事件
  window.addEventListener('scroll', highlightCurrentHeading);
  // 初始化高亮
  highlightCurrentHeading();
});