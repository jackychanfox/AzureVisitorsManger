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
    ScrollView,
    KeyboardAvoidingView,
    Animated,
} from 'react-native';


import { Actions } from 'react-native-router-flux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import CountryPicker from 'react-native-country-picker-modal'
import Camera from 'react-native-camera'
import DatePicker from 'react-native-datepicker'

import * as commonStyles from '../styles/commonStyles'
import * as commonColors from '../styles/commonColors'
import { screenWidth, screenHeight } from '../styles/commonStyles';

import * as config from '../config'
import Cache from '../utils/cache'

import azureService from '../services/azureService'

const IMAGE_HEIGHT = 200
const IMAGE_HEIGHT_SMALL = 10

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: Cache.user.firstname || '',
            lastname: Cache.user.lastname || '',
            email: Cache.user.email || '',
            address: Cache.user.address || '',
            company: Cache.user.company || '',
            password: Cache.user.password || '',
            phone: Cache.user.phone || '',
            cityIndex: Cache.user.cityIndex || -1,
            bShowConfirmPassword: Cache.user.bShowConfirmPassword || true,
            loggingIn: Cache.user.loggingIn || false,
            cca2: Cache.user.cca2 || 'US',
            callingCode: Cache.user.callingCode || '1',
            expireDate: '',
            

            captured: true,
            picture: {uri:`data:image/jpeg;base64,${Cache.avatar}`},
            isAuth: false,
            isNewPicture:true,
            hideCamera: true,
        };

        this.keyboardHeight = new Animated.Value(0);
        this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    }


    retryCapture() {
        this.setState({ captured: false, hideCamera: false })
        //this.camera.startPreview()
    }

    onToggleConfirmPassword() {
        this.setState({ bShowConfirmPassword: !this.state.bShowConfirmPassword });
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height,
            }),
            Animated.timing(this.imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT_SMALL,
            }),
        ]).start();
    };

    keyboardWillHide = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: 0,
            }),
            Animated.timing(this.imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT,
            }),
        ]).start();
    };

    renderNavBar() {
        return (
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => this.back()}>
                    <IonIcons name="md-arrow-back" size={30} color={commonColors.textColor2} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Register</Text>
                <TouchableOpacity onPress={() => this.retryCapture()} >
                    <IonIcons name="md-refresh" size={30} color={commonColors.textColor1} style={styles.navRightIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.takePicture()} disabled={this.state.captured}>
                    <IonIcons name="ios-camera" size={30} color={commonColors.textColor1} style={styles.navRightIcon} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => this.addPicture()}>
                    <IonIcons name="ios-add" size={30} color={commonColors.textColor1} style={styles.navRightIcon} />
                </TouchableOpacity> */}
            </View>
        )
    }

    back() {
        this.setState({hideCamera:true})
        if ( this.props.onBack )
            this.props.onBack()
        Actions.pop()
    }

    signature() {
        if ( this.state.firstname == '' || this.state.firstname == undefined ){
            Alert.alert('Please enter your first name.');
            return;
        }
        if ( this.state.lastname == '' || this.state.lastname == undefined ){
            Alert.alert('Please enter last first name.');
            return;
        }
        if ( this.state.email == '' || this.state.email == undefined ){
            Alert.alert('Please enter your email.');
            return;
        }
        if ( this.state.company == '' || this.state.company == undefined ){
            Alert.alert('Please enter your company.');
            return;
        }
        if ( this.state.address == '' || this.state.address == undefined ){
            Alert.alert('Please enter your address.');
            return;
        }
        // if ( this.state.password == '' || this.state.password == undefined ){
        //     Alert.alert('Please enter your password.');
        //     return;
        // }
        // if ( !this.state.isAuth ){
        //     Alert.alert('Please add your photo till you will authorized.');
        //     return;
        // }
        Cache.user = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            company: this.state.company,
            address: this.state.address,
            // password: this.state.password,
            expireDate: this.state.expireDate,
            createdAt: new Date().toISOString().slice(0,10),
            phone: this.state.phone,
            // cityIndex: this.state.cityIndex,
            // bShowConfirmPassword: this.state.bShowConfirmPassword,
            // loggingIn: this.state.loggingIn,
            // cca2: this.state.cca2,
            // callingCode: this.state.callingCode,
        }
        this.setState({hideCamera:true})
        Actions.Signature({onBack:()=>{
            setTimeout(()=>this.setState({hideCamera:false}),1000)
        }})
    }

    renderInput() {
        return (
            <View style={styles.inputContainer}>
                <View style={{ flexDirection: 'row', marginHorizontal: 40 }}>
                    <TextInput
                        ref="firstname"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Name"
                        placeholderTextColor={commonColors.placeholderText}
                        textAlign="left"
                        style={[styles.input, { marginHorizontal: 0, flex: 1 }]}
                        underlineColorAndroid="transparent"
                        returnKeyType={'next'}
                        value={this.state.firstname}
                        onChangeText={(text) => this.setState({ firstname: text.replace(/\t/g, '') })}
                        onSubmitEditing={() => this.refs.lastname.focus()}
                        maxLength={10}
                    />
                    <View style={{ width: 5 }} />
                    <TextInput
                        ref="lastname"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Surname"
                        placeholderTextColor={commonColors.placeholderText}
                        textAlign="left"
                        style={[styles.input, { marginHorizontal: 0, paddingHorizontal: 20, flex: 1 }]}
                        underlineColorAndroid="transparent"
                        returnKeyType={'next'}
                        value={this.state.lastname}
                        onChangeText={(text) => this.setState({ lastname: text.replace(/\t/g, '') })}
                        onSubmitEditing={() => this.refs.company.focus()}
                        maxLength={10}
                    />
                </View>
                <TextInput
                    ref="company"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Company"
                    placeholderTextColor={commonColors.placeholderText}
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={'next'}
                    value={this.state.company}
                    onChangeText={(text) => this.setState({ company: text.replace(/\t/g, '') })}
                    onSubmitEditing={() => this.refs.address.focus()}
                    maxLength={20}
                />
                <TextInput
                    ref="email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Email"
                    placeholderTextColor={commonColors.placeholderText}
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={'next'}
                    value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text.replace(/\t/g, '') })}
                    onSubmitEditing={() => this.refs.password.focus()}

                />
                <TextInput
                    ref="address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="ID Number"
                    placeholderTextColor={commonColors.placeholderText}
                    textAlign="left"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    returnKeyType={'next'}
                    value={this.state.address}
                    onChangeText={(text) => this.setState({ address: text.replace(/\t/g, '') })}
                    onSubmitEditing={() => this.refs.email.focus()}
                    maxLength={15}
                />
                
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref="phone"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Phone"
                        placeholderTextColor={commonColors.placeholderText}
                        textAlign="left"
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        keyboardType='phone-pad'
                        value={this.state.phone}
                        onChangeText={(text) => this.setState({ phone: text.replace(/\t/g, '') })}
                        maxLength={15}
                    />
                    
                </View>
                <View style={styles.inputWrapper}>
                    <DatePicker
                        style={{
                            height:48,
                            marginHorizontal:40,
                            borderColor: '#aaa',
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderRadius: 3,
                            marginBottom:3,
                            width: screenWidth - 80,
                        }}
                        customStyles={{
                            dateInput:{borderWidth:0}
                        }}
                        confirmBtnText="Done"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        date={this.state.expireDate}
                        placeholder="Expiry Date"
                        mode="date"
                        formate="YYYY-MM-DD"
                        onDateChange={(date)=>this.setState({expireDate:date})}
                    />
                </View>
            </View>

        )
    }
    renderBottomButton() {
        return (
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.signature()}
                    style={styles.signatureButton}>
                    <Text style={styles.buttonText}>Signature</Text>
                </TouchableOpacity>
            </View>
        )
    }

    takePicture() {
        const options = {};
        this.setState({ captured: true , picutre:null})
        //options.location = ...
        this.camera.capture({ metadata: options })
            .then((data) => {
                this.setState({ picture: {uri:`data:image/jpeg;base64,${data.data}`}, recognized: false, isNewPicture:true })
                Cache.avatar = data.data
                //this.camera.stopPreview()
            })
            .catch(err => console.error(err));
    }

    addPicture(){
        if ( this.state.isNewPicture == false ){
            Alert.alert('-----')
            return;
        }
        this.setState({isNewPicture:true})
        if ( this.personID == null ){
            if ( this.state.firstname == '' || this.state.lastname == '' ){
                Alert.alert('please enter your name')
                return;
            }
            let name = this.state.firstname + ' ' + this.state.lastname
            azureService.faceSingup(name, Cache.avatar, (err, res)=>{
                //console.log(err, res)
                this.personID = res.personID
            })
        }else{
            azureService.addPicture(this.personID, Cache.avatar, (err, res)=>{
                //console.log(err, res)
            })    
        }
    }

    renderCameraView() {
        return (
            <Animated.View style={[styles.cameraContainer, { height: this.imageHeight }]}>
                {!this.state.hideCamera&&<Camera
                    ref={(cam) => {
                        this.camera = cam;
                        //console.log("Camera2 Init")
                    }}
                    //onBarCodeRead={this.onBarCodeRead.bind(this)}
                    style={[styles.preview, {
                        height: this.state.captured ? 0 : '100%',
                        width: this.state.captured ? 0 : IMAGE_HEIGHT,
                        borderWidth: this.state.captured ? 0 : 3,
                        shadowRadius: this.state.captured ? 0 : 3,
                    }]}
                    type="front"
                    captureTarget={Camera.constants.CaptureTarget.memory}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>}
                {this.state.captured && <Animated.View style={styles.preview}>
                    <Image source={this.state.picture} style={{ width: '100%', height: '100%' }} />
                </Animated.View>}
            </Animated.View>
        )
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>

                    {this.renderCameraView()}
                    {this.renderInput()}
                    {this.renderBottomButton()}
                    {this.renderNavBar()}
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
    },
    navBar: {
        position:'absolute',
        width:'100%',
        top: 10,
        height: config.headerHeight,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: commonColors.border,
        zIndex: 10000
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
    inputContainer: {
        marginTop:10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    textDescription: {
        color: 'rgb(0, 0, 0)',
        //fontFamily: 'OpenSans-Semibold',
        fontSize: 12,
        paddingTop: 5,
        backgroundColor: 'transparent',
    },
    textInvite: {
        color: 'rgb(0, 0, 0)',
        //fontFamily: 'Open Sans',
        fontSize: 12,
        paddingVertical: 5,
        backgroundColor: 'transparent',
    },
    imageEye: {
        width: 20,
        height: 13,
    },
    eyeButtonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        right: 40,
    },
    inputWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    input: {
        fontSize: 14,
        color: commonColors.title,
        height: 48,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        borderColor: '#aaa',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 3,
        marginBottom: 3,
        paddingHorizontal: 20,
    },
    signupButtonWrapper: {
        marginTop: 16,
        alignSelf: 'stretch',
    },
    buttonSignup: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: commonColors.button,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: commonColors.button,
        borderStyle: 'solid',
        marginHorizontal: 40,
        height: 48,
    },
    textButton: {
        color: '#fff',
        //fontFamily: 'Open Sans',
        fontWeight: 'bold',
        fontSize: 20,
        backgroundColor: 'transparent',
    },
    textTitleButton: {
        color: 'rgb(0, 0, 0)',
        //fontFamily: 'Open Sans',
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    CreateAccount: {
        color: 'rgb(0, 0, 0)',
        //fontFamily: 'Open Sans',
        fontSize: 14,
        backgroundColor: 'transparent',
        top: 100,
    },
    descriptionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: screenWidth * 0.12,
        marginTop: 32,
    },
    textTitle: {
        color: 'rgb(0, 0, 0)',
        //fontFamily: 'Blanch',
        fontSize: 20,
    },
    buttonWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    button: {
        width: screenWidth * 0.15,
        height: screenWidth * 0.12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 20,
        height: 20,
    },

    cameraContainer: {
        width: '100%',
        // height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:70
    },
    preview: {
        height: '100%',
        width: IMAGE_HEIGHT,
        //borderRadius:4,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 }
        //backgroundColor:'white',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
    captureButton: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: commonColors.theme2,
        borderRadius: 3,
        width: 120,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    captureText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 8,
    },
    bottomContainer: {
        height: 48,
        width: '100%',
        flexDirection: 'row',
    },
    signatureButton: {
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
