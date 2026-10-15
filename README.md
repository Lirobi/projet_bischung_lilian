# CnamSiWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.24.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Système de design (repris de « utilitaires »)

Toute l'interface (`src/`) doit suivre ce style : sobre, clair, marine + bleu roi, cartes blanches
sur fond gris bleuté. Le Front est en HTML/CSS/JS pur : on utilise donc des **variables CSS**
(pas de Tailwind). Ne jamais coder une couleur, un rayon ou une ombre en dur : passer par les tokens.

### Principes

- Fond gris bleuté très clair, **cartes blanches** avec bordure fine et ombre douce.
- Texte **marine**, jamais noir pur. Titres de page en bleu roi.
- Un seul accent : le **bleu roi**. Statuts en **pastel** (vert / jaune / rouge) avec texte foncé.
- Rayons petits à moyens (0,3 – 1 rem), pas de coins très ronds sauf pastilles.
- Animations courtes et discrètes (apparition fondue 0,35 s) ; respecter `prefers-reduced-motion`.
- Mobile d'abord : champs de formulaire en **16 px** (évite le zoom auto d'iOS), cibles tactiles ≥ 40 px.

### Typographie

- Police : **Poppins** (graisses 300, 400, 500, 600, 700), repli `system-ui, -apple-system, sans-serif`.
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
- Titre de page `h1` : bleu roi (`--accent-500`), `letter-spacing: -0.01em`, 600.
- Titre de carte : 1 rem / 600. Texte courant : 0,875 rem (desktop). Texte secondaire : `--foreground-muted`.
  Annotations : 0,75 rem, `--foreground-subtle`.
- Chiffres clés (stats) : 1,5 rem / 600, `letter-spacing: -0.02em`.

### Tokens (à coller dans `src/styles.css`)

```css
:root {
  /* Surfaces */
  --background: #f8f9fb;
  --surface: #ffffff;
  --surface-muted: #f1f3f8;
  --border: #e4e8f0;

  /* Texte (marine) */
  --foreground: #1c2540;
  --foreground-muted: #5b6785;
  --foreground-subtle: #98a1b8;

  /* Accent — bleu roi */
  --accent-50: #eef3fc;
  --accent-100: #dbe6f8;
  --accent-200: #b6cbf0;
  --accent-300: #86a6e4;
  --accent-400: #5581d1;
  --accent-500: #2f5fbf;
  --accent-600: #244ea5;
  --accent-700: #1d4086;
  --accent-contrast: #ffffff;

  /* Statuts — pastel */
  --good-50: #e7f5ec;   --good-200: #b9e4c6;   --good-500: #4caf7d;   --good-600: #3c9268;   --good-text: #2b6b4c;
  --warning-50: #fbf3df; --warning-200: #f0dda0; --warning-500: #d9a838; --warning-600: #b98c26; --warning-text: #8a6a1c;
  --error-50: #fbeae8;  --error-200: #f0c2bc;  --error-500: #d97164;  --error-600: #bd5646;  --error-text: #93372b;

  /* Rayons */
  --radius-sm: 0.3rem;
  --radius-md: 0.45rem;
  --radius-lg: 0.65rem;
  --radius-xl: 1rem;
  --radius-full: 999px;

  /* Ombres */
  --shadow-soft: 0 1px 2px rgba(28, 37, 64, 0.04), 0 4px 14px rgba(28, 37, 64, 0.05);
  --shadow-lift: 0 2px 4px rgba(28, 37, 64, 0.05), 0 12px 28px rgba(28, 37, 64, 0.1);
}

* { box-sizing: border-box; border-color: var(--border); }

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: "Poppins", system-ui, -apple-system, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

::selection { background: var(--accent-200); color: var(--accent-700); }

main h1 { color: var(--accent-500); letter-spacing: -0.01em; font-weight: 600; }

button, a, [role="button"] { touch-action: manipulation; }

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.anim-page-in { animation: fade-in 0.35s ease-out both; }
@media (prefers-reduced-motion: reduce) { .anim-page-in { animation: none; } }
```

### Composants

#### Carte
```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 1.25rem;
}
```
Titre `1rem/600`, description `0.875rem` en `--foreground-muted`.

