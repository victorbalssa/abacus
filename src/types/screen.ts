import { TransactionSplitType } from '../models/transactions';

interface filterScreenParamsType {
  filterType: string;
  selectFilter: (filter: string) => void;
}
export interface NavigationType {
  dispatch: (action) => void;
  setParams: (params) => void;
  goBack: () => void;
  setOptions: (options) => void;
  navigate: (screen: string, params: filterScreenParamsType) => void;
}

export interface ScreenType {
  navigation: NavigationType;
  route?: {
    params?: {
      payload?: {
        splits?: TransactionSplitType[];
        groupTitle?: string
      };
      id?: string;
      forceRefresh?: boolean | undefined;
      noRedirect?: boolean;
      filterType?: string;
      selectFilter?: (filter: string) => void;
    }
  }
}

export interface OauthConfigType {
  backendURL: string;
  oauthClientId: string;
  oauthClientSecret: string;
  personalAccessToken: string;
}
