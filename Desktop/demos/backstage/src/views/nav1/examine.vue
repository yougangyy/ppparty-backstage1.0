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
          <el-button type="primary" @click="getPhone()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 表格内容 -->
    <template>
      <table style="table-layout:fixed;">
        <thead>
          <th>手机号</th>
          <th>性别</th>
          <th>修改信息字段</th>
          <th>提交时间</th>
          <th>审核状态</th>
          <th>操作</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tableData" :key="index" :id="item.id" @click="trClick(item,index)" >
            <td>{{item.account}}</td>
            <td>{{item.gender}}</td>
            <td style="width:20%;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              {{item.location}},
              {{item.native_place}},
              {{item.occupation}},
              {{item.education}},
              </td>
            <td>{{item.create_time | dateFilter}}</td>
            <td v-if="item.info_status == 1">未审核</td>
            <td v-else-if = "item.info_status == 2">已通过</td>
            <td v-else>已拒绝</td>
            <td>
              <el-button type="success" plain @click="itemClick(index)" v-if="item.info_status == 1">去审核</el-button>
              <p v-else-if = "item.info_status == 2">已通过</p>
              <p v-else>已拒绝</p>
            </td>
          </tr>
        </tbody>
      </table>
    <!-- 审核按钮弹出框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" >
        <div class="dialogBox">
          <span>昵称:</span>
          <b>{{ tableData[this.itemIndex].nick }}</b>
        </div>
        <div class="dialogBox">
          <span>三围:</span>
          <b>{{tableData[this.itemIndex].bust}}-{{tableData[this.itemIndex].waist}}-{{tableData[this.itemIndex].hipline}}</b>
        </div>
        <div class="dialogBox">
          <span>个性签名:</span>
          <b>{{tableData[this.itemIndex].signature}}</b>
        </div>
        <div class="dialogBox">
          <span>年龄:</span>
          <b>{{tableData[this.itemIndex].age}}</b>
        </div>

        <div class="dialogBox">
          <span>性别:</span>
          <b>{{tableData[this.itemIndex].gender}}</b>
        </div>
        <div class="dialogBox">
          <span>城市:</span>
          <b>{{tableData[this.itemIndex].location}}</b>
        </div>
        <div class="dialogBox">
          <span>籍贯:</span>
          <b>{{tableData[this.itemIndex].native_place}}</b>
        </div>
        <div class="dialogBox">
          <span>职业:</span>
          <b>{{tableData[this.itemIndex].occupation}}</b>
        </div>
        <div class="dialogBox">
          <span>学历:</span>
          <b>{{tableData[this.itemIndex].education}}</b>
        </div>
        <div class="dialogBox">
          <span>体重:</span>
          <b>{{tableData[this.itemIndex].weight}}</b>
        </div>
        <div class="dialogBox">
          <span>身高:</span>
          <b>{{tableData[this.itemIndex].height}}</b>
        </div>
        <div class="dialogBox">
          <span>穿衣风格:</span>
          <b>{{tableData[this.itemIndex].clothing_style}}</b>
        </div>
        <div class="dialogBox">
          <span>生活品质:</span>
          <b>{{tableData[this.itemIndex].life_quality}}</b>
        </div>
        <div class="dialogBox">
          <span>月收入:</span>
          <b>{{tableData[this.itemIndex].monty_income}}</b>
        </div>
        <div class="dialogBox">
          <span>年收入:</span>
          <b>{{tableData[this.itemIndex].year_income}}</b>
        </div>
        <div class="dialogBox">
          <span>总资产:</span>
          <b>{{tableData[this.itemIndex].all_assets}}</b>
        </div>
        <div class="dialogBox">
          <span>接受约会时间段:</span>
          <b>{{tableData[this.itemIndex].meeting_time}}</b>
        </div>


        <div class="dialogBox">
          <span>兴趣爱好:</span>
          <b>{{tableData[this.itemIndex].liking}}</b>
        </div>
        <div class="dialogBox">
          <span>饮酒习惯:</span>
          <b>{{tableData[this.itemIndex].drinking}}</b>
        </div>
        <div class="dialogBox">
          <span>抽烟习惯:</span>
          <b>{{tableData[this.itemIndex].smoking}}</b>
        </div>
        <div class="dialogBox">
          <span>个人头像:</span>
          <!-- <b>{{item.avatar}}</b> -->
          <viewer>
          <img :src="tableData[this.itemIndex].avatar" alt="" style="display:inline-block;width:100px;height:100px" >
          </viewer>
        </div>
        <div class="dialogBox">
          <span>封面图片:</span>
          <!-- <b>{{item.cover}}</b> -->
          <viewer>
          <img :src="tableData[this.itemIndex].cover" alt="" style="display:inline-block;width:100px;height:100px;margin-top:10px">
          </viewer>
        </div>

        <span slot="footer" class="dialog-footer" v-if="buttonDialog">
          <el-button @click="EXrefuseClick(tableData[itemIndex].id,tableData[itemIndex])">拒 绝</el-button>
          <el-button type="primary" @click="EXadoptClick(tableData[itemIndex].id,tableData[itemIndex])">通 过</el-button>
        </span>
      </el-dialog>


      <!--工具条-->
      <el-col :span="24" class="toolbar pagings">
        <el-pagination
          layout="prev, pager, next"
          :page-size="1"
          :total="total"
          style="float:right;"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </template>
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
          value: "1",
          label: "未审核"
        },
        {
          value: "2",
          label: "已通过"
        },
        {
          value: "3",
          label: "已拒绝"
        }
      ],
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
      input:"",
      // 时间戳转换保存变量
      datavalue1: "",
      datavalue2: "",
      // 弹框的显示隐藏控制
      dialogVisible: false,
      buttonDialog:false,
      // 点击去审核，保存当前项的索引
      itemIndex:0,
      // 分页的每一页
      page:1,
      // 分页的总页数
      total: 1,
      // 测试接口域名
      // url: "http://admintest.ppparty.cn",
      // 正式接口域名
      url:"http://adminpro.ppparty.cn",
      tableData: [{
        "id": "",
        "uid": "",
        "account": "",
        "cover": "",
        "avatar": "",
        "gender": "",
        "age": "",
        "nick": "",
        "type": "",
        "location": "",
        "native_place": "",
        "occupation": "",
        "education": "",
        "bust": "",
        "waist": "",
        "hipline": "",
        "weight": "",
        "height": "",
        "smoking": "",
        "drinking": "",
        "liking": "",
        "birthday": "",
        "clothing_style": "",
        "life_quality": "",
        "monty_income": "",
        "year_income": "",
        "all_assets": "",
        "meeting_time": "",
        "signature": ""
      }]
    };
  },
  methods: {
    getPhone() {
      this.page = 1
      // 点击查询向后台发送请求，请求数据，保存到tableData上
      this.$ajax
      .post(
        `${this.url}/adminUser/searchInfoList`,
        crypto.encrypt(JSON.stringify({ page: this.page, limit: 10,status:this.value3,account:this.input }))
      )
      .then(response => {
        let responseList = JSON.parse(crypto.decrypt(response.data)).data;
        var responseLists = responseList.list.map(function(item) {
          if (item.gender == 1) {
            item.gender = "男";
          } else {
            item.gender = "女";
          }
          item.create_time = JSON.parse(item.create_time) * 1000;
          return item;
        });
        if(responseLists.length != 0){
          this.tableData = responseLists;
        }else{
            alert("暂无该用户！")
        }
        // 计算总页数
        this.total = Math.ceil(responseList.total_num/10);
      })
      .catch(error => {
        alert("请刷新网络");
      });
    },
    handleClose(done) {
      // 弹框左上角关闭按钮二次确认
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleCurrentChange(val) {
      // 当页数发生改变，想后台请求数据，
      this.page = val;
      this.$ajax
        .post(
          `${this.url}/adminUser/searchInfoList`,
          crypto.encrypt(JSON.stringify({ page: this.page, limit: 10,status:this.value3}))
        )
        .then(response => {
          let responseList = JSON.parse(crypto.decrypt(response.data)).data;
          var responseLists = responseList.list.map(function(item) {
            if (item.gender == 1) {
              item.gender = "男";
            } else {
              item.gender = "女";
            }
            item.create_time = JSON.parse(item.create_time) * 1000;
            return item;
          });
          this.tableData = responseLists;
        })
        .catch(error => {
          alert("请刷新网络");
        });
    },
    itemClick(index){
      // 点击去审核，保存当前项的索引，打开弹框
      this.itemIndex=index
      this.dialogVisible = true;
    },
    EXadoptClick(id,num){
      // 点击通过，二次弹框后向后台发送通过
      this.$confirm("确认通过？")
        .then(_ => {
          this.$ajax.post(`${this.url}/adminUser/checkInfoStatus`,crypto.encrypt(JSON.stringify({ id: id,  status: 2 })))
          .then(data=>{
            this.dialogVisible = false;
              num.info_status = 2;
          })
          .catch(error => {
              alert("请刷新网络");
            });
          // this.$forceUpdate();
          done();
        })
        .catch(_ => {});
      
      
    },
    EXrefuseClick(id,num){
      // 点击拒绝，二次确认后向后台发送拒绝
      this.$confirm("确认拒绝？")
        .then(_ => {
          this.$ajax.post(`${this.url}/adminUser/checkInfoStatus`,crypto.encrypt(JSON.stringify({ id: id,  status:3 })))
          .then(data=>{
            this.dialogVisible = false;
              num.info_status = 3;
          })
          .catch(error => {
              alert("请刷新网络");
            });
          // this.$forceUpdate();
          done();
        })
        .catch(_ => {});
      
    },
    trClick(item,index){
      console.log(item.info_status,index)
      if(item.info_status == 1){
        console.log("123")
        this.buttonDialog = true
      }else{
        this.buttonDialog = false
      }
      this.itemIndex = index
      this.dialogVisible=true;
    }
  },
  created:function(){
    // 初始化状态请求数据，修改data的tableData的值
    this.$ajax
      .post(
        `${this.url}/adminUser/searchInfoList`,
        crypto.encrypt(JSON.stringify({ page: this.page, limit: 10,}))
      )
      .then(response => {
        let responseList = JSON.parse(crypto.decrypt(response.data)).data;
        var responseLists = responseList.list.map(function(item) {
          if (item.gender == 1) {
            item.gender = "男";
          } else {
            item.gender = "女";
          }
          item.create_time = JSON.parse(item.create_time) * 1000;
          return item;
        });
        this.tableData = responseLists;
        this.total = Math.ceil(responseList.total_num/10);
      })
      .catch(error => {
        alert("请刷新网络");
      });
  }
};
</script>

<style>

.content-container {
  position: relative;
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

.pagings {
  width: 100%;
  margin-top: 30px;
}

.dialogBox{
  width: 80%;
  display: flex;
  justify-content: space-between;
  font-size: 16px;

  margin-top:10px;
}







</style>