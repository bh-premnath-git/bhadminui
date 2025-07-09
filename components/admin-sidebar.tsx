"use client"
import { Building2, Moon, Sun, BarChart2, LogOut } from "lucide-react"
import type React from "react"

import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useDispatch } from "react-redux"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
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
import type { AppDispatch } from "@/lib/store"

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
]

export function AdminSidebar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { state } = useSidebar()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const dispatch: AppDispatch = useDispatch()

  // Ensure theme is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  const handleLogout = () => {
    dispatch(logout())
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
          <div className={cn("p-3", isExpanded ? "flex justify-between items-center" : "flex justify-center")}>
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
          <div className="p-3">
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
