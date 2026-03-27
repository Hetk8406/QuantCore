import requests
import xml.etree.ElementTree as ET
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def get_google_news_sentiment(symbol):
    print(f"Fetching Google News for: {symbol}")
    clean_symbol = symbol.replace(".NS", "")
    url = f"https://news.google.com/rss/search?q={clean_symbol}+stock+news+india&hl=en-IN&gl=IN&ceid=IN:en"
    
    try:
        response = requests.get(url, timeout=10)
        root = ET.fromstring(response.content)
        articles = []
        total_score = 0
        
        for item in root.findall('.//item')[:10]:
            title = item.find('title').text
            link = item.find('link').text
            pub_date = item.find('pubDate').text
            
            vs = analyzer.polarity_scores(title)
            score = vs['compound']
            total_score += score
            
            articles.append({
                "title": title,
                "link": link,
                "published": pub_date,
                "score": score
            })
            
        avg_score = total_score / len(articles) if articles else 0
        print(f"Found {len(articles)} articles. Avg Score: {avg_score}")
        for a in articles[:3]:
            print(f" - {a['title']} ({a['score']})")
        return avg_score, articles
    except Exception as e:
        print(f"Error: {e}")
        return 0, []

if __name__ == "__main__":
    get_google_news_sentiment("RELIANCE.NS")
    get_google_news_sentiment("TCS.NS")
    get_google_news_sentiment("HDFCBANK.NS")
