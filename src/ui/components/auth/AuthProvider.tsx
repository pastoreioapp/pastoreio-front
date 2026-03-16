/**
 * AuthProvider - Componente wrapper para gerenciar autenticação
 *
 * Registra a subscription do Supabase onAuthStateChange uma única vez
 * na aplicação e sincroniza o estado do Redux com a sessão do Supabase.
 *
 * Deve ser colocado no root da aplicação, dentro do ProviderStore.
 */
"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/shared/supabase/client";
import { mapSupabaseUserToLoggedUser } from "@/modules/controleacesso/application/auth.service";
import { setLoggedUser, clearLoggedUser } from "@/ui/stores/features/loggedUserSlice";
import { AuthChangeEvent } from "@supabase/supabase-js";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);

    pathnameRef.current = pathname;

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session) => {
                if (event === 'PASSWORD_RECOVERY' && session?.user) {
                    if (pathnameRef.current !== '/redefinir-senha') {
                        router.push('/redefinir-senha');
                    }
                    return;
                }

                if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
                    try {
                        const loggedUserData = await mapSupabaseUserToLoggedUser(supabase, session.user);
                        if (loggedUserData) {
                            dispatch(setLoggedUser(loggedUserData));
                        }
                    } catch (err) {
                        console.error('onAuthStateChange mapUser error:', err);
                    }
                } else if (event === 'SIGNED_OUT') {
                    dispatch(clearLoggedUser());
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, dispatch, router]);

    return <>{children}</>;
}
