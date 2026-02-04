from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import yfinance as yf

analyzer = SentimentIntensityAnalyzer()

def get_stock_sentiment(symbol):
    """
    Fetches news for a stock and calculates sentiment score.
    Returns:
        dict: {
            "score": float (-1 to 1),
            "label": str (Bullish/Bearish/Neutral),
            "news": list of dicts (title, link, published)
        }
    """
    try:
        # 1. Fetch News
        stock = yf.Ticker(symbol)
        news = stock.news
        
        if not news:
            return {
                "score": 0,
                "label": "Neutral",
                "news": []
            }

        # 2. Analyze Sentiment
        total_score = 0
        sentiment_news = []
        
        for article in news:
            title = article.get('title', '')
            if not title:
                continue
                
            # Calculate VADER score for the title
            vs = analyzer.polarity_scores(title)
            compound = vs['compound']
            total_score += compound
            
            sentiment_news.append({
                "title": title,
                "link": article.get('link', '#'),
                "publisher": article.get('publisher', 'Unknown'),
                "score": compound
            })

        # 3. Calculate Average
        avg_score = total_score / len(sentiment_news) if sentiment_news else 0
        
        # 4. Determine Label
        if avg_score >= 0.05:
            label = "Bullish"
        elif avg_score <= -0.05:
            label = "Bearish"
        else:
            label = "Neutral"

        return {
            "score": round(avg_score, 2),
            "label": label,
            "news": sentiment_news[:5] # Return top 5
        }

    except Exception as e:
        print(f"Error fetching sentiment for {symbol}: {e}")
        return {
            "score": 0,
            "label": "Error",
            "news": []
        }
