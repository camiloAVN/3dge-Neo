"use server";

import prisma from "@/lib/prisma";

export const updateUserProfile = async (userId: string, name: string) => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { name: name.trim() },
        });
        return { ok: true };
    } catch {
        return { ok: false, message: 'No se pudo actualizar el perfil' };
    }
};
