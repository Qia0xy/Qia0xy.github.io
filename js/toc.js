// 页面加载完成后执行
window.onload = function() {
  // 1. 给标题添加唯一ID
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  headings.forEach((heading, index) => {
    heading.id = 'toc-heading-' + index;
  });

  // 2. 目录链接绑定跳转
  const tocLinks = document.querySelectorAll('#custom-toc a');
  tocLinks.forEach((link, index) => {
    link.href = '#toc-heading-' + index;
    link.onclick = function(e) {
      e.preventDefault();
      const target = document.getElementById('toc-heading-' + index);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    };
  });

  // 3. 滚动高亮
  window.onscroll = function() {
    const scrollTop = window.scrollY;
    headings.forEach((heading, index) => {
      if (heading.offsetTop - 100 <= scrollTop) {
        tocLinks.forEach(link => link.classList.remove('toc-active'));
        if (tocLinks[index]) tocLinks[index].classList.add('toc-active');
      }
    });
  };

  // 初始化高亮第一个目录项
  if (tocLinks[0]) tocLinks[0].classList.add('toc-active');
};