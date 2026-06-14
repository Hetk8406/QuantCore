import yfinance as yf

ticker_list = ["^NSEI", "RELIANCE.NS", "AAPL", "GC=F", "BTC-USD"]
for sym in ticker_list:
    t = yf.Ticker(sym)
    info = t.fast_info
    price = info.get('last_price', 0)
    print(f"Symbol: {sym}, Price: {price}, MarketCap: {info.get('market_cap', 0)}")
