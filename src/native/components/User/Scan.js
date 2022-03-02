import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import { View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Loading from '../UI/Loading';
import { StatusBar } from 'expo-status-bar';

const Scan = ({ handleValidateTicket, loading }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        handleValidateTicket(data);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}>
            <StatusBar style="light"/>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}
            />
            {loading && <Loading/>}

            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)}/>}
        </View>);
};

Scan.propTypes = {
    member: PropTypes.shape({}),
    logout: PropTypes.func.isRequired,
};

Scan.defaultProps = {
    member: {},
};

export default Scan;
