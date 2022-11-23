from django.utils.translation import gettext as _
from django import forms


class CommentForm(forms.Form):
    nickname = forms.CharField(widget=forms.TextInput(
                                   attrs={
                                       "class": "form-control",
                                       "placeholder": _("Your nickname")
                                   }
                               ))

    content = forms.CharField(widget=forms.Textarea(
                                  attrs={
                                      "rows": "3",
                                      "class": "form-control",
                                      "placeholder": _("Add a comment...")
                                  }
                              ))

    article_slug = forms.CharField(label="Article slug",
                                   max_length=255,
                                   widget=forms.TextInput(
                                       attrs={
                                       }
                                   ))
