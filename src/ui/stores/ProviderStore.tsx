"use client";

import { Provider } from "react-redux";
import { store } from "@/ui/stores";

export default function ProviderStore({ children }: {children: React.ReactNode}) {
    return <Provider store={store}> {children} </Provider>;
}
