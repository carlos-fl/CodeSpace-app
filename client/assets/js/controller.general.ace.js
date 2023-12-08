const generalCode = document.getElementById('language')
let code

async function setMode() {
  const project = await getActiveProject()
  code = ace.edit(generalCode, {
    theme: 'ace/theme/dracula',
    mode: `ace/mode/${project.type}`,
    fontSize: 17,
  })
}

setMode().then(() => {

})

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

  const coded = code.getValue()
  const project = await getActiveProject()

  const updatedCode = {
    code: coded
  }

  try {
    const res = await fetch(`http://localhost:3000/proyectos/proyecto/${project._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(updatedCode)
    })

    alert('Código enviado')
  } catch(err) {
    console.log('no se pudo enviar el código', err)
  }
}

async function setState() {
  const project = await getActiveProject()

  code.setValue(project.code.code)
}

setState().then(() => {
}).then(() => {
  
})