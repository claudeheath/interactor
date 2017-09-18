from django.shortcuts import render, redirect, get_object_or_404
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
    project = get_object_or_404(Project, id=project_id)

    if not(request.user.is_staff or project.user.id == request.user.id or project.is_collaborator(request.user.email)):
        return render(request, 'interactor_app/project_not_authorised.html')

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
    project = get_object_or_404(Project, id=project_id)

    if not(project.user.id == request.user.id):
        raise Http404("You don't have authorisation to delete this project")

    project.delete()

    return redirect('dashboard')
