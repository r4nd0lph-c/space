from django.db import models
from django.core.validators import MinValueValidator
from ckeditor_uploader.fields import RichTextUploadingField
from django.urls import reverse


class Tag(models.Model):
    name = models.CharField(db_index=True, unique=True, max_length=255)

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=255)
    content = RichTextUploadingField()
    tags = models.ManyToManyField(Tag, blank=True)
    reading = models.SmallIntegerField(default=1, validators=[MinValueValidator(1)])
    rating = models.IntegerField(default=0)
    slug = models.SlugField(unique=True, max_length=255, verbose_name='URL')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)

    def __str__(self):
        return 'Article ID: ' + str(self.id)

    def get_absolute_url(self):
        return reverse('article', kwargs={'slug': self.slug})
