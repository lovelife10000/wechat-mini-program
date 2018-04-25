//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isSearchListShow: false,



    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerData: [
    
        { "url": "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1524463061&di=45e706e84912644de321b8b434fc60b6&src=http://imgsrc.baidu.com/imgad/pic/item/bf096b63f6246b60553a62a0e1f81a4c510fa22a.jpg" },
        { "url": "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1524463061&di=45e706e84912644de321b8b434fc60b6&src=http://imgsrc.baidu.com/imgad/pic/item/bf096b63f6246b60553a62a0e1f81a4c510fa22a.jpg" },
        { "url": "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1524463061&di=45e706e84912644de321b8b434fc60b6&src=http://imgsrc.baidu.com/imgad/pic/item/bf096b63f6246b60553a62a0e1f81a4c510fa22a.jpg" },
        { "url": "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1524463061&di=45e706e84912644de321b8b434fc60b6&src=http://imgsrc.baidu.com/imgad/pic/item/bf096b63f6246b60553a62a0e1f81a4c510fa22a.jpg" }
      
    ],
    searchKeyword: '',  //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // wx.showLoading({
    //   title:"加载中..."
    // });
    this.setData({
      loading: true
    })
    if (app.globalData.bannerData.length == 0) {
      this.getBannerData();

    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getBannerData: function () {
    const that = this;
    wx.request({
      url: 'http://localhost:8081/banner/get',
      success: function (res) {
        console.log(res.data)
        that.setData({
          bannerData: res.data.data.movies

        });
        console.log(app.globalData);
      }
    })
  },

  //下拉刷新组件
  upper: function () {
    console.log("下拉了....")
    //获取用户Y轴下拉的位移  

    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    updateRefreshIcon.call(this);
    var _this = this;
    var i = Math.random() //获得0-1的随机数  
    i = Math.ceil(i * 10) //乘以10并向上去整  
    var words = ['龙', '一', '万', '千', '浩', '金', '得', '而', '可', '人'];
    var word = words[i];
    wx.request({
      url: 'http://api.avatardata.cn/ChengYu/Search?key=77f072d28eb141c8b6dda145ca364b92&keyWord=' + word,

      complete: function (res) {
        if (res.data.reason == 'Succes') {
          setTimeout(function () {
            _this.setData({
              words: res.data.result
            })
          }, 2000)
        }
        setTimeout(function () {
          _this.setData({
            refreshing: false
          })
        }, 2500)
      }
    })
  },
  lower: function () {
    var start = 0;
    start += 1;
    console.log("加载了...")
    var _this = this;
    wx.request({
      url: 'http://api.avatardata.cn/ChengYu/Search',
      data: {
        key: '77f072d28eb141c8b6dda145ca364b92', keyWord: '好', page: start
      },
      complete: function (res) {
        if (res.data.reason == 'Succes') {
          var words = _this.data.words.concat(res.data.result);
          _this.setData({
            words: words
          })
        }
      }
    })
  },
  onPullDownRefresh: function () {
    console.log('xiala');
    wx.stopPullDownRefresh()
  },


  // 上拉加载

  //输入框事件，每输入一个字符，就会触发一次  
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //搜索，访问网络  
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    util.getSearchMusic(searchKeyword, searchPageNum, callbackcount, function (data) {
      console.log(data)
      //判断是否有数据，有则取数据  
      if (data.data.song.curnum != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.data.song.list : searchList = that.data.searchSongList.concat(data.data.song.list)
        that.setData({
          searchSongList: searchList, //获取数据数组  
          zhida: data.data.zhida, //存放歌手属性的对象  
          searchLoading: true   //把"上拉加载"的变量设为false，显示  
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      searchSongList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    console.log('上拉加载');
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },


  //search
  showSearchList: function () {

    this.setData({
      isSearchListShow: true
    })
  },
  hideSearchList: function () {

    this.setData({
      isSearchListShow: false
    })
  }
})
