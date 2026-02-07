/**
 * AuthProvider - Componente wrapper para gerenciar autenticação
 *
 * Registra a subscription do Supabase onAuthStateChange uma única vez
 * na aplicação e sincroniza o estado do Redux com a sessão do Supabase.
 *
 * Deve ser colocado no root da aplicação, dentro do ProviderStore.
 */
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createClient } from "@/shared/supabase/client";
import { mapSupabaseUserToLoggedUser } from "@/modules/controleacesso/application/auth.service";
import { setLoggedUser, clearLoggedUser } from "@/ui/stores/features/loggedUserSlice";
import { AuthChangeEvent } from "@supabase/supabase-js";

const supabase = createClient();

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkInitialSession = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const loggedUserData = await mapSupabaseUserToLoggedUser(supabase, user);
                    if (loggedUserData) {
                        dispatch(setLoggedUser(loggedUserData));
                    }
                } else {
                    dispatch(clearLoggedUser());
                }
            } catch (error) {
                console.error('Error checking initial session:', error);
                dispatch(clearLoggedUser());
            }
        };
        checkInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session) => {
                if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
                    const loggedUserData = await mapSupabaseUserToLoggedUser(supabase, session.user);
                    if (loggedUserData) {
                        dispatch(setLoggedUser(loggedUserData));
                    }
                } else if (event === 'SIGNED_OUT') {
                    dispatch(clearLoggedUser());
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    return <>{children}</>;
}
