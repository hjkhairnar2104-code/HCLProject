import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

app_id = "561aae10"
app_key = "1df006b77d79a54fc3ffba2ef183f89b"

for country in ["in", "gb", "us"]:
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1?app_id={app_id}&app_key={app_key}&what=Java%20Developer&results_per_page=5&content-type=application/json"
    print(f"Testing {country}: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as response:
            data = json.loads(response.read().decode('utf-8'))
            count = len(data.get('results', []))
            print(f"[{country.upper()}] Success! Total results: {data.get('count', 0)}, Returned: {count}")
            if count > 0:
                first = data['results'][0]
                print(f"Sample job: {first.get('title')} at {first.get('company', {}).get('display_name')} ({first.get('location', {}).get('display_name')})")
                print(f"URL: {first.get('redirect_url')}")
    except Exception as e:
        print(f"[{country.upper()}] Failed: {e}")
