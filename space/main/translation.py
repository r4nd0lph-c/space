from modeltranslation.translator import register, TranslationOptions
from .models import *


@register(Tag)
class TagTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Article)
class ArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'content')
