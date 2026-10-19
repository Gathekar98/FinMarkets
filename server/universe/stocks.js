// Tracked stock universe (NSE). Any other NSE/BSE stock still works on its detail
// page via search; this list drives screeners, movers, breadth and scores.
// Symbols that stop returning quotes (renames, delistings) are skipped automatically.

const S = (sector, list) => list.map((symbol) => ({ symbol: `${symbol}.NS`, sector }));

export const STOCKS = [
  ...S('Banks', ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK', 'BANKBARODA', 'FEDERALBNK', 'PNB', 'IDFCFIRSTB']),
  ...S('Finance', ['BAJFINANCE', 'BAJAJFINSV', 'SHRIRAMFIN', 'JIOFIN', 'CHOLAFIN', 'MUTHOOTFIN', 'BSE', 'CDSL', 'CAMS', 'ANGELONE']),
  ...S('Insurance', ['SBILIFE', 'HDFCLIFE', 'ICICIGI', 'LICI']),
  ...S('IT Services', ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'TECHM', 'LTIM', 'PERSISTENT', 'COFORGE', 'KPITTECH']),
  ...S('Oil & Gas', ['RELIANCE', 'ONGC', 'BPCL', 'IOC']),
  ...S('Power', ['NTPC', 'POWERGRID', 'TATAPOWER', 'ADANIGREEN', 'IEX']),
  ...S('Mining', ['COALINDIA', 'VEDL']),
  ...S('Auto', ['MARUTI', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO', 'TVSMOTOR', 'TMPV', 'ASHOKLEY']),
  ...S('FMCG', ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'TATACONSUM', 'DABUR', 'GODREJCP']),
  ...S('Pharma', ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'LUPIN']),
  ...S('Healthcare', ['APOLLOHOSP', 'MAXHEALTH']),
  ...S('Metals', ['TATASTEEL', 'JSWSTEEL', 'HINDALCO']),
  ...S('Cement', ['ULTRACEMCO', 'GRASIM', 'AMBUJACEM', 'SHREECEM']),
  ...S('Capital Goods', ['LT', 'BEL', 'HAL', 'SIEMENS', 'ABB', 'CUMMINSIND', 'POLYCAB', 'KAYNES']),
  ...S('Telecom', ['BHARTIARTL']),
  ...S('Consumer', ['TITAN', 'ASIANPAINT', 'TRENT', 'DMART', 'HAVELLS', 'DIXON', 'VOLTAS', 'PIDILITIND']),
  ...S('Conglomerate', ['ADANIENT', 'ADANIPORTS']),
  ...S('Internet', ['ETERNAL', 'NYKAA', 'PAYTM', 'NAUKRI']),
  ...S('Travel & Hotels', ['INDIGO', 'INDHOTEL', 'IRCTC']),
  ...S('Realty', ['DLF', 'GODREJPROP', 'OBEROIRLTY']),
  ...S('Chemicals', ['SRF', 'UPL']),
];

export const sectorOf = (symbol) => STOCKS.find((s) => s.symbol === symbol)?.sector || null;

export const INDIAN_INDICES = [
  { symbol: '^NSEI', name: 'Nifty 50' },
  { symbol: '^BSESN', name: 'BSE Sensex' },
  { symbol: '^NSEBANK', name: 'Nifty Bank' },
  { symbol: 'BSE-500.BO', name: 'BSE 500' },
  { symbol: 'NIFTY_MIDCAP_100.NS', name: 'Nifty Midcap 100' },
  { symbol: '^CNXSC', name: 'Nifty Smallcap 100' },
  { symbol: '^CNXIT', name: 'Nifty IT' },
  { symbol: '^CNXPSUBANK', name: 'Nifty PSU Bank' },
];

export const SECTOR_INDICES = [
  { symbol: '^CNXIT', name: 'IT' },
  { symbol: '^NSEBANK', name: 'Banks' },
  { symbol: '^CNXAUTO', name: 'Auto' },
  { symbol: '^CNXPHARMA', name: 'Pharma' },
  { symbol: '^CNXFMCG', name: 'FMCG' },
  { symbol: '^CNXMETAL', name: 'Metals' },
  { symbol: '^CNXENERGY', name: 'Energy' },
  { symbol: '^CNXREALTY', name: 'Realty' },
  { symbol: '^CNXINFRA', name: 'Infrastructure' },
  { symbol: '^CNXMEDIA', name: 'Media' },
  { symbol: '^CNXPSUBANK', name: 'PSU Banks' },
];

export const GLOBAL_INDICES = [
  { symbol: '^DJI', name: 'Dow Jones', region: 'USA' },
  { symbol: '^GSPC', name: 'S&P 500', region: 'USA' },
  { symbol: '^IXIC', name: 'Nasdaq', region: 'USA' },
  { symbol: '^FTSE', name: 'FTSE 100', region: 'UK' },
  { symbol: '^GDAXI', name: 'DAX', region: 'Germany' },
  { symbol: '^N225', name: 'Nikkei 225', region: 'Japan' },
  { symbol: '^HSI', name: 'Hang Seng', region: 'Hong Kong' },
  { symbol: '^STI', name: 'Straits Times', region: 'Singapore' },
];

export const COMMODITIES = [
  { symbol: 'GC=F', name: 'Gold (₹/10g)', convert: 'gold' },
  { symbol: 'SI=F', name: 'Silver (₹/kg)', convert: 'silver' },
  { symbol: 'BZ=F', name: 'Brent Crude ($/bbl)' },
  { symbol: 'INR=X', name: 'USD / INR' },
];
