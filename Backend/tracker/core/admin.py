from django.contrib import admin
from .models import UserProfile, Category, Expense, Income, SavingAccount, Saving, Budget, Report

# Inline for Saving model
class SavingInline(admin.TabularInline):
    model = Saving
    extra = 1  # Number of empty forms to display

# Admin for SavingAccount with Saving inline
@admin.register(SavingAccount)
class SavingAccountAdmin(admin.ModelAdmin):
    list_display = ('savings_id', 'savings_title', 'goal_amount', 'current_amount', 'start_date', 'end_date', 'user')  # Fields to display
    search_fields = ('savings_title', 'user__username')  # Enable search on title and user
    inlines = [SavingInline]  # Adding Saving inline

# Register other models
admin.site.register(UserProfile)
admin.site.register(Category)
admin.site.register(Expense)
admin.site.register(Income)
admin.site.register(Saving)
admin.site.register(Budget)
admin.site.register(Report)
