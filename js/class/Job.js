import { BACKEND_URL } from "../config.js";

class Job {
    #id=undefined
   
    #service_type=undefined
    #service_title=undefined
    #service_description=undefined
    #service_schedule=undefined
    #service_frequency=undefined
    #service_location=undefined
    #service_pay_rate=undefined

    constructor() {
        const jobFromStorage = sessionStorage.getItem('jobpost');
        if (jobFromStorage) {
            const jobObject = JSON.parse(jobFromStorage);
            this.#id = jobObject.id;
            
            this.#service_type = jobObject.service_type;
            this.#service_title = jobObject.service_title;
            this.#service_description = jobObject.service_description;
            this.#service_schedule = jobObject.service_schedule;
            this.#service_frequency = jobObject.service_frequency;
            this.#service_location = jobObject.service_location;
            this.#service_pay_rate = jobObject.service_pay_rate
        }
    }

    get id() {
        return this.#id;
    }   
    
    get service_type() {
        return this.#service_type;
    }
    get service_title() {
        return this.#service_title;
    }
    get service_description() {
        return this.#service_description;
    }
    get service_schedule() {
        return this.#service_schedule;
    }
    get service_frequency() {
        return this.#service_frequency;
    }
    get service_location() {
        return this.#service_location;
    }
    get service_pay_rate() {
        return this.#service_pay_rate
    }
    
    async jobpost(service_type, service_title, service_description, service_schedule, service_frequency, service_location, service_pay_rate) {
       const data = JSON.stringify({

        service_type: service_type,
        service_title: service_title,
        service_description: service_description,
        service_schedule: service_schedule,
        service_frequency: service_frequency,
        service_location: service_location,
        service_pay_rate: service_pay_rate
       });
        const user = JSON.parse(sessionStorage.getItem('user'));
        const token = user.token;
       const response = await fetch(BACKEND_URL + '/job/post', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        body: data
       })
       if (response.ok === true) {
        const json = await response.json();
        this.#id = json.id;
        
        this.#service_type = json.service_type;
        this.#service_title = json.service_title;
        this.#service_description = json.service_description;
        this.#service_schedule = json.service_schedule;
        this.#service_frequency = json.service_frequency;
        this.#service_location = json.service_location;
        this.#service_pay_rate = json.service_pay_rate
        sessionStorage.setItem('jobpost', JSON.stringify(json));
        return this;
       }else {
        throw response.statusText
       }
    }
    async getJob (){
        const user = JSON.parse(sessionStorage.getItem('user'));   
        const token = user.token;
        const response = await fetch(BACKEND_URL + '/job/dashboard', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
            cache: "no-store"
       })
       if (response.ok === true) {
        const json = await response.json();
        sessionStorage.setItem('jobList',JSON.stringify(json))
        return json;
       }else {
        throw response.statusText
       }
    }
    async getAllJob (){
        const user = JSON.parse(sessionStorage.getItem('user'));   
        const token = user.token;
        const response = await fetch(BACKEND_URL + '/job/search', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
       })
       if (response.ok === true) {
        const json = await response.json();
        sessionStorage.setItem('allJobList',JSON.stringify(json))
        return json;
       }else {
        throw response.statusText
       }
    }
    async getJobByService (service){
        const user = JSON.parse(sessionStorage.getItem('user'));   
        const token = user.token;
        const response = await fetch(BACKEND_URL + `/job/search/${service}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
       })
       if (response.ok === true) {
        const json = await response.json();
        sessionStorage.setItem('jobByServiceList',JSON.stringify(json))
        return json;
       }else {
        throw response.statusText
       }
    }        
};
export { Job };
