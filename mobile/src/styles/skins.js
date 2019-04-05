import { StyleSheet, Platform } from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B2936',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
    },
    mainContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    skinContainer: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0ae',
        padding: vmin(2),
        margin: vmin(4),
        width: vmin(80),
        justifyContent: "center",
        alignItems: "center",
    },
    Image: {
        marginTop: vmin(2.5),
        marginBottom: vmin(2.5),
        marginLeft: vmin(3.5),
        width: vmin(50),
        height: vmin(50),
    },
    Text: {
        color: 'white'
    }
});