"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Blocks, Bot, LayoutDashboard, LogOut, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const nav = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: (p: string) => p === "/dashboard",
  },
  {
    label: "Agents",
    href: "/dashboard/agents",
    icon: Bot,
    match: (p: string) => p.startsWith("/dashboard/agents") || p.startsWith("/dashboard/bots"),
  },
  {
    label: "Plugins",
    href: "/dashboard/plugins",
    icon: Blocks,
    match: (p: string) => p.startsWith("/dashboard/plugins"),
  },
];

export function AppSidebar({ email, agentCount }: { email: string; agentCount: number }) {
  const pathname = usePathname();
  const initial = (email?.[0] ?? "U").toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot size={17} />
          </div>
          <span className="font-title text-base font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            Support<span className="text-muted-foreground">AI</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", bounce: 0.3, duration: 0.4 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={item.match(pathname)}
                        tooltip={item.label}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.label === "Agents" && agentCount > 0 && (
                        <SidebarMenuBadge>{agentCount}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard/account" />}
                isActive={pathname === "/dashboard/account"}
                tooltip="Settings"
              >
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton tooltip={email} className="h-auto py-1.5">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-[11px] text-primary-foreground">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{email || "Account"}</span>
                      </motion.div>
                    </SidebarMenuButton>
                  }
                />
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                    {email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<a href="/api/auth/logout" />}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
