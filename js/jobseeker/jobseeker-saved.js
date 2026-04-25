import { user } from './jobseeker-shared.js';

// MASHAIR - saved jobs page
const savedContainer = document.getElementById('savedContainer');
if (savedContainer) {
    function loadSavedJobs() {
        // MASHAIR FIX - use user-specific key so saved jobs don't mix between users
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        const savedJobsKey = `savedJobs_${currentUser.id}`;
        const savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
        savedContainer.innerHTML = "";
        if (savedJobs.length === 0) {
            savedContainer.innerHTML = "<p style='text-align:center; color:#572290; margin-top:20px;'>No saved jobs yet!</p>";
            return;
        }
        savedJobs.forEach(job => {
            const card = document.createElement("div");
            card.className = "job-card";
            card.innerHTML = `
                <div class="job-top">
                    <h4>${job.title}</h4>
                    <img src="./Assets/filled-heart.png" class="heart-icon">
                </div>
                <p class="job-time">${job.time}</p>
                <p>
                    <img src="./Assets/location_on.png" class="location-icon">
                    ${job.location}
                </p>
                <p class="job-desc">${job.desc}</p>
                <div class="job-actions">
                    <button class="remove-btn">Remove</button>
                    <a href="jobseeker-apply-page.html" class="apply-btn">Apply Now</a>
                </div>
            `;
            card.querySelector(".remove-btn").addEventListener("click", () => {
                // MASHAIR FIX - use user-specific key
                let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
                savedJobs = savedJobs.filter(j => j.title !== job.title);
                localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs));
                card.remove();
            });
            savedContainer.appendChild(card);
        });
    }
    loadSavedJobs();
}