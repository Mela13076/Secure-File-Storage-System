from django.db import models
from django.contrib.auth.models import User

# File model to store metadata about files
class File(models.Model):
    file_name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    s3_key = models.CharField(max_length=255)  # Reference to file in S3
    upload_date = models.DateTimeField(auto_now_add=True)
    encryption_key = models.CharField(max_length=255)  # Encrypted AES key
    file_hash = models.CharField(max_length=255)  # For file integrity

# Access control model to manage file access by users
class AccessControl(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_level = models.CharField(max_length=50, default='read')  # read/write access

