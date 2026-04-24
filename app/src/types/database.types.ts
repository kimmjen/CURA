export interface Profile {
    id: string; // uuid
    email?: string;
    username?: string;
    avatar_url?: string;
    language?: 'en' | 'ko' | 'es';
    theme?: 'light' | 'dark' | 'system';
    updated_at?: string;
}

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Profile;
                Update: Partial<Profile>;
            };
        };
    };
}
