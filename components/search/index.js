Page({
  data: {
    focus: false,
    inputValue: '',
    isSearchListShow:false,
  },
  formSubmit:function(){

  },
  formReset:function(){

  },
  showSearchList:function(){
    debugger;
    this.setData({
      isSearchListShow:true
    })
  }
})
