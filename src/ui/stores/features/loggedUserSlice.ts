import { LoggedUserResponse } from "@/modules/controleacesso/domain/types";
import { createSlice } from "@reduxjs/toolkit";

export interface LoggedUserState extends LoggedUserResponse { }

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
