"""hmh URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
import rest_framework.urls
from rest_framework import routers
from hmh import views, payments

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'party', views.PartyViewSet)
router.register(r'candidate', views.CandidateViewSet)
router.register(r'issue', views.IssueViewSet)
router.register(r'opinion', views.OpinionViewSet)
router.register(r'charity', views.CharityViewSet)

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^pay/', views.pay, name='pay'),
    url(r'^api/payments/token', payments.client_token_view, name='token'),
    url(r'^api/payments/purchase', payments.create_purchase, name='payments_purchase'),
    url(r'^api/tweets', views.get_tweets, name='get_tweets'),
    url(r'^api/news', views.get_news, name='get_news'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^candidate/(?P<id>[0-9]+)', views.candidate),

]
