# Manni Macht's — Komplettes Redesign (Design-Spec)

**Datum:** 2026-08-12
**Richtung:** C — „Modern & freundlich" (hell, rund, mobil-first, konversionsstark)
**Ausgangslage:** Bestehende statische One-Pager-Website (HTML/CSS/JS, kein Build-Schritt), deployed auf Vercel. Solide gebaut, aber optisch flach; einige Funktions- und Rechtsthemen offen.

---

## 1. Ziele

1. Komplett neues, modernes Erscheinungsbild (Richtung C) bei erhaltener Marke (Terrakotta/Braun, Logo, Region Hamburg/Rosengarten, Mannis Ton).
2. Konversion optimieren: schneller Weg zu Terminanfrage (Formular) und WhatsApp, besonders auf dem Handy.
3. Rechtssicherheit erhöhen: Impressum + Datenschutzerklärung als eigene Seiten.
4. Ehrlichkeit: keine erfundenen Bewertungszahlen.
5. Lokale Auffindbarkeit: strukturierte Daten + robots/sitemap.
6. Accessibility und Performance mindestens halten, wo möglich verbessern.

## 2. Nicht-Ziele (bewusst ausgeklammert)

- **Formular-Backend wird NICHT angefasst.** Die bestehende Netlify-Forms-Anbindung (`data-netlify`, POST an `/`) bleibt unverändert. ⚠️ Bekannter offener Punkt: Auf Vercel funktioniert das nicht — Anfragen laufen ins Leere. Als separate Aufgabe für später markiert; das Formular-UI wird nur neu gestaltet.
- Kein Darkmode (Richtung C ist bewusst hell).
- Keine echten Geschäftsdaten in den Rechtsseiten — nur klar markierte Platzhalter.
- Kein Framework/Build-Schritt — bleibt statisch.

## 3. Design-System

### Farben (Tokens)
- Akzent/CTA: Terrakotta `#c85c3b` (+ dunklere Hover-Stufe `#a84a2e`).
- Text/Kontrast: warmes Braun `#3d2b1f` / `#2a1d15`.
- Flächen: cremeweißer Seitenhintergrund `#f5f2ec`, weiße Karten `#ffffff`.
- Erweiterung: abgestufte Beige-/Braun-Skala (mind. 4 Stufen) für Tiefe statt nur 2–3 Werte.
- Grün nur für WhatsApp-Signal.

### Typografie
- Headlines: **Bricolage Grotesque** (Google Fonts) — modern, charaktervoll, freundlich.
- Body: **Inter**.
- Fallback-Stack mit System-Fonts; `display=swap`.
- Größere, selbstbewusstere Überschriften; klare Hierarchie.

### Form, Tiefe, Motion
- Kartenradius 16–20 px; weiche, gestaffelte Schatten; dezente Rahmen.
- Micro-Interaktionen: sanfte Hover-/Tap-Zustände, weiche Scroll-Reveals.
- `prefers-reduced-motion` wird respektiert (keine Animationen/Transitions).

## 4. Seitenstruktur (Aufbau)

Reihenfolge auf „Vertrauen fassen → anfragen" optimiert:

1. **Header** — schlank, sticky; „Termin anfragen"-CTA + WhatsApp; mobiles Menü.
2. **Hero** — Richtung C: knackige Headline, Sub, zwei CTAs (Termin / WhatsApp), Vertrauenssignal **ohne erfundene Zahl** (qualitativ, z. B. „Empfohlen in der Region · Hamburg & Rosengarten").
3. **Trust-Leiste** — vier Versprechen (transparent, pünktlich, Festpreis, freundlich).
4. **Leistungen** — runde Karten mit Icons (6 Karten inkl. „Nicht dabei?").
5. **Über mich** — Manni als Person; gut gestalteter **Foto-Platzhalter** (sieht bewusst wie Platzhalter aus, nicht wie Fehler), bis echtes Foto geliefert wird.
6. **Warum Manni** — vier Gründe.
7. **Referenzen** — Foto-Galerie (bestehende WebP-Bilder).
8. **Kundenstimmen** — laufendes Testimonial-Band, überarbeitet; Pause bei Hover/Press; Reduced-Motion-fest.
9. **Ablauf** — 3 Schritte zum Termin.
10. **FAQ** — `<details>`-Aufklapp-Fragen.
11. **Kontakt** — neu gestaltetes Formular (Technik unverändert) + WhatsApp/Telefon/E-Mail.
12. **Footer** — **funktionierende** Links zu `impressum.html` und `datenschutz.html`.
13. **Mobile Action-Bar** — feste, gut erreichbare Buttons (Termin/WhatsApp), erscheint kontextabhängig.

### Neue Unterseiten
- `impressum.html` — §5-DDG-Struktur, Platzhalter `[HIER: … eintragen]`.
- `datenschutz.html` — DSGVO-Struktur (Verantwortlicher, Hosting/Vercel, Formular-/WhatsApp-Datenverarbeitung, Rechte der Betroffenen), Platzhalter markiert.
- Beide im neuen Design, mit Zurück-zur-Startseite-Navigation.

## 5. Funktion & Inhalt

- **Bewertung:** qualitatives Vertrauenssignal ohne Zahl (Entscheidung des Nutzers). Sternbadge mit fiktiver „4.9/38"-Angabe wird entfernt.
- **Structured Data:** `LocalBusiness` (bzw. `HomeAndConstructionBusiness`) JSON-LD mit Name, Region, Kontakt, Leistungen; nur reale/neutrale Angaben, keine erfundenen Aggregate-Ratings.
- **robots.txt** + **sitemap.xml** (Start-, Impressum-, Datenschutz-Seite).
- **Meta/OG:** Titel/Description/OG beibehalten und konsistent halten; ggf. `apple-touch-icon`.
- **Formular:** identische Namen/Felder/Netlify-Attribute; nur Optik + Inline-Validierungs-Feedback verbessern. Kein Backend-Wechsel.

## 6. Technischer Aufbau

- Dateien: `index.html`, `impressum.html`, `datenschutz.html`, `css/style.css`, `js/script.js`, `robots.txt`, `sitemap.xml`, bestehende `images/`.
- CSS aufgeräumt und klar in Abschnitte gegliedert (Tokens → Reset → Komponenten → Sektionen → Responsive).
- JS modular gehalten (Nav-Toggle, Scroll-Reveal, Testimonial-Band, Formular, Jahr, Mobile-Bar); defensiv (Feature-Checks), keine Abhängigkeiten.
- Kein Build-Schritt; direkt statisch auf Vercel deploybar.

## 7. Erfolgskriterien

- Neues Erscheinungsbild klar erkennbar Richtung C, Marke gewahrt.
- Alle Sektionen responsiv (Mobil, Tablet, Desktop) ohne horizontales Scrollen.
- Impressum/Datenschutz erreichbar und verlinkt; Platzhalter eindeutig markiert.
- Keine erfundenen Zahlen mehr auf der Seite.
- Accessibility: Skip-Link, ARIA, Fokus-States, Reduced-Motion funktionieren.
- Struktur-Daten valide; robots/sitemap vorhanden.
- Bestehende Formular-Feldnamen unverändert (damit spätere Backend-Anbindung leicht bleibt).

## 8. Offene Punkte / Folgeaufgaben

- Formular-Backend Vercel-tauglich machen (Serverless-Funktion oder Formular-Dienst) — separate Aufgabe.
- Echtes Foto von Manni für „Über mich".
- Reale Geschäftsdaten in Impressum/Datenschutz eintragen.
- Ggf. echte Bewertungen ergänzen, sobald vorhanden.
