import { User } from "./class/User.js"; 
const user = new User();
document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll(".logout-action");
  logoutButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      await user.logout();
      window.location.href = "index.html";
    });
  });
});
// MASHAIR - make all logos clickable redirect to home
document.querySelectorAll('.logo').forEach(logo => {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});