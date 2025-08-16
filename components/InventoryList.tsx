import React from 'react';
import type { InventoryItem } from '../types';
import InventoryItemCard from './InventoryItemCard';

interface InventoryListProps {
  items: InventoryItem[];
  onRemove: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onRemove, onEdit }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 print:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Your inventory is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Upload an image or add an item manually to get started.</p>
      </div>
    );
  }

  const totalValue = items.reduce((acc, item) => {
    const price = parseFloat(item.estimatedPrice.replace(/[^0-9.-]+/g,""));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="mt-8">
        <div className="mb-6 flex justify-between items-baseline">
            <h2 className="text-2xl font-bold text-gray-900 print:text-center print:text-3xl">My Inventory ({items.length})</h2>
            <p className="text-lg font-semibold text-gray-700 print:hidden">Total Value: ${totalValue.toFixed(2)}</p>
        </div>
        <div className="space-y-6">
          {items.map((item) => (
            <InventoryItemCard key={item.id} item={item} onRemove={onRemove} onEdit={onEdit} />
          ))}
        </div>
    </div>
  );
};

export default InventoryList;
