
import requests
import yaml

if False:
    # Napiši bazo
    baza = []

    base_url = 'https://www.charitywatch.org'
    url_1 = 'https://www.charitywatch.org/ajax/charity_by_letter.php?category_number='
    url_2 = '&div=letter_list'

    kategorije = [15, 16, 17, 18, 41, 40]
    kategorije_imena = ['drugs', 'environment', 'guns', 'health', 'lgbt', 'abortion']
    kategorije_to_issue = {
        15: 13,
        16: 6,
        17: 15,
        18: 8,
        40: 9,
        41: 3
        }

    for i in range(len(kategorije)):
        a = requests.get(url_1 + str(kategorije[i]) + url_2)
        c = a.content.decode()
        d = [i.split('<\\/td><\\/tr>')[0] for i in c.strip('{}').split(':')[1].split('<tr><td>')][1:]

        for j in d:
            tmp = j.split('>')
            u = tmp[0].split('"')[1].replace('\\', '')
            n = tmp[1].split('<')[0]
            # u - url of charity
            # n - name of charity
            
            #print(u, n, sep='         ')
            #na base_url + u je description
            #print(base_url + u)
            
            opis = requests.get(base_url + u).content.decode()
            opis = opis.split('Stated Mission')[1].split('</div>')[0].split('</h2>')[1].strip()
            if opis[:4] == '</a>': opis = opis[4:]
            
            #print(opis)

            #print(kategorije[i])

            baza += [{
                'ime': n,
                'url': u,
                'opis': opis,
                'value': 2,
                'issue_id': kategorije_to_issue[kategorije[i]]
                }]
    with open('baza.yaml', 'w') as f:
        f.write(yaml.dump(baza, default_flow_style=False))

    print('done')

if True:
    # beautify
    with open('baza.yaml', 'r') as f:
        stuff = yaml.load(f.read())
    ret = []
    for i, s in enumerate(stuff):
        tmp = {}
        tmp['id'] = i
        tmp['model'] = 'charity'
        tmp['field'] = {}
        tmp['field']['value'] = s['value']
        tmp['field']['name'] = s['ime']
        tmp['field']['description'] = s['opis']
        ret += [tmp]
    with open('baza2.yaml', 'w') as f:
        f.write(yaml.dump(ret))
