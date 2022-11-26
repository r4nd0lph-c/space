import json
import math
import random
from os import path

from scipy.constants import golden

from space.settings import STATIC_ROOT
from .color_models_converter import Converter


# функция для центра массива
def center(arrr):
    l = len(arrr)
    if (l == 1):
        return 0
    else:
        return int(l / 2)


# hex to rgb
def hex2rgb(val):
    hexNum = val.strip('#')
    hexLen = len(hexNum)
    conversion = list(int(hexNum[i:i + hexLen // 3], 16) for i in range(0, hexLen, hexLen // 3))
    return conversion


def rgb_to_hsv(pr):
    (r, g, b) = (c / 255.0 for c in pr)
    mx = max(r, g, b)
    mn = min(r, g, b)
    diff = mx - mn
    h = 0.0
    if (mx != mn):
        if mx == r:
            h = (60 * ((g - b) / diff) + 360) % 360
        elif mx == g:
            h = (60 * ((b - r) / diff) + 120) % 360
        elif mx == b:
            h = (60 * ((r - g) / diff) + 240) % 360
    val_hsv = (h / 360.0, (diff / mx) if mx else mx, mx)
    return (tuple((c) for c in val_hsv))


# rgb to hex
def rgb2hex(val):
    conversion = '#%02x%02x%02x' % val
    return conversion


# hsv (hsb) to rgb
def hsv_to_rgb(h, s, v):
    h_i = int(h * 6)
    f = h * 6 - h_i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    if h_i == 0:
        r, g, b = v, t, p
    elif h_i == 1:
        r, g, b = q, v, p
    elif h_i == 2:
        r, g, b = p, v, t
    elif h_i == 3:
        r, g, b = p, q, v
    elif h_i == 4:
        r, g, b = t, p, v
    elif h_i == 5:
        r, g, b = v, p, q
    return [int(r * 255), int(g * 255), int(b * 255)]


# основная функция палетки
def generate(am):
    n_coun = 0  # счётчик none
    gen = [180, 150, -150, 120, -120, 60, -60, 0]
    hh = random.choice(gen)

    hh2 = hh

    # подсчёт none
    for i in am:
        if (i == None):
            n_coun += 1

    # 3 случая: полностью none, полностью заполненный и другой

    if (n_coun == len(am)):
        am = mono_f_r(len(am))  # запуск палетки из полного рандома
        return am
    elif (n_coun == 0):
        return am
    else:
        point = -1
        for i in range(len(am)):  # поиск цвета, который есть в массиве
            if (am[i] != None):
                point = i
                break

        for i in range(point, 0, -1):  # заполнение цветов
            if (am[i - 1] == None):

                am[i - 1] = otten(am[i], hh, 1)
            else:
                continue

        for i in range(point, len(am) - 1, 1):
            if (am[i + 1] == None):

                am[i + 1] = otten(am[i], hh2, 2)
            else:
                continue
        return am


# функция подбора нового цвета под заданный на вход
def otten(prev, h_diff, ta):
    prev = hex2rgb(str(prev))
    prev = rgb_to_hsv(prev)

    h = prev[0] * 360 + h_diff

    h %= 360
    if (ta == 1):

        s = (prev[1] + (1 - golden)) % 1
        v = (prev[2] + (1 - golden)) % 1
    elif (ta == 2):
        s = (prev[1] - (1 - golden)) % 1
        v = (prev[2] - (1 - golden)) % 1

    new = hsv_to_rgb(h / 360.0, s, v)
    new = rgb2hex(tuple(new))

    return new


# функция создания палетки полного рандома
def mono_f_r(le):
    h = random.randint(0, 359)
    s = random.randint(30, 97) / 100.0
    v = random.randint(30, 97) / 100.0
    rgb_eden = hsv_to_rgb(h / 360.0, s, v)
    arr = [rgb_eden, ]

    for i in range(le - 1):
        h += 7
        h %= 360
        s += (1 - golden)
        s %= 1
        v += (1 - golden)
        v %= 1

        rgb_eden = hsv_to_rgb(h / 360.0, s, v)
        arr.insert(center(arr), rgb_eden)

    for i in range(len(arr)):
        arr[i] = rgb2hex(tuple(arr[i]))

    return arr


def c():
    return '#%02X%02X%02X' % (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))


def avg_c(c1, c2):
    avg = lambda x, y: round((x + y) / 2)
    c = Converter()
    c1 = c.hex2rgb(c1)
    c2 = c.hex2rgb(c2)
    avg_color = (avg(c1[0], c2[0]), avg(c1[1], c2[1]), avg(c1[2], c2[2]))
    return c.rgb2hex(avg_color)


def generation_random(palette):
    for i in range(len(palette)):
        if palette[i] == '':
            palette[i] = c()

    return palette


def generation_preset(palette):
    with open(path.join(STATIC_ROOT, 'color_presets.json'), 'r', encoding='utf-8') as f:
        color_presets = json.load(f)["presets"]
    length = len(palette)
    if length <= 5:
        new_palette = random.choice(color_presets)[:length]
    else:
        empty_count = palette.count('')
        new_palette = random.choice(color_presets)
        i = 1
        while len(new_palette) < empty_count:
            if i < len(new_palette):
                new_palette = new_palette[:i] + [avg_c(new_palette[i - 1], new_palette[i])] + new_palette[i:]
            else:
                c = Converter()
                clr = c.hex2rgb(new_palette[i - 1])
                dist = math.sqrt(clr[0] ** 2 + clr[1] ** 2 + clr[2] ** 2)
                avg = avg_c(new_palette[i - 1], "#FFFFFF")
                if dist < 220:
                    avg = avg_c(new_palette[i - 1], "#000000")
                new_palette = new_palette[:i] + [avg] + new_palette[i:]
            i += 2
    j = 0
    for i in range(len(palette)):
        if palette[i] == '':
            palette[i] = new_palette[j]
            j += 1
    return palette


if __name__ == "__main__":
    pass
