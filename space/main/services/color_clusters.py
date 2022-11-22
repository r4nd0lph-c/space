import random
import json
import numpy
from sklearn.cluster import KMeans
from scipy.spatial import distance
import numpy as np
import cv2
import math
from collections import Counter

from .color_models_converter import Converter
from .get_near_color_name import c_name
from space.settings import STATIC_ROOT
from os import path


def NN(A, start):
    path = [start]
    cost = 0
    N = A.shape[0]
    mask = np.ones(N, dtype=bool)  # boolean values indicating which
    # locations have not been visited
    mask[start] = False

    for i in range(N - 1):
        last = path[-1]
        # find minimum of remaining locations
        next_ind = np.argmin(A[last][mask])
        next_loc = np.arange(N)[mask][next_ind]  # convert to original location
        path.append(next_loc)
        mask[next_loc] = False
        cost += A[last, next_loc]

    return path, cost


def clustering(image):
    # image = cv2.imread(str)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    mr = 64 * 64
    h, w, _ = image.shape
    if (h * w > mr):
        nh = round(math.sqrt(mr * h / w))
        nw = round(math.sqrt(mr * w / h))
    else:
        nh = h
        nw = w
    image = cv2.resize(image, (nw, nh))
    image_array = image.reshape((image.shape[0] * image.shape[1], 3))

    up_lim = 0
    flag = False

    rgb_percent = [dict() for i in range(10)]
    rgb_coord = [dict() for i in range(10)]

    for num_cl in range(1, 11):

        clt = KMeans(n_clusters=num_cl)
        clt.fit(image_array)

        if (num_cl == 1):
            image_array2 = tuple(map(tuple, image_array))
            one_col = Counter(image_array2)
            c_1_col = one_col.most_common()
            if (c_1_col[0][1] / len(image_array2) >= 0.75):
                up_lim = 1
                flag = True

        rgb = tuple(map(tuple, (np.round(clt.cluster_centers_).astype(int))))

        img_pix = clt.labels_.tolist()
        coun = Counter(img_pix)
        pix_clt_count = coun.most_common()

        for i in range(num_cl):
            percent = round(pix_clt_count[i][1] / len(img_pix) * 100, 2)
            if (percent < 9.0):
                up_lim = num_cl - 1
                flag = True
            rgb_percent[num_cl - 1][rgb[pix_clt_count[i][0]]] = percent

        for i in range(num_cl):
            ran_orig = random.randint(0, len(img_pix) - 1)
            ran = ran_orig

            while (ran < len(img_pix)):
                if (img_pix[ran] == i):
                    break
                else:
                    ran += 1

            if (ran == len(img_pix)):
                ran -= 1

            if (img_pix[ran] != i):

                ran = ran_orig
                while (ran >= 0):
                    if (img_pix[ran] == i):
                        break
                    else:
                        ran -= 1

            if (img_pix[ran] != i):
                print("wtf")

            x = int(round((ran % nw) * w / nw))
            y = int(int(ran / nw) * h / nh)

            rgb_coord[num_cl - 1][rgb[pix_clt_count[i][0]]] = (x, y)
        if (flag):
            break

    j = len(rgb_percent) - 1

    for i in range(10 - up_lim):
        rgb_percent.pop(j)
        rgb_coord.pop(j)
        j -= 1

    if (up_lim > 2):
        for i in range(2, up_lim):
            colors = []

            for jj in range(i + 1):
                colors.append(list(rgb_percent[i].keys())[jj])

            A = np.zeros([i + 1, i + 1])
            for x in range(0, i + 1):
                for y in range(0, i + 1):
                    A[x, y] = distance.euclidean(colors[x], colors[y])

            path, _ = NN(A, 0)
            colours_nn = []
            for k in path:
                colours_nn.append(colors[k])

            for k in range(i + 1):
                rgb_percent[i][colours_nn[k]] = rgb_percent[i].pop(colours_nn[k])
                rgb_coord[i][colours_nn[k]] = rgb_coord[i].pop(colours_nn[k])

    return (up_lim, rgb_percent, rgb_coord)


def blob_to_image(blob):
    return cv2.imdecode(numpy.fromstring(blob.read(), numpy.uint8), cv2.IMREAD_UNCHANGED)


def clustering_main(blob):
    c = Converter()
    with open(path.join(STATIC_ROOT, 'color_names_rgb.json'), 'r', encoding='utf-8') as f:
        data_names = json.load(f)

    img = blob_to_image(blob)
    height, width, _ = img.shape

    up_lim, rgb_percent, rgb_coord = clustering(img)

    res = {"count": up_lim}
    batches = []
    for i in range(up_lim):
        batch = []
        for key in rgb_percent[i].keys():
            item = {
                "hex": c.rgb2hex(key),
                "name": c_name(key[0], key[1], key[2], data_names),
                "contribution": "{:0.2f}%".format(rgb_percent[i][key]),
                "coords": [rgb_coord[i][key][0] / width, rgb_coord[i][key][1] / height]
            }
            batch.append(item)
        batches.append(batch)
    res["batches"] = batches

    return res
