import { ajax } from './ajax.js';
import { randomString } from './random-string.js';
const baseUrl = `http://${location.hostname}:3000`;
const loginUsername = document.querySelector('#loginUsername');
const loginPassword = document.querySelector('#loginPassword');
const loginAction = document.querySelector('#login');
const loginResult = document.querySelector('#loginResult');

loginAction.addEventListener('click', function (e) {
    const user = {
        username: loginUsername.value,
        password: loginPassword.value
    };
    ajax({
        method: 'POST',
        url: `${baseUrl}/auth/login`,
        body: user,
        success: function (e) {
            const token = JSON.parse(e).value;
            if (!!token) {
                localStorage.setItem('token', `Bearer ` + JSON.parse(e).value);
                console.log(JSON.parse(e));
                loginResult.innerHTML += `用户 ${loginUsername.value} 登录成功, token 已存入 localStorage, 详情请见控制台<br/>`;
            } else {
                loginResult.innerHTML += `<b class="warning">${JSON.parse(e).message}<br/>`;
            }
        },
        error: function (err) {
            loginResult.innerHTML += `<b class="warning">${err.message}<br/>`;
        }
    }).then().catch(err => { });
}, false);


// 单独创建
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const createUser = document.querySelector('#createUser');
const createUserResult = document.querySelector('#user')
createUser.addEventListener('click', function () {
    const user = {
        username: usernameInput.value,
        password: passwordInput.value
    };
    ajax({
        method: 'POST',
        url: `${baseUrl}/auth/user`,
        body: user,
        success: function (e) {
            const { username, id } = JSON.parse(e).value;
            console.log(username, id);
            if (!!username && !!id) {
                createUserResult.innerHTML += `用户 ${username} 创建成功<br/>`;
            } else {
                createUserResult.innerHTML += `<b class="warning">${JSON.parse(e).value.message}<br/>`;
            }
        },
        error: function (err) {
            createUserResult.innerHTML += `<b class="warning">${JSON.parse(err).message}<br/>`;
        }
    }).then().catch(err => { });
}, false);

// 批量创建
const userNumber = document.querySelector('#userNumber');
const createUsers = document.querySelector('#createUsers');
const createUsersResult = document.querySelector('#users');

createUsers.addEventListener('click', function () {
    for (let i = 0; i < userNumber.value; i++) {
        const user = {
            username: randomString(),
            password: '1234',
        };
        ajax({
            method: 'POST',
            url: `${baseUrl}/auth/user`,
            body: user,
            success: function (e) {
                const { username } = JSON.parse(e).value;
                if (!!username) {
                    createUsersResult.innerHTML += `用户 ${username} 创建成功<br/>`;
                } else {
                    createUsersResult.innerHTML += `<b class="warning">${JSON.parse(e).value.message}<br/>`;
                }
            },
            error: function (err) {
                createUsersResult.innerHTML += `<b class="warning">${JSON.parse(err).message}<br/>`
            }
        }).then().catch(err => { });
    }
}, false);

// 事件代理清除
document.querySelectorAll('.clear').forEach(clearBtn => {
    clearBtn.addEventListener('click', function (e) {
        e.target.parentElement.parentElement.querySelector('p').innerHTML = '';
    }, false);
})


// 精确查询
const checkUserInput = document.querySelector('#checkUserInput');
const checkUserButton = document.querySelector('#checkUserButton');
const checkUserResult = document.querySelector('#checkUserResult');

checkUserButton.addEventListener('click', function (e) {
    ajax({
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
        url: `${baseUrl}/user/${checkUserInput.value}`,
        success: function (e) {
            checkUserResult.innerHTML += e;
        },
        error: function (err) {
            checkUserResult.innerHTML += `<b class="warning">${JSON.parse(err).message}<br/>`
        },
    }).then().catch(err => { });
}, false);

// 分页查询
const offsetInput = document.querySelector('#offset');
const limitInput = document.querySelector('#limit');
const checkUserButton2 = document.querySelector('#checkUserButton2');
const checkUserResult2 = document.querySelector('#checkUserResult2');

checkUserButton2.addEventListener('click', function (e) {
    ajax({
        method: 'GET',
        url: `${baseUrl}/user?offset=${offsetInput.value || 0}&limit=${limitInput.value || 10}`,
        headers: { Authorization: localStorage.getItem('token') },
        success: function (e) {
            checkUserResult2.innerHTML += e;
        },
        error: function (err) {
            checkUserResult2.innerHTML += `<b class="warning">${JSON.parse(err).message}<br/>`
        },
    }).then().catch(err => { });
}, false);
