from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render


def index(request):
    context = {'title': 'index'}
    return render(request, 'main/index.html', context=context)


def page_not_found(request, exception):
    return HttpResponseNotFound("<h1> Page not found </h1>")
