# Color Variables

Quick reference for project and Nmorph color-related CSS variables.

## Nmorph Theme Variables

These are generated from the Nmorph theme color schema.

```scss
--nmorph-main-color
--nmorph-dark-shade-color
--nmorph-light-shade-color

--nmorph-text-color
--nmorph-focus-text-color
--nmorph-placeholder-text-color
--nmorph-semi-contrast-text-color
--nmorph-contrast-text-color

--nmorph-accent-color
--nmorph-info-color
--nmorph-info-text-color
--nmorph-success-color
--nmorph-success-text-color
--nmorph-error-color
--nmorph-error-text-color
--nmorph-warn-color
--nmorph-warn-text-color

--nmorph-gray-color
--nmorph-scroll-thumb-color
--nmorph-white-color
--nmorph-black-color
--nmorph-overlay-color
```

## Current Theme Values

From `client/src/entities/setting/config/appearance.constants.ts`.

### Dark

```scss
--nmorph-main-color: #1c1f21;
--nmorph-dark-shade-color: #0f1112;
--nmorph-light-shade-color: #292d30;
--nmorph-text-color: #778288;
--nmorph-scroll-thumb-color: #778288;
--nmorph-accent-color: #006cb6;
--nmorph-focus-text-color: #ffffff;
--nmorph-placeholder-text-color: #575757;
--nmorph-semi-contrast-text-color: #9caab0;
--nmorph-contrast-text-color: #c3cdd1;
--nmorph-gray-color: #c8d0dc;
```

### Light

```scss
--nmorph-main-color: #e9ecec;
--nmorph-dark-shade-color: #c8c9ca;
--nmorph-light-shade-color: #fdfdfd;
--nmorph-text-color: #687b9e;
--nmorph-scroll-thumb-color: #687b9e;
--nmorph-accent-color: #4a90e2;
--nmorph-focus-text-color: #ffffff;
--nmorph-placeholder-text-color: #c1c9cf;
--nmorph-semi-contrast-text-color: #8a9dc0;
--nmorph-contrast-text-color: #b4c4de;
--nmorph-gray-color: #656565;
```

### Custom

```scss
--nmorph-main-color: #1c1c1c;
--nmorph-dark-shade-color: #0e0e0e;
--nmorph-light-shade-color: #2a2a2a;
--nmorph-text-color: #9eabbc;
--nmorph-scroll-thumb-color: #9eabbc;
--nmorph-accent-color: #418fde;
--nmorph-focus-text-color: #f4f7fb;
--nmorph-placeholder-text-color: #c8d0dc;
--nmorph-semi-contrast-text-color: #c8d0dc;
--nmorph-contrast-text-color: #f4f7fb;
--nmorph-gray-color: #c8d0dc;
```

### Shared Theme Colors

```scss
--nmorph-info-color: #d4e5edbb;
--nmorph-info-text-color: #506c80;
--nmorph-success-color: #67C23A;
--nmorph-success-text-color: #0b5b1d;
--nmorph-error-color: #F56C6C;
--nmorph-error-text-color: #8d3333;
--nmorph-warn-color: #E6A21C;
--nmorph-warn-text-color: #7a6712;
--nmorph-white-color: #ffffff;
--nmorph-black-color: #000000;
--nmorph-overlay-color: #00000095;
```

## Nmorph Component Color Overrides

These are color-related variables used by specific Nmorph components.

```scss
--nmorph-button-color
--nmorph-button-hover-color
--nmorph-icon-color
--nmorph-badge-color
--nmorph-progress-color
--nmorph-context-menu-item-color
```

## Project Variables

These are referenced in project styles. They are project-level aliases/usages, not part of the Nmorph theme schema.

```scss
--app-content-background
--app-content-border-color
--app-muted-background
```

## AppText / AppHeader Color Props

Useful prop names for shared text/header components.

```ts
'text'
'semi-contrast-text'
'contrast-text'
'accent'
'warn'
'error-text' // AppText only
```

## Handy Message Body Picks

```scss
color: var(--nmorph-text-color);
color: var(--nmorph-semi-contrast-text-color);
color: var(--nmorph-contrast-text-color);
color: var(--nmorph-accent-color);

border-color: var(--nmorph-text-color);
border-color: var(--nmorph-accent-color);

background: var(--nmorph-main-color);
background: color-mix(in srgb, var(--nmorph-accent-color), var(--nmorph-main-color) 86%);
background: color-mix(in srgb, var(--nmorph-text-color), transparent 88%);
```
