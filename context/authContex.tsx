import { Firebase_AUTH } from "@/config/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";

// AuthContext type definition
interface AuthContextProps {
   user: User | null;
   initialized: boolean;
}

// Create context with default values
export const AuthContext = createContext<AuthContextProps>({
   user: null,
   initialized: false,
});

// Custom hook to access AuthContext
export function useAuth() {
   return React.useContext(AuthContext);
}

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [initialized, setInitialized] = useState<boolean>(false);

   useEffect(() => {
       const unsubscribe = onAuthStateChanged(Firebase_AUTH, (user) => {
           setUser(user);
           setInitialized(true);
       });
       return () => unsubscribe(); // Clean-up function
   }, []);

   const value = { user, initialized };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
