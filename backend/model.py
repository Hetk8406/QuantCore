import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM

CURRENCY_SYMBOLS = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'CAD': '$',
    'AUD': '$',
    'KRW': '₩',
    'HKD': 'HK$',
    'SGD': 'S$',
    'CHF': 'CHF',
    'AUD': 'A$',
    'NZD': 'NZ$',
    'TWD': 'NT$',
    'BRL': 'R$',
    'RUB': '₽',
    'ZAR': 'R',
    'THB': '฿',
    'IDR': 'Rp',
    'TRY': '₺',
    'SAR': 'SR',
    'AED': 'DH',
    'BSE': '₹',
    'NSE': '₹'
}

def get_currency_meta(symbol: str):
    """Detects currency for a ticker using fast_info."""
    try:
        ticker = yf.Ticker(symbol)
        code = ticker.fast_info.get('currency', 'INR')
        
        # Fallback to the code itself if we don't have a specific symbol
        # This prevents Samsung (KRW) from ever defaulting to INR (₹)
        symbol_out = CURRENCY_SYMBOLS.get(code, code)
        
        return {
            "code": code,
            "symbol": symbol_out
        }
    except Exception:
        return {"code": "INR", "symbol": "₹"}

def fetch_data(symbol: str, period="5y"):
    """Fetches historical data from Yahoo Finance."""
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        if df.empty:
            return None
        return df
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

def train_predict_linear(df, symbol):
    # Feature Engineering
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    
    # Drop NaN values created by rolling windows
    df = df.dropna()

    # Create Target: Next Day's Close
    df['Target'] = df['Close'].shift(-1)
    
    # Features for training
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA10', 'MA50']
    
    # We drop the last row for training because it has no Target (yet)
    data = df.dropna()
    
    X = data[features]
    y = data['Target']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    # Train
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    # Predict for Tomorrow
    last_row = df.iloc[[-1]][features]
    next_price = model.predict(last_row)[0]
    
    return next_price, mae, r2

import os

MODELS_DIR = "models"
if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

