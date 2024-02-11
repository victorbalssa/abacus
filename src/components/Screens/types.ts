import { TransactionSplitType } from '../../models/transactions';

export type ScreenType = {
  navigation: {
    dispatch: (action) => void,
    setParams: (params) => void,
    goBack: () => void,
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
  backendURL: string,
  oauthClientId: string,
  oauthClientSecret: string,
  personalAccessToken: string,
}
