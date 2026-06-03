"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
    categorySlug?: string;
}

export const getPaginationProductWithImages = async({
    page = 1,
    take = 12,
    categorySlug
}:PaginationOptions) =>{

    if( isNaN(Number(page))) page = 1;
    if(page < 1) page = 1;

    const where = categorySlug ? { category: { slug: categorySlug } } : {};

    try {
        const products = await prisma.product.findMany({
            take: take,
            skip: (page-1) * take,
            include:{
                images:{
                    take:2,
                    select:{
                        url:true
                    }
                }
            },
            where
        })

        const totalCount = await prisma.product.count({ where });
        const totalPages = Math.ceil(totalCount / take);

        return{
            currentPage:page,
            totalPages:totalPages,
            products: products.map(product =>({
                ...product,
                images: product.images.map(image => image.url)
            }))
        }

    } catch (error) {
        throw new Error("no se pudo cargar los productos")
    }
}