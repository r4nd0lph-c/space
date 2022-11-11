from django.http import HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, ListView, DetailView

from .models import *

from bs4 import BeautifulSoup


# --------------------- MAIN PAGE START -------------------- #
class IndexView(TemplateView):
    """
    CBV for the Index Page representation
    """

    template_name = 'main/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Home | SPACE'
        recent_posts = list(Article.objects.order_by('-created')[0:2])
        recent_posts_images = []
        for item in recent_posts:
            start = item.content.find("<img")
            start += item.content[start:].find('src=')
            end = item.content[start + 5:].find('"')
            recent_posts_images.append(item.content[start + 5: start + 5 + end])
        for item in recent_posts:
            item.content = ' '.join(BeautifulSoup(item.content, "html.parser").stripped_strings)
        context['recent_posts'] = recent_posts
        context['recent_posts_images'] = recent_posts_images
        return context


# ---------------------  MAIN PAGE END  -------------------- #


# ------------------ BLOG&POST PAGES START ----------------- #
class BlogListView(ListView):
    """
    CBV for the Blog Page representation
    """

    template_name = 'main/blog.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Blog | SPACE'

        return context


class ArticleDetailView(DetailView):
    """
    CBV for the Article Page representation
    """

    template_name = 'main/article.html'
    context_object_name = 'article'

    model = Article

    queryset = Article.objects.filter(published=True)

    def get_object(self):
        article_obj = get_object_or_404(self.queryset, slug=self.kwargs['article_slug'])
        return article_obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Article | SPACE'

        return context


# ------------------  BLOG&POST PAGES END  ----------------- #


# -------------------- TOOL PAGES START -------------------- #
class PaletteGeneratorView(TemplateView):
    """
    CBV for the Palette Generator Page representation
    """

    template_name = 'main/palette_generator.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = ''
        return context


class GradientGeneratorView(TemplateView):
    """
    CBV for the Gradient Generator Page representation
    """

    template_name = 'main/gradient_generator.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = ''
        return context


class ColorPickerView(TemplateView):
    """
    CBV for the Color Picker Page representation
    """

    template_name = 'main/color_picker.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = ''
        return context


class ContrastCheckerView(TemplateView):
    """
    CBV for the Contrast Checker Page representation
    """

    template_name = 'main/contrast_checker.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = ''
        return context


# --------------------  TOOL PAGES END  -------------------- #


# -------------------- ERROR PAGE START -------------------- #
def page_not_found(request, exception):
    return HttpResponseNotFound('Page not found')

# --------------------  ERROR PAGE END  -------------------- #
