

import axios from 'axios'

const API = axios.create({
    baseURL: 'https://writify-production-2685.up.railway.app/api'
})

API.interceptors.request.use((req) => {
    const user = localStorage.getItem('user')
    if(user) {
        const data = JSON.parse(user)
        req.headers.Authorization = 'Bearer ' + data.token
    }
    return req
})

export default API