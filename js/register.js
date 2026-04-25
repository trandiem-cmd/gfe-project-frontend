import { User } from "./class/User.js";  

const user = new User();

const email_input = document.querySelector('#email');
const password_input = document.querySelector('#password');
const role_input = document.querySelector('#role');

document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("role").value = btn.dataset.role;
    });
});

document.querySelector('#signup-btn').addEventListener('click',(event) => {
  event.preventDefault()

  const email = email_input.value
  const password = password_input.value
  const role = role_input.value

  user.register(email, password, role)
    .then(() => {
      window.location.href = "login.html"
    })
    .catch(error => {
      alert(error)
    })
})

// MASHAIR - eye icon toggle for password field
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        const password = document.getElementById('password');
        if (password.type === 'password') {
            password.type = 'text';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        } else {
            password.type = 'password';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        }
    });
}