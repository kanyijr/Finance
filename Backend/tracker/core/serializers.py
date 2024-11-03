from rest_framework import serializers
from .models import UserProfile, Category, Expense, Income, SavingAccount, Saving, Budget, Report
from django.contrib.auth.models import User

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'card_number', 'location', 'phone_number']

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name', 'description']

# Expense Serializer
class ExpenseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer()

    class Meta:
        model = Expense
        fields = ['expense_id', 'amount', 'date', 'description', 'category', 'user']

# Income Serializer
class IncomeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Income
        fields = ['income_id', 'amount', 'date', 'description', 'user']

# SavingAccount Serializer
class SavingAccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SavingAccount
        fields = [
            'savings_id',
            'savings_title',
            'goal_amount',
            'current_amount',
            'start_date',
            'end_date',
            'user'
        ]

# Saving Serializer
class SavingSerializer(serializers.ModelSerializer):
    savings_account = SavingAccountSerializer()

    class Meta:
        model = Saving
        fields = ['savings_account', 'deposit_amount', 'deposit_date']

# Budget Serializer
class BudgetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer()

    class Meta:
        model = Budget
        fields = ['budget_id', 'limit', 'category', 'user']

# Report Serializer
class ReportSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Report
        fields = ['report_id', 'report_type', 'start_date', 'end_date', 'user']
