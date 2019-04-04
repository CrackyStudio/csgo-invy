import { StyleSheet, Platform } from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#1B2936',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
        alignItems: 'center'
    },
    logoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: vmin(100)
    },
    logo: {
        marginTop: vmin(10),
        marginBottom: vmin(10),
        width: vmin(40),
        height: vmin(40)
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: vmin(100)
    },
    input: {
        backgroundColor: '#5F6971',
        color: 'white',
        height: vmin(8),
        marginBottom: vmin(3.5),
        width: vmin(60),
        paddingLeft: 10,
        paddingRight: 10,
    },
    loadingContainer: {
        paddingTop: vmin(10),
        alignItems: 'center'
    },
    loadingText: {
        color: 'white'
    },
    loadingIndicator: {
        paddingTop: vmin(3),
        paddingBottom: vmin(3)
    },
    devContainer: {
        flexDirection: 'row',
        height: vmin(10),
        width: vmin(100),
    },
    devName: {
        height: vmin(10),
        width: vmin(50),
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    name: {
        color: 'white',
        padding: vmin(1)
    },
    devVersion: {
        height: vmin(10),
        width: vmin(50),
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    version: {
        color: 'white',
        padding: vmin(1)
    }
});