def train_predict_lstm(df, symbol):
    # Preprocessing
    data = df.filter(['Close'])
    dataset = data.values
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(dataset)
    
    # Check for saved model
    model_path = os.path.join(MODELS_DIR, f"{symbol}_lstm.keras")
    today_str = datetime.now().strftime('%Y-%m-%d')
    model = None
    
    # If model exists and was modified today, load it
    if os.path.exists(model_path):
        modified_time = datetime.fromtimestamp(os.path.getmtime(model_path)).strftime('%Y-%m-%d')
        if modified_time == today_str:
            try:
                print(f"Loading model for {symbol} from disk...")
                model = tf.keras.models.load_model(model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                model = None

    prediction_days = 60
    training_data_len = int(len(dataset) * 0.8)

    if model is None:
        print(f"Training new model for {symbol}...")
        # Create sequences
        x_train, y_train = [], []
        
        # Use 80% of data for training
        train_data = scaled_data[0:training_data_len, :]
        
        for i in range(prediction_days, len(train_data)):
            x_train.append(train_data[i-prediction_days:i, 0])
            y_train.append(train_data[i, 0])
            
        x_train, y_train = np.array(x_train), np.array(y_train)
        x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
        
        # Build LSTM Model
        model = Sequential()
        model.add(LSTM(units=50, return_sequences=False, input_shape=(x_train.shape[1], 1)))
        model.add(Dense(units=1))
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(x_train, y_train, batch_size=32, epochs=5, verbose=0)
        
        # Save model
        try:
            model.save(model_path)
            print(f"Saved model for {symbol} to {model_path}")
        except Exception as e:
            print(f"Error saving model: {e}")

    # Evaluate on test set (re-create test data even if model loaded, for metrics)
    test_data = scaled_data[training_data_len - prediction_days:, :]
    x_test = []
    y_test = dataset[training_data_len:, :]
    
    for i in range(prediction_days, len(test_data)):
        x_test.append(test_data[i-prediction_days:i, 0])
        
    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
    
    predictions = model.predict(x_test)
    predictions = scaler.inverse_transform(predictions)
    
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    # Predict Next Day
    last_60_days = scaled_data[-prediction_days:]
    X_input = []
    X_input.append(last_60_days)
    X_input = np.array(X_input)
    X_input = np.reshape(X_input, (X_input.shape[0], X_input.shape[1], 1))
    
    next_price_scaled = model.predict(X_input)
    next_price = scaler.inverse_transform(next_price_scaled)[0][0]
    
    return next_price, mae, r2, predictions

def calculate_rsi(data, window=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(data, slow=26, fast=12, signal=9):
    exp1 = data.ewm(span=fast, adjust=False).mean()
    exp2 = data.ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    return macd, signal_line

def get_signal(current_price, predicted_price, rsi, macd, macd_signal):
    """
    Generates a Buy/Sell signal based on technicals and prediction.
    Score: 0 (Strong Sell) to 100 (Strong Buy).
    """
    score = 50  # Neutral start
    
    # 1. Price Prediction Impact (Weight: 40%)
    # If predicted price is higher -> Bullish
    price_change = ((predicted_price - current_price) / current_price) * 100
    if price_change > 1:
        score += 20
    elif price_change < -1:
        score -= 20
        
    # 2. RSI Impact (Weight: 30%)
    # RSI < 30 (Oversold) -> Buy Signal
    # RSI > 70 (Overbought) -> Sell Signal
    if rsi is not None:
        if rsi < 30:
            score += 15
        elif rsi > 70:
            score -= 15
        elif rsi > 50:
             score += 5
        else:
             score -= 5

    # 3. MACD Impact (Weight: 30%)
    # MACD > Signal -> Bullish
    if macd is not None and macd_signal is not None:
        if macd > macd_signal:
            score += 15
        else:
            score -= 15
            
    # Clamp Score
    score = max(0, min(100, score))
    
    # Determine Verdict
    if score >= 80:
        verdict = "STRONG BUY"
    elif score >= 60:
        verdict = "BUY"
    elif score <= 20:
        verdict = "STRONG SELL"
    elif score <= 40:
        verdict = "SELL"
    else:
        verdict = "NEUTRAL"
        
    return verdict, score

def train_predict(symbol: str, model_type="linear"):
    """
    Dispatcher for model training and prediction.
    """
    df = fetch_data(symbol)
    if df is None:
        return {"error": "Could not fetch data"}

    # Date Logic
    last_date = df.index[-1]
    last_date_str = last_date.strftime('%Y-%m-%d')
    
    # Next trading day logic (Simple approximation: +1 day, skip weekends)
    next_date = last_date + timedelta(days=1)
    if next_date.weekday() == 5: # Saturday -> Monday
        next_date += timedelta(days=2)
    elif next_date.weekday() == 6: # Sunday -> Monday
        next_date += timedelta(days=1)
    
    prediction_date_str = next_date.strftime('%Y-%m-%d')

    if model_type == "lstm":
        # LSTM needs more data to be stable, ensure we have enough
        if len(df) < 200:
             return {"error": "Not enough data for LSTM"}
        next_price, mae, r2, _ = train_predict_lstm(df, symbol)
    else:
        next_price, mae, r2 = train_predict_linear(df, symbol)
    
    # Feature Engineering for Chart
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    df['RSI'] = calculate_rsi(df['Close'])
    macd_series, signal_series = calculate_macd(df['Close'])
    df['MACD'] = macd_series
    df['Signal'] = signal_series
    
    # Extract Latest Technicals for Signal
    latest_rsi = df.iloc[-1]['RSI']
    latest_macd = df.iloc[-1]['MACD']
    latest_signal_line = df.iloc[-1]['Signal']
    
    # Calculate Signal
    # Handle NaN values safely
    latest_rsi_val = float(latest_rsi) if pd.notnull(latest_rsi) else None
    latest_macd_val = float(latest_macd) if pd.notnull(latest_macd) else None
    latest_sig_val = float(latest_signal_line) if pd.notnull(latest_signal_line) else None
    
    signal_verdict, signal_score = get_signal(
        current_price=df.iloc[-1]['Close'], 
        predicted_price=next_price, 
        rsi=latest_rsi_val, 
        macd=latest_macd_val, 
        macd_signal=latest_sig_val
    )

    # Replace NaN with None for JSON serialization
    # Note: Pandas where(pd.notnull(df), None) can sometimes be tricky with types. 
    # Better to convert to dict first then clean it.
    
    recent_df = df.tail(60).reset_index() # Show last 60 days to see indicators better
    recent_df['Date'] = recent_df['Date'].dt.strftime('%Y-%m-%d')
    
    # Convert to dict
    chart_data = recent_df[['Date', 'Close', 'MA10', 'MA50', 'RSI', 'MACD', 'Signal']].to_dict(orient='records')
    
    # Clean NaN values from list of dicts
    clean_chart_data = []
    for record in chart_data:
        clean_record = {}
        for k, v in record.items():
            if pd.isna(v):
                clean_record[k] = None
            else:
                clean_record[k] = v
        clean_chart_data.append(clean_record)

    # Currency Meta
    meta = get_currency_meta(symbol)
    
    return {
        "symbol": symbol,
        "current_price": round(df.iloc[-1]['Close'], 2),
        "current_date": last_date_str,
        "predicted_price": round(float(next_price), 2),
        "prediction_date": prediction_date_str,
        "mae": round(float(mae), 2),
        "r2_score": round(float(r2), 4),
        "chart_data": clean_chart_data,
        "model_type": model_type.upper(),
        "signal": signal_verdict,
        "signal_score": signal_score,
        "currency_code": meta["code"],
        "currency_symbol": meta["symbol"],
        "technicals": {
            "rsi": round(latest_rsi_val, 2) if latest_rsi_val else None,
            "macd": round(latest_macd_val, 2) if latest_macd_val else None
        }
    }

def run_backtest(symbol, days=30):
    """
    Simulates model performance over the last N days.
    """
    df = fetch_data(symbol, period="1y") # Need enough history
    if df is None:
        return {"error": "Could not fetch data"}
        
    if len(df) < days + 60: # Ensure enough training data
        return {"error": "Not enough historical data for backtest"}

    # Prepare Data
    
def run_backtest(symbol, days=30, model_type="linear"):
    """
    Simulates model performance over the last N days.
    """
    df = fetch_data(symbol, period="1y") # Needs 1 year to have enough training data
    if df is None or len(df) < days + 50:
        return {"error": "Insufficient data for a backtest. (Need more than 50 days total)"}
    
    # Technical Indicators
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    df = df.dropna()
    df = df.reset_index()
    
    # Split
    split_idx = len(df) - days
    train_df = df.iloc[:split_idx].copy()
    test_df = df.iloc[split_idx:].copy()
    
    # Features
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA10', 'MA50']
    train_df['Target'] = train_df['Close'].shift(-1)
    train_df = train_df.dropna()
    
    X_train = train_df[features]
    y_train = train_df['Target']
    
    # Choose Model
    if model_type == 'lstm':
        # Use Random Forest as 'Advanced' for the interactive backtester
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    else:
        model = LinearRegression()
        
    model.fit(X_train, y_train)
    
    # Predict on Test Set
    # We predict the 'Next Day Close' for each day in test set
    X_test = test_df[features]
    predictions = model.predict(X_test)
    
    # Calculate Accuracy
    dates = test_df['Date'].dt.strftime('%Y-%m-%d').tolist()
    actuals = test_df['Close'].tolist() # Wait, we predict next day, so align with next day actuals?
    # Correct: On Day T, we predict Close(T+1).
    # So Prediction[i] should be compared with Actual[i+1]
    
    # Let's simplify: 
    # Logic: On Date X, Model predicts Price Y.
    # We want to show: Date X, Actual Price (Close), Predicted Price (Validation)
    
    # Re-align for display:
    # We have X_test rows. 
    # For row i (Date D), we predict Target (Date D+1 Close).
    
    aligned_results = []
    total_error = 0
    count = 0
    
    # Getting actual next day closes from the original full dataframe
    # The 'test_df' has rows for dates D...
    # We need Close for D+1...
    
    future_closes = df['Close'].shift(-1).iloc[split_idx:]
    # Last row of future_closes will be NaN (tomorrow)
    
    preds_list = predictions.tolist()
    actuals_list = future_closes.tolist()
    
    for i in range(len(dates)):
        if i >= len(actuals_list) or pd.isna(actuals_list[i]):
            continue
            
        pred = preds_list[i]
        act = actuals_list[i]
        
        diff = abs(pred - act)
        error_pct = (diff / act) * 100
        total_error += error_pct
        count += 1
        
        aligned_results.append({
            "date": dates[i],
            "actual": round(act, 2),
            "predicted": round(pred, 2),
            "error_pct": round(error_pct, 2)
        })
        
    accuracy = 100 - (total_error / count) if count > 0 else 0
    
    return {
        "symbol": symbol,
        "days": days,
        "accuracy": round(accuracy, 2),
        "data": aligned_results
    }

def generate_stock_report(symbol):
    df = fetch_data(symbol, period="1y")
    if df is None or len(df) < 60:
        return None
    
    # Train a quick model for the predicted price
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    df_clean = df.copy().dropna()
    
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA10', 'MA50']
    X = df_clean[features]
    y = df_clean['Close'].shift(-1).fillna(df_clean['Close'] * 1.01) # Simple target for latest row
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Analyze the last 30 days
    report_df = df.tail(30).copy()
    report_df['Next_Day_Prediction'] = model.predict(report_df[features])
    report_df['Prev_Close'] = report_df['Close'].shift(1)
    report_df['Daily_Change_Pct'] = ((report_df['Close'] - report_df['Prev_Close']) / report_df['Prev_Close']) * 100
    
    # Formatting
    report_df['Date'] = report_df.index.strftime('%Y-%m-%d')
    output_cols = ['Date', 'Prev_Close', 'Close', 'Daily_Change_Pct', 'Next_Day_Prediction']
    final_report = report_df[output_cols].copy()
    
    import os
    report_dir = "reports"
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)
        
    file_path = f"{report_dir}/{symbol}_analysis.xlsx"
    final_report.to_excel(file_path, index=False)
    return file_path

def get_market_heatmap():
    from stocks import NIFTY_50
    import yfinance as yf
    
    # Download last 5 days to ensure we get at least 2 valid trading days
    tickers_str = " ".join(NIFTY_50)
    
    # Suppress output and download
    df = yf.download(tickers_str, period="5d", progress=False)
    
    if "Close" not in df:
        return []
        
    close_data = df['Close']
    results = []
    
    for symbol in NIFTY_50:
        try:
            if symbol in close_data:
                stock_close = close_data[symbol].dropna()
                if len(stock_close) >= 2:
                    prev = float(stock_close.iloc[-2])
                    curr = float(stock_close.iloc[-1])
                    pct = ((curr - prev) / prev) * 100
                    results.append({
                        "symbol": symbol,
                        "name": symbol.replace(".NS", ""),
                        "price": round(curr, 2),
                        "change": round(pct, 2)
                    })
        except Exception:
            pass
            
    # Sort by descending order of percentage change
    results.sort(key=lambda x: x["change"], reverse=True)
    return results

def get_price_analysis_data(symbol, model_type="linear"):
    """
    Fetches historical data and runs a mini-backtest to show predictions vs actuals 
    for the analysis period.
    """
    df = fetch_data(symbol, period="6mo") # Fetch 6 months to ensure MA50 is populated
    if df is None or len(df) < 20:
        return {"error": "Insufficient data (need at least 20 trading days)"}
    
    # Feature Engineering
    df['MA10'] = df['Close'].rolling(window=10).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    df = df.dropna()
    df = df.reset_index()
    
    # Split for mini-backtest of the last 10 days
    backtest_days = 10
    split_idx = len(df) - backtest_days
    train_df = df.iloc[:split_idx].copy()
    test_df = df.iloc[split_idx:].copy()
    
    # Train a model on everything BEFORE the analysis period
    features = ['Open', 'High', 'Low', 'Close', 'Volume', 'MA10', 'MA50']
    train_df['Target'] = train_df['Close'].shift(-1)
    train_df = train_df.dropna()
    
    X_train = train_df[features]
    y_train = train_df['Target']
    
    if model_type == 'lstm':
        # For analysis, we use RandomForest as 'Advanced' because it's faster than LSTM 
        # but capture more patterns than Linear
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    else:
        model = LinearRegression()
        
    model.fit(X_train, y_train)
    
    # Predict for each day in the analysis period
    X_test = test_df[features]
    preds = model.predict(X_test)
    
    # Since we predicted Next Day Closes, we need to compare them with the ACTUAL next day
    # Or shift: The prediction made ON Day T-1 for Day T
    
    results = []
    
    # To align correctly:
    # Day T (today) actual: test_df.iloc[idx]['Close']
    # Day T (today) prediction (made yesterday): preds[idx-1]
    
    for i in range(len(test_df)):
        date_str = test_df.iloc[i]['Date'].strftime('%Y-%m-%d')
        actual = float(test_df.iloc[i]['Close'])
        
        # Get what we predicted yesterday FOR today (if applicable)
        predicted = None
        accuracy_val = None
        
        if i > 0:
             predicted = float(preds[i-1]) # Prediction for Day i made on Day i-1
             error = abs(predicted - actual)
             accuracy_val = max(0, 100 - (error / actual * 100))
             
        results.append({
            "date": date_str,
            "actual_open": round(float(test_df.iloc[i]['Open']), 2),
            "actual_close": round(actual, 2),
            "predicted_close": round(predicted, 2) if predicted else None,
            "prediction_error": round(float(actual - predicted), 2) if predicted else None,
            "accuracy": round(accuracy_val, 2) if accuracy_val else None,
            "prev_close": round(float(test_df.iloc[i-1]['Close']), 2) if i > 0 else None,
            "daily_change_pct": round(float(((test_df.iloc[i]['Close'] - test_df.iloc[i-1]['Close']) / test_df.iloc[i-1]['Close']) * 100), 2) if i > 0 else None
        })
        
    # Get Currency Meta
    meta = get_currency_meta(symbol)
        
    return {
        "data": results,
        "currency_symbol": meta["symbol"],
        "currency_code": meta["code"]
    }
