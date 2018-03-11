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
} from 'react-native';


import { Actions } from 'react-native-router-flux';

import * as commonStyles from '../styles/commonStyles'
import * as commonColors from '../styles/commonColors'
import { screenWidth, screenHeight } from '../styles/commonStyles';

import Cache from '../utils/cache'

import azureService from '../services/azureService'

export default class Signin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            bShowConfirmPassword: true,
            loggingIn: false,
            user: null,
        };
        Cache.user = {}
    }


    componentDidMount() {
        this.hasMounted = true
    }

    componentWillUnmount() {
        this.hasMounted = false
    }

    onLogin() {
        Keyboard.dismiss();

        if (this.state.email == '') {
            Alert.alert('Please enter your email address.');
            return;
        }

        if (this.state.password == '') {
            Alert.alert('Please enter your password.');
            return;
        }

        // authService.login((this.state.email || '').trim(),
        //     (this.state.password || '').trim(), (error, user) => {
        //         Actions.RecogFace();
        //     })

        azureService.Init((err, res)=>{
            //console.log(err, res)
        })
        Actions.RecogFace()
    }

    onToggleConfirmPassword() {
        this.hasMounted && this.setState({ bShowConfirmPassword: !this.state.bShowConfirmPassword });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container} >
                    <StatusBar hidden={true} />
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.textTitle}>Sign In</Text>
                    </View>
                    <View style={styles.logoWrapper}>
                        <Image source={commonStyles.logo} style={styles.logoContent} />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Email"
                            placeholderTextColor={commonColors.placeholderText}
                            textAlign="center"
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            returnKeyType={'next'}
                            keyboardType="email-address"
                            value={this.state.email}
                            onChangeText={(text) => this.setState({ email: text.replace(/\t/g, '') })}
                            onSubmitEditing={() => this.refs.password.focus()}
                        />
                        <View style={styles.inputWrapper}>
                            <TextInput
                                ref="password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Password"
                                secureTextEntry={this.state.bShowConfirmPassword}
                                placeholderTextColor={commonColors.placeholderText}
                                textAlign="center"
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                returnKeyType={'go'}
                                value={this.state.password}
                                onChangeText={(text) => this.setState({ password: text.replace(/\t/g, '') })}
                                onSubmitEditing={() => this.onLogin()}
                            />
                            <TouchableOpacity
                                activeOpacity={.5}
                                style={styles.eyeButtonWrapper}
                                onPress={() => this.onToggleConfirmPassword()}
                            >
                                <Image source={this.state.bShowConfirmPassword ? commonStyles.eye : commonStyles.eye_slash} style={styles.imageEye} />
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity
                            activeOpacity={.5}
                            style={styles.loginButtonWrapper}
                            onPress={() => this.onLogin()}
                        >
                            <View style={styles.buttonLogin}>
                                <Text style={styles.textButton}>Sign In</Text>
                            </View>
                        </TouchableOpacity>


                    </View>

                    <View style={styles.bottomContainer}>
                        <View style={styles.bottomContentWrap}>

                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
    },
    logoWrapper: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContent: {
        width: 240,
        height: 150,
        resizeMode: 'contain',
    },
    background: {
        width: screenWidth,
        height: screenHeight,
    },
    descriptionContainer: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginTop: 40,
        flex: 4,
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    bottomContentWrap: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
    },
    textTitle: {
        top: 20,
        color: 'rgb(0, 0, 0)',
        //fontFamily: 'Blanch',
        fontSize: 20,
        backgroundColor: 'transparent',
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
        height: 50,
        alignSelf: 'stretch',
        marginHorizontal: 40,
        borderColor: '#aaa',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 3,
        marginBottom: 3,
        paddingHorizontal: 30,
    },
    loginButtonWrapper: {
        marginTop: 16,
        alignSelf: 'stretch',
    },
    buttonWrapper: {
        marginTop: 16,
        alignItems: 'center',
    },
    buttonLogin: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: commonColors.button,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: commonColors.button,
        borderStyle: 'solid',
        marginHorizontal: 40,
        height: 50,
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
    },
});
