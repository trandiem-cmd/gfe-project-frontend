import { User } from "../class/User.js";
import { BACKEND_URL } from "../config.js";

const user = new User();

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  if (!user.isLoggedIn) {
    window.location.href = "login.html";
    return;
  }

  initEventListeners();
  initLocationDropdown();
  loadProfile();


  
});

// ================= LOAD PROFILE =================
async function loadProfile() {
  try {
    const res = await fetch(`${BACKEND_URL}/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const data = await res.json();
    renderProfile(data);

  } catch (err) {
    console.error("LOAD ERROR:", err);
    alert("Failed to load profile");
  }
}

// ================= RENDER PROFILE =================
function renderProfile(userData) {
  setText("header-name", userData.fullname);
  setText("name-display", userData.fullname);
  setText("phone-display", userData.contact_phone);
  setText("email-display", userData.contact_email);
  setText("location-display", userData.location);

  setValue("name-input", userData.fullname);
  setValue("phone-input", userData.contact_phone);
  setValue("email-input", userData.contact_email);
  setValue("location-input", userData.location);

  // restore dropdown
  if (userData.location) {
    const [cityVal, districtVal] = userData.location.split(" - ");
    const city = document.getElementById("edit-city");
    const district = document.getElementById("edit-district");

    if (city && district) {
      city.value = cityVal;
      city.dispatchEvent(new Event("change"));

      setTimeout(() => {
        district.value = districtVal;
      }, 100);
    }
  }
}

// ================= SAVE PROFILE =================
async function saveProfile() {
  try {
    const body = {
      fullname: getValue("name-input"),
      contact_email: getValue("email-input"),
      contact_phone: getValue("phone-input"),
      location: getValue("location-input")
    };

    const res = await fetch(`${BACKEND_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Profile update failed");

    await handlePasswordChange();

    alert("Profile updated successfully!");
    toggleEdit(false);
    loadProfile();

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    alert(err.message);
  }
}


    // ================= PASSWORD CHANGE =================
async function handlePasswordChange() {
  const currentPassword = getValue("current-password");
  const newPassword = getValue("new-password");
  const confirmPassword = getValue("confirm-password");

  if (!currentPassword && !newPassword && !confirmPassword) return;

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const res = await fetch(`${BACKEND_URL}/user/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify({
      currentPassword,
      newPassword
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Password change failed");
  }
}

// ================= DELETE ACCOUNT =================
async function deleteAccount() {
  const confirmDelete = confirm("Are you sure you want to delete your account?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${BACKEND_URL}/user/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("Account deleted successfully");
    user.logout();
    window.location.href = "index.html";

  } catch (err) {
    console.error("DELETE ERROR:", err);
    alert("Failed to delete account");
  }
}

 // ================= TOGGLE EDIT =================
function toggleEdit(isEdit) {
  const fields = ["name", "phone", "email", "location", "password"];

  fields.forEach(f => {
    const display = document.getElementById(`${f}-display`);
    const input =
      f === "location"
        ? document.getElementById("location-input-wrapper")
        : f === "password"
        ? document.getElementById("password-input-wrapper")
        : document.getElementById(`${f}-input`);

    if (display && input) {
      display.classList.toggle("d-none", isEdit);
      input.classList.toggle("d-none", !isEdit);
    }
  });

  toggle("editBtn", isEdit);
  toggle("saveBtn", !isEdit);
  document.getElementById("cancelBtn").style.display = isEdit ? "inline-block" : "none";
}

// ================= LOCATION DROPDOWN =================
function initLocationDropdown() {
  const city = document.getElementById("edit-city");
  const district = document.getElementById("edit-district");
  const locationInput = document.getElementById("location-input");

  if (!city || !district || !locationInput) return;

  const data = {
    Helsinki: ["Keskusta","Kallio","Pasila","Itäkeskus","Kamppi"],
    Espoo: ["Tapiola","Leppävaara","Otaniemi","Matinkylä"],
    Vantaa: ["Tikkurila","Myyrmäki","Korso","Hakunila"],
    Tampere: ["Keskusta","Hervanta","Tammela","Kaleva"],
    Turku: ["Keskusta","Varissuo","Runosmäki","Skanssi"],
    Oulu: ["Keskusta","Kaakkuri","Linnanmaa","Tuira"]
  };

  city.addEventListener("change", () => {
    const selected = city.value;
    district.innerHTML = `<option value="">Select district</option>`;

    if (data[selected]) {
      data[selected].forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        district.appendChild(opt);
      });
    }
  });

  district.addEventListener("change", () => {
    if (city.value && district.value) {
      locationInput.value = `${city.value} - ${district.value}`;
    }
  });
}

// ================= EVENTS =================
function initEventListeners() {
  document.getElementById("editBtn")?.addEventListener("click", () => toggleEdit(true));
  document.getElementById("cancelBtn")?.addEventListener("click", () => toggleEdit(false));
  document.getElementById("saveBtn")?.addEventListener("click", saveProfile);
  document.getElementById("deleteBtn")?.addEventListener("click", deleteAccount);

  // password toggle
  document.querySelectorAll(".toggle-pw").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = icon.parentElement.querySelector("input");
      const isHidden = input.type === "password";

      input.type = isHidden ? "text" : "password";
      icon.classList.toggle("fa-eye", isHidden);
      icon.classList.toggle("fa-eye-slash", !isHidden);
    });
  });
}

// ================= HELPERS =================
function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function toggle(id, hide) {
  document.getElementById(id)?.classList.toggle("d-none", hide);
}