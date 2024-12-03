import {Ref, unref, watchEffect} from "vue";


type Method = "POST" | "GET"

interface Result {
    api: Function,
}

interface UseFetch {
    (url:string, method:Method, body?:Ref<any>|undefined, data?:Ref<any>): Result
}

const prefix = 'http://localhost:3000/api/v1'

export const useFetch: UseFetch = (url,method, body, data) => {
    const api = (tdata = null) => {
        let curl = `${prefix}${url}`;
        let bodyValue = unref(body)
        if (method === 'GET') {
            curl += `?${new URLSearchParams(bodyValue)}`
            bodyValue = null;
        }
        bodyValue = tdata;
        const request = new Request(curl, {
            method,
            body: bodyValue && JSON.stringify(bodyValue),
            headers: {
                "Content-Type": "application/json",
            }}
        )
        return fetch(request).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Something went wrong on API server!");
            }
        }).then(res => {
            if (Array.isArray(res)) {
                data && (data.value = res)
            }
            return res
        })
    }
    watchEffect(() => {
        api();
    })
    // 暂时不需要手动
    return { api }
}


// url 方式 参数 这三个就是变量
// 是否手动 还是自动

const POST = async (url:string, data = {}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }}
    ).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error("Something went wrong on API server!");
        }
    })
}

const GET = async (url:string, data = {}) => {
    return fetch(url + '?' + new URLSearchParams(data), {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }}
    ).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error("Something went wrong on API server!");
        }
    })
}


interface UseFetchApi {
    (url:string, method:Method, data?:Ref<Object>|undefined): Result
}

const MethodMap = {
    POST,
    GET
}

// 有data 就自动请求 没有就手动请求
export const useFetchApi: UseFetchApi = (url, method, data) => {
    let curl = `${prefix}${url}`;
    const request = MethodMap[method].bind(null, curl)
    const api = (params:Object) => {
        const query = unref(data) || {};
        return request(Object.assign({}, query, params))
    }

    watchEffect(() => {
        unref(data) && api({});
    })

    return { api }
}






























