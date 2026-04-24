import { useEffect, useState } from 'react';
import ButtonV2 from '../components/ui/ButtonV2';
import GlassCard from '../components/ui/GlassCard';
import VideoCardV2 from '../components/video/VideoCardV2';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import { SkeletonVideoCard } from '../components/ui/Skeleton';

// Clean, professional styles - 의미 있는 곳에만 애니메이션
const v2Styles = `
  :root {
    --v2-gradient-primary: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
    --v2-gradient-accent: linear-gradient(135deg, #1db954 0%, #17c3b2 100%);
    --v2-glass-bg: rgba(20, 20, 20, 0.7);
    --v2-glass-border: rgba(255, 255, 255, 0.1);
    --v2-shadow-subtle: 0 4px 16px rgba(0, 0, 0, 0.2);
    --v2-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .v2-page {
    min-height: 100vh;
    background: #0a0a0a;
    color: white;
  }

  /* 깔끔한 그라디언트 텍스트 */
  .v2-gradient-text {
    background: var(--v2-gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }

  /* 의미 있는 호버 효과만 */
  .v2-card {
    background: rgba(20, 20, 20, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    transition: all 0.2s ease;
  }

  .v2-card:hover {
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: var(--v2-shadow-hover);
  }

  /* 버튼 - 클릭 가능한 것만 강조 */
  .v2-btn {
    background: var(--v2-gradient-primary);
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .v2-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
  }

  .v2-btn:active {
    transform: translateY(0);
  }

  /* 깔끔한 통계 카드 - 애니메이션 없음 */
  .v2-stat {
    padding: 32px;
    background: linear-gradient(135deg, rgba(29, 185, 84, 0.08) 0%, rgba(23, 195, 178, 0.04) 100%);
    border: 1px solid rgba(29, 185, 84, 0.15);
    border-radius: 12px;
    text-align: center;
  }

  .v2-stat-number {
    font-size: 3rem;
    font-weight: 700;
    background: var(--v2-gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* 섹션 타이틀 */
  .v2-section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
  }

  .v2-section-subtitle {
    color: #b3b3b3;
    font-size: 1rem;
    line-height: 1.6;
  }

  /* Grid */
  .v2-grid {
    display: grid;
    gap: 24px;
  }

  @media (min-width: 768px) {
    .v2-grid-2 { grid-template-columns: repeat(2, 1fr); }
    .v2-grid-3 { grid-template-columns: repeat(3, 1fr); }
    .v2-grid-4 { grid-template-columns: repeat(4, 1fr); }
  }
`;

const sampleVideo = {
    id: 1,
    collectionId: 1,
    title: 'Beautiful Video Title - Premium Design Showcase',
    thumbnailUrl: 'https://picsum.photos/seed/v2-1/400/225',
    youtubeVideoId: 'dQw4w9WgXcQ',
    durationSeconds: 245,
    publishedAt: new Date().toISOString(),
    channelName: 'Premium Channel',
    viewCount: 1542000,
    category: 'MV' as const,
    watchProgress: 65,
};

