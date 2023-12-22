import base64
import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.shortcuts import render, redirect
from app.forms import RegisterForm, UploadUserProfilePicture, UpdateProfile, UpdatePassword, ProductForm, CommentForm, \
    ConfirmOrderForm

from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from app.models import User, Product, Follower, Comment, Cart, CartItem, Favorite
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.urls import reverse

# Rest Framework
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.serializers import UserSerializer, ProductSerializer, CommentSerializer, FollowerSerializer, \
    FavoriteSerializer, CartSerializer, CartItemSerializer, AuthUserSerializer

# Authentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User as AuthUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication


# Create your views here.
@api_view(['GET'])
def get_products(request):
    try:
        products = Product.objects.all()
        # print("Products found: ", products)
        # the image is a file, we need to send it as a base64 string
        image_base64 = []
        for product in products:
            # print(product.image)
            image = product.image
            image_base64.append(base64.b64encode(image.read()))

        serializer = ProductSerializer(products, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['image'] = image_base64[i]

        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)




@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_followed_products(request):
    username = request.user.username

    try:
        user = User.objects.get(username=username)
        followers = Follower.objects.filter(follower=user)
        followers_id = [follower.followed.id for follower in followers]
        products = Product.objects.filter(user_id__in=followers_id)
        # the image is a file, we need to send it as a base64 string
        image_base64 = []
        for product in products:
            image = product.image
            image_base64.append(base64.b64encode(image.read()))
        serializer = ProductSerializer(products, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['image'] = image_base64[i]

        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_explore_products(request):
    username = request.user.username

    try:
        user = User.objects.get(username=username)
        followers = Follower.objects.filter(follower=user)
        followers_id = [follower.followed.id for follower in followers]
        products = Product.objects.exclude(user_id__in=followers_id)
        # also exclude the actual user products
        products = products.exclude(user_id=user)
        # the image is a file, we need to send it as a base64 string
        image_base64 = []
        for product in products:
            image = product.image
            image_base64.append(base64.b64encode(image.read()))
        serializer = ProductSerializer(products, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['image'] = image_base64[i]

        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


# Authenticating a user, REST API
@api_view(['POST'])
def loginREST(request):
    user = get_object_or_404(AuthUser, username=request.data['username'])
    if not user.check_password(request.data['password']):
        print("Wrong password")
        return Response(status=status.HTTP_404_NOT_FOUND)

    token, created = Token.objects.get_or_create(user=user)
    serializer = AuthUserSerializer(instance=user)
    # get the user from the database
    user = User.objects.get(username=user.username)
    user_serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': user_serializer.data})


# Registering a user, REST API
@api_view(['POST'])
def registerREST(request):
    try:
        data = json.loads(request.body)
        username = data['username']
        name = data['name']
        email = data['email']
        password = data['password']
        user = User.objects.create(username=username, name=name, email=email, password=password)
        # make the image the default image
        user.image = 'user_no_picture.png'
        user.save()
        user_serializer = UserSerializer(user)

        # create the data for the auth user
        serializer = AuthUserSerializer(data=request.data)
        print("serializer: ", serializer)
        if serializer.is_valid():
            serializer.save()
            user = AuthUser.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            token = Token.objects.create(user=user)

            return Response({'token': token.key, 'user': user_serializer.data})
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        print("User does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)


# Current user, REST API
@api_view(['GET'])
def current_user(request):
    user = request.user
    print(user)
    if user.is_authenticated:
        # get the user from the database
        user = User.objects.get(username=user.username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    return Response(status=status.HTTP_404_NOT_FOUND)


# No user image, REST API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def no_user_image(request):
    # send the image as a base64 string
    image = open('app/static/images/no_user_image.png', 'rb')
    image_read = image.read()
    image_64_encode = base64.b64encode(image_read)
    image.close()
    return Response(image_64_encode)


@api_view(['POST'])
def post_item_cart(request):
    product_id = request.data['productID']
    username = request.data['username']

    try:
        product = get_object_or_404(Product, id=product_id)
        user = User.objects.get(username=username)

        cart, created = Cart.objects.get_or_create(user=user)

        cart_item, created = CartItem.objects.get_or_create(product=product, user=user)

        if not created:
            pass

        else:
            cart_item.price = product.price
            cart.price += product.price

            cart.items.add(cart_item)
            cart_item.save()
            cart.save()

        return Response(status=status.HTTP_201_CREATED)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_cart(request):
    try:
        id = request.GET['id']
        user = User.objects.get(id=id)
        cart, created = Cart.objects.get_or_create(user=user)

        price = round(cart.price, 2)

        items = {}
        for item in cart.items.all():

            product_name = item.product.name
            product_image = base64.b64encode((item.product.image).read())
            item_price = item.price
            user_id = item.product.user_id.username

            # Se a chave ainda não existir no dicionário, crie uma lista vazia como valor
            if product_name not in items:
                items[product_name] = []

            # Adicione o preço e o user_id à lista associada à chave
            items[product_name].append({'price': item_price, 'user_id': user_id, 'product_image': product_image})

        response_data = {
            'status': 'success',
            'cart_items': items,
            'cart': {'id': cart.id, 'user': cart.user.username},
            'price': price,
            'user': user.username
        }

        return Response(response_data)


    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)

    except Cart.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Cart not found'}, status=404)


# get the users from the database, REST API
@api_view(['GET'])
def get_users(request):
    try:
        users = User.objects.all()
        # print("Users found: ", users)
        image_base64 = []
        for user in users:
            # print(user.image)
            # print("User Trying: ", user, " and is image: ", user.image)
            image = user.image
            image_base64.append(base64.b64encode(image.read()))
            # print("user did it: ", user)
        serializer = UserSerializer(users, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['image'] = image_base64[i]
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


# get a user from the database, REST API
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user(request):
    # returns the user with the given token
    username = request.user.username
    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_by_id(request, user_id):
    # returns the user with the given token
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)
        # get all the products from user
        user_products = Product.objects.filter(user_id=user.id)
        for product in user_products:
            product.delete()

        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)


@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = get_object_or_404(Product, id=product_id)
        product.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)


# update a user's image, REST API
@api_view(['POST'])
def update_user_image(request, user_id):
    try:
        data = json.loads(request.body)
        image = data['image']
        # image is a base64 string, we need to convert it to a file
        image += '=' * (-len(image) % 4)
        image = base64.b64decode(image)
        user = User.objects.get(id=user_id)
        user.image = image
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        print("User does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)


# update a user, REST API
@api_view(['POST'])
def update_user(request, user_id):
    try:
        data = json.loads(request.body)
        username = data['username']
        name = data['name']
        email = data['email']
        password = data['password']
        admin = data['admin']
        image = data['image']
        # image is a base64 string
        image += '=' * (-len(image) % 4)
        image = base64.b64decode(image)
        # make it a file
        image = ContentFile(image, f'{username}.png')
        description = data['description']
        sold = data['sold']
        user = User.objects.get(id=user_id)
        user.username = username
        user.name = name
        user.email = email
        user.password = password
        user.admin = admin
        user.image = image
        user.description = description

        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        print("User does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)


# update the user's profile, REST API
@api_view(['PUT'])
def update_profile(request, user_id):
    try:
        data = json.loads(request.body)
        name = data['name']
        username = data['username']
        email = data['email']
        description = data['description']
        password = data['password']

        user = User.objects.get(id=user_id)
        user.name = name
        user.username = username
        user.email = email
        user.description = description
        user.password = password
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        print("User does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_cart(request):
    try:
        id = request.data['id']
        product_name = request.data['productName']

        user = User.objects.get(id=id)

        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(product__name=product_name, user=user)
        cart.price -= cart_item.price

        cart_item.delete()
        cart.save()

        return Response(status=status.HTTP_204_NO_CONTENT)



    except CartItem.DoesNotExist:
        return redirect('pagina_de_erro')  # Substitua 'pagina_de_erro' pelo nome da URL da página de erro apropriada


@api_view(['GET'])
def current_user(request):
    try:
        name = request.GET['username']
        user = User.objects.get(username=name)
        serializer = UserSerializer(user)

        return Response(serializer.data)

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)



@api_view(['GET'])
def get_favorites(request):
    try:
        favorites = Favorite.objects.all()
        serializer = FavoriteSerializer(favorites, many=True)

        return Response(serializer.data)

    except Favorite.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Favorites not found'}, status=404)


@api_view(['GET'])
def get_favorite_products(request, user_id):
    try:
        products = []
        user = User.objects.get(id=user_id)
        favorites = Favorite.objects.filter(user_id=user)
        image_base64 = []
        for favorite in favorites:
            products.append(favorite.product_id)
            image = favorite.product_id.image
            image_base64.append(base64.b64encode(image.read()))


        serializer = ProductSerializer(products, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['image'] = image_base64[i]

        return Response(serializer.data)

    except Favorite.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Favorites not found'}, status=404)

    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    username = request.user.username
    product_id = request.data['product_id']

    try:
        product = get_object_or_404(Product, id=product_id)
        user = User.objects.get(username=username)
        favorite, created = Favorite.objects.get_or_create(user_id=user, product_id=product)

        if not created:
            pass

        else:
            favorite.user_id = user
            favorite.product_id = product
            favorite.save()
        return Response(status=status.HTTP_201_CREATED)

    except Favorite.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_favorite(request, product_id):
    try:
        username = request.user.username
        user = get_object_or_404(User, username=username)
        product = get_object_or_404(Product, id=product_id)

        favorite = get_object_or_404(Favorite, user_id=user, product_id=product)
        favorite.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    except Favorite.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Favorite not found'}, status=404)

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)

    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)


@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)
        # get all the products from user
        user_products = Product.objects.filter(user_id=user.id)
        for product in user_products:
            product.delete()

        # get all the favorites from user
        user_favorites = Favorite.objects.filter(user_id=user.id)
        for favorite in user_favorites:
            favorite.delete()

        # get all the comments from user
        user_comments = Comment.objects.filter(user_id=user.id)
        for comment in user_comments:
            comment.delete()

        # get all the comments for user
        seller_comments = Comment.objects.filter(seller_id=user.id)
        for comment in seller_comments:
            comment.delete()

        # get all the followers from user
        user_followers = Follower.objects.filter(follower=user.id)
        for follower in user_followers:
            follower.delete()

        # get all the followers for user
        seller_followers = Follower.objects.filter(followed=user.id)
        for follower in seller_followers:
            follower.delete()

        # get all the cart items from user
        user_cart_items = CartItem.objects.filter(user_id=user.id)
        for cart_item in user_cart_items:
            cart_item.delete()

        # get all the carts from user
        user_carts = Cart.objects.filter(user_id=user.id)
        for cart in user_carts:
            cart.delete()

        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)


