from django.conf.urls import url

from . import views

urlpatterns = [
    # url(r'^$', views.index, name='index'),
    # url(r'^user/(?P<user_id>[0-9]+)/$', views.user, name='user'),
    url(r'^dashboard/$', views.dashboard, name='dashboard'),
    url(r'^project/(?P<project_id>[0-9]+)/$', views.project, name='project'),
    url(r'^new-project/$', views.new_project, name='new-project'),
]
