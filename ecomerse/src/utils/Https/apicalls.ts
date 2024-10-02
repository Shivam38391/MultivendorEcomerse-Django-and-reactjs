import axios from 'axios';
import { API_BASE_URL } from '../constants';


const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    
    timeout: 100000, // timeout after 5 seconds
    
    // Define headers that will be included in every request made using this instance. This is common for specifying the content type and accepted response type.
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
    },
});



export default apiInstance;

export const categoryApi = async () => {
    return apiInstance.get("category/");
}



export const productsApi = async () => {
    return apiInstance.get("products/");
}

