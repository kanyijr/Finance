# Generated by Django 5.1.2 on 2024-11-06 06:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_expense_date_alter_saving_deposit_date'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='income',
            options={'ordering': ['-date']},
        ),
    ]
