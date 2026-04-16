import { User } from "./class/User.js";

const user = new User();

const email_input = document.querySelector('#email');
const password_input = document.querySelector('#password');
const role_input = document.querySelector('#role');

document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedRole = btn.dataset.role;
        document.getElementById("role").value = selectedRole;
    });
});

// LOGIN AS CLIENT
document.querySelector('#login-btn1').addEventListener('click', async (event) => {
  event.preventDefault()
  const email = email_input.value
  const password = password_input.value
  const role = role_input.value
  try {
    await user.login(email, password, role)
    console.log("has_profile:", user.has_profile)
    if (user.has_profile) {
      window.location.href = "client-dashboard.html";
    } else {
      window.location.href = "client-profile1.html"
    }
  } catch(error) {
    alert(error)
  }
})

// LOGIN AS JOBSEEKER
document.querySelector('#login-btn2').addEventListener('click', async (event) => {
  event.preventDefault()
  const email = email_input.value
  const password = password_input.value
  const role = role_input.value
  try {
    await user.login(email, password, role)
    console.log("has_profile:", user.has_profile)
    if (user.has_profile) {
      window.location.href = "jobseeker-dashboard.html";
    } else {
      window.location.href = "jobseeker-profile1.html"
    }
  } catch(error) {
    alert(error)
  }
})