import configparser

merchant_account = ""
checkout_apikey = ""
client_key = ""


def read_config():
    global merchant_account, checkout_apikey, client_key

    config = configparser.ConfigParser(interpolation=None)
    config.read('config.ini')

    merchant_account = config['DEFAULT']['merchant_account']
    checkout_apikey = config['DEFAULT']['apikey']
    client_key = config['DEFAULT']['client_key']

    # Check to make sure variables are set
    if not merchant_account or not checkout_apikey or not client_key:
        raise Exception("Please fill out information in config.ini file")
