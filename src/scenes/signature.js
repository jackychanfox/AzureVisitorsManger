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
    TouchableHighlight
} from 'react-native';


import { Actions } from 'react-native-router-flux';
import IonIcons from 'react-native-vector-icons/Ionicons'
import SignatureCapture from 'react-native-signature-capture'

import * as commonStyles from '../styles/commonStyles'
import * as commonColors from '../styles/commonColors'
import { screenWidth, screenHeight } from '../styles/commonStyles';

import * as config from '../config'
import Cache from '../utils/cache'

export default class Signature extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    renderNavBar() {
        return (
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => this.back()}>
                    <IonIcons name="md-arrow-back" size={30} color={commonColors.textColor2} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Signature</Text>
                <TouchableOpacity onPress={() => { this.resetSign() }}>
                    <IonIcons name="md-refresh" size={30} color={commonColors.textColor1} style={styles.navRightIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    back() {
        Actions.pop()
    }

    print() {
        this.saveSign()
        Actions.Print()
    }

    renderBottomButton() {
        return (
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.print()}
                    style={styles.printButton}>

                    <Text style={styles.buttonText}>Print</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderSignature() {
        return (
            <View style={{flex:1}}>
                <SignatureCapture
                    style={styles.signature}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={"portrait"} />

            </View>
        )
    }

    saveSign() {
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        //console.log('-----------',result);
        Cache.signature = result.encoded
    }
    _onDragEvent() {
        //console.log("dragged");
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                {this.renderSignature()}
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
        paddingTop: 10,
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
        marginTop:5,
    },

    signature: {
        flex:1,
        borderColor: '#000033',
        borderWidth: 1,
        margin:20,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
    bottomContainer: {
        
        height: 50,
        width: '100%',
        flexDirection: 'row',
    },
    printButton: {
        flex: 1,
        backgroundColor: commonColors.button,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        //marginLeft:10,
        fontWeight:'bold'
    },
});
