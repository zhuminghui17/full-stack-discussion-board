export const keycloak = {
    client_id: "discussion",
    client_secret: "Y9axU1QLEntKwaOXGC3KkwDq2BqgtB0j", // TODO
    redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
    post_logout_redirect_uris: [""],
    response_types: ["code"],
  }