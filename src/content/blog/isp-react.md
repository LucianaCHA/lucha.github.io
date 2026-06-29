---
lang: 'en'
postSlug: 'isp-react'
title: 'Interfaces Segregation Principle in React'
description: 'When interfaces do too much'
pubDate: '2026-06-30'
# updatedDate: '2026-06-26'
heroImage: '../../assets/isp.png'
heroImageCaption: 'Imagen de portada creada con IA'
---

# Interface Segregation Principle in React

<br/>

## Introduction

The Interface Segregation Principle (ISP) states that no consumer should depend on methods, props, or behaviors that it doesn't use.

In React, this typically translates to small, explicit, and easy-to-understand APIs. Components and hooks should only expose what each use case needs, avoiding becoming solutions for every possible scenario.

Applying ISP doesn't mean having fewer props, but rather interfaces that represent a single responsibility and a single mental model.

## Core idea

There's a question I find useful when designing (and especially maintaining) components:

> **Is this a flexible interface, or a combination of multiple interfaces disguised as flexibility?**

Often, a component starts by solving a single problem:

- a clear responsibility
- few props
- predictable behavior

But over time, new requirements arise, and the abstraction itself begins to grow.

Options, callbacks, and flags are added to support more use cases.

The API appears flexible.

However, each consumer ends up using a different subset of functionalities.

The problem isn't the number of props.

The problem arises when they don't all represent the same contract.

In other words:

> **It's not a flexible interface; it's several interfaces mixed together.**

## Practical example

A common use case is that of a component thT attemps to handle too many different scenarios.

Example:

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

The simplest consumer might look like this:

```jsx
<ContentEditor value={text} onChange={setText} />
```

Other use cases may require much more functionality:

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

As more use cases emerge, the interface grows and consumers begin to rely on props they don’t actually need.

There are even props whose sole purpose is to disable certain behaviours:

```jsx
<ContentEditor enableAutosave={false} enableAttachments={false} />
```

## It's not just about the number of props

The real signal is that different consumers rely on incompatible subsets of the same API.

Some alternatives that can help avoid this situation include:

```jsx
<BasicEditor {...props} />

<EditorWithEmojis {...props} />

<EditorWithAttachments {...props} />
```

Or promote a more explicit composition:

```jsx
<Editor>
  <EditorInput {...inputProps} />

  {showEmojis && <EmojiPicker {...emojiProps} />}

  {showAttachments && <AttachmentUploader {...attachmentProps} />}
</Editor>
```

When behaviour is no longer implicit and becomes visible in the JSX, the contract usually becomes easier to understand.

## Closing thoughts

In React, ISP is less about the number of props and more about the clarity of interfaces.

A good API does not force consumers to be aware of features they will never use.

The goal is not to make components small for the sake of it, but to design interfaces that accurately reflect what those components do.

Some questions that can serve as a guide:

- Does this component have a single interface, or several mixed together?
- How many props does each consumer actually use?
- Am I passing props just to disable certain behaviours?
- Does the JSX clearly reflect what the component does?
- Does this API simplify the mental model or make it more complex?
