---
lang: 'es'
postSlug: 'isp-react'
title: 'Principio de Segregación de Interfaces en React'
description: 'Cuando una interfaz intenta hacer demasiado'
pubDate: '2026-06-30'

# updatedDate: '2026-06-30'

heroImage: '../../assets/isp.png'
heroImageCaption: 'Imagen de portada creada con IA'
---

---

# Principio de Segregación de Interfaces en React

## Introducción

El Principio de Segregación de Interfaces (ISP) establece que ningún consumidor debería depender de métodos, props o comportamientos que no utiliza.

En React, esto suele traducirse en APIs pequeñas, explícitas y fáciles de entender. Componentes y hooks deberían exponer únicamente lo que cada caso de uso necesita, evitando convertirse en soluciones para todos los escenarios posibles.

Aplicar ISP no significa tener menos props, sino interfaces que representen una única responsabilidad y un único modelo mental.

## Idea principal

Hay una pregunta que me parece útil al diseñar ( y sobre todo al mantener) componentes:

> **Estoy creando una interfaz flexible o estoy mezclando varias interfaces para simular flexibilidad?**

Muchas veces un componente empieza resolviendo un único problema:

- una responsabilidad clara
- pocas props
- un comportamiento predecible

Pero con el tiempo aparecen nuevas necesidades y la misma abstracción empieza a crecer.

Se agregan opciones, callbacks y flags para soportar más casos de uso.

La API parece flexible.

Sin embargo, cada consumidor termina utilizando un subconjunto distinto de funcionalidades.

El problema no es la cantidad de props.

El problema aparece cuando no todas representan el mismo contrato.

En otras palabras:

> **No es una interfaz flexible; son varias interfaces mezcladas.**

## Ejemplo práctico

Un caso común es el de un componente que intenta resolver demasiados escenarios distintos.

Por ejemplo:

```tsx
interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;

  enableEmojis?: boolean;
  onEmojiSelect?: (emoji: string) => void;

  enableAttachments?: boolean;
  onAttachmentUpload?: (file: File) => void;

  enableAutosave?: boolean;
  onAutosave?: () => void;

  maxLength?: number;
  errorMessage?: string;
}
```

Un consumidor simple podría usarlo así:

```jsx
<ContentEditor value={text} onChange={setText} />
```

Mientras que otro necesita muchos más atributos:

```jsx
<ContentEditor
  value={text}
  onChange={setText}
  enableEmojis
  onEmojiSelect={handleEmoji}
  enableAttachments
  onAttachmentUpload={uploadFile}
  enableAutosave
  onAutosave={saveDraft}
/>
```

A medida que aparecen más casos de uso, la interfaz crece y los consumidores empiezan a depender de props que no necesitan.

Incluso aparecen props cuyo único propósito es desactivar comportamientos:

```jsx
<ContentEditor enableAutosave={false} enableAttachments={false} />
```

## El tema no es la cantidad de props.

La señal es que distintos consumidores utilizan subconjuntos incompatibles de la misma API.

Algunas alternativas pueden ser:

```jsx
<BasicEditor {...props} />

<EditorWithEmojis {...props} />

<EditorWithAttachments {...props} />
```

o favorecer una composición más explícita:

```jsx
<Editor>
  <EditorInput {...inputProps} />

  {showEmojis && <EmojiPicker {...emojiProps} />}

  {showAttachments && <AttachmentUploader {...attachmentProps} />}
</Editor>
```

Cuando el comportamiento deja de ser implícito y pasa a ser visible en el JSX, el contrato suele volverse más fácil de entender.

## Cierre

En React, ISP tiene menos que ver con la cantidad de props y más con la claridad de las interfaces.

Una buena API no obliga a los consumidores a conocer funcionalidades que nunca van a utilizar.

El objetivo no es tener componentes pequeños por definición, sino componentes cuya interfaz represente fielmente lo que hacen.

Algunas preguntas que pueden servir como guía:

- Este componente tiene una interfaz o varias mezcladas?
- Cuántas props utiliza realmente cada consumidor?
- Estoy pasando props solo para desactivar comportamientos?
- El JSX refleja claramente lo que el componente hace?
- Esta API simplifica el modelo mental o lo vuelve más complejo?
