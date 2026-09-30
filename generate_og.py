import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
img = Image.new('RGB', (W, H), color='#001133')
draw = ImageDraw.Draw(img)

# Deep gradient background: Dark Albiazul Navy
for y in range(H):
    factor = y / H
    r = int(0 + factor * 2)
    g = int(16 + factor * 22)
    b = int(45 + factor * 65)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Subtle trama tile across background
trama = Image.open('imagenes/trama_filial_chaco.png').convert('RGBA')
trama = trama.resize((150, 150), Image.Resampling.LANCZOS)
trama_alpha = trama.split()[3].point(lambda p: int(p * 0.16))
trama.putalpha(trama_alpha)

for x in range(0, W, 150):
    for y in range(0, H, 150):
        img.paste(trama, (x, y), trama)

# Load Amadeo image
amadeo = Image.open('imagenes/Amadeo1.jpg').convert('RGBA')
card_w, card_h = 360, 510
card_x, card_y = 60, 60

aw, ah = amadeo.size
scale = max(card_w / aw, card_h / ah)
new_w, new_h = int(aw * scale), int(ah * scale)
amadeo_resized = amadeo.resize((new_w, new_h), Image.Resampling.LANCZOS)
left = (new_w - card_w) // 2
top = 0
amadeo_cropped = amadeo_resized.crop((left, top, left + card_w, top + card_h))

# Create rounded mask for Amadeo card
mask = Image.new('L', (card_w, card_h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, card_w, card_h], radius=24, fill=255)

# Card shadow
shadow = Image.new('RGBA', (card_w + 30, card_h + 30), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rounded_rectangle([15, 15, card_w + 15, card_h + 15], radius=24, fill=(0, 0, 0, 170))
shadow = shadow.filter(ImageFilter.GaussianBlur(14))
img.paste(shadow, (card_x - 15, card_y - 15), shadow)

img.paste(amadeo_cropped, (card_x, card_y), mask)

# Draw cyan/sky border around amadeo card
overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ov_draw = ImageDraw.Draw(overlay)
ov_draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, outline=(56, 189, 248, 220), width=3)
img.paste(overlay, (0, 0), overlay)

# Badge over Amadeo photo
amadeo_badge = Image.new('RGBA', (260, 42), (0, 26, 73, 235))
bdraw = ImageDraw.Draw(amadeo_badge)
bdraw.rounded_rectangle([0, 0, 260, 42], radius=12, outline=(56, 189, 248, 180), width=2)
font_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
bdraw.text((130, 21), 'DON AMADEO NUCCETELLI', font=font_badge, fill=(255, 255, 255), anchor='mm')
img.paste(amadeo_badge, (card_x + (card_w - 260) // 2, card_y + card_h - 56), amadeo_badge)

# RIGHT SIDE CONTENT
content_x = 470

# Filial Logo
logo = Image.open('imagenes/logo_filial_chaco.png').convert('RGBA')
logo = logo.resize((104, 104), Image.Resampling.LANCZOS)
img.paste(logo, (content_x, 68), logo)

# Fonts
font_sm_bold = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 18)
font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 50)
font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 30)
font_desc = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 23)
font_pill = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)

# Tagline next to logo
draw.text((content_x + 120, 86), "FILIAL CHACO T 'NERY LEYES'", font=font_sm_bold, fill=(56, 189, 248))
draw.text((content_x + 120, 114), "CLUB ATLÉTICO TALLERES", font=font_pill, fill=(203, 213, 225))

# Title
draw.text((content_x, 195), "EL ORÁCULO ALBIAZUL", font=font_title, fill=(255, 255, 255))

# Subtitle / Accent (#F48138 brand orange)
draw.text((content_x, 262), "UN TEST MATADOR", font=font_sub, fill=(244, 129, 56))

# Description lines
desc1 = "Repasá los ídolos de nuestra historia con Don Amadeo"
desc2 = "y descubrí qué tan Tallarín es tu ADN Albiazul."
draw.text((content_x, 318), desc1, font=font_desc, fill=(226, 232, 240))
draw.text((content_x, 355), desc2, font=font_desc, fill=(226, 232, 240))

# Feature pill buttons (without emoji boxes)
features = [
    ("27 Ídolos Históricos", (30, 64, 175)),
    ("Cancha, Video o Ni lo juno", (15, 118, 110)),
    ("Veredicto Personalizado", (180, 83, 9))
]

pill_x = content_x
for text, border_color in features:
    text_w = int(draw.textlength(text, font=font_pill))
    pill_w = text_w + 32
    pill_img = Image.new('RGBA', (pill_w, 38), (15, 23, 42, 180))
    pdraw = ImageDraw.Draw(pill_img)
    pdraw.rounded_rectangle([0, 0, pill_w, 38], radius=12, outline=(148, 163, 184, 120), width=1)
    
    # Small circular accent dot inside the pill
    dot_color = (56, 189, 248) if "27" in text else ((52, 211, 153) if "Cancha" in text else (251, 191, 36))
    pdraw.ellipse([14, 15, 22, 23], fill=dot_color)
    pdraw.text((28 + text_w // 2, 19), text, font=font_pill, fill=(255, 255, 255), anchor='mm')
    
    img.paste(pill_img, (pill_x, 420), pill_img)
    pill_x += pill_w + 14

# Call to Action bar at bottom
cta_w, cta_h = 670, 62
cta_img = Image.new('RGBA', (cta_w, cta_h), (2, 132, 199, 240))
cdraw = ImageDraw.Draw(cta_img)
cdraw.rounded_rectangle([0, 0, cta_w, cta_h], radius=16, outline=(125, 211, 252, 230), width=2)
font_cta = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 21)
cdraw.text((cta_w // 2, cta_h // 2), "JUGALO AHORA EN  amade-oraculo.vercel.app  >>>", font=font_cta, fill=(255, 255, 255), anchor='mm')
img.paste(cta_img, (content_x, 492), cta_img)

# Save as optimized JPEG
out_path = 'imagenes/og_preview.jpg'
img.save(out_path, 'JPEG', quality=90, optimize=True)
print(f"Generated {out_path}, size: {os.path.getsize(out_path)} bytes")
