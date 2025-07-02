import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { KeycloakProvider } from "@/components/keycloak-provider"
import { AdminLayout } from "@/components/admin-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tenant Onboarding Admin",
  description: "Admin dashboard for managing tenant onboarding",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <KeycloakProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <AdminLayout>{children}</AdminLayout>
            </ThemeProvider>
          </KeycloakProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
