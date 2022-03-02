# File structure

- `/src` contains JS and CSS code.
    - `/constants` - App-wide variables
    - `/containers` - 'Smart-components' that connect business logic to presentation [Read More &rarr;](https://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components)
    - `/images` - All images assets
    - `/lib` - Utils and custom libraries
    - `/models` - Rematch models combining actions, reducers and state. [Read More &rarr;](https://github.com/rematch/rematch#step-2-models)
    - `/native` - All react native code
        - `/routes`- wire up the router with any & all screens [Read More &rarr;](https://github.com/aksonov/react-native-router-flux)
        - `/components`- wire up the router with any & all screens [Read More &rarr;](https://github.com/aksonov/react-native-router-flux)
        - `/routes`- wire up the router with any & all screens [Read More &rarr;](https://github.com/aksonov/react-native-router-flux)
        - `index.js` - The starting place for our app
    - `/store`- Redux Store - hooks up the stores and provides initial/template states [Read More &rarr;](https://redux.js.org/docs/basics/Store.html)
    - `/styles`- all the SCSS you could dream of
    - `/translations`- all the json translation files
