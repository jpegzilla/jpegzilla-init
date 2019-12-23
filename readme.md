# jpegzilla-init

this is a command line utility that I made to help me easily initialize new web projects because I do it pretty much the same way every time.

---

## usage:

```
$ npm i jpegzilla-init
$ jpegzilla-init
```

and you'll be prompted to go through the creation process.

there are two other arguments, as well:

```
-yes or -Y : initialize project with all default options (no prompts will show)
-reset or -R : empties current directory. prompts for confirmation.
```

### things this creates:
-   `index.html` with boilerplate, link to `main.min.css`, and link to `main.mjs`
-   `js` folder with `modules` folder and `main.mjs`
-   `css` folder with `main.scss` (with `// compile main` comment), `components` folder, and `img` folder
-   `css/components` folder with `_vars.scss` and `_defaults.scss`

### individual file contents:
note that these files are simply kept as a reference, and are not dependencies.

-   index.html: `templates/index.html`
-   main.mjs: `templates/main.mjs`
-   main.scss: `templates/main.scss`
-   \_vars.scss: `templates/_vars.scss`
-   \_defaults.scss: `templates/_defaults.scss`

---

### future features
-   add service worker prompts
-   ogp / twitter / ios / seo meta tags
-   icon meta / manifest / etc. tags for pwas
