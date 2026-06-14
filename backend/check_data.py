import yfinance as yf
import pandas as pd

def check_reliance():
    symbol = "RELIANCE.NS"
    ticker = yf.Ticker(symbol)
    
    # Check History
    df = ticker.history(period="1d", auto_adjust=False)
    print("--- History Feed (Today) ---")
    print(df[['Open', 'Close']])
    
    # Check Fast Info
    print("\n--- Fast Info (Real-time) ---")
    try:
        print(f"Open: {ticker.fast_info['open']}")
        # print(f"Last Price: {ticker.fast_info['last_price']}")
    except Exception as e:
        print(f"Fast info check failed: {e}")

if __name__ == "__main__":
    check_reliance()