export default function V2ShowcasePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = v2Styles;
        document.head.appendChild(styleElement);
        setTimeout(() => setMounted(true), 50);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    if (!mounted) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="v2-page">
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

                {/* Hero - 심플하고 깔끔 */}
                <div style={{ marginBottom: '80px' }}>
                    <div style={{
                        fontSize: '0.875rem',
                        color: '#1db954',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        marginBottom: '12px'
                    }}>
                        V2 Component Library
                    </div>
                    <h1 className="v2-gradient-text" style={{
                        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                        marginBottom: '16px',
                        lineHeight: 1.2
                    }}>
                        Professional Premium UI
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#b3b3b3',
                        maxWidth: '600px',
                        lineHeight: 1.6,
                        marginBottom: '32px'
                    }}>
                        Clean components with meaningful interactions. No unnecessary animations.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button className="v2-btn">Get Started</button>
                        <button style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'transparent',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            Documentation
                        </button>
                    </div>
                </div>

                {/* Stats - 심플, 애니메이션 없음 */}
                <div style={{ marginBottom: '80px' }}>
                    <div className="v2-grid v2-grid-3">
                        <div className="v2-stat">
                            <div className="v2-stat-number">
                                <AnimatedNumber value={1542} duration={2000} />K
                            </div>
                            <div style={{ color: '#999', marginTop: '8px', fontSize: '0.875rem' }}>
                                Views
                            </div>
                        </div>
                        <div className="v2-stat">
                            <div className="v2-stat-number">
                                <AnimatedNumber value={98} duration={1800} decimals={1} />%
                            </div>
                            <div style={{ color: '#999', marginTop: '8px', fontSize: '0.875rem' }}>
                                Quality
                            </div>
                        </div>
                        <div className="v2-stat">
                            <div className="v2-stat-number">
                                <AnimatedNumber value={256} duration={1500} />
                            </div>
                            <div style={{ color: '#999', marginTop: '8px', fontSize: '0.875rem' }}>
                                Components
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Cards - 호버만 의미있게 */}
                <div style={{ marginBottom: '80px' }}>
                    <h2 className="v2-section-title">Video Cards</h2>
                    <p className="v2-section-subtitle" style={{ marginBottom: '32px' }}>
                        Hover to see subtle interactions
                    </p>
                    <div className="v2-grid v2-grid-4">
                        <VideoCardV2 video={sampleVideo} showProgress />
                        <VideoCardV2 video={{ ...sampleVideo, id: 2, watchProgress: 0, thumbnailUrl: 'https://picsum.photos/seed/v2-2/400/225' }} />
                        <VideoCardV2 video={{ ...sampleVideo, id: 3, category: 'LIVE' as const, thumbnailUrl: 'https://picsum.photos/seed/v2-3/400/225' }} />
                        <VideoCardV2 video={{ ...sampleVideo, id: 4, category: 'FANCAM' as const, thumbnailUrl: 'https://picsum.photos/seed/v2-4/400/225' }} />
                    </div>
                </div>

                {/* Buttons - 실제로 클릭하는 것만 */}
                <div style={{ marginBottom: '80px' }}>
                    <h2 className="v2-section-title">Buttons</h2>
                    <p className="v2-section-subtitle" style={{ marginBottom: '32px' }}>
                        Clean interactions on actionable elements
                    </p>
                    <div className="v2-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                            <ButtonV2 variant="gradient">Gradient</ButtonV2>
                            <ButtonV2 variant="primary">Primary</ButtonV2>
                            <ButtonV2 variant="secondary">Secondary</ButtonV2>
                            <ButtonV2 variant="ghost">Ghost</ButtonV2>
                            <ButtonV2 variant="danger">Danger</ButtonV2>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <ButtonV2 size="sm" variant="gradient">Small</ButtonV2>
                            <ButtonV2 size="md" variant="gradient">Medium</ButtonV2>
                            <ButtonV2 size="lg" variant="gradient">Large</ButtonV2>
                        </div>
                    </div>
                </div>

                {/* Glass Cards - 깔끔한 호버만 */}
                <div style={{ marginBottom: '80px' }}>
                    <h2 className="v2-section-title">Cards</h2>
                    <p className="v2-section-subtitle" style={{ marginBottom: '32px' }}>
                        Glassmorphism with purpose
                    </p>
                    <div className="v2-grid v2-grid-3">
                        <GlassCard border="default">
                            <div style={{ padding: '24px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎨</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                                    Clean Design
                                </h3>
                                <p style={{ color: '#b3b3b3', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    Minimal and purposeful. Every element has meaning.
                                </p>
                            </div>
                        </GlassCard>
                        <GlassCard border="gradient">
                            <div style={{ padding: '24px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                                    Performance
                                </h3>
                                <p style={{ color: '#b3b3b3', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    60fps smooth interactions. No unnecessary effects.
                                </p>
                            </div>
                        </GlassCard>
                        <GlassCard border="glow">
                            <div style={{ padding: '24px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✨</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                                    Subtle Polish
                                </h3>
                                <p style={{ color: '#b3b3b3', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    Refined details where they matter.
                                </p>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Loading States */}
                <div style={{ marginBottom: '80px' }}>
                    <h2 className="v2-section-title">Loading States</h2>
                    <p className="v2-section-subtitle" style={{ marginBottom: '32px' }}>
                        Shimmer effect for content loading
                    </p>
                    <div className="v2-grid v2-grid-4">
                        <SkeletonVideoCard />
                        <SkeletonVideoCard />
                        <SkeletonVideoCard />
                        <SkeletonVideoCard />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    paddingTop: '60px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    <div className="v2-gradient-text" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
                        CURA V2
                    </div>
                    <p style={{ fontSize: '0.9rem' }}>Clean • Professional • Purposeful</p>
                </div>
            </div>
        </div>
    );
}
