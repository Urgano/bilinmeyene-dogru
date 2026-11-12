# Bilinmeyene Doğru

İstihbarat teşkilatlarının ve devlet arşivlerinin kamuya açtığı UFO/UAP, Soğuk Savaş, paranormal deney ve çözülmemiş vaka dosyaları: etkileşimli harita, kronoloji ve canlı akış.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sitenin tamamı (tasarım, dosya arşivi, harita, animasyonlar) |
| `feed.json` | "Telsiz" paneli ve son dakika bandı. Her sabah otomatik güncellenir |
| `en.js` | İngilizce içerik: dosya ve efsane çevirileri (sitedeki TR/EN düğmesi) |
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
  "url": "https://resmi-kaynak-adresi",
  "source_en": "Agency name",
  "title_en": "Short title",
  "summary_en": "At most two sentences."
}
```

`kind` değeri `belge` (resmi kurumun yayımladığı yeni belge) veya `gundem` (haber, gelişme) olmalıdır. Ziyaretçilerin açık sayfası 5 dakika içinde yeni kaydı gösterir.

## Arşive dosya eklemek

`index.html` içindeki `CASES` listesine aynı yapıda yeni bir nesne ekleyin. `topic`: `ufo`, `soguk`, `psi` veya `cozulmemis`; `status`: `open`, `closed` veya `disputed`.

## Dil desteği

Site Türkçe ve İngilizcedir. Ziyaretçi sağ üstteki **TR / EN** düğmesiyle dil değiştirir; seçim tarayıcıda hatırlanır. İngilizce bağlantı paylaşmak için adresin sonuna `?lang=en` ekleyin. Tarayıcı dili Türkçe olmayan, İngilizce olan ziyaretçiler siteyi doğrudan İngilizce görür.

Yeni bir dosyayı `CASES` listesine ekledikten sonra İngilizcesini `en.js` içindeki `EN_CASES` listesine aynı `id` ile ekleyin; eklenmezse İngilizce sayfada Türkçe metin görünür.

## Kaynak notu

Özetler resmi belgelerden derlenmiştir; her dosyada resmi kaynağın bağlantısı bulunur.
