function validateSingUpInfo() {
  const userText = document.getElementById('user')
  const userPassword = document.getElementById('user-passwd')

  const userTextReceived = userText.value.trim()
  const userPasswordReceived = userPassword.value.trim()

  if(userTextReceived == '' || userPasswordReceived == '') return false
  if(userTextReceived.length < 3 || userPasswordReceived.length < 8) return false

  return true
}

function redirectToHome() {
  if(validateSingUpInfo())
    window.location.href = 'http://localhost:5500/client/html/home.html'
  console.log('hola')
}