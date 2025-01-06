import { Action } from 'expo-quick-actions';

export type AbacusQuickAction = Action & {
    params: {
        href: string;
    };
};
