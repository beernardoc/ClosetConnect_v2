# ClosetConnect
2nd Project developed for the Technologies and Web Programming class of 2023/2024.</br>

This is a continuation of the [1st Project](https://github.com/beernardoc/ClosetConnect), in which client and server side were combined in Django. In this continuation, the front-side is developed in Angular, while the server-side was migrated to Django Rest Framework
## Project Description

The project consists of a web application that allows users to shop/sell products that they do not want in their Closet anymore.

## Functionalities

### User with no account initiated

- Register
- Login
- View products
- View product details

### Normal User with account initiated

- Logout
- View products
- View product details
- Add/Remove product to cart
- View cart
- Buy products in cart
- Add/Remove/View product to favorites
- View/Update/Delete profile
- View seller profile
- Follow/Unfollow seller
- Add/Remove comment to a user
- Sell a product
- Edit/Delete a product

### Admin User

- Same as Normal User
- Remove products from the website
- Remove comments from the website
- Ban users
- Search for users/products

## Accounts

### Admin
| Username | Password |
| -------- | -------- |
| manel123 | user1234 |

### Normal User
| Username | Password |
| -------- | -------- |
|   joao   | user1234 |
|   jose   | user1234 |

## Setup

### Server-side (Django REST Framework)

To facilitate the setup of the project, we have the necessary requirements in the requirements.txt file.

Also, we created a python script, [insertData.py](TPW_project_2_backend/insertData.py) to insert some data into the database, so that the project is not empty.
The users inserted just need to be inserted in the Users table (Authentication and Authorization) in the Django Admin page, with the same username and password.

main commands:
```bash
- pip install -r requirements.txt
- python manage.py makemigrations
- python manage.py migrate
- python insertData.py
- python manage.py runserver
```

### Client-side (Angular)

main commands:
```bash
- npm install
- ng serve
```


## Features that we would like to implement in the future

- Chat between users
- Notification system
- Checkout system
- Order history
- Search for products

## Authors

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Bernardo Pinto   | 105926    | bernardopinto@ua.pt  |
| Filipe Obrist    | 107471    | filipe.obrist@ua.pt  |
| José Mendes      | 107188    | mendes.j@ua.pt       |

## Deployment

### Server-side (Django REST Framework)
http://zemendes17.pythonanywhere.com/

### Client-side (Angular)
https://closetconnect-tpw.netlify.app/
