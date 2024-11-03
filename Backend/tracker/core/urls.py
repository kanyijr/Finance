from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [  
    path("api/home/", views.index, name="home"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/register/", views.register, name="register"),
    path("api/login/", views.login, name="login"),
    path("api/incomes/", views.incomes),
    path("api/categories/", views.get_categories, name="get_categories"),
    path("api/expenses/", views.expenses, name="expenses"),
    path("api/financial-data/", views.get_user_financial_data, name="get_financial_data")
]
