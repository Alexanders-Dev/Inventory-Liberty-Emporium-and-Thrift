import React from 'react';

interface HeaderProps {
    hasItems: boolean;
    onAddItemManually: () => void;
}

const Header: React.FC<HeaderProps> = ({ hasItems, onAddItemManually }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white sticky top-0 z-10 shadow-md print:hidden">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8zM4 4a2 2 0 012-2h2v12H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Smart Inventory AI</h1>
        </div>
        <div className="flex items-center space-x-4">
            <button
              onClick={onAddItemManually}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
               </svg>
              <span>Add Manually</span>
            </button>
            {hasItems && (
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h1v-4a1 1 0 011-1h8a1 1 0 011 1v4h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                  <span>Print Inventory</span>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
