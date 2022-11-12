import math


def c_name(r, g, b, cd):
    answer = "Something went wrong"
    d = math.sqrt(255 ** 2 + 255 ** 2 + 255 * 2)  # максимальное расстояние

    for i in cd:
        d1 = math.sqrt((cd[i][0] - r) ** 2 + (cd[i][1] - g)
                       ** 2 + (cd[i][2] - b) ** 2)
        if d1 <= d:
            d = d1
            answer = i

    return answer
