"use server";

import prisma from "@/lib/prisma"


export const deleteUserAddress = async (userId: string) =>{
    try {
       const deleted = await prisma.userAddress.delete({
            where:{userId}
        });

        return{
            ok: true,
        }
        
    } catch (error) {
        console.log(error)
        return{
            ok:false,
            message:'no se pudo borrar la direccion de la base de datos'
        }
        
    }

}