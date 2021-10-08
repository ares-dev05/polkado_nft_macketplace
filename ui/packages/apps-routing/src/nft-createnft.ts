// Copyright 2017-2021 @polkadot/apps-routing, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import React from 'react';

import { Route } from './types';

// import Component from '@polkadot/app-nft-wallet';

const Component = React.lazy(() => import('../../react-components/src/ManageCollection'));

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'nft',
    icon: 'users',
    name: 'createnft',
    text: t('nav.creaetNft', 'Create NFT', { ns: 'apps-routing' })
  };
}
