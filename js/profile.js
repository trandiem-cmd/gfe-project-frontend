import { User } from "./class/User.js";

const user = new User();

document.addEventListener("DOMContentLoaded", loadProfile);

// LOAD DATA
async function loadProfile() {
  const res = await fetch("http://localhost:3001/profile/me", {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

  const data = await res.json();
  renderProfile(data);
}

// DISPLAY DATA
function renderProfile(userData) {
  // TOP HEADER NAME
  document.getElementById("header-name").textContent = userData.fullname || "";

  // FORM DISPLAY
  document.getElementById("name-display").textContent = userData.fullname || "";
  document.getElementById("phone-display").textContent = userData.contact_phone || "";
  document.getElementById("email-display").textContent = userData.contact_email || "";
  document.getElementById("location-display").textContent = userData.location || "";
  document.getElementById("about-display").textContent = userData.about_you || "";

  // INPUTS
  document.getElementById("name-input").value = userData.fullname || "";
  document.getElementById("phone-input").value = userData.contact_phone || "";
  document.getElementById("email-input").value = userData.contact_email || "";
  document.getElementById("location-input").value = userData.location || "";
  document.getElementById("about-input").value = userData.about_you || "";
}

// SWITCH TO EDIT MODE
document.getElementById("editBtn").addEventListener("click", () => {
  toggleEdit(true);
});

// SAVE CHANGES
document.getElementById("saveBtn").addEventListener("click", async () => {
  const body = {
    fullname: document.getElementById("name-input").value,
    contact_email: document.getElementById("email-input").value,
    contact_phone: document.getElementById("phone-input").value,
    location: document.getElementById("location-input").value,
    about_you: document.getElementById("about-input").value
  };

  const res = await fetch("http://localhost:3001/profile/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify(body)
  });

  const updated = await res.json();

  renderProfile(updated);
  toggleEdit(false);
});

// CANCEL EDIT
document.getElementById("cancelBtn").addEventListener("click", () => {
  toggleEdit(false);
});

// TOGGLE UI
function toggleEdit(isEdit) {
  const fields = ["name", "phone", "email", "location", "about"];

  fields.forEach(f => {
    const display = document.getElementById(`${f}-display`);
    const input = document.getElementById(`${f}-input`);

    if (display && input) {
      display.classList.toggle("d-none", isEdit);
      input.classList.toggle("d-none", !isEdit);
    }
  });

  document.getElementById("editBtn").classList.toggle("d-none", isEdit);
  document.getElementById("saveBtn").classList.toggle("d-none", !isEdit);
  document.getElementById("cancelBtn").style.display = isEdit ? "inline-block" : "none";
}