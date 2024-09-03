import axios from 'axios';
import toast from 'react-hot-toast';
import { setCredit, setCreditTotal } from '../features/user/userSlice';

export const axiosInterceptor = (dispatch: any) => {

    // -------------REQUESTS---------------
    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');    // Check if a token exists in local storage
        if (token) {
            // If token exists, set it as an Authorization header
            config.headers.Authorization = `${token}`;
            config.headers['token'] = `${token}`;
        }
        config.headers['token'] = localStorage.getItem('token');
        config.headers['X-API-Key'] = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        return config;
    }, error => {
        // Handle request errors
        return Promise.reject(error);
    });


    // ------------RESPONSE------------
    axios.interceptors.response.use((response: any) => {
        //update user credits from response
        const creditData = response?.data?.credit_balance;
        const creditTotal = response?.data?.credit_total;
        if (creditData) {
            if (creditData) {
                // toast.success(`Balance credit : ${creditData}`); //test
                dispatch(setCredit(creditData));
                if (creditTotal) dispatch(setCreditTotal(creditTotal));
            }
        }
        return response;
    },
        error => {
            // Check for specific error status codes or other conditions
            const errorMessage = error.response?.data?.message || error.message || error.response?.data?.data?.message
            console.error('Error:', errorMessage);  // Other Errors
            if (errorMessage) toast.error(error.response?.data?.message || error.message || error.response?.data?.data?.message)
            return
        });
}