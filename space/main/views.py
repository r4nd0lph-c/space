from datetime import date, timedelta

from django.http import HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, ListView, DetailView
from django.http import JsonResponse

from .models import *
from .services import color_clusters

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


# ------------------- ABOUT US PAGE START ------------------ #
class AboutView(TemplateView):
    """
    CBV for the About Page representation
    """

    template_name = 'main/about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'About | SPACE'
        return context


# -------------------  ABOUT US PAGE END  ------------------ #


# ------------------- SERVICES PAGE START ------------------ #
class ServicesView(TemplateView):
    """
    CBV for the Services Page representation
    """

    template_name = 'main/services.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Services | SPACE'
        return context


# -------------------  SERVICES PAGE END  ------------------ #


# ------------------ BLOG&POST PAGES START ----------------- #
class BlogListView(ListView):
    """
    CBV for the Blog Page representation
    """

    template_name = 'main/blog.html'
    paginate_by = 1

    model = Article

    def get_queryset(self):
        FILTER_DATE = {
            '0': None,  # All time
            '1': 1,  # Last day
            '2': 7,  # Last week
            '3': 30,  # Last month
        }

        FILTER_SORTING = {
            '0': '-created',  # By creation date (new first)
            '1': 'created',  # By creation date (old first)
            '2': '-rating',  # By popularity (the best)
            '3': 'rating',  # By popularity (worst)
        }

        # new_queryset = Article.objects.filter(published=True).order_by('-created')
        new_queryset = Article.objects.filter(published=True)

        filter_date = self.request.GET.get('filter_date', '0')
        filter_sorting = self.request.GET.get('filter_sorting', '0')

        if filter_date in FILTER_DATE:
            if filter_date != '0':
                today = date.today()
                day_before = today - timedelta(days=FILTER_DATE[filter_date])
                new_queryset = new_queryset.filter(created__gt=day_before)

        if filter_sorting in FILTER_SORTING:
            new_queryset = new_queryset.order_by(FILTER_SORTING[filter_sorting])
        return new_queryset

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
        context['filter_date'] = self.request.GET.get('filter_date', '0')
        context['filter_sorting'] = self.request.GET.get('filter_sorting', '0')
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


@csrf_exempt
def add_rating(request):
    """ FBV for add rating to post (slug) AJAX """

    if request.method == "POST":
        slug = request.POST.get("slug", None)
        article = Article.objects.get(slug=slug)
        article.rating += 1
        article.save()
        return JsonResponse({"message": "success add"})
    else:
        return JsonResponse({"message": "you don't have enough rights!"})


@csrf_exempt
def remove_rating(request):
    """ FBV for remove rating to post (slug) AJAX """

    if request.method == "POST":
        slug = request.POST.get("slug", None)
        article = Article.objects.get(slug=slug)
        article.rating -= 1
        article.save()
        return JsonResponse({"message": "success remove"})
    else:
        return JsonResponse({"message": "you don't have enough rights!"})


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


@csrf_exempt
def color_picker_get_params(request):
    """ FBV for color_picker AJAX """

    if request.method == 'POST':
        blob_img = request.FILES['img']
        res = color_clusters.clustering_main(blob_img)
        return JsonResponse({"img_params": res})
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
    """ FBV for 404 Error """

    return HttpResponseNotFound('Page not found')

# --------------------  ERROR PAGE END  -------------------- #
