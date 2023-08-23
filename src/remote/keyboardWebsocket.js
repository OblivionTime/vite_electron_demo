/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-18 12:24:02
 * @LastEditors: solid
 * @LastEditTime: 2022-08-30 12:13:00
 */
//websocket
export var keyboardWS
export function Init() {
    keyboardWS = new WebSocket(
        `wss:${import.meta.env.VITE_API_URL}/bluetooth`
        // "wss://47.102.206.53:3002/bluetooth"
        // "wss://192.168.6.28:3000/bluetooth"
        // "wss://192.168.6.152:3002/bluetooth"
    //    "wss://47.103.208.181:3080/key_data_ws?name=5298554999_user"
    );
    keyboardWS.onopen = function () {
        console.log("keyboardWS open ...");
    };
    keyboardWS.onmessage = function (message) {
        var data = JSON.parse(message.data);

        console.log("Received Message: " + data);
    };
    keyboardWS.onclose = function () {
        console.log("keyboardWS closed.");
    };
    keyboardWS.onerror = function (error) {
        console.log(error);
    };
}
export function sendMessage(message) {
    if (keyboardWS.readyState === 1) {
        keyboardWS.send(message);
    }
}