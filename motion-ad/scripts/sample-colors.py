"""Sample exact brand hexes from the captured TExP screenshots (page, surfaces, accent)."""
from PIL import Image

A = r'C:\Users\ahmra\OneDrive\Desktop\1work\testy\TExP\motion-ad\a'


def px(name, x, y, imgs={}):
    if name not in imgs:
        imgs[name] = Image.open(f'{A}\\{name}').convert('RGB')
    return imgs[name].getpixel((x, y))


def hx(rgb):
    return '#%02X%02X%02X' % rgb


cb = Image.open(f'{A}\\canvas-before.jpg').convert('RGB')
print('canvas-before size', cb.size)
print('canvas bg  tl', hx(cb.getpixel((10, 10))), 'center-top', hx(cb.getpixel((cb.width // 2, 14))))
print('canvas bg  bl', hx(cb.getpixel((10, cb.height - 10))), 'br', hx(cb.getpixel((cb.width - 10, cb.height - 10))))

ha = Image.open(f'{A}\\hero-app.jpg').convert('RGB')
print('hero-app size', ha.size)
print('hero outer bg', hx(ha.getpixel((6, 6))))
print('sidebar bg   ', hx(ha.getpixel((120, 1600))))
print('canvas mid   ', hx(ha.getpixel((1700, 260))))

# Lime accent scan (play pill / toggles) — most frequent strongly-lime pixel
best = {}
for y in range(2350, 2400, 2):
    for x in range(1520, 1560, 1):
        pass
found = {}
for y in range(2100, 2400, 3):
    for x in range(1100, 2100, 3):
        r, g, b = ha.getpixel((x, y))
        if g > 185 and b < 160 and r > 130 and (g - b) > 60:
            found[(r, g, b)] = found.get((r, g, b), 0) + 1
top = sorted(found.items(), key=lambda kv: -kv[1])[:5]
print('lime candidates:', [(hx(k), v) for k, v in top])

cd = Image.open(f'{A}\\code-dialog.jpg').convert('RGB')
print('dialog size', cd.size)
print('dialog surface', hx(cd.getpixel((20, 20))), hx(cd.getpixel((cd.width - 20, cd.height - 20))))
print('code block bg ', hx(cd.getpixel((200, 400))))
