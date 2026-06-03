'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { createUpdateCategory, deleteCategory, uploadCategoryImage } from '@/actions';
import { useRouter } from 'next/navigation';
import { LuImagePlus, LuPencil, LuPlus, LuStar, LuTrash2, LuX } from 'react-icons/lu';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  _count: { products: number };
};

const EMPTY_FORM = {
  id: '',
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
};

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setError('');
    setImageFile(null);
    setImagePreview('');
    setIsOpen(true);
  }

  function openEdit(cat: Category) {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      imageUrl: cat.imageUrl ?? '',
      isActive: cat.isActive,
      isFeatured: cat.isFeatured ?? false,
      sortOrder: cat.sortOrder,
    });
    setSlugEdited(true);
    setError('');
    setImageFile(null);
    setImagePreview(cat.imageUrl ?? '');
    setIsOpen(true);
  }

  function handleNameChange(value: string) {
    setForm(f => ({
      ...f,
      name: value,
      slug: slugEdited ? f.slug : slugify(value),
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview('');
    setForm(f => ({ ...f, imageUrl: '' }));
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    let imageUrl = form.imageUrl;

    if (imageFile) {
      const fd = new FormData();
      fd.append('file', imageFile);
      const uploadResult = await uploadCategoryImage(fd);
      if (!uploadResult.ok) {
        setError(uploadResult.message ?? 'Error al subir la imagen');
        setLoading(false);
        return;
      }
      imageUrl = uploadResult.url;
    }

    const result = await createUpdateCategory({
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      slug: form.slug,
      description: form.description,
      imageUrl: imageUrl || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      sortOrder: Number(form.sortOrder),
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? 'Error desconocido');
      return;
    }

    setIsOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(null);
    setDeleteError({});
    const result = await deleteCategory(id);
    if (!result.ok) {
      setDeleteError({ [id]: result.message ?? 'Error al eliminar' });
    } else {
      router.refresh();
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Categorías</h1>
          <p className="text-sm text-[#444444] mt-1">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">
            No hay categorías. Crea la primera.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Orden</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Imagen</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Descripción</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Productos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Destacada</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <React.Fragment key={cat.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 text-[#444444] text-center">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-8 rounded overflow-hidden bg-[#F8F9FA] flex items-center justify-center mx-auto">
                        {cat.imageUrl ? (
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            width={48}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LuImagePlus className="w-4 h-4 text-[#CCCCCC]" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111111]">{cat.name}</td>
                    <td className="px-4 py-3 text-[#444444] font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                    <td className="px-4 py-3 text-[#444444] hidden lg:table-cell max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-4 py-3 text-center text-[#444444]">{cat._count.products}</td>
                    <td className="px-4 py-3 text-center">
                      {cat.isFeatured
                        ? <LuStar className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
                        : <span className="text-[#CCCCCC] text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-[#444444]'}`}>
                        {cat.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === cat.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(cat.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(cat.id); setDeleteError({}); }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {deleteError[cat.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={9} className="px-4 py-2 text-xs text-[#D61C1C]">{deleteError[cat.id]}</td>
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
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-[#111111]">
                {form.id ? 'Editar categoría' : 'Nueva categoría'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">
                  Imagen de categoría
                </label>
                <div
                  className="relative aspect-[3/2] rounded-lg overflow-hidden border-2 border-dashed border-[#E5E5E5] bg-[#F8F9FA] cursor-pointer hover:border-[#D61C1C] transition-colors group"
                  onClick={() => imageInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Cambiar imagen
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none">
                      <LuImagePlus className="w-8 h-8 text-[#CCCCCC]" />
                      <span className="text-xs text-[#BBBBBB] font-medium">Haz clic para subir una imagen</span>
                      <span className="text-xs text-[#CCCCCC]">JPG, PNG, WEBP · Máx. 5 MB</span>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-xs text-[#D61C1C] hover:underline mt-1.5 block"
                  >
                    Quitar imagen
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Nombre *</label>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="Ej. Ropa"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm font-mono text-[#444444] focus:outline-none focus:border-[#111111]"
                  placeholder="ropa"
                  required
                />
                <p className="text-xs text-[#444444] mt-1">Identificador único en URLs. Se genera automáticamente del nombre.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
                  placeholder="Descripción breve de la categoría"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#444444] mb-1.5">Orden de visualización</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#444444] mb-1.5">Estado</label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                    className={`w-full border rounded px-3 py-2 text-sm font-medium transition-colors ${form.isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-[#E5E5E5] bg-white text-[#444444]'}`}
                  >
                    {form.isActive ? 'Activa' : 'Inactiva'}
                  </button>
                </div>
              </div>

              {/* Featured checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E5E5] hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#D61C1C] cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-[#111111] flex items-center gap-1.5">
                    <LuStar className={`w-3.5 h-3.5 ${form.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-[#CCCCCC]'}`} />
                    Categoría destacada
                  </p>
                  <p className="text-xs text-[#444444] mt-0.5">
                    Se mostrará en la sección de categorías destacadas de la ventana principal
                  </p>
                </div>
              </label>

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