#### Boutons
Base : `height: 2.5rem; padding: 0 1rem; border-radius: var(--radius-md); font-size: .875rem; font-weight: 500;
display: inline-flex; align-items: center; justify-content: center; gap: .5rem; transition: background-color .15s;`
Désactivé : `opacity: .5; pointer-events: none`. Focus : anneau 2 px `--accent-300` avec décalage 2 px.

| Variante | Fond | Texte | Bordure / survol |
|---|---|---|---|
| primaire | `--accent-500` + `--shadow-soft` | `--accent-contrast` | survol `--accent-600` |
| secondaire | `--surface-muted` | `--foreground` | bordure `--border`, survol `--accent-50` |
| outline | `--surface` | `--foreground` | bordure `--border`, survol `--surface-muted` |
| ghost | transparent | `--foreground-muted` | survol fond `--surface-muted`, texte `--foreground` |
| destructif | `--error-500` | blanc | survol `--error-600` |

Tailles : sm `2rem` (.75rem), md `2.5rem`, lg `3rem` (1rem), icône `2.5rem` carré.

#### Champs de formulaire (input / select / textarea)
```css
.input {
  height: 2.5rem; width: 100%;
  padding: 0 .75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  font: inherit; font-size: 1rem;       /* 0.875rem à partir de 768px */
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.input::placeholder { color: var(--foreground-subtle); }
.input:focus { border-color: var(--accent-400); box-shadow: 0 0 0 2px var(--accent-100); }
textarea.input { min-height: 6rem; padding: .5rem .75rem; height: auto; }
```
Label : `0.875rem / 500`, au-dessus du champ, `gap: .375rem`.

#### Alertes / messages (succès, avertissement, erreur)
Fond `--*-50`, bordure `--*-200`, texte `--*-text`, rayon `--radius-md`, padding `.75rem 1rem`, titre en 500,
corps `0.85rem` à 90 % d'opacité. Remplace les anciens `--danger` / `--success` du projet.

#### Badges
Pastille `--radius-full`, `0.75rem`, fond `--*-50`, texte `--*-text`, bordure `--*-200` (neutre : `--surface-muted` / `--foreground-muted`).

#### Stat (chiffre clé)
Une carte : libellé `0.875rem` muted, valeur `1.5rem / 600`, indice `0.75rem` subtle. Couleur de valeur selon le ton
(`--foreground`, `--good-text`, `--warning-text`, `--error-text`).

#### Tableaux
Dans une carte ; en-tête `--surface-muted`, `0.75rem`, `--foreground-muted`, majuscules facultatives ;
lignes séparées par `1px solid var(--border)` ; survol de ligne `--accent-50`.

#### Modale
Fond voilé `rgba(28, 37, 64, .4)`, panneau `--surface`, rayon `--radius-xl`, ombre `--shadow-lift`,
entrée en « pop » (`scale(.94)` → 1, 0,5 s `cubic-bezier(.22, 1, .36, 1)`).

#### Chargement
Squelette : dégradé `100deg, var(--surface-muted) 30%, #fff 50%, var(--surface-muted) 70%`,
`background-size: 200% 100%`, animation shimmer 1,4 s.

### Mise en page

- Conteneur centré, largeur max ~ 960–1100 px, marges 1 rem (mobile) → 2 rem (desktop).
- Espacement sur une échelle de 0,25 rem ; entre cartes `1rem`, dans une carte `1.25rem`.
- Barres de défilement fines et discrètes (`scrollbar-width: thin`, visibles au survol seulement).
- Icônes : style trait (Lucide), 16–20 px, couleur `--foreground-subtle` ou `--foreground-muted`.

### Règles pour Claude

1. Lire ce fichier avant toute modification de `src/`.
2. Remplacer progressivement les anciennes variables (`--bg`, `--card`, `--primary`, `--text`, `--muted`,
   `--danger`, `--success`) et la police Arial par les tokens ci-dessus ; ne pas mélanger les deux systèmes.
3. Pas de dégradé de fond ni de couleur vive hors palette ; l'accent reste le bleu roi.
4. Garder des champs à 16 px sur mobile et un contraste texte/fond suffisant.
5. Source de référence : `utilitaires/src/app/globals.css` et `utilitaires/src/components/ui/`.
