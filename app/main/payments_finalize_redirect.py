import json
import requests

URL = 'https://checkout-test.adyen.com/v68/payments/details'
HEADERS = {
    'X-API-KEY': 'AQEyhmfxKonIYxZGw0m/n3Q5qf3VaY9UCJ14XWZE03G/k2NFikzVGEiYj+4vtN01BchqAcwQwV1bDb7kfNy1WIxIIkxgBw==-JtQ5H0iXtu8rqQMD6iAb33gf2qZeGKGhrMpyQAt9zsw=-3wAkV)*$kP%bCcSf'}


def finalize(redirect_result):
    details_request = redirect_result
    print("finalize method")
    print("/payments/details request:\n" + str(details_request))
    response = requests.post(URL, headers=HEADERS, json=details_request)
    formatted_response = json.loads(json.dumps(response.json()))
    print("/payments/details response:\n" + json.dumps(response.json()))

    return formatted_response
