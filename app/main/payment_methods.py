import json
import requests

URL = 'https://checkout-test.adyen.com/v68/paymentMethods'
HEADERS = {'X-API-KEY': 'AQEyhmfxKonIYxZGw0m/n3Q5qf3VaY9UCJ14XWZE03G/k2NFikzVGEiYj+4vtN01BchqAcwQwV1bDb7kfNy1WIxIIkxgBw==-JtQ5H0iXtu8rqQMD6iAb33gf2qZeGKGhrMpyQAt9zsw=-3wAkV)*$kP%bCcSf'}
DATA = {'channel': 'Web','merchantAccount': 'AdyenRecruitmentCOM'}


# Set your X-API-KEY with the API key from the Customer Area.
def adyen_payment_methods():
    print("/paymentMethods request:\n" + str(DATA))
    response = requests.post(URL, headers=HEADERS, json=DATA)
    formatted_response = json.dumps(response.json())
    print("/paymentMethods response:\n" + formatted_response)
    return formatted_response



