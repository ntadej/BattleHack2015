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
        print("Logging test")
        if 'pk' in self.kwargs:
            return models.Candidate.objects
        else:
            slider_data = self.request.query_params.get('sliders', "{}")
            slider_data = json.loads(slider_data)
            slider_ids = [int(i) for i in slider_data]
            if slider_ids:
                opinions = models.Opinion.objects.filter(issue_id__in=slider_ids).all()
                can_data = dict()
                print(len(opinions))
                for op in opinions:
                    can = op.candidate
                    if can.id not in can_data:
                        can_data[can.id] = dict()
                    can_data[can.id][str(op.issue.id)] = op.value

                score = dict()
                for can in can_data:
                    score[can] = 0
                    for key, value in slider_data.items():
                        val = 0
                        if key in can_data[can]:
                            val = int(can_data[can][key])
                        score[can] += (val - int(value)) ** 2
                    # print(op.candidate.first_name)
                print(score)
                data = score.items()
                best = sorted(data, key=lambda x: x[-1])
                ids = [int(best[i][0]) for i in range(min(len(best), 5))]
                print(ids)
                return [models.Candidate.objects.get(id=i) for i in ids]
            else:
                return models.Candidate.objects.all()


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


class CharityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Charitys to be viewed or edited.
    """
    queryset = models.Charity.objects.all()
    serializer_class = serial.CharitySerializer


def index(request):
    return render(request, "index.html")


def pay(request):
    token = payments.client_token()
    context = {'token': token}
    context.update(csrf(request))
    return render(request, "pay.html", context=context)
