export const keycloak = {
    client_id: "discussion",
    client_secret: "9Kc9f1UtxPnCEosW0iL8saf8cpb3HzKK", // TODO
    redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
    post_logout_redirect_uris: [""],
    response_types: ["code"],
  }