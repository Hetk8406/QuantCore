import yfinance as yf

def test_currency(symbol):
    print(f"Testing currency for {symbol}...")
    ticker = yf.Ticker(symbol)
    currency = ticker.fast_info.get('currency', 'INR')
    print(f"Currency: {currency}")

if __name__ == "__main__":
    test_currency("AAPL")
    test_currency("RELIANCE.NS")
    test_currency("NVDA")
