import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthResponse, LoggedUserResponse, Perfil, UserLogin } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { LoggedUserState, setLoggedUser } from "@/store/features/loggedUserSlice";
import { setUserSession, UserSessionState } from "@/store/features/userSessionSlice";
import { RootState } from "@/store";

export function useAppAuthentication({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
    const dispatch = useDispatch();
    const userSession = useSelector<RootState>(data => data.userSession) as UserSessionState;
    const loggedUser = useSelector<RootState>(data => data.loggedUser) as LoggedUserState;

    const setMockedUser = () => {
        dispatch(setLoggedUser({
            id: 1,
            nome: "Developer User",
            email: "developer-user@gmail.com",
            perfis: [Perfil.ADMINISTRADOR_SISTEMA]

        }));
        dispatch(setUserSession({
            accessToken: 'access-token',
            expiresIn: 0
        }));
    }

    const runGoogleLogin = useGoogleLogin({
        flow: "auth-code",
        scope : "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile email profile openid",
        onSuccess: async tokenResponse => {
            const headers = { 'Content-Type': 'text/plain' };
            // TODO: standardize the endpoints
            const authResponse = await axios.post<AuthResponse>(
                'http://localhost:8080/api/auth/code/google',
                tokenResponse.code,
                { headers }
            );
            // TODO: decode token and get expiration
            const tokenExpirationDate = new Date();
            dispatch(setUserSession({
                accessToken: authResponse.data.access_token,
                expiresIn: tokenExpirationDate.getTime()
            }))

            const userResponse = await axios.get<LoggedUserResponse>(
                'http://localhost:8080/api/usuarios/me',
                { headers: {
                    Authorization: `Bearer ${authResponse.data.access_token}`
                }}
            );
            dispatch(setLoggedUser(userResponse.data));
            onLoginSuccess?.();
        },
    });

    const runPasswordUserLogin = async (user: UserLogin): Promise<void> => {
        if(process.env.NODE_ENV === "development") {
            console.log("Skipping authentication as per environment configuration.");
            setMockedUser();
            onLoginSuccess?.();
            return;
        }

        const authRequestBody = {
            'grant_type': 'password',
            'username': user.login,
            'password': user.password,
            'client_id': 'my-client-basic',
            'client_secret': 'my-secret-basic',
        };
        const authResponse = await axios.post<AuthResponse>(
            'http://localhost:8080/api/oauth2/token',
            authRequestBody,
            { headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }}
        );
        // TODO: decode token and get expiration
        const tokenExpirationDate = new Date();
        dispatch(setUserSession({
            accessToken: authResponse.data.access_token,
            expiresIn: tokenExpirationDate.getTime()
        }))

        const userResponse = await axios.get<LoggedUserResponse>(
            'http://localhost:8080/api/usuarios/me',
            { headers: {
                Authorization: `Bearer ${authResponse.data.access_token}`
            }}
        );
        dispatch(setLoggedUser(userResponse.data));
        onLoginSuccess?.();
    };

    const refreshAccessToken = async (): Promise<void> => {
        const authResponse = await axios.post<AuthResponse>(
            'http://localhost:8080/api/oauth2/refresh??',
            {},
            { headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }}
        );
        // TODO: decode token and get expiration
        const tokenExpirationDate = new Date();
        dispatch(setUserSession({
            accessToken: authResponse.data.access_token,
            expiresIn: tokenExpirationDate.getTime()
        }))
    };

    const userIsAuthenticated = (): boolean => {
        return !!loggedUser && !!loggedUser.id && !!userSession && !!userSession.accessToken;
    }

    return {
        runGoogleLogin,
        runPasswordUserLogin,
        refreshAccessToken,
        userIsAuthenticated
    }
}