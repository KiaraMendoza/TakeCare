import { useState, useEffect, useContext } from 'react';
import authContext from '../context/auth-context';

export const useFetchWithToken = (requestBody) => {
    const [fetchedData, setFetchedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useContext(authContext);

    useEffect(() => {
        setIsLoading(true);
        if (token) {
            fetch('https://takecare-socialapp.herokuapp.com:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed!');
                    }
                    return res.json();
                })
                .then(resData => {
                    //const resPostsData = resData.data.posts;
                    //this.setState({ posts: resPostsData, isLoading: false })
                    setIsLoading(false);
                    setFetchedData(resData.data);
                    return [isLoading, fetchedData];
                })
                .catch(err => {
                    setIsLoading(false);
                    throw err;
                });
        }
    }, [token]);

    console.log(`isLoading: ${isLoading}, fetchedData: ${fetchedData}`)
    return [isLoading, fetchedData];
};