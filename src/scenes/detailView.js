'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Keyboard,
    findNodeHandle,
    TouchableWithoutFeedback,
    Alert,
    StatusBar,
    NativeModules,
    CameraRoll,
} from 'react-native';


import { Actions } from 'react-native-router-flux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import Camera from 'react-native-camera'
import RNFetchBlob from 'react-native-fetch-blob'

import * as commonStyles from '../styles/commonStyles'
import * as commonColors from '../styles/commonColors'
import { screenWidth, screenHeight } from '../styles/commonStyles';

import * as config from '../config'
import Cache from '../utils/cache'

import azureService from '../services/azureService'

export default class DetailView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            captured: false,
            recognized: 0,
            picture: null,
            name: '',
            personId: '',
            hideCamera: false,
        };
    }

    goPrintPage() {
        CameraRoll.saveToCameraRoll(Cache.Profile.Badge).then(
            Alert.alert('Success', 'Badge card added to camera roll!')
        )
    }

    back() {
        Actions.pop()
    }

    renderNavBar() {
        return (
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => this.back()}>
                    <IonIcons name="md-arrow-back" size={30} color={commonColors.textColor2} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Detail</Text>
                <TouchableOpacity onPress={() => this.goPrintPage()}>
                    <IonIcons name="md-print" size={30} color={commonColors.textColor2} style={styles.navRightIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    back() {
        Actions.pop()
    }

    renderMainView() {
        return (
            <View style={styles.mainContainer}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={styles.photoContainer}>
                        <Image source={{ uri: Cache.Profile.Picture }} style={styles.ImgStyle} />
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <View style={{ flexDirection: 'row', marginTop:15 }}>
                        <Text style={{width:120, fontSize:14}}>Surname: </Text>
                        <Text style={{fontSize:14}}>{Cache.Profile.Surname}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop:15 }}>
                        <Text style={{width:120, fontSize:14}}>Name: </Text>
                        <Text style={{fontSize:14}}>{Cache.Profile.Name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop:15 }}>
                        <Text style={{width:120, fontSize:14}}>Company: </Text>
                        <Text style={{fontSize:14}}>{Cache.Profile.Company}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop:15 }}>
                        <Text style={{width:120, fontSize:14}}>ID Number: </Text>
                        <Text style={{fontSize:14}}>{Cache.Profile.Address}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop:15 }}>
                        <Text style={{width:120, fontSize:14}}>Phone: </Text>
                        <Text style={{fontSize:14}}>{Cache.Profile.Phone}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop:15 }}>
                        <Text style={{width:120, fontSize:14}}>Email: </Text>
                        <Text style={{fontSize:14}}>{Cache.Profile.Email}</Text>
                    </View>

                </View>
            </View>
        )
    }


    renderBottomButton() {
        return (
            <View style={styles.bottomContainer}>
                <Text style={styles.buttonText}>
                    Expire On : {Cache.Profile.ExpiryDate}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                {this.renderNavBar()}
                {this.renderMainView()}
                {this.renderBottomButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(245, 245, 245)',
    },
    navBar: {
        paddingTop: 30,
        height: config.headerHeight,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: commonColors.border
    },
    navTitle: {
        marginLeft: 20,
        fontSize: 18,
        color: commonColors.textColor1,
        flex: 1,
    },
    backIcon: {
        marginTop: 3
    },
    mainContainer: {
        flex: 1,
        padding: 30,

        // width: '100%',
        // marginTop: 30,
        //height: 300,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    preview: {
        height: 200,
        width: 200,
        //borderRadius:4,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 }
        //backgroundColor:'white',
    },

    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        paddingHorizontal: 10,
        width: '100%',
    },

    buttonText: {
        color: 'black',
        fontSize: 16,
        //marginLeft:10,
        fontWeight: 'bold'
    },
    photoContainer: {
        width: 160,
        height: 160,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 },
        backgroundColor: 'transparent',
    },
    ImgStyle: {
        width: '100%',
        height: '100%',
    },
    listContainer: {
        marginTop: 30,
        // width: '100%',
        // //paddingHorizontal: 5,        
        // justifyContent: 'center',
        // marginLeft: 20,
    },
    listText: {
        marginTop: 30,
        color: 'rgba(0, 0, 0, 0.9)',
        fontSize: 20,
    },
});
