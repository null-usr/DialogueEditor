# Dialogue Editor

Relational JSON editor geared towards game dialogue editing built using [React](https://reactjs.org/), [ReactFlow](https://reactflow.dev/) and [Electron](https://www.electronjs.org/).

# Why?
I've used a handful of dialogue editors in the past and I've found that they tend to be either too rigid in their structured output or not structured much at all. I wanted to create a tool independent of any specific game engine where I could quickly define and save my own nodes to suit whatever project I'm working on.
I chose to use React because that just happened to be what I use for work so I've become very familiar with it.
Maybe if performance isn't up to snuff I'll write it in something else, but until then, this will do.
# Project Structure

```
├── dist
├── docs
    └── specs.md
├── electron
    ├── main.ts
    ├── preload.ts
    └── tsconfig.json
├── index.html
├── package.json
├── package-lock.json
├── public
    ├── builtin.json
    ├── custom.json
    ├── favicon.ico
    ├── logo192.png
    ├── logo512.png
    ├── manifest.json
    ├── robots.txt
    └── theme.json
├── README.md
├── src
    ├── App.css
    ├── App.tsx
    ├── assets
    ├── components
    ├── contexts
    ├── helpers
    ├── index.css
    ├── index.tsx
    ├── page
    ├── reportWebVitals.ts
    ├── setupTests.ts
    ├── store
    └── tests
├── tsconfig.json
├── vite.config.ts
└── vite-env.d.ts
```

## public
Contains the built in nodes and any custom nodes the user might save as well as the app's color palette.
## Build & Run

### Development
```
yarn build:electron
yarn start
yarn electronmon ./dist/electronmon/main.js
```
yarn electron:start SHOULD start both the local and electronmon but electronmon doesn't seem like it wants to start so you have to run it manually

