// These keys match the C# ClaimTypes exactly
export const ClaimTypes = {
  NameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  Email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  Role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
} as const;

// This is what jwt-decode will return when it parses the .NET token
export interface DecodedToken {
  exp: number; // Expiration time (UNIX timestamp)
  iss: string; // Issuer
  aud: string; // Audience
  [ClaimTypes.NameIdentifier]: string;
  [ClaimTypes.Email]: string;
  // If the user has multiple roles (Guest, Host), .NET sends an array. If one role, it sends a string.
  [ClaimTypes.Role]?: string | string[]; 
}

// This is the clean object our React components will actually use
export interface User {
  id: string;
  email: string;
  roles: string[];
}
