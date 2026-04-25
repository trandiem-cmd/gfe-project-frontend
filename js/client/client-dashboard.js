import { user, job, application } from './client-shared.js';
import { BACKEND_URL } from '../config.js';
const welcomeName = document.getElementById('welcomeName');
if (welcomeName) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser) {
        const name = currentUser.fullname ? currentUser.fullname.split(' ')[0] : currentUser.email.split('@')[0];
        welcomeName.textContent = `Hello, ${name} 👋`;
    }
}
// ===== CLIENT'S DASHBOARD ===== //
    // ===== CLIENT'S JOB POSTS AND RECOMMENDS CANDIDATES ===== //

    
async function loadDashboard() {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (!userData || !userData.id) {
        alert("Not logged in");
        window.location.href = "login.html";
        return;
    }

    const userId = userData.id; 


    await job.getJob(userId);
    const jobs = JSON.parse(sessionStorage.getItem('jobList')) || [];
    renderJobs(jobs);
    // MASHAIR - filter jobseekers by client's city
    const clientData = await user.getProfile(userId);
    const clientCity = clientData.location ? clientData.location.split(' - ')[0] : '';
    await user.getJobSeeker(userId);
    const allJobseekers = JSON.parse(sessionStorage.getItem('jobSeekerList')) || [];
    const filtered = allJobseekers.filter(j => j.location && j.location.includes(clientCity));
    renderJobseekers(filtered.length > 0 ? filtered : allJobseekers.slice(0, 3));

}
if (document.getElementById("job-list")) {
    loadDashboard();
}
function renderJobs(jobs) {
  const container = document.getElementById("job-list");
  container.innerHTML = "";
  if (jobs.length === 0) {
    container.innerHTML = "<p style='padding-left: 20px'>No jobs yet</p>";
    return;
  }

  jobs.forEach(jobItem => {
    const div = document.createElement("div");
    div.classList.add("jobs-card");

    div.innerHTML = `
    <div class="contain">
    <button class="menu-btn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #3B1664; font-weight: bold; letter-spacing: 3px;">...</button>
    <div class="dropdown-menu">
      <div class="dropdown-item e-btn">Edit</div>
      <div class="dropdown-item p-btn">${jobItem.is_paused ? 'Unpause' : 'Pause'}</div>
      <div class="dropdown-item d-btn">Delete</div>
    </div>
    </div>
      <h3>${jobItem.service_title}</h3>
      <p>${jobItem.service_schedule}</p>
      <span>${jobItem.service_location}</span><span style="padding: 20px">${jobItem.service_pay_rate}</span>
      <p>${jobItem.service_description}</p>
      <button class="manage-applicants-btn" style="background: linear-gradient(to right, #7b3fe4, #3B1664);
  color: white;
  padding: 4px 15px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 30px;
  margin-top: 10px;">Manage applicants</button>
    `;
    container.appendChild(div);
    const menuBtn = div.querySelector(".menu-btn");
const dropdown = div.querySelector(".dropdown-menu");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
  dropdown.style.display = "none";
});

// edit Action
div.querySelector(".e-btn").addEventListener("click", () => {
  sessionStorage.setItem("selectedJob", JSON.stringify(jobItem));
  window.location.href = "client-post.html"; 
});

// pause job connected to backend
div.querySelector(".p-btn").addEventListener("click", async () => {
    try {
const result = await job.pauseJob(jobItem.id);
if (result.is_paused) {
    alert("Job paused successfully!");
} else {
    alert("Job unpaused successfully!");
}
loadDashboard();
    } catch (error) {
        alert("Pause failed: " + error.message);
    }
});
// delete Action
div.querySelector(".d-btn").addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    
    if (!confirmDelete) return;

    try {
        await job.deleteJob(jobItem.id);

        // remove from UI instantly
        div.remove();

        alert("Job deleted successfully");
    } catch (error) {
        alert("Delete failed: " + error.message);
    }
});
    const manageApplicantsBtn = div.querySelector(".manage-applicants-btn");
        manageApplicantsBtn.addEventListener("click", (event) => {
            event.preventDefault();

            window.location.href = "client-jobdetails.html";

            sessionStorage.setItem("selectedJob", JSON.stringify(jobItem));
        });
  });
}
// MASHAIR - updated to show photo, message and view profile buttons
function renderJobseekers(jobseekers) {
    const container = document.getElementById("jobseeker-list");
    container.innerHTML = "";
    if (jobseekers.length === 0) {
        container.innerHTML = "<p>No candidates found</p>";
        return;
    }
    jobseekers.forEach(jobseeker => {
        let serviceTitle = jobseeker.services;
        if (serviceTitle == 'cleaning') { serviceTitle = '🧼 Cleaning' }
        else if (serviceTitle == 'childcare') { serviceTitle = '🧸 Childcare' }
        else { serviceTitle = '👴🏻 Eldercare' };

        const div = document.createElement("div");
        div.classList.add("jobs-card");
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <img src="${jobseeker.photo ? `${BACKEND_URL}/uploads/${jobseeker.photo}` : ''}" 
                     style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                <div>
                    <h3 style="margin:0;">${jobseeker.fullname}</h3>
                    <p style="margin:0;">${serviceTitle}</p>
                </div>
            </div>
            <p>📍 ${jobseeker.location}</p>
            <p>💰 ${jobseeker.hourly_rate}</p>
            <p>⭐ ${jobseeker.experience}</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button class="message-btn" data-id="${jobseeker.id}" style="background:linear-gradient(to right, #7b3fe4, #3B1664); color:white; padding:4px 12px; border-radius:8px; border:none; cursor:pointer;">Message</button>
                <button class="view-profile-btn" data-id="${jobseeker.id}" style="background:#e7d5fa; color:#572290; padding:4px 12px; border-radius:8px; border:none; cursor:pointer;">View Profile</button>
            </div>
        `;

        // MASHAIR - message button redirects to inbox
        div.querySelector('.message-btn').addEventListener('click', () => {
            sessionStorage.setItem('selectedReceiver', JSON.stringify(jobseeker));
            window.location.href = 'client-inbox.html';
        });

            // MASHAIR - view profile button
        div.querySelector('.view-profile-btn').addEventListener('click', () => {
             console.log('setting id:', jobseeker.id); // add this
            // MASHAIR FIX - use selectedJobseekerId to match search.js logic
            sessionStorage.setItem('selectedJobseekerId', jobseeker.id);
            console.log('saved:', sessionStorage.getItem('selectedJobseekerId')); 
            window.location.href = 'client-viewCandidate.html';
        });

        container.appendChild(div);
    });
}
// Clear edit data when clicking "Post a new job"
const postJobBtn = document.querySelector(".postjob-btn");

if (postJobBtn) {
  postJobBtn.addEventListener("click", () => {
    sessionStorage.removeItem("selectedJob");
    sessionStorage.removeItem("JOBPOST_DATA");
  });
}

// Also fix menu link
const menuLinks = document.querySelectorAll('a[href="client-post.html"]');

menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    sessionStorage.removeItem("selectedJob");
    sessionStorage.removeItem("JOBPOST_DATA");
  });
});
document.querySelector(".postjob-btn").addEventListener("click", () => {
    sessionStorage.removeItem("selectedJob");
});
document.querySelectorAll('a[href="client-post.html"]').forEach(link => {
    link.addEventListener("click", () => {
        sessionStorage.removeItem("selectedJob");
    });
});