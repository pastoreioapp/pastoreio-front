import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthResponse, LoggedUserResponse, UserLogin } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "@/store/features/loggedUserSlice";
import { setUserSession, UserSessionState } from "@/store/features/userSessionSlice";
import { RootState } from "@/store";

export function useAppAuthentication() {
    const dispatch = useDispatch();
    const userSession = useSelector<RootState>(data => data.userSession) as UserSessionState;
    const loggedUser = useSelector<RootState>(data => data.loggedUser) as LoggedUserState;

    return {
        useRunGoogleUserLogin(callback: Function): void {
            // TODO: see how fix this hook lint rule
            useGoogleLogin({
                flow: "auth-code",
                scope : "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile email profile openid",
                onSuccess: async tokenResponse => {
                    const headers = { 'Content-Type': 'text/plain' };
                    const authResponse = await axios.post<AuthResponse>(
                        'http://localhost:8080/api/auth/code/google',
                        tokenResponse.code,
                        { headers }
                    );
                    // TODO: decode token and get expiration
                    const tokenExpirationDate = new Date();
                    dispatch(setUserSession({
                        accessToken: authResponse.data.access_token,
                        expiresIn: tokenExpirationDate
                    }))

                    const userResponse = await axios.get<LoggedUserResponse>(
                        'http://localhost:8080/api/usuarios/me',
                        { headers: {
                            Authorization: authResponse.data.access_token
                        }}
                    );
                    dispatch(setLoggedUser(userResponse.data));
                    callback();
                },
            })
        },
        async runPasswordUserLogin(user: UserLogin): Promise<void> {
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
                expiresIn: tokenExpirationDate
            }))

            const userResponse = await axios.get<LoggedUserResponse>(
                'http://localhost:8080/api/usuarios/me',
                { headers: {
                    Authorization: `Bearer ${authResponse.data.access_token}`
                }}
            );
            dispatch(setLoggedUser(userResponse.data));
        },
        async refreshAccessToken(): Promise<void> {
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
                expiresIn: tokenExpirationDate
            }))
        },
        userIsAuthenticated(): boolean {
            return !loggedUser || !loggedUser.id || !userSession || !userSession.accessToken;
        }
    }
}