import React from 'react';
import type { InventoryItem } from '../types';
import ImageCarousel from './ImageCarousel';

interface InventoryItemCardProps {
  item: InventoryItem;
  onRemove: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onRemove, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row print:shadow-none print:border-b print:rounded-none print:break-inside-avoid">
      <div className="md:w-1/3">
        <ImageCarousel images={item.imageUrls} itemName={item.name} />
      </div>
      <div className="w-full p-6 flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start gap-4">
              <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{item.name}</h3>
              </div>
              <p className="text-lg font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full whitespace-nowrap">{item.estimatedPrice}</p>
            </div>
            <p className="mt-2 text-gray-600">
              {item.description}
            </p>
        </div>
        <div className="mt-4 flex justify-end items-center space-x-4 print:hidden">
            <button
                onClick={() => onEdit(item)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
                Edit
            </button>
            <button
                onClick={() => onRemove(item.id)}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
                Remove
            </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;
