'use client';

import { LuMinus, LuPlus } from 'react-icons/lu';

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
  max?: number;
}

export const QuantitySelector = ({ quantity, onQuantityChanged, max = 99 }: Props) => {
  return (
    <div className="flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden w-fit">
      <button
        type="button"
        onClick={() => quantity > 1 && onQuantityChanged(quantity - 1)}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-[#444444] hover:bg-[#F8F9FA] disabled:opacity-30 transition-colors"
      >
        <LuMinus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[#111111] border-x border-[#E5E5E5] select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => quantity < max && onQuantityChanged(quantity + 1)}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-[#444444] hover:bg-[#F8F9FA] disabled:opacity-30 transition-colors"
      >
        <LuPlus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
