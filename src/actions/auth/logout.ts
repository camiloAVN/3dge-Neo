"use server";

import { signOut } from "@/auth";


export const logout = async() =>{
    await signOut();
    
}
// todo: cambiar la version de auth.js a una estable 
