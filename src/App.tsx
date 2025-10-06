import { useMemo, useEffect, useRef } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import RightContent from './components/RightContent'
import LeftGallery from './components/LeftGallery'
import HeroText from './components/HeroText'

// 主应用内容组件
const AppContent: React.FC = () => {
  const { theme } = useTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // 🚀 性能优化：缓存粒子数据，避免每次渲染都重新计算随机值
  const particleSequences = useMemo(() => {
    const animations = ['pulse', 'float', 'twinkle', 'gravityFall', 'windBlown', 'strongWind', 'fallAndRise'];
    
    const generateParticles = (count: number, baseDelay: number, delayRange: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: `${baseDelay}-${i}`,
        randomAnim: animations[Math.floor(Math.random() * animations.length)],
        fadeInDelay: baseDelay + Math.random() * delayRange,
        duration: 20 + Math.random() * 40,
        size: 0.8 + Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.5,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animDelay: 0, // 将在下面计算
      }));
    };
    
    const seq1 = generateParticles(50, 0, 5);      // 0-5秒
    const seq2 = generateParticles(50, 5, 5);      // 5-10秒
    const seq3 = generateParticles(50, 10, 5);     // 10-15秒
    
    // 计算动画延迟
    [...seq1, ...seq2, ...seq3].forEach(p => {
      p.animDelay = p.fadeInDelay + (Math.random() * 8);
    });
    
    return { seq1, seq2, seq3 };
  }, []); // 空依赖数组：只在组件挂载时计算一次

  // 🎨 随机选择沙漠渐变方向动画
  const desertAnimation = useMemo(() => {
    const animations = ['desertColorBreath', 'desertColorBreathLeft', 'desertColorBreathDiagonal'];
    return animations[Math.floor(Math.random() * animations.length)];
  }, []); // 只在组件挂载时随机选择一次

  // 📍 页面加载时自动滚动到中心区域（第二个区域 - Welcome 621 Space）
  useEffect(() => {
    const scrollToCenter = () => {
      if (scrollContainerRef.current) {
        // 滚动到第二个区域（Welcome 621 Space页面）
        // 第一个区域：0vw，第二个区域：100vw，第三个区域：200vw
        const targetScroll = window.innerWidth;
        scrollContainerRef.current.scrollLeft = targetScroll;
        console.log('主滚动逻辑 - 目标位置:', targetScroll, '实际位置:', scrollContainerRef.current.scrollLeft);
      }
    };

    // 立即执行一次
    scrollToCenter();
    
    // 多次延迟执行，确保DOM完全加载和渲染
    const timeoutIds = [
      setTimeout(scrollToCenter, 50),
      setTimeout(scrollToCenter, 100),
      setTimeout(scrollToCenter, 200),
      setTimeout(scrollToCenter, 500),
      setTimeout(scrollToCenter, 1000)
    ];
    
    // 监听窗口大小变化，确保始终居中
    const handleResize = () => {
      scrollToCenter();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 只在组件挂载时执行一次

  // 📍 额外的滚动确保 - 处理页面刷新和路由变化
  useEffect(() => {
    // 页面可见时确保滚动到中心
    const handleVisibilityChange = () => {
      if (!document.hidden && scrollContainerRef.current) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = window.innerWidth;
          }
        }, 50);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 页面焦点时也确保滚动
    const handleFocus = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = window.innerWidth;
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 📍 强制滚动到Welcome 621 Space页面 - 确保首次加载和刷新都显示正确页面
  useEffect(() => {
    // 使用requestAnimationFrame确保DOM完全渲染后执行
    const forceScrollToWelcome = () => {
      if (scrollContainerRef.current) {
        // 强制滚动到第二个区域（Welcome 621 Space页面）
        const targetScroll = window.innerWidth;
        scrollContainerRef.current.scrollLeft = targetScroll;
        console.log('强制滚动到:', targetScroll, '当前滚动位置:', scrollContainerRef.current.scrollLeft);
      }
    };

    // 立即执行
    forceScrollToWelcome();
    
    // 使用requestAnimationFrame确保在下一帧执行
    requestAnimationFrame(() => {
      forceScrollToWelcome();
    });

    // 多次延迟执行，确保滚动生效
    const timeouts = [
      setTimeout(forceScrollToWelcome, 100),
      setTimeout(forceScrollToWelcome, 300),
      setTimeout(forceScrollToWelcome, 500),
      setTimeout(forceScrollToWelcome, 1000),
      setTimeout(forceScrollToWelcome, 2000)
    ];

    // 页面完全加载后执行
    const handleLoad = () => {
      forceScrollToWelcome();
    };

    if (document.readyState === 'complete') {
      forceScrollToWelcome();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // 📍 组件渲染后立即强制滚动
  const handleScrollContainerRef = (element: HTMLDivElement | null) => {
    if (element) {
      scrollContainerRef.current = element;
      
      // 强制滚动到Welcome页面（第二个区域）
      const targetScroll = window.innerWidth;
      
      // 立即设置滚动位置
      element.scrollLeft = targetScroll;
      
      // 强制重新计算布局
      element.offsetHeight;
      
      // 再次设置滚动位置
      element.scrollLeft = targetScroll;
      
      console.log('容器引用设置:');
      console.log('- 窗口宽度:', window.innerWidth);
      console.log('- 目标滚动位置:', targetScroll);
      console.log('- 实际滚动位置:', element.scrollLeft);
      console.log('- 容器总宽度:', element.scrollWidth);
      console.log('- 容器可见宽度:', element.clientWidth);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 水平滚动容器 - 超大画布 */}
      <div 
        ref={handleScrollContainerRef}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          overflowX: 'scroll', 
          overflowY: 'hidden',
          width: '100vw',
          height: '100vh',
          scrollBehavior: 'smooth'
        }}
      >
        {/* Journey风格背景 - 跟随滚动移动 */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '300vw', height: '100%', zIndex: 1 }}>
        {/* 主背景层 - 清晨沙漠色调 */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 20%, #4a3c2a 40%, #6b5b47 60%, #8b7355 80%, #a68a6b 100%)'
              : 'linear-gradient(135deg, #3d3d3d 0%, #4a4a4a 20%, #6b5b47 40%, #8b7355 60%, #a68a6b 80%, #c4a484 100%)',
            transition: 'all 1s ease'
          }}
        >
          
          {/* 天空发光层 - 清晨的微光 */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme === 'dark'
                ? 'radial-gradient(circle at 30% 20%, rgba(255, 248, 220, 0.08) 0%, rgba(255, 235, 205, 0.04) 40%, transparent 70%)'
                : 'radial-gradient(circle at 30% 20%, rgba(255, 248, 220, 0.12) 0%, rgba(255, 235, 205, 0.06) 40%, transparent 70%)',
              transition: 'all 1s ease'
            }}
          />
          
          {/* 远山剪影层 - 参考沙漠照片的山脉形状 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%' }}>
            {/* 最远山脉 - 左侧低矮山脉 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '200px',
                height: '80px',
                transform: 'translateX(-50%)',
                background: theme === 'dark'
                  ? 'linear-gradient(to top, rgba(139, 115, 85, 0.3), transparent)'
                  : 'linear-gradient(to top, rgba(139, 115, 85, 0.4), transparent)',
                clipPath: 'polygon(0% 100%, 15% 90%, 30% 85%, 50% 88%, 70% 82%, 85% 87%, 100% 100%)',
                filter: 'blur(3px)',
                transition: 'all 1s ease'
              }}
            />
            
            {/* 中远山脉 - 左侧中等高度 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: '25%',
                width: '180px',
                height: '120px',
                transform: 'translateX(-50%)',
                background: theme === 'dark'
                  ? 'linear-gradient(to top, rgba(139, 115, 85, 0.4), transparent)'
                  : 'linear-gradient(to top, rgba(139, 115, 85, 0.5), transparent)',
                clipPath: 'polygon(0% 100%, 20% 85%, 35% 75%, 50% 70%, 65% 78%, 80% 82%, 100% 100%)',
                filter: 'blur(2px)',
                transition: 'all 1s ease'
              }}
            />
            
            {/* 中央主峰 - 最高的山峰 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '220px',
                height: '160px',
                transform: 'translateX(-50%)',
                background: theme === 'dark'
                  ? 'linear-gradient(to top, rgba(139, 115, 85, 0.6), transparent)'
                  : 'linear-gradient(to top, rgba(139, 115, 85, 0.7), transparent)',
                clipPath: 'polygon(0% 100%, 15% 80%, 30% 65%, 45% 55%, 60% 50%, 75% 60%, 90% 75%, 100% 100%)',
                filter: 'blur(1px)',
                transition: 'all 1s ease'
              }}
            />
            
            {/* 右侧山脉 - 右侧中等高度 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                right: '25%',
                width: '160px',
                height: '100px',
                transform: 'translateX(50%)',
                background: theme === 'dark'
                  ? 'linear-gradient(to top, rgba(139, 115, 85, 0.35), transparent)'
                  : 'linear-gradient(to top, rgba(139, 115, 85, 0.45), transparent)',
                clipPath: 'polygon(0% 100%, 25% 85%, 40% 80%, 60% 75%, 80% 82%, 100% 100%)',
                filter: 'blur(2px)',
                transition: 'all 1s ease'
              }}
            />
            
            {/* 最右侧山脉 - 右侧低矮 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                right: '10%',
                width: '140px',
                height: '70px',
                transform: 'translateX(50%)',
                background: theme === 'dark'
                  ? 'linear-gradient(to top, rgba(139, 115, 85, 0.25), transparent)'
                  : 'linear-gradient(to top, rgba(139, 115, 85, 0.35), transparent)',
                clipPath: 'polygon(0% 100%, 20% 90%, 40% 85%, 60% 88%, 80% 85%, 100% 100%)',
                filter: 'blur(3px)',
                transition: 'all 1s ease'
              }}
            />
          </div>
          
          {/* Journey风格近处沙漠层 - 下方40%，绵延起伏，呼吸变化颜色 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' }}>
            {/* 沙漠呼吸颜色层 - SVG波浪形状，光效散射效果 */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 1440 400" preserveAspectRatio="none">
              {/* 第一层：底部高亮呼吸层 - 靠近沙丘更亮 */}
              <path 
                d="M0,0 L0,400 L1440,400 L1440,0 C1440,0 1380,10 1260,25 C1140,40 1020,55 900,60 C780,65 660,60 540,50 C420,40 300,25 180,15 C60,5 0,0 0,0 Z"
                fill={`url(#desertBreathGradient-bottom-${desertAnimation})`}
                style={{ animation: `${desertAnimation} 30s ease-in-out infinite` }}
              />
              {/* 第二层：中部散射层 - 逐渐模糊 */}
              <path 
                d="M0,0 L0,400 L1440,400 L1440,0 C1440,0 1380,10 1260,25 C1140,40 1020,55 900,60 C780,65 660,60 540,50 C420,40 300,25 180,15 C60,5 0,0 0,0 Z"
                fill={`url(#desertBreathGradient-scatter-${desertAnimation})`}
                style={{ 
                  animation: `${desertAnimation} 30s ease-in-out infinite`,
                  filter: 'blur(8px)'
                }}
              />
              <defs>
                {/* ========== 底部高亮层渐变 - 顶部完全透明 ========== */}
                {/* 向上渐变 - 底部最亮，顶部完全透明 */}
                <linearGradient id="desertBreathGradient-bottom-desertColorBreath" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="30%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: 'currentColor', stopOpacity: 0.15 }} />
                  <stop offset="75%" style={{ stopColor: 'currentColor', stopOpacity: 0.35 }} />
                  <stop offset="90%" style={{ stopColor: 'currentColor', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.6 }} />
                </linearGradient>
                {/* 横向渐变 - 边缘最亮，远端完全透明 */}
                <linearGradient id="desertBreathGradient-bottom-desertColorBreathLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="30%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: 'currentColor', stopOpacity: 0.15 }} />
                  <stop offset="75%" style={{ stopColor: 'currentColor', stopOpacity: 0.35 }} />
                  <stop offset="90%" style={{ stopColor: 'currentColor', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.6 }} />
                </linearGradient>
                {/* 对角线渐变 - 底部最亮，顶部完全透明 */}
                <linearGradient id="desertBreathGradient-bottom-desertColorBreathDiagonal" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="30%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: 'currentColor', stopOpacity: 0.15 }} />
                  <stop offset="75%" style={{ stopColor: 'currentColor', stopOpacity: 0.35 }} />
                  <stop offset="90%" style={{ stopColor: 'currentColor', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.6 }} />
                </linearGradient>
                
                {/* ========== 散射层渐变 - 过渡到天空色 ========== */}
                {/* 向上渐变 - 散射到天空 */}
                <linearGradient id="desertBreathGradient-scatter-desertColorBreath" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="40%" style={{ stopColor: 'currentColor', stopOpacity: 0.15 }} />
                  <stop offset="70%" style={{ stopColor: theme === 'dark' ? 'rgb(74, 60, 42)' : 'rgb(107, 91, 71)', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: theme === 'dark' ? 'rgb(45, 45, 45)' : 'rgb(74, 74, 74)', stopOpacity: 0.1 }} />
                </linearGradient>
                {/* 横向渐变 - 散射到天空 */}
                <linearGradient id="desertBreathGradient-scatter-desertColorBreathLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="40%" style={{ stopColor: 'currentColor', stopOpacity: 0.15 }} />
                  <stop offset="70%" style={{ stopColor: theme === 'dark' ? 'rgb(74, 60, 42)' : 'rgb(107, 91, 71)', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: theme === 'dark' ? 'rgb(45, 45, 45)' : 'rgb(74, 74, 74)', stopOpacity: 0.1 }} />
                </linearGradient>
                {/* 对角线渐变 - 散射到天空 */}
                <linearGradient id="desertBreathGradient-scatter-desertColorBreathDiagonal" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                  <stop offset="40%" style={{ stopColor: 'currentColor', stopOpacity: 0.15 }} />
                  <stop offset="70%" style={{ stopColor: theme === 'dark' ? 'rgb(74, 60, 42)' : 'rgb(107, 91, 71)', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: theme === 'dark' ? 'rgb(45, 45, 45)' : 'rgb(74, 74, 74)', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* 地平线光晕 - 沙丘边缘发光效果（在沙丘层后面） */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '140px',
                background: theme === 'dark'
                  ? 'linear-gradient(to top, rgba(139, 115, 85, 0.15), transparent)'
                  : 'linear-gradient(to top, rgba(166, 138, 107, 0.2), transparent)',
                filter: 'blur(6px)',
                transition: 'all 1s ease'
              }}
            />
            
            {/* 第一层沙丘 - 最远的波浪 */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }} viewBox="0 0 1440 400" preserveAspectRatio="none">
              <path 
                d="M0,240 C180,220 360,200 540,215 C720,230 900,250 1080,235 C1260,220 1380,200 1440,210 L1440,400 L0,400 Z"
                fill="url(#gradient1)"
                opacity="0.6"
                style={{ animation: 'waveFloat1 16s ease-in-out infinite' }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(222, 184, 135)', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(210, 180, 140)', stopOpacity: 0.7 }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* 第二层沙丘 - 中层波浪 */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 1440 340" preserveAspectRatio="none">
              <path 
                d="M0,200 C150,185 300,170 450,180 C600,190 750,205 900,195 C1050,185 1200,175 1320,180 C1380,183 1410,185 1440,187 L1440,340 L0,340 Z"
                fill="url(#gradient2)"
                opacity="0.7"
                style={{ animation: 'waveFloat2 19s ease-in-out infinite' }}
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(205, 133, 63)', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(188, 143, 143)', stopOpacity: 0.7 }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* 第三层沙丘 - 近层波浪 */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%' }} viewBox="0 0 1440 280" preserveAspectRatio="none">
              <path 
                d="M0,160 C120,145 240,135 360,143 C480,151 600,165 720,157 C840,149 960,140 1080,145 C1200,150 1320,155 1380,157 C1410,158 1425,159 1440,160 L1440,280 L0,280 Z"
                fill="url(#gradient3)"
                opacity="0.75"
                style={{ animation: 'waveFloat3 22s ease-in-out infinite' }}
              />
              <defs>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(210, 180, 140)', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(205, 133, 63)', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* 第四层沙丘 - 最前景波浪 */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%' }} viewBox="0 0 1440 200" preserveAspectRatio="none">
              <path 
                d="M0,120 C100,110 200,105 300,110 C400,115 500,125 600,120 C700,115 800,110 900,113 C1000,116 1100,120 1200,118 C1300,116 1350,115 1440,115 L1440,200 L0,200 Z"
                fill="url(#gradient4)"
                opacity="0.8"
                style={{ animation: 'waveFloat4 25s ease-in-out infinite' }}
              />
              <defs>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(188, 143, 143)', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(210, 180, 140)', stopOpacity: 0.85 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* 神秘光芒 - 第一层核心光芒（最快、最明显） */}
          <div 
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              width: '300px',
              height: '180px',
              background: theme === 'dark'
                ? 'linear-gradient(to top, rgba(255, 248, 220, 0.4), rgba(255, 235, 205, 0.25), rgba(255, 228, 181, 0.12), transparent)'
                : 'linear-gradient(to top, rgba(255, 248, 220, 0.5), rgba(255, 235, 205, 0.35), rgba(255, 228, 181, 0.18), transparent)',
              borderRadius: '150px 150px 0 0',
              filter: 'blur(30px)',
              transition: 'background 1s ease',
              animation: 'glow 12s ease-in-out infinite',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            }}
          />
          
          {/* 第二层光芒 - 中等速度、反向移动 */}
          <div 
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              width: '450px',
              height: '220px',
              background: theme === 'dark'
                ? 'radial-gradient(ellipse at center, rgba(255, 248, 220, 0.2) 0%, rgba(255, 235, 205, 0.1) 40%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(255, 248, 220, 0.28) 0%, rgba(255, 235, 205, 0.15) 40%, transparent 70%)',
              filter: 'blur(40px)',
              transition: 'background 1s ease',
              animation: 'glowSlow 18s ease-in-out infinite',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            }}
          />
          
          {/* 第三层光芒 - 最慢、最大范围 */}
          <div 
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              width: '600px',
              height: '280px',
              background: theme === 'dark'
                ? 'radial-gradient(ellipse at center, rgba(255, 248, 220, 0.12) 0%, rgba(255, 235, 205, 0.06) 50%, transparent 80%)'
                : 'radial-gradient(ellipse at center, rgba(255, 248, 220, 0.18) 0%, rgba(255, 235, 205, 0.09) 50%, transparent 80%)',
              filter: 'blur(50px)',
              transition: 'background 1s ease',
              animation: 'glowSlowest 25s ease-in-out infinite',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            }}
          />
          
          {/* 智能粒子系统 - 150个粒子分3个序列，错开淡入 */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            overflow: 'hidden',
            contain: 'layout style paint',
            pointerEvents: 'none'
          }}>
            {/* 🔸 粒子层在最上方，覆盖所有背景元素 🔸 */}
            {/* 第一序列：50个粒子，立即开始淡入 */}
            {particleSequences.seq1.map((particle) => (
              <div
                key={`particle-seq1-${particle.id}`}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  borderRadius: '50%',
                  backgroundColor: theme === 'dark' 
                    ? `rgba(255, 248, 220, ${particle.opacity})` 
                    : `rgba(255, 248, 220, ${particle.opacity + 0.1})`,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animation: `particleFadeIn 2s ease-out ${particle.fadeInDelay}s forwards, ${particle.randomAnim} ${particle.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${particle.animDelay}s infinite`,
                  boxShadow: theme === 'dark' 
                    ? `0 0 ${particle.size * 2.5}px rgba(255, 248, 220, ${particle.opacity * 0.6})` 
                    : `0 0 ${particle.size * 2.5}px rgba(255, 248, 220, ${particle.opacity * 0.8})`,
                  willChange: 'transform, opacity',
                  opacity: 0,
                  backfaceVisibility: 'hidden',
                  perspective: 1000,
                }}
              />
            ))}

            {/* 第二序列：50个粒子，5-10秒后开始淡入 */}
            {particleSequences.seq2.map((particle) => (
              <div
                key={`particle-seq2-${particle.id}`}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  borderRadius: '50%',
                  backgroundColor: theme === 'dark' 
                    ? `rgba(255, 248, 220, ${particle.opacity})` 
                    : `rgba(255, 248, 220, ${particle.opacity + 0.1})`,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animation: `particleFadeIn 2s ease-out ${particle.fadeInDelay}s forwards, ${particle.randomAnim} ${particle.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${particle.animDelay}s infinite`,
                  boxShadow: theme === 'dark' 
                    ? `0 0 ${particle.size * 2.5}px rgba(255, 248, 220, ${particle.opacity * 0.6})` 
                    : `0 0 ${particle.size * 2.5}px rgba(255, 248, 220, ${particle.opacity * 0.8})`,
                  willChange: 'transform, opacity',
                  opacity: 0,
                  backfaceVisibility: 'hidden',
                  perspective: 1000,
                }}
              />
            ))}

            {/* 第三序列：50个粒子，10-15秒后开始淡入 */}
            {particleSequences.seq3.map((particle) => (
              <div
                key={`particle-seq3-${particle.id}`}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  borderRadius: '50%',
                  backgroundColor: theme === 'dark' 
                    ? `rgba(255, 248, 220, ${particle.opacity})` 
                    : `rgba(255, 248, 220, ${particle.opacity + 0.1})`,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animation: `particleFadeIn 2s ease-out ${particle.fadeInDelay}s forwards, ${particle.randomAnim} ${particle.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${particle.animDelay}s infinite`,
                  boxShadow: theme === 'dark' 
                    ? `0 0 ${particle.size * 2.5}px rgba(255, 248, 220, ${particle.opacity * 0.6})` 
                    : `0 0 ${particle.size * 2.5}px rgba(255, 248, 220, ${particle.opacity * 0.8})`,
                  willChange: 'transform, opacity',
                  opacity: 0,
                  backfaceVisibility: 'hidden',
                  perspective: 1000,
                }}
              />
            ))}
          </div>
        </div>
        </div>

        {/* 内容层 - 在背景之上 */}
        <div style={{ 
          position: 'relative',
          display: 'flex', 
          width: '300vw', 
          height: '100vh',
          flexDirection: 'row',
          zIndex: 10
        }}>
          
          {/* 左侧画廊区域 - 实际内容 */}
          <LeftGallery />

          {/* 中心/入口区域 - 欢迎页 */}
          <div style={{ 
            width: '100vw', 
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <HeroText />
          </div>

          {/* 右侧卡片区域 - 实际内容 */}
          <RightContent />

        </div>
      </div>
      
      {/* 主题切换按钮 - fixed定位，始终可见 */}
      <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 100 }}>
        <ThemeToggle />
      </div>
    </div>
  )
}

// 主App组件，包装ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
