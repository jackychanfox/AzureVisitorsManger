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
    TouchableHighlight,
    CameraRoll
} from 'react-native';


import { Actions } from 'react-native-router-flux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import Viewshot from 'react-native-view-shot'

import * as commonStyles from '../styles/commonStyles'
import * as commonColors from '../styles/commonColors'
import { screenWidth, screenHeight } from '../styles/commonStyles';

import * as config from '../config'
import Cache from '../utils/cache'

import azureService from '../services/azureService'
import UtilService from '../utils/utils'

export default class Print extends Component {
    constructor(props) {
        super(props);
        // Cache.user = {
        //     firstname: 'jacky',
        //     lastname: 'chan',
        //     company: 'Rocktree',
        //     address: 'China Liaoning Shenyang',
        //     createdAt: '2018-03-05',
        //     expireDate: '2019-03-05'
        // }

        this.state = {
            image: null,
            logo: commonStyles.logo,
            data: [
                { title: 'Name', content: Cache.user.firstname},
                { title: 'Surname', content: Cache.user.lastname},
                { title: 'Company', content: Cache.user.company || 'Rocktree' },
                { title: 'ID Number', content: Cache.user.address || '' },
            ],
            date: [
                { title: 'Date of issue', content: Cache.user.createdAt || '' },
                { title: 'Date of expiry', content: Cache.user.expireDate || '' },
            ],
            avatar: { uri: `data:image/jpeg;base64,${Cache.avatar}` },
            saving: false,
        };
    }

    renderNavBar() {
        return (
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => this.back()} disabled={this.state.saving}>
                    <IonIcons name="md-arrow-back" size={30} color={commonColors.textColor2} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Badge Card</Text>
            </View>
        )
    }

    back() {
        Actions.pop()
    }

    componentDidMount() {
        

    }

    finishRegister() {
        if (this.registered) return;
        this.registered = true;
        this.setState({saving: true})

        this.refs.viewShot.capture().then(res => {
            this.setState({ image: { uri: `data:image/jpeg;base64,${res}` } })
            Cache.badge = res
            CameraRoll.saveToCameraRoll(`data:image/jpeg;base64,${res}`)





            azureService.faceSingup(this.state.data[0].content, Cache.avatar, (err, res) => {
                if (err != null) {
                    this.setState({saving:false})
                    Alert.alert('Fail to sign up face')
                    return;
                }
                azureService.uploadImage(Cache.avatar, (err1, pictureUri) => {
                    //console.log(err1, pictureUri)
                    if (err1 != null) {
                        this.setState({saving:false})
                        Alert.alert('Fail to upload picture')
                        return;
                    }
                    azureService.uploadImage(Cache.signature, (err2, signatureUri) => {
                        //console.log(err2, signatureUri)
                        if (err2 != null) {
                            this.setState({saving:false})
                            Alert.alert('Fail to upload signature')
                            return;
                        }
                        azureService.uploadImage(Cache.badge, (err3, badgeUri) => {
                            console.log(err3, badgeUri)
                            if (err3 != null) {
                                this.setState({saving:false})
                                Alert.alert('Fail to upload badge')
                                return;
                            }
                            // CameraRoll.saveToCameraRoll(badgeUri)
                            azureService.insertPerson({
                                FaceId: '',
                                PersonId: res.personID,
                                PersistentId: '',
                                Name: Cache.user.firstname,
                                Surname: Cache.user.lastname,
                                Company: Cache.user.company,
                                Address: Cache.user.address,
                                IdNumber: Cache.user.address,
                                Phone: Cache.user.phone,
                                Email: Cache.user.email,
                                ExpiryDate: Cache.user.expireDate,
                                Picture: pictureUri,
                                Signature: signatureUri,
                                Badge: badgeUri
                            }, (err4, res4) => {
                                //console.log( pictureUri, signatureUri, res4)
                                Alert.alert('Success', 'Added your badge card to camera roll and uploaded your profile.')
                                this.setState({saving:false})
                                Cache.user = {}
                                Actions.RecogFace()

                            })
                        })
                    })
                })
            })
            
        });


    }

    renderBottomButton() {
        return (
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    disabled={this.state.saving}
                    activeOpacity={0.8}
                    onPress={() => this.finishRegister()}
                    style={[styles.doneButton, {backgroundColor:this.state.saving?'grey' : commonColors.button}]}>

                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderPreviewCard() {
        return (
            <Viewshot ref="viewShot" options={{ format: "jpg", quality: 0.9, result: 'base64', width:700, height:400 }} width={1050} height={600} >
                <View style={styles.cardContainer}>
                    {/* <View style={styles.logoContainer}>
                        <Image source={this.state.logo} style={styles.logo} />
                    </View>
                    <View style={styles.cardRightContainer}>
                        <Text numberOfLines={1} style={styles.avatarName}>{this.state.data[0].content}</Text>
                        <Image style={styles.avatar} source={this.state.avatar} />
                    </View>
                    <View style={styles.cardLeftContainer}>

                        {this.state.data.map((item, index) => {
                            return (
                                <View key={index} style={[styles.textContainer, {marginTop:index==3?20:0}]}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.content}>{item.content}</Text>
                                </View>
                            )
                        })}
                    </View> */}
                    <View style={styles.logoContainer}>
                        <Image source={this.state.logo} style={styles.logo} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ margin: 10 }}>
                            <Image style={styles.avatar} source={this.state.avatar} />
                        </View>
                        <View style={styles.cardLeftContainer}>
                            <View>
                                {this.state.data.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.textContainer}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <Text style={styles.content}>{item.content}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                            <View style={{marginTop:10}}>
                                {this.state.date.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.textContainer}>
                                            <Text style={[styles.title, {width:120}]}>{item.title}</Text>
                                            <Text style={[styles.content, {width:80}]}>{item.content}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </Viewshot>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderPreviewCard()}
                </View>
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
    navRightIcon: {
        marginLeft: 15,
        marginTop: 5,
    },
    cardContainer: {
        width: 350,
        height: 200,
        borderRadius: 5,
        borderColor: 'rgb(236,116,7)',
        borderWidth:1,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 }
    },
    cardLeftContainer: {
        padding: 10,
        paddingLeft: 0,
    },
    cardRightContainer: {
        flex: 1,
        padding: 10,
    },
    logoContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    logo: {
        width: 80,
        height: 30,
    },
    textContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    title: {
        width: 70,
        fontSize: 12,
        color: 'black',
        paddingLeft: 5,
    },
    content: {
        width: 140,
        fontSize: 10,
        color: commonColors.textColor1,
    },
    avatar: {
        marginTop: 10,
        width: 80,
        height: 80,
        backgroundColor: 'black'
    },
    avatarName: {
        width: 100,
        textAlign: 'center',
        color: commonColors.theme,
        fontSize: 14,
        fontWeight: 'bold'
    },
    bottomContainer: {

        height: 50,
        width: '100%',
        flexDirection: 'row',
    },
    doneButton: {
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
});
