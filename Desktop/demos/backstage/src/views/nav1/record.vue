<template>
  <section>
    <!-- 表格内容 -->
    <template>
      <table style="table-layout:fixed;">
        <thead>
          <th>ID</th>
          <th>用户</th>
          <th>提现金额</th>
          <th>提现时间</th>
          <th>提现账号</th>
          <th>通过/拒绝</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in allUserData" :key="index">
            <td>{{item.uid}}</td>
            <td>{{item.account}}</td>
            <td>{{item.account}}</td>
            <td>{{item.create_time | dateFilter}}</td>
            <td>{{item.gender}}</td>
            <td>
              <el-button @click="allUser(index)">查看详情</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    <!-- 审核按钮弹出框 -->
      <el-dialog title="用户详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" >
        <div class="dialogBox">
          <span>昵称:</span>
          <b>{{ allUserData[this.userItem].nick }}</b>
        </div>
        <div class="dialogBox">
          <span>三围:</span>
          <b>2</b>
        </div>
        <div class="dialogBox">
          <span>个性签名:</span>
          <b>{{ allUserData[this.userItem].signature }}</b>
        </div>
        <div class="dialogBox">
          <span>年龄:</span>
          <b>{{ allUserData[this.userItem].age }}</b>
        </div>

        <div class="dialogBox">
          <span>性别:</span>
          <b>{{ allUserData[this.userItem].gender }}</b>
        </div>
        <div class="dialogBox">
          <span>城市:</span>
          <b>{{ allUserData[this.userItem].location }}</b>
        </div>
        <div class="dialogBox">
          <span>籍贯:</span>
          <b>{{ allUserData[this.userItem].native_place }}</b>
        </div>
        <div class="dialogBox">
          <span>职业:</span>
          <b>{{ allUserData[this.userItem].occupation }}</b>
        </div>
        <div class="dialogBox">
          <span>学历:</span>
          <b>{{ allUserData[this.userItem].education }}</b>
        </div>
        <div class="dialogBox">
          <span>体重:</span>
          <b>{{ allUserData[this.userItem].weight }}</b>
        </div>
        <div class="dialogBox">
          <span>身高:</span>
          <b>{{ allUserData[this.userItem].height }}</b>
        </div>
        <div class="dialogBox">
          <span>穿衣风格:</span>
          <b>{{ allUserData[this.userItem].clothing_style }}</b>
        </div>
        <div class="dialogBox">
          <span>生活品质:</span>
          <b>{{ allUserData[this.userItem].life_quality }}</b>
        </div>
        <div class="dialogBox">
          <span>月收入:</span>
          <b>{{ allUserData[this.userItem].monty_income }}</b>
        </div>
        <div class="dialogBox">
          <span>年收入:</span>
          <b>{{ allUserData[this.userItem].year_income }}</b>
        </div>
        <div class="dialogBox">
          <span>总资产:</span>
          <b>{{ allUserData[this.userItem].all_assets }}</b>
        </div>
        <div class="dialogBox">
          <span>接受约会时间段:</span>
          <b>{{ allUserData[this.userItem].meeting_time }}</b>
        </div>


        <div class="dialogBox">
          <span>兴趣爱好:</span>
          <b>{{ allUserData[this.userItem].liking }}</b>
        </div>
        <div class="dialogBox">
          <span>饮酒习惯:</span>
          <b>{{ allUserData[this.userItem].drinking }}</b>
        </div>
        <div class="dialogBox">
          <span>抽烟习惯:</span>
          <b>{{ allUserData[this.userItem].smoking }}</b>
        </div>
        <div class="dialogBox">
          <span>个人头像:</span>
          <!-- <b>{{item.avatar}}</b> -->
          <viewer>
          <img :src="allUserData[this.userItem].avatar" alt="" style="display:inline-block;width:100px;height:100px" >
          </viewer>
        </div>
        <div class="dialogBox">
          <span>封面图片:</span>
          <!-- <b>{{item.cover}}</b> -->
          <viewer>
          <img :src="allUserData[this.userItem].cover" alt="" style="display:inline-block;width:100px;height:100px;margin-top:10px">
          </viewer>
        </div>
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
      allUserData:[{
        "uid": "",
        "account": "",
        "cover": "",
        "avatar": "",
        "gender": "",
        "age": "",
        "nick": "",
        "follower_count": "",
        "follow_count": "",
        "location": "",
        "native_place": "",
        "occupation": "",
        "education": "",
        "bust": "",
        "waist": "",
        "hipline": "",
        "weight": "",
        "smoking": "",
        "drinking": "",
        "meeting_time": "",
        "signature": "",
        "create_time": ""
      }],
      // 输入框内容
      userInput:"",
      // 弹框的显示隐藏控制
      dialogVisible: false,
      // 点击去审核，保存当前项的索引
      userItem:0,
      // 分页的每一页
      page:1,
      // 分页的总页数
      total: 1,
      // 测试接口域名
      // url: "http://admintest.ppparty.cn",
      // 正式接口域名
      url:"http://adminpro.ppparty.cn",
      
    };
  },
  methods: {

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
      this.$ajax.post(`${this.url}/adminUser/searchUserList`,crypto.encrypt(JSON.stringify({page:this.page,limit:10})))
    .then(data => {
        console.log(JSON.parse(crypto.decrypt(data.data)))
        let userData = JSON.parse(crypto.decrypt(data.data)).data
        let userDatas = userData.list.map(function(item){
            if(item.gender == 1){
                item.gender = "男"
            }else{
                item.gender = "女"
            }

            item.create_time = JSON.parse(item.create_time) * 1000;
            return item
        })
        this.allUserData = userDatas;
        this.total = Math.ceil(userData.total_num/10);
    })
    },
    allUser(index){
        console.log(index,this.allUserData)
        this.dialogVisible = true;
        this.userItem = index
    },
    query(){
        this.page = 1
        // if(this.userInput.length < 11){
        //     alert("请正确填写手机号！")
        // }else{
            this.$ajax.post(`${this.url}/adminUser/searchUserList`,crypto.encrypt(JSON.stringify({page:this.page,limit:10,account:this.userInput})))
    .then(data => {
        console.log(JSON.parse(crypto.decrypt(data.data)))
        let userData = JSON.parse(crypto.decrypt(data.data)).data
        let userDatas = userData.list.map(function(item){
            if(item.gender == 1){
                item.gender = "男"
            }else{
                item.gender = "女"
            }

            item.create_time = JSON.parse(item.create_time) * 1000;
            return item
        })
        if(userDatas.length != 0){
          this.allUserData = userDatas;
        }else{
            alert("暂无该用户！")
        }
        console.log(this.allUserData)
        this.total = Math.ceil(userData.total_num/10);
    })
        // }
    }
  },
  created:function(){
    // 初始化状态请求数据，修改data的tableData的值
    this.$ajax.post(`${this.url}/adminUser/searchUserList`,crypto.encrypt(JSON.stringify({page:this.page,limit:10})))
    .then(data => {
        console.log(JSON.parse(crypto.decrypt(data.data)))
        let userData = JSON.parse(crypto.decrypt(data.data)).data
        let userDatas = userData.list.map(function(item){
            if(item.gender == 1){
                item.gender = "男"
            }else{
                item.gender = "女"
            }

            item.create_time = JSON.parse(item.create_time) * 1000;
            return item
        })
        this.allUserData = userDatas;
        this.total = Math.ceil(userData.total_num/10);
    })
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

.imgSize{
    display: inline-block;
    width: 100px;
    height: 150px;
}





</style>