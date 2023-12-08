const htmlEditor = document.getElementById('html')
const cssEditor = document.getElementById('css')
const jsEditor = document.getElementById('js')

async function getActiveProject() {
  try {
    const res = await fetch('http://localhost:3000/proyectos/proyecto/activo', {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const project = await res.json()
    return project.project

  } catch(err) {
    console.log('error al obtener el projecto', err)
  }
}

async function saveCode() {
  const html = htmlCode.getValue()
  const css = cssCode.getValue()
  const js = jsCode.getValue()
  const project = await getActiveProject()

  const updatedCode = {
    html: html,
    css: css,
    js: js
  }

  try {
    const res = await fetch(`http://localhost:3000/proyectos/proyecto/${project._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(updatedCode)
    })

    alert('código guardado')
  } catch(err) {
    console.log('no se pudo enviar el código', err)
  }
}

async function setState() {
  const project = await getActiveProject()

  htmlCode.setValue(project.code.html)
  cssCode.setValue(project.code.css)
  jsCode.setValue(project.code.js)
}

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



function getJsCode() {

}

function update() {
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


setState().then(() => {
  
}).then(() => {
  
})