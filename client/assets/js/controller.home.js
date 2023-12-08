const formModal = document.getElementById('form-project')
const projects = document.getElementById('projects')

async function getActiveUser() {
  try {
    const res = await fetch('http://localhost:3000/usuarios/activo', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
 
    if(res) {
      const user = await res.json()
      return user.activeUser
    } else{
      return null
    }


  } catch(err) {
    console.log('error al obtener usuario' ,err)
  }
}

async function getAllUsers() {
  const res = await fetch('http://localhost:3000/usuarios', {
    headers: {
    'Content-Type': 'application/json'
    }
  })
  const users = await res.json()
  return users.users
}

async function getUser(id) {
  const res = await fetch(`http://localhost:3000/usuarios/cuenta/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const user = await res.json()
  return user.user
}

function addProject() {
  formModal.classList.remove('off')
}

async function createProject() {
  const activeUser = await getActiveUser()
  const inputProjectName = document.getElementById('project-name')
  const projectType = document.getElementById('project-type')

  let project
  if(projectType.value == 'web') {
    project = {
      projectName: inputProjectName.value,
      type: projectType.value,
      active: false,
      code: {
        html: '',
        css: '',
        js: ''
      }
    }
  } else {
    project = {
      projectName: inputProjectName.value,
      type: projectType.value,
      active: false,
      code: {
        code: ''
      }
    }
  }
  
  try {
    const res = await fetch(`http://localhost:3000/proyectos/usuario/${activeUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    })
     
    const newProject = await res.json()
    if(newProject.max) alert('Cantidad máxima de proyectos, actualice plan para crear más proyectos')
    renderProjectDirectories()
    closeModal()
    clearFormValues()
  } catch(err) {
    console.log('error al traer proyectos', err)
  }
}

async function getProjects() {
  const user = await getActiveUser()
  try {
    const res = await fetch(`http://localhost:3000/proyectos/${user._id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const projects = await res.json()
    return projects.projects
  } catch(err) {
    console.log(err)
  }
}

function renderProjectDirectories() {
  getProjects().then(projectsList => {
    projects.innerHTML = ''
    projectsList.forEach((project, index) => {
      projects.innerHTML += 
      `<div class="projects">
          <i class="fa-solid fa-folder"></i>
          <div class="project-name">
            <h3>${project.projectName}</h3>
          </div>
          <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Options
          </button>
          <ul class="dropdown-menu">
            <div class="dropdown-item" onclick="redirectToEditor('${project._id}')">Abrir</div>
            <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#shareModal" onclick="renderUsersToShare('${project._id}')">Compartir</button>
            <div class="dropdown-item" onclick="deleteProject('${project._id}')">Eliminar</div>
          </ul>
        </div>
        </div>
      `
    })
  }).catch(err => {
    console.log('error al traer proyectos', err)
  })
}

function closeModal() {
  formModal.classList.add('off')
}

function clearFormValues() {
  const inputProjectName = document.getElementById('project-name')
  const projectType = document.getElementById('project-type')

  inputProjectName.value = ''
  projectType.value = ''
}

async function redirectToEditor(id) {
  const projectSelected = await getProject(id)
  const updateProjectState = await activeProject(id)
  if(projectSelected.type == 'web') 
    window.location.href = 'http://localhost:5500/client/html/webEditor.html'
  else 
    window.location.href = 'http://localhost:5500/client/html/generalEditor.html'
}


async function getProject(id) {
  const res = await fetch(`http://localhost:3000/proyectos/seleccionado/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const project = await res.json()
  return project
}

async function activeProject(id) {
  try {
    const res = await fetch(`http://localhost:3000/proyectos/proyecto/seleccionado/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch(err) {
    console.log('no se pudo activar el proyecto', err)
  }
}

async function logout() {
  const user = await getActiveUser()
  try {
    const res = await fetch(`http://localhost:3000/usuarios/usuario/${user._id}/logout`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    window.location.href = 'http://localhost:5500/client/html/login.html'
  } catch(err) {
    console.log('error al cerrar sesión', err)
  }
}

async function changePlan() {
  const plan = document.getElementById('select').value
  const user = await getActiveUser()

  const newPlan = {
    plan: plan
  }

  try {
    const res = await fetch(`http://localhost:3000/usuarios/usuario/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPlan)
    })
  
    alert('plan actializado')
  } catch(err) {
    console.log('error al actualizar plan', err)
  }
}

async function renderUsersToShare(projectId) {
  const userContainer = document.getElementById('user-container')

  const users = await getAllUsers()
  const activeUser = await getActiveUser()

  userContainer.innerHTML = ''
  users.forEach(user => {
    if(user._id != activeUser._id) {
      userContainer.innerHTML += `
      <div style="border: 2px solid gray; color: #D6CC99" class="my-2 py-3 user-box" onclick="shareProject('${user._id}', '${projectId}')"><h5>${user.name}</h5></div>
      `
    }
  })
}

async function shareProject(userId, projectId) {
  const project = {
    newProject: projectId
  }

  const user = await getUser(userId)
  try {
    const res = await fetch(`http://localhost:3000/usuarios/usuario/${user._id}/proyecto`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    })

    alert('projecto compartidos')
  } catch(err) {
    console.log('error al compartir proyecto', err)
  }
}


async function deleteProject(projectId) {
  const user = await getActiveUser()

  try {
    const res = fetch(`http://localhost:3000/proyectos/proyecto/${user._id}/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    alert('Proyecto eliminado')
    renderProjectDirectories()
  } catch(err) {
    console.log('error al borrar proyecto', err)
  }
}

async function renderUserName() {
  const user = await getActiveUser()
  const title = document.getElementById('nav')
  title.innerHTML = ''
  title.innerHTML += `
  <h2 class="title">PROYECTOS DE ${user.name}</h2>
  <div>
    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modal">Cambiar plan</button>
    <button type="button" class="btn btn-secondary" onclick="logout()">Log out</button>
  </div>
  `
}

renderProjectDirectories()

renderUserName().then(() => {

})