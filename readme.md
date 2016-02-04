# Hapi Everything

A Hapi server with multiple frontends.

## Why?

To compare frontend libraries and frameworks.

## Aims

### Modular 

It's easy to create a Hapi server with basic routes, better still is to pull functionality into modules, both Hapi modules (route logic and orchestration) and business modules (CRUD and business rules for domain objects).

### Frontends

Create the same application in multiple libaries/frameworks to compare them.

### Modern

I'll aim to use modern techniques as much as possible.

Transpiling? Not sure yet. It would mean ES7 features!

### Code style

- No semi-colons
- Lambdas
- Functional (Or at least some facets of functional programming)
- ES2015 as much as possible (or as much as Node and the latest browsers will support)
- Favour `const` over `let` and more so over `var`
- Tabs over spaces!
- Comment liberally - Why? - Because this is a learning experience and the more explanations alongside the code the better - Maybe
- Code that acts as its own comment: http://blog.codinghorror.com/coding-without-comments/ - Namely descriptive names for functions and variables

### Incremental

Work on this for at least 30 minutes a day. No excuses!

Starting on Wednesday 3rd of February:

- Day 1 - Project set-up: git, npm, readme - Server set-up: Hapi, routes, documentation
- Day 2 - Start on CRUD with Mongo
