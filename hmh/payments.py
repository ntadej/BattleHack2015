from django.shortcuts import render, redirect
from django.http import JsonResponse
import os
import braintree

braintree.Configuration.configure(braintree.Environment.Sandbox,
                                  merchant_id=os.environ['BT_MERCHANTID'],
                                  public_key=os.environ['BT_PUBLICKEY'],
                                  private_key=os.environ['BT_PRIVATEKEY'])


def client_token():
    return braintree.ClientToken.generate()


def client_token_view(request):

    return JsonResponse({"client_token": braintree.ClientToken.generate()})


def create_purchase(request):
    nonce = request.POST["payment_method_nonce"]
    result = braintree.Transaction.sale({
        "amount": "10.00",
        "payment_method_nonce": nonce
    })
    return result.is_success;
    #     status = True
    # else:
    #     status = False

    # return JsonResponse({"success": status})
    # return render(request, "pay_result.html", context={'result': status})
