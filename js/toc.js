document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取核心元素
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 2. 补全标题ID（解决跳转失效）
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

  // 3. 滚动高亮当前目录
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

  // 4. 点击目录平滑跳转
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
  highlightTopHeading(); // 初始化高亮
});