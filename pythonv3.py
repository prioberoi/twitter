import tweepy
from tweepy.parsers import RawParser
from tweepy import Cursor

consumer_key = ''
consumer_secret = ''
access_token = ''
access_token_secret = ''

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

rawParser = RawParser()
api = tweepy.API(auth_handler=auth, parser=rawParser)

outputfile = open('output.csv','w')

for tweet in tweepy.Cursor(api.search, q='womenagainstfeminism', count=500).items():
    print tweet

tweepy_object = tweepy.Cursor(api.search, q='womenagainstfeminism', count=500).items()
for item in tweepy_object:
	print item

