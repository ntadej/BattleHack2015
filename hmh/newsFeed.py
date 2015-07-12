import urllib.request as urllib
import urllib.parse as urlencoder
import json


def getFeed(query):
    query = urlencoder.urlencode({'q': query})
    r = urllib.urlopen('https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&'+ query)
    result = json.loads(r.readall().decode('utf-8'))
    js = (result['responseData']['entries'])
    megaArray = []

    i = 0

    for item in js:
        megaArray += [{'title': item['title'], 'link': item['link']}]
        # megaArray += [item['link']]
        i += 1
        if i == 5:
            break

    return megaArray

# a = getFeed("hillary clinton")


##Return first 5 titles and links to recent news about query
