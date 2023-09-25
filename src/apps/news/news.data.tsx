import * as React from 'react';

import { Box } from '@mui/joy';

import { Brand } from '~/common/brand';
import { Link } from '~/common/components/Link';
import { clientUtmSource } from '~/common/util/pwaUtils';


// update this variable every time you want to broadcast a new version to clients
export const incrementalVersion: number = 1;

// news and feature surfaces
export const NewsItems: NewsItem[] = [
  {
    versionName: '1.2.1',
    items: [
      { text: <>Visite <b><Link href="https://targetteal.com/pt/ia/" target='_blank'>targetteal.com</Link></b> para obter a palavra chave</> },
    ],
  },
];


interface NewsItem {
  versionName: string;
  text?: string | React.JSX.Element;
  items?: {
    text: string | React.JSX.Element;
  }[];
}
