import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const ensureProfile = async (user) => {
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        const fullName = user.user_metadata?.full_name || 'User';

        // Create profile if missing
        if (!existingProfile) {
            const { data: newProfile } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    full_name: fullName,
                })
                .select()
                .single();

            setProfile(newProfile);
            return;
        }

        // Update full_name if empty or outdated
        if (!existingProfile.full_name) {
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id)
                .select()
                .single();

            setProfile(updatedProfile);
            return;
        }

        setProfile(existingProfile);
    };

    useEffect(() => {
        // getSession() -> restores login on refresh
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);

            if (session?.user) {
                ensureProfile(session.user);
            }
        });

        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                ensureProfile(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);



    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
