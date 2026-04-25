import { user } from './jobseeker-shared.js';
import { BACKEND_URL } from '../config.js';
// MASHAIR - profile page: edit, pause, delete, change password (new feature)
const profileContainer = document.querySelector('.profile-container');
if (profileContainer) {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const districts = {
        Helsinki: ['Kamppi', 'Kallio', 'Lauttasaari', 'Töölö', 'Pasila', 'Malmi', 'Haaga'],
        Espoo: ['Matinkylä', 'Otaniemi', 'Tapiola', 'Leppävaara', 'Espoonlahti'],
        Vantaa: ['Tikkurila', 'Myyrmäki', 'Hakunila', 'Martinlaakso'],
        Tampere: ['Kaleva', 'Pyynikki', 'Hervanta', 'Tammela'],
        Turku: ['Hirvensalo', 'Nummi', 'Runosmäki', 'Kupittaa'],
        Oulu: ['Linnanmaa', 'Rajakylä', 'Keskusta', 'Tuira']
    };

    async function loadProfile() {
        const userData = await user.getProfile(currentUser.id);
        document.getElementById('profile-name').textContent = userData.fullname ? userData.fullname.split(' ')[0] : '';
        document.getElementById('profile-service-text').textContent = userData.services || '';
        document.getElementById('profile-location-text').textContent = userData.location || '';
        document.getElementById('about-text').textContent = userData.about_you || 'No description added yet';
        document.getElementById('name-text').textContent = userData.fullname || '';
        document.getElementById('phone-text').textContent = userData.contact_phone || '';
        document.getElementById('email-text').textContent = userData.contact_email || '';
        document.getElementById('location-text').textContent = userData.location || '';
        document.getElementById('experience-text').textContent = userData.experience || '';
        document.getElementById('rate-text').textContent = userData.hourly_rate || '';

        if (userData.photo) {
            document.getElementById('profile-img').src = `${BACKEND_URL}/uploads/${userData.photo}`;
        }

        if (userData.is_paused) {
        document.getElementById('pauseBtn').textContent = 'Activate account';
        }

        if (userData.services) {
            document.getElementById('services-tags').innerHTML = `<span class="tag">${userData.services}</span>`;
        }

        if (userData.skills) {
            const tasksDiv = document.getElementById('skills-tasks');
            tasksDiv.innerHTML = '';
            userData.skills.split(',').forEach(skill => {
                const span = document.createElement('span');
                span.textContent = skill.trim();
                tasksDiv.appendChild(span);
            });
        }

        profileContainer.style.visibility = 'visible';
    }

    loadProfile();

    let isEditing = false;
    document.getElementById('editBtn').addEventListener('click', async function() {
        if (!isEditing) {
            isEditing = true;
            this.textContent = 'Save profile';

            const about = document.getElementById('about-text');
            about.innerHTML = `<textarea id="edit-about" style="width:100%; border:none; border-radius:8px; padding:8px; background:#e9def5; min-height:120px;">${about.innerText}</textarea>`;

            const name = document.getElementById('name-text');
            name.innerHTML = `<input id="edit-name" type="text" value="${name.innerText}" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">`;

            const phone = document.getElementById('phone-text');
            phone.innerHTML = `<input id="edit-phone" type="text" value="${phone.innerText}" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">`;

            const email = document.getElementById('email-text');
            email.innerHTML = `<input id="edit-email" type="email" value="${email.innerText}" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">`;

            const loc = document.getElementById('location-text');
            loc.innerHTML = `
                <select id="edit-city" class="form-select mb-2" style="background:#e9def5;">
                    <option value="">Select city</option>
                    <option>Helsinki</option>
                    <option>Espoo</option>
                    <option>Vantaa</option>
                    <option>Tampere</option>
                    <option>Turku</option>
                    <option>Oulu</option>
                </select>
                <select id="edit-district" class="form-select" style="background:#e9def5;">
                    <option value="">Select district</option>
                </select>
            `;

            document.getElementById('edit-city').addEventListener('change', function() {
                const districtSelect = document.getElementById('edit-district');
                districtSelect.innerHTML = '<option value="">Select district</option>';
                if (districts[this.value]) {
                    districts[this.value].forEach(d => {
                        const opt = document.createElement('option');
                        opt.value = d;
                        opt.textContent = d;
                        districtSelect.appendChild(opt);
                    });
                }
            });

            const exp = document.getElementById('experience-text');
            exp.innerHTML = `<select id="edit-experience" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5;">
                <option>0-1 years</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
            </select>`;

            const rate = document.getElementById('rate-text');
            rate.innerHTML = `<select id="edit-rate" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5;">
                <option>€10 - €15/hour</option>
                <option>€15 - €20/hour</option>
                <option>€20 - €25/hour</option>
                <option>€25+ /hour</option>
            </select>`;

            // MASHAIR FIX - service edit shows all 3 options
const servicesTag = document.getElementById('services-tags');
const currentService = document.getElementById('profile-service-text').textContent;
servicesTag.innerHTML = `
    <select id="edit-service" style="border:1px solid #ccc; border-radius:8px; padding:5px; background:#e9def5; width:100%;">
        <option value="childcare">Childcare</option>
        <option value="eldercare">Eldercare</option>
        <option value="cleaning">Cleaning</option>
    </select>
`;
document.getElementById('edit-service').value = currentService;

// MASHAIR FIX - skills edit shows all skills
const skillsDiv = document.getElementById('skills-tasks');
const currentSkills = skillsDiv.innerText.split(',').map(s => s.trim());
const allSkills = ['Babysitting', 'Child supervision', 'Meal preparation for kids', 'Homework assistance', 'Playtime activities', 'Personal care assistance', 'Medication management', 'Mobility assistance', 'Meal preparation', 'Elder companionship', 'House Cleaning', 'Surface Cleaning', 'Deep Cleaning', 'Laundry'];
skillsDiv.innerHTML = '';
allSkills.forEach(skill => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = skill;
    btn.className = currentSkills.includes(skill) ? 'skills active' : 'skills';
    btn.addEventListener('click', () => btn.classList.toggle('active'));
    skillsDiv.appendChild(btn);
});

        } else {
            isEditing = false;
            this.textContent = 'Edit your profile';

            const aboutVal = document.getElementById('edit-about').value;
            const nameVal = document.getElementById('edit-name').value;
            const phoneVal = document.getElementById('edit-phone').value;
            const emailVal = document.getElementById('edit-email').value;
            const expVal = document.getElementById('edit-experience').value;
            const rateVal = document.getElementById('edit-rate').value;
            const city = document.getElementById('edit-city').value;
            const district = document.getElementById('edit-district').value;
            const locVal = district ? `${city} - ${district}` : city;

            document.getElementById('about-text').innerHTML = aboutVal;
            document.getElementById('name-text').textContent = nameVal;
            document.getElementById('phone-text').textContent = phoneVal;
            document.getElementById('email-text').textContent = emailVal;
            document.getElementById('experience-text').textContent = expVal;
            document.getElementById('rate-text').textContent = rateVal;
            document.getElementById('location-text').textContent = locVal;
            document.getElementById('profile-location-text').textContent = city;

           // MASHAIR FIX - save service and skills too
const serviceVal = document.getElementById('edit-service').value;
const selectedSkills = [...document.getElementById('skills-tasks').querySelectorAll('button.active')]
    .map(btn => btn.textContent).join(', ');
await user.updateProfile(nameVal, emailVal, phoneVal, locVal, serviceVal, aboutVal, expVal, rateVal, null, selectedSkills);
            alert('Profile saved! ✅');
        }
    });

   document.getElementById('pauseBtn').addEventListener('click', async function() {
    const data = await user.pauseProfile();
    if (data.is_paused) {
        this.textContent = 'Activate account';
        this.style.background = '#ccc';
    } else {
        this.textContent = 'Deactivate account';
        this.style.background = '#e4dbe6';
    }
});

    document.getElementById('deleteBtn').addEventListener('click', async () => {
        if (confirm("Are you sure you want to delete your account? This cannot be undone!")) {
            await user.deleteAccount(currentUser.id);
            alert('Account deleted!');
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
    });
document.getElementById('change-password-btn').addEventListener('click', async () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields!');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        const data = await user.changePassword(currentPassword, newPassword);
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Password changed successfully! ✅');
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        }
    }); // ← close change-password-btn here

    // MASHAIR - eye icon toggle for profile page password fields
    document.querySelectorAll('.toggle-pw').forEach(span => {
        span.addEventListener('click', function() {
            // MASHAIR FIX - get input from parent div
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });

    // DIEM - toggle tags
    document.querySelectorAll('.tag, .tasks span').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });
}