from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Hardcoded check as requested: dev@aflick.com / 123456
        if email == "dev@aflick.com" and password == "123456":
            # Simulate or fetch existing user
            user, created = User.objects.get_or_create(email=email, username=email)
            if created:
                user.set_password(password)
                user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'email': user.email,
                    'username': user.username
                }
            })
        
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
