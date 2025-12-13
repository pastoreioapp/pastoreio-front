import { RootState } from "@/store";
import { LoggedUserState } from "@/store/features/loggedUserSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"

type Props = {
    children: React.ReactNode,
    allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
    const loggedUser = useSelector<RootState>(data => data.loggedUser) as LoggedUserState;
    const router = useRouter();

    if(!allowedRoles || allowedRoles.length === 0) {
        return children;
    }

    if(!loggedUser || !loggedUser.id) {
        router.push('/login');
        return;
    }

    const hasSomeRole = allowedRoles.some(role => loggedUser.perfis.includes(role));

    if(!hasSomeRole) {
        router.push('/nao-autorizado');
        return;
    }

    return children;
}