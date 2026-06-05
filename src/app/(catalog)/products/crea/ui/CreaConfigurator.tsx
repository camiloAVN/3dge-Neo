'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { NeoCart } from '@/components/cart/neo-cart/NeoCart';
import { currencyFormat } from '@/utils';
import styles from '../crea.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type Color = 'ink' | 'paper' | 'red' | 'yellow' | 'blue';

interface Block {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: Color;
  functionId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL = 60; // px per cell
const GAP  = 6;  // px gap between cells

const COLOR_HEX: Record<Color, string> = {
  ink:    '#141210',
  paper:  '#f6f4ee',
  red:    '#e63b22',
  yellow: '#f5c200',
  blue:   '#1f3fd6',
};

// Text color for legible labels on each bg color
const COLOR_TEXT: Record<Color, string> = {
  ink:    '#f6f4ee',
  paper:  '#141210',
  red:    '#f6f4ee',
  yellow: '#141210',
  blue:   '#f6f4ee',
};

const SHAPES = [
  { id: '1x1', label: '1×1', w: 1, h: 1 },
  { id: '2x1', label: '2×1', w: 2, h: 1 },
  { id: '1x2', label: '1×2', w: 1, h: 2 },
  { id: '2x2', label: '2×2', w: 2, h: 2 },
  { id: '3x1', label: '3×1', w: 3, h: 1 },
  { id: '1x3', label: '1×3', w: 1, h: 3 },
] as const;

const FUNCTIONS = [
  { id: 'key-hook', label: 'Colgador de llaves', price: 0 },
  { id: 'wallet',   label: 'Base billetera',     price: 0 },
  { id: 'phone',    label: 'Porta-celular',       price: 0 },
  { id: 'shelf',    label: 'Estante',             price: 0 },
  { id: 'hook',     label: 'Gancho doble',        price: 0 },
  { id: 'tray',     label: 'Bandeja',             price: 0 },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9); }

function canPlace(
  x: number, y: number, w: number, h: number,
  gridW: number, gridH: number,
  blocks: Block[],
) {
  if (x < 0 || y < 0 || x + w > gridW || y + h > gridH) return false;
  for (let cx = x; cx < x + w; cx++) {
    for (let cy = y; cy < y + h; cy++) {
      if (blocks.some(b => cx >= b.x && cx < b.x + b.w && cy >= b.y && cy < b.y + b.h)) {
        return false;
      }
    }
  }
  return true;
}

