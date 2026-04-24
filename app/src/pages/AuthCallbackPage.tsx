import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { LoadingSpinner } from '@/components/common';

/**
 * OAuth 콜백 처리 페이지
 * Google OAuth 로그인 후 이 페이지로 리다이렉트되며,
 * Supabase가 URL의 토큰을 처리하고 세션을 복원할 때까지 대기합니다.
 */
export default function AuthCallbackPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // URL에서 코드를 추출하고 세션으로 교환
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    navigate('/login', { replace: true });
                    return;
                }

                if (data.session) {
                    // 세션이 있으면 홈으로 이동
                    navigate('/', { replace: true });
                } else {
                    // 세션이 없으면 잠시 대기 후 다시 확인
                    // (Supabase가 URL 토큰을 처리하는 시간 필요)
                    const { data: { subscription } } = supabase.auth.onAuthStateChange(
                        (event, session) => {
                            if (event === 'SIGNED_IN' && session) {
                                subscription.unsubscribe();
                                navigate('/', { replace: true });
                            }
                        }
                    );

                    // 5초 후에도 세션이 없으면 로그인 페이지로
                    setTimeout(() => {
                        subscription.unsubscribe();
                        navigate('/login', { replace: true });
                    }, 5000);
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                navigate('/login', { replace: true });
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-[var(--color-text-secondary)]">
                로그인 처리 중...
            </p>
        </div>
    );
}
