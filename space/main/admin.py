from django.contrib import admin
from .translation import *
from modeltranslation.admin import TranslationAdmin

from .models import *


@admin.register(Tag)
class TagAdmin(TranslationAdmin):
    list_display = ('id', 'name',)
    list_display_links = ('name',)


@admin.register(Article)
class ArticleAdmin(TranslationAdmin):
    list_display = ('id', 'title', 'reading', 'rating', 'created', 'updated', 'published')
    list_display_links = ('title',)

    prepopulated_fields = {'slug': ('title',), }

    search_fields = ('title', 'content')
    filter_horizontal = ('tags',)
    list_filter = ('published', ('tags', admin.RelatedOnlyFieldListFilter),)

    ordering = ('-created',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'article', 'nickname', 'content', 'created')
    list_display_links = ('nickname',)

    search_fields = ('nickname', 'content')
    list_filter = (('article', admin.RelatedOnlyFieldListFilter),)

    ordering = ('-article', '-created')


admin.site.site_title = 'SPACE'
admin.site.site_header = 'SPACE'
admin.site.index_title = 'Administration'
