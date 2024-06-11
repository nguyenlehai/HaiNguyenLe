// Problem 3: Messy React

interface WalletBalance {
  blockchain: string; 
  currency: string;
  amount: number;
}

interface Props extends BoxProps {}

const PRIORITY_DEFAULT = -99;

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Use a constant for unknown priority

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis': return 100;
      case 'Ethereum': return 50;
      case 'Arbitrum': return 30;
      case 'Zilliqa': return 20;
      case 'Neo': return 20;
      default: return PRIORITY_DEFAULT;
    }
  };

  // Corrected filtering and sorting logic
  const sortedBalances = useMemo(() => {
    return balances
      .filter(balance => getPriority(balance.blockchain) > PRIORITY_DEFAULT && balance.amount > 0)
      .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
  }, [balances]);

  // Simplify by combining formatting directly in the rendering
  const rows = sortedBalances.map((balance, index) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}  // Use a unique key if available, here assumed currency
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};
