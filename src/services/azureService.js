import FaceAuth from './faceService'
import CosmosAuth from './cosmosService'

import * as async from 'async'
import * as config from '../config'


const azureEndPoint = 'https://southeastasia.api.cognitive.microsoft.com'
const azureFaceApiKey = '807aafea1cd3421eafc6a7788e4de6be'

const azureDatabaseEndPoint = 'https://rocktree.azure-api.net/vm/api'
const azureDatabaseApiKey = '1b195ea5a124444298d155e831d7affe'

const appPersonGroupID = "rocktree-visitors"
const appPersonGroupName = "RockTree"


module.exports = {

    async Init(cb) {
        this.createPersonGroup(appPersonGroupID, appPersonGroupName, cb)
    },

    faceLogin(facePictureBase64Data, cb) {
        this.signin(appPersonGroupID, facePictureBase64Data, cb)
    },

    faceSingup(personName, facePictureBase64Data, cb) {
        this.singup(appPersonGroupID, personName, facePictureBase64Data, cb)
    },

    async addPicture(personID, facePictureBase64Data, cb) {
        let faceAuth = new FaceAuth(azureFaceApiKey, azureEndPoint);
        let response1 = await faceAuth.createPersonFace(groupID, personID, facePictureBase64Data)
        let response2 = await faceAuth.train(groupID);
        //console.log(groupID, personID, response1, response2)
        cb(null, response2)
    },

    async createPersonGroup(groupID, groupName, cb) {
        let faceAuth = new FaceAuth(azureFaceApiKey, azureEndPoint);
        let response = await faceAuth.createPersonGroup(groupID, groupName);
        cb(null, response)
    },

    async signin(groupID, facePictureBase64Data, cb) {
        let faceAuth = new FaceAuth(azureFaceApiKey, azureEndPoint);
        let response = await faceAuth.signin(groupID, facePictureBase64Data);
        cb(response.err, response.res)
    },

    async singup(groupID, personName, facePictureBase64Data, cb) {
        let faceAuth = new FaceAuth(azureFaceApiKey, azureEndPoint);
        let response = await faceAuth.signup(groupID, personName, facePictureBase64Data);
        cb(null, response)
    },

    getPerson(personID, cb){
        let cosmosAuth = new CosmosAuth(azureDatabaseApiKey, azureDatabaseEndPoint)
        cosmosAuth.getPerson(personID, cb)
    },
    insertPerson(data, cb){
        let cosmosAuth = new CosmosAuth(azureDatabaseApiKey, azureDatabaseEndPoint)
        cosmosAuth.insertPerson(data, cb)
    },
    uploadImage(data, cb){
        let cosmosAuth = new CosmosAuth(azureDatabaseApiKey, azureDatabaseEndPoint)
        cosmosAuth.uploadImage(data, cb)
    },
    getInfoData(cb){
        let cosmosAuth = new CosmosAuth(azureDatabaseApiKey, azureDatabaseEndPoint)
        cosmosAuth.getInfoData(cb)
    },
    insertLog(data, cb){
        let cosmosAuth = new CosmosAuth(azureDatabaseApiKey, azureDatabaseEndPoint)
        cosmosAuth.insertLog(data, cb)
    },
    getLog(data, cb){
        let cosmosAuth = new CosmosAuth(azureDatabaseApiKey, azureDatabaseEndPoint)
        cosmosAuth.getLog(data, cb)
    },
}

