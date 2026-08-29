import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

app_id = "561aae10"
app_key = "1df006b77d79a54fc3ffba2ef183f89b"

test_cases = [
    ("in", "Full Stack Developer", "Bangalore"),
    ("in", "Full Stack Developer", "Bengaluru"),
    ("in", "Full Stack Developer", ""),
    ("in", "Java Developer", "Bangalore"),
    ("in", "Software Engineer", "Bangalore"),
    ("in", "React", "Bangalore"),
]

for country, what, where in test_cases:
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1?app_id={app_id}&app_key={app_key}&what={urllib.parse.quote(what)}"
    if where:
        url += f"&where={urllib.parse.quote(where)}"
    url += "&results_per_page=5&content-type=application/json"
    
    print(f"\n--- Testing: what='{what}', where='{where}' ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx, timeout=8) as response:
            data = json.loads(response.read().decode('utf-8'))
            results = data.get('results', [])
            print(f"Results Count: {len(results)}, Total: {data.get('count', 0)}")
            for r in results[:2]:
                print(f" -> {r.get('title')} at {r.get('company', {}).get('display_name')} in {r.get('location', {}).get('display_name')}")
    except Exception as e:
        print(f"Error: {e}")
