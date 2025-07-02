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
  }
  return keycloakInstance;
};

export default getKeycloakInstance;
