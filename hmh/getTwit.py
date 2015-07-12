import os
from TwitterAPI import TwitterAPI
api = TwitterAPI(os.environ['TWITTER_APIKEY'], os.environ['TWITTER_APISECRET'], os.environ['TWITTER_ACCESS'], os.environ['TWITTER_ACCESSSECRET'])

def getTwit(query):
    r = api.request('search/tweets', {'q':query, 'count':5})

    megaArray = []

    for item in r:
        result = dict()

        imgUrl = item['user']['profile_image_url']
        name = item['user']['screen_name']
        text = item['text']

        result["name"] = name
        result["text"] = text
        result["imgUrl"] = imgUrl

        megaArray += [result]

    return megaArray
