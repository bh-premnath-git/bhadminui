// lib/keycloak-service.ts
import Keycloak from 'keycloak-js';
import keycloakConfig from '@/lib/services/keycloak/keycloak-config';

let keycloakInstance: Keycloak | null = null;

const getKeycloakInstance = (): Keycloak => {
  if (typeof window === 'undefined') {
    return {
      init: () => Promise.resolve(false),
      login: () => {},
      logout: () => {},
      authenticated: false,
      token: undefined,
      tokenParsed: undefined,
      subject: undefined,
      realmAccess: undefined,
      resourceAccess: undefined,
    } as unknown as Keycloak;
  }

  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
    const originalLogin = keycloakInstance.login.bind(keycloakInstance);
    keycloakInstance.login = (...args: any[]) => {
      console.log("[Keycloak] login called", args);
      return originalLogin(...args);
    };

    const originalLogout = keycloakInstance.logout.bind(keycloakInstance);
    keycloakInstance.logout = (...args: any[]) => {
      console.log("[Keycloak] logout called", args);
      return originalLogout(...args);
    };
  }
  return keycloakInstance;
};

export default getKeycloakInstance;
