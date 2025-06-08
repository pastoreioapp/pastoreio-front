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
            console.log("Setting logged user:", action.payload);
            return {...state, ...action.payload};
        }
    }
})

export const { setLoggedUser } = loggedUserSlice.actions;

export const { reducer: loggedUserReducer } = loggedUserSlice;