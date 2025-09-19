import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loggedUserReducer } from "./features/loggedUserSlice";
import { sidebarReducer } from "./features/sidebarSlice";
import { userSessionReducer } from "./features/userSessionSlice";

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        loggedUser: loggedUserReducer,
        userSession: userSessionReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
