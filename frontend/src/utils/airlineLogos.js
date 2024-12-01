export const getAirlineLogo = (airline) => {
  const logos = {
    'SpiceJet': '/img/logo/spiceJet.png',
    'Indigo': '/img/logo/indigo.png',
    'Air India': '/img/logo/airIndia.png',
    'Vistara': '/img/logo/vistara.png',
    'GO FIRST': '/img/logo/GoFirst.png'
  };
  return logos[airline] || '/img/logo/default.png';
}; 