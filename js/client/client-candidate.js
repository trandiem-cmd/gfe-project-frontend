import { User } from "../class/User.js";
import { BACKEND_URL } from '../config.js';
const user = new User();
const currentUser = JSON.parse(sessionStorage.getItem('user'));

// MASHAIR - menu
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
if (menuBtn) menuBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "flex";
});
if (closeBtn) closeBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "none";
});

// MASHAIR - load all candidates on page open
async function loadAllCandidates() {
    try {
        const response = await fetch(`${BACKEND_URL}/user/jobseeker`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const candidates = await response.json();
        renderCandidates(candidates);
    } catch (err) {
        console.error('Error loading candidates:', err);
    }
}

// MASHAIR - load candidates by service
async function loadByService(service) {
    try {
        const response = await fetch(`${BACKEND_URL}/user/jobseeker/${service}`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const candidates = await response.json();
        renderCandidates(candidates);
    } catch (err) {
        console.error('Error loading candidates by service:', err);
    }
}

// MASHAIR - render candidate cards
function renderCandidates(candidates) {
    const container = document.getElementById('candidate-list');
    container.innerHTML = '';

    if (candidates.length === 0) {
        container.innerHTML = '<p style="padding:20px; color:#572290;">No candidates found</p>';
        return;
    }

    candidates.forEach(candidate => {
        let serviceTitle = candidate.services;
        if (serviceTitle == 'cleaning') serviceTitle = '🧼 Cleaning';
        else if (serviceTitle == 'childcare') serviceTitle = '🧸 Childcare';
        else serviceTitle = '👴 Eldercare';

        const div = document.createElement('div');
        div.className = 'job-card';
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <img src="${candidate.photo ? `${BACKEND_URL}/uploads/${candidate.photo}` : ''}"
                     style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                <div>
                    <h4 style="margin:0;">${candidate.fullname}</h4>
                    <p style="margin:0; color:#572290;">${serviceTitle}</p>
                </div>
            </div>
            <p>📍 ${candidate.location || ''}</p>
            <p>💰 ${candidate.hourly_rate || ''}</p>
            <p>⭐ ${candidate.experience || ''}</p>
            <p>${candidate.about_you || ''}</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button class="candidate-message-btn" style="background:linear-gradient(to right, #7b3fe4, #3B1664); color:white; padding:4px 12px; border-radius:8px; border:none; cursor:pointer;">Message</button>
                <button class="candidate-view-btn" style="background:#e7d5fa; color:#572290; padding:4px 12px; border-radius:8px; border:none; cursor:pointer;">View Profile</button>
            </div>
        `;

        // MASHAIR - message button
        div.querySelector('.candidate-message-btn').addEventListener('click', () => {
            sessionStorage.setItem('selectedReceiver', JSON.stringify(candidate));
            window.location.href = 'client-inbox.html';
        });

        // MASHAIR - view profile button
        div.querySelector('.candidate-view-btn').addEventListener('click', () => {
            sessionStorage.setItem('selectedJobseekerId', candidate.id);
            window.location.href = 'client-viewCandidate.html';
        });

        container.appendChild(div);
    });
}

// MASHAIR - service filter buttons
document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        document.querySelectorAll('.service-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        await loadByService(btn.dataset.filter);
    });
});

// MASHAIR - search bar filter
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.job-card').forEach(card => {
            card.style.display = card.textContent.toLowerCase().includes(search) ? 'block' : 'none';
        });
    });
}

// MASHAIR - load all candidates on page open
loadAllCandidates();