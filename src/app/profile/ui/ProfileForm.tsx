'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { setUserAddress, updateUserProfile } from '@/actions';
import type { Address } from '@/interfaces';
import styles from '../profile.module.css';

type AccountInputs = { name: string };

type AddressInputs = {
  firstName:  string;
  lastName:   string;
  address:    string;
  address2:   string;
  postalCode: string;
  city:       string;
  phone:      string;
};

interface Props {
  userId:      string;
  userName:    string;
  userEmail:   string;
  userRole:    string;
  userAddress: Partial<Address> | null;
}

export const ProfileForm = ({ userId, userName, userEmail, userRole, userAddress }: Props) => {
  const [displayName,  setDisplayName]  = useState(userName);
  const [accountSaved, setAccountSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  const {
    handleSubmit: handleAccount,
    register: regAccount,
    formState: { isValid: accountValid },
  } = useForm<AccountInputs>({ defaultValues: { name: userName } });

  const {
    handleSubmit: handleAddress,
    register: regAddress,
    formState: { isValid: addressValid },
  } = useForm<AddressInputs>({
    defaultValues: {
      firstName:  userAddress?.firstName  ?? '',
      lastName:   userAddress?.lastName   ?? '',
      address:    userAddress?.address    ?? '',
      address2:   userAddress?.address2   ?? '',
      postalCode: userAddress?.postalCode ?? '',
      city:       userAddress?.city       ?? '',
      phone:      userAddress?.phone      ?? '',
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

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={styles.right}>
      <div className={styles.rightInner}>

        <Link href="/cuenta" className={styles.rightBack}>
          ← Mi cuenta
        </Link>

        {/* ── Avatar strip ── */}
        <div className={styles.avatarStrip}>
          <div className={styles.avatar}>{initials || '?'}</div>
          <div>
            <div className={styles.avatarName}>{displayName}</div>
            <div className={styles.avatarEmail}>{userEmail}</div>
            <span className={`${styles.badge} ${userRole === 'admin' ? styles.badgeAdmin : ''}`}>
              {userRole === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
        </div>

        {/* ── Section: Información personal ── */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Información personal</p>

          <form onSubmit={handleAccount(onSubmitAccount)}>
            <div className={styles.field} style={{ marginBottom: '14px' }}>
              <label className={styles.label}>Nombre completo</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Tu nombre"
                {...regAccount('name', { required: true, minLength: 2 })}
              />
            </div>

            <div className={styles.field} style={{ marginBottom: '4px' }}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                type="email"
                value={userEmail}
                readOnly
                className={styles.inputReadonly}
              />
              <span className={styles.hint}>El correo no puede modificarse.</span>
            </div>

            <div className={styles.actions}>
              {accountSaved && <span className={styles.saved}>✓ Guardado</span>}
              <button
                type="submit"
                disabled={!accountValid}
                className={styles.submit}
              >
                <span>Guardar nombre</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>

        <div className={styles.sectionDivider} />

        {/* ── Section: Dirección ── */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Dirección de entrega</p>

          <form onSubmit={handleAddress(onSubmitAddress)} className={styles.grid}>

            <div className={styles.field}>
              <label className={styles.label}>Nombres</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Juan"
                {...regAddress('firstName', { required: true })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Apellidos</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Pérez"
                {...regAddress('lastName', { required: true })}
              />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Dirección</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Calle 123 # 45-67"
                {...regAddress('address', { required: true })}
              />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Dirección 2 (opcional)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Apto 101, Torre B…"
                {...regAddress('address2')}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ciudad</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Bogotá"
                {...regAddress('city', { required: true })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Código postal</label>
              <input
                type="text"
                className={styles.input}
                placeholder="110111"
                {...regAddress('postalCode', { required: true })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>País</label>
              <div className={styles.static}>Colombia</div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Teléfono</label>
              <input
                type="text"
                className={styles.input}
                placeholder="+57 300 123 4567"
                {...regAddress('phone', { required: true })}
              />
            </div>

            <div className={`${styles.fieldFull} ${styles.actions}`}>
              {addressSaved && <span className={styles.saved}>✓ Dirección guardada</span>}
              <button
                type="submit"
                disabled={!addressValid}
                className={styles.submit}
              >
                <span>Guardar dirección</span>
                <span>→</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
