## Install

* **Note: requires a node version >= 7 and an npm version >= 4.**

Install dependencies with yarn.

```bash
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

## Run

Start the app in the `dev` environment.

```bash
$ yarn dev
```

## DevTools

#### Toggle Chrome DevTools

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

## CSS Modules

This boilerplate is configured to use [css-modules](https://github.com/css-modules/css-modules) out of the box.

All `.css` file extensions will use css-modules unless it has `.global.css`.

If you need global styles, stylesheets with `.global.css` will not go through the
css-modules loader. e.g. `app.global.css`

If you want to import global css libraries (like `bootstrap`), you can just write the following code in `.global.css`:

```css
@import "~bootstrap/dist/css/bootstrap.css";
```

## Sass support

If you want to use Sass in your app, you only need to import `.sass` files instead of `.css` once:
```js
import './app.global.scss';
```

## Packaging

To package apps for the local platform:

```bash
$ yarn package
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://www.electron.build/multi-platform-build) for dependencies.

Then,
```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package -- --[option]
```

## Further commands

To run the application without packaging run

```bash
$ yarn build
$ yarn start
```
