# LES PÂTES GRAPHIQUES

Un site statique hommage aux interfaces occultes façon CCC / Dark Triad, avec une touche d’humour high-tech autour du culte des cartes graphiques et des pâtes.

## Structure
```
/
├─ index.html
└─ assets/
   ├─ css/styles.css
   ├─ js/
   │  ├─ app.js
   │  └─ glyphs.js
   ├─ data/glyphs.json
   ├─ media/
   │  ├─ pasta1.mp4
   │  ├─ pasta2.mp4
   │  ├─ pasta-fallback.jpg
   │  └─ logo-fork.png
   └─ fonts/ (optionnel)
```

## Mise en route
1. Ajoutez vos médias (vidéos, image de fallback, logo) dans `assets/media/` en respectant les noms de fichiers ci-dessus.
2. Ouvrez simplement `index.html` dans votre navigateur : aucun build, aucune dépendance externe.
3. Les glyphes de navigation se configurent dans `assets/data/glyphs.json`.
4. Pour modifier la vitesse d’animation :
   - `GLYPH_RATE_MS` contrôle la rotation des symboles.
   - `REVEAL_RATE_MS` définit la vitesse de décryptage.
   - `RETURN_DELAY_MS` règle le délai avant retour aux glyphes.
5. Le site est prêt pour un hébergement statique (GitHub Pages, Netlify, etc.).

## Accessibilité & préférences
- Respect du media query `prefers-reduced-motion` (les vidéos sont mises en pause et la navigation reste instantanée).
- Navigation clavier : le titre principal est focusable et permet de changer la vidéo d’arrière-plan.

Bon rituel et bonne cuisson graphique !
