export const calculateDisplacementValue = (lat1, lon1, lat2, lon2) => {
  // generally used geo measurement function
  let R = 6378.137; // Earth radius in KM
  let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  let a = Math.sin(dLat/2) * Math.sin(dLat/2) 
    + Math.cos(lat1 * Math.PI / 180) 
    * Math.cos(lat2 * Math.PI / 180) 
    * Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c;

  return d * 1000; // To meters
}

export const calculateMidPoint = (lat1, lon1, lat2, lon2) => {
  return {
    lat: (lat1 + lat2) / 2,
    lon: (lon1 + lon2) / 2
  }
}