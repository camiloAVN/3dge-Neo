"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LuCircleCheck } from "react-icons/lu";
import { setUserAddress, updateUserProfile } from "@/actions";
import type { Address } from "@/interfaces";

type AccountInputs = {
    name: string;
};

type AddressInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    postalCode: string;
    city: string;
    phone: string;
};

interface Props {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    userAddress: Partial<Address> | null;
}

export const ProfileForm = ({ userId, userName, userEmail, userRole, userAddress }: Props) => {

    const [displayName, setDisplayName] = useState(userName);
    const [accountSaved, setAccountSaved] = useState(false);
    const [addressSaved, setAddressSaved] = useState(false);

    const {
        handleSubmit: handleAccount,
        register: regAccount,
        formState: { isValid: accountValid },
    } = useForm<AccountInputs>({
        defaultValues: { name: userName },
    });

    const {
        handleSubmit: handleAddress,
        register: regAddress,
        formState: { isValid: addressValid },
    } = useForm<AddressInputs>({
        defaultValues: {
            firstName: userAddress?.firstName ?? '',
            lastName: userAddress?.lastName ?? '',
            address: userAddress?.address ?? '',
            address2: userAddress?.address2 ?? '',
            postalCode: userAddress?.postalCode ?? '',
            city: userAddress?.city ?? '',
            phone: userAddress?.phone ?? '',
        },
    });

    const onSubmitAccount = async (data: AccountInputs) => {
        const result = await updateUserProfile(userId, data.name);
        if (result.ok) {
            setDisplayName(data.name);
            setAccountSaved(true);
            setTimeout(() => setAccountSaved(false), 3000);
        }
    };

    const onSubmitAddress = async (data: AddressInputs) => {
        await setUserAddress({ ...data, country: 'CO' }, userId);
        setAddressSaved(true);
        setTimeout(() => setAddressSaved(false), 3000);
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D61C1C] focus:border-transparent outline-none transition-all text-[#111111] bg-white";
    const labelClass =
        "block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5";

    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="space-y-6">

            {/* Avatar strip */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#D61C1C] flex items-center justify-center text-white text-xl font-bold flex-shrink-0 select-none">
                    {initials || '?'}
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-semibold text-[#111111] truncate">{displayName}</p>
                    <p className="text-sm text-[#444444] truncate">{userEmail}</p>
                    <span className={clsx(
                        "inline-block mt-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
                        userRole === 'admin'
                            ? "bg-[#D61C1C]/10 text-[#D61C1C]"
                            : "bg-gray-100 text-[#444444]"
                    )}>
                        {userRole === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                </div>
            </div>

            {/* Personal info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#111111] mb-5">Información personal</h2>
                <form onSubmit={handleAccount(onSubmitAccount)} className="space-y-4">

                    <div>
                        <label className={labelClass}>Nombre completo</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="Tu nombre"
                            {...regAccount('name', { required: true, minLength: 2 })}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Correo electrónico</label>
                        <input
                            type="email"
                            value={userEmail}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#888] cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-[#888]">El correo no puede modificarse.</p>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-1">
                        {accountSaved && (
                            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                                <LuCircleCheck className="w-4 h-4" />
                                Guardado
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={!accountValid}
                            className={clsx(
                                "px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                                accountValid
                                    ? "bg-[#D61C1C] hover:bg-[#b81818] text-white"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            Guardar nombre
                        </button>
                    </div>
                </form>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#111111] mb-5">Dirección de entrega</h2>
                <form onSubmit={handleAddress(onSubmitAddress)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="flex flex-col">
                        <label className={labelClass}>Nombres</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="Juan"
                            {...regAddress('firstName', { required: true })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClass}>Apellidos</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="Pérez"
                            {...regAddress('lastName', { required: true })}
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className={labelClass}>Dirección</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="Calle 123 # 45-67"
                            {...regAddress('address', { required: true })}
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className={labelClass}>Dirección 2 (opcional)</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="Apto 101, Torre B..."
                            {...regAddress('address2')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClass}>Ciudad</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="Bogotá"
                            {...regAddress('city', { required: true })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClass}>Código postal</label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="110111"
                            {...regAddress('postalCode', { required: true })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className={labelClass}>País</label>
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
                            {...regAddress('phone', { required: true })}
                        />
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-end gap-4 pt-1">
                        {addressSaved && (
                            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                                <LuCircleCheck className="w-4 h-4" />
                                Dirección guardada
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={!addressValid}
                            className={clsx(
                                "px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                                addressValid
                                    ? "bg-[#D61C1C] hover:bg-[#b81818] text-white"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            Guardar dirección
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};
