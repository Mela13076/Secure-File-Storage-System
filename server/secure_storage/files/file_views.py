from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import File
from .kms_utils import kms_decrypt_file, kms_encrypt_file
import os
from django.utils import timezone
from django.http import FileResponse


@api_view(["POST"])
@authentication_classes([JWTAuthentication])  # Use JWT for authentication
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def upload_file(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file provided."}, status=400)

    file_name = file.name
    file_size = file.size
    file_type = file.content_type

    # Save the file temporarily
    temp_file_path = f"/tmp/{file_name}"
    with open(temp_file_path, 'wb+') as temp_file:
        for chunk in file.chunks():
            temp_file.write(chunk)

    # Encrypt and upload the file to S3
    s3_key = file_name  # Use the file name as the S3 key
    bucket_name = 'bucket-secure-file-storage'
    kms_key_id = '3c21faa5-c72f-4452-8112-84a7339cb737' 
    kms_encrypt_file(temp_file_path, kms_key_id, bucket_name, s3_key)

    print(type(request.user))  # This should print <class 'django.contrib.auth.models.User'>

    file_data = {
        'file_type': file_type
    }
    # Save file metadata in the database
    file_metadata = File(
        user=request.user,
        file_url=s3_key,  # S3 key
        file_name=file_name,
        upload_date=timezone.now(),
        size=file_size,
        metadata = file_data
        # You would store encrypted AES keys and other metadata here (assumed in kms_encrypt_file logic)
    )
    file_metadata.save()

    # Clean up the temporary file
    os.remove(temp_file_path)

    return Response({
        "message": f"File {file_name} uploaded successfully.",
        "file_id": file_metadata.id  # Return the generated file ID
    }, status=201)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])  # Use JWT for authentication
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def download_file(request, file_id):
    try:
        # Retrieve file metadata from the database
        file_metadata = File.objects.get(id=file_id, user=request.user)
    except File.DoesNotExist:
        return Response({"error": "File not found or access denied."}, status=404)

    # Download and decrypt the file from S3
    bucket_name = 'bucket-secure-file-storage'
    kms_key_id = '3c21faa5-c72f-4452-8112-84a7339cb737'     

    downloaded_file_path = f"/tmp/{file_metadata.file_name}"
    kms_decrypt_file(bucket_name, file_metadata.file_url, downloaded_file_path, kms_key_id)

    # Open the file for reading in binary mode
    file_type = file_metadata.metadata.get('file_type') if file_metadata.metadata else 'application/octet-stream'

    response = FileResponse(open(downloaded_file_path, 'rb'), content_type=file_type)
    response['Content-Disposition'] = f'attachment; filename="{file_metadata.file_name}"'

    return response

