from django.http import Http404, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
from PIL import Image
import os
import glob

from interactor_app.models import Project, Graph

import json

@login_required
def project(request, project_id):

    project = Project.objects.get(pk=project_id)

    if not request.is_ajax(): #or not project.user.id == request.user.id:
        raise Http404

    if request.method == 'GET':
        if not(project.user.id == request.user.id or project.is_collaborator(request.user.email)):
            raise Http404

        # Until we implement project history, always use version 1 of the graph
        graph = project.graph_set.get(version=1)

        data = {
            'id': project.id,
            'name': project.name,
            'save_version': project.save_version,
            'description': project.description,
            'representation': json.loads(graph.representation)
        }

        # Only include collaborator list if request is by project owner
        if project.user.id == request.user.id:
            data['collaborators'] = project.collaborators

        return JsonResponse(data)

    elif request.method == 'POST':

        graph = project.graph_set.get(version=1)

        #TODO clean?
        data = json.loads(request.body.decode('utf-8'))
        project.save_version = project.save_version + 1
        project.name = data['name']
        project.description = data['description']
        if 'collaborators' in data:
            project.collaborators = data['collaborators']
        project.save()

        graph.representation = json.dumps(data['representation'])
        graph.save()

        data = {
            'save_version': project.save_version,
        }
        return JsonResponse(data)


@login_required
def upload_image(request, project_id, node_id):

    if not request.is_ajax(): #or not project.user.id == request.user.id:
        raise Http404

    if not request.method == 'POST':
        raise Http404

    project = Project.objects.get(pk=project_id)

    if not(project.user.id == request.user.id or project.is_collaborator(request.user.email)):
        raise Http404

    myfile = request.FILES['image']
    fs = FileSystemStorage()

    image_filename, image_extension = os.path.splitext(myfile.name)
    # print('extension is ' + image_extension)
    # use the node id as the image filename. I think this makes things easier in the long run.
    # for example, if a new image is uploaded, it'll automatically replace the existing one
    # it's also easier to keep track of which image belongs to which node

    # convert to png... I don't think Chrome supports tiffs
    new_filename = node_id + '.png'
    filename = fs.save('node_images/' + project_id + '/' + new_filename, myfile)
    uploaded_file_url = fs.url(filename)

    # crop and resize. I think we can do this more efficiently...
    i = Image.open(fs.path(filename))

    if i.width > i.height:
        i = i.crop((0, 0, i.height, i.height))
    else:
        i = i.crop((0, 0, i.width, i.width))

    i = i.resize((200, 200))
    i.save(fs.path(filename))

    data = {
        "status": "success",
        "url": uploaded_file_url
    }
    return JsonResponse(data)



@login_required
def delete_node_image(request, project_id, node_id):

    if not request.is_ajax():
        raise Http404

    if not request.method == 'POST':
        raise Http404

    project = Project.objects.get(pk=project_id)

    if not(project.user.id == request.user.id or project.is_collaborator(request.user.email)):
        raise Http404

    fs = FileSystemStorage()
    for f in glob.glob(fs.location + '/node_images/' + project_id + '/' + node_id + '.*'):
        os.remove(f)

    data = {
        "status": "success"
    }
    return JsonResponse(data)


@login_required
def get_project_version(request, project_id):

    if not request.is_ajax():
        raise Http404

    if not request.method == 'GET':
        raise Http404

    project = Project.objects.get(pk=project_id)

    if not(project.user.id == request.user.id or project.is_collaborator(request.user.email)):
        raise Http404

    data = {
        'save_version': project.save_version,
    }

    return JsonResponse(data)
