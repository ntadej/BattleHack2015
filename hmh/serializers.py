from django.contrib.auth.models import User, Group
from rest_framework import serializers
import hmhmod.models as models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'url', 'name')


class CandidateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Candidate
        fields = ('id', 'url', 'first_name', 'last_name', 'party')


class PartySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Party
        fields = ('id', 'url', 'name')


class IssueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Issue
        fields = ('id', 'url', 'short_desc', 'description')


class OpinionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Opinion
        fields = ('id', 'url', 'candidate', 'issue', 'value')
