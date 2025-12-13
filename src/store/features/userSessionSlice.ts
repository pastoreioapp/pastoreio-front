import { createSlice } from "@reduxjs/toolkit";

export type UserSessionState = {
    accessToken: string,
    expiresIn: number
}

const userSessionSlice = createSlice({
    name: 'userSession',
    initialState: {} as UserSessionState,
    reducers: {
        setUserSession: (state, action) => {
            return {...state, ...action.payload}
        },
        clearUserSession: () => {
            return {} as UserSessionState
        }
    }
});

export const { setUserSession, clearUserSession } = userSessionSlice.actions;
export const { reducer: userSessionReducer } = userSessionSlice;