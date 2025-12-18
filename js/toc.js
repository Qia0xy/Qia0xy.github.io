/**
 * 文章目录核心功能：
 * 1. 目录点击平滑跳转至对应标题
 * 2. 滚动页面自动高亮当前章节
 * 3. 兼容所有层级标题（h2/h3/h4）
 * 4. 修复跳转偏移/激活态失效问题
 */
document.addEventListener('DOMContentLoaded', function() {
    // ========== 核心配置 ==========
    const config = {
        tocSelector: '#toc',          // 目录容器
        navSelector: '.toc-nav',      // 目录导航容器
        linkSelector: 'a',            // 目录链接
        contentSelector: '.p-content',// 文章内容容器
        activeClass: 'toc-active',    // 激活态类名
        offsetTop: 80,                // 跳转偏移（适配顶部导航）
        scrollOffset: 90              // 滚动检测偏移
    };

    // ========== 初始化检查 ==========
    const toc = document.querySelector(config.tocSelector);
    const tocNav = toc ? toc.querySelector(config.navSelector) : null;
    const content = document.querySelector(config.contentSelector);
    
    // 无目录/无文章内容时直接退出
    if (!toc || !tocNav || !content) return;

    // ========== 获取元素 ==========
    // 目录链接列表
    const tocLinks = Array.from(tocNav.querySelectorAll(config.linkSelector));
    // 文章内标题列表（h2/h3/h4）
    const headings = Array.from(content.querySelectorAll('h2, h3, h4'));

    // 无标题/无目录链接时退出
    if (tocLinks.length === 0 || headings.length === 0) return;

    // ========== 1. 修复目录点击跳转 ==========
    function bindTocClick() {
        tocLinks.forEach(link => {
            // 只处理锚点链接
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', function(e) {
                    // 阻止默认跳转（避免锚点闪烁）
                    e.preventDefault();
                    
                    // 获取目标标题ID（去掉#号）
                    const targetId = this.getAttribute('href').replace('#', '');
                    const targetHeading = document.getElementById(targetId);
                    
                    if (targetHeading) {
                        // 平滑滚动到目标位置（偏移适配顶部导航）
                        window.scrollTo({
                            top: targetHeading.offsetTop - config.offsetTop,
                            behavior: 'smooth' // 平滑滚动
                        });
                    }
                });
            }
        });
    }

    // ========== 2. 修复滚动激活态高亮 ==========
    function updateActiveToc() {
        // 当前滚动位置（加偏移，提前激活下一个标题）
        const scrollPosition = window.scrollY + config.scrollOffset;
        let activeHeadingId = '';

        // 遍历标题，找到当前视口内的标题
        headings.forEach(heading => {
            const headingTop = heading.offsetTop;
            // 标题顶部进入视口时，标记为当前激活标题
            if (headingTop <= scrollPosition) {
                activeHeadingId = heading.getAttribute('id');
            }
        });

        // 移除所有激活态，给当前标题添加激活态
        tocLinks.forEach(link => {
            link.classList.remove(config.activeClass);
            // 匹配当前激活标题的目录链接
            if (link.getAttribute('href') === `#${activeHeadingId}`) {
                link.classList.add(config.activeClass);
            }
        });
    }

    // ========== 3. 防抖优化（避免滚动频繁触发） ==========
    function debounce(func, delay = 50) {
        let timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, arguments);
            }, delay);
        };
    }

    // ========== 初始化所有功能 ==========
    // 绑定点击跳转
    bindTocClick();
    // 初始化激活态
    updateActiveToc();
    // 绑定滚动事件（防抖优化）
    window.addEventListener('scroll', debounce(updateActiveToc));

    // ========== 额外兼容：窗口大小变化重新计算 ==========
    window.addEventListener('resize', debounce(updateActiveToc));

    // ========== 调试信息（可选，可删除） ==========
    console.log(`[TOC] 初始化完成 - 目录链接数: ${tocLinks.length}, 标题数: ${headings.length}`);
});