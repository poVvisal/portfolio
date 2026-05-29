from PIL import Image
import sys

src = 'public/meteorite-head.png'
out = 'public/meteorite-head-processed.png'
# Pixel brightness threshold: treat near-black as background
threshold = 50

try:
    img = Image.open(src).convert('RGBA')
except FileNotFoundError:
    print('Source image not found:', src)
    sys.exit(2)

pixels = img.getdata()
new_pixels = []
for r, g, b, a in pixels:
    # If pixel is near-black and fairly opaque, make it transparent
    if r <= threshold and g <= threshold and b <= threshold:
        new_pixels.append((255, 255, 255, 0))
    else:
        new_pixels.append((r, g, b, a))

img.putdata(new_pixels)
img.save(out, 'PNG')
print('Saved processed image to', out)
