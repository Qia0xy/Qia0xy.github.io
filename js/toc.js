// 等待页面完全加载
window.onload = function() {
  // 强制刷新目录渲染
  setTimeout(() => {
    const tocLinks = document.querySelectorAll('#custom-toc a');
    const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
    const offsetTop = 70;

    // 1. 强制给标题加ID（避免Hexo渲染遗漏）
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = 'toc-heading-' + index;
      }
      // 同步更新目录链接的href
      const headingText = heading.textContent.trim();
      tocLinks.forEach(link => {
        if (link.textContent.trim() === headingText) {
          link.href = '#' + heading.id;
        }
      });
    });

    // 2. 强制绑定点击跳转
    tocLinks.forEach(link => {
      link.onclick = function(e) {
        e.preventDefault();
        const targetId = this.href.split('#')[1];
        const target = document.getElementById(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - offsetTop,
            behavior: 'smooth'
          });
        }
      };
    });

    // 3. 强制绑定滚动激活
    window.onscroll = function() {
      const scrollPos = window.scrollY + offsetTop + 10;
      let activeId = '';

      headings.forEach(heading => {
        if (heading.offsetTop <= scrollPos) {
          activeId = heading.id;
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('toc-active');
        if (link.href.includes(activeId)) {
          link.classList.add('toc-active');
        }
      });
    };

    // 初始化激活第一个目录
    if (tocLinks.length > 0) {
      tocLinks[0].classList.add('toc-active');
    }
  }, 500);
};