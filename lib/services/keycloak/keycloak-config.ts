// lib/keycloak-config.ts

const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL || "";
const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "";
const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "";
const redirectUri = process.env.NEXT_PUBLIC_UI_REDIRECT_URL || "";

const keycloakConfig = {
  url,
  realm,
  clientId,
  redirectUri,
};

export default keycloakConfig;
