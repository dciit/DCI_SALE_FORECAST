import Axios from "axios";
const http = Axios.create({
    baseURL: import.meta.env.VITE_API,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
        // 'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
});

export default http;
export function ServiceGetUser() {
    return new Promise(resolve => {
        http.get(`/brazing/user`).then((res) => {
            console.log(res)
            resolve(res.data);
        })
    });
}
export function API_SAVE_SALE_FORCAST(param) {
    return new Promise(resolve => {
        http.post(`/saleforecast/update`, param).then((res) => {
            resolve(res.data);
        }).catch(() => {
            resolve({ status: false })
        })
    })
}
export function API_GET_SALE_FORCAST(ym) {
    return new Promise(resolve => {
        http.get(`/saleforecase/${ym}`).then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceGetModels() {
    return new Promise(resolve => {
        http.get(`/saleforecase/model`).then((res) => {
            resolve(res.data);
        })
    })
}
export function ServiceGetCustomers() {
    return new Promise(resolve => {
        http.get(`/saleforecase/customer`).then((res) => {
            resolve(res.data);
        })
    })
}

export function ServiceGetPltype() {
    return new Promise(resolve => {
        http.get(`/saleforecase/pltype`).then((res) => {
            resolve(res.data);
        })
    })
}


export function API_DELETE_ALL_DATA(param) {
    return new Promise(resolve => {
        http.post(`/saleforecase/deleteAll`, param).then((res) => {
            resolve(res.data);
        })
    })
}


export function API_GET_DISTRIBUTION(param) {
    return new Promise(resolve => {
        http.post(`/saleforcast/getdistribution`, param).then((res) => {
            resolve(res.data);
        })
    })
}


export function API_GET_SALE_OF_MONTH(param) {
    console.log(param)
    return new Promise(resolve => {
        http.post(`/saleforecast/getsaleofmonth`, param).then((res) => {
            resolve(res.data);
        })
    })
}


export function API_UPDATE_ROW(param) {
    return new Promise(resolve => {
        http.post(`/updaterow`, param).then((res) => {
            resolve(res.data);
        })
    })
}
