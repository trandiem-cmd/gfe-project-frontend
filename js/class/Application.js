import { BACKEND_URL } from "../config.js";
class Application {
    #id=undefined
    #job_id=undefined
    #jobseeker_id=undefined
    #cover_letter=undefined
    #cv=undefined
    #status=undefined
    #created_at=undefined
    #updated_at=undefined

    constructor() {
        const applicationFromStorage = sessionStorage.getItem('jobApplication');
        if (applicationFromStorage) {
            const applicationObject = JSON.parse(applicationFromStorage);
            this.#id = applicationObject.id;
            this.#job_id = applicationObject.job_id;
            this.#jobseeker_id = applicationObject.jobseeker_id;
            this.#cover_letter = applicationObject.cover_letter;
            this.#cv = applicationObject.cv;
            this.#status = applicationObject.status;
            this.#created_at = applicationObject.created_at;
            this.#updated_at = applicationObject.updated_at
        }
    }

    get id() {
        return this.#id;
    }   
    
    get job_id() {
        return this.#job_id;
    }
    get jobseeker_id() {
        return this.#jobseeker_id;
    }
    get cover_letter() {
        return this.#cover_letter;
    }
    get cv() {
        return this.#cv;
    }
    get status() {
        return this.#status;
    }
    get created_at() {
        return this.#created_at;
    }
    get updated_at() {
        return this.#updated_at
    }
    async applyJob(formData){
        const user = JSON.parse(sessionStorage.getItem('user'));
        const token = user.token;
        const response = await fetch(BACKEND_URL + '/application/apply', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`},
        body: formData    
        })
        if (response.ok === true) {
        const json = await response.json();
        sessionStorage.setItem('jobApplication',JSON.stringify(json))
        return json;
        }else {
        throw response.statusText
        }
    }
    async getApplications(status = "all") {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (!user || !user.token) {
            throw new Error("User not logged in");
        }

        let url = BACKEND_URL + "/application/search";

        if (status !== "all") {
            url += `?status=${status}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            const err = await response.json();
            throw new Error(err.error);
        }
    }

    // get applicants by jobpost id
    async getApplicants(postId){
        const user = JSON.parse(sessionStorage.getItem('user'));
        const response = await fetch(BACKEND_URL + `/application/${postId}`,{
            method: 'get',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`},
            cache: "no-store"
        })
        if (response.ok === true) {
        const json = await response.json();
        sessionStorage.setItem('applicantById',JSON.stringify(json))
        return json;
       }else {
        throw response.statusText
       }
    }
    // == UPDATE APPLICATION STATUS == //
    async updateStatus(appId,status){
    const user = JSON.parse(sessionStorage.getItem('user'));
    const response = await fetch(BACKEND_URL +`/application/${appId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({status})
    });
    if (response.ok === true) {
        const json = await response.json();
        return json;
       }else {
        throw response.statusText
       }
    }
    // == DOWNLOAD CV == //
    async downloadCV(applicationId) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const res = await fetch(`${BACKEND_URL}/application/download-cv/${applicationId}`,
            {
                headers: {
                Authorization: `Bearer ${user.token}`
                }
            }
        );
        if (!res.ok) {
            const err = await res.json();
            alert(err.error || "Download failed");
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cv.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    }   
}

export { Application }