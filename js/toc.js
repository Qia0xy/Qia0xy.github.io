// 页面完全加载后执行，确保元素渲染完成
window.onload = function() {
  // 1. 获取文章标题和自定义目录链接
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocLinks = document.querySelectorAll('#custom-toc a');

  // 容错处理：无标题或无目录时不执行后续逻辑
  if (!headings.length || !tocLinks.length) {
    console.log('无文章标题或目录链接，跳过目录初始化');
    return;
  }

  // 2. 给每个文章标题添加唯一ID，用于跳转定位
  headings.forEach((heading, index) => {
    heading.id = 'toc-heading-' + index;
    console.log('给标题添加ID：', 'toc-heading-' + index);
  });

  // 3. 给每个目录链接绑定跳转事件（平滑滚动）
  tocLinks.forEach((link, index) => {
    // 绑定对应标题的ID
    link.setAttribute('href', '#toc-heading-' + index);

    // 点击事件：阻止默认锚点行为，实现平滑滚动
    link.onclick = function(e) {
      e.preventDefault();
      const targetHeading = document.getElementById('toc-heading-' + index);
      if (targetHeading) {
        // 平滑滚动到目标标题，偏移80px避开头部遮挡
        targetHeading.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        window.scrollBy(0, -80);
      }
    };
  });

  // 4. 滚动监听：自动高亮当前视口对应的目录项
  function highlightCurrentToc() {
    const scrollTop = window.scrollY;
    let currentActiveIndex = 0;

    // 遍历标题，找到当前视口最上方的标题
    headings.forEach((heading, index) => {
      if (heading.offsetTop - 100 <= scrollTop) {
        currentActiveIndex = index;
      }
    });

    // 移除所有目录项的高亮，给当前标题对应目录添加高亮
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    if (tocLinks[currentActiveIndex]) {
      tocLinks[currentActiveIndex].classList.add('toc-active');
      // 目录自动滚动到高亮项，避免高亮项超出视野
      const tocContainer = document.getElementById('custom-toc');
      tocContainer.scrollTop = tocLinks[currentActiveIndex].offsetTop - 20;
    }
  }

  // 绑定滚动事件
  window.onscroll = highlightCurrentToc;
  // 页面加载完成后初始化高亮第一个目录项
  highlightCurrentToc();
  if (tocLinks[0]) {
    tocLinks[0].classList.add('toc-active');
  }
};