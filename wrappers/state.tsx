import { createContext, useContext, useState } from "react";
import { ApiService } from "../lib/ApiCalls";
import { Status, User } from "../lib/interfaces";

type AuthContextType = {
    user:User,
    login: (user:User) => void,
    logout: () => void,
}

const authContextDefaultValues: AuthContextType = {
    user: null,
    login: async (user:User) => {},
    logout: () => {},
};


const AuthContext = createContext<AuthContextType>(authContextDefaultValues);

export function AppWrapper({ children, userObj }:{ children: JSX.Element[] | JSX.Element, userObj: User }){
    const [user, setUser] = useState<User>(userObj);

    const login = (user:User):void => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>

    );
}

export function useAuth(){
    return useContext(AuthContext);
}