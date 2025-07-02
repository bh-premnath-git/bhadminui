// lib/keycloak-config.ts

const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_UI_REDIRECT_URL;

if (!url || !realm || !clientId || !redirectUri) {
  throw new Error(
    'Missing Keycloak configuration. Ensure NEXT_PUBLIC_KEYCLOAK_URL, NEXT_PUBLIC_KEYCLOAK_REALM, NEXT_PUBLIC_KEYCLOAK_CLIENT_ID, and NEXT_PUBLIC_UI_REDIRECT_URL are set in your environment.'
  );
}

const keycloakConfig = {
  url,
  realm,
  clientId,
  redirectUri,
};

export default keycloakConfig;
