import type { InventoryItem } from '../types';

export const exportToCSV = (items: InventoryItem[], filename: string = 'inventory') => {
  // Define CSV headers
  const headers = ['Name', 'Category', 'Estimated Price', 'Description', 'Number of Images', 'Date Added'];
  
  // Convert items to CSV rows
  const csvRows = items.map(item => {
    // Clean price for better spreadsheet compatibility
    const cleanPrice = item.estimatedPrice.replace(/[^0-9.-]/g, '');
    
    // Extract date from ID (assuming ISO string format)
    const dateAdded = new Date(item.id).toLocaleDateString();
    
    // Escape description for CSV (handle commas and quotes)
    const escapedDescription = `"${item.description.replace(/"/g, '""')}"`;
    
    return [
      `"${item.name}"`,
      `"${item.category}"`,
      cleanPrice,
      escapedDescription,
      item.imageUrls.length.toString(),
      dateAdded
    ].join(',');
  });
  
  // Combine headers and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const calculateInventoryStats = (items: InventoryItem[]) => {
  const totalItems = items.length;
  const totalValue = items.reduce((acc, item) => {
    const price = parseFloat(item.estimatedPrice.replace(/[^0-9.-]+/g, ""));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);
  
  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalItems,
    totalValue,
    categoryCounts,
    averageValue: totalItems > 0 ? totalValue / totalItems : 0
  };
};