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
import SelectInput from 'react-native-select-input-ios'


import * as commonStyles from '../styles/commonStyles'
import * as commonColors from '../styles/commonColors'
import { screenWidth, screenHeight } from '../styles/commonStyles';

import * as config from '../config'
import Cache from '../utils/cache'

import azureService from '../services/azureService'

export default class InPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [
                { list: 'Reason1' },
                { list: 'Reason2' },
                { list: 'Reason3' },
            ],
            captured: false,
            recognized: 0,
            picture: null,
            name: 'sdfds',
            personId: '',
            hideCamera: false,
            offices: [],
            reasons: [],
            channel1: 0,
            channel2: 0,
            errMsg: null,
        };
    }

    componentDidMount() {
        this.hasMounted = true
        azureService.getInfoData((err, res) => {
            Cache.GetInfo = res

            let offices = []
            res.offices.map((item, index) => {
                offices.push({ value: index, label: item })
            })

            let reasons = []
            res.reasons.map((item, index) => {
                reasons.push({ value: index, label: item })
            })

            this.setState({ reasons, offices, channel1:0, channel2:0 })
        })
    }

    onSubmitOffice(value){
        this.setState({ channel1: value })
    }

    onSubmitReasons(value){
        this.setState({channel2: value })
    }
    
    back() {
        Actions.pop()
    }

    getOffices() {
        return this.state.offices
    }

    getReasons() {        
        return this.state.reasons
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

    renderItem(item, index) {
        return (
            <View key={index} style={styles.listTextContainer}>
                <Text style={styles.subText}>
                    {item.list}
                </Text>
            </View>
        )
    }
    renderList() {
        return (
            <View style={styles.listContainer}>
                <Text style={{textAlign:'center', fontSize:36, marginBottom:30}}>Boarding</Text>
                <View style={styles.selectContainer}>
                    <SelectInput
                        value={this.state.channel1}
                        options={this.getOffices()}
                        onSubmitEditing={this.onSubmitOffice.bind(this)}
                        style={styles.channel}
                    />
                </View>

                <Text style={{textAlign:'center', fontSize:36, marginVertical:30}}>for</Text>
                <View style={styles.selectContainer}>
                    <SelectInput
                        value={this.state.channel2}
                        options={this.getReasons()}
                        onSubmitEditing={this.onSubmitReasons.bind(this)}
                        style={styles.channel}
                    />
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

    goIn(){
        Alert.alert(
            'Are you sure?',
            'Please confirm your office and reason',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        azureService.insertLog({
                            personId: Cache.Profile.PersonId,
                            dateIn: this.formatDate(Date.now()),
                            location: Cache.GetInfo.offices[this.state.channel1],
                            reason: Cache.GetInfo.reasons[this.state.channel2],
                        }, (err, res)=>{
                            console.log(err, res)
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
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={()=>this.goIn()}
                    activeOpacity={0.8}
                    style={styles.goinButton}>
                    <Text style={styles.buttonText}>Go in</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                {this.renderNavBar()}
                {this.renderList()}
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
        backgroundColor: 'white',
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
    mainContainer: {
        width: '100%',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectContainer: {
        width: '100%',
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        width: '100%',
        flexDirection: 'row',
    },
    goinButton: {
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
    headerContainer: {
        marginTop: 50,
        width: '100%',
        marginBottom: 20,
        alignItems: 'center'
    },
    backIcon: {
        marginTop: 3
    },
    listContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 80,
    },
    listTextContainer: {
        marginTop: 60,
        width: 200,
        height: 60,
        paddingHorizontal: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 2, height: 2 },
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.7)'
    },
    mainText: {
        color: 'rgba(0, 0, 0, 0.9)',
        fontSize: 36,
    },
    subText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
    },
    channel: {
        height: 48,
        width: '100%',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },

});
