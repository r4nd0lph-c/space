from math import trunc


class Converter:
    """
    ### Description
    Is used to convert color models. Supported: \n
    * RGB \n
    * HEX \n
    * HSV \n
    * HSL \n
    ------------
    ### Methods
    RGB to other
    ```python
    def rgb2hex(self, val_rgb: tuple) -> str:   # Convert RGB to HEX
    def rgb2hsv(self, val_rgb: tuple) -> tuple: # Convert RGB to HSV
    def rgb2hsl(self, val_rgb: tuple) -> tuple: # Convert RGB to HSL
    ```
    HEX to other
    ```python
    def hex2rgb(self, val_hex: str) -> tuple:   # Convert HEX to RGB
    def hex2hsv(self, val_hex: str) -> tuple:   # Convert HEX to HSV
    def hex2hsl(self, val_hex: str) -> tuple:   # Convert HEX to HSL
    ```
    HSV to other
    ```python
    def hsv2rgb(self, val_hsv: tuple) -> tuple: # Convert HSV to RGB
    def hsv2hex(self, val_hsv: tuple) -> str:   # Convert HSV to HEX
    def hsv2hsl(self, val_hsv: tuple) -> tuple: # Convert HSV to HSL
    ```
    HSL to other
    ```python
    def hsl2rgb(self, val_hsl: tuple) -> tuple: # Convert HSL to RGB
    def hsl2hex(self, val_hsl: tuple) -> str:   # Convert HSL to HEX
    def hsl2hsv(self, val_hsl: tuple) -> tuple: # Convert HSL to HSV
    ```
    ------------
    ### Usage
    ```python
    val_rgb = (255, 32, 128)
    c = Converter()
    val_hex = c.rgb2hex(val_rgb)
    print(val_hex) # "#FF2080" will be printed
    ```
    """

    def __init__(self) -> None:
        pass

    def _check_rgb(func):
        """
        Decorator for validating RGB values used in conversion methods.
        """

        def wrapper(self, val_rgb: tuple, *args):
            if len(val_rgb) != 3:
                raise ValueError(
                    "RGB must contain 3 values, but {} was given: {}.".format(len(val_rgb), val_rgb))
            for c in val_rgb:
                if c not in range(256):
                    raise ValueError(
                        "RGB values must be integers in the range [0...255], but {} was given: {}.".format(c, val_rgb))
            return func(self, val_rgb, *args)

        return wrapper

    def _check_hex(func):
        """
        Decorator for validating HEX values used in conversion methods.
        """

        def wrapper(self, val_hex: str, *args):
            HEX_LEGAL = "0123456789ABCDEF"
            val_hex = val_hex.upper()
            if (val_hex[0] != "#"):
                raise ValueError(
                    "HEX value must start with '#', but {} was given.".format(val_hex))
            elif (len(val_hex) != 7):
                raise ValueError(
                    "HEX value must contain 6 hexadecimal digits after '#', but {} was given: {}.".format(len(val_hex)-1, val_hex))
            else:
                for c in val_hex[1:]:
                    if c not in HEX_LEGAL:
                        raise ValueError("HEX digits must be only in '{}', but '{}' was given: {}".format(
                            HEX_LEGAL, c, val_hex))
                return func(self, val_hex, *args)

        return wrapper

    def _check_hsv(func):
        """
        Decorator for validating HSV values used in conversion methods.
        """

        def wrapper(self, val_hsv: tuple, *args):
            if len(val_hsv) != 3:
                raise ValueError(
                    "HSV must contain 3 values, but {} was given: {}.".format(len(val_hsv), val_hsv))
            if val_hsv[0] not in range(361):
                raise ValueError("HSV 'H' value must be integer in the range [0...360], but {} was given: {}.".format(
                    val_hsv[0], val_hsv))
            if val_hsv[1] not in range(101):
                raise ValueError("HSV 'S' value must be integer in the range [0...100], but {} was given: {}.".format(
                    val_hsv[1], val_hsv))
            if val_hsv[2] not in range(101):
                raise ValueError("HSV 'V' value must be integer in the range [0...100], but {} was given: {}.".format(
                    val_hsv[2], val_hsv))
            return func(self, val_hsv, *args)

        return wrapper

    @_check_rgb
    def rgb2hex(self, val_rgb: tuple) -> str:
        return "#%02x%02x%02x".upper() % val_rgb

    @_check_rgb
    def rgb2hsv(self, val_rgb: tuple) -> tuple:
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
        return tuple(round(c) for c in val_hsv)

    @_check_rgb
    def rgb2hsl(self, val_rgb: tuple) -> tuple:
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
        l = (mx + mn) / 2
        s = 0
        if diff != 0:
            s = diff / (1 - abs(2 * l - 1))
        val_hsl = (h, s * 100, l*100)
        return tuple(round(c) for c in val_hsl)

    @_check_hex
    def hex2rgb(self, val_hex: str) -> tuple:
        return tuple(int(val_hex[i:i + 2], 16) for i in (1, 3, 5))

    def hex2hsv(self, val_hex: str) -> tuple:
        return self.rgb2hsv(self.hex2rgb(val_hex))

    def hex2hsl(self, val_hex: str) -> tuple:
        return self.rgb2hsl(self.hex2rgb(val_hex))

    @_check_hsv
    def hsv2rgb(self, val_hsv: tuple) -> tuple:
        c = val_hsv[1] / 100 * val_hsv[2] / 100
        h_i = val_hsv[0] / 60
        x = c * (1 - abs(h_i % 2 - 1))
        val_rgb = [
            (c, x, 0), (x, c, 0), (0, c, x),
            (0, x, c), (x, 0, c), (c, 0, x)
        ][min(trunc(h_i), 5)]
        m = val_hsv[2] / 100 - c
        return tuple(round((c + m) * 255) for c in val_rgb)

    def hsv2hex(self, val_hsv: tuple) -> str:
        return self.rgb2hex(self.hsv2rgb(val_hsv))

    def hsv2hsl(self, val_hsv: tuple) -> tuple:
        return self.rgb2hsl(self.hsv2rgb(val_hsv))

    @_check_hsv
    def hsl2rgb(self, val_hsl: tuple) -> tuple:
        c = (1 - abs(2 * val_hsl[2] / 100 - 1)) * val_hsl[1] / 100
        h_i = val_hsl[0] / 60
        x = c * (1 - abs(h_i % 2 - 1))
        val_rgb = [
            (c, x, 0), (x, c, 0), (0, c, x),
            (0, x, c), (x, 0, c), (c, 0, x)
        ][min(trunc(h_i), 5)]
        m = val_hsl[2] / 100 - (c / 2)
        return tuple(round((c + m) * 255) for c in val_rgb)

    def hsl2hex(self, val_hsl: tuple) -> str:
        return self.rgb2hex(self.hsl2rgb(val_hsl))

    def hsl2hsv(self, val_hsl: tuple) -> tuple:
        return self.rgb2hsv(self.hsl2rgb(val_hsl))


if __name__ == "__main__":
    c = Converter()
    v_rgb = (255, 32, 128)
    print("RGB")
    print("hex:", c.rgb2hex(v_rgb))
    print("hsv:", c.rgb2hsv(v_rgb))
    print("hsl:", c.rgb2hsl(v_rgb), "\n")

    v_hex = "#FF2080"
    print("HEX")
    print("rgb:", c.hex2rgb(v_hex))
    print("hsv:", c.hex2hsv(v_hex))
    print("hsl:", c.hex2hsl(v_hex), "\n")

    print("HSV")
    v_hsv = (334, 87, 100)
    print("rgb:", c.hsv2rgb(v_hsv))
    print("hex:", c.hsv2hex(v_hsv))
    print("hsl:", c.hsv2hsl(v_hsv), "\n")

    print("HSL")
    v_hsl = (334, 100, 56)
    print("rgb:", c.hsl2rgb(v_hsl))
    print("hex:", c.hsl2hex(v_hsl))
    print("hsv:", c.hsl2hsv(v_hsl))
