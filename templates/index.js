module.exports = (title, modules) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="./css/main.min.css">
  <title>${title}</title>
</head>

<body>

</body>

<script src="./js/main.${modules ? 'mjs' : 'js'}" ${
  modules ? 'type="module" ' : ''
}charset="utf-8"></script>

</html>`
