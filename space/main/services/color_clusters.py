import random
import json
import numpy
from sklearn.cluster import KMeans
import numpy as np
import cv2
import math
from collections import Counter

from .color_models_converter import Converter
from .get_near_color_name import c_name
from space.settings import STATIC_ROOT
from os import path


def clustering(image):
    # чтение изображения
    # image = cv2.imread('pexels-photo-13986096.jpeg')
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # максимальное кол-во пикселей (540*960)
    # mr = 518400
    mr = 64 * 64

    # изменение размера изображения, если число пикселей выше максимального
    h, w, _ = image.shape

    if (h * w > mr):
        nh = round(math.sqrt(mr * h / w))
        nw = round(math.sqrt(mr * w / h))

    image = cv2.resize(image, (nw, nh))

    # массив пикселей
    image_array = image.reshape((image.shape[0] * image.shape[1], 3))

    # кластеры
    clt = KMeans(n_clusters=10)
    clt.fit(image_array)

    # центры кластеров и кластерный массив пикселей в листы
    cent1 = np.round(clt.cluster_centers_)
    cent = cent1.astype(int).tolist()

    lab = clt.labels_.tolist()

    # most_common выдаёт двумерный массив, где написан номер кластера и кол-во пикселей в порядке убывани
    # [(5, 89769), (0, 87461), (4, 71244), (1, 63915),..]
    c = Counter(lab)
    lab1 = c.most_common()

    # необходимые данные
    # словарь по типу ( процент:ргб), в порядке убывания
    dict = {}
    for i in range(10):
        num_cl = lab1[i][0]
        a = cent[num_cl]
        b = round(lab1[i][1] / len(lab) * 100, 2)
        dict[b] = a

    # словарь по типу (номер кластера: координаты x y), в впорядке убывания популярности кластеров
    cord = {}
    s = random.randint(0, len(lab) - 1)
    for i in range(10):
        while (lab[s] != lab1[i][0]):
            s = random.randint(0, len(lab) - 1)
        y = int((s) / nw)
        y = (y * h / nh)
        x = (s) % nw
        x = (x * w / nw)   
        cord[lab[s]] = (x, y)

    return dict, cord


def blob_to_image(blob):
    return cv2.imdecode(numpy.fromstring(blob.read(), numpy.uint8), cv2.IMREAD_UNCHANGED)


def clustering_main(blob):
    img = blob_to_image(blob)
    dict, cord = clustering(img)

    c = Converter()
    with open(path.join(STATIC_ROOT, 'color_names.json'), encoding='utf-8') as f:
        data_names = json.load(f)
        for item in data_names:
            # print(item)
            data_names[item] = c.hex2rgb('#' + data_names[item])

    res = []
    i = 0
    for item in dict:
        r, g, b = dict[item]
        hex_name = c.rgb2hex((r, g, b))
        name = c_name(r, g, b, data_names)
        new_item = {
            "hex": hex_name,
            "name": name,
            "contribution": "{:0.2f}%".format(float(item)),
            "coords": (round(cord[i][0]), round(cord[i][1]))
        }
        i += 1
        res.append(new_item)
    return res
