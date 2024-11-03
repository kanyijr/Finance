# Generated by Django 5.1.2 on 2024-11-03 10:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_category_options_alter_saving_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='savingaccount',
            name='current_amount',
        ),
        migrations.AlterField(
            model_name='saving',
            name='deposit_amount',
            field=models.DecimalField(decimal_places=2, max_digits=12),
        ),
        migrations.AlterField(
            model_name='saving',
            name='savings_account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='savings', to='core.savingaccount'),
        ),
    ]