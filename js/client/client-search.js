import { User } from "../class/User.js";
import { BACKEND_URL } from '../config.js';
const user = new User();


// ==============================
// DASHBOARD PAGE (click logic)
// ==============================
if (document.body.classList.contains("client-dashboard-page")) {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-details-btn");
    if (!btn) return;

    e.preventDefault();

    const card = btn.closest(".jobs-card");
    if (!card) return;

    const cards = Array.from(document.querySelectorAll("#jobseeker-list .jobs-card"));
    const index = cards.indexOf(card);

    const jobseekers = JSON.parse(sessionStorage.getItem("jobSeekerList")) || [];
    const selected = jobseekers[index];

    console.log("CLICKED INDEX:", index);
    console.log("SELECTED:", selected);

    if (!selected) {
      alert("No candidate found");
      return;
    }

    sessionStorage.setItem("selectedJobseekerId", selected.id);

    window.location.href = "client-viewCandidate.html";
  });
}


// ==============================
// VIEW CANDIDATE PAGE
// ==============================
if (document.body.classList.contains("client-view-candidate-details")) {
    // MASHAIR FIX - removed DOMContentLoaded wrapper, runs directly with module
    const id = sessionStorage.getItem("selectedJobseekerId");

    console.log("SELECTED ID:", id);

    if (!id) {
        alert("No candidate selected");
    } else {
        user.getProfile(id).then(data => {
            console.log("FETCHED DATA:", data);

            document.getElementById("profile-name").textContent = data.fullname || '';

            let serviceText = data.services;
            if (serviceText === "cleaning") serviceText = "🧼 Cleaning";
            else if (serviceText === "childcare") serviceText = "🧸 Childcare";
            else serviceText = "👴🏻 Eldercare";

            document.getElementById("profile-service-text").textContent = serviceText;
            document.getElementById("profile-location-text").textContent = "📍 " + (data.location || '');
            document.getElementById("about-text").textContent = data.about_you || '';
            document.getElementById("skills-container").textContent = data.skills || '';
            document.getElementById("experience-text").textContent = data.experience || '';
            document.getElementById("rate-text").textContent = (data.hourly_rate || '');

            if (data.photo) {
                document.getElementById("profile-img").src = `${BACKEND_URL}/uploads/${data.photo}`;
            }
        }).catch(err => {
            console.error(err);
            alert("Failed to load candidate");
        });
    }
}
// MASHAIR - send message button redirects to inbox with selected receiver
const sendMessageBtn = document.querySelector('.send-message-btn');
if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', () => {
        // get the candidate data from sessionStorage
        const id = sessionStorage.getItem("selectedJobseekerId");
        user.getProfile(id).then(data => {
            sessionStorage.setItem('selectedReceiver', JSON.stringify(data));
            window.location.href = 'client-inbox.html';
        });
    });
}