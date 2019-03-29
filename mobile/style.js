import { StyleSheet, Platform } from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F1F1F',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
    },
    text: {
        color: '#0ae',
    },
    navbar: {
        backgroundColor: '#1F1F1F',
        width: vmin(100),
        height: vmin(15),
        justifyContent: 'center',
        flexDirection: 'row',
    },
    logo: {
        marginTop: vmin(2.5),
        marginBottom: vmin(2.5),
        marginLeft: vmin(3.5),
        width: vmin(10),
        height: vmin(10),
    },
    itemImage: {
        marginTop: vmin(2.5),
        marginBottom: vmin(2.5),
        marginLeft: vmin(3.5),
        width: vmin(30),
        height: vmin(30),
    },
    input: {
        backgroundColor: '#5F6971',
        color: 'white',
        height: vmin(8),
        margin: vmin(3.5),
        width: vmin(50),
        paddingLeft: 10,
        paddingRight: 10,
    },
    main: {
        flex: 1,
        backgroundColor: '#1B2936',
    },
    buttonContainer: {
        width: vmin(20),
        height: vmax(8),
        margin: vmin(2.5),
    },
    mainContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        color: "white",
    },
    itemContainer: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'white',
        padding: vmin(2),
        margin: vmin(4),
        width: vmin(80),
        justifyContent: "center",
        alignItems: "center",
    },
    picker: {
        color: "white",
        backgroundColor: "#0ae", //#1B2936
        width: vmin(60),
        height: vmin(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemStyle: {
        textAlign: 'center',
    },
    weaponPicker: {
        backgroundColor: "#0ae",
        alignItems: 'center',
        flexDirection: 'row',
    },
    selectedWeapon: {
        paddingLeft: vmin(3),
        color: 'white',
        backgroundColor: "#0ae",
    }
});