"use client"
import { Building2, Users, LogOut, Moon, Sun, Shield, BarChart2 } from "lucide-react"
import type React from "react"

import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/features/auth/auth-slice"
import type { AppDispatch, RootState } from "@/lib/store"

const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    url: "/",
  },
  {
    title: "Tenant Management",
    icon: Building2,
    url: "/tenants",
  },
  {
    title: "Role Management",
    icon: Shield,
    url: "/roles",
  },
  {
    title: "User Management",
    icon: Users,
    url: "/users",
  },
]

export function AdminSidebar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { state } = useSidebar()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { tokenParsed } = useSelector((state: RootState) => state.auth)

  // Ensure theme is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  const getInitials = (name?: string) => {
    if (!name)
      return "AD"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Sidebar
        collapsible="icon"
        style={
          {
            "--sidebar-width": "14rem",
            "--sidebar-width-mobile": "16rem",
          } as React.CSSProperties
        }
      >
        <SidebarHeader>
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-foreground transition-all duration-300 ease-in-out whitespace-nowrap group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">
                  bh-admin
                </h2>
              </div>
              <SidebarTrigger className="h-7 w-7" />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse">Loading...</div>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  const currentTheme = resolvedTheme || theme
  const isDark = currentTheme === "dark"
  const isExpanded = state === "expanded"

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "16rem",
        } as React.CSSProperties
      }
    >
      <SidebarHeader>
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-foreground transition-all duration-300 ease-in-out whitespace-nowrap group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">
                bh-admin
              </h2>
            </div>
            <SidebarTrigger className="h-7 w-7" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t border-sidebar-border bg-sidebar">
          {/* Theme toggle section - moved to top */}
          <div className={cn("px-3 pt-3", isExpanded ? "flex justify-between items-center" : "flex justify-center")}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 relative">
                    <div className="relative">
                      <Switch
                        checked={isDark}
                        onCheckedChange={handleThemeToggle}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input scale-75 h-4 w-8"
                      />
                      {/* Custom thumb with icon */}
                      <div
                        className={cn(
                          "absolute top-0 left-0 pointer-events-none",
                          "h-5 w-10 flex items-center",
                          "transition-all duration-300",
                        )}
                      >
                        <div
                          className={cn(
                            "h-[18px] w-[18px] rounded-full flex items-center justify-center",
                            "transition-all duration-300 transform shadow-sm",
                            isDark ? "translate-x-[18px] bg-primary/90" : "translate-x-[2px] bg-amber-50",
                          )}
                        >
                          {isDark ? (
                            <Moon className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]" />
                          ) : (
                            <Sun className="h-3 w-3 text-amber-600 drop-shadow-[0_0_1px_rgba(180,83,9,0.3)]" />
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <span
                        className={cn(
                          "text-sm ml-1 font-medium",
                          isDark ? "text-sidebar-foreground" : "text-amber-600",
                        )}
                      >
                        {isDark ? "Dark" : "Light"}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{isDark ? "Switch to light mode" : "Switch to dark mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* User profile section - moved to bottom */}
          <div className={cn("p-3 flex items-center", isExpanded ? "justify-between" : "justify-center")}>
            {!isExpanded ? (
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 transition-transform duration-200 hover:scale-110"
                        >
                          <Avatar className="h-8 w-8 border border-sidebar-border">
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt={tokenParsed?.name || "Admin User"}
                            />
                            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-medium text-sm">
                              {getInitials(tokenParsed?.name)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{tokenParsed?.name || "Admin User"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent
                  align="end"
                  className="z-[110] w-auto min-w-[8rem]"
                >
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 transition-transform duration-200 hover:scale-110"
                    >
                      <Avatar className="h-8 w-8 border border-sidebar-border">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={tokenParsed?.name || "Admin User"}
                        />
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-medium text-sm">
                          {getInitials(tokenParsed?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="z-[110] min-w-[14rem]"
                  >
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1 w-0 ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate text-sidebar-foreground">
                    {tokenParsed?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {tokenParsed?.email || "admin@company.com"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
