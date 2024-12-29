// types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string; // Adding the id field to the session user object
      role?: 'user' | 'admin';
      isVerifiedByAdmin?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string; // Add the id field to the JWT as well
    role?: 'user' | 'admin';
    isVerifiedByAdmin?: boolean;
  }
}
