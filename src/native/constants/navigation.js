import styles from '../../constants/colors';

export default {
    navbarProps: {
        navigationBarStyle: { backgroundColor: styles.backgroundColor },
        titleStyle: {
            color: '#fff',
            alignSelf: 'center',
            letterSpacing: 1,
            fontSize: styles.fontSizeBase,
        },
        backButtonTintColor: '#fff',
    },

    tabProps: {
        swipeEnabled: true,
        legacy: true,
        inactiveBackgroundColor: styles.backgroundColor,
        tabBarStyle: {
            backgroundColor: styles.backgroundColor,
            height: 75,
            margin: 0,
            padding: 0,
            borderWidth: 0,
            borderColor: styles.backgroundColor,
            borderTopWidth: 0,
        },
        labelStyle: {
            color: styles.backgroundColor,
            fontFamily: styles.fontFamily,
        },
    },

    icons: { height: 22, width: 22 },
};
