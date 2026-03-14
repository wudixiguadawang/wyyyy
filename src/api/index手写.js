import axios from "axios";


const instance = axios.create({
    baseURL:"http://api.com"
})


instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        config.headers.Authorization = token
        return config
    }, (error) => {
        return Promise.reject(error)
    })

instance.interceptors.response.use(
    (response)=>{
        return response.data
    },(error)=>{
        return Promise.reject(error)
    }
)



export function getUserInfo(id){
    
    const res = instance.get("/xxx",{params:{id}})
    return res
}

function get(url="",params={},config={}){
    return instance.get(url,{params,...config})
}

function post(url="",data={},config={}){
    return instance.post(url,data,config)
}
const api = {
    get,post
}
export default api