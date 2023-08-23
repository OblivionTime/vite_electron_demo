
<template>
  <div id="app">
    <div class="logo">
      <div class="logo-image">
        <img
          src="@/assets/logo.png"
          alt=""
          style="width: 40px;"
        >
        <span style="font-size:40px">FireTech</span>
      </div>
      <div
        class="reflush"
        @click="reflushPage"
      >
        刷新页面
      </div>
    </div>
    <div class="main">
      <div class="center">
        <div
          class="center_top"
          id="center_top"
        >
          <img
            src="./assets/img/board.png"
            class="left_top"
          />
          <img
            src="./assets/img/board.png"
            class="right_top"
          />
        </div>

        <div class="center_mid">
          <div
            class="myvideos"
            @click="pointerLock"
          >
            <div id="videos">
              <p id="msg"></p>
              <canvas
                id="action_area"
                @mousedown="m_down"
                @mouseup="m_up"
              ></canvas>

              <video
                id="other"
                autoplay
                muted="true"
              ></video>

            </div>
            <div id="files"></div>
          </div>
        </div>

        <div
          class="center_b"
          id="center_b"
        >
          <img
            src="./assets/img/board.png"
            class="left_bottom"
          />
          <img
            src="./assets/img/board.png"
            class="right_bottom"
          />
        </div>
      </div>
      <div class="main-right">

        <div class="items">
          <div
            class="item"
            v-for="item in BTNList"
            :key="item.name"
            @mousedown.prevent="touchShortcutKeys(item.btn)"
            @mouseup.prevent="touchEndShortcutKeys(item.btn)"
          >
            <div>
              <img
                :src=" item.icon"
                alt=""
                style="width:35px"
              >
            </div>
            <div>{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
let PeerConnection =
  window.PeerConnection ||
  window.webkitPeerConnection00 ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection;
let nativeRTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
let nativeRTCSessionDescription =
  window.mozRTCSessionDescription || window.RTCSessionDescription;
//ice服务器地址
const iceServer = {
  iceServers: [
    {
      urls: "turn:42.192.40.58:3478?transport=udp",
      username: "ddssingsong",
      credential: "123456",
    },
    {
      urls: "turn:42.192.40.58:3478?transport=tcp",
      username: "ddssingsong",
      credential: "123456",
    },
  ],
};
import { Init, sendMessage, keyboardWS } from "@/remote/keyboardWebsocket";
import Work from "@/assets/img/work.svg";
import Close from "@/assets/img/close.svg";
import Win from "@/assets/img/win.svg";
import SWITCH from "@/assets/img/swich.svg";
import Reload from "@/assets/img/reload.svg";
import Other from "@/assets/img/other.svg";
export default {
  mounted() {
    window.onbeforeunload = () => {
      if (this.socket) {
        this.socket.close();
      }
      if (this.keyboardWS) {
        this.keyboardWS.close();
      }
    };
    Init();
    this.ConnectWebrtc();
    /**
     * 监听事件
     */
    //监听鼠标锁定
    document.addEventListener("pointerlockchange", this.lockChangeAlert, false);
    document.addEventListener(
      "mozpointerlockchange",
      this.lockChangeAlert,
      false
    );
    /**
     * 绑定元素
     */
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    //鼠标锁定
    this.canvas.requestPesc =
      this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock;
    //禁止右键
    document.oncontextmenu = function () {
      return false;
    };
    // document.body.addEventListener("keydown", this.k_down, false);
    // document.body.addEventListener("keyup", this.k_release, false);
    setInterval(() => {
      let def_x = this.add_x;
      let def_y = this.add_y;
      if (this.cat == 1) {
        if (def_x != 0 || def_y != 0) {
          this.add_x = 0;
          this.add_y = 0;
          sendMessage(
            JSON.stringify({
              methon: "MouseMove",
              arg1: def_x,
              arg2: def_y,
            })
          );
        }
      }
    }, 10);
  },
  data() {
    this.deviceList = [];
    return {
      /**
       * 基本配置
       */
      //当前房间号
      currentRoom: "5298554999",
      username: "admin",
      callFlag: false,
      callClick: false,
      shortcutKeyFlag: false,
      /**
       * 视频流所需参数
       */
      pc: "",
      socket: "",
      channel: null,
      //传输数据标识符
      cat: false,
      /**
       * dom元素
       */
      canvas: "",
      ctx: "",
      /**
       * 鼠标移动
       */
      keyboardWS: keyboardWS,
      add_x: 0,
      add_y: 0,
      /**
       * 右侧键盘的标识
       */
      //角度
      angle: 0,
      //静音
      isMute: 1,
      //存储按键
      signObj: [],
      BTNList: [
        {
          name: "ALT",
          icon: Other,
          btn: ["Alt"],
        },
        {
          name: "CTRL",
          icon: Other,
          btn: ["Control"],
        },
        {
          name: "Shift",
          icon: Other,
          btn: ["Shift"],
        },
        {
          name: "WIN",
          icon: Win,
          btn: ["Meta"],
        },
        {
          name: "WIN+P",
          icon: Win,
          btn: ["Meta", "p"],
        },
        {
          name: "WIN+L",
          icon: Win,
          btn: ["Meta", "l"],
        },
        {
          name: "WIN+M",
          icon: Win,
          btn: ["Meta", "m"],
        },
        {
          name: "WIN+D",
          icon: Win,
          btn: ["Meta", "d"],
        },
        {
          name: "WIN+E",
          icon: Win,
          btn: ["Meta", "e"],
        },
        {
          name: "任务管理器",
          icon: Work,
          btn: ["Control", "Shift", "Escape"],
        },
        {
          name: "ALT+TAB",
          icon: SWITCH,
          btn: ["Alt", "Tab"],
        },
        {
          name: "CRTL+SHIFT+T",
          icon: Reload,
          btn: ["Control", "Shift", "t"],
        },
        {
          name: "ALT+F4",
          icon: Close,
          btn: ["Alt", "F4"],
        },
        {
          name: "CTRL+W",
          icon: Close,
          btn: ["Control", "w"],
        },
        {
          name: "ESC",
          icon: Close,
          btn: ["Escape"],
        },
      ],
    };
  },
  methods: {
    reflushPage() {
      window.location.reload();
    },
    /**
     * 音视频
     */
    ConnectWebrtc() {
      this.socket = new WebSocket(
        `wss://${import.meta.env.VITE_API_URL}/ws/` + new Date().getTime()
      );
      this.socket.onopen = async () => {
        //初始化PC源
        this.pc = this.initPC();
        this.socket.send(
          JSON.stringify({
            name: "peer",
          })
        );
      };
      this.socket.onmessage = async (message) => {
        let data = JSON.parse(message.data);
        switch (data.name) {
          /**
           * 1.邀请人将对方的音视频流通过setRemoteDescription函数进行存储
           * 2.存储完后邀请人创建answer来获取自己的音视频流,通过setLocalDescription函数存储自己的音视频流,并发送answer指令(携带自己的音视频)告诉对方要存储邀请人的音视频
           */
          case "offer":
            //初始化PC源
            this.pc = this.initPC();
            //当收到对方接收请求后,设置音频源,并发送answer给对方
            this.pc.setRemoteDescription(
              new nativeRTCSessionDescription(data.data.sdp)
            );
            this.pc.createAnswer(
              (sdp) => {
                this.pc.setLocalDescription(sdp);
                this.socket.send(
                  JSON.stringify({
                    name: "answer",
                    data: {
                      sdp: sdp,
                    },
                  })
                );
              },
              (err) => {
                console.log(err);
              }
            );
            break;
          case "answer":
            //设置邀请人发来的音频源
            this.pc.setRemoteDescription(
              new nativeRTCSessionDescription(data.data.sdp)
            );
            break;
          case "ice_candidate":
            //添加ice源,这一步很重要,如果没有接收ice则查看是否流程有问题
            var candidate = new nativeRTCIceCandidate(data.data);
            this.pc.addIceCandidate(candidate);
            break;
        }
      };
    },
    //初始化PC源
    initPC() {
      let pc = new PeerConnection(iceServer);
      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          this.socket.send(
            JSON.stringify({
              name: `ice_candidate`,
              data: {
                id: evt.candidate.sdpMid,
                label: evt.candidate.sdpMLineIndex,
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
                candidate: evt.candidate.candidate,
              },
            })
          );
        }
      };
      pc.onaddstream = (evt) => {
        let stream = evt.stream;
        let video = document.getElementById("other");
        video.srcObject = stream;
      };
      return pc;
    },
    /**
     * 鼠标锁定
     */
    lockChangeAlert() {
      if (
        document.pointerLockElement === this.canvas ||
        document.mozPointerLockElement === this.canvas ||
        document.webkitPointerLockElement === this.canvas
      ) {
        this.cat = true;
        document.addEventListener("mousemove", this.updatePosition, false);
        //监听键盘按键
        document.body.addEventListener("keydown", this.exitLister, false);
        document.body.addEventListener("keydown", this.k_down, false);
        document.body.addEventListener("keyup", this.k_release, false);
        //监听滚轮
        document.body.addEventListener("wheel", this.m_scroll, false);
      } else {
        this.cat = false;
        document.removeEventListener("mousemove", this.updatePosition, false);
        //监听键盘按键
        document.body.removeEventListener("keydown", this.exitLister, false);
        document.body.removeEventListener("keydown", this.k_down, false);
        document.body.removeEventListener("keyup", this.k_release);
        //监听滚轮
        document.body.removeEventListener("wheel", this.m_scroll);
      }
    },
    //锁定
    pointerLock() {
      this.canvas.requestPesc();
    },

    /**
     * canvas 绘画
     */

    //画图
    canvasDraw() {
      this.ctx.fillStyle = "rgba(255,255,255,0)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 0, 0, true);
      this.ctx.fill();
    },
    //更新鼠标位置
    updatePosition(e) {
      this.add_x = e.movementX;
      this.add_y = e.movementY;
    },

    /**
     * 键盘按键和鼠标移动传输给websocket
     */
    //鼠标按下
    m_down(e) {
      if (this.cat) {
        sendMessage(
          JSON.stringify({
            methon: "MouseDown",
            arg1: e.which,
          })
        );
      }
    },
    //鼠标抬起
    m_up(e) {
      if (this.cat) {
        sendMessage(
          JSON.stringify({
            methon: "MouseUp",
            arg1: e.which,
          })
        );
      }
    },
    //键盘按下
    k_down(e) {
      if (this.cat) {
        if (e.key == "Process" || (e.keyCode == 27 && this.cat)) {
          return;
        }
        this.signObj.push(e.key);
        var sendMsg = {
          methon: "KeyDown",
          arg1: e.key,
        };
        sendMessage(JSON.stringify(sendMsg));
      }
    },
    //键盘抬起
    k_release(e) {
      if (this.cat) {
        if (this.signObj.length > 0) {
          this.signObj = this.signObj.slice(0, this.signObj.length);
        }
        sendMessage(
          JSON.stringify({
            methon: "Keyrelease",
            arg1: e.key,
          })
        );
      }
    },
    //滚轮
    m_scroll(e) {
      if (this.cat) {
        if (e.deltaY > 0) {
          sendMessage(
            JSON.stringify({
              methon: "MiddleMouse",
              arg1: -1,
            })
          );
        } else {
          sendMessage(
            JSON.stringify({
              methon: "MiddleMouse",
              arg1: 1,
            })
          );
        }
      }
    },
    //按键释放 清空signObj
    release() {
      for (let key of this.signObj) {
        sendMessage(
          JSON.stringify({
            methon: "Keyrelease",
            arg1: key,
          })
        );
      }
      this.signObj = [];
    },
    //长按快捷键
    touchShortcutKeys(btn) {
      for (const t of btn) {
        var sendMsg = {
          methon: "KeyDown",
          arg1: t,
        };
        sendMessage(JSON.stringify(sendMsg));
      }
    },
    touchEndShortcutKeys(btn) {
      for (const t of btn) {
        var sendMsg = {
          methon: "Keyrelease",
          arg1: t,
        };
        sendMessage(JSON.stringify(sendMsg));
      }
    },
    exitLister(e) {
      if (e.keyCode == 27) {
        alert("释放鼠标");
      }
      e.preventDefault();
      return false;
    },
  },
  destroyed() {
    if (this.socket) {
      this.release();
      this.socket.close();
    }
    if (this.keyboardWS) {
      this.keyboardWS.close();
    }
    
    // document.body.removeEventListener("keydown", this.k_down, false);
    // document.body.removeEventListener("keyup", this.k_release);
  },
};
</script>

