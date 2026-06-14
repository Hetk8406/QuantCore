import requests
import xml.etree.ElementTree as ET
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import yfinance as yf

analyzer = SentimentIntensityAnalyzer()

def get_stock_sentiment(symbol):
    """
    Fetches news from Google News RSS and calculates sentiment score.
    Returns:
        dict: {
            "score": float (-1 to 1),
            "label": str (Bullish/Bearish/Neutral),
            "news": list of dicts (title, link, published)
        }
    """
    try:
        # 1. RSS Feed Strategy (Google News)
        clean_symbol = symbol.replace(".NS", "").replace(".BO", "")
        
        # Intelligent Search Query
        is_indian = ".NS" in symbol or ".BO" in symbol
        is_commodity = "=F" in symbol
        
        if is_commodity:
            commodity_map = {"GC=F": "gold", "SI=F": "silver", "PL=F": "platinum", "CL=F": "crude+oil"}
            c_name = commodity_map.get(symbol, clean_symbol)
            query_suffix = f"+{c_name}+prices+news"
            url = f"https://news.google.com/rss/search?q={query_suffix}&hl=en-US&gl=US&ceid=US:en"
        else:
            query_suffix = "+stock+news+india" if is_indian else "+stock+news"
            url = f"https://news.google.com/rss/search?q={clean_symbol}{query_suffix}&hl=en-IN&gl=IN&ceid=IN:en"
        
        response = requests.get(url, timeout=10)
        root = ET.fromstring(response.content)
        
        sentiment_news = []
        total_score = 0
        
        # Scrape top 10 articles
        for item in root.findall('.//item')[:10]:
            title_text = item.find('title').text
            # Remove the source suffix (e.g. " - The Economic Times")
            title = title_text.split(" - ")[0] if " - " in title_text else title_text
            link = item.find('link').text
            pub_date = item.find('pubDate').text
            
            # Use VADER on the title
            vs = analyzer.polarity_scores(title)
            score = vs['compound']
            total_score += score
            
            sentiment_news.append({
                "title": title,
                "link": link,
                "publisher": title_text.split(" - ")[-1] if " - " in title_text else "Google News",
                "published": pub_date,
                "score": score
            })

        # 2. Fallback to yfinance if RSS fails
        if not sentiment_news:
            stock = yf.Ticker(symbol)
            news = stock.news
            if news:
                for article in news[:5]:
                    title = article.get('title', '')
                    if not title: continue
                    vs = analyzer.polarity_scores(title)
                    score = vs['compound']
                    total_score += score
                    sentiment_news.append({
                        "title": title,
                        "link": article.get('link', '#'),
                        "publisher": article.get('publisher', 'Yahoo Finance'),
                        "score": score
                    })

        # 3. Final Calculations
        if not sentiment_news:
            return {
                "score": 0,
                "label": "Neutral",
                "news": []
            }

        avg_score = total_score / len(sentiment_news)
        
        # Determine Label with high sensitivity
        if avg_score >= 0.05:
            label = "Bullish"
        elif avg_score <= -0.05:
            label = "Bearish"
        else:
            label = "Neutral"

        return {
            "score": round(avg_score, 2),
            "label": label,
            "news": sentiment_news # Return all analyzed news
        }

    except Exception as e:
        print(f"Sentiment Audit Error for {symbol}: {e}")
        return {
            "score": 0,
            "label": "Idle",
            "news": []
        }
