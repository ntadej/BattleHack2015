from django.contrib.auth.models import User, Group
from django.template.context_processors import csrf
from rest_framework import viewsets
import hmh.serializers as serial
import hmhmod.models as models
from django.shortcuts import render, redirect
from hmh import payments
import json


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = serial.UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serial.GroupSerializer


class CandidateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Candidates to be viewed or edited.
    """
    queryset = models.Candidate.objects.all()
    serializer_class = serial.CandidateSerializer

    def get_queryset(self):
        """
        List the Candidates
        """
        slider_data = self.request.query_params.get('sliders', "{}")
        slider_data = json.loads(slider_data)
        slider_ids = [int(i) for i in slider_data]
        opinions = models.Opinion.objects.filter(pk__in=slider_ids)
        score = dict()

        for op in opinions:
            print(op.candidate)

        return models.Candidate.objects




class PartyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Partys to be viewed or edited.
    """
    queryset = models.Party.objects.all()
    serializer_class = serial.PartySerializer


class IssueViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Issues to be viewed or edited.
    """
    queryset = models.Issue.objects.all()
    serializer_class = serial.IssueSerializer


class OpinionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Opinions to be viewed or edited.
    """
    queryset = models.Opinion.objects.all()
    serializer_class = serial.OpinionSerializer


def index(request):
    return render(request, "index.html")

def pay(request):
    token = payments.client_token()
    context = {'token': token}
    context.update(csrf(request))
    return render(request, "pay.html", context=context)
