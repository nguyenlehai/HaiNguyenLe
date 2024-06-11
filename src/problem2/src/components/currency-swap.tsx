import { useEffect, useState } from 'react';
import { fetchTokenPrices, getTokenImageUrl } from '../utils/api';
import {Image, Input, Select, SelectProps, Space} from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

interface Token {
  label: string;
  value: string;
  image: string;
  price: number;
}

const CurrencySwap: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [token1, setToken1] = useState<Token | null>(null);
  const [token2, setToken2] = useState<Token | null>(null);
  const [amount1, setAmount1] = useState<string>('');
  const [amount2, setAmount2] = useState<string>('');
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [isDownIcon, setIsDownIcon] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const prices = await fetchTokenPrices();
      const tokenList = Object.keys(prices).map((key) => ({
        label: prices[key].currency,
        value: key,
        image: getTokenImageUrl(prices[key].currency),
        price: prices[key].price,
      }));

      const tempOptions = tokenList.map((token) => ({
        value: token.value,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={token.image} alt={token.label} style={{ width: '24px', height: '24px' }} preview={false} />
            <span className="pl-2">{token.label}</span>
          </div>
        ),
      }));

      setOptions(tempOptions);
      setTokens(tokenList);

      // Set default values to options[1] and options[2]
      const defaultToken1 = tokenList[0];
      const defaultToken2 = tokenList[2];
      setToken1(defaultToken1 || null);
      setToken2(defaultToken2 || null);

      // Initialize amount1 and amount2 with a default amount (e.g., 1)
      if (defaultToken1 && defaultToken2) {
        setAmount1('1');
        const initialAmount2 = (1 * defaultToken1.price) / defaultToken2.price;
        setAmount2(initialAmount2.toFixed(6));
      }
    };

    fetchData();
  }, []);

  const handleAmountChange = (amount: string, isAmount1: boolean) => {
    if (token1 && token2 && amount) {
      const amountValue = parseFloat(amount);
      const newAmount = isAmount1
        ? (amountValue * token1.price) / token2.price
        : (amountValue * token2.price) / token1.price;
      if (isAmount1) {
        setAmount1(amount);
        setAmount2(newAmount.toFixed(6));
      } else {
        setAmount2(amount);
        setAmount1(newAmount.toFixed(6));
      }
    } else {
      if (isAmount1) {
        setAmount1(amount);
        setAmount2('');
      } else {
        setAmount2(amount);
        setAmount1('');
      }
    }
  };


  const handleSelectChange = (value: string, selectNumber: number) => {
    const selectedToken = tokens.find(token => token.value === value) || null;

    const updateAmounts = (tokenA: Token | null, tokenB: Token | null) => {
      if (tokenA && tokenB) {
        const parsedAmount1 = parseFloat(amount1);
        const parsedAmount2 = parseFloat(amount2);
        if (amount1) {
          setAmount2(((parsedAmount1 * tokenA.price) / tokenB.price).toFixed(6));
        } else if (amount2) {
          setAmount1(((parsedAmount2 * tokenB.price) / tokenA.price).toFixed(6));
        }
      }
    };

    if (selectNumber === 1) {
      setToken1(selectedToken);
      updateAmounts(selectedToken, token2);
    } else {
      setToken2(selectedToken);
      updateAmounts(token1, selectedToken);
    }
  };


  const handleClickSwap = () => {
    setToken1(prevToken1 => {
      const newToken1 = token2;
      setToken2(prevToken1);
      return newToken1;
    });
    setAmount1(amount2);
    setAmount2(amount1);
    setIsDownIcon(!isDownIcon);
  }

  return (
    <div className="p-10 items-center justify-center text-center w-full">
      <div className='max-w-sm mx-auto '>
        <span className="text-3xl mb-4">Swap</span>
        <div className='pt-4'>
          <Space wrap>
            <Select
              style={{width: 120}}
              value={token1?.value}
              options={options}
              onChange={(value) => handleSelectChange(value, 1)}
            />
            <Input
              style={{width: 120}}
              value={amount1}
              onChange={(e) => handleAmountChange(e.target.value, true)}
            />
          </Space>
        </div>
        <div onClick={handleClickSwap} className="swap-button">
          {isDownIcon ? <ArrowDownOutlined/> : <ArrowUpOutlined/>}
        </div>
        <div>
          <Space wrap>
            <Select
              style={{width: 120}}
              value={token2?.value}
              options={options}
              onChange={(value) => handleSelectChange(value, 2)}
            />
            <Input
              style={{width: 120}}
              value={amount2}
              onChange={(e) => handleAmountChange(e.target.value, false)}
            />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default CurrencySwap;
