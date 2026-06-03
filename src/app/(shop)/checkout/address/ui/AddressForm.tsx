"use client";

import clsx from "clsx";
import type { Address } from "@/interfaces";
import { useForm } from "react-hook-form";
import { useAddressStore } from "@/store";
import { useSession } from "next-auth/react";
import { setUserAddress } from "@/actions";
import { useRouter } from "next/navigation";

type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
}

interface Props {
    userStoreAddress?: Partial<Address>;
}

export const AddressForm = ({ userStoreAddress = {} }: Props) => {

    const router = useRouter();

    const { handleSubmit, register, formState: { isValid } } = useForm<FormInputs>({
        defaultValues: {
            country: 'CO',
            ...(userStoreAddress as any),
        }
    });

    const { data: session } = useSession({ required: true });

    const setAddress = useAddressStore(state => state.setAddress);

    const onSubmit = async (data: FormInputs) => {
        const addressData = { ...data, country: 'CO' };
        setAddress(addressData);
        await setUserAddress(addressData, session!.user.id);
        router.push('/checkout');
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D61C1C] focus:border-transparent outline-none transition-all text-[#111111] bg-white";

    const labelClass =
        "block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div className="flex flex-col">
                <label className={labelClass}>Nombres</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Juan"
                    {...register('firstName', { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>Apellidos</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Pérez"
                    {...register('lastName', { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>Dirección</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Calle 123 # 45-67"
                    {...register('address', { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>Dirección 2 (opcional)</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Apto 101, Torre B..."
                    {...register('address2')}
                />
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>Código postal</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="110111"
                    {...register('postalCode', { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>Ciudad</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Bogotá"
                    {...register('city', { required: true })}
                />
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>País</label>
                <input type="hidden" value="CO" {...register('country')} />
                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#111111]">
                    Colombia
                </div>
            </div>

            <div className="flex flex-col">
                <label className={labelClass}>Teléfono</label>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="+57 300 123 4567"
                    {...register('phone', { required: true })}
                />
            </div>

            <div className="sm:col-span-2 flex justify-end mt-2">
                <button
                    type="submit"
                    disabled={!isValid}
                    className={clsx(
                        "w-full sm:w-1/2 py-3 rounded-xl font-semibold text-sm transition-colors",
                        {
                            "bg-[#D61C1C] hover:bg-[#b81818] text-white cursor-pointer": isValid,
                            "bg-gray-200 text-gray-400 cursor-not-allowed": !isValid,
                        }
                    )}
                >
                    Siguiente
                </button>
            </div>

        </form>
    );
};
