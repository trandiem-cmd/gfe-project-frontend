import { user, getProfileData, saveProfileData, PROFILE_KEY } from './jobseeker-shared.js';
document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfileData();
    const currentUser = JSON.parse(sessionStorage.getItem("user")) || {}; // MASHAIR - added currentUser

    // ===== JOBSEEKER PROFILE STEP 1 =====
    const dropdown = document.getElementById("locationDropdown");
    const city = document.getElementById("city");
    const district = document.getElementById("district");
    const data = {
        Helsinki: ["Keskusta", "Kallio", "Pasila", "Itäkeskus", "Kamppi", "Meilahti", "Lauttasaari", "Vuosaari", "Malmi", "Haaga"],
        Espoo: ["Tapiola", "Leppävaara", "Otaniemi", "Matinkylä", "Espoonlahti", "Olari", "Kivenlahti", "Niittykumpu", "Soukka", "Laajalahti"],
        Vantaa: ["Tikkurila", "Myyrmäki", "Korso", "Hakunila", "Aviapolis", "Martinlaakso", "Koivukylä", "Pakkala", "Ylästö", "Rekola"],
        Tampere: ["Keskusta", "Hervanta", "Tammela", "Kaleva", "Lielahti", "Tesoma", "Pyynikki", "Nekala", "Rahola", "Messukylä"],
        Turku: ["Keskusta", "Varissuo", "Runosmäki", "Skanssi", "Nummi", "Kupittaa", "Pansio", "Hirvensalo", "Raunistula", "Halinen"],
        Oulu: ["Keskusta", "Kaakkuri", "Linnanmaa", "Tuira", "Rajakylä", "Pateniemi", "Hiukkavaara", "Maikkula", "Haukipudas", "Oulunsalu"]
    };

    const location = document.getElementById("location");
    if (location) {
        // MASHAIR - restore saved data when going back to step 1
        if (profile.name) document.getElementById("name").value = profile.name;
        if (profile.email) {
            document.getElementById("contact-email").value = profile.email;
        } else if (currentUser.email) {
            document.getElementById("contact-email").value = currentUser.email;
        }
        if (profile.phone) document.getElementById("contact-phone").value = profile.phone;
        if (profile.location) document.getElementById("location").value = profile.location;

        // DIEM - location dropdown logic
        location.addEventListener("click", () => {
            dropdown.classList.toggle("d-none");
        });
        city.addEventListener("change", () => {
            const selectedCity = city.value;
            district.innerHTML = `<option value="">Select district</option>`;
            if (data[selectedCity]) {
                data[selectedCity].forEach(d => {
                    const option = document.createElement("option");
                    option.value = d;
                    option.textContent = d;
                    district.appendChild(option);
                });
            }
        });
        district.addEventListener("change", () => {
            if (city.value && district.value) {
                location.value = `${city.value} - ${district.value}`;
                dropdown.classList.add("d-none");
            }
        });
        document.addEventListener("click", (e) => {
            if (!document.querySelector(".location-wrapper").contains(e.target)) {
                dropdown.classList.add("d-none");
            }
        });
    }
    // MASHAIR - photo upload in step 1 (new feature)
    const photoBox = document.getElementById('photoBox');
    if (photoBox) {
        if (profile.photo) {
            const preview = document.getElementById('previewPhoto');
            preview.src = profile.photo;
            preview.style.display = 'block';
            document.querySelector('.person-icon').style.display = 'none';
            document.querySelector('.camera-icon').style.display = 'none';
        }

        photoBox.addEventListener('click', () => document.getElementById('photoInput').click());
        document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('photoInput').click());

        document.getElementById('photoInput').addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('previewPhoto');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    document.querySelector('.person-icon').style.display = 'none';
                    document.querySelector('.camera-icon').style.display = 'none';
                    const profile = JSON.parse(sessionStorage.getItem("PROFILE_DATA")) || {};
                    profile.photo = e.target.result;
                    sessionStorage.setItem("PROFILE_DATA", JSON.stringify(profile));
                };
                reader.readAsDataURL(file);

                const formData = new FormData();
                formData.append('photo', file);
                user.uploadPhoto(formData).then(data => {
                    const profile = JSON.parse(sessionStorage.getItem("PROFILE_DATA")) || {};
                    profile.photoPath = data.photo;
                    sessionStorage.setItem("PROFILE_DATA", JSON.stringify(profile));
                }).catch(err => console.error('Photo upload error:', err));
            }
        });
    }

    // DIEM - next button step 1
    const next1Btn2 = document.querySelector("#next1-btn2");
    if (next1Btn2) {
        const name = document.querySelector("#name");
        const email = document.querySelector("#contact-email");
        const phone = document.querySelector("#contact-phone");

        next1Btn2.addEventListener("click", (event) => {
            event.preventDefault();
            if (!name.value || !email.value || !phone.value || !location.value) {
                alert("Please fill in all required fields.");
                return;
            }
            saveProfileData({ name: name.value, email: email.value, phone: phone.value, location: location.value });
            window.location.href = "jobseeker-profile2.html";
        });
    }

    // ===== JOBSEEKER PROFILE STEP 2 =====
    const items = document.querySelectorAll(".service-item");
    let selectedService = profile.selectedService || "";

    if (items.length) {
        // MASHAIR - restore about you text and save as typing
        const aboutYouField = document.querySelector("#about-you");
        if (aboutYouField) {
            if (profile.aboutYou) aboutYouField.value = profile.aboutYou;
            aboutYouField.addEventListener("input", () => {
                saveProfileData({ aboutYou: aboutYouField.value });
            });
        }

        // DIEM - service selection + MASHAIR added restore selected service
        items.forEach(item => {
            // MASHAIR - restore selected service when going back
            if (profile.selectedService && item.dataset.value === profile.selectedService.type) {
                item.classList.add("active");
            }
            // DIEM - original click handler
            item.addEventListener("click", () => {
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                selectedService = {
                    type: item.dataset.value,
                    title: item.querySelectorAll("div")[1].textContent.trim()
                };
            });
        });

        // MASHAIR - back button step 2 (new)
        const backBtn2 = document.getElementById('back-btn');
        if (backBtn2) {
            backBtn2.addEventListener('click', () => {
                window.location.href = 'jobseeker-profile1.html';
            });
        }

        // DIEM - next button step 2
        const next2Btn2 = document.querySelector("#next2-btn2");
        if (next2Btn2) {
            next2Btn2.addEventListener("click", (e) => {
                e.preventDefault();
                const aboutYou = document.querySelector("#about-you").value;
                if (!aboutYou || !selectedService) {
                    alert("Please fill in all required fields.");
                    return;
                }
                saveProfileData({ selectedService, aboutYou });
                window.location.href = "jobseeker-profile3.html";
            });
        }
    }

    // ===== JOBSEEKER PROFILE STEP 3 =====
    // DIEM - original step 3 code
    const experienceSelect = document.querySelector("#experience-years");
    const hourlyRateSelect = document.querySelector("#hourly-rate");
    const aboutExperienceTextarea = document.querySelector("#about-experience");
    let selectedSkills = profile.selectedSkills || [];

    if (experienceSelect) {
        // MASHAIR - restore saved data when going back to step 3
        if (profile.experience) experienceSelect.value = profile.experience;
        if (profile.hourlyRate) hourlyRateSelect.value = profile.hourlyRate;
        if (profile.aboutExperience) aboutExperienceTextarea.value = profile.aboutExperience;

        // DIEM - save on change
        experienceSelect.addEventListener("change", () => saveProfileData({ experience: experienceSelect.value }));
        hourlyRateSelect.addEventListener("change", () => saveProfileData({ hourlyRate: hourlyRateSelect.value }));
        aboutExperienceTextarea.addEventListener("input", () => saveProfileData({ aboutExperience: aboutExperienceTextarea.value }));

        // DIEM - skills buttons
        const skillButtons = document.querySelectorAll(".skills");
        skillButtons.forEach(btn => {
            const skill = btn.textContent.trim();
            if (selectedSkills.includes(skill)) btn.classList.add("active");
            btn.addEventListener("click", () => {
                btn.classList.toggle("active");
                if (selectedSkills.includes(skill)) {
                    selectedSkills = selectedSkills.filter(s => s !== skill);
                } else {
                    selectedSkills.push(skill);
                }
                saveProfileData({ selectedSkills });
            });
        });

        // MASHAIR - back button step 3 (new)
        const backBtn3 = document.getElementById('back-btn');
        if (backBtn3) {
            backBtn3.addEventListener('click', () => {
                window.location.href = 'jobseeker-profile2.html';
            });
        }

        // DIEM - next button step 3
        const next3Btn2 = document.querySelector("#next3-btn2");
        if (next3Btn2) {
            next3Btn2.addEventListener("click", (e) => {
                e.preventDefault();
                const experience = experienceSelect.value;
                const hourlyRate = hourlyRateSelect.value;
                const aboutExperience = aboutExperienceTextarea.value;
                if (!experience || !hourlyRate || !aboutExperience || selectedSkills.length === 0) {
                    alert("Please fill in all required fields.");
                    return;
                }
                saveProfileData({ experience, hourlyRate, aboutExperience, selectedSkills });
                window.location.href = "jobseeker-profile4.html";
            });
        }
    }

    // ===== JOBSEEKER PROFILE STEP 4 / REVIEW =====
    if (document.querySelector("#name-review")) {
        // MASHAIR - restore photo in review page (new)
        if (profile.photo) {
            const photoBox = document.querySelector('.photo-box');
            if (photoBox) {
                photoBox.innerHTML = `<img src="${profile.photo}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
            }
        }

        // MASHAIR - back button step 4 (new)
        const backBtn4 = document.getElementById('back-btn');
        if (backBtn4) {
            backBtn4.addEventListener('click', () => {
                window.location.href = 'jobseeker-profile3.html';
            });
        }

        // DIEM - original review page code
        document.getElementById("name-review").textContent = profile.name || "";
        document.getElementById("location-review").innerHTML = '<i class="bi bi-geo-alt" style="color: #5A3AB0;"></i> ' + (profile.location || "");

        // MASHAIR FIX - added optional chaining to prevent crash
        document.getElementById("service-review").textContent = profile.selectedService?.title || "";

        // DIEM - original code crashes if hourlyRate/experience is null:
        document.getElementById("rate-review").textContent = profile.hourlyRate || "";
        document.getElementById("experience-review").textContent = (profile.experience || "") + " experience";

        // DIEM - skills review
        const skillsContainer = document.getElementById("skills-review");
        skillsContainer.innerHTML = "";
        (profile.selectedSkills || []).forEach(skill => {
            const span = document.createElement("span");
            span.setAttribute("class", "skill-item");
            span.innerHTML = '<i class="bi bi-check-lg"></i> ' + skill;
            span.classList.add("active");
            skillsContainer.appendChild(span);
        });

        // DIEM - about review
        document.getElementById("about-you-review").textContent = profile.aboutYou || "";
    }

    // DIEM - submit profile button
    const submitBtn2 = document.querySelector("#submit-profile-btn2");
    if (submitBtn2) {
        submitBtn2.addEventListener("click", (event) => {
            event.preventDefault();
            const fullname = profile.name;
            const contact_email = profile.email;
            const contact_phone = profile.phone;
            const location = profile.location;
            const services = profile.selectedService?.type;
            const about_you = profile.aboutYou;
            const experience = profile.experience;
            const hourly_rate = profile.hourlyRate;
            const about_experience = profile.aboutExperience;
            const skills = (profile.selectedSkills || []).join(", ");
            user.updateProfile(fullname, contact_email, contact_phone, location, services, about_you, experience, hourly_rate, about_experience, skills)
                .then(() => {
                    sessionStorage.removeItem(PROFILE_KEY);
                    alert("Profile submitted successfully!");
                    window.location.href = "jobseeker-dashboard.html";
                })
                .catch(error => {
                    alert("Error submitting profile: " + error);
                });
        });
    }
});