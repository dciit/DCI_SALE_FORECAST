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
export function ServiceSaveSaleForcase(param) {
    return new Promise(resolve => {
        http.post(`/saleforecase/save`, param).then((res) => {
            resolve(res.data);
        }).catch(() => {
            resolve({ status: false })
        })
    })
}
export function ServiceGetSaleForecase(ym) {
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

