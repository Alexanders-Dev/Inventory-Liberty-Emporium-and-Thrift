import React from 'react';

interface InventoryFiltersProps {
  categories: string[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ 
  categories, 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 print:hidden">
      <div className="flex-grow">
        <label htmlFor="search" className="sr-only">Search Items</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
      </div>
      <div>
        <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InventoryFilters;
