from django.urls import path

from .views import *

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('about/', AboutView.as_view(), name='about'),
    path('services/', ServicesView.as_view(), name='services'),
    path('blog/', BlogListView.as_view(), name='blog'),
    path('blog/article/<slug:article_slug>/', ArticleDetailView.as_view(), name='article'),
    path('blog/article/form', ArticleFormView.as_view(), name='article_form'),
    path('add_rating/', add_rating, name="add_rating"),
    path('remove_rating/', remove_rating, name="remove_rating"),
    path('blog/add_rating/', add_rating, name="add_rating_blog"),
    path('blog/remove_rating/', remove_rating, name="remove_rating_blog"),
    path('blog/article/<slug:article_slug>/add_rating/', add_rating, name="add_rating_article"),
    path('blog/article/<slug:article_slug>/remove_rating/', remove_rating, name="remove_rating_article"),
    path('palette_generator/', PaletteGeneratorView.as_view(), name='palette_generator'),
    path('palette_generator/change_palette/', change_palette, name="change_palette"),
    path('palette_generator/get_color_name/', get_color_name, name="get_color_name"),
    path('gradient_generator/', GradientGeneratorView.as_view(), name='gradient_generator'),
    path('color_picker/', ColorPickerView.as_view(), name='color_picker'),
    path('color_picker/get_params', color_picker_get_params, name='get_params'),
    path('contrast_checker/', ContrastCheckerView.as_view(), name='contrast_checker'),
]
