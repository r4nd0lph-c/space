from django import forms


class BlogFiltersForm(forms.Form):
    favourite_only = forms.BooleanField(label="Favourites only:",
                                        required=False,
                                        initial=False,
                                        widget=forms.CheckboxInput(
                                            attrs={
                                                "class": "form-check-input",
                                                "id": "blog-header-favorites-only",
                                                "type": "checkbox",
                                                "value": ""
                                            }
                                        ))
