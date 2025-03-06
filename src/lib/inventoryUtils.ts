
/**
 * Takes an expiry date string and returns the status of the item
 * @param expiryDate - ISO string date
 * @returns 'expired' | 'expiring-soon' | 'good'
 */
export function getExpiryStatus(expiryDate: string): 'expired' | 'expiring-soon' | 'good' {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0); // Normalize to start of day
  
  const diffInDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return 'expired';
  } else if (diffInDays <= 3) {
    return 'expiring-soon';
  } else {
    return 'good';
  }
}

/**
 * Groups items by their category
 * @param items - Array of inventory items
 * @returns Object with categories as keys and counts as values
 */
export function getItemsByCategory(items: any[]) {
  return items.reduce((acc, item) => {
    const category = item.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Calculates statistics about inventory expiry dates
 * @param items - Array of inventory items
 * @returns Object with expiry statistics
 */
export function getExpiryStatistics(items: any[]) {
  let expired = 0;
  let expiringSoon = 0;
  let good = 0;
  let noExpiryDate = 0;
  
  items.forEach(item => {
    if (!item.expiryDate) {
      noExpiryDate++;
      return;
    }
    
    const status = getExpiryStatus(item.expiryDate);
    if (status === 'expired') expired++;
    else if (status === 'expiring-soon') expiringSoon++;
    else good++;
  });
  
  return { expired, expiringSoon, good, noExpiryDate };
}
