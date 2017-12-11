# Contentful-wizard

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This is a library to add interactive content explorer to your contentful-powered project.

It allows your editors quickly understand which element on the page is responsible for specific entry and content type.

This is only client-side library.

> This is WIP. Don't use it yet.

## Getting started

First, you need to include this library into your application. It will a global object, which you can call to instantiate wizard.

```js
CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw' // your API key
  preview: false // by default we serve true
  // if you set preview: true, you need to provide
  // preview API key
});

// 1 option, if you have server-side rendering
// data attributes:
// data-ctfl-content-type
// data-ctfl-entry

// in case something was updated
CTFLWizard.update();

// 2 option
// you can manually create new wizard for elements
CTFLWizard.attach({
  node,
  spaceId,
  contentType:
  entry:
});
```

## Styling

You can override styles of all parts – highlighting border


## License

MIT