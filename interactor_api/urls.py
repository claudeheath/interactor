from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^project/(?P<project_id>[0-9]+)/$', views.project),
    url(r'^uploadimage/(?P<project_id>[0-9]+)/(?P<node_id>[0-9a-fA-F-]+)$', views.upload_image),
    url(r'^deletenodeimage/(?P<project_id>[0-9]+)/(?P<node_id>[0-9a-fA-F-]+)$', views.delete_node_image)
    # url(r'^new-project/$', views.new_project, name='new-project'),
]
