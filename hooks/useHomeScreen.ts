// hooks/useHomeScreen.ts
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useHouseStore } from '@/store/useHouseStore';
import { houseService } from '@/services/api/house.service';
import { ratingService } from '@/services/api/rating.service';

interface Member {
  id: string;
  name: string;
  type: 'tenant' | 'maintainer';
  username: string;
  image_url: string | null;
}

interface HouseDetails {
  house_id: string;
  name: string;
  address: string;
  members: Member[];
}

export function useHomeScreen() {
  const { user } = useAuthStore();
  const { setCurrentHouse, currentHouse } = useHouseStore();
  

 // Add logging to debug
  // console.log('[ useHomescreen ] User:', user);
  // console.log('[ useHomeScreen ]Current House:', currentHouse);

  // Fetch house details and members
  const { data: houseData, isLoading: isHouseLoading } = useQuery({
    queryKey: ['house', user?.houseId],
    queryFn: async () =>{ 
      console.log('[House Query] Fetching house data:', {
        houseId: user?.houseId,
        timestamp: new Date().toISOString()
      });

      // houseService.getHouse(user?.house_id)
      const response = await houseService.getHouse(user?.houseId as string);
      console.log('[House Query] Fetched house data:', response);
      setCurrentHouse(response);
      return response;
    },
    enabled: !!user?.houseId,
    onSuccess: (data) => {
      // console.log('use query On Sucess /house/', data);
      setCurrentHouse(data);
    },
    staleTime: Infinity,//5 min
    cacheTime: Infinity, // 30 min 
    // refetchInterval:5* 60* 1000 // Refetch every second

  });
  // console.log('use query /house/ l2', houseData);

  // Fetch ratings for each member
  const { data: ratingsData, isLoading: isRatingsLoading } = useQuery({
    queryKey: ['ratings', user?.id],
    queryFn: async () => {
      // console.log('[Ratings Query] Fetching ratings data:', user?.id);
      if (!houseData?.members) return {};
      
      const ratings = {};
      for (const member of houseData.members) {
        // console.log('Fetting rating of member id:', member.user.id);

        try {
          // console.log('Fetting rating of member id:', member.id);
          const memberRatings = await ratingService.getUserRatings(member.user.id);
          // console.log('Rating of member id:', memberRatings);

          ratings[member.user.id] = memberRatings;
        } catch (error) {
          // console.error(`Failed to fetch ratings for member ${member.id}:`, error);
          ratings[member.user.id] = null;
        }
      }
      // console.log('Ratings of all members:', ratings);

      return ratings;
    },
    enabled: !!houseData?.members,
    staleTime: Infinity, // data is fetched only once and stored
    cacheTime: Infinity,
  });

  const getMemberWithRatings = (memberId: string) => {

    // const member = houseData?.members.find(m => m.id === memberId);
    const member = houseData?.members.find(m => m.user.id === memberId)?.user;
    // console.log('houseData:', houseData);
    const ratings = ratingsData?.[memberId];
    // console.log('Member with ratings:', { ...member, ratings });
    return { ...member, ratings };
  };

  return {
    houseData,
    isLoading: isHouseLoading || isRatingsLoading,
    getMemberWithRatings,
    members: houseData?.members || [],
    ratings: ratingsData || {},
  };
}