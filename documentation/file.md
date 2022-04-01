# File structure

- `/src` contains all sources.
    - `/constants` - App-wide variables
    - `/containers` - 'Smart-components' that connect business logic to presentation [Read More &rarr;](https://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components)
    - `/images` - All images assets
    - `/lib` - Utils and custom libraries
    - `/models` - Rematch models combining actions, reducers and state. [Read More &rarr;](https://github.com/rematch/rematch#step-2-models)
    - `/native` - All react native code
        - `/components`- all native components
        - `/routes`- wire up the router with any & all Stack, Tabs & Screens [Read More &rarr;](https://reactnavigation.org/docs/getting-started/)
        - `index.js` - The starting place for our app
    - `/store`- Redux Store - hooks up the stores [Read More &rarr;](https://redux.js.org/docs/basics/Store.html)
