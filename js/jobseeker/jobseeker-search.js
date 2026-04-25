import { user, job, application } from './jobseeker-shared.js';
// MASHAIR - search bar on job offers page (new feature)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.job-card').forEach(card => {
            const title = card.querySelector('h4') ? card.querySelector('h4').textContent.toLowerCase() : '';
            const desc = card.querySelector('.job-desc') ? card.querySelector('.job-desc').textContent.toLowerCase() : '';
            const loc = card.querySelector('.apply-location') ? card.querySelector('.apply-location').textContent.toLowerCase() : '';
            card.style.display = (title.includes(search) || desc.includes(search) || loc.includes(search)) ? 'block' : 'none';
        });
    });
}
// ===== JOB OFFERS PAGE =====
    async function loadJobs() {
        let allJobs = await job.getAllJob();
         const appliedJobs = await application.getApplications('all');
    const appliedJobIds = appliedJobs.map(a => a.job_id);
    renderjobsByService(allJobs, appliedJobIds);
        

        document.querySelectorAll(".service-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const jobsByService = btn.dataset.filter;
                let jobpostsList = await job.getJobByService(jobsByService);
               renderjobsByService(jobpostsList, appliedJobIds);
            });
        });
    }

    if (document.getElementById("job-list")) {
        loadJobs();
    }

   // DIEM - render jobs function
    function renderjobsByService(list, appliedJobIds = []) {
        const container = document.getElementById("job-list");
        container.innerHTML = "";
        // MASHAIR FIX - use user-specific key so saved jobs don't mix between users
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        const savedJobsKey = `savedJobs_${currentUser.id}`;
        list.forEach(job => {
            const div = document.createElement("div");
            div.classList.add("job-card");
            div.innerHTML = `
                <div class="job-top">
                    <h4>${job.service_title}</h4>
                    <img src="./Assets/Heart@2x.png" class="heart-icon">
                </div>
                <p class="job-time">${job.service_schedule}</p>
                <p class="apply-location">
                    <img src="./Assets/location_on.png" class="location-icon">
                    ${job.service_location} • ${job.service_pay_rate}
                </p>
                <p class="job-desc">${job.service_description}</p>
                <div class="job-bottom">
                    <button class="apply-btn">Apply Now</button>
                </div>
            `;
            container.appendChild(div);

            const applyBtn = div.querySelector(".apply-btn");
            if (appliedJobIds.includes(job.id)) {
    applyBtn.textContent = 'Already Applied';
    applyBtn.disabled = true;
    applyBtn.style.background = '#ccc';
    applyBtn.style.cursor = 'not-allowed';
} else {
            applyBtn.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.setItem("selectedJob", JSON.stringify(job));
                window.location.href = "jobseeker-apply-page.html";
            });
        }  
            // MASHAIR FIX - select icon from current card only
            const icon = div.querySelector('.heart-icon');
            const jobTitle = job.service_title;
            const jobTime = job.service_schedule;
            const jobLocation = job.service_location;
            const jobDesc = job.service_description;

            let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
            if (savedJobs.find(j => j.title === jobTitle)) {
                icon.src = "./Assets/filled-heart.png";
            }

            icon.addEventListener("click", () => {
                let savedJobs = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
                if (icon.src.includes("Heart@2x")) {
                    icon.src = "./Assets/filled-heart.png";
                    savedJobs.push({ title: jobTitle, time: jobTime, location: jobLocation, desc: jobDesc });
                } else {
                    icon.src = "./Assets/Heart@2x.png";
                    savedJobs = savedJobs.filter(j => j.title !== jobTitle);
                }
                localStorage.setItem(savedJobsKey, JSON.stringify(savedJobs));
            });
        });
    }