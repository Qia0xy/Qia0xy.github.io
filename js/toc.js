document.addEventListener('DOMContentLoaded', function() {
  // 1. 强制获取元素（避免选择器失效）
  const tocLinks = document.querySelectorAll('.toc-wrap a'); // 更通用的选择器
  const headings = document.querySelectorAll('h2, h3, h4'); // 匹配所有标题
  const tocContainer = document.querySelector('.toc-wrap');

  // 2. 给标题强制添加ID（确保跳转可用）
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`; // 强制生成唯一ID
    }
    // 给目录链接绑定对应标题ID
    const headingText = heading.textContent.trim();
    tocLinks.forEach(link => {
      if (link.textContent.trim() === headingText) {
        link.href = `#${heading.id}`;
      }
    });
  });

  // 3. 滚动高亮（强制触发）
  function highlightTopHeading() {
    const viewportTop = window.scrollY + 50; // 调整偏移适配你的页面
    let currentHeading = null;
    // 从下往上找，确保匹配当前视口的标题
    for (let i = headings.length - 1; i >= 0; i--) {
      if (headings[i].offsetTop <= viewportTop) {
        currentHeading = headings[i];
        break;
      }
    }
    // 移除所有高亮，添加当前标题的高亮
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    if (currentHeading) {
      const activeLink = Array.from(tocLinks).find(link => 
        link.href.includes(currentHeading.id)
      );
      if (activeLink) {
        activeLink.classList.add('toc-active');
        // 目录跟随滚动
        tocContainer.scrollTop = activeLink.offsetTop - 20;
      }
    }
  }

  // 4. 点击跳转（强制阻止默认行为）
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.href.split('#')[1];
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 50, // 调整偏移适配你的页面
          behavior: 'smooth'
        });
      }
    });
  });

  // 强制绑定事件（确保触发）
  window.addEventListener('scroll', highlightTopHeading);
  // 页面加载后立即触发高亮
  setTimeout(highlightTopHeading, 100);
});