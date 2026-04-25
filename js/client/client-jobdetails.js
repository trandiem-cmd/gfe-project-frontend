// ===== CLIENT'S JOBDETAILS ===== //


// MASHAIR FIX - added null check so it doesn't crash on dashboard
import { user, job, application } from './client-shared.js';
import { BACKEND_URL } from '../config.js';

(async () => {
    // MASHAIR FIX - if no selectedJob load most recent job post automatically
let selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
const container = document.querySelector(".jobpost-details");

if (!selectedJob) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const response = await fetch(`${BACKEND_URL}/job/dashboard`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
    });
    const jobs = await response.json();
    if (jobs.length > 0) {
        selectedJob = jobs[0]; // load most recent job
        sessionStorage.setItem('selectedJob', JSON.stringify(selectedJob));
    }
}

if (selectedJob && container) {
    const div = document.createElement("div");
    div.classList.add("jobs-card");
    div.innerHTML = `
        <div class="job-top">
            <h3>${selectedJob.service_title}</h3>
        </div>
        <p class="job-time">${selectedJob.service_schedule}</p>
        <p class="apply-location">
            <img src="./Assets/location_on.png" class="location-icon">
            ${selectedJob.service_location} • ${selectedJob.service_pay_rate}
        </p>
    `;
    container.appendChild(div);
}
    
    
    // APPLICANTS DETAIS == //
async function loadApplicants() {
    const currentPostId = selectedJob?.id;
    if (!currentPostId) {
    console.error("No postId");
    return;
    }
    try {
        const data = await application.getApplicants(currentPostId);
        renderApplicants(data);
    } catch (err) {
        console.error(err);
    }
}
if (document.querySelector(".Applicants")) {
    loadApplicants();
}
function renderApplicants(data) {
    const container = document.querySelector(".Applicants");
    container.innerHTML = "";
    if(!Array.isArray(data) || data.length === 0){
        const p = document.createElement("p");
        p.innerHTML = "No applicants";
        container.appendChild(p);}
    data.forEach(app => {
        let serviceTitle = app.services
        if (serviceTitle == 'cleaning'){serviceTitle='🧼 Cleaning'}
        else if (serviceTitle == 'childcare'){serviceTitle='🧸 Childcare'}
        else {serviceTitle='👴🏻 Eldercare'};
        const div = document.createElement("div");
        div.classList.add("jobs-card");
// MASHAIR FIX - fixed order: photo/name, service, location, experience, skills, cv, status/buttons
div.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <img src="${app.photo ? `${BACKEND_URL}/uploads/${app.photo}` : ''}"
             style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
       <div style="flex:1;">
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <h3 style="margin:0;">${app.fullname}</h3>
        <span class="status ${app.status}" style="margin-left:40px;">${app.status}</span>
    </div>
    <p style="margin-top:2px; color:#572290;">${serviceTitle}</p>
</div>
    </div>
    <p>📍 ${app.location || ''}</p>
    <p>⭐ ${app.experience || ''}</p>
    <p>${app.skills || ''}</p>
    ${app.cv ? `<button class="download-CV">📄 View Applicant CV</button>` : ''}
    <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:8px;">
    <div style="display:flex; gap:8px;">
            <button class="view-profile-btn" data-id="${app.id}" style="background:#e7d5fa; color:#572290; padding:5px 14px; border-radius:8px; border:none; cursor:pointer;">View Profile</button>
            <button class="accept-btn" data-id="${app.id}">Accept</button>
            <button class="reject-btn" data-id="${app.id}">Reject</button>
        </div>
    </div>
`;
   div.querySelector(".accept-btn").addEventListener("click", async() => {
            console.log("ACCEPT CLICK", app.id);
            await updateStatus(app.id, "accepted");
            await loadApplicants();
        });

        div.querySelector(".reject-btn").addEventListener("click", async() => {
            await updateStatus(app.id, "rejected");
            await loadApplicants();
        });
        // MASHAIR - view profile button
div.querySelector(".view-profile-btn").addEventListener("click", () => {
    sessionStorage.setItem('selectedJobseekerId', app.jobseeker_id);
    window.location.href = 'client-viewCandidate.html';
});
        container.appendChild(div);
        const downloadBtn = div.querySelector(".download-CV");
        if(downloadBtn){
        downloadBtn.addEventListener("click", () => {
            application.downloadCV(app.id);
            });
        };
    });
}
async function updateStatus(appId,status) {
  try {
    const response = await application.updateStatus(appId,status); 
    return response;
  } catch (err) {
    console.error(err);
  }
}
})();