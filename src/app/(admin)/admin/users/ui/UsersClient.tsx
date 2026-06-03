'use client';

import React, { useState } from 'react';
import { createUpdateAdminUser, deleteAdminUser } from '@/actions';
import { useRouter } from 'next/navigation';
import {
  LuCheck,
  LuPencil,
  LuPlus,
  LuShieldCheck,
  LuTrash2,
  LuX,
} from 'react-icons/lu';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  cargo: string | null;
  isActive: boolean;
  role: string;
};

const EMPTY_FORM = {
  id: '',
  name: '',
  email: '',
  password: '',
  cargo: '',
  isActive: true,
};

export function UsersClient({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<Record<string, string>>({});

  function openNew() {
    setForm(EMPTY_FORM);
    setError('');
    setIsOpen(true);
  }

  function openEdit(u: AdminUser) {
    setForm({
      id: u.id,
      name: u.name,
      email: u.email,
      password: '',
      cargo: u.cargo ?? '',
      isActive: u.isActive,
    });
    setError('');
    setIsOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createUpdateAdminUser({
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      email: form.email,
      password: form.password || undefined,
      cargo: form.cargo,
      isActive: form.isActive,
    });

    setLoading(false);
    if (!result.ok) { setError(result.message ?? 'Error'); return; }
    setIsOpen(false);
    router.refresh();
  }

  async function handleToggleActive(u: AdminUser) {
    if (u.id === currentUserId) {
      setActionError({ [u.id]: 'No puedes deshabilitarte a ti mismo' });
      return;
    }
    setActionError({});
    const result = await createUpdateAdminUser({
      id: u.id,
      name: u.name,
      email: u.email,
      cargo: u.cargo ?? '',
      isActive: !u.isActive,
    });
    if (!result.ok) {
      setActionError({ [u.id]: result.message ?? 'Error' });
    } else {
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(null);
    setActionError({});
    const result = await deleteAdminUser(id, currentUserId);
    if (!result.ok) {
      setActionError({ [id]: result.message ?? 'Error' });
    } else {
      router.refresh();
    }
  }

  const isSelf = (id: string) => id === currentUserId;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Usuarios admin</h1>
          <p className="text-sm text-[#444444] mt-1">{users.length} administradores registrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nuevo admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">
            No hay administradores registrados.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Cargo</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Estado</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <React.Fragment key={u.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F8F9FA] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
                          <LuShieldCheck className="w-4 h-4 text-[#D61C1C]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#111111] leading-tight">
                            {u.name}
                            {isSelf(u.id) && (
                              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#D61C1C] bg-red-50 px-1.5 py-0.5 rounded">Tú</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#444444] hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-[#444444] hidden lg:table-cell">{u.cargo || <span className="text-[#BBBBBB]">Sin cargo</span>}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={isSelf(u.id)}
                        title={isSelf(u.id) ? 'No puedes deshabilitarte a ti mismo' : u.isActive ? 'Deshabilitar' : 'Habilitar'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          u.isActive
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-[#444444] hover:bg-gray-200'
                        } disabled:cursor-default disabled:opacity-70`}
                      >
                        {u.isActive ? <LuCheck className="w-3 h-3" /> : <LuX className="w-3 h-3" />}
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === u.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(u.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(u.id); setActionError({}); }}
                            disabled={isSelf(u.id)}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors disabled:opacity-30 disabled:cursor-default"
                            title={isSelf(u.id) ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {actionError[u.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={5} className="px-4 py-2 text-xs text-[#D61C1C]">{actionError[u.id]}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="font-semibold text-[#111111]">
                {form.id ? 'Editar administrador' : 'Nuevo administrador'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Nombre completo *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="Nombre del administrador"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">
                  Contraseña {form.id ? <span className="font-normal text-[#444444]">(dejar en blanco para no cambiar)</span> : '*'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="Mínimo 6 caracteres"
                  required={!form.id}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Cargo</label>
                <input
                  value={form.cargo}
                  onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="Ej. Gerente de tienda, Coordinador de ventas…"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Estado</label>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`w-full border rounded px-3 py-2 text-sm font-medium transition-colors ${
                    form.isActive
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-[#E5E5E5] bg-white text-[#444444]'
                  }`}
                >
                  {form.isActive ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              {error && <p className="text-sm text-[#D61C1C]">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-[#E5E5E5] rounded px-4 py-2.5 text-sm font-medium text-[#444444] hover:bg-[#F8F9FA] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white rounded px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  {loading ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
