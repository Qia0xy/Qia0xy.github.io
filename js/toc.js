// 页面加载完成后执行，跳过所有模板冲突
window.onload = function() {
  // 1. 给所有标题强制添加唯一ID
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  headings.forEach((heading, index) => {
    heading.id = 'toc-heading-' + index;
  });

  // 2. 给目录链接绑定跳转事件
  const tocLinks = document.querySelectorAll('#custom-toc a');
  tocLinks.forEach((link, index) => {
    // 绑定对应标题的ID
    link.href = '#toc-heading-' + index;
    // 手动绑定点击跳转
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

  // 3. 滚动时强制高亮对应目录
  window.onscroll = function() {
    const scrollTop = window.scrollY;
    headings.forEach((heading, index) => {
      if (heading.offsetTop - 100 <= scrollTop) {
        // 移除所有高亮
        tocLinks.forEach(link => link.classList.remove('toc-active'));
        // 给当前标题对应的目录加高亮
        if (tocLinks[index]) tocLinks[index].classList.add('toc-active');
      }
    });
  };

  // 初始化：高亮第一个目录项
  if (tocLinks[0]) tocLinks[0].classList.add('toc-active');
};