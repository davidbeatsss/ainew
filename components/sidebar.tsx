"use client";

import { cn } from "@/lib/utils";
import { Home, Plus, Route, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
const pathname = usePathname();
const router = useRouter();
const routes = [
    {
        icon: Home,
        href: "/",
        label: "Дом",
        pro: false,
    },
    {
        icon: Plus,
        href: "/companion/new",
        label: "Плюс",
        pro: true,
    },
    {
        icon: Settings,
        href: "/settings",
        label: "Меню",
        pro: false,
    }
];

const onNavigate = (url: string, pro: boolean) => {
    //  TODO: Check if PRO

    return router.push(url);
}

    return (        
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
     <div className="p-3 flex flex-1 justify-center">
      <div className="space-y-2">
             {routes.map((route) => (
                 <div
                 onClick={() => onNavigate(route.href, route.pro    )}                     key={route.href}
                     className={cn(
                         "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                         pathname === route.href && "bg-primary/10 text-primary"
                     )}
                  >
    <div className="flex flex-col gap-y-2 items-center flex-1">
        <route.icon className="h-4 w-5" />
         {route.label}
        </div>              
            </div>   
             ))}
         </div>
        </div>
    </div>
    );
}