function blockAt(x: number, y: number, blocks: Block[]) {
  return blocks.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreaConfigurator() {
  const [gridW, setGridW]           = useState(5);
  const [gridH, setGridH]           = useState(5);
  const [blocks, setBlocks]         = useState<Block[]>([]);
  const [history, setHistory]       = useState<Block[][]>([[]]);
  const [histIdx, setHistIdx]       = useState(0);

  const [selShapeId, setSelShapeId] = useState<string>('1x1');
  const [selColor, setSelColor]     = useState<Color>('blue');
  const [selBlockId, setSelBlockId] = useState<string | null>(null);
  const [hoverCell, setHoverCell]   = useState<{ x: number; y: number } | null>(null);
  const [draggingFn, setDraggingFn] = useState<string | null>(null);

  const selShape = SHAPES.find(s => s.id === selShapeId) ?? SHAPES[0];
  const selBlock = blocks.find(b => b.id === selBlockId) ?? null;
  const totalPrice = blocks.reduce((sum, b) => {
    return sum + (FUNCTIONS.find(f => f.id === b.functionId)?.price ?? 0);
  }, 0);

  // ── History helpers ─────────────────────────────────────────────
  const commit = useCallback((next: Block[]) => {
    setHistory(prev => [...prev.slice(0, histIdx + 1), next]);
    setHistIdx(i => i + 1);
    setBlocks(next);
  }, [histIdx]);

  const undo = () => {
    if (histIdx === 0) return;
    const prev = histIdx - 1;
    setHistIdx(prev);
    setBlocks(history[prev]);
    setSelBlockId(null);
  };

  const clear = () => { commit([]); setSelBlockId(null); };

  // ── Grid size ───────────────────────────────────────────────────
  const changeGrid = (axis: 'w' | 'h', delta: number) => {
    const newVal = Math.min(10, Math.max(2, (axis === 'w' ? gridW : gridH) + delta));
    const filtered = blocks.filter(b =>
      axis === 'w' ? b.x + b.w <= newVal : b.y + b.h <= newVal
    );
    if (axis === 'w') setGridW(newVal); else setGridH(newVal);
    if (filtered.length !== blocks.length) commit(filtered);
  };

  // ── Cell interactions ───────────────────────────────────────────
  const handleCellClick = (x: number, y: number) => {
    const hit = blockAt(x, y, blocks);
    if (hit) {
      setSelBlockId(prev => prev === hit.id ? null : hit.id);
      return;
    }
    if (!canPlace(x, y, selShape.w, selShape.h, gridW, gridH, blocks)) return;
    commit([...blocks, { id: uid(), x, y, w: selShape.w, h: selShape.h, color: selColor }]);
    setSelBlockId(null);
  };

  const removeSelected = () => {
    if (!selBlockId) return;
    commit(blocks.filter(b => b.id !== selBlockId));
    setSelBlockId(null);
  };

  // ── Function assignment ─────────────────────────────────────────
  const assignFn = (blockId: string, fnId: string) => {
    commit(blocks.map(b =>
      b.id === blockId
        ? { ...b, functionId: b.functionId === fnId ? undefined : fnId }
        : b
    ));
  };

  const handleDrop = (x: number, y: number) => {
    if (!draggingFn) return;
    const target = blockAt(x, y, blocks);
    if (target) assignFn(target.id, draggingFn);
    setDraggingFn(null);
  };

  // ── Computed canvas dimensions ──────────────────────────────────
  const canvasW = gridW * CELL + (gridW - 1) * GAP;
  const canvasH = gridH * CELL + (gridH - 1) * GAP;
  const hoverValid = hoverCell
    ? canPlace(hoverCell.x, hoverCell.y, selShape.w, selShape.h, gridW, gridH, blocks)
    : false;

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <Link href="/products" className={styles.backLink}>← Colecciones</Link>
          <span className={styles.topTitle}>CREA — CONFIGURADOR</span>
          <div className={styles.topRight}>
            <span className={styles.topNum}>03</span>
            <NeoCart />
          </div>
        </div>

        {/* ── Main ── */}
        <div className={styles.main}>

          {/* LEFT PANEL */}
          <div className={styles.panel}>

            {/* Formas */}
            <div className={styles.section}>
              <span className={styles.sLabel}>FORMAS</span>
              <div className={styles.shapeGrid}>
                {SHAPES.map(s => (
                  <button
                    key={s.id}
                    className={`${styles.shapeBtn} ${selShapeId === s.id ? styles.shapeBtnOn : ''}`}
                    onClick={() => { setSelShapeId(s.id); setSelBlockId(null); }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className={styles.section}>
              <span className={styles.sLabel}>COLOR</span>
              <div className={styles.colorRow}>
                {(Object.keys(COLOR_HEX) as Color[]).map(c => (
                  <button
                    key={c}
                    className={`${styles.swatch} ${selColor === c ? styles.swatchOn : ''}`}
                    style={{ background: COLOR_HEX[c] }}
                    onClick={() => setSelColor(c)}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Tamaño del grid */}
            <div className={styles.section}>
              <span className={styles.sLabel}>TAMAÑO</span>
              {(['w', 'h'] as const).map(axis => (
                <div key={axis} className={styles.sizeRow}>
                  <span className={styles.sizeLabel}>{axis.toUpperCase()}</span>
                  <button className={styles.sizeBtn} onClick={() => changeGrid(axis, -1)}>−</button>
                  <span className={styles.sizeVal}>{axis === 'w' ? gridW : gridH}</span>
                  <button className={styles.sizeBtn} onClick={() => changeGrid(axis, +1)}>+</button>
                  <span className={styles.sizeCap}>max 10</span>
                </div>
              ))}
            </div>

            {/* Funciones */}
            <div className={styles.section}>
              <span className={styles.sLabel}>
                MÓDULOS
                {selBlock
                  ? <span className={styles.sLabelHint}> — arrastra o click</span>
                  : <span className={styles.sLabelHint}> — selecciona un bloque</span>}
              </span>
              <div className={styles.fnList}>
                {FUNCTIONS.map(fn => (
                  <div
                    key={fn.id}
                    className={`${styles.fnItem} ${selBlock?.functionId === fn.id ? styles.fnItemOn : ''} ${!selBlock ? styles.fnItemDim : ''}`}
                    draggable={!!selBlock}
                    onDragStart={() => setDraggingFn(fn.id)}
                    onDragEnd={() => setDraggingFn(null)}
                    onClick={() => selBlock && assignFn(selBlock.id, fn.id)}
                  >
                    <span className={styles.fnLabel}>{fn.label}</span>
                    <span className={styles.fnPrice}>{fn.price > 0 ? currencyFormat(fn.price) : 'TBD'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones + precio */}
            <div className={styles.bottom}>
              <div className={styles.actionRow}>
                <button className={styles.actBtn} onClick={undo} disabled={histIdx === 0}>Deshacer</button>
                <button className={styles.actBtn} onClick={clear} disabled={blocks.length === 0}>Limpiar</button>
                {selBlockId && (
                  <button className={styles.actBtnDel} onClick={removeSelected}>Eliminar</button>
                )}
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>{blocks.length} bloque{blocks.length !== 1 ? 's' : ''}</span>
                <span className={styles.priceValue}>{totalPrice > 0 ? currencyFormat(totalPrice) : '—'}</span>
              </div>
              <button className={styles.cta} disabled={blocks.length === 0}>
                <span>Solicitar cotización</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* CANVAS */}
          <div className={styles.canvas}>
            <div
              className={styles.gridWrapper}
              style={{ width: canvasW, height: canvasH }}
              onMouseLeave={() => setHoverCell(null)}
            >

              {/* Invisible interaction cells */}
              {Array.from({ length: gridH }, (_, y) =>
                Array.from({ length: gridW }, (_, x) => (
                  <div
                    key={`c-${x}-${y}`}
                    className={styles.cell}
                    style={{ left: x * (CELL + GAP), top: y * (CELL + GAP) }}
                    onMouseEnter={() => setHoverCell({ x, y })}
                    onClick={() => handleCellClick(x, y)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(x, y)}
                  />
                ))
              )}

              {/* Placed blocks */}
              {blocks.map(b => {
                const fn = FUNCTIONS.find(f => f.id === b.functionId);
                const isSelected = selBlockId === b.id;
                return (
                  <div
                    key={b.id}
                    className={`${styles.block} ${isSelected ? styles.blockOn : ''}`}
                    style={{
                      left:   b.x * (CELL + GAP),
                      top:    b.y * (CELL + GAP),
                      width:  b.w * CELL + (b.w - 1) * GAP,
                      height: b.h * CELL + (b.h - 1) * GAP,
                      background: COLOR_HEX[b.color],
                      color: COLOR_TEXT[b.color],
                    }}
                    onClick={() => setSelBlockId(prev => prev === b.id ? null : b.id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.stopPropagation(); handleDrop(b.x, b.y); }}
                  >
                    {fn && <span className={styles.blockFn}>{fn.label}</span>}
                  </div>
                );
              })}

              {/* Hover preview */}
              {hoverCell && !selBlockId && !blockAt(hoverCell.x, hoverCell.y, blocks) && (
                <div
                  className={styles.preview}
                  style={{
                    left:    hoverCell.x * (CELL + GAP),
                    top:     hoverCell.y * (CELL + GAP),
                    width:   selShape.w * CELL + (selShape.w - 1) * GAP,
                    height:  selShape.h * CELL + (selShape.h - 1) * GAP,
                    background: hoverValid ? COLOR_HEX[selColor] : COLOR_HEX.red,
                  }}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
