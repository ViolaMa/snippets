/**
 * Created by Administrator on 2016/12/9.
 */

$(function () {
    // 搜索条件页index.html
    //input的placeholder获取焦点时消失，失去焦点时显示
    var placeholderInfo = "";
    $("input[type='text']").focus(function () {
      placeholderInfo = $(this).attr("placeholder");
      $(this).attr({placeholder: ""});
    })
    $("input[type='text']").blur(function () {
      if ($(this).attr("placeholder") == "") {
        $(this).attr({placeholder: placeholderInfo});
      }
    })

    // 搜索条件打开折叠
    $(".search-more").hide();
    $("#wyBtnMore").click(function (e) {
      e.preventDefault();
      if ($(this).text() == "精简搜索条件") {
        $(".search-more").hide();
        $(this).html("更多搜索条件" + "<i class='arrow-down'></i>");
      } else {
        $(".search-more").show();
        $(this).html("精简搜索条件" + "<i class='arrow-up'></i>");
      }
      // return false;
    });

    // 下拉框
    //每个下拉框对应<input type="text" id="***Input"/><a id="***" data-role="selector"><i></i></a><div id="***Div"></div>
    $(".options-div").hide();
    var ids = null;
    $(".options-div").parent().find("a[data-role='selector']").each(function () {//获取下拉按钮
      $(this).click(function () {
        showDropdown($(this));
        return false;
      });
      $(this).parent().find("input[id$='Input']").click(function () {
        showDropdown($(this));
        return false;
      })
      ids = null;
    });

    function showDropdown(target) {
      $(".options-div").hide();
      arr = target.text();
      ids = target.attr("id");
      if (ids.indexOf("Input") != -1) {
        ids = ids.substring(0, ids.indexOf("Input"));
      }
      $("#" + ids + "Input").focus();
      $("#" + ids + "Div").show().find("ul li a").each(function () {
        if (winHeight - $("#" + ids + "Div").offset().top < $("#" + ids + "Div").height()) {
          var divHeight = $("#" + ids + "Div").height();
          //console.log(divHeight);
          $("#" + ids + "Div").css("top", -(divHeight - 6) + "px"); //6是因为input的外层div高度为45px，input高度为32，input距顶部距离为(45-32)/2≈6；
        }
        $(this).click(function () {
          var txt = $(this).text();
          var inputId = ids.substr(0, ids.indexOf("From"));
          if (txt == "不限") {
            $("#" + ids + "Input").val("").attr("placeholder", "不限");
            $("#" + inputId + "ToInput").val("").attr("placeholder", "不限");
          }
          else {
            $("#" + ids + "Input").val(txt);
            $("#" + inputId + "ToInput").val("及以上");
            if ($("#wyLanguageInput").val() != "") {
              $("#languageProficiencyInput").val("精通").attr("disabled", false);
            }
          }
          $(this).parents(".options-div").hide();
          return false;
        });
      });
    }


    $(document).click(function () {
      $(".options-div").hide();
    })


    // 弹出选择框
    //每个弹出框对应<input type="text" id="***Input"/><a id="***" data-role="selector"><i></i></a><div id="***Div"></div>
    //1.定义一个arr，用于存储条件。下方a标签被点击时，对应的值存入arr中，同时上面的已选择读取arr新增加的值，然后添加到已添加条件的最后一位。
    //2. 初始状态下，每个a在被点击之前的data-status为0或undefined，点击后，状态变为1；当状态为1时，该a标签不可再次被选择。
    // 3.若已经选择了的条件被删除，则对应值的a标签的data-status置为0，arr中对应的值也被删除；
    //4.点击确定时，对应输入框位置显示已选择的条件生成的a标签组，若在此处删除a，则也删除arr中对应值。
    var arr = [], list = [];
    $(".select-div").parent().find("a[data-role='selector']").each(function () {
      arr = [];
      $(this).click(function () {
        ids = $(this).attr("id");
        $("#" + ids).parent().find(".search-con-selected a").each(function () {
          var txt = $(this).text();
          if (arr.indexOf(txt) != -1) {  //若条件被选中，跳出
            return;
          }
          else {
            arr.push(txt); //条件未被选中，则添加到arr中
          }
        });
        list = arr;
        addConditionToSelected($("#" + ids + "Selected"));
        if (ids == "wyResidence" || ids == "expectedLoaction" || ids == "wyAnmelden") {
          wyPopUp($("#" + ids + "Div"), {height: "310px"});
        }
        else if (ids == "wyMajor") {
          wyPopUp($("#" + ids + "Div"), {height: "417px"});
        }
        else {
          wyPopUp($("#" + ids + "Div"), {height: "534px"});
        }
        console.log(ids);
        console.log("list:" + list);
        return false;
      });
    });


    //点击选中条件，并添加到已选择
    var obtain = "";
    $(".wy-condition-list").find("a").click(function (event) {
      obtain = $(this).text();
      var aL = $(this).offset().left, aT = $(this).offset().top;
      var divL = event.pageX - aL, divT = event.pageY - aT;
      if (ids == "expectedLoaction") {
        selectedCondition($(this), obtain, {left: divL, top: divT}, 1);
      }
      else {
        selectedCondition($(this), obtain, {left: divL, top: divT}, 3);
      }
      //arr = [];
      delPopCondition();
      return false;
    });

    $(".condition-sub-list").mouseleave(function () {
      $(this).hide();
    })

    //添加条件到页面位置
    $("#addCondition").click(function () {
      wyAddCondition();
      return false;
    });

    //弹出框
    var winWidth = $(window).width(), winHeight = $(window).height();  //获取窗口宽度和高度

    function wyPopUp(target, option) {
      var left = 0, top = 0;
      if (option.width != undefined) target.css("width", option.width);
      else target.css("width", "790px");
      if (option.height != undefined) target.css("height", option.height);
      else  target.css("height", "555px");
      target.css("display", "block");
      target.appendTo($("#popupContainer"));
      var width = target.width(), height = target.height();
      left = (winWidth - width) / 2;
      top = (winHeight - height) / 2;
      if (top <= 50) {
        top = 50;
      }
      $("#wyPopup").css({"top": top + "px", "left": left + "px"}).show();
      $("#wyPopupWrap").show();
    }

    function selectedCondition(target, val, pos, maxlen) {
      if ($("#" + ids + "Selected a").length >= maxlen) {
        showInfo("最多选择" + maxlen + "项");
        return;
      }
      $("div.condition-sub-list").hide();

      console.log(target);
      //点击获取列表值，添加到已选条件
      if (target.parent().find("div.condition-sub-list").length == 1) {
        target.parent().find("div.condition-sub-list").css({"left": pos.left, "top": pos.top, "display": "block"});
        return;
      }
      else {
        if (target.attr("data-status") == 1) {
          return;
        }
        var _condition = "<a href='' class='common-region'>" + val + "<i class='close-icon-white'></i></a>";
      }
      console.log(ids);
      $("#" + ids + "Selected").append(_condition);
      target.attr("data-status", 1);
    }

    function addConditionToSelected(target) {
      $.each(list, function (i, n) {
        var _condition = "<a href='' class='common-region'>" + n + "<i class='close-icon-white'></i></a>";
        target.append(_condition);
        delPopCondition();
      });
    }

    function wyAddCondition() {
      list = [];

      $("#" + ids + "Selected").find("a").each(function () {
        var txt = $(this).text();
        if (list.indexOf() != -1) {
          return;
        }
        else {
          list.push(txt);
        }
      })

      var condition = "";
      $("#" + ids).parent().find("div.search-con-selected").empty();
      $.each(list, function (i, n) {
        condition = "<a>" + n + "<i class='close-icon'></i></a>";
        $("#" + ids).parent().find("div.search-con-selected").append(condition).removeClass("hide");
      });
      $("#" + ids + "Select").attr("readonly", "readonly");
      $("div.search-con-selected a").each(function (i) {
        $(this).click(function () {
          list.splice(i, 1);
          deleteCondition($(this));
          return false;
        })
      })
      wyClosePopup();
      return false;
    }

    // 删除已选中的条件
    function delPopCondition() {
      $(".common-region").each(function (i) {
        $(this).click(function () {
          deleteCondition($(this));
          return false;
        })
      })
    }

    //显示提示信息
    function showInfo(info) {
      $(".popup-info div").html(info).fadeIn(400).delay(1000).fadeOut(500);
    }

    //删除
    function deleteCondition(target) {
      var delVal = target.text();
      target.remove();
      $(".wy-condition-list a").each(function () {
        if ($(this).text() == delVal) {
          $(this).attr("data-status", 0)
        }
      })
    }

    // 关闭弹窗
    $("#closeBtn").click(function () {
      wyClosePopup();
      return false;
    })

    function wyClosePopup() {
      arr = [];
      deleteCondition($("#" + ids + "Selected a"));
      $("#wyPopupWrap").hide();
      $("#" + ids + "Div").hide();
      //$("#popupContainer").html().detach();
    }

    // 搜索结果页list.html
    $(".Common_list-detail").hide();  //页面加载，隐藏每条简历下的详细工作、教育信息

    $(".Common_list-tr").each(function (i) {  //点击每行简历，展开详细工作、教育信息
      $(this).click(function () {
        $(this).toggleClass("open");
        $("#CommonListDetail_" + i).toggle();
      })
    });

    $(".wy-fold-div").hide();
    $(".fold-btn a").click(function () {
      $(".wy-fold-div").toggle();
      if ($(this).text() == "展开") {
        $(this).html("收起<i class='up-icon'></i>");
      }
      else {
        $(this).html("展开<i class='down-icon'></i>");
      }
      return false;
    });

    //年龄和语言两个下拉菜单
    $("a[data-role='dropdown']").click(function () {
      $(".Common_line-list-down").hide();
      $(this).parent().find(".Common_line-list-down").show();
      return false;
    })

    $("input[data-role='cancel']").click(function () {
      closeListDown($(this).parents(".Common_line-list-down"));
    })

    function closeListDown(target) {
      target.hide();
    }

    //显示简历详情展开时的操作按钮
    $(".Common_list-detail-container").each(function () {
      $(this).hover(function () {
        $(this).find(".Common_list-detail-options").toggle();
      })
    });

    // 排序按钮切换,cookie记录选择的排序方式
    $("#wySort").find("a").each(function () {
      $(this).click(function () {
        $(this).addClass("sort-cur").siblings("a").removeClass("sort-cur");
        return false;
      })
    });
    // 视图切换,cookie记录选择的视图
    $("#wyDetailView").click(function () {
      $(this).removeClass("detail-off").addClass("wy-detail-view");
      $("#wyListView").removeClass("list-on").addClass("wy-list-view");
      $(".Common_list-tr").removeClass("open");
      $(".Common_list-detail").hide();
      return false;
    });
    $("#wyListView").click(function () {
      $(this).removeClass("wy-list-view").addClass("list-on");
      $("#wyDetailView").removeClass("wy-detail-view").addClass("detail-off");
      $(".Common_list-tr").addClass("open");
      $(".Common_list-detail").show();
      return false;
    })
  }
)