'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { createUpdateProduct, deleteProduct, deleteProductImage, uploadProductImage } from '@/actions';
import { useRouter } from 'next/navigation';
import { LuImagePlus, LuPencil, LuPlus, LuSearch, LuTrash2, LuX } from 'react-icons/lu';

type ProductImage = { id: number; url: string };

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  tags: string[];
  categoryId: string;
  category: { id: string; name: string };
  images: ProductImage[];
};

type Category = { id: string; name: string };

const EMPTY_FORM = {
  id: '',
  title: '',
  slug: '',
  description: '',
  categoryId: '',
  inStock: '',
  tags: '',
  baseCost: '',
  marginPct: '',
  marginAmt: '',
  price: '',
};

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

function getImageSrc(url: string) {
  return url.startsWith('http') ? url : `/products/${url}`;
}

export function ProductsClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<Record<string, string>>({});

  // Image state
  const [savedImages, setSavedImages] = useState<ProductImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock-asc' | 'stock-desc' | 'price-asc' | 'price-desc'>('name');

  const filtered = products
    .filter(p => {
      const matchesName = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCategory ? p.categoryId === filterCategory : true;
      return matchesName && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'stock-asc')  return a.inStock - b.inStock;
      if (sortBy === 'stock-desc') return b.inStock - a.inStock;
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.title.localeCompare(b.title, 'es');
    });

  // Price calculation
  function recalcFromCost(cost: string, pct: string) {
    const c = parseFloat(cost) || 0;
    const p = parseFloat(pct) || 0;
    const amt = c * p / 100;
    return { marginAmt: amt ? amt.toFixed(0) : '', price: (c + amt).toFixed(0) };
  }

  function handleBaseCostChange(value: string) {
    const { marginAmt, price } = recalcFromCost(value, form.marginPct);
    setForm(f => ({ ...f, baseCost: value, marginAmt, price }));
  }

  function handleMarginPctChange(value: string) {
    const { marginAmt, price } = recalcFromCost(form.baseCost, value);
    setForm(f => ({ ...f, marginPct: value, marginAmt, price }));
  }

  function handleMarginAmtChange(value: string) {
    const cost = parseFloat(form.baseCost) || 0;
    const amt = parseFloat(value) || 0;
    const pct = cost > 0 ? (amt / cost * 100).toFixed(1) : '';
    setForm(f => ({ ...f, marginAmt: value, marginPct: pct, price: (cost + amt).toFixed(0) }));
  }

  function openNew() {
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setError('');
    setSavedImages([]);
    setPendingFiles([]);
    setPendingPreviews([]);
    setIsOpen(true);
  }

  function openEdit(p: Product) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      inStock: String(p.inStock),
      tags: p.tags.join(', '),
      baseCost: String(p.price),
      marginPct: '',
      marginAmt: '',
      price: String(p.price),
    });
    setSlugEdited(true);
    setError('');
    setSavedImages(p.images);
    setPendingFiles([]);
    setPendingPreviews([]);
    setIsOpen(true);
  }

  function handleTitleChange(value: string) {
    setForm(f => ({
      ...f,
      title: value,
      slug: slugEdited ? f.slug : slugify(value),
    }));
  }

  function handleImageFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPendingFiles(prev => [...prev, ...files]);
    setPendingPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  function removePending(index: number) {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
    setPendingPreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function removeSaved(img: ProductImage) {
    await deleteProductImage(img.id, img.url);
    setSavedImages(prev => prev.filter(i => i.id !== img.id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const price = parseFloat(form.price) || 0;
    if (price <= 0) {
      setError('El precio de venta debe ser mayor a 0');
      setLoading(false);
      return;
    }

    const result = await createUpdateProduct({
      ...(form.id ? { id: form.id } : {}),
      title: form.title,
      slug: form.slug,
      description: form.description,
      price,
      inStock: parseInt(form.inStock) || 0,
      categoryId: form.categoryId,
      tags: form.tags,
    });

    if (!result.ok) {
      setError(result.message ?? 'Error desconocido');
      setLoading(false);
      return;
    }

    // Upload pending images
    if (pendingFiles.length > 0) {
      for (const file of pendingFiles) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('productId', result.productId);
        await uploadProductImage(fd);
      }
    }

    setLoading(false);
    setIsOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(null);
    setDeleteError({});
    const result = await deleteProduct(id);
    if (!result.ok) {
      setDeleteError({ [id]: result.message ?? 'Error al eliminar' });
    } else {
      router.refresh();
    }
  }

  const priceTotal = parseFloat(form.price) || 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Productos</h1>
          <p className="text-sm text-[#444444] mt-1">{products.length} productos registrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o serial…"
            className="w-full border border-[#E5E5E5] rounded pl-9 pr-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white sm:w-48"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white sm:w-52"
        >
          <option value="name">Ordenar: Nombre A–Z</option>
          <option value="stock-asc">Ordenar: Menor stock primero</option>
          <option value="stock-desc">Ordenar: Mayor stock primero</option>
          <option value="price-asc">Ordenar: Menor precio primero</option>
          <option value="price-desc">Ordenar: Mayor precio primero</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">No hay productos. Crea el primero.</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">No se encontraron productos con ese filtro.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] w-12" />
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Precio venta</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Stock</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      {p.images[0] ? (
                        <div className="w-10 h-10 rounded overflow-hidden bg-[#F8F9FA] flex-shrink-0">
                          <Image
                            src={getImageSrc(p.images[0].url)}
                            alt={p.title}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#F8F9FA] flex items-center justify-center flex-shrink-0">
                          <LuImagePlus className="w-4 h-4 text-[#E5E5E5]" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#111111]">{p.title}</p>
                      <p className="text-xs text-[#444444] font-mono">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[#444444] hidden md:table-cell">{p.category.name}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#111111]">{formatCOP(p.price)}</td>
                    <td className="px-4 py-3 text-center text-[#444444]">{p.inStock}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#111111] transition-colors"
                          title="Editar"
                        >
                          <LuPencil className="w-4 h-4" />
                        </button>
                        {deletingId === p.id ? (
                          <span className="flex items-center gap-1 text-xs text-[#444444]">
                            <button onClick={() => handleDelete(p.id)} className="text-[#D61C1C] font-medium hover:underline">Eliminar</button>
                            <span>/</span>
                            <button onClick={() => setDeletingId(null)} className="hover:underline">Cancelar</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(p.id); setDeleteError({}); }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444] hover:text-[#D61C1C] transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {deleteError[p.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={6} className="px-4 py-2 text-xs text-[#D61C1C]">{deleteError[p.id]}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {products.length > 0 && (search || filterCategory) && (
        <p className="text-xs text-[#444444] mt-2">
          {filtered.length} de {products.length} productos
        </p>
      )}

      {/* Drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-[#E5E5E5] z-50 flex flex-col shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
          <h2 className="font-semibold text-[#111111]">
            {form.id ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Imágenes */}
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-2">Imágenes del producto</label>

            {/* Saved images grid */}
            {(savedImages.length > 0 || pendingPreviews.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {savedImages.map(img => (
                  <div key={img.id} className="relative w-16 h-16 rounded overflow-hidden group border border-[#E5E5E5]">
                    <Image
                      src={getImageSrc(img.url)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <button
                      type="button"
                      onClick={() => removeSaved(img)}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <LuTrash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {pendingPreviews.map((preview, i) => (
                  <div key={`pending-${i}`} className="relative w-16 h-16 rounded overflow-hidden group border border-amber-300">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePending(i)}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <LuX className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-400/90 text-white text-[8px] text-center py-0.5 leading-tight">
                      pendiente
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add image button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 border border-dashed border-[#E5E5E5] rounded px-4 py-3 text-sm text-[#444444] hover:border-[#D61C1C] hover:text-[#D61C1C] transition-colors w-full justify-center"
            >
              <LuImagePlus className="w-4 h-4" />
              {savedImages.length + pendingPreviews.length > 0 ? 'Agregar más imágenes' : 'Subir imagen'}
            </button>
            <p className="text-xs text-[#444444] mt-1">JPG, PNG, WEBP · Puedes subir varias imágenes</p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageFilesChange}
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-1.5">Nombre *</label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
              placeholder="Ej. Camiseta Premium"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-1.5">Descripción *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
              placeholder="Descripción del producto"
              required
            />
          </div>

          {/* Serial y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Serial / SKU *</label>
              <input
                value={form.slug}
                onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm font-mono text-[#444444] focus:outline-none focus:border-[#111111]"
                placeholder="camiseta-premium"
                required
              />
              <p className="text-xs text-[#444444] mt-1">Identificador único en URLs</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Categoría *</label>
              <select
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
                required
              >
                <option value="">Seleccionar…</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio */}
          <div className="border border-[#E5E5E5] rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#444444]">Precio</p>

            <div>
              <label className="block text-xs text-[#444444] mb-1">Precio unitario (costo) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#444444]">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.baseCost}
                  onChange={e => handleBaseCostChange(e.target.value)}
                  className="w-full border border-[#E5E5E5] rounded pl-7 pr-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#444444] mb-1">Margen de ganancia</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={form.marginPct}
                    onChange={e => handleMarginPctChange(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded pl-3 pr-8 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#444444]">%</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#444444]">$</span>
                  <input
                    type="number"
                    min={0}
                    value={form.marginAmt}
                    onChange={e => handleMarginAmtChange(e.target.value)}
                    className="w-full border border-[#E5E5E5] rounded pl-7 pr-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-[#444444] mt-1">Edita el % o el valor $ — el otro se actualiza automáticamente</p>
            </div>

            <div className="bg-[#F8F9FA] rounded p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#444444]">Precio de venta (en tienda)</p>
                <p className="text-xs text-[#444444] mt-0.5">= Costo + Margen</p>
              </div>
              <p className="text-xl font-bold text-[#111111]">
                {priceTotal > 0 ? formatCOP(priceTotal) : '—'}
              </p>
            </div>
          </div>

          {/* Stock y Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Stock *</label>
              <input
                type="number"
                min={0}
                value={form.inStock}
                onChange={e => setForm(f => ({ ...f, inStock: e.target.value }))}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#444444] mb-1.5">Tags</label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                placeholder="ropa, algodón, premium"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[#D61C1C]">{error}</p>}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E5E5] flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 border border-[#E5E5E5] rounded px-4 py-2.5 text-sm font-medium text-[#444444] hover:bg-[#F8F9FA] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="flex-1 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white rounded px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? 'Guardando…' : 'Guardar producto'}
          </button>
        </div>
      </div>
    </>
  );
}
