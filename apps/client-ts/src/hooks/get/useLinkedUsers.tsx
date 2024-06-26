import config from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { linked_users as LinkedUser } from 'api';
import Cookies from 'js-cookie';

const useLinkedUsers = () => {
  return useQuery({
    queryKey: ['linked-users'], 
    queryFn: async (): Promise<LinkedUser[]> => {
      const response = await fetch(`${config.API_URL}/linked-users`,
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
export default useLinkedUsers;
