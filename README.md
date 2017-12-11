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
const wizard = CTFLWizard.init({
  spaceId: 's25qxvg',
  key: 'f78aw812mlswwasw' // your API key
});

// after some time, after your content on the page has changed
wizard.update();

// or if you want to remove it
wizard.destroy();
</script>
```

## Usage

This is not ready for usage yet, so it is not distributed yet in any package managers or CDNs. You can build it by yourself, if you really want to:

```sh
npm run build
```

It will build two folders – `lib` and `dist`, where the first one contains ES modules code, and the latter one has [UMD builds](https://github.com/umdjs/umd) to use in the browser directly – you can copy this file to your application and serve by yourself.

## License

MIT