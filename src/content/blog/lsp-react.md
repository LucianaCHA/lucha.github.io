---
lang: 'en'
postSlug: 'lsp-react'
title: 'Liskov Substitution Principle in React'
description: 'When abstractions stop behaving consistentlyt'
pubDate: '2026-06-09'
# updatedDate: '2026-05-28'
heroImage: '../../assets/lsp.png'
heroImageCaption: 'Cover image generated with AI'
---

# Liskov Substitution Principle in React

## Introduction

The Liskov Substitution Principle (LSP) states that an abstraction is only valid if all of its implementations can be used interchangeably without altering the expected behavior of the system.

Although this principle is often explained in terms of inheritance and object-oriented programming, in React it appears in a different form: through implicit contracts.

Components and hooks are not substituted via class hierarchies, but through shared APIs that promise certain behavior.

Applying LSP in React means designing components whose props, effects, and responsibilities are predictable and consistent, regardless of their internal implementation.

## LSP as a design criterion in React

A component starts to violate LSP when:

- its API cannot consistently fulfill the same contract
- props change meaning depending on context
- behavior relies on implicit assumptions
- the observable effect changes even though the external API remains the same

The important question is not:

"Does this component reuse code?"

but:

"Can two instances of this component be substituted without changing the observable behavior of the system?"

---
## Practical Example

A common warning sign appears when the same abstraction starts representing multiple domain behaviors.

For example:

```jsx
const ActionButton = ({ type, entity, onAction }) => {
  if (type === "like") {
    return <LikeButton entity={entity} onAction={onAction} />;
  }

  if (type === "bookmark") {
    return <BookmarkButton entity={entity} onAction={onAction} />;
  }

  return <ShareButton entity={entity} onAction={onAction} />;
};
```

At first, the abstraction makes us feel hapiness because the visual structure looks similar.

But over time, variations start to appear:

- different validation rules
- different side effects
- different state update mechanisms
- different business meanings behind the same interaction

The external API may still appear uniform, but the contract is no longer stable.

## Where Substitutability starts to break

### 1. The same API produces different meanings

Two components may expose exactly the same props while internally trigger completely different effects.

We read:

```
<ActionButton type="like" />
<ActionButton type="share" />
```
Both appear to represent the same abstraction.

But if each variant modifies different business rules, state flows, analytics events, or behaviors, substitution is no longer safe.

**The problem is not having different implementations. The problem is having different contracts hidden behind the same API.**

### 2. The abstraction needs to know concrete details

Another warning sign appears when a component cannot behave correctly without checking for specific types or internal conditions.

For example:


```jsx
if (entity.type === "blogPost") {
  ...
}

if (entity.type === "commentOnPost") {
  ...
}

```

or the frequent use of type assertions:

```js
entity as BlogPost
entity as Comment
```

When an abstraction needs to know concrete details in order to decide how to behave, the abstraction itself starts to become unstable.

## The problem isn't  about reuse

Reusing infrastructure or implementation details is not necessarily a bad thing. In fact, it is often desirable.

The problem arises when, in an attempt to maximize reuse and force a single abstraction to scale across different use cases, that abstraction promises a shared behavior it can no longer guarantee consistently.

At that point:

- the mental model becomes implicit
- behavior becomes overly dependent on context
- consumers of the component need to understand internal details in order to use it correctly

A good abstraction should reduce cognitive load, not increase it. Put simply, if reading a component leaves you with more questions than answers, its API may not be serving its purpose.

## Practical signs of LSP violations in React

Some common warning signs include:

- props whose meaning changes depending on the context
- conditionals continuously growing inside supposedly "generic" components
- frequent use of type assertions
- components that require reading the implementation to understand their behavior
- APIs that appear uniform but produce inconsistent effects

## Conclusion

In React, the Liskov Substitution Principle is less about inheritance and more about consistency.

Good abstractions are not only reusable.

They are also predictable.

Designing components around stable contracts allows a system to evolve without forcing consumers to understand internal exceptions or hidden behaviors.

Sometimes the problem is not that a component has become too generic.

The problem is that the abstraction no longer represents a single, clear idea.

## Guiding questions

- Can two instances of this component be safely substituted for one another?
- Do the props maintain the same meaning across all contexts?
- Does the component's name accurately describe the effect it produces?
- Am I sharing infrastructure, or am I sharing a contract?
- Does this abstraction simplify the mental model, or does it make it more implicit?
