# Commerce.js React Product Listing

This is a guide for creating a product listing page using Commerce.js and React.

[See live demo](https://commercejs-react-products.netlify.app/)

## Overview

The goal of this guide is to walk you through creating a simple storefront displaying a list of products with
Commerce.js and React. Throughout this guide you will learn how to:

1. Set up a React project,
2. Install Commerce.js, and
3. Create a products listing page

## Requirements

What you will need to start this project:

- An IDE or code editor
- NodeJS, at least v8
- npm or yarn
- React devtools (recommended)

## Prerequisites

This guide assumes you have some knowledge of the below concepts before starting:

- Basic knowledge of JavaScript
- Some knowledge of React
- An idea of the JAMstack architecture and how APIs work

## Some things to note:

- We will only cover high level concepts of React
- To ensure you have some product data to work with for this guide, we will provide you with a demo merchant [public
  key](https://commercejs.com/docs/sdk/concepts#authentication)
- We will not be going over account or dashboard setup. Have a read
  [here](https://commercejs.com/docs/sdk/getting-started#account-setup) if you'd like to learn more about setting up a
  Chec account
- This application is using SASS for styling and because the main goal of this guide is to learn how to list products
  with Commerce.js, we will not be going over any styling details

## Initial setup

### 1. Install and set up React

The simplest and quickest way to get started with a React project is to use the
[`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html) command. To create a project, run:

```bash
yarn create-react-app your-project-name
# OR
npx create-react-app your-project-name
```

Change directory into your project folder:

```bash
cd your-project-name
```

### 2. Store the public key in an environment variable file

Create a `.env` to store the public key.

```bash
touch .env
```

Open up your the `.env` file and add your Chec public key:

```bash
# Public key from Chec's demo merchant account
REACT_APP_CHEC_PUBLIC_KEY=pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec
```

### 3. Start your local HTTP server and run your development environment
```bash
yarn start
# OR
npm start
```

## Add Commerce.js to the application

### 1. Install Commerce.js

In order to communicate with the Chec API and fetch data from the backend, install the Commerce.js SDK:

```bash
yarn add @chec/commerce.js
# OR
npm install @chec/commerce.js
```

### 2. Create a Commerce.js instance

The Commerce.js SDK comes packed with all the frontend oriented functionality to get a customer-facing web-store up and
running. To use the SDK, import the module in a folder called `lib` so you have access to the Commerce object instance throughout your application.

Go ahead and do that right now! In your `src` directory, create a new folder called `lib`, create a file
`commerce.js` and copy and paste the below code in it. A lib folder in a project typically stores files that abstracts
functions or some form of data.

```js
// src/lib/commerce.js

import Commerce from '@chec/commerce.js';

const checAPIKey = process.env.REACT_APP_CHEC_PUBLIC_KEY;
const devEnvironment = process.env.NODE_ENV === 'development';

const commerceConfig = {
  axiosConfig: {
    headers: {
      'X-Chec-Agent': 'commerce.js/v2',
      'Chec-Version': '2021-09-29',
    },
  },
};

if (devEnvironment && !checAPIKey) {
  throw Error('Your public API key must be provided as an environment variable named NEXT_PUBLIC_CHEC_PUBLIC_KEY. Obtain your Chec public key by logging into your Chec account and navigate to Setup > Developer, or can be obtained with the Chec CLI via with the command chec whoami');
}

export default new Commerce(
  checAPIKey,
  devEnvironment,
  commerceConfig,
);
```

Above, you've imported the `Commerce` object, then exported the instance with your Chec API key provided via an
environment variable. The public key is needed to give you access to data via the Chec API.

A good idea is to throw throw an error if the public key isn't available, since it will probably make your application
unusable.

### 3. The commerce object

In order to have access to your `commerce` instance exported in `/lib/Commerce.js`, import it to every
component needing to make requests to the Chec API:

```js
import { commerce } from './lib/commerce';
```

The `commerce` object will then be available to make Commerce.js requests with.

## Build application

Commerce.js was built with all the frontend functionality needed to build a complete eCommerce store. Simply make requests to various Chec API endpoints, receive successful responses, then use the raw data to output beautifully onto your web store.

You can now start to make requests to fetch data from Chec to list your product data.

### 1. Fetch our products data

One of the main resources in Chec is the Products endpoint. Commerce.js makes it seamless to fetch product data with its promise-based method `commerce.products.list()`. This request would make a call to the `GET v1/products` API endpoint and return a list of product data. Open up your `App.js` file and delete the code that came with creating a new React app and we will write this file from scratch.

Let's get to writing out our first functional component in `App.js`. Import commerce as well as a new module, `useState` which is the first React hook we'll be using to make our function component stateful. The first two API endpoint we will want to work with is the Products and Merchant endpoint. The Products endpoint will allow us to work with data such as the product name, product price, product description etc. The Merchant endpoint will contain information such as the e-commerce business name and contact details.

```js
import React, { useState } from 'react';
import commerce from './lib/commerce';
import ProductsList from './components/ProductsList';

const App = () => {
  const [products, setProducts] = useState([]);

  render() {
    return (
      <div className="app">
      </div>
    );
  }
};

export default App;
```

After the opening of our `App` function, we need to destructure and return `products` and a method `setProducts` from the function `useState`. `useState` returns a tuple, which is an array with two items, in this case an initial value and a function that will update that value. The argument we will pass in to `useState` is the initial value of an empty array to be able to store the product data in it when we fetch the data. We follow the same pattern for the Merchant value, but instead we will pass in an empty object as an argument to `useState`.

💡 **Tip**

`useState` allows us to make function components stateful. This means that the components has the ability to keep track of changing data. You might ask why would be want to keep track of changing data. Any commerce store needs to have the ability to update its products listing in real-time. Be it new products being added, products being sold out, or products being taken off. The API data constantly will get updated, therefore the UI has to be reactive.

You can now make your first Commerce.js request! Create a function called `fetchProducts()` in the component and make a request to the products endpoint using the Commerce.js method `commerce.products.list()`.


```jsx
/**
 * Fetch products data from Chec and stores in the products data object.
 * https://commercejs.com/docs/sdk/products
 */
const fetchProducts = () => {
  commerce.products.list().then((products) => {
    setProducts(products.data);
  }).catch((error) => {
    console.log('There was an error fetching the products', error)
  });
}
```

Inside the function, we use the `commerce` object to access the `products.list()` method for access to product data. [`commerce.products.list()`](https://commercejs.com/docs/sdk/products#list-products) is a promise-based function call that will resolve the request and `then()` sets the response data with `setProducts` into the `products` state key created earlier. In Chec, product is returned in an object called `data`, which is why we set the response as `product.data`. The `catch()` method catches any errors in the case that the request to the server fails.

Of course simply creating the functions do not do anything as you have yet to call them. When the app component mounts to the DOM, we will use our next React hook `useEffect()` to call the fetching of data. It is a React lifecycle hook also known as side effects, that helps to call functions after the component first renders to the DOM and also anytime the DOM updates. Since we are loading data from a remote endpoint, we want to invoke the `fetchProducts()` function to update the state with the returned products so that we can render our updated data.

First import `useEffect` from React in our import statement at the very top `import React, { useState, useEffect } from 'react';`.

Then we can use the function like so:

```jsx
useEffect(() => {
  fetchProducts();
}, []);
```

Above, we pass in our effect as a function `fetchProducts()` and also by leaving the second argument array empty, this method will run once before the initial render.

With returned product data object containing all the property endpoints such as the product name, the product description, product price or any uploaded variants or assets. This data is exposed when you make a request to the API. As mentioned above, Commerce.js is a Software Development Kit(SDK) that comes with abstracted axios promise-based function calls that will help to fetch data from the endpoints. The public key access that we briefed over above is a public token key from a merchant store. This account already has products and products information uploaded to the Chec dashboard for us to run a demo store with. You now go back to `App.js` and include the `ProductsList` component.

```jsx
return (
  <div className="app">
    <ProductsList />
  </div>
);
```
### 2. Create our product item component

The nature of React and most modern JavaScript frameworks is to separate your code into components. Components are a way to encapsulate a group of elements for reuse throughout your application. You'll be creating two components for products, one will be for the single product item and another for the list of product items. In your components, we will also start to deal with props. Props are used to pass data from parent components down to the child components.
As your app grows, it is generally good practice to validate your props for type checking and debugging. We will install the `prop-types` library to do so.

```bash
yarn add prop-types
# OR
npm install prop-types
```

Now lets create a component `ProductItem.js` and start by creating a function component and name it `ProductItem`. This component will render the individual product card. We then pass in the `product` parameter which the parent component will parse out as each individual product item. You will reference this property to access each product's image, name, description, and price via `.image.url`, `.name`, `.description` and `.price` in the return statement.

Product descriptions return HTML. To strip HTML from the product description string, using [this `string-strip-html`](https://codsen.com/os/string-strip-html/) handy library will do the trick. Install this library by running `yarn add string-strip-html` or `npm i string-strip-html`. After installing, import the module in and pass in the product description to the `stripHtml` function.

```jsx
import React, { Component } from "react";
import stripHtml from 'string-strip-html';
import PropTypes from 'prop-types';

const ProductItem = ({ product }) => {

  const { result } = stripHtml(product.description);

  return (
    <div className="product__card">
      <img className="product__image" src={product.image?.url} alt={product.name} />
      <div className="product__info">
        <h4 className="product__name">{product.name}</h4>
        <p className="product__description">
          {/* product description stripped of html tags */}
          {result}
        </p>
        <div className="product__details">
          <p className="product__price">
            {product.price.formatted_with_symbol}
          </p>
        </div>
      </div>
    </div> 
  );
};

ProductItem.propTypes = {
  product: PropTypes.object,
};

export default ProductItem;
```

If you look at the returned data in your products request, the data object comes with all the information that you
need to build a product listing view. In the code snippet above, your `product` prop is being used to access the various
properties. First, render an image tag with the `src` value of `product.image?.source` as the values inside the curly
braces dynamically binds to the attributes.

### 3. Create our products list component

It's now time to create a `ProductsList.js` component inside `src/components`. The `ProductsList` component will be another function component which will loop through and render a list of `ProductItem` components.

First, import in the `ProductItem` component. Next, define a `products` prop. This will be provided by the parent component.

In your return statement you need to use the `map` function to render a `ProductItem` component for each product in your `products` prop. You also need to pass in a unique identifier (`product.id`) as the `key` attribute - React will use it to determine which items in a list have changed and which parts of your application need to be re-rendered.

```js
import React from 'react';
import PropTypes from 'prop-types';
import ProductItem from './ProductItem';

const ProductsList = ({ products }) => {

    return (
        <div className="products" id="products">
            { products.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
};

ProductsList.propTypes = {
    products: PropTypes.array,
};

export default ProductsList;
```

This component will be a bit bare-boned for now except for looping through a `ProductItem` component.

With both your product item and list components created, go back to `App.js` to render the `<ProductsList />` and pass in the `products` prop with the returned product data as the value. This means that the value of the `ProductsList` component's prop `products` will be resolved from the parent (`App`) component's state, and will update automatically whenever it changes.

```js
import React, { useState, useEffect } from "react";
import commerce from './lib/Commerce';

import './styles/scss/styles.scss';

import ProductsList from './components/ProductsList';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Fetch products data from Chec and stores in the products data object.
   * https://commercejs.com/docs/sdk/products
   */
  const fetchProducts = () => {
    commerce.products.list().then((products) => {
      setProducts(products.data);
    }).catch((error) => {
      console.log('There was an error fetching the products', error)
    });
  }

  return (
    <div className="app">
      <ProductsList 
        products={products}
      />
    </div>
  )
};

export default App;
```

Your final `App.js` component should look like the above code block. If you want to build in a loading state while
your products load, you could add `loading: true` to your initial state, have `fetchProducts()` change this to false
when the promise resolves, and add something like this to your component:

```jsx
render() {
  if (loading) {
    return <p>Loading...</p>;
  }
}
```

## That wraps it up!

Awesome, you've just wrapped up creating a products listing page using Commerce.js and React! This guide is the first
part in a full React series. The next guide will walk you through on how to add cart functionalities to your
application.

To view the final code up until this point go [here](https://github.com/jaepass/commercejs-react-products).

For a deeper dive into building applications this way, look into server-side rendering and
static site generation. Pre-generating your product list and detail pages will be immensely useful for improving
your search engine optimization. React libraries such as Gatsby and Next.js help you to do this. Check out the
[Commerce.js Community Guides](https://commercejs.com/docs/community/) section for more guides using these tools!
