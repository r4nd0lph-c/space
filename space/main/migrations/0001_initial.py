# Generated by Django 4.1.1 on 2022-10-21 12:44

import ckeditor_uploader.fields
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('content', ckeditor_uploader.fields.RichTextUploadingField()),
                ('reading', models.SmallIntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)])),
                ('rating', models.IntegerField(default=0)),
                ('slug', models.SlugField(max_length=255, unique=True, verbose_name='URL')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('published', models.BooleanField(default=True)),
                ('tags', models.ManyToManyField(blank=True, to='main.tag')),
            ],
        ),
    ]
