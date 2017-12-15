# Contentful-wizard

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This is a library to add interactive content explorer to your [contentful-powered project](https://www.contentful.com/).

It allows your editors quickly understand which element on the page is responsible for specific entry and content type.

This is only client-side library, it assumes DOM is available.
Right now it is in pre-alpha stage, but you can take a look [at the roadmap](./Roadmap.md) to get a feeling what is going to be implemented.

> This is WIP. Don't use it yet.

## Getting started

First, you need to include this library into your application. It will add a global object, which you can call to instantiate wizard.

```html
<div data-ctf-content-type="17WjnjeALEOeSyuiMI4QOx" data-ctfl-entry="VQGkwljpe0AmqOmOuW8i9">
  <!-- your content -->
</div>

<script>
CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw' // your API key
});
</script>
```

## Entry titles

Since entries don't have `name` property, as content types do, in order to list them in human-readable form, it is always good to provide `entryTitle` property with the strategy to guess which field should be used:

```js
CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw', // your API key
  // if all your entries should show this field's value
  entryTitle: 'myTitle',

  // or, if you need to display different fields
  // for different content types
  entryTitle: {
    [contenTypeId]: 'mySpecialTitle'
  }
});
```

If you don't provide any (or fields by your strategy don't exist or don't have a value), the library will try to get `title` field first, and then `name`. There is no "smart" guessing strategy (like trying to list all fields with string value and get one with a short enough value), since it can easily introduce incosistency, and it will become confusing.

## Styling

Your use-case might be different – for example, you need wide tooltips, or default colours don't match your schema; you can customize all default styles, except positioning, it is calculated automatically and adjusted to the content. You provide your own styling during calling `CTFLWizard.init`, and you can omit any of these properties, and the whole property is optional – below you can find a commented breakdown on all style options:

> Since it is in pre-alpha (read: super-early) and styles are subject to change, I don't want to share styles to avoid frequent updates. Once it stabilizies, all default styles will be shown in this snippet

```js
CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw', // your API key
  
  // the whole property is optional
  style: {
    // style of the container to indicate
    // that it has hover capabilities
    highlight: {
      border: '2px dashed #ccc'
    },
    // style during the hover
    highlightHover: {
      border: '2px solid #ccc'
    },
    // styles of the tooltip itself
    tooltip: {
      background: '#ccc'
    },
    overlay: {
      background: 'green'
    }
  }
});
```

## Advanced usage

Create wizard instance initializes the library, attaching listeners to all elements with corresponding data-attributes to show tooltip on hovering. However, sometimes you change content on your page, and you would like to add tooltips for new content. In order to do that, you can invoke `.update` method on returned instance:

> You can provide an arg for `update` method – it is an object with the same parameters as for `init`, so you can override any parameters you had set up before

```js
const wizard = CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw'
});

// after some changes
wizard.update({
  // new entry title field resolution
  entryTitle: 'newTitle'
});
```

Another use case is to remove all listeners completely – for example, you re-rendered everything, or contentful content became irrelevant. In order to do that, you can call `.destroy` method:

```js
const wizard = CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw'
});

// if you want to remove all contentful-wizard functionality
wizard.destroy();
```

## Usage

This is not ready for usage yet, so it is not distributed yet in any package managers or CDNs. You can build it by yourself, if you really want to:

```sh
npm run build
```

It will build two folders – `lib` and `dist`, where the first one contains ES modules code, and the latter one has [UMD builds](https://github.com/umdjs/umd) to use in the browser directly – you can copy this file to your application and serve by yourself.

## License

MIT