import { job } from './client-shared.js';

async function loadJobAds() {
    try {
        // get jobs from backend
        await job.getJob();
        const jobs = JSON.parse(sessionStorage.getItem('jobList')) || [];

        renderJobs(jobs);

    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

function renderJobs(jobs) {
    const container = document.getElementById("job-list");
    container.innerHTML = "";

    if (jobs.length === 0) {
        container.innerHTML = "<p>No job ads yet</p>";
        return;
    }

    jobs.forEach(jobItem => {
        const div = document.createElement("div");
        div.classList.add("jobs-card");

        div.innerHTML = `
            <h3>${jobItem.service_title}</h3>
            <p>${jobItem.service_schedule}</p>
            <span>${jobItem.service_location}</span>
            <span style="padding-left: 15px">${jobItem.service_pay_rate}</span>
            <p>${jobItem.service_description}</p>

            <button class="manage-btn" 
                style="margin-top:10px; background:#7b3fe4; color:white; padding:6px 12px; border:none; border-radius:6px;">
                Manage applicants
            </button>
        `;

        // 👉 CLICK → go to job details page
        div.querySelector(".manage-btn").addEventListener("click", () => {
            sessionStorage.setItem("selectedJob", JSON.stringify(jobItem));
            window.location.href = "client-jobdetails.html";
        });

        container.appendChild(div);
    });
}

// run when page loads
if (document.getElementById("job-list")) {
    loadJobAds();
}