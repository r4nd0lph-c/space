import json

from .color_models_converter import Converter
from .get_near_color_name import c_name
from space.settings import STATIC_ROOT
from os import path


def get_color_name(hex_color: str) -> str:
    c = Converter()
    rgb = c.hex2rgb(hex_color)
    with open(path.join(STATIC_ROOT, 'color_names_rgb.json'), 'r', encoding='utf-8') as f:
        data_names = json.load(f)
    return c_name(rgb[0], rgb[1], rgb[2], data_names)
