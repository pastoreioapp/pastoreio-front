"use client";

import { createClient } from "@/features/supabase/client";
import { mapSupabaseUserToLoggedUser } from "@/features/auth/auth";
import { UserLogin } from "./types";
import { formatPhoneToE164 } from "@/utils/validation";
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
            const loginType = user.loginType ?? "email";
            const loginValue =
                loginType === "phone"
                    ? formatPhoneToE164(user.login.trim())
                    : user.login.trim();

            const payload =
                loginType === "phone"
                    ? { phone: loginValue, password: user.password }
                    : { email: loginValue, password: user.password };

            const { data, error } = await supabase.auth.signInWithPassword(payload);

            if (error) throw error;

            if (data.user) {
                const loggedUserData = await mapSupabaseUserToLoggedUser(data.user);
                if (loggedUserData) {
                    dispatch(setLoggedUser(loggedUserData));
                    router.push("/dashboard");
                }
            }
        } catch (error: any) {
            console.error("Login error:", error);
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

    const runUserRegister = async (
        login: string,
        password: string,
        fullName: string,
        loginType: "email" | "phone"
    ): Promise<void> => {
        try {
            const signUpPayload =
                loginType === "phone"
                    ? {
                          phone: login,
                          password,
                          options: {
                              data: {
                                  full_name: fullName,
                                  name: fullName,
                              },
                          },
                      }
                    : {
                          email: login,
                          password,
                          options: {
                              data: {
                                  full_name: fullName,
                                  name: fullName,
                              },
                          },
                      };

            const { data, error } = await supabase.auth.signUp(signUpPayload);

            if (error) throw error;

            // Se o email/phone confirmation estiver desabilitado, o usuário já está logado
            if (data.user && !data.session) {
                const message =
                    loginType === "phone"
                        ? "Por favor, verifique seu telefone para confirmar a conta."
                        : "Por favor, verifique seu email para confirmar a conta.";
                throw new Error(message);
            }

            if (data.user && data.session) {
                const loggedUserData = await mapSupabaseUserToLoggedUser(data.user);
                if (loggedUserData) {
                    dispatch(setLoggedUser(loggedUserData));
                    router.push("/dashboard");
                }
            }
        } catch (error: any) {
            console.error("Register error:", error);
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