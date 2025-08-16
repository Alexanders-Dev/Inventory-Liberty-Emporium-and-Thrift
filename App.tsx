import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import type { InventoryItem } from './types';
import { analyzeInventoryItem } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import InventoryList from './components/InventoryList';
import LoadingSpinner from './components/LoadingSpinner';
import ConfirmationModal from './components/ConfirmationModal';
import EditItemModal from './components/EditItemModal';
import InventoryFilters from './components/InventoryFilters';

const APP_STORAGE_KEY = 'smartInventoryApp';

const App: React.FC = () => {
  // Main state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    try {
      const storedItems = localStorage.getItem(APP_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Failed to load items from localStorage", error);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null); // null for new, object for edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(inventoryItems));
    } catch (error) {
      console.error("Failed to save items to localStorage", error);
    }
  }, [inventoryItems]);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        if (!base64Image) {
            throw new Error("Failed to read image file.");
        }
        
        try {
            const analysis = await analyzeInventoryItem(base64Image, file.type);
            const newItem: InventoryItem = {
              id: new Date().toISOString(),
              imageUrl: URL.createObjectURL(file),
              name: analysis.itemName,
              description: analysis.description,
              estimatedPrice: analysis.estimatedPrice,
              category: analysis.category,
            };
            setInventoryItems((prevItems) => [newItem, ...prevItems]);
        } catch (apiError) {
             console.error('Gemini API Error:', apiError);
             setError('Failed to analyze the image. Please try another one.');
        } finally {
            setIsLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader Error:', error);
        setError('Failed to process the image file.');
        setIsLoading(false);
      };
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during image processing.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleConfirmRemove = (id: string) => {
    setItemToDeleteId(id);
  };
  
  const handleRemoveItem = () => {
    if (itemToDeleteId) {
        setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemToDeleteId));
        setItemToDeleteId(null);
    }
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };
  
  const handleOpenManualAdd = () => {
    setEditingItem(null); // Clear any previous editing item
    setIsEditModalOpen(true);
  };

  const handleSaveItem = (itemToSave: InventoryItem) => {
    if (editingItem) { // It's an update
        setInventoryItems(prevItems => prevItems.map(item => item.id === itemToSave.id ? itemToSave : item));
    } else { // It's a new manual item
        setInventoryItems(prevItems => [itemToSave, ...prevItems]);
    }
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Memoized values for filtering
  const categories = useMemo(() => {
    const allCategories = inventoryItems.map(item => item.category);
    return [...new Set(allCategories)].sort();
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [inventoryItems, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-white mt-4 text-lg">AI is analyzing your item...</p>
        </div>
      )}
      
      <ConfirmationModal
        isOpen={!!itemToDeleteId}
        title="Delete Item"
        message="Are you sure you want to remove this item from your inventory? This action cannot be undone."
        onConfirm={handleRemoveItem}
        onCancel={() => setItemToDeleteId(null)}
        confirmButtonText="Delete"
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        item={editingItem}
        onSave={handleSaveItem}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Header 
        hasItems={inventoryItems.length > 0} 
        onAddItemManually={handleOpenManualAdd}
      />
      <main className="container mx-auto p-4 md:p-8 print:p-0">
        <div className="print:hidden">
            <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Close">
                    <span className="text-2xl" aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
        </div>
        
        {inventoryItems.length > 0 && (
          <div className="mt-8">
            <InventoryFilters 
              categories={categories}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}
        
        <InventoryList items={filteredItems} onRemove={handleConfirmRemove} onEdit={handleOpenEdit} />
      </main>
    </div>
  );
};

export default App;
