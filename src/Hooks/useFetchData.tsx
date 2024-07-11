import { useState, useEffect } from 'react';
import axios from 'axios';


export const useFetchData = (endpoint: string, setError: (error: boolean) => void, setErrorMessage: (message: string) => void) => {
    const [reFetch, setReFetch] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<any>(null);

    useEffect(() => {
        if (reFetch === true) {
            console.log(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}`)
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}`)
                .then((response: any) => {
                    if (response.data["success"] === false) {
                        setError(true);
                        setErrorMessage(response.data["message"]);
                        return;
                    }
                    setResponseData(response.data);
                })
                .catch((error: any) => {
                    console.error(error);
                    setError(true);
                    setErrorMessage(error.code + " - " + error.message);
                });
            setReFetch(false);
        }
    }, [reFetch]);

    return { responseData, reFetch, setReFetch };
}