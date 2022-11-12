from django.http import HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, ListView, DetailView
from django.http import JsonResponse

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
        recent_posts = list(Article.objects.filter(published=True).order_by('-created')[0:2])
        recent_posts_images = []
        for item in recent_posts:
            soup = BeautifulSoup(item.content, 'html.parser')
            recent_posts_images.append(soup.find('img').attrs['src'])
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

    model = Article
    queryset = Article.objects.filter(published=True).order_by('-created')

    paginate_by = 2

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Blog | SPACE'
        posts_images = {}
        posts_clear_content = {}
        for item in self.object_list:
            soup = BeautifulSoup(item.content, 'html.parser')
            posts_images[item.slug] = soup.find('img').attrs['src']
            posts_clear_content[item.slug] = ' '.join(BeautifulSoup(item.content, "html.parser").stripped_strings)
        context['posts_images'] = posts_images
        context['posts_clear_content'] = posts_clear_content
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
        context['title'] = 'Color Picker | SPACE'
        return context


# @csrf_exempt
# def color_picker_get_params(request):
#     img = request.GET.get('img', None)
#     data = {
#         'result': img
#     }
#     return JsonResponse(data)


@csrf_exempt
def color_picker_get_params(request):
    if request.method == 'POST':
        image = request.FILES['img']
        print(image.size)
        return JsonResponse({"img_params": None})
    else:
        return JsonResponse({"message": "you don't have enough rights!"})


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
