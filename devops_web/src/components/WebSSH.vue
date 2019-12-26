
<!--<template>-->
<!--<div class="console" id="terminal"></div>-->
<!--</template>-->

<!--<script>-->
<!--import Terminal from './Xterm'-->
<!--export default {-->
<!--name:'Console',-->
<!--props: {-->
<!--terminal: {-->
<!--type: Object,-->
<!--default: {}-->
<!--}-->
<!--},-->
<!--data () {-->
<!--return {-->
<!--term: null,-->
<!--terminalSocket: null-->
<!--}-->
<!--},-->
<!--methods: {-->
<!--runRealTerminal () {-->
<!--console.log('webSocket is finished')-->
<!--},-->
<!--errorRealTerminal () {-->
<!--console.log('error')-->
<!--},-->
<!--closeRealTerminal () {-->
<!--console.log('close')-->
<!--},-->
<!--// msgTerminal(e){-->
<!--//   console.log(e);-->
<!--// }-->
<!--},-->
<!--mounted () {-->
<!--console.log('pid : ' + this.terminal.pid + ' is on ready');-->
<!--let terminalContainer = document.getElementById('terminal');-->
<!--this.term = new Terminal();-->
<!--this.term.open(terminalContainer);-->
<!--// // open websocket-->
<!--this.terminalSocket = new WebSocket('ws://127.0.0.1:2020/terminals/');-->
<!--this.terminalSocket.onopen = this.runRealTerminal;-->
<!--this.terminalSocket.onclose = this.closeRealTerminal;-->
<!--this.terminalSocket.onerror = this.errorRealTerminal;-->
<!--// this.terminalSocket.onmessage = this.msgTerminal(e);-->
<!--this.term.attach(this.terminalSocket);-->
<!--this.term._initialized = true;-->
<!--console.log('mounted is going on')-->
<!--},-->
<!--beforeDestroy () {-->
<!--this.terminalSocket.close();-->
<!--this.term.destroy()-->
<!--}-->
<!--}-->
<!--</script>-->

<template>
  <div class="container">
    <p id="webTitle">
      <el-button @click.native="closeSSH" icon="el-icon-close" size="mini"></el-button>
    </p>
    <div id="terminal-container">

    </div>
  </div>
</template>

<script>
  // import Terminal from './Xterm'
  import { Terminal } from 'xterm'
  import 'xterm/dist/xterm.css'
  import * as fit from 'xterm/lib/addons/fit/fit';
  import * as attach from 'xterm/lib/addons/attach/attach'
  Terminal.applyAddon(fit);
  Terminal.applyAddon(attach);

  export default {
    name:'WebSSH',
    data () {
      return {
        copy: "",
        websock: null,
        term: null,
      }
    },
    created(){
      this.initWebSocket();
      // this.itermOpen();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      closeSSH(){
        // alert('我是关闭按钮');
        this.websocketclose();
        this.$router.push({path:'/host/hostAll'})
      },
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://127.0.0.1:2020/terminals/";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        // let actions = {"test":"12345"};
        // this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(evt){ //数据接收
        let str = evt.data;
        // console.log(str);
        // this.term.write(str);
        // const redata = JSON.parse(e.data);
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        // console.log('断开连接',e);
      },


    },
    mounted () {
      var __this = this;
      __this.term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: 40, //行数
        convertEol: true, //启用时，光标将设置为下一行的开头
        scrollback:100,//终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorStyle: 'bar', //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
          foreground: '#f6f6f6', //字体
          background: '#060101', //背景色
          // cursor: 'help',//设置光标
        }
      });
      // __this.term.fit;
      __this.term.open(document.getElementById('terminal-container'));

      __this.term.attach(__this.websock);
      __this.term._initialized = true;

      // __this.term.on("data", function(data) {
      //   // console.log("输入", data);
      //   // websocket.send(new TextEncoder().encode("\x00" + data));
      //   __this.websock.send("\x00" + data);
      // });
      //
      // //选中 复制
      // __this.term.on("selection", function() {
      //   if (__this.term.hasSelection()) {
      //     __this.copy = __this.term.getSelection();
      //   }
      // });
      //
      // __this.term.attachCustomKeyEventHandler(function(ev) {
      //   //粘贴 ctrl+v
      //   if (ev.keyCode == 86 && ev.ctrlKey) {
      //     // websocket.send(new TextEncoder().encode("\x00" + this.copy));
      //     __this.websock.send("\x00" + this.copy);
      //   }
      // });
    },
  }
</script>

<style scoped>
  #webTitle{
    background-color: #dcdcdb;
    margin: 0;
  }
  #webTitle>button{
    background-color: #dcdcdb;
    border:none;

  }
  html,body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
  }

</style>



