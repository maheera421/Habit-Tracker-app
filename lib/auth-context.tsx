import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

// info we want to keep track of
type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isLoadingUser: boolean;
    signUp: (email: string, password: string ) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType |undefined>(undefined);

export function AuthProvider({children} : {children: React.ReactNode}) {
    // track of user functionality
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null
    );

    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

    // runs when the page open/reloads
    useEffect(() => {
        getUser();
    }, []);

    // to get user
    const getUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    // sign up functionality
    const signUp = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email, password);
            await signIn(email, password);
            return null;
        } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }

        return "An error occured during signup";
     }
    };

    // sign in functionality
    const signIn = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const session = await account.get();
            setUser(session);
            return null;
        } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }

        return "An error occured during sign in";
        }
    };

    // sign out functionality
    const signOut = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

    // calling of these functionalities
    return (
        <AuthContext.Provider value={{ user, isLoadingUser, signUp, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be inside of the AuthProvider");
    }

    return context;

}
