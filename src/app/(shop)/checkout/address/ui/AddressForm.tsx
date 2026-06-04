'use client';

import type { Address } from '@/interfaces';
import { useForm } from 'react-hook-form';
import { useAddressStore } from '@/store';
import { useSession } from 'next-auth/react';
import { setUserAddress } from '@/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../address.module.css';

type FormInputs = {
  firstName:  string;
  lastName:   string;
  address:    string;
  address2:   string;
  postalCode: string;
  city:       string;
  country:    string;
  phone:      string;
};

interface Props {
  userStoreAddress?: Partial<Address>;
}

export const AddressForm = ({ userStoreAddress = {} }: Props) => {
  const router = useRouter();

  const { handleSubmit, register, formState: { isValid } } = useForm<FormInputs>({
    defaultValues: {
      country: 'CO',
      ...(userStoreAddress as any),
    },
  });

  const { data: session } = useSession({ required: true });
  const setAddress = useAddressStore(state => state.setAddress);

  const onSubmit = async (data: FormInputs) => {
    const addressData = { ...data, country: 'CO' };
    setAddress(addressData);
    await setUserAddress(addressData, session!.user.id);
    router.push('/checkout');
  };

  return (
    <div className={styles.right}>
      <div className={styles.rightInner}>

        <Link href="/products" className={styles.rightBack}>
          ← Volver a productos
        </Link>

        <h1 className={styles.heading}>Dirección</h1>
        <div className={styles.rule} />
        <p className={styles.subtitle}>Datos de entrega</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.grid}>

          <div className={styles.field}>
            <label className={styles.label}>Nombres</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Juan"
              {...register('firstName', { required: true })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Apellidos</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Pérez"
              {...register('lastName', { required: true })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Dirección</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Calle 123 # 45-67"
              {...register('address', { required: true })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Dirección 2 (opcional)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Apto 101, Torre B…"
              {...register('address2')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Código postal</label>
            <input
              type="text"
              className={styles.input}
              placeholder="110111"
              {...register('postalCode', { required: true })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ciudad</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Bogotá"
              {...register('city', { required: true })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>País</label>
            <input type="hidden" value="CO" {...register('country')} />
            <div className={styles.static}>Colombia</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Teléfono</label>
            <input
              type="text"
              className={styles.input}
              placeholder="+57 300 123 4567"
              {...register('phone', { required: true })}
            />
          </div>

          <div className={`${styles.field} ${styles.fieldFull} ${styles.actions}`}>
            <button
              type="submit"
              disabled={!isValid}
              className={styles.submit}
            >
              <span>Continuar al pago</span>
              <span>→</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
