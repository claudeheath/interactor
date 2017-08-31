from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^dashboard/$', views.dashboard, name='dashboard'),
    url(r'^project/(?P<project_id>[0-9]+)/$', views.project, name='project'),
    url(r'^new-project/$', views.new_project, name='new-project'),
    url(r'^delete-project/(?P<project_id>[0-9]+)/$', views.delete_project, name='delete-project'),
]
