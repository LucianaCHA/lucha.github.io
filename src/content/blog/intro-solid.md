---
lang: 'en'
postSlug: 'intro-solid'
title: 'SOLID in React: more than rules, design criteria'
description: 'First post of the SOLID principles series applied to ReactJS'
pubDate: '2026-04-06'
# updatedDate: '2026-04-06'
heroImage: '../../assets/solid-cover.png'
heroImageCaption: 'Cover image created with AI'
---

# SOLID in React: more than rules, design criteria

For a long time, I heard about SOLID as if it was some kind of technical checklist: principles you had to “follow” to write better code. But in real work, especially in frontend, the problem rarely appears as a textbook definition.

It appears when a component grows too much, when a small change breaks three unexpected things, or when opening a certain file already creates a small feeling of danger.

That was when I started to understand that SOLID was not really a rule of object-oriented programming, but a way to think about design decisions when we write code.

In modern React — where we work more with functions, hooks, composition and implicit contracts than with classical inheritance — these principles are still very useful, but not as a recipe, more as a criterion.

Because in the end, SOLID does not belong to one language or one framework. It is not exclusive to classes, Java or academic patterns. They are software design principles: ways to think about how we build code that can grow, change and be maintained over time.

It does not matter if we work with React, Node, Python or any other technology. The important questions are usually the same:

- Where should this responsibility live?
- How coupled is this code?
- How expensive will it be to change this tomorrow?

It is not always about something being “wrong”, but about noticing when it starts becoming fragile.

## What started to feel wrong

A big part of this came from reviewing code in daily work.

Components that started simple and ended managing UI, validations, business logic and service calls in the same file. Props that grew until they became small APIs impossible to maintain. Conditionals that looked fine, until we had to add one more.

At first, none of this looked serious. Actually, most of the time it was the fastest and most reasonable solution in that moment.

The problem came later: when changing something simple started to cost too much.

That was when I started to see SOLID less as theory and more as a way to detect those signals earlier.

## React does not need classes to have good design

Many explanations of SOLID are still based on classes, inheritance and objects.

But in React, problems usually appear in a different way:

- components that do too much
- hooks that mix UI with infrastructure
- props that mean different things depending on context
- conditionals that scale badly
- abstractions that promise reusability but create confusion

We are not discussing syntax, but design.

Separating responsibilities, keeping clear contracts or reducing coupling is still just as important, even if we do it with functions, hooks and composition.

Because the problem was never if we use classes or functions. The problem starts when the code stops being easy to understand, extend or maintain.

## This series is not about recipes

I am not interested in showing “the correct way” to apply SOLID in React, because there is almost never only one correct way.

I am more interested in using these principles as design questions:

- Does this really need to be extended this way?
- Am I reusing behavior or only code?
- Does this component know too much?
- Is this abstraction simplifying things or making them harder?

In the next posts, I will go through each principle with real examples (adapted), closer to work situations than academic examples.

We are going to talk about:

- SRP → when a component does too much
- OCP → when `if` statements start breaking the design
- LSP → when reusing breaks the expected behavior
- ISP → when an interface has too many props
- DIP → when UI depends too much on infrastructure

## Designing better before refactoring more

With time, one of the things I valued the most was not learning new patterns, but developing criteria to know when something needs to change and when it does not.

It is not always about refactoring more, but about understanding better and accepting that in every decision we necessarily give something up.

Sometimes I prefer some coupling if that improves readability, cohesion or code clarity. In other cases, the priority will be isolating responsibilities or making future extension easier.

The important thing is not chasing a perfect solution, but making conscious decisions: understanding what we are giving up, why we do it and how that can affect the system later.

For me, SOLID ended up being exactly that: a way to think about the cost of change before the problem explodes.

Not as rigid rules or textbook theory, but as programming principles that stay valid no matter the stack.

Because in the end, writing good software does not depend on the framework we use, but on the decisions we make while building it.

And if you ever opened a 500-line file thinking “this clearly should be better”, you were probably already close to starting this conversation.