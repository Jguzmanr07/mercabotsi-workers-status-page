import requests
import time

# let verified be an empty list
# read the file sites.csv. For each line, test the domain to see if it is working and reacheable, terminate the request after 5 seconds 
# if the http request returns with status 200, then add the domain name to the list verified

headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'}
verified = []
with open('sites.csv', 'r') as f:
    for line in f:
        domain = line.strip()
        # add http:// to the domain if it is not there
        if not domain.startswith('http://'):
            domain = 'http://' + domain
        try:
            r = requests.get(domain, timeout=80, headers=headers)
            if r.status_code == 200:
                verified.append(domain)
                print(domain, 'is working')
            if r.status_code == 301:
                verified.append(domain)
                print(domain, 'is working')
            if r.status_code == 302:
                verified.append(domain)
                print(domain, 'is working')
            else:
                print(domain, 'is not working')
        except:
            print(domain, 'is not working')
            continue
print(verified)
