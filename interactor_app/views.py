from django.shortcuts import render, redirect
from django.http import HttpResponse
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

    #TODO deal with invalid id
    user = User.objects.get(pk=user.id)

    project_list = user.project_set.all()

    template = loader.get_template('interactor_app/dashboard.html')

    context = {
        'project_list': project_list
    }

    return HttpResponse(template.render(context, request))

@login_required
def project(request, project_id):

    #TODO deal with invalid id  (see https://docs.djangoproject.com/en/1.11/intro/tutorial04/)
    project = Project.objects.get(pk=project_id)
    graph = project.graph_set.get(version=1)

    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project.name = form.cleaned_data['name']
            project.description = form.cleaned_data['description']
            project.collaborators = form.cleaned_data['collaborators']
            project.save()
            graph.representation = form.cleaned_data['representation']
            graph.save()
            messages.success(request, u'Project saved!')

        return render(request, 'interactor_app/project.html', {
            'project': project,
            'graph': graph,
            'form': form
        })

    form = ProjectForm(initial={
        'name': project.name,
        'description': project.description,
        'collaborators': project.collaborators,
        'representation': graph.representation
    })

    return render(request, 'interactor_app/project.html', {
        'project': project,
        'graph': graph,
        'form': form
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
