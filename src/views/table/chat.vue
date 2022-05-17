<template>
  <div class="chat-box">
    <div ref="msg-box" class="msg-box">
      <div
        v-for="(i,index) in list"
        :key="index"
        class="msg"
        :style="i.userId == userId?'flex-direction:row-reverse':''"
      >
        <div class="user-head">
          <div
            class="head"
            :style="` background: hsl(${getUserHead(i.userId,'bck')}, 88%, 62%); clip-path:polygon(${getUserHead(i.userId,'polygon')}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(i.userId,'rotate')}deg)`"
          />
        </div>
        <div class="user-msg">
          <span
            :style="i.userId == userId?' float: right;':''"
            :class="i.userId == userId?'right':'left'"
          >{{ i.msg }}</span>
        </div>
      </div>
    </div>
    <div class="input-box">
      <input ref="sendMsg" v-model="contentText" type="text" @keyup.enter="sendText()">
      <div class="btn" :class="{['btn-active']:contentText}" @click="sendText()">发送</div>
    </div>
    <div class="user-list">

      <div v-for="(i,index) in userlist" :key="index" class="user-item" @click="changeuser(i,index)">
        <img src="https://gitee.com/static/images/logo-black.svg" class="user-head">
        <div class="content-box">
          <div class="content">
            <div class="name">{{ i.userId }}</div>
            <div class="msg">{{ i.content }}</div>
          </div>
          <div class="action">
            <div class="time">{{ i.time }}</div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      ws: null,
      count: 0,
      userId: null, // 当前用户ID
      list: [], // 聊天记录的数组
      userlist: [],
      contentText: '', // input输入的值
      index: 0// 当前位置
    }
  },
  created() {
    this.getUserID()
  },
  mounted() {
    this.initWebSocket()
    this.getHistory()
    this.getUserList()
  },
  methods: {
    // 根据时间戳作为当前用户ID
    getUserID() {
      this.userId = 1
      this.userId = -this.userId
    },
    getHistory() {
      request({
        url: '/message/getList',
        method: 'get',
        params: { userid: -this.userId, channel: '1' }
      }).then(data => {
        const len = data.data.length
        for (let i = 0; i < len; i++) {
          const item = JSON.parse(data.data[i].msg)
          this.list.push({ userId: item.userId, msg: item.content })
        }
        setTimeout(() => {
          this.scrollBottm()
        }, 3)
      })
    },
    changeuser(item, index) {
      console.log(item)
      if (this.index !== index) {
        this.userId = -item.userId
        this.index = index
        this.list = []
        this.ws.close()
        this.initWebSocket()
        this.getHistory()
      } else {
        console.log('repeat')
      }
    },
    getUserList() {
      request({
        url: '/message/getALLbychannel',
        method: 'get',
        params: { channel: '1' }
      }).then(data => {
        const mp = data.data
        const keys = Object.keys(mp)
        for (let i = 0; i < keys.length; i++) {
          const item = mp[keys[i]]
          const it = item[item.length - 1]
          const msg = JSON.parse(it.msg)
          this.userlist.push({ userId: it.uid, content: msg.content, time: it.createdate })
        }
        console.log(data.data)
      })
    },
    // 根据userID生成一个随机头像
    getUserHead(id, type) {
      const ID = String(id)
      if (type === 'bck') {
        return Number(ID.substring(ID.length - 3))
      }
      if (type === 'polygon') {
        return Number(ID.substring(ID.length - 2))
      }
      if (type === 'rotate') {
        return Number(ID.substring(ID.length - 3))
      }
    },
    // 滚动条到底部
    scrollBottm() {
      const el = this.$refs['msg-box']
      el.scrollTop = el.scrollHeight
    },
    // 发送聊天信息
    sendText() {
      const _this = this
      _this.$refs['sendMsg'].focus()
      if (!_this.contentText) {
        return
      }
      const params = {
        userId: _this.userId,
        msg: _this.contentText
      }
      _this.ws.send(JSON.stringify(params)) // 调用WebSocket send()发送信息的方法
      request({
        url: '/message/send',
        method: 'get',
        params: {
          room_id: '1',
          user_id: -this.userId,
          msg: JSON.stringify({
            userId: _this.userId,
            content: _this.contentText
          })
        }
      })
      _this.userlist[this.index].content = _this.contentText
      _this.list = [
        ..._this.list,
        { userId: _this.userId, msg: _this.contentText }
      ]
      _this.contentText = ''
      setTimeout(() => {
        _this.scrollBottm()
      }, 500)
    },
    // 进入页面创建websocket连接
    initWebSocket() {
      const _this = this
      // 判断页面有没有存在websocket连接
      if (window.WebSocket) {
        const ws = new WebSocket(process.env.VUE_APP_BASE_API.replace('http', 'ws') + '/pushMessage/' + -this.userId + '/apctoken')
        _this.ws = ws
        ws.onopen = function(e) {
          console.log('服务器连接成功')
        }
        ws.onclose = function(e) {
          console.log('服务器连接关闭')
        }
        ws.onerror = function() {
          console.log('服务器连接出错')
        }
        ws.onmessage = function(e) {
          // 接收服务器返回的数据
          const resData = JSON.parse(e.data)
          if (resData.funName === 'userCount') {
            _this.count = resData.users
            _this.list = resData.chat
            console.log(resData.chat)
          } else {
            _this.list = [
              ..._this.list,
              { userId: resData.userId, msg: resData.msg }
            ]
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-box {
  margin: 0 auto;
  background: #fafafa;
  position: absolute;
  height: 100%;
  width: 100%;
  //max-width: 700px;
  header {
    position: fixed;
    width: 100%;
    height: 3rem;
    background: #409eff;
    //max-width: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    font-size: 1rem;
  }
  .msg-box {
    position: absolute;
    height: calc(100% - 6.5rem);
    width: 70%;
    margin-top: 3rem;
    overflow-y: scroll;
    .msg {
      width: 95%;
      min-height: 2.5rem;
      margin: 1rem 0.5rem;
      position: relative;
      display: flex;
      justify-content: flex-start !important;
      .user-head {
        min-width: 2.5rem;
        width: 20%;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        .head {
          width: 1.2rem;
          height: 1.2rem;
        }
        // position: absolute;
      }
      .user-msg {
        width: 80%;
        // position: absolute;
        word-break: break-all;
        position: relative;
        z-index: 5;
        span {
          display: inline-block;
          padding: 0.5rem 0.7rem;
          border-radius: 0.5rem;
          margin-top: 0.2rem;
          font-size: 0.88rem;
        }
        .left {
          background: white;
          animation: toLeft 0.5s ease both 1;
        }
        .right {
          background: #53a8ff;
          color: white;
          animation: toright 0.5s ease both 1;
        }
        @keyframes toLeft {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
        @keyframes toright {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
      }
    }
  }
  .input-box {
    padding: 0 0.5rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 10%;
    background: #fafafa;
    box-shadow: 0 0 5px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      height: 2.3rem;
      display: inline-block;
      width: 100%;
      padding: 0.5rem;
      border: none;
      border-radius: 0.2rem;
      font-size: 0.88rem;
    }
    .btn {
      height: 2.3rem;
      min-width: 4rem;
      background: #e0e0e0;
      padding: 0.5rem;
      font-size: 0.88rem;
      color: white;
      text-align: center;
      border-radius: 0.2rem;
      margin-left: 0.5rem;
      transition: 0.5s;
    }
    .btn-active {
      background: #409eff;
    }
  }
  .user-list{
      position: absolute;
      background: #9895af;
      right: 0px;
      height: 90%;
      width: 30%;
      overflow-y: auto;

      .user-item{
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: teal;
            position: relative;
            overflow: hidden;
          .user-head{
              width:45px;
              height: 45px;
              border-radius: 5px;
            background-color: #409eff;
          }.content-box{
              margin-left: 10px;
              flex: 1;
              background-color: #9895af;
              display: flex;
              justify-content: space-between;
              align-items: center;
                .content{
                    .name{
                        width: 50px;
                        padding: 8px;
                        background-color: #9895af;
                    }
                    .msg{
                        margin-top: 8px;
                        width: 150px;
                        padding: 8px;
                        background-color: #9895af;
                    }
                }.action{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .time{
                        width: 10px;
                        padding: 5px;
                        background-color: #9895af;
                    }
                }
          }.content-box::before{
              content: " ";
              position: absolute;
              bottom: 0;
              width: 100%;
              height: 1px;
              background-color: #9895af;
          }

      }
  }
}
</style>
