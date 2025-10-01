'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOutFirebase, onAuthChange } from "@/lib/firebase/client";
import { useEffect, useState } from "react";

const UserDropdown = ({ user, initialStocks }: {user: User, initialStocks: StockWithWatchlistStatus[]}) => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{ id: string; name?: string | null; email?: string | null; photoURL?: string | null } | null>(null);

    useEffect(() => {
        const unsub = onAuthChange((u) => {
            setCurrentUser(u);
        });
        return () => unsub();
    }, []);

    const handleSignOut = async () => {
        await signOutFirebase();
        router.push("/sign-in");
    }

    return (
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className="h-8 w-8">
                        {currentUser?.photoURL ? (
                            <AvatarImage src={currentUser.photoURL} />
                        ) : (
                            <AvatarImage src="/assets/icons/logo.svg" />
                        )}
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {(currentUser?.name ?? user.name)[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {currentUser?.name ?? user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            {currentUser?.photoURL ? (
                                <AvatarImage src={currentUser.photoURL} />
                            ) : (
                                <AvatarImage src="/assets/icons/logo.svg" />
                            )}
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {(currentUser?.name ?? user.name)[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-base font-medium text-gray-400'>
                                {currentUser?.name ?? user.name}
                            </span>
                            <span className="text-sm text-gray-500">{currentUser?.email ?? user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600"/>
                <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown
