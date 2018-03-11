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

export default class RecogFace extends Component {
    constructor(props) {
        super(props);

        this.state = {
            captured: false,
            recognized: 0,
            picture: null,
            name:'',
            personId:'',
            hideCamera: false,
        };

        Cache.Profile = null;
    }

    
    retryCapture() {
        this.setState({ captured: false, recognized: 0, name:'', personId:'' })
    }

    renderNavBar() {
        return (
            <View style={styles.navBar}>
                {/* <TouchableOpacity onPress={() => this.back()}>
                    <IonIcons name="md-arrow-back" size={30} color={commonColors.textColor2} style={styles.backIcon} />
                </TouchableOpacity> */}
                <Text style={styles.navTitle}>Recognize</Text>
                <TouchableOpacity onPress={() => this.retryCapture()}>
                    <IonIcons name="md-refresh" size={30} color={commonColors.textColor2} style={styles.navRightIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    back() {
        Actions.pop()
    }

    goDetail() {
        if ( Cache.Profile ){
            Actions.DetailView()
        }
    }

    goInPage() {
        if ( Cache.Profile ){
            Actions.InPage()
        }
    }

    goOutPage() {
        if ( Cache.Profile ){
            azureService.getLog({PersonId:Cache.Profile.personId},(err, res)=>{
                if ( res.length > 0 ){
                    Actions.OutPage()
                }else{
                    Alert.alert('You must go in your office before out')
                }
            })
            
        }
    }

    onBarCodeRead(e) {
        console.log(
            "Barcode Found!",
            "Type: " + e.type + "\nData: " + e.data
        );
    }

    takePicture() {
        Cache.Profile = null;
        const options = {};
        this.setState({ captured: true, picture:null })
        //options.location = ...
        this.camera.capture({ metadata: options })
            .then((data) => {
                azureService.faceLogin(data.data, (err, res)=>{
                    //console.log(err, res, data.data)
                    if ( err == null ){
                        azureService.getPerson(res.personID, (err, res)=>{
                            console.log('------', err, res)
                            if ( res.length == 1){
                                this.setState({recognized:2, name:res[0].Name+' '+res[0].Surname, personId:res[0].PersonID})
                                Cache.Profile = res[0]
                            }else{
                                this.setState({recognized:1})
                            }
                            //console.log(Cache.Profile, res)
                        })   

                        
                    }else{
                        if ( 'NO_FACE' == err ){
                            this.setState({recognized:1})
                        }else {
                            this.setState({recognized:1})
                        }
                        
                    }
                })
                this.setState({picture:{uri:`data:image/jpeg;base64,${data.data}`}})
                Cache.avatar = data.data
                
            })
            .catch(err => console.error(err));
    }


    renderCameraView() {
        return (
            <View style={styles.cameraContainer}>
                {!this.state.hideCamera&&<Camera
                    ref={(cam) => {
                        this.camera = cam;
                        //console.log("Camera1 Init")
                        if ( this.camera ) 
                            this.camera.startPreview()
                    }}
                    onBarCodeRead={this.onBarCodeRead.bind(this)}
                    style={[styles.preview, {
                        height: this.state.captured ? 0 : 280,
                        width: this.state.captured ? 0 : 280,
                        borderWidth: this.state.captured ? 0 : 3,
                        shadowRadius: this.state.captured ? 0 : 3,
                    }]}
                    type="front"
                    captureTarget={Camera.constants.CaptureTarget.memory}
                    aspect={Camera.constants.Aspect.fill}>
                </Camera>}
                {this.state.captured && <View style={styles.preview}>
                    <Image source={this.state.picture} style={{ width: '100%', height: '100%' }} />
                </View>}
                {<TouchableOpacity activeOpacity={0.8} disabled={this.state.captured}
                    style={[styles.captureButton, { backgroundColor: this.state.captured ? 'grey' : commonColors.theme2 }]}
                    onPress={this.takePicture.bind(this)}>

                    <IonIcons name="ios-camera" size={30} color={'white'} />
                    <Text style={styles.captureText}>Capture</Text>
                </TouchableOpacity>}
            </View>
        )
    }

    register() {
        //if(this.camera)
        //    this.camera.stopPreview()
        this.setState({hideCamera:true})
        Actions.Register({onBack:()=>{
            setTimeout(()=>this.setState({hideCamera:false}),1000)
        }})
        // Actions.Print()
    }

    renderBottomButton() {
        //this.state.recognized = 2
        if (!this.state.captured) return null
        return (
            <View style={styles.bottomContainer}>
                {this.state.recognized == 2 && <TouchableOpacity activeOpacity={0.8} style={styles.inButton}
                onPress={() => this.goInPage()}>
                    <Text style={styles.buttonText}>IN</Text>
                </TouchableOpacity>}
                {this.state.recognized == 2 && <TouchableOpacity activeOpacity={0.8} style={styles.outButton}
                onPress={() => this.goOutPage()}>
                    <Text style={styles.buttonText}>OUT</Text>
                </TouchableOpacity>}
                {this.state.recognized == 1 && <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.register()}
                    style={styles.registerButton}>

                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>}
            </View>
        )
    }

    renderDetailView() {
        if ( this.state.recognized != 2 ) return null
        return (
            <TouchableOpacity style={styles.resultTextContainer} onPress={()=>this.goDetail()}>                
                <Text style={styles.success}>Details</Text>
            </TouchableOpacity>
        )
    }

    renderResultText() {
        return (
            <View style={styles.resultTextContainer}>
                {this.state.captured && this.state.recognized == 2 && <Text style={styles.success}>Welcome {this.state.name}!</Text>}
                {this.state.captured && this.state.recognized == 3 && <Text style={styles.fail}>No face detected. try to capture again!</Text>}
                {this.state.captured && this.state.recognized == 1 && <Text style={[styles.fail, {textAlign:'center'}]}>Looks like you are not register. Please register or try again!</Text>}
                {!this.state.captured && <Text style={styles.success}>Press "Capture" to recognize!</Text>}
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                {this.renderNavBar()}
                {this.renderCameraView()}
                {this.renderResultText()}
                {this.renderDetailView()}
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
        fontSize: 16,
        color: commonColors.textColor1,
        flex: 1,
    },
    backIcon: {
        marginTop: 3
    },
    cameraContainer: {
        width: '100%',
        height: 400,
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
        backgroundColor: commonColors.button,
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
        fontWeight: 'bold'
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        width: '100%',
        flexDirection: 'row',
    },
    inButton: {
        flex: 1,
        backgroundColor: commonColors.theme2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    outButton: {
        flex: 1,
        backgroundColor: commonColors.button,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerButton: {
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
    resultTextContainer: {
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    success: {
        color: commonColors.theme2,
        fontSize: 16,
    },
    fail: {
        color: commonColors.theme,
        fontSize: 16,
    },
    detailStyle: {
        color: 'rgb(0, 0, 255)',        
        fontSize: 18,
    }
});
