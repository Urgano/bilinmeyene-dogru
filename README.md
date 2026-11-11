# Bilinmeyene Doğru

İstihbarat teşkilatlarının ve devlet arşivlerinin kamuya açtığı UFO/UAP, Soğuk Savaş, paranormal deney ve çözülmemiş vaka dosyaları: etkileşimli harita, kronoloji ve canlı akış.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sitenin tamamı (tasarım, dosya arşivi, harita, animasyonlar) |
| `feed.json` | "Telsiz" paneli ve son dakika bandı. Her sabah otomatik güncellenir |
| `world.json` | Dünya haritası verisi (Natural Earth, world-atlas) |
| `.nojekyll` | GitHub Pages'in dosyaları olduğu gibi yayınlamasını sağlar |

## Akışa elle kayıt eklemek

`feed.json` içindeki `items` listesine şu biçimde bir kayıt ekleyin:

```json
{
  "id": "kisa-benzersiz-ad",
  "kind": "belge",
  "date": "2026-11-20",
  "source": "Kurum adı",
  "title": "Kısa başlık",
  "summary": "En fazla iki cümlelik özet.",
  "url": "https://resmi-kaynak-adresi"
}
```

`kind` değeri `belge` (resmi kurumun yayımladığı yeni belge) veya `gundem` (haber, gelişme) olmalıdır. Ziyaretçilerin açık sayfası 5 dakika içinde yeni kaydı gösterir.

## Arşive dosya eklemek

`index.html` içindeki `CASES` listesine aynı yapıda yeni bir nesne ekleyin. `topic`: `ufo`, `soguk`, `psi` veya `cozulmemis`; `status`: `open`, `closed` veya `disputed`.

## Kaynak notu

Özetler resmi belgelerden derlenmiştir; her dosyada resmi kaynağın bağlantısı bulunur.