# get the user's products, REST API
@api_view(['GET'])
def get_user_products(request, user_id):
    try:
        products = Product.objects.filter(user_id=user_id)
        # the image is a file, we need to send it as a base64 string
        image_base64 = []
        for product in products:
            image = product.image
            image_base64.append(base64.b64encode(image.read()))

        serializer = ProductSerializer(products, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['image'] = image_base64[i]

        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


# get the user's followers, REST API
@api_view(['GET'])
def get_user_followers(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        followers = Follower.objects.filter(followed=user)
        # return the number of followers
        return Response(followers.count())

    except Follower.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Followers not found'}, status=404)


# get who the user is following, REST API
@api_view(['GET'])
def get_user_following(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        following = Follower.objects.filter(follower=user)
        # return the number of following
        return Response(following.count())

    except Follower.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Following not found'}, status=404)


# sell a product, which means delete it and add 1 to the user's sold counter, REST API
@api_view(['POST'])
def sell_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        user = User.objects.get(id=product.user_id.id)
        user.sold += 1
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)


@api_view(['GET'])
def get_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)


# get the number of favorites of a product, REST API
@api_view(['GET'])
def get_product_favorites(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        favorites = Favorite.objects.filter(product_id=product)
        # return the number of favorites
        return Response(favorites.count())

    except Favorite.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Favorites not found'}, status=404)

@api_view(['GET'])
def seller(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        user = product.user_id
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        print("Seller does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)

    except Product.DoesNotExist:
        print("Product does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_followers(request, user_id):
    try:
        users = []
        user = User.objects.get(id=user_id)
        followers = Follower.objects.filter(followed=user)
        for follower in followers:
            users.append(follower.follower)

        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    except Follower.DoesNotExit:
        return Response(status=status.HTTP_404_NOT_FOUND)





@api_view(['POST'])
def post_order(request):
    username = request.data['username']

    try:
        user = User.objects.get(username=username)
        cart, created = Cart.objects.get_or_create(user=user)
        price = round(cart.price, 2)

        cart.items.all().delete()
        cart.price = 0
        cart.save()

        return Response(status=status.HTTP_201_CREATED)

    except Cart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# update a product, REST API
@api_view(['PUT'])
def update_product(request, product_id):
    try:
        data = json.loads(request.body)
        name = data['name']
        description = data['description']
        price = data['price']
        category = data['category']
        brand = data['brand']
        color = data['color']
        image = data['image']
        if image != "":
            image = data['image']
            # image is a base64 string
            image += '=' * (-len(image) % 4)
            image = base64.b64decode(image)
            # make it a file
            image = ContentFile(image, f'{name}.png')

        product = Product.objects.get(id=product_id)
        product.name = name
        product.description = description
        product.price = price
        product.category = category
        product.brand = brand
        product.color = color
        if image != "":
            product.image = image
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        print("Product does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)

# get user with username, REST API
@api_view(['GET'])
def get_user_with_username(request, username):
    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        print("User does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)

# get all the comments for a user, REST API
@api_view(['GET'])
def get_user_comments(request, user_id):
    try:
        comments = Comment.objects.filter(seller_id=user_id)
        # order by the most recent to the oldest
        comments = comments.order_by('-id')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except Comment.DoesNotExist:
        print("Comment does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def follow_user(request, user_id):
    try:
        follower_id = request.data['follower_id']
        follower = User.objects.get(id=follower_id)
        user = User.objects.get(id=user_id)

        follow, created = Follower.objects.get_or_create(followed=user, follower=follower)

        if created:
            follow.save()

        return Response(status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    except Follower.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def unfollow_user(request, user_id):
    try:
        follower_id = request.data['follower_id']
        follower = User.objects.get(id=follower_id)
        user = User.objects.get(id=user_id)

        follow = Follower.objects.get(follower=follower, followed=user)
        follow.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    except Follower.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_comment(request, comment_id):
    try:
        print(comment_id)
        comment = Comment.objects.get(id=comment_id)
        comment.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    except Comment.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Comment not found'}, status=404)

@api_view(['POST'])
def add_comment(request):
    try:
        data = json.loads(request.body)
        text = data['text']
        rating = data['rating']
        user_id = data['user_id']
        seller_id = data['seller_id']

        user = User.objects.get(id=user_id)
        seller = User.objects.get(id=seller_id)

        comment = Comment.objects.create(text=text, rating=rating, user_id=user, seller_id=seller)
        comment.save()
        serializer = CommentSerializer(comment)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# example of how to use authentication
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def example(request):
    return Response({'message': 'You are authenticated {}'.format(request.user.username)})