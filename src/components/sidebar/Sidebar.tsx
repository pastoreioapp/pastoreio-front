import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
// import { Upgrade } from "./Updrade";
import { Sidebar, Logo } from "react-mui-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/sidebarSlice";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export default function SidebarComponent() {
    const dispatch = useDispatch();
    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

    const isSidebarOpen = useSelector(
        (state: RootState) => state.sidebar.isSidebarOpen
    );
    const isMobileSidebarOpen = useSelector(
        (state: RootState) => state.sidebar.isMobileSidebarOpen
    );

    const sidebarWidth = isSidebarOpen ? "310px" : "75px";

    // Custom CSS for short scrollbar
    const scrollbarStyles = {
        "&::-webkit-scrollbar": {
            width: "7px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#eff2f7",
            borderRadius: "15px",
        },
    };

    if (lgUp) {
        return (
            <Box
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                }}
            >
                {/* Sidebar for desktop */}
                <Drawer
                    anchor="left"
                    open={isSidebarOpen}
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            boxSizing: "border-box",
                            ...scrollbarStyles,
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "10px",
                            right: "0",
                        }}
                    >
                        {isSidebarOpen ? (
                            <IconArrowLeft
                                style={{
                                    background: "#173D8A",
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: "10px",
                                    color: "#fff",
                                }}
                                onClick={() => dispatch(toggleSidebar())}
                            />
                        ) : (
                            <IconArrowRight
                                style={{
                                    background: "#173D8A",
                                    borderTopLeftRadius: "10px",
                                    borderBottomLeftRadius: "10px",
                                    color: "#fff",
                                }}
                                onClick={() => dispatch(toggleSidebar())}
                            />
                        )}
                    </Box>

                    <Box sx={{ height: "100%" }}>
                        <Sidebar
                            width={sidebarWidth}
                            collapsewidth="80px"
                            open={isSidebarOpen}
                            themeColor="#5d87ff"
                            themeSecondaryColor="#49beff"
                            showProfile={false}
                        >
                            <Logo img="/images/logos/Logo.png" />
                            <Box>
                                <SidebarItems />
                                {/* <Upgrade /> */}
                            </Box>
                        </Sidebar>
                    </Box>
                </Drawer>
            </Box>
        );
    }

    return (
        <Drawer
            anchor="left"
            open={isMobileSidebarOpen}
            onClose={() => dispatch(toggleSidebar())}
            variant="temporary"
            PaperProps={{
                sx: {
                    boxShadow: (theme) => theme.shadows[8],
                    ...scrollbarStyles,
                },
            }}
        >
            {/* Sidebar For Mobile */}
            <Box px={2}>
                <Sidebar
                    width={"270px"}
                    collapsewidth="80px"
                    isCollapse={false}
                    mode="light"
                    direction="ltr"
                    themeColor="#5d87ff"
                    themeSecondaryColor="#49beff"
                    showProfile={false}
                >
                    <Logo img="/images/logos/dark-logo.svg" />
                    <SidebarItems />
                    {/* <Upgrade /> */}
                </Sidebar>
            </Box>
        </Drawer>
    );
}
