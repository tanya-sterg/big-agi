import * as React from 'react';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';

import { useAppStateStore } from '~/common/state/store-appstate';

import { incrementalVersion } from './news.data';


export function useShowNewsOnUpdate() {
  const { push } = useRouter();
  React.useEffect(() => {
    // Sempre redireciona para a página de notícias
    push('/news').then(() => null);
  }, [push]); // Dependência do useEffect
}

export function useMarkNewsAsSeen() {
  React.useEffect(() => {
    useAppStateStore.getState().setLastSeenNewsVersion(incrementalVersion);
  }, []);
}
