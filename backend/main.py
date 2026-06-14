from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from stocks import get_all_stocks
from model import train_predict, fetch_data, run_backtest, get_market_heatmap, generate_stock_report, get_price_analysis_data
from fastapi.responses import FileResponse
from yahooquery import search
import os
from sentiment import get_stock_sentiment

app = FastAPI()

origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Indian Stock Price Prediction API"}

@app.get("/api/stocks")
def get_stocks():
    return get_all_stocks()

@app.get("/api/search")
def search_stocks(q: str):
    """
    Dynamic Global Search via yahooquery.
    """
    if not q or len(q) < 2:
        return []
    
    try:
        results = search(q)
        quotes = results.get('quotes', [])
        
        # Format for frontend StockSelector
        formatted = []
        for qt in quotes:
            # We filter for EQUITY, ETF, and FUTURE (Commodities)
            if qt.get('quoteType') in ['EQUITY', 'ETF', 'FUTURE']:
                formatted.append({
                    "symbol": qt.get('symbol'),
                    "name": qt.get('shortname', qt.get('longname', 'Unknown')),
                    "exchange": qt.get('exchange', 'COMMODITY' if qt.get('quoteType') == 'FUTURE' else 'GLOBAL'),
                    "type": qt.get('quoteType')
                })
        return formatted[:8] # Limit to top 8 for clean UI
    except Exception as e:
        print(f"Global Search Failure: {e}")
        return []

@app.get("/api/predict/{symbol}")
def predict(symbol: str, model_type: str = "linear"):
    result = train_predict(symbol, model_type=model_type)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.get("/api/data/{symbol}")
def get_history(symbol: str, period: str = "1mo"):
    df = fetch_data(symbol, period=period)
    if df is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    df = df.reset_index()
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    return df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].to_dict(orient='records')

@app.get("/api/sentiment/{symbol}")
def get_sentiment(symbol: str):
    return get_stock_sentiment(symbol)

@app.get("/api/backtest/{symbol}")
def backtest(symbol: str, days: int = 30, model_type: str = "linear"):
    result = run_backtest(symbol, days=days, model_type=model_type)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/api/heatmap")
def heatmap():
    """
    Returns the daily % change for NIFTY 50 stocks for heatmap visualization.
    """
    return get_market_heatmap()

@app.get("/api/analysis/{symbol}")
def price_analysis(symbol: str, model_type: str = "linear"):
    """
    Returns a tabular analysis showing historical price data.
    """
    result = get_price_analysis_data(symbol, model_type)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/api/top-stocks")
def get_top_stocks():
    """
    Returns a curated list of top Indian & World stocks/commodities 
    for the homepage marquee.
    """
    import yfinance as yf
    ticker_list = [
        "^NSEI", "^BSESN", "RELIANCE.NS", "TCS.NS", # India
        "^IXIC", "AAPL", "MSFT", "NVDA", "TSLA", # World
        "GC=F", "BTC-USD" # Commodities/Crypto
    ]
    
    results = []
    for sym in ticker_list:
        try:
            t = yf.Ticker(sym)
            # Reliable price fetching strategy
            info = t.info
            price = info.get('regularMarketPrice', info.get('currentPrice', 0))
            
            # If currentPrice/regularMarketPrice is 0 (sometimes happens with yf), use fast_info or history
            if not price:
                fast = t.fast_info
                price = fast.get('last_price', 0)
            if not price:
                hist = t.history(period='1d')
                if not hist.empty:
                    price = hist['Close'].iloc[-1]
            
            price = round(float(price), 2) if price else 0
            
            # Daily change calculation
            prev = info.get('previousClose')
            if not prev:
                prev = t.fast_info.get('previous_close', price)
            
            change = round(((price - prev) / prev) * 100, 2) if prev and price else 0
            
            # Label mapping
            labels = {
                "^NSEI": "Nifty 50",
                "^BSESN": "SENSEX",
                "RELIANCE.NS": "Reliance",
                "TCS.NS": "TCS",
                "^IXIC": "NASDAQ",
                "AAPL": "Apple",
                "MSFT": "Microsoft",
                "NVDA": "NVIDIA",
                "TSLA": "Tesla",
                "GC=F": "Gold",
                "BTC-USD": "Bitcoin"
            }
            
            # Use established currency meta logic
            from model import get_currency_meta
            curr_meta = get_currency_meta(sym)
            
            results.append({
                "symbol": labels.get(sym, sym),
                "price": price,
                "change": change,
                "currency_symbol": curr_meta["symbol"]
            })
        except Exception:
            continue
            
    return results
