from random import randint


def generate(palette=None) -> list:
    c = lambda: randint(0, 255)

    if palette is None or not palette:
        palette = ["#%02X%02X%02X" % (c(), c(), c()) for _ in range(5)]
    else:
        for i in range(len(palette)):
            if palette[i] is None or palette[i] == '':
                palette[i] = "#%02X%02X%02X" % (c(), c(), c())

    return palette


if __name__ == "__main__":
    pass
