from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from stocks import get_all_stocks
from model import train_predict, fetch_data
from sentiment import get_stock_sentiment

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

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

