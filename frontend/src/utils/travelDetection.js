// frontend/src/utils/travelDetection.js

export const detectTravelDays = (stops) => {
  const travelDays = [];
  
  for (let i = 0; i < stops.length - 1; i++) {
    const currentStop = stops[i];
    const nextStop = stops[i + 1];
    
    const departureDate = new Date(currentStop.departure_date);
    const arrivalDate = new Date(nextStop.arrival_date);
    
    // Check if there's a gap or same-day transition
    const dayDiff = Math.ceil((arrivalDate - departureDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff >= 0 && dayDiff <= 1) {
      travelDays.push({
        from: currentStop.city_name,
        fromCountry: currentStop.country,
        to: nextStop.city_name,
        toCountry: nextStop.country,
        date: departureDate,
        estimatedTime: calculateTravelTime(currentStop, nextStop),
        icon: getTransportIcon(currentStop, nextStop)
      });
    }
  }
  
  return travelDays;
};

const calculateTravelTime = (from, to) => {
  // Simple estimation based on distance (you can enhance this)
  const distances = {
    'Paris-Rome': '2h flight',
    'Rome-Barcelona': '2.5h flight',
    'London-Paris': '2.5h train',
    'Tokyo-Osaka': '2.5h train',
    'New York-Boston': '4h drive',
  };
  
  const key = `${from.city_name}-${to.city_name}`;
  return distances[key] || '~2-3h';
};

const getTransportIcon = (from, to) => {
  // Determine transport mode
  if (from.country !== to.country) {
    return '✈️';
  }
  return '🚗'; // Same country, assume car/train
};

export const getSuggestedActivities = (cityName) => {
  const suggestions = {
    'Paris': [
      { name: 'Eiffel Tower', category: 'sightseeing', estimatedCost: 25, duration: 2 },
      { name: 'Louvre Museum', category: 'culture', estimatedCost: 20, duration: 4 },
      { name: 'Seine River Cruise', category: 'relaxation', estimatedCost: 30, duration: 2 },
      { name: 'Notre-Dame Cathedral', category: 'culture', estimatedCost: 0, duration: 1 },
      { name: 'Arc de Triomphe', category: 'sightseeing', estimatedCost: 13, duration: 1 },
    ],
    'Rome': [
      { name: 'Colosseum', category: 'sightseeing', estimatedCost: 30, duration: 2 },
      { name: 'Vatican Museums', category: 'culture', estimatedCost: 25, duration: 3 },
      { name: 'Trevi Fountain', category: 'sightseeing', estimatedCost: 0, duration: 0.5 },
      { name: 'Roman Forum', category: 'culture', estimatedCost: 16, duration: 2 },
      { name: 'Pasta Making Class', category: 'food', estimatedCost: 60, duration: 3 },
    ],
    'Barcelona': [
      { name: 'Sagrada Familia', category: 'culture', estimatedCost: 28, duration: 2 },
      { name: 'Park Güell', category: 'sightseeing', estimatedCost: 10, duration: 2 },
      { name: 'Las Ramblas Walk', category: 'relaxation', estimatedCost: 0, duration: 1 },
      { name: 'Beach Day', category: 'relaxation', estimatedCost: 0, duration: 4 },
      { name: 'Tapas Tour', category: 'food', estimatedCost: 45, duration: 3 },
    ],
    'Tokyo': [
      { name: 'Senso-ji Temple', category: 'culture', estimatedCost: 0, duration: 2 },
      { name: 'Tokyo Skytree', category: 'sightseeing', estimatedCost: 20, duration: 2 },
      { name: 'Sushi Making Class', category: 'food', estimatedCost: 80, duration: 3 },
      { name: 'Shibuya Crossing', category: 'sightseeing', estimatedCost: 0, duration: 1 },
      { name: 'Imperial Palace', category: 'culture', estimatedCost: 0, duration: 2 },
    ],
    'London': [
      { name: 'Tower of London', category: 'culture', estimatedCost: 30, duration: 3 },
      { name: 'British Museum', category: 'culture', estimatedCost: 0, duration: 3 },
      { name: 'London Eye', category: 'sightseeing', estimatedCost: 35, duration: 1 },
      { name: 'Big Ben & Parliament', category: 'sightseeing', estimatedCost: 0, duration: 1 },
      { name: 'West End Show', category: 'nightlife', estimatedCost: 70, duration: 3 },
    ],
    'New York': [
      { name: 'Statue of Liberty', category: 'sightseeing', estimatedCost: 25, duration: 4 },
      { name: 'Central Park Walk', category: 'relaxation', estimatedCost: 0, duration: 2 },
      { name: 'Empire State Building', category: 'sightseeing', estimatedCost: 40, duration: 2 },
      { name: 'Metropolitan Museum', category: 'culture', estimatedCost: 30, duration: 3 },
      { name: 'Broadway Show', category: 'nightlife', estimatedCost: 100, duration: 3 },
    ],
  };

  return suggestions[cityName] || [
    { name: 'City Tour', category: 'sightseeing', estimatedCost: 30, duration: 3 },
    { name: 'Local Market Visit', category: 'shopping', estimatedCost: 20, duration: 2 },
    { name: 'Museum Visit', category: 'culture', estimatedCost: 15, duration: 2 },
  ];
};