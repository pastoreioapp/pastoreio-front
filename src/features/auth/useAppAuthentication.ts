"use client";

import { createClient } from "@/features/supabase/client";
import { mapSupabaseUserToLoggedUser } from "@/features/auth/auth";
import { UserLogin } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { LoggedUserState, setLoggedUser, clearLoggedUser } from "@/store/features/loggedUserSlice";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

const supabase = createClient();

export function useAppAuthentication() {
    const dispatch = useDispatch();
    const router = useRouter();
    const loggedUser = useSelector<RootState>(data => data.loggedUser) as LoggedUserState;

    const runPasswordUserLogin = async (user: UserLogin): Promise<void> => {
        try {
            const payload = {email: user.login, password: user.password};
            const { data, error } = await supabase.auth.signInWithPassword(payload);

            if (error) throw error;

            if (data.user) {
                const loggedUserData = await mapSupabaseUserToLoggedUser(data.user);
                if (loggedUserData) {
                    dispatch(setLoggedUser(loggedUserData));
                    router.push('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const runGoogleLogin = async (): Promise<void> => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error: any) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const runUserRegister = async (email: string, password: string, fullName: string): Promise<void> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        name: fullName,
                    },
                },
            });

            if (error) throw error;

            // Se o email confirmation estiver desabilitado, o usuário já está logado
            if (data.user && !data.session) {
                throw new Error('Por favor, verifique seu email para confirmar a conta.');
            }

            if (data.user && data.session) {
                const loggedUserData = await mapSupabaseUserToLoggedUser(data.user);
                if (loggedUserData) {
                    dispatch(setLoggedUser(loggedUserData));
                    router.push('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const runLogout = async (): Promise<void> => {
        try {
            await supabase.auth.signOut();
            dispatch(clearLoggedUser());
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const userIsAuthenticated = (): boolean => !!loggedUser && !!loggedUser.id;

    return {
        runGoogleLogin,
        runPasswordUserLogin,
        runUserRegister,
        runLogout,
        userIsAuthenticated,
        loggedUser
    };
}