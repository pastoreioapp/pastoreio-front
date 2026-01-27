import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loggedUserReducer } from "./features/loggedUserSlice";
import { sidebarReducer } from "./features/sidebarSlice";

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        loggedUser: loggedUserReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
