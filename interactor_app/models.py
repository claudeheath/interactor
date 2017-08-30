from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    user = models.ForeignKey(User)
    # user = models.ForeignKey(User, related_name="users")
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    graph_version = models.IntegerField(default=1)
    collaborators = models.CharField(max_length=2000) # comma separated list of emails. A user with an email on this list can view/edit this project.
    def is_collaborator(self, email):
        collaboratorEmails = ''.join(self.collaborators.split()).split(',')
        return email in collaboratorEmails
    def __str__(self):
        return self.name


class Graph(models.Model):
    project = models.ForeignKey(Project)
    version = models.IntegerField(default=1)
    representation = models.TextField()
    def __str__(self):
        return 'Graph belonging  to ' + self.project.name
