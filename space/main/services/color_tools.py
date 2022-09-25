class Converter:
    """
    """

    __HEX_LEGAL = "0123456789ABCDEF"

    def __init__(self) -> None:
        """
        """

        pass

    def _check_rgb(func):
        """
        Decorator for validating RGB values used in conversion methods.
        """

        def wrapper(self, val_rgb: tuple, *args):
            if len(val_rgb) != 3:
                raise ValueError(
                    "RGB must contain 3 values. {} was given: {}.".format(len(val_rgb), val_rgb))
            for c in val_rgb:
                if c not in range(0, 256):
                    raise ValueError(
                        "RGB values must be integers in the range [0...255], but {} was given: {}.".format(c, val_rgb))
            return func(self, val_rgb, *args)

        return wrapper

    @_check_rgb
    def rgb2hex(self, val_rgb: tuple) -> str:
        """
        """

        return "#%02x%02x%02x".upper() % val_rgb

    @_check_rgb
    def rgb2hsv(self, val_rgb: tuple, rounded: bool = True) -> tuple:
        """
        """

        (r, g, b) = (c / 255 for c in val_rgb)
        mx = max(r, g, b)
        mn = min(r, g, b)
        diff = mx - mn
        h = 0
        if mx != mn:
            if mx == r:
                h = (60 * ((g - b) / diff) + 360) % 360
            elif mx == g:
                h = (60 * ((b - r) / diff) + 120) % 360
            elif mx == b:
                h = (60 * ((r - g) / diff) + 240) % 360
        val_hsv = (h, (diff / mx) * 100 if mx else mx, mx * 100)
        if rounded:
            return tuple(round(c) for c in val_hsv)
        return val_hsv

    @_check_rgb
    def rgb2hsl(self, val_rgb: tuple, rounded: bool = True) -> tuple:
        """
        """

        pass

    # def hex2rgb(self, val_hex: str) -> tuple:
    #     """ """
    #     if (val_hex[0] != "#") or (len(val_hex) != 7):
    #         raise ValueError("")
    #     else:
    #         val_hex = val_hex[1:]
    #         if any(c not in self.__HEX_LEGAL for c in val_hex):
    #             raise ValueError("")
    #     return tuple(int(val_hex[i:i + 2], 16) for i in (0, 2, 4))


if __name__ == "__main__":
    c = Converter()
    rgb = (175, 0, 27)

    print(c.rgb2hex(rgb))
    print(c.rgb2hsv(rgb))
    print(c.rgb2hsl(rgb))
