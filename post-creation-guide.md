# Guia para crear posts (EN/ES)

Este documento resume el flujo recomendado para publicar posts en este proyecto Astro con soporte en ingles y espanol.

## 1. Donde van los posts

- Carpeta de contenido: `src/content/blog/`
- Formatos permitidos: `.md` y `.mdx`
- Coleccion: `blog` (definida en `src/content.config.ts`)

## 2. Estructura minima de un post

Cada post debe incluir frontmatter con estos campos:

```yaml
---
lang: 'en' # o 'es'
postSlug: 'mi-tema'
title: 'Titulo del post'
description: 'Resumen corto del contenido'
pubDate: '2026-04-27'
# updatedDate: '2026-04-28' # opcional
heroImage: '../../assets/mi-imagen.png' # opcional
heroImageCaption: 'Texto de apoyo de imagen' # opcional
---
```

Reglas importantes:

- `lang`: solo `en` o `es`.
- `postSlug`: kebab-case (`mi-tema`, `intro-solid`, etc.).
- `pubDate` y `updatedDate`: fechas validas.

## 3. Convencion EN/ES

Para cada tema, crear dos entradas con el mismo `postSlug`:

- Version EN: `lang: 'en'`
- Version ES: `lang: 'es'`

Ejemplo recomendado:

- `intro-solid.md` con `lang: 'en'`
- `intro-solid-es.md` con `lang: 'es'`

Nota:

- El nombre del archivo puede variar; lo que define la URL estable es `postSlug` + `lang`.
- Mantener paridad de secciones entre idiomas para facilitar mantenimiento.

## 4. Como se generan las rutas

Las rutas del detalle se construyen con este formato:

- `/blog/{postSlug}/{lang}/`

Ejemplos:

- `/blog/intro-solid/en/`
- `/blog/intro-solid/es/`

Rutas de listado:

- Global: `/blog/`
- Por idioma: `/blog/en/` y `/blog/es/`

## 5. Plantillas del generador

La estructura base de cada post vive en archivos separados para que puedas ajustar el cuerpo sin tocar el script:

- Plantilla EN: `scripts/templates/blog-post.en.md`
- Plantilla ES: `scripts/templates/blog-post.es.md`

El script reemplaza automaticamente los tokens base:

- `__LANG__`
- `__SLUG__`
- `__TITLE__`
- `__DESCRIPTION__`
- `__PUB_DATE__`
- `__UPDATED_DATE__`
- `__ASSET__`
- `__HERO_CAPTION__`

## 6. Flujo recomendado de publicacion

1. Crear primero la version EN.
2. Duplicar estructura para ES con el mismo `postSlug`.
3. Traducir manteniendo titulos y jerarquia de secciones.
4. Revisar enlaces internos en ambos idiomas.
5. Validar build local.

## 7. Checklist rapido antes de publicar

- Existe version EN y ES del mismo tema.
- Ambas usan el mismo `postSlug`.
- El `lang` es correcto en cada archivo.
- El frontmatter cumple el schema.
- La imagen de portada existe y compila bien.
- El post aparece en `/blog/` y en `/blog/{lang}/`.
- El detalle abre en `/blog/{postSlug}/{lang}/`.

## 8. Comandos utiles

Instalar dependencias (si hace falta):

```bash
npm install
```

Validar build:

```bash
npm run build
```

Levantar entorno local:

```bash
npm run dev
```

Generar un nuevo par EN/ES de posts:

```bash
npm run post:new -- \
	--slug demo-solid \
	--title-en "SOLID in React" \
	--title-es "SOLID en React" \
	--description-en "Introduction to SOLID for React" \
	--description-es "Introduccion a SOLID para React" \
	--asset solid-cover.png
```

Alias equivalente del comando:

```bash
npm run post:new-blog-post -- \
	--slug demo-solid \
	--title-en "SOLID in React" \
	--title-es "SOLID en React" \
	--description-en "Introduction to SOLID for React" \
	--description-es "Introduccion a SOLID para React" \
	--asset solid-cover.png
```

Generar solo la base minima desde template (sin imagen obligatoria):

```bash
npm run post:new -- --base --slug nuevo-tema
```

Modo prueba para base minima (no escribe archivos):

```bash
npm run post:new -- --dry-run --base --slug nuevo-tema
```

Modo prueba sin escribir archivos:

```bash
npm run post:new -- --dry-run --slug demo-solid --title-en "SOLID in React" --title-es "SOLID en React" --description-en "Introduction to SOLID for React" --description-es "Introduccion a SOLID para React" --asset solid-cover.png
```

Notas:

- `--slug` define el `postSlug` compartido por EN y ES.
- `--asset` debe existir dentro de `src/assets/` cuando no se usa `--base`.
- En `--base`, el script crea placeholders en titulo/descripcion y omite `heroImage` y `heroImageCaption` para que puedas completar despues.
- El script crea dos archivos: `${slug}.md` y `${slug}-es.md`.
- Si un archivo ya existe, el script no lo sobreescribe.

## 9. Errores comunes

1. Slug invalido:
Solucion: usar kebab-case en `postSlug`.

2. Idioma invalido:
Solucion: usar solo `en` o `es`.

3. Problemas con imagen en portada:
Solucion: verificar ruta real del archivo en `src/assets/` o usar URL remota valida.

4. Quiero crear borrador base sin imagen y me pide `--asset`:
Solucion: ejecutar con `--base` (o `--base-only`).

5. Se rompio paridad EN/ES:
Solucion: alinear headings y estructura de secciones entre ambos archivos.
