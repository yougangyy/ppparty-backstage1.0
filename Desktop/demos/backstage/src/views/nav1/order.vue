<template>
  <section>
    <!-- 头部搜索栏 -->
    <el-col :span="24" class="toolbar" style="padding-top: 20px;">
      <el-form :inline="true" style="display:flex;justify-content: space-around">
        <el-select v-model="value3" clearable placeholder="订单状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="value4" clearable placeholder="优先喜欢的">
          <el-option
            v-for="item in optionsLike"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-form-item>
          <el-input v-model="input" placeholder="手机号"></el-input>
        </el-form-item>-->
        <!-- <div style="display:flex">
          <div class="block">
            <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
          <span style="display:inline-block;width:15px;height:1px;background:#000;margin:20px 5px"></span>
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions1"
            class="timerSty"
          ></el-date-picker>
        </div>-->
        <el-form-item>
          <el-button type="primary" @click="getParty()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 表格内容 -->
    <template>
      <!-- 初始页面显示表格 -->
      <table>
        <thead>
          <th>
            聚会标题
            <br>备注信息
          </th>
          <th>
            聚会发起人昵称
            <br>手机号
          </th>
          <th>优先喜欢的</th>
          <th>
            需要人数/
            <br>报名人数/
            <br>通过人数
          </th>
          <th>聚会时间</th>
          <th>礼物</th>
          <th>发布时间</th>
          <th>订单状态</th>
          <th>操作</th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tableData" :key="index" style="font: 15px/30px '';">
            <td>
              {{item.title}}
              <br>
              {{item.remarks}}
            </td>
            <td>
              {{item.uid}}
              <br>
              {{item.account}}
            </td>
            <td>{{item.first_follow}}</td>
            <td>{{item.need_people}}/{{item.nocheck_people}}/{{item.pass_people}}</td>
            <td>
              {{item.start_time | dateFilter}}
              <br>
              {{item.end_time | dateFilter}}
            </td>
            <td>{{item.price}}/人</td>
            <td>{{item.create_time | dateFilter}}</td>
            <td>{{item.status}}</td>
            <td>
              <el-button type="success" plain @click="detailsClick(item.order_no)">查看详情</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 审核按钮弹出框 -->
      <el-dialog
        title="聚会单详情"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <div class="frame">
          <span style="float:left">当前报名用户</span>
          <el-form style="width:30%;float:left;margin:0 20px;">
            <el-input placeholder="手机号" v-model="phoneid"></el-input>
          </el-form>
          <el-button type="success" plain @click="adduser()">添加用户</el-button>
          <!-- 用户查询，添加弹框 -->
          <div class="addUserBox" v-if="adduserBox">
            <span>你确定添加此用户吗？</span>
            <div class="smallBox">
              <img :src="addUserData.avatar" alt>
              <div class="userPhone">
                <span>{{addUserData.nick}}</span>
                <p>{{addUserData.account}}</p>
              </div>
            </div>
            <textarea type="text" v-model="input5" class="addUserInput"></textarea>
            <span class="textSpan">请填写申请备注！</span>
            <el-button @click="cancel()">取消</el-button>
            <el-button type="success" @click="confirm(addUserData.uid)">确定</el-button>
          </div>
        </div>
        <!-- 弹框内用户报名表格 -->
        <table>
          <thead>
            <th width="20%">报名时间</th>
            <th>昵称</th>
            <th width="20%">手机号</th>
            <th width="20%">申请备注</th>
            <th width="30%">操作</th>
          </thead>
          <!-- 无用户报名时v-if控制显示表格 -->
          <tbody v-if="tbodyDisplay">
            <td></td>
            <td></td>
            <td style="text-align: center">暂无用户报名..</td>
            <td></td>
            <td></td>
          </tbody>
          <tbody v-else>
            <tr v-for="(item,index) in nocheckList" :key="index">
              <td>{{item.create_time | dateFilter}}</td>
              <td>{{item.nick}}</td>
              <td>{{item.account}}</td>
              <td>{{item.remarks}}</td>
              <td>
                <el-button type="success" plain @click="nocheckListClick(item.uid)">通过</el-button>
                <el-button type="success" plain @click="noagreeClick(item.uid)">拒绝</el-button>
              </td>
            </tr>
          </tbody>
        </table>

        <p>当前通过用户</p>
        <!-- 弹框内，用户报名通过表格 -->
        <table>
          <thead>
            <th width="20%">报名时间</th>
            <th>昵称</th>
            <th width="20%">手机号</th>
            <th width="20%">申请备注</th>
            <th width="30%">操作</th>
          </thead>
          <!-- 无用户通过，v-if控制显示表格 -->
          <tbody v-if="passListDisplay">
            <td></td>
            <td></td>
            <td style="text-align: center">暂无通过用户..</td>
            <td></td>
            <td></td>
          </tbody>
          <tbody v-else>
            <tr v-for="(item,index) in passList" :key="index">
              <td>{{item.create_time | dateFilter}}</td>
              <td>{{item.nick}}</td>
              <td>{{item.account}}</td>
              <td>{{item.remarks}}</td>
              <td>
                <el-button type="success" plain @click="dialogVisible = true">拒绝</el-button>
              </td>
            </tr>
          </tbody>
        </table>

        <p>当前拒绝用户</p>
        <!-- 弹框内，拒绝用户表格 -->
        <table>
          <thead>
            <th width="20%">报名时间</th>
            <th>昵称</th>
            <th width="20%">手机号</th>
            <th width="20%">申请备注</th>
            <th width="30%">操作</th>
          </thead>
          <!-- 无拒绝用户时，v-if控制显示表格 -->
          <tbody v-if="refuseListDisplay">
            <td></td>
            <td></td>
            <td style="text-align: center">暂无拒绝用户..</td>
            <td></td>
            <td></td>
          </tbody>
          <tbody v-else>
            <tr v-for="(item,index) in refuseList" :key="index">
              <td>{{item.create_time | dateFilter}}</td>
              <td>{{item.nick}}</td>
              <td>{{item.account}}</td>
              <td>{{item.remarks}}</td>
              <td>
                <el-button type="success" plain @click="dialogVisible = true">拒绝</el-button>
              </td>
            </tr>
          </tbody>
        </table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--工具条－分页器-->
      <el-col :span="24" class="toolbar orderPaging">
        <!-- <el-button type="danger"  :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination
          layout="prev, pager, next"
          :page-size="1"
          @current-change="changList"
          :total="total"
          style="float:right;"
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
      // 测试接口域名
      // url: "http://admintest.ppparty.cn",
      // 正式接口域名
      url:"http://adminpro.ppparty.cn",

      // 分页总条数
      total: 1,
      // 分页中的当前页，默认第一页
      page: 1,
      // 订单状态内数据
      options: [
        {
          value: null,
          label: "默认"
        },
        {
          value: "0",
          label: "预约中"
        },
        {
          value: "1",
          label: "进行中"
        },
        {
          value: "2",
          label: "聚会结束"
        },
        {
          value: "3",
          label: "聚会取消"
        }
      ],
      // 优先喜欢内数据
      optionsLike: [
        {
          value: null,
          label: "默认"
        },
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
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
      // value1: "",
      // value2: "",
      // 订单状态的value保存
      value3: "",
      // 优先喜欢的value保存
      value4: "",
      // 查询用户弹框的申请备注保存
      input5: "",
      // 弹框内手机号保存
      phoneid: "",
      // 弹框显示隐藏控制
      dialogVisible: false,
      // 查询用户弹框内信息保存数组，默认都为空
      addUserData: {
        nick: "",
        account: "",
        avatar: ""
      },
      // 查询用户弹框显示隐藏控制开关
      adduserBox: false,
      // 初始页面表格数据保存数组
      tableData: [],
      // 弹框内报名用户数据保存数组
      nocheckList: [],
      // 弹框内通过用户数据保存数组
      passList: [],
      // 弹框内拒绝用户数据保存数组
      refuseList: [],
      // 弹框内报名用户表格控制显示隐藏开关
      tbodyDisplay: false,
      // 弹框内通过用户表格控制显示隐藏开关
      passListDisplay: false,
      // 弹框内拒绝用户表格控制显示隐藏开关
      refuseListDisplay: false,
      // party的订单编号保存
      order_no: 0
    };
  },
  methods: {
    getParty() {
      // 按条件搜索，强制显示第一页数据
      this.page = 1;
      this.$ajax
        .post(
          `${this.url}/adminParty/getPartyList`,
          crypto.encrypt(
            JSON.stringify({
              page: this.page,
              limit: 10,
              first_follow: this.value4,
              status: this.value3
            })
          )
        )
        .then(data => {
          let partyData = JSON.parse(crypto.decrypt(data.data)).data;
          let partyDatas = partyData.list.map(function(item) {
            if (item.first_follow == 1) {
              item.first_follow = "是";
            } else {
              item.first_follow = "否";
            }
            if (item.status == 0) {
              item.status = "预约中";
            } else if (item.status == 1) {
              item.status = "聚会开始进行中";
            } else if (item.status == 2) {
              item.status = "聚会结束";
            } else {
              item.status = "聚会取消";
            }
            item.create_time = JSON.parse(item.create_time) * 1000;
            item.start_time = JSON.parse(item.start_time) * 1000;
            item.end_time = JSON.parse(item.end_time) * 1000;
            return item;
          });
          this.tableData = partyDatas;
          this.total = Math.ceil(partyData.total_num / 10);
        });
    },
    handleClose(done) {
      // 弹框关闭二次确认
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    detailsClick(partyId) {
      // 查询party详情，保存订单编号
      this.order_no = partyId;
      this.dialogVisible = true;
      this.$ajax
        .post(
          `${this.url}/adminParty/getPartyAllUser`,
          crypto.encrypt(JSON.stringify({ order_no: this.order_no }))
        )
        .then(data => {
          let nocheckListData = JSON.parse(crypto.decrypt(data.data)).data
            .nocheckList;
          let passListData = JSON.parse(crypto.decrypt(data.data)).data
            .passList;
          let refuseListData = JSON.parse(crypto.decrypt(data.data)).data
            .refuseList;

          let nocheckListDatas = nocheckListData.map(function(item) {
            item.create_time = JSON.parse(item.create_time) * 1000;
            return item;
          });

          let passListDatas = passListData.map(function(item) {
            item.create_time = JSON.parse(item.create_time) * 1000;
            return item;
          });

          let refuseListDatas = refuseListData.map(function(item) {
            item.create_time = JSON.parse(item.create_time) * 1000;
            return item;
          });

          if (nocheckListData.length != 0) {
            this.nocheckList = nocheckListData;
            this.tbodyDisplay = false;
          } else {
            this.tbodyDisplay = true;
          }

          if (passListData.length != 0) {
            this.passList = passListData;
            this.passListDisplay = false;
          } else {
            this.passListDisplay = true;
          }

          if (refuseListData.length != 0) {
            this.refuseList = refuseListData;
            this.refuseListDisplay = false;
          } else {
            this.refuseListDisplay = true;
          }

          this.passList = passListDatas;
          this.refuseList = refuseListDatas;
          this.nocheckList = nocheckListDatas;
        });
    },
    nocheckListClick(uid) {
      // 弹框内报名用户通过二次确认
      this.$confirm("确认通过？")
        .then(_ => {
          this.$ajax
            .post(
              `${this.url}/adminParty/changePartyUser`,
              crypto.encrypt(
                JSON.stringify({ uid: uid, order_no: this.order_no, status: 1 })
              )
            )
            .then(data => {
              this.$ajax
                .post(
                  `${this.url}/adminParty/getPartyAllUser`,
                  crypto.encrypt(JSON.stringify({ order_no: this.order_no }))
                )
                .then(data => {
                  alert(JSON.parse(crypto.decrypt(data.data)).msg);
                  let nocheckListData = JSON.parse(crypto.decrypt(data.data))
                    .data.nocheckList;
                  let passListData = JSON.parse(crypto.decrypt(data.data)).data
                    .passList;
                  let refuseListData = JSON.parse(crypto.decrypt(data.data))
                    .data.refuseList;

                  let nocheckListDatas = nocheckListData.map(function(item) {
                    item.create_time = JSON.parse(item.create_time) * 1000;
                    return item;
                  });

                  let passListDatas = passListData.map(function(item) {
                    item.create_time = JSON.parse(item.create_time) * 1000;
                    return item;
                  });

                  let refuseListDatas = refuseListData.map(function(item) {
                    item.create_time = JSON.parse(item.create_time) * 1000;
                    return item;
                  });

                  if (nocheckListData.length != 0) {
                    this.nocheckList = nocheckListData;
                    this.tbodyDisplay = false;
                  } else {
                    this.tbodyDisplay = true;
                  }

                  if (passListData.length != 0) {
                    this.passList = passListData;
                    this.passListDisplay = false;
                  } else {
                    this.passListDisplay = true;
                  }

                  if (refuseListData.length != 0) {
                    this.refuseList = refuseListData;
                    this.refuseListDisplay = false;
                  } else {
                    this.refuseListDisplay = true;
                  }

                  this.passList = passListDatas;
                  this.refuseList = refuseListDatas;
                  this.nocheckList = nocheckListDatas;
                });
            });
          done();
        })
        .catch(_ => {});
    },
    noagreeClick(uid) {
      // 弹框内报名用户拒绝按钮二次确认
      this.$confirm("确认拒绝？")
        .then(_ => {
          this.$ajax
            .post(
              `${this.url}/adminParty/changePartyUser`,
              crypto.encrypt(
                JSON.stringify({ uid: uid, order_no: this.order_no, status: 2 })
              )
            )
            .then(data => {
              alert(JSON.parse(crypto.decrypt(data.data)).msg);
              this.$ajax
                .post(
                  `${this.url}/adminParty/getPartyAllUser`,
                  crypto.encrypt(JSON.stringify({ order_no: this.order_no }))
                )
                .then(data => {
                  let nocheckListData = JSON.parse(crypto.decrypt(data.data))
                    .data.nocheckList;
                  let passListData = JSON.parse(crypto.decrypt(data.data)).data
                    .passList;
                  let refuseListData = JSON.parse(crypto.decrypt(data.data))
                    .data.refuseList;

                  let nocheckListDatas = nocheckListData.map(function(item) {
                    item.create_time = JSON.parse(item.create_time) * 1000;
                    return item;
                  });

                  let passListDatas = passListData.map(function(item) {
                    item.create_time = JSON.parse(item.create_time) * 1000;
                    return item;
                  });

                  let refuseListDatas = refuseListData.map(function(item) {
                    item.create_time = JSON.parse(item.create_time) * 1000;
                    return item;
                  });

                  if (nocheckListData.length != 0) {
                    this.nocheckList = nocheckListData;
                    this.tbodyDisplay = false;
                  } else {
                    this.tbodyDisplay = true;
                  }

                  if (passListData.length != 0) {
                    this.passList = passListData;
                    this.passListDisplay = false;
                  } else {
                    this.passListDisplay = true;
                  }

                  if (refuseListData.length != 0) {
                    this.refuseList = refuseListData;
                    this.refuseListDisplay = false;
                  } else {
                    this.refuseListDisplay = true;
                  }

                  this.passList = passListDatas;
                  this.refuseList = refuseListDatas;
                  this.nocheckList = nocheckListDatas;
                });
            });
          done();
        })
        .catch(_ => {});
    },
    adduser() {
      // 弹框内根据手机号查找判断是否是11位手机号，显示用户信息
      if (this.phoneid.length < 11) {
        alert("请正确填写手机号！");
      } else {
        this.$ajax
          .post(
            `${this.url}/adminUser/searchUserInfo`,
            crypto.encrypt(JSON.stringify({ account: this.phoneid }))
          )
          .then(data => {
            var userdata = JSON.parse(crypto.decrypt(data.data)).data.info;
            if (userdata == null || userdata == "") {
              alert("没有查到该用户！");
            } else {
              this.addUserData = userdata;
              this.adduserBox = true;
            }
          });
      }
    },
    cancel() {
      // 弹框取消关闭
      this.adduserBox = false;
    },
    confirm(addUid) {
      // 确认添加用户，判断申请备注是否为空，二次确认
      if (this.input5 == "") {
        alert("请填写申请备注！");
      } else {
        this.$confirm("确认通过？")
          .then(_ => {
            this.$ajax
              .post(
                `${this.url}/adminParty/joinParty`,
                crypto.encrypt(
                  JSON.stringify({
                    uid: addUid,
                    order_no: this.order_no,
                    remarks: this.input5
                  })
                )
              )
              .then(data => {
                alert(JSON.parse(crypto.decrypt(data.data)).msg);
                this.$ajax
                  .post(
                    `${this.url}/adminParty/getPartyAllUser`,
                    crypto.encrypt(JSON.stringify({ order_no: this.order_no }))
                  )
                  .then(data => {
                    let nocheckListData = JSON.parse(crypto.decrypt(data.data))
                      .data.nocheckList;
                    let passListData = JSON.parse(crypto.decrypt(data.data))
                      .data.passList;
                    let refuseListData = JSON.parse(crypto.decrypt(data.data))
                      .data.refuseList;

                    let nocheckListDatas = nocheckListData.map(function(item) {
                      item.create_time = JSON.parse(item.create_time) * 1000;
                      return item;
                    });

                    let passListDatas = passListData.map(function(item) {
                      item.create_time = JSON.parse(item.create_time) * 1000;
                      return item;
                    });

                    let refuseListDatas = refuseListData.map(function(item) {
                      item.create_time = JSON.parse(item.create_time) * 1000;
                      return item;
                    });

                    if (nocheckListData.length != 0) {
                      this.nocheckList = nocheckListData;
                      this.tbodyDisplay = false;
                    } else {
                      this.tbodyDisplay = true;
                    }

                    if (passListData.length != 0) {
                      this.passList = passListData;
                      this.passListDisplay = false;
                    } else {
                      this.passListDisplay = true;
                    }

                    if (refuseListData.length != 0) {
                      this.refuseList = refuseListData;
                      this.refuseListDisplay = false;
                    } else {
                      this.refuseListDisplay = true;
                    }

                    this.passList = passListDatas;
                    this.refuseList = refuseListDatas;
                    this.nocheckList = nocheckListDatas;
                  });
              });

            this.adduserBox = false;
            done();
          })
          .catch(_ => {});
      }
    },
    changList(val) {
      // 分页器发生改变，请求数据重新渲染页面
      this.page = val;
      this.$ajax
        .post(
          `${this.url}/adminParty/getPartyList`,
          crypto.encrypt(
            JSON.stringify({
              page: this.page,
              limit: 10,
              first_follow: this.value4,
              status: this.value3
            })
          )
        )
        .then(data => {
          let partyData = JSON.parse(crypto.decrypt(data.data)).data;
          let partyDatas = partyData.list.map(function(item) {
            if (item.first_follow == 1) {
              item.first_follow = "是";
            } else {
              item.first_follow = "否";
            }
            if (item.status == 0) {
              item.status = "预约中";
            } else if (item.status == 1) {
              item.status = "聚会开始进行中";
            } else if (item.status == 2) {
              item.status = "聚会结束";
            } else {
              item.status = "聚会取消";
            }
            item.create_time = JSON.parse(item.create_time) * 1000;
            item.start_time = JSON.parse(item.start_time) * 1000;
            item.end_time = JSON.parse(item.end_time) * 1000;
            return item;
          });
          this.total = Math.ceil(partyData.total_num / 10);
          this.tableData = partyDatas;
        });
    }
  },

  created: function() {
    // 页面初始状态请求数据，渲染页面
    this.$ajax
      .post(
        `${this.url}/adminParty/getPartyList`,
        crypto.encrypt(JSON.stringify({ page: this.page, limit: 10 }))
      )
      .then(data => {
        let partyData = JSON.parse(crypto.decrypt(data.data)).data;
        let partyDatas = partyData.list.map(function(item) {
          if (item.first_follow == 1) {
            item.first_follow = "是";
          } else {
            item.first_follow = "否";
          }
          if (item.status == 0) {
            item.status = "预约中";
          } else if (item.status == 1) {
            item.status = "聚会开始进行中";
          } else if (item.status == 2) {
            item.status = "聚会结束";
          } else {
            item.status = "聚会取消";
          }
          item.create_time = JSON.parse(item.create_time) * 1000;
          item.start_time = JSON.parse(item.start_time) * 1000;
          item.end_time = JSON.parse(item.end_time) * 1000;
          return item;
        });
        this.total = Math.ceil(partyData.total_num / 10);
        this.tableData = partyDatas;
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

td {
  padding: 10px 0;
}

.orderPaging {
  width: 100%;
  margin-top: 30px;
  position: relative;
}

.frame {
  line-height: 40px;
  margin-bottom: 20px;
}

.addUserBox {
  width: 200px;
  height: 300px;
  opacity: 0.9;
  background: #fff;
  position: absolute;
  left: 70px;
  top: 130px;
  right: 0;
  margin: 0 auto;
  padding: 0 0 10px 20px;
}

.smallBox {
  width: 160px;
  height: 80px;
  border: 1px solid #ccc;
  padding: 20px 0 0 20px;
  margin-bottom: 20px;
}

.smallBox img {
  display: block;
  width: 50px;
  height: 50px;
  float: left;
}

.userPhone {
  float: left;
  font: 14px/26px "";
  margin-left: 10px;
}
.userPhone p {
  margin: 0;
}

.addUserInput {
  display: block;
  height: 20px;
  width: 170px;
  /* margin-bottom: 20px; */
  font: 14px/14px "";
  padding: 5px;
  outline: none;
  resize: none;
  border: 1px solid #ccc;
}

.textSpan {
  display: block;
  margin-bottom: 20px;
}
</style>