import { ajax } from './ajax.js';
import { randomString } from './random-string.js';
const baseUrl = `${location.hostname}:3000`;
// 登录
// <div>
// <h4>登录测试</h4>
// <label for="loginUsername">loginUsername</label><input id="loginUsername" type="text"  />
// <label for="loginPassword">loginPassword</label><input id="loginPassword" type="password" >
// <section class="button-group">
//     <button class="clear">清除日志</button>
//     <button id="login">登录</button>
// </section>
// <p id="loginResult"></p>
// </div>
const loginUsername = document.querySelector('#loginUsername');
const loginPassword = document.querySelector('#loginPassword');
const loginAction = document.querySelector('#login');
const loginResult = document.querySelector('#loginResult');

loginAction.addEventListener('click', function(e){
    const user = {
        username: loginUsername.value,
        password: loginPassword.value
    };
    ajax({
        method: 'POST',
        url: `${baseUrl}/user/login`,
        body: user,
        success: function (e) {
            localStorage.setItem('token', `Bearer ` + JSON.parse(e).value);
            console.log(JSON.parse(e));
            loginResult.innerHTML += `用户 ${username} 登录成功, token 已存入 localstorage, 详情请见控制台<br/>`;
        },
        error: function (err) {
            loginResult.innerHTML += `<b class="warnning">${err.message}<br/>`;
        }
    }).then().catch(err => {});
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
        url: `${baseUrl}/user`,
        body: user,
        success: function (e) {
            const { username, password, id } = JSON.parse(e);
            console.log(username, password, id);
            createUserResult.innerHTML += `用户 ${username} 创建成功<br/>`;
        },
        error: function (err) {
            createUserResult.innerHTML += `<b class="warnning">${JSON.parse(err).message}<br/>`;
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
            password: 1234,
        };
        ajax({
            method: 'POST',
            url: `${baseUrl}/user`,
            body: user,
            success: function (e) {
                const { username, password, id } = JSON.parse(e);
                console.log(username, password, id);
                createUsersResult.innerHTML += `用户 ${username} 创建成功<br/>`;
            },
            error: function (err) {
                createUsersResult.innerHTML += `<b class="warnning">${JSON.parse(err).message}<br/>`
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
        url: `${baseUrl}/user?username=${checkUserInput.value}`,
        success: function (e) {
            checkUserResult.innerHTML += e;
        },
        error: function (err) {
            checkUserResult.innerHTML += `<b class="warnning">${JSON.parse(err).message}<br/>`
        },
    }).then().catch(err => { });
}, false);

// 分页查询
const offsetInput = document.querySelector('#offset');
const limitInput = document.querySelector('#limit');
const checkUserButton2 = document.querySelector('#checkUserButton2');
const checkUserResult2 = document.querySelector('#checkUserResult2');

checkUserButton2.addEventListener('click', function(e){
    ajax({
        method: 'GET',
        url: `${baseUrl}/user?offset=${offsetInput.value || 0}&limit=${limitInput.value || 10}`,
        success: function (e) {
            checkUserResult2.innerHTML += e;
        },
        error: function (err) {
            checkUserResult2.innerHTML += `<b class="warnning">${JSON.parse(err).message}<br/>`
        },
    }).then().catch(err => { });
}, false);
