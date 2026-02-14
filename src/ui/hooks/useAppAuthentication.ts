"use client";

import { createClient } from "@/shared/supabase/client";
import { mapSupabaseUserToLoggedUser } from "@/modules/controleacesso/application/auth.service";
import type { UserLogin } from "@/modules/controleacesso/domain/types";
import { formatPhoneToE164 } from "@/ui/utils/validation";
import { useDispatch, useSelector } from "react-redux";
import {
  LoggedUserState,
  setLoggedUser,
  clearLoggedUser,
} from "@/ui/stores/features/loggedUserSlice";
import { RootState } from "@/ui/stores";
import { useRouter } from "next/navigation";

const supabase = createClient();

export function useAppAuthentication() {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedUser = useSelector<RootState>(
    (data) => data.loggedUser
  ) as LoggedUserState;

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
        const loggedUserData = await mapSupabaseUserToLoggedUser(
          supabase,
          data.user
        );
        if (loggedUserData) {
          dispatch(setLoggedUser(loggedUserData));
          router.push("/dashboard");
        }
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const runGoogleLogin = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      console.error("Google login error:", error);
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

      if (data.user && !data.session) {
        const message =
          loginType === "phone"
            ? "Por favor, verifique seu telefone para confirmar a conta."
            : "Por favor, verifique seu email para confirmar a conta.";
        throw new Error(message);
      }

      if (data.user && data.session) {
        const loggedUserData = await mapSupabaseUserToLoggedUser(
          supabase,
          data.user
        );
        if (loggedUserData) {
          dispatch(setLoggedUser(loggedUserData));
          router.push("/dashboard");
        }
      }
    } catch (error: unknown) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const runLogout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      dispatch(clearLoggedUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const userIsAuthenticated = (): boolean =>
    !!loggedUser && !!loggedUser.id;

  return {
    runGoogleLogin,
    runPasswordUserLogin,
    runUserRegister,
    runLogout,
    userIsAuthenticated,
    loggedUser,
  };
}
