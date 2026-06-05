'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

const GAP        = 6;
const MIN_CELL   = 38;
const MAX_CELL   = 120;
const CANVAS_PAD = 48;

const COLOR_HEX: Record<Color, string> = {
  ink:    '#141210',
  paper:  '#f6f4ee',
  red:    '#e63b22',
  yellow: '#f5c200',
  blue:   '#1f3fd6',
};

const COLOR_TEXT: Record<Color, string> = {
  ink:    '#f6f4ee',
  paper:  '#141210',
  red:    '#f6f4ee',
  yellow: '#141210',
  blue:   '#f6f4ee',
};

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
  gridW: number, gridH: number, blocks: Block[],
) {
  if (x < 0 || y < 0 || x + w > gridW || y + h > gridH) return false;
  for (let cx = x; cx < x + w; cx++)
    for (let cy = y; cy < y + h; cy++)
      if (blocks.some(b => cx >= b.x && cx < b.x + b.w && cy >= b.y && cy < b.y + b.h))
        return false;
  return true;
}

function blockAt(x: number, y: number, blocks: Block[]) {
  return blocks.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreaConfigurator() {
  // Grid size
  const [gridW, setGridW] = useState(5);
  const [gridH, setGridH] = useState(5);

  // Shape size (free W×H, max limited to grid size)
  const [shapeW, setShapeW] = useState(1);
  const [shapeH, setShapeH] = useState(1);

  // Blocks & history
  const [blocks,  setBlocks]  = useState<Block[]>([]);
  const [history, setHistory] = useState<Block[][]>([[]]);
  const [histIdx, setHistIdx] = useState(0);

  // UI state
  const [selColor,   setSelColor]   = useState<Color>('blue');
  const [selBlockId, setSelBlockId] = useState<string | null>(null);
  const [hoverCell,  setHoverCell]  = useState<{ x: number; y: number } | null>(null);
  const [draggingFn, setDraggingFn] = useState<string | null>(null);

  // Adaptive cell size
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(64);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const compute = () => {
      const availW = canvas.clientWidth  - CANVAS_PAD * 2;
      const availH = canvas.clientHeight - CANVAS_PAD * 2;
      const byW = Math.floor((availW - (gridW - 1) * GAP) / gridW);
      const byH = Math.floor((availH - (gridH - 1) * GAP) / gridH);
      setCellSize(Math.max(MIN_CELL, Math.min(MAX_CELL, byW, byH)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [gridW, gridH]);

  // Clamp shape size if grid shrinks below it
  useEffect(() => {
    if (shapeW > gridW) setShapeW(gridW);
    if (shapeH > gridH) setShapeH(gridH);
  }, [gridW, gridH, shapeW, shapeH]);

  const selBlock   = blocks.find(b => b.id === selBlockId) ?? null;
  const totalPrice = blocks.reduce((sum, b) =>
    sum + (FUNCTIONS.find(f => f.id === b.functionId)?.price ?? 0), 0);

  // ── History ──────────────────────────────────────────────────────
  const commit = useCallback((next: Block[]) => {
    setHistory(prev => [...prev.slice(0, histIdx + 1), next]);
    setHistIdx(i => i + 1);
    setBlocks(next);
  }, [histIdx]);

  const undo  = () => {
    if (histIdx === 0) return;
    const i = histIdx - 1;
    setHistIdx(i); setBlocks(history[i]); setSelBlockId(null);
  };
  const clear = () => { commit([]); setSelBlockId(null); };

  // ── Grid size ─────────────────────────────────────────────────────
  const changeGrid = (axis: 'w' | 'h', delta: number) => {
    const cur  = axis === 'w' ? gridW : gridH;
    const next = Math.min(10, Math.max(2, cur + delta));
    const trimmed = blocks.filter(b =>
      axis === 'w' ? b.x + b.w <= next : b.y + b.h <= next
    );
    if (axis === 'w') setGridW(next); else setGridH(next);
    if (trimmed.length !== blocks.length) commit(trimmed);
  };

  // ── Shape size ────────────────────────────────────────────────────
  const changeShape = (axis: 'w' | 'h', delta: number) => {
    const max = axis === 'w' ? gridW : gridH;
    if (axis === 'w') setShapeW(v => Math.min(max, Math.max(1, v + delta)));
    else              setShapeH(v => Math.min(max, Math.max(1, v + delta)));
  };

  // ── Cell interactions ──────────────────────────────────────────────
  const handleCellClick = (x: number, y: number) => {
    const hit = blockAt(x, y, blocks);
    if (hit) {
      // Clicking an occupied cell selects/deselects the block
      setSelBlockId(p => p === hit.id ? null : hit.id);
      return;
    }
    // Prevent placing on or overlapping existing blocks
    if (!canPlace(x, y, shapeW, shapeH, gridW, gridH, blocks)) return;
    commit([...blocks, { id: uid(), x, y, w: shapeW, h: shapeH, color: selColor }]);
    setSelBlockId(null);
  };

  const removeSelected = () => {
    if (!selBlockId) return;
    commit(blocks.filter(b => b.id !== selBlockId));
    setSelBlockId(null);
  };

  // ── Function assignment ────────────────────────────────────────────
  const assignFn = (blockId: string, fnId: string) =>
    commit(blocks.map(b =>
      b.id === blockId ? { ...b, functionId: b.functionId === fnId ? undefined : fnId } : b
    ));

  const handleDrop = (x: number, y: number) => {
    if (!draggingFn) return;
    const target = blockAt(x, y, blocks);
    if (target) assignFn(target.id, draggingFn);
    setDraggingFn(null);
  };

  // ── Computed dimensions ────────────────────────────────────────────
  const step    = cellSize + GAP;
  const canvasW = gridW * cellSize + (gridW - 1) * GAP;
  const canvasH = gridH * cellSize + (gridH - 1) * GAP;
  const hoverValid = hoverCell
    ? canPlace(hoverCell.x, hoverCell.y, shapeW, shapeH, gridW, gridH, blocks)
    : false;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <Link href="/products" className={styles.backLink}>← Colecciones</Link>
          <span className={styles.topTitle}>CREA — CONFIGURADOR</span>
          <div className={styles.topRight}>
            <span className={styles.topNum}>03</span>
            <NeoCart />
          </div>
        </div>

        <div className={styles.main}>

          {/* ── LEFT PANEL ── */}
          <div className={styles.panel}>

            {/* Shape size */}
            <div className={styles.section}>
              <span className={styles.sLabel}>FORMA — {shapeW}×{shapeH}</span>
              {(['w', 'h'] as const).map(axis => (
                <div key={axis} className={styles.sizeRow}>
                  <span className={styles.sizeLabel}>{axis.toUpperCase()}</span>
                  <button className={styles.sizeBtn} onClick={() => changeShape(axis, -1)}>−</button>
                  <span className={styles.sizeVal}>{axis === 'w' ? shapeW : shapeH}</span>
                  <button className={styles.sizeBtn} onClick={() => changeShape(axis, +1)}>+</button>
                  <span className={styles.sizeCap}>/ {axis === 'w' ? gridW : gridH}</span>
                </div>
              ))}
              {/* Visual preview of selected shape */}
              <div className={styles.shapePreviewWrap}>
                <div
                  className={styles.shapePreviewBlock}
                  style={{
                    aspectRatio: `${shapeW} / ${shapeH}`,
                    background: COLOR_HEX[selColor],
                    maxWidth: `${shapeW * 20}px`,
                    maxHeight: `${shapeH * 20}px`,
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Color */}
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

            {/* Grid size */}
            <div className={styles.section}>
              <span className={styles.sLabel}>CUADRÍCULA — {gridW}×{gridH}</span>
              {(['w', 'h'] as const).map(axis => (
                <div key={axis} className={styles.sizeRow}>
                  <span className={styles.sizeLabel}>{axis.toUpperCase()}</span>
                  <button className={styles.sizeBtn} onClick={() => changeGrid(axis, -1)}>−</button>
                  <span className={styles.sizeVal}>{axis === 'w' ? gridW : gridH}</span>
                  <button className={styles.sizeBtn} onClick={() => changeGrid(axis, +1)}>+</button>
                  <span className={styles.sizeCap}>/ 10</span>
                </div>
              ))}
            </div>

            {/* Function modules */}
            <div className={styles.section}>
              <span className={styles.sLabel}>
                MÓDULOS
                {selBlock
                  ? <span className={styles.sLabelHint}> — click o arrastra</span>
                  : <span className={styles.sLabelHint}> — selecciona bloque primero</span>}
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

            {/* Actions + price */}
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

          {/* ── CANVAS ── */}
          <div className={styles.canvas} ref={canvasRef}>
            <div
              className={styles.gridWrapper}
              style={{ width: canvasW, height: canvasH }}
              onMouseLeave={() => setHoverCell(null)}
            >
              {/* Cells */}
              {Array.from({ length: gridH }, (_, y) =>
                Array.from({ length: gridW }, (_, x) => (
                  <div
                    key={`c-${x}-${y}`}
                    className={styles.cell}
                    style={{ left: x * step, top: y * step, width: cellSize, height: cellSize }}
                    onMouseEnter={() => setHoverCell({ x, y })}
                    onClick={() => handleCellClick(x, y)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(x, y)}
                  />
                ))
              )}

              {/* Blocks */}
              {blocks.map(b => {
                const fn  = FUNCTIONS.find(f => f.id === b.functionId);
                const sel = selBlockId === b.id;
                return (
                  <div
                    key={b.id}
                    className={`${styles.block} ${sel ? styles.blockOn : ''}`}
                    style={{
                      left:       b.x * step,
                      top:        b.y * step,
                      width:      b.w * cellSize + (b.w - 1) * GAP,
                      height:     b.h * cellSize + (b.h - 1) * GAP,
                      background: COLOR_HEX[b.color],
                      color:      COLOR_TEXT[b.color],
                    }}
                    onClick={() => setSelBlockId(p => p === b.id ? null : b.id)}
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
                    left:       hoverCell.x * step,
                    top:        hoverCell.y * step,
                    width:      shapeW * cellSize + (shapeW - 1) * GAP,
                    height:     shapeH * cellSize + (shapeH - 1) * GAP,
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
