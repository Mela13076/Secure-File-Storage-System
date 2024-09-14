from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    """
    Custom User model with additional fields for file storage project.
    """
    USER_ROLES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    role = models.CharField(max_length=10, choices=USER_ROLES, default='user')  # Role-based access control
    last_login_time = models.DateTimeField(default=timezone.now)  # Track last login time
    mfa_enabled = models.BooleanField(default=False)  # For potential multi-factor authentication

    # Add unique related names to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Custom related_name to avoid clash
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Custom related_name to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username



class File(models.Model):
    """
    Model to store files uploaded by users.
    Each file is encrypted and stored securely in S3.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="files")  # Foreign key to User
    file_url = models.URLField(max_length=500)  # The full URL or S3 key where the file is stored
    file_name = models.CharField(max_length=255)  # Name of the file
    upload_date = models.DateTimeField(default=timezone.now)  # Date and time of upload
    size = models.BigIntegerField()  # File size in bytes
    aes_encrypted_key = models.TextField()  # AES key encrypted using RSA (stored as text)
    rsa_public_key = models.TextField()  # RSA public key (optional if needed)
    rsa_private_key = models.TextField()  # RSA private key (optional, managed via AWS KMS)
    hash_value = models.CharField(max_length=64)  # Hash of the file (e.g., SHA-256 for integrity check)
    metadata = models.JSONField(blank=True, null=True)  # Additional metadata like content type, file type, etc.

    def __str__(self):
        return self.file_name


class AccessControl(models.Model):
    """
    Access control model to manage file access by users.
    Defines which users have access to specific files and at what level (e.g., read, write).
    """
    ACCESS_LEVELS = [
        ('read', 'Read'),
        ('write', 'Write'),
    ]
    
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='access_controls')  # File being accessed
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='file_access')  # User with access
    access_level = models.CharField(max_length=50, choices=ACCESS_LEVELS, default='read')  # Access type (read/write)

    def __str__(self):
        return f"{self.user.username} - {self.access_level} access to {self.file.file_name}"


