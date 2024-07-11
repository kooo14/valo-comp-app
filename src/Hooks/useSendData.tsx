// useSendData.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSendData = (endpoint: string, data: any, setError: (error: boolean) => void, setErrorMessage: (message: string) => void) => {
    const [reFetch, setReFetch] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<any>(null);

    useEffect(() => {
        if (reFetch === true) {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}`, data)
                .then((response: any) => {
                    setResponseData(response.data);
                    console.log(response.data)

                })
                .catch((error: any) => {
                    console.error(error);
                    setError(true);
                    setErrorMessage(error.code + "," + error.message);
                });
            setReFetch(false);
        }
    }, [reFetch]);

    return { responseData, reFetch, setReFetch };
};
