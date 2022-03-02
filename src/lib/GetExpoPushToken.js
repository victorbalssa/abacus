import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const registerForPushNotificationsAsync = async () => new Promise(async (resolve, reject) => {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            reject('Failed to get push token for push notification!');
        }

        let token = await Notifications.getExpoPushTokenAsync();

        resolve(token.data);
    } else {

        reject('Must use physical device for Push Notifications');
    }
});

export default registerForPushNotificationsAsync;