<style type="text/css" scoped >
:root {
  --width: 340px;
}
.logo {
  padding: 10px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
}
.logo-image {
  display: flex;
  gap: 10px;
  align-items: center;
}

.main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.center {
  width: calc(100vw - 390px);
  height: 85vh;
  /* width: 900px; */
  /* height: 600px; */
  background: rgba(255, 255, 255, 0.12);
  position: relative;
}

.myvideos {
  width: calc(100vw - 390px);
  height: 85vh;
  float: left;
  position: relative;
  z-index: 99;
}

#other {
  width: 100%;
  height: 100%;
  object-fit: fill;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
}

.videos {
  width: 100%;
  height: 100%;
}

#action_area {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}

.other {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#msg {
  float: left;
}

#menu {
  width: 260px;
  margin-top: 20px;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}

.font {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 20px;
  z-index: 80;
}

.center_top {
  height: 20px;
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  z-index: 99;
}

.left_top {
  float: left;
  width: 20px;
}

.left_bottom {
  float: left;
  width: 20px;
  transform: rotate(-90deg);
}

.right_top {
  float: right;
  width: 20px;
  transform: rotate(90deg);
}

.center_mid {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}

.center_b {
  height: 20px;
  bottom: 0px;
  position: absolute;
  width: 100%;
  left: 0;
  z-index: 99;
}

.right_bottom {
  float: right;
  width: 20px;
  transform: rotate(180deg);
}

.rotate_button {
  margin-left: 32px;
  cursor: pointer;
}

.rotate_button:hover {
  color: gray;
}

.active {
  color: #27ae60 !important;
}

.hotkeys-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}

.main-right {
  box-sizing: border-box;
  padding: 20px;
  width: var(--width);
  height: 85vh;
  border-radius: 20px;
  box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.12);
  overflow: auto;
}
.items {
  /* 声明一个容器 */
  display: grid;
  /*  声明列的宽度  */
  grid-template-columns: repeat(3, 1fr);
  /*  声明行间距和列间距  */
  grid-gap: 15px;
}
.item {
  cursor: pointer;
  height: 90px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #000;
  background-color: #efeeee;
  border-radius: 20px;
  gap: 10px;
}

.reflush {
  width: 120px;
  height: 35px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
#app {
  box-sizing: border-box;
  padding: 15px;
  color: white;
  height: 100vh;
  width: 100%;
  position: relative;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  background: url(./assets/img/back.png) no-repeat;
  background-size: cover;
  background-position: center;
}
</style>

