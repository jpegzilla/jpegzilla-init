# jpegzilla-init

this is a command line utility that I made to help me easily initialize new web projects because I do it pretty much the same way every time. might be useful to you as well!

---

## usage:

```
$ npm i -g jpegzilla-init
$ jpegzilla-init
```

and you'll be prompted to go through the creation process.

there are other arguments, as well:

```
-yes or -Y : initialize project with all default options (no prompts will show)
-reset or -R : empties current directory. prompts for confirmation.
-react : creates react project with default options (no prompts will show)
```

### what files this will create:

#### vanilla:

generates this (with some variation depending on your choices):

```
root
├── index.html
├── js
│   ├── modules
│   └── main.mjs
└── css
    ├── components
    │   ├── _defaults.scss
    │   └── _vars.scss
    └── main.scss
```

#### react:

generates this (with respect to options):

```
root
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── styles
│   │   │   ├── components
│   │   │   │   ├── _defaults.sass
│   │   │   │   └── _vars.sass
│   │   │   └── main.sass
│   │   └── App.js
│   └── index.js
├── test
│   ├── helpers
│   │   ├── dom.js
│   │   └── helpers.js
│   └── App.test.js
├── .babelrc
├── .gitignore
└── package.json
```

### individual file contents:
the file contents are represented in the /templates folder. note that these files are simply kept as a reference, and are not dependencies. the /templates folder is not included in the npm package.

---

### future features
-   [ ] add service worker prompts
-   [ ] ogp / twitter / ios / seo meta tags
-   [ ] icon meta / manifest / etc. tags for pwas

-   [ ] add support for other frameworks:
    -   [ ]  add handlebars
    -   [ ]  add express
    -   [ ]  add rails
    -   [ ]  add vue
    -   [ ]  add ruby
