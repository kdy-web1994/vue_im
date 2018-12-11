<template>
  <div class="Im">im</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      config: {
        sdk_appid: 1400167820,
        expire_after: 180 * 24 * 3600,
        private_key: `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgDhDVNPrXr9cMj8MQ
LBhHygBdQmPlRb0q54aBhoz/CauhRANCAARI5uNx0HuTQkMdlB+McI+SMbP+pIEs
kW08jgqV2q43+hIsd7nBYCw4HUisXgBgWlqmRslWXXX3Eg1DLlsAiJIZ
-----END PRIVATE KEY-----`,
        public_key: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAESObjcdB7k0JDHZQfjHCPkjGz/qSB
LJFtPI4KldquN/oSLHe5wWAsOB1IrF4AYFpapkbJVl119xINQy5bAIiSGQ==
-----END PUBLIC KEY-----`
      },
      sig: ""
    };
  },
  computed: {
    ...mapGetters({
      avatar: "getAvatar"
    })
  },
  created() {
    const TLSAPI = require("../../public/TLSAPI");
    var sigObj = new TLSAPI.Sig(this.config);
    this.sig = sigObj.genSig("im01");
    
    this.init();
  },
  methods: {
    init() {
      this.loginInfo = {
        sdkAppID: 1400167820, //用户所属应用id,必填
        identifier: "im01", //当前用户ID,必须是否字符串类型，必填
        accountType: 36862, //用户所属应用帐号类型，必填
        userSig: this.sig //当前用户身份凭证，必须是字符串类型，必填
      };

      var onC2cEventNotifys = {
        "96": this.onMultipleDeviceKickedOut
      };

      //监听事件
      var listeners = {
        onConnNotify: this.onConnNotify, //监听连接状态回调变化事件,必填
        onMsgNotify: this.onMsgNotify, //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
        onKickedEventCall: this.onKickedEventCall, //被其他登录实例踢下线
        onC2cEventNotifys: onC2cEventNotifys //监听C2C系统消息通道
      };

      //初始化时，其他对象，选填
      var options = {};

      webim.login(
        this.loginInfo,
        listeners,
        options,
        function(resp) {
          console.log(resp);
        //   if (resp.identifierNick) {
        //     that.loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
        //   } else {
        //     that.set();
        //   }
        //   if (resp.headurl) {
        //     that.loginInfo.headurl = resp.headurl; //设置当前用户昵称
        //   } else {
        //     that.set();
        //   }

        //   that.getFriends();

          //          initDemoApp();
        },
        function(err) {
        //   Toast({
        //     message: "登陆失败,请稍后重试",
        //     forbidClick: true,
        //     position: "center",
        //     duration: 3000
        //   });
          this.$router.go(-1);
        }
      );
    },
     onKickedEventCall() {
      Toast({
        message: "您的账号已在其他地方登陆",
        forbidClick: true,
        position: 'center',
        duration: 3000
      });
      this.$router.go(-1)
      //  document.getElementById("webim_demo").style.display = "none";
    },

    onMultipleDeviceKickedOut() {
    //   Toast({
    //     message: "您已被T下线,请稍后重新登录",
    //     forbidClick: true,
    //     position: "center",
    //     duration: 2000
    //   });
    //   this.$router.go(-1);
    },
    onConnNotify(resp) {
      //监听连接状态回调变化事件
      var info;
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn("建立连接成功: " + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info =
            "连接已断开，无法收到新消息，请检查下你的网络是否正常: " +
            resp.ErrorInfo;
          // alert(info);
          webim.Log.warn(info);
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = "连接状态恢复正常: " + resp.ErrorInfo;
          // alert(info);
          webim.Log.warn(info);
          break;
        default:
          webim.Log.error("未知连接状态: =" + resp.ErrorInfo);
          break;
      }
    },
    onMsgNotify(newMsgList) {
      //监听新消息事件
      var msgList = [];
      var dateStart = null;
      var dateEnd = null;
      let that = this;
      var sess, newMsg;
      //获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();

      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];


        if (newMsg.getSession().id() == that.id) { //为当前聊天对象的消息
          //在聊天窗体中新增一条消息
        //   that.addMsg(newMsg,"pushData")
          webim.setAutoRead(newMsg.sess, true, true);

        }
        // msgList.push(newMsg.elems[0].content.text);
      }
      //消息已读上报，以及设置会话自动已读标记
    },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  display: flex;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
