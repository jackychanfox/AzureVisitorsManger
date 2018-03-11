import RNFetchBlob from 'react-native-fetch-blob';

const fs = RNFetchBlob.fs

class UtilService {
    getBase64FromUri(uri, cb) {
        RNFetchBlob
            .config({
                fileCache: true
            })
            .fetch('GET', uri)
            // the image is now dowloaded to device's storage
            .then((resp) => {
                // the image path you can use it directly with Image component
                imagePath = resp.path()
                return resp.readFile('base64')
            })
            .then((base64Data) => {
                // here's base64 encoded image
                cb(null, base64Data)
                // remove the file from storage
                return fs.unlink(imagePath)
            })
    }
}

export default UtilService