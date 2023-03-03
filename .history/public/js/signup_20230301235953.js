/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

export const signup = async (name, email, password, passwordConfirm)=> {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signUp',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        })

        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }

    }
    catch(err){
        showAlert('error', err.response.data.message);
    }
}