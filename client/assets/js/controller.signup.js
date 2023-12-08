let isValidAccount

function validateSingUpInfo() {

  const { userTextReceived, userPasswordReceived, userPlanSelected } = getUserSignUpInfo()

  if(userTextReceived == '' || userPasswordReceived == '' || userPlanSelected == '') return false
  if(userTextReceived.length < 3 || userPasswordReceived.length < 8) return false

  return true
}

async function sendForm() {

  const { userTextReceived, userPasswordReceived, userPlanSelected } = getUserSignUpInfo()

  try {
    const res = await fetch(`http://localhost:3000/usuarios/usuario`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userTextReceived,
          password: userPasswordReceived,
          plan: userPlanSelected,
          projects: []
        })
      })
      const response = await res.json()
      isValidAccount = response.created
      if(!response.created) {
        const container = document.getElementById('signup-container')
        container.innerHTML += `
        <div id="liveAlertPlaceholder" class="alert alert-danger"></div>
        `
        alert('usuario ya existe')
      }
  } catch(err) {
    console.log('error al crear cuenta', err)
  }
}

function getUserSignUpInfo() {
  const userText = document.getElementById('user')
  const userPassword = document.getElementById('user-passwd')
  const userPlan = document.getElementsByName('plan-seleccionado')

  var userPlanSelected = ''
  for(const plan of userPlan) {
    if(plan.checked) {
      userPlanSelected = plan.value
      break
    }
  }

  const userTextReceived = userText.value.trim()
  const userPasswordReceived = userPassword.value.trim()

  return { userTextReceived, userPasswordReceived, userPlanSelected }
}

async function redirectToHome() {
  await sendForm()
  console.log(isValidAccount)
  if(validateSingUpInfo() && isValidAccount) {
    window.location.href = 'http://localhost:5500/client/html/home.html'
  } else 
    notifyNotSuccessSignUp()

}

function notifyNotSuccessSignUp() {
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

  const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  const alertTrigger = document.getElementById('signUpBtn')
  if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
      alert('Nice, you triggered this alert message!', 'success')
    })
  }
}