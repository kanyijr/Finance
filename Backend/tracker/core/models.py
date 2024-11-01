from django.db import models
from django.contrib.auth.models import User


class UserProfile:
    # profile info is optional so the user can skip the profile section on signup
    card_number = models.CharField(max_length=200, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, null=True)

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()

class Expense(models.Model):
    expense_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-date"]

class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class SavingAccount(models.Model):
    savings_id = models.AutoField(primary_key=True)
    savings_title = models.CharField(max_length=200, null=True)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta: 
        verbose_name = "Savings Accounts"

class Saving(models.Model):
    savings_account = models.ForeignKey(SavingAccount)
    deposit_amount = models.DecimalField(decimal_places=10, max_digits=10)
    deposit_date = models.DateField()

    class Meta:
        ordering = ["-deposit_date"]
        verbose_name = "Savings"

class Budget(models.Model):
    budget_id = models.AutoField(primary_key=True)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # budget should be updated every month


class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    report_type = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

