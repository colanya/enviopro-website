// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言选择器
    initLanguageSelector();
    
    // 初始化页面切换动画 (只绑定链接点击事件)
    initPageTransitions();
});

// 页面加载或从缓存恢复时执行淡入
window.addEventListener('pageshow', function(event) {
    const mainContent = document.querySelector('.page-content');
    if (mainContent) {
        // 无论是否从 BFcache 加载，都确保初始状态透明，然后淡入
        // 对于 BFcache 恢复，这可以覆盖掉可能残留的 opacity: 0 状态
        mainContent.style.opacity = '0';
        fadeIn(mainContent, 500);
    } else {
        console.warn('Page content area (.page-content) not found for initial fade-in.');
    }

    // 如果页面是从 BFcache 加载的，可以进行日志记录或其他操作
    // if (event.persisted) {
    //     console.log("Page loaded from BFcache");
    // }
});

// 语言选择器功能
function initLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            // 这里可以添加语言切换的逻辑
            console.log('Language changed to: ' + this.value);
            // 后续可以根据需求实现完整的多语言切换功能
        });
    }
}

// 页面切换动画 (移除初始淡入逻辑)
function initPageTransitions() {
    // 获取所有站内链接 (排除锚点链接, e.g., href="#" or href="page.html#section")
    const internalLinks = document.querySelectorAll('a[href^="index"], a[href^="about"], a[href^="business"], a[href^="products"], a[href^="faq"], a[href^="contact"]');
    
    // 对每个链接添加点击事件
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const targetUrl = new URL(targetHref, window.location.origin);
            const currentUrl = new URL(window.location.href);

            // 如果是锚点链接或指向当前页面的链接，则不执行动画，允许默认行为
            if (targetHref.startsWith('#') || (targetUrl.pathname === currentUrl.pathname && targetHref.includes('#'))) {
                // 对于页面内锚点平滑滚动 (可选)
                // const targetElement = document.querySelector(targetUrl.hash);
                // if (targetElement) {
                //     e.preventDefault();
                //     targetElement.scrollIntoView({ behavior: 'smooth' });
                // }
                return; 
            }
            
             // 如果链接指向的是当前页面（无锚点），不执行动画
            if (targetUrl.pathname === currentUrl.pathname && !targetHref.includes('#')){
                 e.preventDefault(); // 阻止重复加载
                 return;
            }

            e.preventDefault(); // 阻止默认跳转，以便执行动画
            
            // 选择主体内容区域进行动画
            const contentArea = document.querySelector('.page-content'); 
            if (contentArea) {
                fadeOut(contentArea, 300).then(() => {
                    // 动画完成后跳转到目标页面
                    window.location.href = targetHref;
                });
            } else {
                // 如果没有找到 .page-content，直接跳转
                 console.warn('Page content area (.page-content) not found. Navigating directly.');
                 window.location.href = targetHref;
            }
        });
    });
}

// 淡出效果函数
function fadeOut(element, duration) {
    return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

// 淡入效果函数
function fadeIn(element, duration) {
    // fadeIn 函数假定元素初始 opacity 为 0 (在 initPageTransitions 中设置)
    // 必须有一个短暂延迟才能让CSS过渡生效
    setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '1';
    }, 10); // 短暂延迟
}

// 滚动到页面顶部的平滑效果
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 页面加载后处理滚动位置
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash) {
        // 尝试找到锚点对应的元素
        // 使用 setTimeout 确保在页面完全渲染和淡入动画可能完成之后执行滚动
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                // 如果找不到元素，则回退到滚动到顶部
                 window.scrollTo(0, 0);
            }
        }, 550); // 增加延迟时间
    } else {
        // 如果没有锚点，则滚动到顶部
        // 使用 setTimeout 确保在页面布局完成后再滚动
        setTimeout(() => window.scrollTo(0, 0), 0);
    }
});
