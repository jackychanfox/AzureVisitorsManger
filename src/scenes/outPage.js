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
    NativeModules
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

export default class OutPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            captured: false,
            recognized: 0,
            picture: null,
            name:'',
            personId:'',
            hideCamera: false,
            goodbyeImg: commonStyles.good_bye,
            errMsg: null,
        };        
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
            </View>
        )
    }
    
    renderMainView() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.goodbyeContainer}>
                    <Text style={styles.goodbyeText}>
                        Good bye
                    </Text>
                </View>
                <View style={{flex: 1, marginTop: 150}}>
                    <Image source={this.state.goodbyeImg} style={styles.byeImageContainer}/>
                </View>
            </View>
        )
    }
    getLeadingZero(value){
        return (value<10?'0':'')+value
    }

    formatDate(time){
        let now = new Date(time)

        return now.getFullYear()+'-'+this.getLeadingZero(now.getMonth())+'-'+this.getLeadingZero(now.getDate())
            +' '+this.getLeadingZero(now.getHours())+':'+this.getLeadingZero(now.getMinutes())+':'+this.getLeadingZero(now.getSeconds())
    }

    goOut(){
        Alert.alert(
            'Are you sure?',
            'If you want to go out, please press OK',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        azureService.insertLog({
                            personId: Cache.Profile.PersonId,
                            dateOut: this.formatDate(Date.now())
                        }, (err, res)=>{
                            if ( err ) {
                                this.setState({errMsg:err})
                            }else{
                                // if ( this.props.onBack )
                                //     this.props.onBack()
                                Actions.pop()
                            }
                        })
                    }
                },
            ],
            { cancelable: false }
        )
        
    }

    renderBottomButton() {        
        return (
            <View style={styles.okContainer}>     
                
                <TouchableOpacity activeOpacity={0.8} style={styles.okButton}
                onPress={() => this.goOut()}>
                    <Text style={styles.buttonText}>Ok</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />    
                {this.renderNavBar()}            
                {this.renderMainView()}       
                {this.state.errMsg&&<Text style={{textAlign:'center', margin:20}}>
                    {this.state.errMsg}
                </Text>}
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
    backIcon: {
        marginTop: 3
    },
    mainContainer: {
        width: '100%',        
        justifyContent: 'center',
        alignItems: 'center'
    },
    preview: {
        height: 280,
        width: 280,
        //borderRadius:4,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 }
        //backgroundColor:'white',
    },  
   
    okContainer: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        width: '100%',
        backgroundColor: 'red',
        //flexDirection: 'row',
    },    
    okButton: {
        flex: 1,
        backgroundColor: commonColors.button,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        //marginLeft:10,
        fontWeight: 'bold'
    },
    goodbyeContainer: {
        marginTop: 100,
        width: '100%',        
        justifyContent: 'center',
        alignItems: 'center'
    },
    goodbyeText: {
        fontSize: 32,
        color: 'rgba(0, 0, 0, 0.9)',
    },
    byeImageContainer: {        
        width: 120,
        height: 120,        
        justifyContent: 'center',
        alignItems: 'center',
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
});
