---
id: 02-projectstructure
title: Project Structure with Maslow
sidebar_label: Project Structure
---

First of all: We not re-wrote nothing inside redux, we only create generic code to make your work easiest. You may want to use an archicheture where you put all your state/api "encapsulated" of the rest of project. For it we want that you be familiarizated with 2 terms: **State Manager** and **Redux Module**.

### State Manager
In this case our root folder that will export the redux store to be used by our project. An simple example of structure is:

```bash
myproject
.
.
.
└── src
    ├── components
    ├── static
    ├── pages
    ├── utils
    ├── stateManager
    │   ├── domain1
    │   │     ├── containers
    │   │     ├── api.js
    │   │     └── index.js
    │   ├── domain2
    │   │     ├── containers
    │   │     │     └── myContainerX.js
    │   │     ├── api.js
    │   │     └── index.js
    │   ├── store.js
    │   └── containers.js
    ├── index.html
    ├── routes.js
    └── index.js
```

In this archicheture you will have all store inside `stateManager/store` and containers `stateManager/containers`. In first case you could user original redux approach or our wrapper for it.

### Redux Module
As we said in introduction, we have a ideia of module! So imagine that in our `stateManager/domain1/index.js` we need to export a redux module, and after it, inside `stateManager/store` we need to get this modules and user `module.reducer` to create the redux store.

```javascript
import MyModuleApi from './api';
import { ModuleCreator } from 'maslow';

export const myModule = ModuleCreator('MyModuleName', MyModuleApi);
export default myModule;
```

Inside module you could find: `actionTypes`, `actions` and `reducers`, you could add your custom ones (you could check how in the API section).