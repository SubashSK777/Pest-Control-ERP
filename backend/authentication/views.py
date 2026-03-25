from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def login_view(request):
    """
    Minimal Authentication for A-Flick CRM
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if email == "dev@aflick.com" and password == "123456":
        return Response({
            "success": True,
            "message": "Login successful",
            "redirect_url": "/"
        }, status=status.HTTP_200_OK)
    
    return Response({
        "success": False,
        "message": "Invalid email or password"
    }, status=status.HTTP_401_UNAUTHORIZED)
