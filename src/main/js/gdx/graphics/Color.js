
/**
 * @JSName("gdx.graphics.Color")
 */

function rgba8888ToColor(color, value) {
    color.r = ((value & 0xff000000) >>> 24) / 255
    color.g = ((value & 0x00ff0000) >>> 16) / 255
    color.b = ((value & 0x0000ff00) >>> 8) / 255
    color.a = ((value & 0x000000ff)) / 255
}

export default class Color {
    constructor(r, g, b, a) {
        if (r && g && b && a) {
            this.r = r
            this.g = g
            this.b = b
            this.a = a
            this.clamp()
        } else if (!r) {
            this.r = 0
            this.g = 0
            this.b = 0
            this.a = 0
        } else {
            rgba8888ToColor(this, r)
        }

    }

    clamp() {
		if (this.r < 0)
			this.r = 0
		else if (this.r > 1) this.r = 1

		if (this.g < 0)
			this.g = 0
		else if (this.g > 1) this.g = 1

		if (this.b < 0)
			this.b = 0
		else if (this.b > 1) this.b = 1

		if (this.a < 0)
			this.a = 0
		else if (this.a > 1) this.a = 1
		return this
        
    }
}

Color.CLEAR = new Color(0, 0, 0, 0);
Color.BLACK = new Color(0, 0, 0, 1);

Color.WHITE = new Color(0xffffffff);
Color.LIGHT_GRAY = new Color(0xbfbfbfff);
Color.GRAY = new Color(0x7f7f7fff);
Color.DARK_GRAY = new Color(0x3f3f3fff);

Color.BLUE = new Color(0, 0, 1, 1);
Color.NAVY = new Color(0, 0, 0.5, 1);
Color.ROYAL = new Color(0x4169e1ff);
Color.SLATE = new Color(0x708090ff);
Color.SKY = new Color(0x87ceebff);
Color.CYAN = new Color(0, 1, 1, 1);
Color.TEAL = new Color(0, 0.5, 0.5, 1);

Color.GREEN = new Color(0x00ff00ff);
Color.CHARTREUSE = new Color(0x7fff00ff);
Color.LIME = new Color(0x32cd32ff);
Color.FOREST = new Color(0x228b22ff);
Color.OLIVE = new Color(0x6b8e23ff);

Color.YELLOW = new Color(0xffff00ff);
Color.GOLD = new Color(0xffd700ff);
Color.GOLDENROD = new Color(0xdaa520ff);
Color.ORANGE = new Color(0xffa500ff);

Color.BROWN = new Color(0x8b4513ff);
Color.TAN = new Color(0xd2b48cff);
Color.FIREBRICK = new Color(0xb22222ff);

Color.RED = new Color(0xff0000ff);
Color.SCARLET = new Color(0xff341cff);
Color.CORAL = new Color(0xff7f50ff);
Color.SALMON = new Color(0xfa8072ff);
Color.PINK = new Color(0xff69b4ff);
Color.MAGENTA = new Color(1, 0, 1, 1);

Color.PURPLE = new Color(0xa020f0ff);
Color.VIOLET = new Color(0xee82eeff);
Color.MAROON = new Color(0xb03060ff);
