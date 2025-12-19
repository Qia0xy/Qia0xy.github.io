document.addEventListener('DOMContentLoaded', function() {
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const offsetTop = 80; // 适配顶部导航偏移

  // 目录点击跳转
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // 滚动激活当前目录
  function updateActiveToc() {
    const scrollPos = window.scrollY + offsetTop + 20;
    let activeId = '';

    headings.forEach(heading => {
      if (heading.offsetTop <= scrollPos) {
        activeId = heading.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('toc-active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('toc-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveToc);
  updateActiveToc(); // 初始化激活
});