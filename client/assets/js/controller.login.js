async function userLogin() {
  const user = document.getElementById('user').value
  const passwd = document.getElementById('passwd').value

  try {
    const res = await fetch('http://localhost:3000/usuarios/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user,
          password: passwd
        })
      })
  
      const userRes = await res.json()
      return userRes
      //correctCredentials(userRes.login)
  } catch(err) {
    console.log('error al hacer login', err)
  }
}

function correctCredentials(isCorrect) {
  if(isCorrect)
    window.location.href = 'http://localhost:5500/client/html/home.html'
}

async function setUser() {
  userLogin().then(res => {
    correctCredentials(res.login)
  }).catch(err => {
    console.log('error al logear', err)
  })
}
