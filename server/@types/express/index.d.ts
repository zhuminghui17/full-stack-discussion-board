export {}

declare global {
  namespace Express {
    interface User {
      preferred_username: string
    }
  }
}