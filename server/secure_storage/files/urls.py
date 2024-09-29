from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import signup, login, logout, TestView
from .file_views import upload_file, download_file

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('test/', TestView, name='test'),

    path('upload/', upload_file, name='upload_file'),
    path('download/<int:file_id>/', download_file, name='download_file'),
    
    # JWT token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
