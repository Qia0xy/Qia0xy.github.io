/**
 * 目录核心功能（最终版）：
 * 1. 强制固定目录位置（fixed），动态计算左/上偏移
 * 2. 顶部在搜索框下方，滚动后固定在页面上方
 * 3. 自动补全标题ID，确保跳转生效
 * 4. 滚动时高亮页面最顶部的内容目录
 * 5. 点击目录平滑跳转+目录自滚动
 */
document.addEventListener('DOMContentLoaded', function() {
  // ===================== 1. 动态计算目录位置（核心修复） =====================
  function adjustTocPosition() {
    const tocEl = document.querySelector('.toc-wrap');
    if (!tocEl) return;

    // ① 动态计算左侧位置（贴合文章框，适配左侧栏）
    const sidebarEl = document.querySelector('.sidebar'); // 替换为你的左侧栏选择器（如.sidebar/.left-col等）
    if (sidebarEl) {
      const sidebarRect = sidebarEl.getBoundingClientRect();
      document.documentElement.style.setProperty('--toc-left', `${sidebarRect.left}px`);
    }

    // ② 动态计算top值（顶部在搜索下，滚动后固定）
    const searchEl = document.querySelector('.search'); // 替换为你的搜索框选择器
    if (searchEl) {
      const searchRect = searchEl.getBoundingClientRect();
      const searchHeight = searchRect.height;
      // 页面顶部时：目录在搜索框下方；滚动后：固定在顶部20px
      if (window.scrollY < searchRect.bottom + 20) {
        tocEl.style.top = `${searchRect.bottom + 10}px`; // 搜索框下方10px
      } else {
        tocEl.style.top = '20px'; // 固定在顶部20px
      }
    }
  }

  // ===================== 2. 跳转+高亮核心逻辑 =====================
  const tocLinks = document.querySelectorAll('#custom-toc a');
  const headings = document.querySelectorAll('.p-content h2, .p-content h3, .p-content h4');
  const tocContainer = document.getElementById('custom-toc');

  // 给无ID标题补全ID（解决跳转失效）
  headings.forEach((heading, index) => {
    if (!heading.id) {
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

  // 高亮页面最顶部的内容目录
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

  // 目录点击：平滑跳转到对应标题
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

  // ===================== 3. 绑定事件（确保滚动/缩放都生效） =====================
  window.addEventListener('scroll', adjustTocPosition); // 滚动时调整位置
  window.addEventListener('resize', adjustTocPosition); // 窗口缩放时调整位置
  window.addEventListener('scroll', highlightTopHeading); // 滚动时高亮目录
  // 初始化：页面加载立即计算位置+高亮
  adjustTocPosition();
  highlightTopHeading();
});