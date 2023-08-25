import { TransactionSplitType } from '../../models/transactions';

export type ScreenType = {
  navigation: {
    dispatch: (action) => void,
    setParams: (params) => void,
  },
  route?: {
    params?: {
      payload?: {
        splits?: TransactionSplitType[]
        groupTitle?: string
      }
      id?: string
      forceRefresh?: boolean | undefined
    }
  }
}

export type OauthConfigType = {
  oauthClientId: string,
  oauthClientSecret: string,
  personalAccessToken: string,
}
