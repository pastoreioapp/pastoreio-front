import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
    isSidebarOpen: boolean;
    isMobileSidebarOpen: boolean;
}

const initialState: SidebarState = {
    isSidebarOpen: true,
    isMobileSidebarOpen: true,
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
    },
});

export const { toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
