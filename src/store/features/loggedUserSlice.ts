import { createSlice } from "@reduxjs/toolkit";

export type LoggedUserState = {
    id: string;
    name: string;
    email: string;
    role: string;
}

const loggedUserSlice = createSlice({
    name: "loggedUser",
    initialState: {} as LoggedUserState,
    reducers: {
        setLoggedUser: (state, action) => {
            return {...state, ...action.payload};
        },
        clearLoggedUser: () => {
            return {} as LoggedUserState;
        }
    }
})

export const { setLoggedUser, clearLoggedUser } = loggedUserSlice.actions;

export const { reducer: loggedUserReducer } = loggedUserSlice;