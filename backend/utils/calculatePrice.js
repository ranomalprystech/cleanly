function calculatePrice(bookingDetails, serviceConfig) {
  const { cleaningType, bedrooms = 1, bathrooms = 1, extras = [], frequency = 'ONE-TIME' } = bookingDetails;

  const typeKeys = {
    'Standard': 'standard',
    'Deep': 'deep',
    'Move In-Out': 'moveInOut'
  };
  const typeKey = typeKeys[cleaningType] || 'standard';
  const rates = serviceConfig?.cleaningTypes?.[typeKey] || {};

  const frequencyMap = {
    'ONE-TIME': serviceConfig?.frequencyDiscounts?.oneTime || 0,
    'WEEKLY': serviceConfig?.frequencyDiscounts?.weekly || 25,
    'BI-WEEKLY': serviceConfig?.frequencyDiscounts?.biWeekly || 15,
    'MONTHLY': serviceConfig?.frequencyDiscounts?.monthly || 10
  };

  let total = bedrooms * (rates.perRoomRate || 0);
  total += bathrooms * (rates.perBathRate || 0);

  if (Array.isArray(extras) && Array.isArray(rates.addons || serviceConfig?.addons)) {
  const addons = rates.addons || serviceConfig.addons;
  for (const extraName of extras) {
    const addon = addons.find((a) => a.name === extraName);
    if (addon) total += addon.price;
  }
}

  const normalizedFreq = String(frequency).toUpperCase();
  const discount = frequencyMap[normalizedFreq] || 0;
  total -= total * (discount / 100);

  return Number(total.toFixed(2));
}

module.exports = calculatePrice;