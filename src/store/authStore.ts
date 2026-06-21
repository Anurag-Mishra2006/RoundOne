import { persist } from "zustand/middleware";
import {type User} from "../types/index.js";
import {create} from "zustand";

export interface UserState{
    user : User | null,
    isAuthenticate : boolean,
    setUser : (user: User)=> void,
    clearUser: ()=>void
}

const useUserStore = create<UserState>()(persist((set)=>{
    return {
        // initially
        user: null,
        isAuthenticate: false,

        setUser : (user)=>set(()=>{
            return {
                user: user,
                isAuthenticate: true
            }
        }),

        clearUser : ()=>
        {
            set(()=>{
                return {
                    user: null,
                    isAuthenticate : false
                }
            })
        }
        
    }
}, {
    name : "roundone-user-local",
}))
export default useUserStore;