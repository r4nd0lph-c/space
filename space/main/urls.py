from django.urls import path

from .views import *

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('blog/', BlogListView.as_view(), name='blog'),
    path('blog/article/<slug:article_slug>/', ArticleDetailView.as_view(), name='article'),
    path('palette_generator/', PaletteGeneratorView.as_view(), name='palette_generator'),
    path('gradient_generator/', GradientGeneratorView.as_view(), name='gradient_generator'),
    path('color_picker/', ColorPickerView.as_view(), name='color_picker'),
    path('color_picker/get_params', color_picker_get_params, name='get_params'),
    path('contrast_checker/', ContrastCheckerView.as_view(), name='contrast_checker'),
]
