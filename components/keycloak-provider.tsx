'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import getKeycloakInstance from '@/lib/services/keycloak/keycloak-service';
import {
  setKeycloak,
  setAuthenticated,
  setToken,
  generateToken,
} from '@/lib/features/auth/auth-slice';
import type { AppDispatch } from '@/lib/store';
import { LazyLoading } from './LazyLoading';

interface Props {
  children: React.ReactNode;
}

export function KeycloakProvider({ children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    /** ------------------------------------------------------------------
     *  1.  Obtain (or create) the singleton instance
     * ------------------------------------------------------------------ */
    const kc = getKeycloakInstance();
    dispatch(setKeycloak(kc));

    /** ------------------------------------------------------------------
     *  2.  Helper that pushes tokens into Redux
     * ------------------------------------------------------------------ */
    const syncTokens = () =>
      dispatch(
        setToken({ token: kc.token, tokenParsed: kc.tokenParsed }),
      );

    /** ------------------------------------------------------------------
     *  3.  Init
     *      - Disable the iframe when 3-rd-party cookies are blocked
     *      - PKCE S256 is mandatory for public SPA clients as of Keycloak 24
     * ------------------------------------------------------------------ */
    kc.init({
      onLoad: 'login-required',
      checkLoginIframe: false,              // fixes Safari / Brave
      pkceMethod: 'S256',
      redirectUri: window.location.origin,  // avoid stale .env
    })
      .then(async (authenticated) => {
        if (!authenticated) {
          // We’re still unauthenticated – send user to IdP
          return kc.login({ redirectUri: window.location.href });
        }

        // Auth OK
        dispatch(setAuthenticated(true));
        syncTokens();
        await dispatch(generateToken(kc.token!)).unwrap();
      })
      .catch((err) => {
        console.error('[Keycloak] init error →', err);
        dispatch(setAuthenticated(false));
      })
      .finally(() => setBootDone(true));

    /** ------------------------------------------------------------------
     *  4.  Keycloak event hooks
     * ------------------------------------------------------------------ */
    kc.onAuthSuccess = () => {
      dispatch(setAuthenticated(true));
      syncTokens();
    };

    kc.onAuthError = (err) => {
      console.error('[Keycloak] auth error', err);
      dispatch(setAuthenticated(false));
    };

    kc.onAuthRefreshSuccess = syncTokens;

    kc.onAuthLogout = () => {
      dispatch(setAuthenticated(false));
    };

    kc.onTokenExpired = () => {
      kc.updateToken(30).catch(() => kc.login());
    };
  }, [dispatch]);

  /* --------------------------------------------------------------------- */
  /*  Render                                                              */
  /* --------------------------------------------------------------------- */
  if (!bootDone) {
    return <LazyLoading fullScreen message="Loading…" />;
  }
  return <>{children}</>;
}
