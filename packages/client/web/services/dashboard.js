import axios from 'axios';


export async function getResource(){
    const { data } = await axios.get(`http://localhost:3333/dashboard`);
    return data;
}