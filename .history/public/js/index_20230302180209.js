/* eslint-disable */
import '@babel/polyfill';
import { showAlert } from './alerts';
import { displayMap } from './mapBox'
import { login, logout } from './login'
import { signup } from './signup';
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const settingsForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');

// DELEGATE EVENTS
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(signupForm){
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email, password);
        signup(name, email,password, password);
    });
}

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email, password);
        login(email, password);
    });
}

if(settingsForm){
    settingsForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form)
        
        updateSettings(form, 'data');
    });
}

if(passwordForm){
    passwordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').innerHTML = 'Updating...'

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        document.querySelector('.btn--save-password').innerHTML = 'Saved Password'

        passwordCurrent = document.getElementById('password-current').value = '';
        password = document.getElementById('password').value = '';
        passwordConfirm = document.getElementById('password-confirm').value = '';
    });
}

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = `Processing...`;
        const tourId = e.target.dataset.tourId;
        bookTour(tourId);
    });
}

if(logoutBtn) logoutBtn.addEventListener('click', logout);

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);