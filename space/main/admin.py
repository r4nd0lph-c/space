from django.contrib import admin

from .models import *


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    list_display_links = ('name',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'reading', 'rating', 'created', 'updated', 'published')
    list_display_links = ('title',)

    prepopulated_fields = {'slug': ('title',), }

    search_fields = ('title', 'content')
    filter_horizontal = ('tags',)
    list_filter = ('published', ('tags', admin.RelatedOnlyFieldListFilter),)

    ordering = ('-created',)


admin.site.site_title = 'SPACE'
admin.site.site_header = 'SPACE'
admin.site.index_title = 'Administration'
