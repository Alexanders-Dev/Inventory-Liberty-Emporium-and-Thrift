import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import ImageGalleryEditor from './ImageGalleryEditor.tsx';

interface EditItemModalProps {
  isOpen: boolean;
  item: InventoryItem | null; // null for manual entry
  onSave: (item: InventoryItem) => void;
  onClose: () => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'imageUrls'>>({
    name: '',
    description: '',
    estimatedPrice: '',
    category: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
        if (item) {
          setFormData({
            name: item.name,
            description: item.description,
            estimatedPrice: item.estimatedPrice,
            category: item.category,
          });
          setImageUrls(item.imageUrls);
        } else {
          // Reset for manual entry
          setFormData({
            name: '',
            description: '',
            estimatedPrice: '',
            category: '',
          });
          setImageUrls([]);
        }
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalItem: InventoryItem = item 
      ? { ...item, ...formData, imageUrls }
      : { 
          id: new Date().toISOString(), 
          imageUrls: imageUrls.length > 0 ? imageUrls : ['https://via.placeholder.com/300x200.png?text=No+Image'],
          ...formData
        };
    onSave(finalItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{item ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images (up to 4)</label>
              <ImageGalleryEditor imageUrls={imageUrls} onImagesChange={setImageUrls} />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="estimatedPrice" className="block text-sm font-medium text-gray-700">Estimated Price</label>
              <input type="text" name="estimatedPrice" id="estimatedPrice" value={formData.estimatedPrice} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="$123.45"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
