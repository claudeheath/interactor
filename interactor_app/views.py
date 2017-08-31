from django.shortcuts import render, redirect
from django.http import Http404, HttpResponse
from django.template import loader
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User
from .models import Project, Graph
from .forms import ProjectForm

# Create your views here.
def home(request):
    return render(request, 'interactor_app/home.html')


@login_required
def dashboard(request):
    user = request.user

    user = User.objects.get(pk=user.id)

    project_list = user.project_set.all()

    # Also collect shared projects
    shared_project_list = Project.objects.filter(collaborators__contains=user.email)

    template = loader.get_template('interactor_app/dashboard.html')

    context = {
        'project_list': project_list,
        'shared_project_list': shared_project_list,
    }

    return HttpResponse(template.render(context, request))


@login_required
def project(request, project_id):

    project = Project.objects.get(pk=project_id)

    #TODO deal with invalid id  (see https://docs.djangoproject.com/en/1.11/intro/tutorial04/)
    if not(project.user.id == request.user.id or project.is_collaborator(request.user.email)):
        raise Http404("You don't have authorisation to open this project")

    return render(request, 'interactor_app/project.html', {
        'project': project,
    })


@login_required
def new_project(request):
    project = Project.objects.create(
        user = request.user,
        name = 'New project',
        description = 'My project description',
        collaborators = '',
        graph_version = 1
    )
    graph = Graph.objects.create(
        project = project,
        version = 1,
        representation = '{"nodes": [], "links": [], "groups": []}'
    )

    project.save()
    graph.save()

    return redirect('project', project_id=project.id)


@login_required
def delete_project(request, project_id):
    project = Project.objects.get(pk=project_id)

    if not(project.user.id == request.user.id):
        raise Http404("You don't have authorisation to delete this project")

    project.delete()

    return redirect('dashboard')
