// Format price in Indian Rupees
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Indian number formatting with lakhs and crores
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numAmount);
};

// Format number in Indian style (with commas)
export const formatIndianNumber = (num) => {
  if (!num && num !== 0) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format date in Indian format
export const formatIndianDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Format datetime in Indian format
export const formatIndianDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
