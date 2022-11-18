from django import forms


class CommentForm(forms.Form):
    nickname = forms.CharField(label="Your nickname",
                               widget=forms.TextInput(
                                   attrs={
                                   }
                               ))

    content = forms.CharField(label="Add a comment...",
                              widget=forms.Textarea(
                                  attrs={
                                      "rows": "3"
                                  }
                              ))

    article_slug = forms.CharField(label="Article slug",
                                   max_length=255,
                                   widget=forms.TextInput(
                                       attrs={
                                       }
                                   ))
