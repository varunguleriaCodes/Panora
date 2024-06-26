import config from '@/lib/config';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

interface IProDto {
    name: string;
    id_user: string; 
}

const useCreateProject = () => {    
    const add = async (data: IProDto) => {
        const response = await fetch(`${config.API_URL}/projects`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to add project');
        }
        
        return response.json();
    };
    const createProjectsPromise = (data: IProDto) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await add(data);
                resolve(result);
                
            } catch (error) {
                reject(error);
            }
        });
    };
    return {
        mutationFn: useMutation({
            mutationFn: add,
        }),
        createProjectsPromise
    }
};

export default useCreateProject;
