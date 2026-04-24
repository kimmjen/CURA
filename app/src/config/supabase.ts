import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Auth features will be disabled.');
    console.warn('Please create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Guard: the frontend must never ship a service_role JWT. Service-role
// keys bypass Row Level Security, and every user's browser receives
// whatever value we bundle here. Decode the role claim and fail loudly
// if the wrong key type was wired in.
if (supabaseAnonKey) {
    try {
        const [, payload] = supabaseAnonKey.split('.');
        if (payload) {
            // Base64url -> base64 for atob
            const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = JSON.parse(atob(b64));
            if (json?.role === 'service_role') {
                const msg =
                    'VITE_SUPABASE_ANON_KEY is a service_role JWT. ' +
                    'Service-role keys bypass RLS and must never be exposed to browsers. ' +
                    'Use the anon/public key from your Supabase project settings.';
                if (import.meta.env.PROD) {
                    throw new Error(msg);
                } else {
                    console.error('[supabase] ' + msg);
                }
            }
        }
    } catch (err) {
        if (err instanceof Error && err.message.startsWith('VITE_SUPABASE_ANON_KEY')) {
            throw err;
        }
        // Ignore decode errors — this is a best-effort guard, not a validator.
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);
