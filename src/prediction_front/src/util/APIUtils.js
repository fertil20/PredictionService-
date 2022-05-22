import {ACCESS_TOKEN, API_BASE_URL, REFRESH_TOKEN} from '../constants/constants';


const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    const newOptions = Object.assign({}, defaults, options);

    return fetch(newOptions.url, newOptions)
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(res);
            }
            return res.text()
        })
        .then((text) => text.length ? JSON.parse(text) : {})
        .catch((error) => {
            if ((error.status === 401) && (localStorage.getItem(ACCESS_TOKEN))) {
                return refreshToken(localStorage.getItem(REFRESH_TOKEN))
                    .then(token => {
                        localStorage.setItem(ACCESS_TOKEN, token.accessToken)
                        return request(options)
                    })
                    .catch(error => {})
            } else if (error.status === 403) {
                //todo Разобраться с return
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                localStorage.removeItem('app');
                window.location.href = "http://localhost:3000/login";
            }
        })
};

const setFile = async (options) => {
    const headers = new Headers({})

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    const newOptions = Object.assign({}, defaults, options);

    return await fetch(newOptions.url, newOptions)
        .catch((error) => {
            if ((error.status === 401) && (localStorage.getItem(ACCESS_TOKEN))) {
                return refreshToken(localStorage.getItem(REFRESH_TOKEN))
                    .then(token => {
                        localStorage.setItem(ACCESS_TOKEN, token.accessToken)
                        return request(options)
                    })
                    .catch(error => {})
            } else if (error.status === 403) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                localStorage.removeItem('app');
                window.location.href = "http://localhost:3000/login";
            }
        })
};

const getFile = (options) => {
    const headers = new Headers({})

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    const newOptions = Object.assign({}, defaults, options);

    return fetch(newOptions.url, newOptions)
        .then(response => {
            const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            });
        })
        .catch((error) => {
            if ((error.status === 401) && (localStorage.getItem(ACCESS_TOKEN))) {
                return refreshToken(localStorage.getItem(REFRESH_TOKEN))
                    .then(token => {
                        localStorage.setItem(ACCESS_TOKEN, token.accessToken)
                        return request(options)
                    })
                    .catch(error => {})
            } else if (error.status === 403) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                localStorage.removeItem('app');
                window.location.href = "http://localhost:3000/login";
            }
        })
}


export function deleteFile(fileId) {
    return request({
        url: API_BASE_URL + "/file/delete/" + fileId,
        method: 'DELETE'
    });
}

export function editFile(fileId, name) {
    return request({
        url: API_BASE_URL + "/file/changeName/" + fileId,
        method: 'POST',
        body: name
    });
}

export function downloadFile(fileId) {
    return getFile({
        url: API_BASE_URL + "/file/download/" + fileId,
        method: 'GET'
    });
}

export function loadFilesByUser(dataType) {
    return request({
        url: API_BASE_URL + "/users/files/" + dataType,
        method: 'GET'
    });
}

export function viewPredict(fileId) {
    return request({
        url: API_BASE_URL + "/file/parse/" + fileId,
        method: 'GET'
    })
}

export function savePredict(data, dataType, fileName) {
    return request({
        url: API_BASE_URL + "/file/savePrediction?dataType=" + dataType + "&fileName=" + fileName,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function predictFile(fileId, startDate, endDate) {
    return request({
        url: API_BASE_URL + "/prediction/predict/" + fileId + "?startDate=" + startDate + "&endDate=" + endDate,
        method: 'GET'
    });
}

export function uploadFile(file) {

    let fd = new FormData()
    fd.append('file', file)
    fd.append('dataType',"DATA_PAYMENTS")

    return setFile({
        url: API_BASE_URL + "/file/upload",
        method: 'POST',
        body: fd,
        headers:  new Headers({"Authorization": `Bearer ` + localStorage.getItem(ACCESS_TOKEN)})
    });
}

export function deleteUser(deleteUserId) {
    return request({
        url: API_BASE_URL + "/deleteUser/" + deleteUserId,
        method: 'POST'
    });
}

export function newUser(newUserRequest) {
    return request({
        url: API_BASE_URL + "/users/new",
        method: 'POST',
        body: JSON.stringify(newUserRequest)
    });
}

export function getAllUsers(){
    return request({
        url: API_BASE_URL + "/users",
        method: 'GET'
    })
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function profileEdit(profileEditRequest, username) {
    return request({
        url: API_BASE_URL + "/users/" + username + "/edit",
        method: 'POST',
        body: JSON.stringify(profileEditRequest)
    });
}

export function changePassword(password, username) {
    return request({
        url: API_BASE_URL + "/users/" + username + "/changePassword/",
        method: 'POST',
        body: password
    });
}

export function forgotPassword(forgotPasswordRequest) {
    return request({
        url: API_BASE_URL + "/auth/forgotPassword",
        method: 'POST',
        body: JSON.stringify(forgotPasswordRequest)
    });
}

export function forgotPasswordResetGet(token) { //GET token запрос
    return request({
        url: API_BASE_URL + "/auth/resetPassword?token=" + token,
        method: 'GET'
    });
}

export function forgotPasswordResetPost(password, token) { //Возвращает пароль и токен
    return request({
        url: API_BASE_URL + "/auth/resetPassword?token=" + token,
        method: 'POST',
        body: password
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signing",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/auth/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/auth/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function refreshToken(requestRefreshToken) {
    return request({
        url: API_BASE_URL + "/auth/refreshToken",
        method: 'POST',
        body: requestRefreshToken
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/me",
        method: 'GET'
    });
}