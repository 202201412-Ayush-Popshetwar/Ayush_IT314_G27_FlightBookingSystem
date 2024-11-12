import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right',
        style: { width: '250px', padding: '10px', fontSize: '14px' }
    });
}

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top-right',
        style: { width: '250px', padding: '10px', fontSize: '14px' }
    });
}
