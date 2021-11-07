import json
import uuid
import app.main.config as config
import requests


def adyen_payments(frontend_request):
    URL = 'https://checkout-test.adyen.com/v68/payments'
    HEADERS = {
        'X-API-KEY': 'AQEyhmfxKonIYxZGw0m/n3Q5qf3VaY9UCJ14XWZE03G/k2NFikzVGEiYj+4vtN01BchqAcwQwV1bDb7kfNy1WIxIIkxgBw==-JtQ5H0iXtu8rqQMD6iAb33gf2qZeGKGhrMpyQAt9zsw=-3wAkV)*$kP%bCcSf'}

    payment_info = frontend_request.get_json()
    payment_method = payment_info["paymentMethod"]
    payment_type = payment_method["type"]
    order_ref = str(uuid.uuid4())
    channel = "Web"

    payments_request = {

        'amount': {
            'value': 1200,
            'currency': 'EUR'
        },
        'paymentMethod': payment_method,
        'reference': order_ref,
        'returnUrl': 'http://127.0.0.1:5000/api/handleShopperRedirect?orderRef=' + order_ref,
        'merchantAccount': config.merchant_account,
        'channel': channel,
        'origin': 'http://127.0.0.1:5000/checkout',
        'shopperReference': 'burchan_checkoutChallenge'
    }
    payments_request.update(payment_info)

    if payment_type == 'scheme':
        payments_request['additionalData'] = {'allow3DS2': 'true', 'executeThreeD': 'true'}

    elif payment_type == 'alipay':
        payments_request['countryCode'] = 'CN'

    elif payment_type == 'poli':
        payments_request['countryCode'] = 'AU'
        payments_request['amount']['currency'] = 'AUD'

    elif payment_type == 'ideal':
        payments_request['countryCode'] = 'NL'

    print("/payments request:\n" + str(payments_request))
    result = requests.post(URL, headers=HEADERS, json=payments_request)
    data = json.dumps(result.json())
    print("/payments response:\n" + data)
    return data
