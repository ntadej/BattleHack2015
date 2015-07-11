from django.db import models
# from django.contrib.auth.models import User


class Party(models.Model):
    name = models.CharField(max_length=100)


class Candidate(models.Model):
    # Name
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    # Party
    party = models.ForeignKey(Party)
    img_url = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    # class Meta:
    #     ordering = ['done', 'created']


class Issue(models.Model):
    short_desc = models.TextField()
    description = models.TextField()
    max_label = models.TextField(blank=True, null=True)
    min_label = models.TextField(blank=True, null=True)


class Opinion(models.Model):
    candidate = models.ForeignKey(Candidate)
    issue = models.ForeignKey(Issue)
    value = models.IntegerField(default=0)


class Charity(models.Model):
    name = models.TextField()
    description = models.TextField()
    value = models.IntegerField()
    issue = models.ForeignKey(Issue)
