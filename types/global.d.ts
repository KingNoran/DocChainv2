export {}

// Create a type for the roles
export type Roles = 'ADMIN' | 'REGISTRAR' | 'STUDENT    '

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}