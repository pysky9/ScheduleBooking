# Generated by Django 4.1.5 on 2023-02-16 07:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cartApp', '0001_initial'),
        ('lineApp', '0003_customers_members'),
        ('membersApp', '0002_members_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_id', models.CharField(max_length=150)),
                ('order_date', models.CharField(max_length=150)),
                ('order_time', models.CharField(max_length=50)),
                ('order_total_time', models.CharField(max_length=50)),
                ('order_price', models.CharField(max_length=50)),
                ('order_status', models.CharField(max_length=15)),
                ('bookings', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order', to='cartApp.booking')),
                ('customers', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order', to='lineApp.customers')),
                ('members', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order', to='membersApp.members')),
            ],
        ),
    ]
