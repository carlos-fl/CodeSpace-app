const formModal = document.getElementById('form-project')
const projects = document.getElementById('projects')
const projectList = []

function addProject() {
  formModal.classList.remove('off')
}


function createProject() {
  const inputProjectName = document.getElementById('project-name')
  const projectType = document.getElementById('project-type')

  let project = {
    name: inputProjectName.value,
    projectType: projectType.value
  }

  projectList.push(project)
  renderProjectDirectories()
  closeModal()
  clearFormValues()
}

function renderProjectDirectories() {
  projects.innerHTML = ''
  projectList.forEach((project, index) => {
    projects.innerHTML += 
    `<div class="projects" onclick="redirectToEditor(${index})">
      <i class="fa-solid fa-folder"></i>
      <div class="project-name">
        <h3>${project.name}</h3>
      </div>
     </div>
    `
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

function redirectToEditor(index) {
  const projectSelected = projectList[index]
  if(projectSelected.projectType == 'web') 
    window.location.href = 'http://localhost:5500/client/html/webEditor.html'
  else 
    window.location.href = 'http://localhost:5500/client/html/generalEditor.html'
}