from django.contrib.auth.models import User, Group
from rest_framework import viewsets
import hmh.serializers as serial
import hmhmod.models as models
from django.shortcuts import render, redirect


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
    return render(request, "pay.html")
