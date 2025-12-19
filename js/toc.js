document.addEventListener('DOMContentLoaded', function() {
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 1. 初始化：所有目录链接默认非激活
  tocLinks.forEach(link => link.classList.remove('toc-active'));

  // 2. 滚动时高亮当前章节
  window.addEventListener('scroll', function() {
    const scrollPos = window.scrollY + 80; // 适配顶部偏移
    let activeHeading = null;

    // 找到当前可视区域的第一个标题
    headings.forEach(heading => {
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
      }
    });

    // 高亮对应目录链接
    if (activeHeading) {
      const activeId = activeHeading.id;
      tocLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('toc-active');
          // 目录滚动到当前高亮项
          tocContainer.scrollTop = link.offsetTop - 20;
        } else {
          link.classList.remove('toc-active');
        }
      });
    }
  });

  // 3. 目录点击跳转
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 初始化触发一次滚动，高亮初始位置
  window.dispatchEvent(new Event('scroll'));
});