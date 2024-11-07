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
      

        total_income = models.Income.objects.filter(
            user = userObj,
            date__year = current_date.year,
            date__month = current_date.month
        ).aggregate(Sum("amount"))["amount__sum"] or 0

        print("income",total_income)

      
        # Create a Q object for filtering
        date_filter = Q(savings_account__end_date__year=current_date.year) | Q(savings_account__end_date__month=current_date.month)
        savings = models.Saving.objects.filter(
            date_filter,
            savings_account__user=userObj,
            
        ).aggregate(total_deposit=Sum('deposit_amount'))['total_deposit'] or 0
                
        expenses = models.Expense.objects.filter(
            user=userObj,
            date__month = current_date.month
        ) 
        serialized_expenses = serializers.ExpenseSerializer(expenses, many=True)
        # Construct the response data
        data = {
            "expenses": total_expense,
            "income": total_income,
            "savings": savings,   
            "expense_list":serialized_expenses.data        
        }

        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        # Return an error response if something goes wrong
        print("Error", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def create_saving_account(request):
    data = request.data
    user = data.get("userName")
    user = User.objects.get(username=user)  # The authenticated user

    # Validate incoming data
    savings_title = data.get('savings_title')
    goal_amount = data.get('goal_amount')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not all([savings_title, goal_amount, start_date, end_date]):
        return Response(
            {"error": "All fields except description are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create the SavingAccount instance
    saving_account = models.SavingAccount.objects.create(
        savings_title=savings_title,
        goal_amount=goal_amount,
        start_date=start_date,
        end_date=end_date,
        user=user
    )

    # Serialize and return the new instance
    serializer = serializers.SavingAccountSerializer(saving_account)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def fetch_savings(request):
    try:
        print("request received")
        username = request.GET.get("user")
        print(username)
        if not username:
            raise Exception("Bad")
        
        user = User.objects.get(username=username)
        #query the user savings data
        savings = models.SavingAccount.objects.filter(user=user)
        total = 0
        for saving in savings:
            total += saving.current_amount
        '''
        The savings accounts data structure
        {
            'total':float,
            'num_accounts':int,
            'accounts':[
                account,
                account
            ]
        }

        The 'account' data structure
        {
            account_id:int,
            title: string,
            start_date:date,
            end_date:date,
            current_amount:float,
            goal:float
        }
        '''
        savings_data = {
            "total":total,
            "num_accounts":len(savings),
            "accounts":[]
        }
        # pushing the accounts to the list
        for saving in savings:
            saving_data = dict({})
            saving_data["account_id"] = saving.savings_id
            saving_data["title"] = saving.savings_title
            saving_data["start_date"] = saving.start_date
            saving_data["end_date"] = saving.end_date
            saving_data["current_amount"] = saving.current_amount
            saving_data["goal"] = saving.goal_amount
            savings_data["accounts"].append(saving_data)
        
        return Response(savings_data, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error while fetching savings data: ", e)
        return Response({"message":"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["POST", "PUT"])
def add_funds(request):
    try:
        if request.method=="POST":
            print("request received for adding funds")
            print(request.data)
            data = request.data
            user = data["user"]
            amount = data["amount"]
            user = User.objects.get(username=user)
            if not user:
                raise Exception("user not found")
            account = models.SavingAccount.objects.get(pk=data["id"], user=user)
            # create saving instance
            saving = models.Saving.objects.create(savings_account = account, deposit_amount = amount)
            return Response({"message":"Funds added"}, status=status.HTTP_200_OK)
        
        #changing account goal
        else:
            print("request for changing goal")
            data = request.data
            user = data["user"]
            amount = data["amount"]
            user = User.objects.get(username=user)
            if not user:
                raise Exception("user not found")
            account = models.SavingAccount.objects.get(pk=data["id"], user=user)
            account.goal_amount = amount
            account.save()
            return Response({"message":"goal changed"}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error while adding funds: ", e)
        return Response({"message":"Internal Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import models

@api_view(["GET"])
def transactions(request):
    '''
    Return a list of JSON objects for transactions (income and expenses), structured as:
    {
        "transactions": [
            {
                "type": "Income" or "Expense",
                "amount": float,
                "category": string,
                "date": date,
                "description": string
            },
            ...
        ]
    }
    '''
    try:
        print("Request for transactions received")
        
        # Get the user from the request
        username = request.GET.get("user")
        if not username:
            return Response({"message": "User not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to get the user object
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"message": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get income and expense transactions for the user
        income_transactions = models.Income.objects.filter(user=user)
        expense_transactions = models.Expense.objects.filter(user=user)
        
        # Combine and format transactions
        transactions_list = []

        # Process income transactions
        for income in income_transactions:
            transactions_list.append({
                "type": "Income",
                "amount": float(income.amount),
                "date": income.date,
                "description": income.description
            })

        # Process expense transactions
        for expense in expense_transactions:
            transactions_list.append({
                "type": "Expense",
                "amount": float(expense.amount),
                "category": expense.category.name if expense.category else "None",
                "date": expense.date,
                "description": expense.description
            })

        # Sort the transactions by date (ascending order)
        transactions_list.sort(key=lambda x: x["date"], reverse=True)

        return Response({"transactions": transactions_list}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error: {e}")
        return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
