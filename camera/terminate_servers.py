import requests
import time

NUM_TESTS = 12

for i in range(NUM_TESTS):
	res = requests.get("http://localhost:5000/cleanup")
	time.sleep(1)