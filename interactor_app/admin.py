from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import Project, Graph


class ProjectAdmin(admin.ModelAdmin):

    def url(self, instance):
        return mark_safe('<a href="/editor/project/' + str(instance.id) + '">View project</a>')

    list_display = ('user', 'name', 'url') #graph_version, save_version, collaborators

admin.site.register(Project, ProjectAdmin)
admin.site.register(Graph)
