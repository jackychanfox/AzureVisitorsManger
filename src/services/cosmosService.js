import RNFetchBlob from 'react-native-fetch-blob';

class CosmosAuth {
    constructor(microsoftAPIKey, microsoftAPIProxy ) {
        this.microsoftAPIKey = microsoftAPIKey;
        this.microsoftAPIProxy = microsoftAPIProxy;
    };

    getPerson(personId, cb) {
        let body = JSON.stringify(
            {PersonId:personId}
        );
 
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/visitor/get`, headers, body).
        then((res)=>{
            cb(null, JSON.parse(res.data))
        }).catch((err)=>{
            cb(err, null)
        })
    };

    insertPerson(data, cb) {
        let body = JSON.stringify(data);

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/visitor/insert`, headers, body)
        .then((res)=>{
            cb(null, res.data)
        }).catch((err)=>{
            cb(err, null)
        })

    };

    insertLog(data, cb) {
        let body = JSON.stringify(data);

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/visitorlog/insert`, headers, body)
        .then((res)=>{
            if ( res.respInfo.status == 200 ){
                cb(null, res.respInfo.taskId)
            }else{
                cb(resp.respInfo, null)
            }
        }).catch((err)=>{
            cb(err, null)
        })

    };

    getLog(data, cb) {
        let body = JSON.stringify(data);

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/visitorlog/get`, headers, body)
        .then((res)=>{
            cb(null, JSON.parse(res.data))
        }).catch((err)=>{
            cb(err, null)
        })

    };

    uploadImage(data,cb){
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/visitor/uploadimage`, headers, data)
        .then((res)=>{
            cb(null, JSON.parse(res.data))
        }).catch((err)=>{
            cb(err, null)
        })

    }

    getInfoData(cb){
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        RNFetchBlob.fetch('GET', 'https://rocktree.azure-api.net/vm/visitor/infodata', headers)
        .then((res)=>{
            cb(null, JSON.parse(res.data))
        }).catch((err)=>{
            cb(err, null)
        })        
    }
}

export default CosmosAuth;