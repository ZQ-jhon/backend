import { ajax } from './ajax.js';
import { randomString } from './random-string.js';
const baseUrl = `http://127.0.0.1:3000`;


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


// 查询
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
})