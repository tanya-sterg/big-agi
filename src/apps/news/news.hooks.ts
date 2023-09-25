import * as React from 'react';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';
import { useAppStateStore } from '~/common/state/store-appstate';
import { incrementalVersion } from './news.data';

export function useShowNewsOnUpdate() {
  const { push } = useRouter();
  const { lastSeenNewsVersion } = useAppStateStore(state => ({
    lastSeenNewsVersion: state.lastSeenNewsVersion,
  }), shallow);

  React.useEffect(() => {
    console.log('Checking if news is outdated');
    const isNewsOutdated = (lastSeenNewsVersion || 0) < incrementalVersion;
    console.log(`Is News Outdated: ${isNewsOutdated}, Last Seen: ${lastSeenNewsVersion}, Current Version: ${incrementalVersion}`);
    if (isNewsOutdated) {
      console.log('Redirecting to News Page');
      push('/news').then(() => null);
    }
  }, [lastSeenNewsVersion, push]);
}

export function useMarkNewsAsSeen() {
  const { push } = useRouter();

  return React.useCallback((keyword: string) => {
    if (keyword === 'aitt23') {
      console.log('Correct keyword, updating the last seen news version and redirecting to home');
      useAppStateStore.getState().setLastSeenNewsVersion(incrementalVersion);
      push('/'); // redirects to the home or app page
    } else {
      console.log('Incorrect keyword');
      alert('Invalid Keyword!');
    }
  }, [push]);
}
