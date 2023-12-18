"""
URL configuration for TPW_project_2_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path
from app import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("index/", views.index, name="index"),
    path("login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("register/", views.register, name="register"),
    path("logout", auth_views.LogoutView.as_view(next_page='/login'), name="logout"),
    path("account/settings/", views.profile_settings, name="profile_settings"),
    path("account/sell/", views.sell, name="sell"),
    path("account/profile/", views.profile, name="profile"),
    path("account/product/<int:product_id>/", views.product_settings, name="product"),
    path('add_to_cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('view_cart', views.viewCart, name='view_cart'),
    path('delete_from_cart/<int:item_id>/', views.delete_from_cart, name='delete_from_cart'),
    path("account/product/<int:product_id>/", views.product_settings, name="product_settings"),
    path("product/<int:product_id>/", views.product_page, name="product_page"),
    path("profile/<str:username>/", views.seller, name="seller"),
    path("adminpage/", views.admin_page, name="admin_page"),
    path("account/product/edit/<int:product_id>/", views.edit_product, name="edit_product"),
    path("process_payment/", views.process_payment, name="process_payment"),
    path("account/favorites/", views.favorites, name="favorites"),

    # REST API
    path('ws/products', views.get_products),
    path('ws/followed_products', views.get_followed_products),
    path('ws/explore_products', views.get_explore_products),
    path('ws/register', views.registerREST),
    path('ws/login', views.loginREST),
    path('ws/current_user', views.current_user),
    path('ws/no_user_image', views.no_user_image),
    path('ws/users', views.get_users),
    path('ws/user/<int:user_id>', views.get_user),
    path('ws/loginUser', views.get_user_with_username_and_password),
    path('ws/registerUser', views.new_user),
    path('ws/add_product_to_cart', views.post_item_cart),
    path('ws/cart', views.get_cart),
    path('ws/delete_product/<int:product_id>', views.delete_product),
    path('ws/delete_user/<int:user_id>', views.delete_user),
    path('ws/update_user_image/<int:user_id>', views.update_user_image),
    path('ws/update_user/<int:user_id>', views.update_user),
    path('ws/update_profile/<int:user_id>', views.update_profile),
    path('ws/update_cart', views.update_cart),
    path('ws/current_user', views.current_user),
    path('ws/favorites', views.get_favorites),
    path('ws/favorite_products', views.get_favorite_products),
    path('ws/add_favorite', views.add_favorite),
    path('ws/remove_favorite/<int:favorite_id>', views.remove_favorite),
    path('ws/delete_user/<int:user_id>', views.delete_user),
    path('ws/user/products/<int:user_id>', views.get_user_products),
    path('ws/user/followers/<int:user_id>', views.get_user_followers),
    path('ws/user/following/<int:user_id>', views.get_user_following),
    path('ws/user/sell/<int:product_id>', views.sell_product),
    path('ws/product/<int:product_id>', views.get_product),
    path('ws/product/favorites/<int:product_id>', views.get_product_favorites),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
