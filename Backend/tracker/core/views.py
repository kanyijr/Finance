from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


# index view
@api_view(["GET"])
def index(request):
    pass


@api_view(["POST"])
def register(request):
    data = request.body
    print(data)
    return Response(status=status.HTTP_200_OK)