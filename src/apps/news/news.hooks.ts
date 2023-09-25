import * as React from 'react';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';
import { useAppStateStore } from '~/common/state/store-appstate';
import { incrementalVersion } from './news.data';

export function useShowNewsOnUpdate() {
  const { push } = useRouter();
  const { usageCount, lastSeenNewsVersion } = useAppStateStore(state => ({
    usageCount: state.usageCount,
    lastSeenNewsVersion: state.lastSeenNewsVersion,
  }), shallow);

  React.useEffect(() => {
    const isNewsOutdated = (lastSeenNewsVersion || 0) < incrementalVersion;
    if (isNewsOutdated && usageCount > 2) {
      // Disable for now
      push('/news').then(() => null);
    }
  }, [lastSeenNewsVersion, push, usageCount]);
}

export function useMarkNewsAsSeen() {
  const { push } = useRouter(); // Use useRouter to perform redirections

  return React.useCallback((keyword: string) => {
    if (keyword === 'aitt23') {
      // If the keyword is correct, mark the news as seen and redirect to the app/home page
      useAppStateStore.getState().setLastSeenNewsVersion(incrementalVersion);
      push('/'); // redirects to the home or app page
    } else {
      // If the keyword is incorrect, show an alert
      alert('Invalid Keyword!');
    }
  }, [push]);
}
