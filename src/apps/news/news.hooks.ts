import { useRouter } from 'next/router'; // Importing useRouter

export function useShowNewsOnUpdate() {
    // function implementation
}
export function useMarkNewsAsSeen() {
  const { push } = useRouter(); // using useRouter
  return React.useCallback((keyword: string) => {
    if(keyword === 'aitt23') {
      useAppStateStore.getState().setLastSeenNewsVersion(incrementalVersion);
      push('/'); // redirects to the home or app page
    } else {
      alert('Invalid Keyword!');
    }
  }, [push]);
}
