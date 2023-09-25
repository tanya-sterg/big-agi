import { useCallback } from 'react'; // Directly importing useCallback
import { useRouter } from 'next/router'; // Importing useRouter

export function useShowNewsOnUpdate() {
    // function implementation
}
export function useMarkNewsAsSeen() {
  const { push } = useRouter(); // using useRouter
  
  return useCallback((keyword: string) => { // Directly using useCallback without React prefix
    if(keyword === 'aitt23') {
      useAppStateStore.getState().setLastSeenNewsVersion(incrementalVersion);
      push('/'); // redirects to the home or app page
    }
  }, [push]);
}
