# MansionForge

Éditeur 2D SVG offline-first pour créer des maps de bâtiments JDR.

## Structure

- `index.html` : shell UI (toolbar, canvas, sidebar)
- `src/css/styles.css` : styles
- `src/js/constants.js` : constantes métier (types, bibliothèque meubles, layouts auto-meublage)
- `src/js/main.js` : moteur applicatif (state, tools, rendu SVG, interactions, historique, import/export)

## Exécution

- Ouvrir `index.html` dans le navigateur (aucun backend requis).
- Optionnel: servir en local (`python -m http.server`) pour un workflow dev plus confortable.

## Fonctionnalités livrées

- Outils: sélection, node, vecteur, zone, meuble, suppression
- Layers/groupes récursifs, layer actif, visibilité
- Snap/libre, grille réglable
- Intersections strictes des vecteurs + subdivision automatique
- Zones `rect/ellipse/polygon` via ancres `nodeRef` / `gridPoint`
- Auto-meublage par type de pièce
- Undo/Redo (100 états)
- Sauvegarde/chargement `.bmap`
- Export SVG (layers visibles, bounding box + marge)
