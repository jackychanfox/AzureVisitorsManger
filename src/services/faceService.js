import RNFetchBlob from 'react-native-fetch-blob';

class FaceAuth {
    constructor(microsoftAPIKey, microsoftAPIProxy = 'https://api.projectoxford.ai') {
        this.microsoftAPIKey = microsoftAPIKey;
        this.microsoftAPIProxy = microsoftAPIProxy;
    };

    async createPersonGroup(personGroupID, personGroupName) {
        let body = JSON.stringify({
            name: personGroupName
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('PUT', `${this.microsoftAPIProxy}/face/v1.0/persongroups/${personGroupID}`, headers, body);
            //let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: null
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async createPerson(personGroupID, personName) {
        let body = JSON.stringify({
            name: personName
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/face/v1.0/persongroups/${personGroupID}/persons`, headers, body);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async createPersonFace(personGroupID, personID, picture) {
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/octet-stream'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/face/v1.0/persongroups/${personGroupID}/persons/${personID}/persistedFaces`, headers, picture);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async readPerson(personGroupID, personID) {
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey
        };

        try {
            let response = await RNFetchBlob.fetch('GET', `${this.microsoftAPIProxy}/face/v1.0/persongroups/${personGroupID}/persons/${personID}`, headers);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: {
                    personID: responseJson.personId,
                    name: responseJson.name
                }
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async detect(picture) {
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/octet-stream'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/face/v1.0/detect`, headers, picture);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async identify(personGroupID, faceIDs) {
        let body = JSON.stringify({
            personGroupId: personGroupID,
            faceIds: faceIDs,
            maxNumOfCandidatesReturned: 1,
            confidenceThreshold: 0.5
        });

        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey,
            'Content-Type': 'application/json'
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/face/v1.0/identify`, headers, body);
            let responseJson = await response.json();
            let result = {
                status: response.respInfo.status,
                data: responseJson
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async train(personGroupID) {
        let headers = {
            'Ocp-Apim-Subscription-Key': this.microsoftAPIKey
        };

        try {
            let response = await RNFetchBlob.fetch('POST', `${this.microsoftAPIProxy}/face/v1.0/persongroups/${personGroupID}/train`, headers);
            let result = {
                status: response.respInfo.status
            };

            return result;
        } catch (error) {
            return error;
        }
    };

    async signin(personGroupID, picture) {
        try {
            let faceResponse = await this.detect(picture);

            if (faceResponse.status !== 200) {
                return {err: 'FAIL_DETECT', res:faceResponse};
            }

            if (!faceResponse.data.length) {
                return {err: 'NO_FACE', res:null};
            }

            let faceIDs = faceResponse.data.map(item => item.faceId);
            let identifyResponse = await this.identify(personGroupID, faceIDs);

            if (identifyResponse.status !== 200) {
                return {err:'FAIL_IDENTIFY', res: identifyResponse};
            }

            if (identifyResponse.data.length !== 1) {
                return {err:'TOO_MUCH_FACES', res : null};
            }

            if (!identifyResponse.data[0].candidates.length) {
                return {err:'STRANGER', res: null};
            }

            let personID = identifyResponse.data[0].candidates[0].personId;
            let readPersonResponse = await this.readPerson(personGroupID, personID);

            if (readPersonResponse.status !== 200) {
                return {err: 'FAIL_READPERSON', res:readPersonResponse};
            }

            return {err:null, res:readPersonResponse.data};
        } catch(error) {
            return error;
        }
    };

    async signup(personGroupID, personName, picture) {
        let createPersonResponse = await this.createPerson(personGroupID, personName);

        if (createPersonResponse.status !== 200) {
            return createPersonResponse;
        }

        let personID = createPersonResponse.data.personId;
        let createPersonFaceResponse = await this.createPersonFace(personGroupID, personID, picture);

        if (createPersonFaceResponse.status !== 200) {
            return createPersonFaceResponse;
        }

        // Train the persons group.
        let trainResponse = await this.train(personGroupID);

        let result = {
            personID: personID,
            personName: personName
        };

        return result;
    };

    
};

export default FaceAuth;
