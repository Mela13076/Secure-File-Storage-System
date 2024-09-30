from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from .models import File

class FileSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'file_name', 'file_url', 'upload_date', 'size', 'metadata']

class UserSerializer(ModelSerializer):
    class Meta: 
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # Ensure password is not exposed in API response
        }

    # Override save method to handle user creation (without token creation)
    def create(self, validated_data):
        # Create a new user using the create_user method, which hashes the password
        new_user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],  # Password is hashed internally
        )
        return new_user
