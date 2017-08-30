from django import forms

class ProjectForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField(label='Description', max_length=100)
    collaborators = forms.CharField(label='Collaborators', max_length=100)
    representation = forms.CharField(label='Representation', widget=forms.HiddenInput)
