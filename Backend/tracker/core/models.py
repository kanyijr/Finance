from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum
from django.utils import timezone


class UserProfile(models.Model):
    # profile info is optional so the user can skip the profile section on signup
    card_number = models.CharField(max_length=200, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, null=True)
    phone_number = models.CharField(max_length=200, null=True)
    
    def __str__(self):
        return f"profile for {self.user.first_name + " "+self.user.last_name}"

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()

    class Meta:
        verbose_name = "Categorie"
    def __str__(self):
        return f"{self.name}"

class Expense(models.Model):
    expense_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-date"]
    
    def __str__(self):
        return f"Expense incurred on {self.category.name} for {self.user.first_name}"
    
    @property
    def total_expense(self):
        # Get the current date
        current_date = timezone.now()
        # Filter expenses for the current user and current month
        total = Expense.objects.filter(
            user=self.user,
            date__year=current_date.year,
            date__month=current_date.month
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        return total

class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Income for {self.user.username} on {self.date}"


class SavingAccount(models.Model):
    savings_id = models.AutoField(primary_key=True)
    savings_title = models.CharField(max_length=200, null=True)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    # current_amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta: 
        verbose_name = "Savings Account"

    @property
    def current_amount(self):
       total = self.savings.aggregate(total=models.Sum('deposit_amount'))['total'] or 0
       return total
        

class Saving(models.Model):
    savings_account = models.ForeignKey(SavingAccount, on_delete=models.CASCADE, related_name="savings")
    deposit_amount = models.DecimalField(decimal_places=2, max_digits=12)
    deposit_date = models.DateField()

    class Meta:
        ordering = ["-deposit_date"]
        verbose_name = "Saving"

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

