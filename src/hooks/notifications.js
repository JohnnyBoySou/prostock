import { OneSignal } from 'react-native-onesignal'

const oneSignalLogin = (uiid) => {
    OneSignal.login(uiid)
    return true
}

const oneSignalColaborador = (uiid) => {
    OneSignal.login(uiid)
    OneSignal.User.addTag("tipo", "colaborador");
}
export { oneSignalLogin, oneSignalColaborador};