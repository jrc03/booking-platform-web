export const ClaimTypes = {
  // Support both classic MS schemas and standard JWT claims
  NameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  Email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  Role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
} as const;

export interface DecodedToken {
  exp: number;
  iss: string;
  aud: string;
  sub?: string;             // Standard JWT Subject (often used instead of NameIdentifier)
  email?: string;           // Standard JWT Email
  role?: string | string[]; // Standard JWT Role
  [ClaimTypes.NameIdentifier]?: string;
  [ClaimTypes.Email]?: string;
  [ClaimTypes.Role]?: string | string[]; 
}

export interface User {
  id: string;
  email: string;
  roles: string[];
}
