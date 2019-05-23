<template>
  <section>
    <!-- 头部搜索栏 -->
    <el-col :span="24" class="toolbar" style="padding-top: 20px;">
      <el-form :inline="true" style="display:flex;justify-content: space-around">
        <el-select v-model="value3" clearable placeholder="审核状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item>
          <el-input v-model="input" placeholder="账号/手机号"></el-input>
        </el-form-item>
        <!-- <div style="display:flex">
          <div class="block">
            <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
          <span style="display:inline-block;width:40px;height:1px;background:#000;margin:20px 10px"></span>
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions1"
            class="timerSty"
          ></el-date-picker>
        </div> -->
        <el-form-item>
          <el-button type="primary" @click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 表格内容 -->
    <table>
      <thead>
        <th>手机号</th>
        <th>联系方式</th>
        <th>性别</th>
        <th>描述图片</th>
        <th>介绍视频</th>
        <th>提交时间</th>
        <th>审核状态</th>
        <th>操作</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in tableData" :key="index">
          <td>{{item.account}}</td>
          <td>{{item.nick}}</td>
          <td>{{item.gender}}</td>
          <td>

        <viewer>
            <img :src="item.image_a" class="table-Img" >
            <img :src="item.image_b" class="table-Img" >
            <img :src="item.image_c  " class="table-Img" >
            </viewer>
          </td>
          <td>
            <video
              :src="item.video"
              class="videoSty"
              ref="videoSty"
              controls
              @dblclick="videoSty($event)"
              :num="index"
              poster="http://h5.ppparty.cn/register/image/index-background.png"
            ></video>

            <!-- <video-player  class="video-player vjs-custom-skin"
     ref="videoPlayer"
     :playsinline="true"
     :options="playerOptions"
     :src="item.video"
     @click="videoClck(item)"
></video-player> -->
          </td>
          <td>{{item.update_time | dateFilter}}</td>
          <td v-if="item.status == 8">未审核</td>
          <td v-else-if = "item.status == 9">已通过</td>
          <td v-else>已拒绝</td>
          <td v-if="item.status == 8">
            <el-button type="success" plain @click="adoptClick(item.uid,item)">通过</el-button>
            <el-button type="danger" plain @click="refuseClick(item.uid,item)">拒绝</el-button>
          </td>
            <td v-else-if = "item.status == 9">已通过</td>
            <td v-else>已拒绝</td>
        </tr>
      </tbody>
    </table>

    <!--工具条－分页器-->
    <el-col :span="24" class="toolbar paging">
      <!-- <el-button type="danger"  :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="1"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
import timer from "../../common/js/timer";
import crypto from "../../common/js/crypto-js.js";

