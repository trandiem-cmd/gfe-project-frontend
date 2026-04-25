import { application } from './jobseeker-shared.js';
import { BACKEND_URL } from '../config.js';
// ===== APPLICATION PAGE =====
// DIEM - original application page code
document.addEventListener("DOMContentLoaded", () => {
    async function loadApplications(status) {
        try {
            const data = await application.getApplications(status);
            renderApplications(data);
        } catch (err) {
            console.error(err);
        }
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            console.log("CLICKED");
            document.querySelectorAll(".filter-btn")
                .forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const status = btn.dataset.filter;
            console.log("STATUS:", status);
            loadApplications(status);
        });
    });

    // DIEM - render applications
    function renderApplications(data) {
        const container = document.getElementById("application-list");
        // MASHAIR FIX - added null check so it doesn't crash on other pages
        if (!container) return;
        container.innerHTML = "";
        data.forEach(app => {
            const div = document.createElement("div");
            div.classList.add("job-card");
            div.classList.add("application-card");
            div.innerHTML = `
                <div class="job-top">
                <h4>${app.service_title}</h4>
                <img src="./Assets/Heart@2x.png" class="heart-icon">
                </div>
                <p class="job-time">${app.service_schedule}</p>
                <p class="apply-location">
                <img src="./Assets/location_on.png" class="location-icon">
                ${app.service_location} • ${app.service_pay_rate}
                </p>
                <p class="job-desc">
                ${app.service_description}
                </p>
                ${app.cv ? `<button class="download-CV">
                📄 Download CV
                </button>` : ""}
                <div class="job-bottom">
                <span class="status ${app.status}">${app.status}</span>
                </div>
            `;
            // toggle details
            container.appendChild(div);
            const downloadBtn = div.querySelector(".download-CV");
            if(downloadBtn){
            downloadBtn.addEventListener("click", () => {
                application.downloadCV(app.id);
                });
            };
        });
    }

    // MASHAIR - auto load all applications when page opens (new)
    if (document.getElementById("application-list")) {
        loadApplications("all");
    }
});