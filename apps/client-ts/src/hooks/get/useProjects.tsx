import config from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { projects as Project } from 'api';
import Cookies from 'js-cookie';


const useProjects = () => {
  return useQuery({
    queryKey: ['projects'], 
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch(`${config.API_URL}/projects`,
      {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
        },
      });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    }
  });
};

export default useProjects;
