# Generated by Django 4.1.5 on 2023-01-29 14:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('membersApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Time_setting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_interval_category', models.CharField(max_length=150)),
                ('begin_time', models.CharField(max_length=150)),
                ('end_time', models.CharField(max_length=150)),
                ('begin_date', models.CharField(max_length=150)),
                ('end_date', models.CharField(max_length=150)),
                ('time_slice', models.CharField(max_length=50)),
                ('time_slice_unit', models.CharField(max_length=10)),
                ('pre_ordering_numbers', models.CharField(max_length=15)),
                ('pre_ordering_unit', models.CharField(max_length=15)),
                ('members', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_setting', to='membersApp.members')),
            ],
        ),
        migrations.CreateModel(
            name='Time_pricing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('origin_price', models.CharField(max_length=100)),
                ('discount_price', models.CharField(max_length=100)),
                ('discount_begin_date', models.CharField(max_length=100)),
                ('discount_end_date', models.CharField(max_length=100)),
                ('members', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_pricing', to='membersApp.members')),
            ],
        ),
        migrations.CreateModel(
            name='Pay_deposit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('open_deposit', models.CharField(max_length=50)),
                ('deposit_category', models.CharField(max_length=50)),
                ('deposit_total_amount', models.CharField(max_length=100)),
                ('members', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pay_deposit', to='membersApp.members')),
            ],
        ),
        migrations.CreateModel(
            name='Order_audit_cancel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audit_choosing', models.CharField(max_length=10)),
                ('cancel_choosing', models.CharField(max_length=10)),
                ('cancel_number', models.CharField(max_length=20)),
                ('cancel_unit', models.CharField(max_length=20)),
                ('members', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_audit_cancel', to='membersApp.members')),
            ],
        ),
    ]
