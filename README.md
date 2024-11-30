## Contact Control Model

:white_check_mark: pixi `version 8` \
:white_check_mark: vanilla typescript \
:white_check_mark: for game development

### Folder Structure

```sh
\public # for static content
\src    # source code
    \api        # for external api
    \app        # app bootstrap
    \entities   # logical entities (user, admin, ...)
    \plugins    # used plugins (store, pixi, axios, ...)
        \engine     # pixi.js classes
        \storage    # game internal storage
        \web        # browser api
    \shared     # shared libs (configs, global constants, utils, ...)
        \configs
            manifest.ts # pixi.js manifest config
        \constants
        \utils
    \ui         # pixi.js user interfaces
        \animations
        \containers
        \scenes
        \sprites
        \textures
    main.ts     # entrypoint
```

### Quick start

**intsllation**

```bash
$ npm install
$ npm run dev -- --host
```

**build**

```
$ npm run build
```

### Docker

```bash
$ docker build -t pixi-template .
$ docker run --name pixi-container -p 5173:5173 pixi-template
```

### Installed deps

**dependencies**

- pixi.js
- @pixi/sound
- @pixi/gif

**dev-dependencies**

- typescript
- vite

### Requirements

:white_check_mark: **OS** `Linux`, `win32`, `macOS` \
:white_check_mark: **NodeJS** `^18.x`

#### Source

[pixi elementals](https://www.pixijselementals.com/#before-we-even-start) \
[pixi js official website](https://pixijs.com/) \
[vite guide](https://vitejs.dev/guide/) \
[typescript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
