export const revalidate = 60 // se relavida cada 60 seg

import { getPaginationProductWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Gender } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

const seedProducts = initialData.products;

interface Props {
    params:Promise<{
        gender:string;
    }>
  searchParams:Promise<{
    page?: string;
  }>
}

export default async function GenderPage({params, searchParams}:Props){

    const {gender} = await params;
    const parametros = await searchParams
    const page = parametros.page ? parseInt(parametros.page) : 1;

    const {products, currentPage, totalPages}= await getPaginationProductWithImages({page, gender: gender as Gender});

    if (products.length === 0){
    redirect(`/gender/${gender}`);
    }



    const labels: Record<string, string> = {
        'men': 'Hombres',
        'women': 'Mujeres',
        'kid': 'Ninios',
        'unisex': 'Todos',
    }

    // if(id === 'telegram'){
    //     notFound();


    // }

    return(
        <>
            <Title
              title={`Articulos de ${labels[gender]}`}
              subtitle="Todos los products"
              className="mb-2 text-white"
            />
            <ProductGrid products={products}/>

            <Pagination totalPages={totalPages}/>
        </>

    )
}