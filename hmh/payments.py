import os
import braintree

braintree.Configuration.configure(braintree.Environment.Sandbox,
                                  merchant_id=os.environ['BT_MERCHANTID'],
                                  public_key=os.environ['BT_PUBLICKEY'],
                                  private_key=os.environ['BT_PRIVATEKEY'])

def client_token():
	return braintree.ClientToken.generate()

def create_purchase():
 	nonce = request.form["payment_method_nonce"]