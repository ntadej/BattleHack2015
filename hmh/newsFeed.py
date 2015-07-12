import urllib.request as urllib
import urllib.parse as urlencoder
import json


def remove_datetime_data(text):
    tmp = text
    if '<b>...</b>' in tmp[0:50]:
        tmp = tmp.split('<b>...</b>')
        if len(tmp) != 2:
            tmp.pop(0)
            tmp = '...'.join(tmp)
        else:
            tmp = tmp[1]
    return tmp.strip()


def getFeed(query):
    query = urlencoder.urlencode({'q': query})
    r = urllib.urlopen('https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&'+ query)
    result = json.loads(r.readall().decode('utf-8'))
    js = (result['responseData']['entries'])
    megaArray = []

    i = 0

    for item in js:
        #item['contentSnippet'] = remove_datetime_data(item['contentSnippet'])
        megaArray += [{'title': item['title'], 'link': item['link'], 'snippet': item['contentSnippet']}]
        # megaArray += [item['link']]
        i += 1
        if i == 5:
            break

    return megaArray

# a = getFeed("hillary clinton")


##Return first 5 titles and links to recent news about query
if __name__ == '__main__':
    for i in getFeed('Hillary'):
         tmp = i['snippet']
         #tmp = 'Nekoc nekje <b>...</b> probamo <b>...</b> in <b>...</b>'
         print(tmp)