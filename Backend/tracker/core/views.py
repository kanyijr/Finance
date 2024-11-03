from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import json
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from . import models
from . import serializers
from django.db.models import Sum
from django.utils import timezone


# index view
@api_view(["GET"])
def index(request):
    pass


@api_view(["POST"])
def register(request):
    data = request.data
    print(data, type(data))
    if User.objects.filter(email=data["email"]):
        return Response({"message":"user already exists"}, status=status.HTTP_401_UNAUTHORIZED)
    password = make_password(data["password"])
    try:
        user = User.objects.create(username=data["email"], email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=password)
        if user:
            profile = models.UserProfile.objects.create(user=user, phone_number=data["countryCode"]+data["phoneNumber"])
        
            return Response({"message":"success"},status=status.HTTP_200_OK)
        return Response({"message":"Internal servor error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"message":"Internal server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(["POST"])
def login(request):
    data = request.data
    print(data)
    try:
        password = data["password"]
        # password = make_password(password)
        if user:=User.objects.get(username=data["email"]):
            print(user)
            if user.check_password(password):
                print("pass")
                return Response({"firstName":user.first_name,"email":user.username}, status=status.HTTP_200_OK)
            return Response({"message":"Invalid username or passowrd"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"message":"invalid username or password"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error: ", e)
        return Response({"message":"Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])   
def incomes(request):
    if request.method == "POST":
        data = request.data
        print(data)
        # get the user
        user = User.objects.get(username=data["userName"])
        amount = float(data["amount"])
        try:
            income = models.Income.objects.create(amount=amount, date=data["date"], user=user, description=data["description"])
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{e}")
            return Response({"message":"internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_categories(request):
    categories = models.Category.objects.all()
    data = serializers.CategorySerializer(categories, many=True).data
    print(data)
    return Response(data, status=status.HTTP_200_OK)

from datetime import datetime
# @api_view(["POST"])
# def expenses(request):
#     if request.method =="POST":
#         data = request.data
#         print(data)
#         return Response(status=status.HTTP_200_OK)

from datetime import datetime
from django.db.models import Q

@api_view(["POST"])
def expenses(request):
    if request.method == "POST":
        data = request.data

        # Extract data from the request
        amount = data.get('amount')
        date_str = data.get('date')
        description = data.get('description', '')  # Optional field
        category_name = data.get('category')
        user_id = data.get('user')
        print(category_name)
        # Validate that the required fields are provided
        if not amount or not date_str or not category_name or not user_id:
            return Response(
                {"error": "Amount, date, category, and user are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Parse and validate the date
        try:
            expense_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            if expense_date > datetime.today().date():
                return Response(
                    {"error": "Date cannot be in the future."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the category and user exist
        try:
            category = models.Category.objects.get(pk=category_name)
        except models.Category.DoesNotExist:
            return Response(
                {"error": "Category not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            user = User.objects.get(username=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create the Expense object
        models.Expense.objects.create(
            amount=amount,
            date=expense_date,
            description=description,
            category=category,
            user=user
        )

        return Response(
            {"message": "Expense created successfully."},
            status=status.HTTP_200_OK
        )


@api_view(["GET"])
def get_user_financial_data(request):
    print("Received")
    try:
        # Retrieve the authenticated user
        data = request.GET.get("user")
        print(data)
        user = data
        userObj = User.objects.get(username=user)

        # Get all expenses, income, and savings accounts for the user
        current_date = timezone.now()
        total_expense = models.Expense.objects.filter(
            user=userObj,
            date__year=current_date.year,
            date__month=current_date.month
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        print("Expense", total_expense)
        incomes = models.Income.objects.get(user=userObj)
        print(incomes)
        total_income = models.Income.objects.filter(
            user = userObj,
            date__year = current_date.year,
            date__month = current_date.month
        ).aggregate(Sum("amount"))["amount__sum"] or 0
        print("income",total_income)
        # expenses = models.Expense.objects.filter(user=user)
        # income = models.Income.objects.filter(user=user)
        # savings_accounts = models.SavingAccount.objects.filter(user=user)

        # # Serialize the data
        # expenses_serialized = models.ExpenseSerializer(expenses, many=True)
        # income_serialized = models.IncomeSerializer(income, many=True)
        # savings_accounts_serialized = models.SavingAccountSerializer(savings_accounts, many=True)

        # Construct the response data
        data = {
            "expenses": total_expense,
            "income": total_income,
            "savings_accounts": 0,
        }

        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        # Return an error response if something goes wrong
        print("Error", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
