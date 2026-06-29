---
lang: 'es'
postSlug: 'lsp-react'
title: 'Principio de Sustitución de Liskov en React'
description: 'Cuando la abstracción ya no es consistente'
pubDate: '2026-06-09'
# updatedDate: '2026-05-28'
heroImage: '../../assets/lsp.png'
heroImageCaption: 'Imagen de portada creada con IA'
---

# Principio de Sustitución de Liskov en React

## Introducción

El Principio de Sustitución de Liskov (LSP) establece que una abstracción solo es válida si todas sus implementaciones pueden utilizarse de forma intercambiable sin alterar el comportamiento esperado del sistema.

Aunque este principio suele explicarse desde la herencia y la programación orientada a objetos, en React aparece de otra forma: a través de contratos implícitos.

Los componentes y hooks no se sustituyen mediante jerarquías de clases, sino mediante APIs compartidas que prometen cierto comportamiento.

Aplicar LSP en React implica diseñar componentes cuyas props, efectos y responsabilidades sean predecibles y consistentes, independientemente de su implementación interna.

## LSP como criterio de diseño en React

Un componente empieza a violar LSP cuando:

- su API no puede cumplir consistentemente el mismo contrato
- las props cambian de significado según el contexto
- el comportamiento depende de supuestos implícitos
- el efecto observable cambia aunque la API externa sea la misma

La pregunta importante no es:

     “¿Este componente reutiliza código?”

sino:

    “¿Dos instancias de este componente
    pueden sustituirse sin cambiar el
    comportamiento observable del sistema?”

---

## Ejemplo práctico

Una señal frecuente aparece cuando una misma abstracción empieza a representar múltiples comportamientos de dominio.

Por ejemplo:

```jsx
const ActionButton = ({ type, entity, onAction }) => {
  if (type === 'like') {
    return <LikeButton entity={entity} onAction={onAction} />;
  }

  if (type === 'bookmark') {
    return <BookmarkButton entity={entity} onAction={onAction} />;
  }

  return <ShareButton entity={entity} onAction={onAction} />;
};
```

Al principio, la abstracción nos hace felices porque la estructura visual es similar.

Pero con el tiempo empiezan a aparecer variaciones:

- distintas validaciones
- distintos efectos secundarios
- diferentes actualizaciones de estado
- distintos significados de negocio detrás de la misma interacción

La API externa puede seguir pareciendo uniforme, pero el contrato ya no es estable.

## Dónde empieza a romperse la sustitución

1. La misma API produce significados distintos

Dos componentes pueden exponer exactamente las mismas props mientras internamente disparan efectos completamente distintos.

Leemos:

```
<ActionButton type="like" />
<ActionButton type="share" />
```

Ambos parecen representar la misma abstracción.

Pero si cada variante modifica reglas de negocio, flujos de estado, analytics o comportamientos distintos, la sustitución deja de ser segura.

**El problema no son las distintas implementaciones. Son los distintos contratos escondidos detrás de la misma API.**

2. La abstracción necesita conocer detalles concretos

Otra señal aparece cuando un componente no puede comportarse correctamente sin verificar tipos específicos o condiciones internas.

Por ejemplo:

```jsx
if (entity.type === "blogPost") {
  ...
}

if (entity.type === "commentOnPost") {
  ...
}

```

o el uso frecuente de type assertions:

```js
entity as BlogPost
entity as Comment
```

Cuando una abstracción necesita conocer detalles concretos para decidir cómo comportarse, la propia abstracción empieza a volverse inestable.

## El problema no es la reutilización

Reutilizar infraestructura o detalles de implementación no necesariamente está mal. De hecho, muchas veces es deseable.

El problema aparece cuando, por reutilizar y tratar de escalar forzadamente una misma abstracción promete un comportamiento compartido que no puede garantizar consistentemente.

En ese punto:

- el modelo mental se vuelve implícito
- el comportamiento depende demasiado del contexto
- quien consume el componente necesita conocer detalles internos para usarlo correctamente

Una buena abstracción debería reducir carga cognitiva, no aumentarla. O en palabras simples, si la lectura del componente te deja con más dudas que certezas, la API puede no estar bien.

## Señales prácticas de violaciones de LSP en React

Algunas señales frecuentes:

- props cuyo significado cambia según el contexto
- condicionales creciendo dentro de componentes “genéricos”
- uso frecuente de type assertions
- componentes que obligan a leer la implementación para entender cómo se comportan
- APIs que parecen uniformes pero generan efectos inconsistentes

## Cierre

En React, LSP tiene menos que ver con herencia y más con consistencia.

Las buenas abstracciones no solo son reutilizables.

También son predecibles.

Diseñar componentes con contratos estables permite que el sistema evolucione sin obligar a quien lo usa a entender excepciones internas o comportamientos ocultos.

A veces el problema no es que un componente se volvió demasiado genérico.

El problema es que la abstracción dejó de representar una única idea clara.

## Preguntas guía

- ¿Dos instancias de este componente pueden sustituirse de forma segura?
- ¿Las props mantienen el mismo significado en todos los contextos?
- ¿El nombre del componente describe correctamente el efecto que produce?
- ¿Estoy compartiendo infraestructura o compartiendo un contrato?
- ¿Esta abstracción simplifica el modelo mental o lo vuelve más implícito?
