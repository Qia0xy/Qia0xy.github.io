/**
 * 目录核心功能：跳转+滚动高亮+目录自滚动
 */
document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取核心元素
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 2. 初始化：给无ID标题补全ID（解决跳转失效）
  headings.forEach((heading, index) => {
    if (!heading.id) {
      // 生成唯一ID（基于标题文本，避免重复）
      const cleanText = heading.textContent.trim().replace(/[\s|~|!|@|#|$|%|^|&|*]/g, '-').toLowerCase();
      heading.id = cleanText ? cleanText : `toc-heading-${index}`;
    }
    // 同步目录链接的href（匹配标题ID）
    const headingText = heading.textContent.trim();
    tocLinks.forEach(link => {
      if (link.textContent.trim() === headingText) {
        link.setAttribute('href', `#${heading.id}`);
      }
    });
  });

  // 3. 核心：高亮页面最顶部的内容目录
  function highlightTopHeading() {
    const viewportTop = window.scrollY + 80; // 适配顶部导航偏移
    let currentTopHeading = null;

    // 遍历标题，找到视口最顶部的那个
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (heading.offsetTop <= viewportTop) {
        currentTopHeading = heading;
      } else {
        break; // 找到第一个超出视口的标题，停止遍历
      }
    }

    // 移除所有高亮，给当前标题对应目录加高亮
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    if (currentTopHeading) {
      const activeLink = Array.from(tocLinks).find(link => {
        return link.getAttribute('href') === `#${currentTopHeading.id}`;
      });
      if (activeLink) {
        activeLink.classList.add('toc-active');
        // 目录自动滚动到高亮项（避免高亮项在目录外）
        tocContainer.scrollTop = activeLink.offsetTop - 20;
      }
    }
  }

  // 4. 目录点击：平滑跳转到对应标题
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // 阻止默认锚点跳转
      const targetId = this.getAttribute('href').replace('#', '');
      const targetHeading = document.getElementById(targetId);
      if (targetHeading) {
        // 平滑滚动+偏移适配
        window.scrollTo({
          top: targetHeading.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. 绑定事件
  window.addEventListener('scroll', highlightTopHeading); // 滚动时高亮
  highlightTopHeading(); // 初始化：页面加载就高亮
});