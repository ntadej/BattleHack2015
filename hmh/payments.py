from django.shortcuts import render, redirect
import os
import braintree

braintree.Configuration.configure(braintree.Environment.Sandbox,
                                  merchant_id=os.environ['BT_MERCHANTID'],
                                  public_key=os.environ['BT_PUBLICKEY'],
                                  private_key=os.environ['BT_PRIVATEKEY'])


def client_token():
    return braintree.ClientToken.generate()


def create_purchase(request):
    nonce = request.POST["payment_method_nonce"]
    result = braintree.Transaction.sale({
        "amount": "10.00",
        "payment_method_nonce": nonce
    })
    if result.is_success:
        status = "<h1>Success! Transaction ID: {0}</h1>".format(result.transaction.id)
    else:
        status = "<h1>Error: {0}</h1>".format(result.message)

    return render(request, "pay_result.html", context={'result': status})
