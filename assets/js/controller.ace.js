const htmlEditor = document.getElementById('html')
const cssEditor = document.getElementById('css')
const jsEditor = document.getElementById('js')
const generalEditor = document.getElementById('programminglanguage')

let generalLanguage = ace.edit(generalEditor, {
  theme: 'ace/theme/dracula',
  mode: 'ace/mode/python',
  fontSize: 17
})

let htmlCode = ace.edit(htmlEditor, {
  theme: 'ace/theme/dracula',
  mode: 'ace/mode/html',
  fontSize: 17,
})

let cssCode = ace.edit(cssEditor, {
  theme: 'ace/theme/dracula',
  mode: 'ace/mode/css',
  fontSize: 17,
})

let jsCode = ace.edit(jsEditor, {
  theme: 'ace/theme/dracula',
  mode: 'ace/mode/javascript',
  fontSize: 17,
})


htmlCode.session.on('change', () => {
  update()
})

cssCode.session.on('change', () => {
  update()
})

jsCode.session.on('change', () => {
  update()
})

function update() {
  console.log(jsCode.getValue())
  let preview = document.getElementById('preview').contentWindow.document
  codeTemplate = 
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>`
     + cssCode.getValue() +
    `</style>
  </head>
  <body>`
    + htmlCode.getValue() +
    `<script>` + jsCode.getValue() + `</script>` +
  `</body>
  </html>
  `

  preview.open()
  preview.write(codeTemplate)
  preview.close()
}