export default {
  data() {
    return {
      // 审核查询数据
      options: [
        {
          value: "8",
          label: "未审核"
        },
        {
          value: "9",
          label: "已通过"
        },
        {
          value: "10",
          label: "已拒绝"
        }
      ],
      // 测试接口域名
      // url: "http://admintest.ppparty.cn",
      // 正式接口域名
      url:"http://adminpro.ppparty.cn",

      // 列表内容数据
      tableData: [
      ],

    //   playerOptions : {
    //     playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
    //     autoplay: false, //如果true,浏览器准备好时开始回放。
    //     muted: false, // 默认情况下将会消除任何音频。
    //     loop: false, // 导致视频一结束就重新开始。
    //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    //     language: 'zh-CN',
    //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    //     sources: [{
    //       type: "",
    //       src: "" //url地址
    //     }],
    //     poster: "../../static/images/test.jpg", //你的封面地址
    //     // width: document.documentElement.clientWidth,
    //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
    //     controlBar: {
    //       timeDivider: true,
    //       durationDisplay: true,
    //       remainingTimeDisplay: false,
    //       fullscreenToggle: true  //全屏按钮
    //     }
    // },
      // 日期数据
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      // 搜索框内容
      // 开始时间内容
      value1: "",
      // 结束时间内容
      value2: "",
      // 审核状态内容
      value3: "",
      // 输入框内容
      input: "",
      // 时间戳转换
      datavalue1: "",
      datavalue2: "",
      // 分页数据
      // sels: [],
      // 分页总条数
      total: 1,
      // 每一页
      page: 1
    };
  },
  created() {
    // 初始化状态请求数据，修改data的tableData的值
    this.$ajax
      .post(
        `${this.url}/adminUser/searchLoginUserList`,
        crypto.encrypt(JSON.stringify({ page: this.page, limit: 10 }))
      )
      .then(response => {
        let responseList = JSON.parse(crypto.decrypt(response.data)).data;
        var responseLists = responseList.list.map(function(item) {
          if (item.gender == 1) {
            item.gender = "男";
          } else {
            item.gender = "女";
          }
          // 时间戳转换为日期
          item.update_time = JSON.parse(item.update_time) * 1000;
          return item;
        });
        this.tableData = responseLists;
        // 计算总条数
        this.total = Math.ceil(responseList.total_num/10);
      })
      .catch(error => {
        alert("请刷新网络");
      });
  },
  methods: {
    videoSty(e) {
      // 视频双击放大功能
      var el = e.currentTarget;
      el.webkitRequestFullscreen();
    },
    dateToMs(date) {
      // 时间戳转换
      let result = new Date(date).getTime()/1000;
      return result;
    },
    getUsers() {
      // 输入框内容调用时间戳转换成时间戳
      // this.datavalue1 = this.dateToMs(this.value1);
      // this.datavalue2 = this.dateToMs(this.value2);
      this.page = 1
      // 按条件查找请求数据
      this.$ajax
        .post(
          `${this.url}/adminUser/searchLoginUserList`,
          crypto.encrypt(JSON.stringify({ page: 1, limit: 10 , account: this.input , status:this.value3}))
        )
        .then(response => {
          let responseList = JSON.parse(crypto.decrypt(response.data)).data;
          var responseLists = responseList.list.map(function(item) {
            if (item.gender == 1) {
              item.gender = "男";
            } else {
              item.gender = "女";
            }
            item.update_time = JSON.parse(item.update_time) * 1000;
            return item;
          });
          this.tableData = responseLists;
          this.total = Math.ceil(responseList.total_num/10);
        })
        .catch(error => {
          alert("请刷新网络");
        })
    },
    handleCurrentChange(val) {
      // 分页发生修改时请求数据
      this.page = val;
      this.$ajax
        .post(
          `${this.url}/adminUser/searchLoginUserList`,
          crypto.encrypt(JSON.stringify({ page: this.page, limit: 10, account: this.input , status:this.value3 }))
        )
        .then(response => {
          let responseList = JSON.parse(crypto.decrypt(response.data)).data;
          var responseLists = responseList.list.map(function(item) {
            if (item.gender == 1) {
              item.gender = "男";
            } else {
              item.gender = "女";
            }
            item.update_time = JSON.parse(item.update_time) * 1000;
            return item;
          });
          this.tableData = responseLists;
          this.total = Math.ceil(responseList.total_num/10);
        })
        .catch(error => {
          alert("请刷新网络");
        });
    },
    adoptClick(id,item){
      // 审核通过时，调起弹框进行二次确认，向后台发送通过
      this.$confirm("确认通过？")
        .then(_ => {
          this.$ajax.post(`${this.url}/adminUser/checkLoginStatus`,crypto.encrypt(JSON.stringify({ uid: id,  status: 9 })))
          .then(data=>{
            item.status = 9;
          })
          .catch(error => {
              alert("请刷新网络");
            });
          // this.$forceUpdate();
          done();
        })
        .catch(_ => {});
      
    },
    refuseClick(id,item){
      // 审核拒绝时，调起弹框进行二次确认，向后台发送拒绝
       this.$confirm("确认拒绝？")
        .then(_ => {
          this.$ajax.post(`${this.url}/adminUser/checkLoginStatus`,crypto.encrypt(JSON.stringify({ uid: id,  status: 10 })))
          .then(data=>{
            item.status = 10;
          
          })
          .catch(error => {
              alert("请刷新网络");
            });
          // this.$forceUpdate();
          done();
        })
        .catch(_ => {});
      
    }
  }
};
</script>

<style>
.content-container {
  position: relative;
}
.table-Img {
  display: inline-block;
  width: 100px;
  height: 150px;
}
.videoSty {
  width: 150px;
  height: 200px;
  object-fit:inherit;
}
.timerSty span i {
  height: 25px;
}

table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border-spacing: 1;
  border-spacing: 0;
  border: 1px solid #efefef;
}

thead {
  width: 100%;
  height: 50px;
  background: #efefef;
}
th {
  padding: 10px 0;
}

tr {
  text-align: center;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #efefef;
}

td {
}

.paging {
  width: 100%;
  margin-top: 30px;
}

</style>