'use client'

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import getKeycloakInstance from "@/lib/services/keycloak/keycloak-service"
import {
  setKeycloak,
  setAuthenticated,
  setToken,
} from "@/lib/features/auth/auth-slice"
import type { AppDispatch } from "@/lib/store"
import { LazyLoading } from "./LazyLoading"

interface KeycloakProviderProps {
  children: React.ReactNode
}

export function KeycloakProvider({ children }: KeycloakProviderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const kcInstance = getKeycloakInstance()

    dispatch(setKeycloak(kcInstance))

    kcInstance
      .init({ onLoad: "login-required" })
      .then((auth) => {
        dispatch(setAuthenticated(auth))
        dispatch(
          setToken({ token: kcInstance.token, tokenParsed: kcInstance.tokenParsed })
        )
      })
      .catch((error) => {
        console.error("Keycloak init failed:", error)
        dispatch(setAuthenticated(false))
      })
      .finally(() => {
        setIsLoading(false)
      })

    kcInstance.onAuthSuccess = () => {
      dispatch(setAuthenticated(true))
      dispatch(
        setToken({ token: kcInstance.token, tokenParsed: kcInstance.tokenParsed })
      )
    }

    kcInstance.onAuthError = (errorData) => {
      console.error("Auth Error:", errorData)
      dispatch(setAuthenticated(false))
    }

    kcInstance.onAuthRefreshSuccess = () => {
      dispatch(
        setToken({ token: kcInstance.token, tokenParsed: kcInstance.tokenParsed })
      )
    }

    kcInstance.onAuthRefreshError = () => {
      console.error("Token Refresh Error")
      dispatch(setAuthenticated(false))
    }

    kcInstance.onAuthLogout = () => {
      dispatch(setAuthenticated(false))
    }
  }, [dispatch])

  if (isLoading) {
    return <LazyLoading fullScreen={true} message="Loading..." />
  }

  return <>{children}</>
}
