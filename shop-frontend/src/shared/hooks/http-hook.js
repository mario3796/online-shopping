import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async(url, method='GET', body = null, headers = {}) => {
        try {
            setIsLoading(true)
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: httpAbortCtrl.signal
            })
            const data = await response.json();
            console.log(data);

            activeHttpRequests.current = activeHttpRequests.current
            .filter(reqCtrl => reqCtrl !== httpAbortCtrl)

            if(!response.ok) {
                throw new Error(data.message)
            }
            setIsLoading(false)
            return data
        } catch(err) {
            setIsLoading(false)
            setError(err.message)
            throw err
        }
    }, []);

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

    return { isLoading, error, sendRequest }
}