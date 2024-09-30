from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView


# Signup view (no JWT here, just user registration)
@api_view(["POST"])
@permission_classes([AllowAny])  # Allow any user to access this view without authentication
@authentication_classes([])  # No authentication required
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Creates the user
        user = User.objects.get(username=request.data['username'])
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login view to generate and return JWT tokens
@api_view(["POST"])
@permission_classes([AllowAny])  # Allow any user to access this view without authentication
@authentication_classes([])  # No authentication required
def login(request):
    data = request.data
    user = authenticate(username=data['username'], password=data['password'])
    if user is not None:
        # Generate JWT tokens (access and refresh)
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)
        response_data = {
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
    return Response({"detail": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Logout view to blacklist refresh tokens (optional)
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Blacklist the refresh token on logout
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Protected view, requires a valid JWT token
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def TestView(request):
    return Response({"message": "Test view accessed successfully"})
