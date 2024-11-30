export const getAirlineLogo = (airline) => {
  const logos = {
    'SpiceJet': '/img/logo/spiceJet.png',
    'IndiGo': '/img/logo/indigo.png',
    'Air India': '/img/logo/airIndia.png',
    'Vistara': '/img/logo/vistara.png',
    'Go First': '/img/logo/GoFirst.png'
  };
  return logos[airline] || '/img/logo/default.png';
}; 