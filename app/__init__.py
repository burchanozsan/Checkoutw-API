from flask import Flask, render_template, request, redirect, url_for
import app.main.config as config
from .main.config import read_config
from .main.payment_methods import adyen_payment_methods
from .main.payments import adyen_payments
from .main.payments_details_3ds2 import get_details
from .main.payments_finalize_redirect import finalize


def create_app():
    app = Flask('app')

    read_config()

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/checkout')
    def checkout():
        client_key = config.client_key
        return render_template('checkout.html', client_key=client_key)

    @app.route('/api/getPaymentMethods', methods=['GET', 'POST'])
    def get_payment_methods():
        return adyen_payment_methods()

    @app.route('/api/Payments', methods=['POST'])
    def initiate_payment():
        return adyen_payments(request)

    @app.route('/api/submitAdditionalDetails', methods=['POST'])
    def payment_details():
        return get_details(request)

    @app.route('/api/handleShopperRedirect')
    def redirect_finalize():
        values = request.values.to_dict()  # Get values from query params in request object
        details_request = {"details": {"redirectResult": values["redirectResult"]}}

        redirect_response = finalize(details_request)

        print(redirect_response['resultCode'])

        if redirect_response["resultCode"] == 'Authorised':
            return redirect(url_for('checkout_success'))

        elif redirect_response["resultCode"] == 'Received' or redirect_response["resultCode"] == 'Pending':
            return redirect(url_for('checkout_pending'))

        else:
            return redirect(url_for('checkout_failure'))

    @app.route('/result/success', methods=['GET'])
    def checkout_success():
        return render_template('success.html')

    @app.route('/result/failed', methods=['GET'])
    def checkout_failure():
        return render_template('failed.html')

    @app.route('/result/pending', methods=['GET'])
    def checkout_pending():
        return render_template('success.html')

    @app.route('/result/error', methods=['GET'])
    def checkout_error():
        return render_template('failed.html')

    return app
