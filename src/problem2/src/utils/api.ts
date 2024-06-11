import axios from 'axios';

const TOKEN_IMAGES_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';
const PRICES_API = 'https://interview.switcheo.com/prices.json';

export const fetchTokenPrices = async () => {
  try {
    const response = await axios.get(PRICES_API);
    return response.data;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};

export const getTokenImageUrl = (symbol: string) => {
  if (symbol === 'STEVMOS') symbol = 'stEVMOS';
  if (symbol === 'RATOM') symbol = 'rATOM';
  if (symbol === 'STOSMO') symbol = 'stOSMO';
  if (symbol === 'STATOM') symbol = 'stATOM';
  if (symbol === 'STLUNA') symbol = 'stLUNA';
  return `${TOKEN_IMAGES_BASE_URL}/${symbol}.svg`
};
