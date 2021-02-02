var $parent = self.parent.$;

var flag = [
    {flagType: '0', name: '否'},
    {flagType: '1', name: '是'}
];
var datagrid;
var editRow = undefined;//行编辑标志
$(function () {


    datagrid = $('#datagrid').datagrid({
        title: '',
        iconCls: 'icon-save',
        pagination: true,//进度条
        pageSize: 20,//每页显示10条
        pageList: [10, 20, 30, 40, 50],//选择每页显示条数
        fit: true,
        fitColumns: false,//设置false页面变窄时显示横向滚动条
        nowarp: true,//表格内容自动折行
        border: false,
        idField: 'schedulePriceId',//翻页选择标记（便于多页删除）
        //sortName : 'id',//设置排序字段id
        //sortOrder : 'desc',//设置排序方式，默认升序
        remoteSort: false,//定义是否从服务器给数据排序。
        striped: true,//为true是交替显示行背景
        // rowStyler:function(index,row){//发布并推荐设置为黄色
        // 	if(row.currencyId=='278'){//币种为美元
        // 		if(row.effective==true){//过期设置为深灰色
        //         	return 'background-color:#9E9E9E;';
        //         }else if(row.isRelease=="是"&&row.recommend==true){//推荐设置为蓝色
        //         	return 'background-color:#99CCFF;';
        //         }
        // 	}else{//币种非美元，将字体设置为红色
        // 		if(row.isRelease=="是"){
        // 			if(row.effective==true){//过期设置为深灰色
        // 	        	return 'background-color:#9E9E9E;color:red';
        // 	        }else if(row.recommend==true){//推荐设置为蓝色
        // 	        	return 'background-color:#99CCFF;color:red';
        // 	        }else
        // 	            return 'color:red';
        // 		}else{
        // 			return 'color:red';
        // 		}
        // 	}
        // },
        // url : getContextPath()+"/maersk/json/spot-price-list.json",
        // url : getContextPath()+"/maersk/response-list.json",
        // url : getContextPath()+"/quotation/listOnlyReleased.do",
        columns: [[{
            title: '选择框', field: 'box', width: 60, checkbox: true,
        }, {
            field: "schedulePriceId", title: '价格表ID', hidden: true,
        }, {
            field: "priceId", title: '价格表ID', width: 120, sortable: true,
        }, {
            field: "departureDatetimeString", title: '出发时间', width: 120, sortable: true,
        }, {
            field: "arriveDatetimeString", title: '到达时间', width: 120, sortable: true,
        }, {
            field: "cyDeadLineTime", title: '集装箱堆场截止时间', width: 120, sortable: true,
            formatter: function (val, row, index) {
                let textString = '';
                if (row.routeSchedule.details && row.routeSchedule.details.length >0 && row.routeSchedule.details[0].deadlineList && row.routeSchedule.details[0].deadlineList.length >0){

                        $.each(row.routeSchedule.details[0].deadlineList,function(index,value){

                            if(value.deadlineKey == 'CY')
                                textString =  value.deadlineTimeString;
                        })
                    }
                return textString==''?'NA':textString;
            }
        }, {
            field: "vgmDeadLineTime", title: '验收服务截收时间', width: 120, sortable: true,
            formatter: function (val, row, index) {
                let textString = '';
                if (row.routeSchedule.details && row.routeSchedule.details.length >0 && row.routeSchedule.details[0].deadlineList && row.routeSchedule.details[0].deadlineList.length >0){

                    $.each(row.routeSchedule.details[0].deadlineList,function(index,value){

                        if (value.deadlineKey == 'VGM')
                            textString =  value.deadlineTimeString;
                    })
                }
                return textString==''?'NA':textString;

            }
        }, {
            field: "transitTime", title: '航程（天）', width: 60, sortable: true,
            formatter: function (val, row, index) {
                if (row.routeSchedule) {
                    return row.routeSchedule.transitTime;
                }
            }
        }, {
            field: "sailingDate", title: '价格(USD)', width: 100, sortable: true,
            formatter: function (val, row, index) {
                if (row.priceInfo) {
                    return row.priceInfo.totalBasPrice;
                }
            }
        }, {
            field: "fromLocation.cityName", title: '起运港', width: 120, sortable: true,
            formatter: function (val, row, index) {
                if (row.routeSchedule.fromLocation) {
                    let startPort = row.routeSchedule.fromLocation.cityName;
                    if (row.routeSchedule.fromLocation.regionName) {
                        startPort = startPort + "(" + row.routeSchedule.fromLocation.regionName + ")"
                    }
                    startPort = startPort + ", " + row.routeSchedule.fromLocation.countryName;
                    // return row.routeSchedule.fromLocation.cityName;
                    return startPort;
                }
            }
         },{
            field:"toLocation.siteName",title:'装载码头',width:150,sortable:true,
            formatter: function (val, row, index) {
                if (row.routeSchedule.fromLocation) {
                    return  row.routeSchedule.fromLocation.siteName;
                }
            }

        }, {
            field: "toLocation.cityName", title: '目的港', width: 150, sortable: true,
            formatter: function (val, row, index) {
                if (row.routeSchedule.toLocation) {
                    //  return row.routeSchedule.toLocation.cityName;
                    let endPort = row.routeSchedule.toLocation.cityName;
                    if (row.routeSchedule.toLocation.regionName) {
                        endPort = endPort + "(" + row.routeSchedule.toLocation.regionName + ")"
                    }
                    endPort = endPort + ", " + row.routeSchedule.toLocation.countryName;
                    // return row.routeSchedule.fromLocation.cityName;
                    return endPort;
                }
            }
            // },{
            // 	field:"shippingCompany",title:'船公司',width:130,sortable:true,
            // },{
            // 	field:"sailingDate",title:'船期',width:40,sortable:true,
            },{
            	field:"transshipmentPort",title:'中转港',width:150,sortable:true,
                formatter: function (val, row, index) {

                if (row.routeSchedule.details && row.routeSchedule.details.length > 1 ) {
                    //  return row.routeSchedule.toLocation.cityName;
                    let transshipmentPort  = '';
                    for (var i = 1; i < row.routeSchedule.details.length; i++) {
                        transshipmentPort = transshipmentPort + row.routeSchedule.details[i].fromLocation.cityName + ","
                    }
                    return transshipmentPort;
                }
            }
        }, {
            field: "firstVesselName", title: '船名', width: 200, sortable: true,
            formatter: function (val, row, index) {
                if (row.routeSchedule) {
                    return row.routeSchedule.firstVesselName;
                }
            }
        }, {
            field: "voyageNumber", title: '航次', width: 60, sortable: true,
            formatter: function (val, row, index) {
                if (row.routeSchedule) {
                    return row.routeSchedule.voyageNumber;
                }
            }

        }, {
            field: "containerSizeType", title: '箱型', width: 60, sortable: true,
            formatter: function (val, row, index) {
                if (row.priceInfo.containerSizeType) {
                    return row.priceInfo.containerSizeType;
                }
            }
            // },{
            //     field:"sailingDate",title:'单位',width:60,sortable:true,
            //     formatter:function(val, row, index){
            //         if(row.priceInfo){
            //             return row.priceInfo.totalPrice;
            //         }
            //     }
        }, {
            field: "createTimeString", title: '查询时间', width: 200,
        }]],//合并单元格
        toolbar: [{
// 			id:"RESOURCE_2010200",
// 			text : '微信推送',
// 			iconCls : 'icon-wechat',
// 			handler : function() {
//
// 				var rows = $('#datagrid').datagrid('getSelections');//获得选中项
// 				if(rows.length==1){
// 				$.messager.confirm('请确认','您确定要推送这条报价信息吗？',function(b){
// 				if(b){//选择“确定”
// //					var jsonArray=[];
// 					var myDate  = new Date();
// 					nowDay=myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
//
// 					for(var i=0;i<rows.length;i++){
// 						var json3={};
// 						var currency;
// 						if(rows[i].currency=='美元')
// 							currency='USD';
// 						else if(rows[i].currency=='澳元')
// 							currency='AUD';
// 						else if(rows[i].currency=='法郎')
// 							currency='BEF';
// 						else if(rows[i].currency=='欧元')
// 							currency='ECU';
// 						else if(rows[i].currency=='英镑')
// 							currency='GRP';
// 						else if(rows[i].currency=='卢布')
// 							currency='RUR';
// 						else
// 							currency=rows[i].currency;
// 						createJson(json3,"quotationId", rows[i].quotationId);
// 						createJson(json3,"port", rows[i].dischargingPort.substring(0,rows[i].dischargingPort.indexOf('||')));
// 						createJson(json3,"shippingCompany", rows[i].shippingCompany.substring(0,rows[i].shippingCompany.indexOf('||')));
// 						createJson(json3,"price","20/40/40H - "+currency+ " "+rows[i].price20+"/"+rows[i].price40+"/"+rows[i].price40h);
// 						createJson(json3,"time",rows[i].closingTimeEnd);
// 						days=DateDiff(rows[i].closingTimeEnd,nowDay);//计算还有几天过期
// 						createJson(json3,"days",days);
// 						queryParams=JSON.stringify(json3);
// //						alert(queryParams);
// //						jsonArray.push(queryParams);
// 					}
//
//
// 					showCustomerDialog(queryParams,'sendPriceInspection.do');
// 			}
// 			else{//选择“取消”
// 				$('#custom').datagrid('unselectAll');
// 			}
// 			});
// 			}else if(rows.length>1){
// 				$.messager.alert('提示','一次只能推送一条报价信息，请重新选择！','error');
// 			}else{
// 				$.messager.alert('提示','请选择要推送的报价信息！','error');
// 			}
// 		}
// 		},'-', {
// 			id:"RESOURCE_2010300",
// 			text : '航线微信推送',
// 			iconCls : 'icon-wechat',
// 			handler : function() {
//
// 				var rows = $('#datagrid').datagrid('getSelections');//获得选中项
// 				if(rows.length==1){
//
// 					showDIV_routeTemplateMSG(rows);
//
// 				}else if(rows.length>1){
// 					$.messager.alert('提示','一次只能推送一条报价信息，请重新选择！','error');
// 				}else{
// 					$.messager.alert('提示','请选择要推送的报价信息！','error');
//
// 				}
//
//
//
// 		}
// 		},'-',{
            id: 'RESOURCE_20010100',
            text: '查看详情',
            iconCls: 'icon-monitor',
            handler: function () {

                var rows = datagrid.datagrid('getSelections');
                if (rows.length == 1) {
                    if (editRow != undefined) {
                        datagrid.datagrid('endEdit', editRow);
                    }
                    if (editRow == undefined) {
                        var row = $('#datagrid').datagrid('getSelected');
                        if (row) {
                            $('#maerskSpotPrice').show().dialog({
                                title: '马士基现货价格信息',
                                width: 850,
                                height: 600,
                                closed: false,
                                resizable: true,
                                collapsible: true,
                                maximizable: true,
                                cache: false,
                                modal: true,
                                buttons: false
                            });


                            rowData = queryMaerskSpotPrice(row.schedulePriceId);

                            //显示马士基现货运价
                            setMaerskSpotPrice(rowData);

                            // dialogDisable();
                            doLog("checkQuotationDetail", row.quotationId);//将查看行为通知后台进行记录

                        }
                    }
                } else if (rows.length > 1) {
                    $.messager.alert('提示', '一次只能查看一条记录，请重新选择！', 'error');
                    datagrid.datagrid('unselectAll');
                } else {
                    $.messager.alert('提示', '请选择要查看的记录！', 'error');
                }

            }
        }, '-', {
            text: '取消',
            iconCls: 'icon-undo',
            handler: function () {
                editRow = undefined;
                datagrid.datagrid('rejectChanges');
                datagrid.datagrid('unselectAll');
            }
        },/*'-' , {
			text : '导出Excel',
			iconCls : 'icon-export',
			handler : function() {
				tableexport();
			}
		},*/ '-',],
        // 当用户双击一行时触发
        onDblClickRow: function (rowIndex, rowData) {// 双击编辑行
//			var selectedRow = $('#datagrid').datagrid('getSelected');
//			alert(selectedRow.shippingCompany);

            rowData = queryMaerskSpotPrice(rowData.schedulePriceId);

            if (editRow != undefined) {
                $('#datagrid').datagrid('endEdit', editRow);
            }
            if (editRow == undefined) {

                $('#maerskSpotPrice').show().dialog({
                    title: '马士基现货价格信息',
                    width: 850,
                    height: 600,
                    closed: false,
                    resizable: true,
                    collapsible: true,
                    maximizable: true,
                    cache: false,
                    modal: true,
                    buttons: false
                });

                //显示马士基现货运价
                setMaerskSpotPrice(rowData);

                // dialogDisable();

            }
        },
        enableHeaderClickMenu: false,
        enableHeaderContextMenu: false,
        enableRowContextMenu: false,
        // rowTooltip: function (index, row) {
        //     var table = "<table border='1'  cellspacing='0' cellpadding='0' style='border-collapse:"
        //         + "collapse;word-break: break-all;width:440px' bgcolor='ffffff' >"
        //         + "<tbody>"
        //         + "<tr height='20px'>"
        //         + "	<td width='50px' bgcolor='#D7D7D7'>规格</td>"
        //         + "	<td width='130px'>20'</td>"
        //         + "	<td width='130px'>40'</td>"
        //         + "	<td width='130px'>40'H</td>"
        //         + "	</tr>"
        //         + "	<tr height='30px'>"
        //         + "		<td bgcolor='#D7D7D7'>价格政策</td>"
        //         + "		<td><label class='price20Remark'>" + $(this).find('td:eq(41)').text() + "</label></td>"
        //         + "		<td><label class='price40Remark'>" + $(this).find('td:eq(42)').text() + "</label></td>"
        //         + "		<td><label class='price40hRemark'>" + $(this).find('td:eq(43)').text() + "</label></td>"
        //         + "	</tr>"
        //         + "	<tr height='30px'>"
        //         + "		<td bgcolor='#D7D7D7'>价格备注</td>"
        //         + "		<td><label class='price20Remark'>" + $(this).find('td:eq(14)').text() + "</label></td>"
        //         + "		<td><label class='price40Remark'>" + $(this).find('td:eq(16)').text() + "</label></td>"
        //         + "		<td><label class='price40hRemark'>" + $(this).find('td:eq(18)').text() + "</label></td>"
        //         + "	</tr>"
        //         + "	<tr height='30px'>"
        //         + "		<td bgcolor='#D7D7D7'>超重要求</td>"
        //         + "		<td colspan='6' class='overWeightClaim'><label class='overWeightClaim'>" + $(this).find('td:eq(25)').text() + "</label></td>"
        //         + "	</tr>"
        //         + "	</tbody>"
        //         + "	</table>";
        //     return table;
        // }
    });

    $('#departureDate').datebox('setValue',$.date.format($.date.addDays(new Date(),2), 'yyyy-MM-dd') );

});

function showDIV_routeTemplateMSG(rows) {
    //增加和修改的公共弹出框
    $('#DIV_routeTemplateMSG').dialog({
        title: '微信航线推送->推送消息',
        width: 650,
        height: 300,
        closed: false,
        cache: false,
        modal: true
    }).dialog('close');


    $('#DIV_routeTemplateMSG').dialog('open');
    $('#routeTemplateMSGForm').form('clear');

    //todo 根据选择定行设置 routeTemplateMSGForm 表单的值
    $('#quotationTitle').val("报价已经被一洲货运确定，敬请联系承运！");
    $('#quotationContent').val(rows[0].loadingPort + "-->" + rows[0].dischargingPort + "(" + rows[0].shippingCompany + ")" + "最新报价");

    $('#quotationPrice').val("");

    $('#quotationCompany').val("一洲货运");

    $('#quotationDate').val($.date.format(new Date(), 'yyyy-MM-dd'));


    document.getElementById("button").innerHTML =
        "<input type=\"button\" value=\"确定推送航线消息\" onclick=\"sendRouteTemplateMSG(" + rows[0].quotationId + ")\">";
    datagrid.datagrid('unselectAll');


}


//封装待发送的消息 参考目前实现的微信推送
function sendRouteTemplateMSG(quotationId) {

    //获取routeTemplateMSGForm 表单的值 并封装成message
    var routeTemplateMSG_JSON = {};

    createJson(routeTemplateMSG_JSON, "quotationId", quotationId);
    createJson(routeTemplateMSG_JSON, "quotationTitle", $('#quotationTitle').val());
    createJson(routeTemplateMSG_JSON, "quotationContent", $('#quotationContent').val());


    createJson(routeTemplateMSG_JSON, "quotationPrice", $('#quotationPrice').val());
    createJson(routeTemplateMSG_JSON, "quotationCompany", $('#quotationCompany').val());
    createJson(routeTemplateMSG_JSON, "quotationDate", $('#quotationDate').val());
    routeTemplateMSG = JSON.stringify(routeTemplateMSG_JSON);

    showCustomerDialog(routeTemplateMSG, "sendRouteTemplateMSG.do");


}

function showCustomerDialog(message, url) {
    $('#customForm').dialog({
        title: '客户信息（颜色说明：绿色标注的客户已经绑定微信号）',
        width: 750,
        height: 435,
        closed: false,
        resizable: true,
        collapsible: true,
        maximizable: true,
        cache: false,
        modal: true,
        buttons: [{
            text: '确定推送微信消息',
            iconCls: 'icon-save',
            handler: function () {
                wechatClick(message, url);
            }
        }],

    });


    $('#custom').datagrid({
        title: '',
        iconCls: 'icon-save',
        pagination: true,//进度条
        pageSize: 10,//每页显示10条
        pageList: [10, 20, 30, 40, 50],//选择每页显示条数
        fit: true,
        fitColumns: false,//设置false页面变窄时显示横向滚动条
        nowarp: false,//表格内容自动折行
        border: false,
        idField: 'customerId',//翻页选择标记（便于多页删除）
        remoteSort: false,//定义是否从服务器给数据排序。
        striped: true,//为true是交替显示行背景
        url: getContextPath() + '/customer/list.do',
        rowStyler: function (index, row) {
            if ((row.winxinOpenid).length > 0) {//已绑定微信设置为绿色
                return 'background-color:#a2c592;';
            }
        },
        columns: [[{
            title: '选择框',
            field: 'box',
            width: 90,
            checkbox: true,
        }, {
            field: "customerId", title: '客户编号', width: 100, sortable: true, hidden: true,
        }, {
            field: "customerCompany", title: '公司名称', width: 200, sortable: true,
        }, {
            field: "customerName", title: '联系人姓名', width: 80, sortable: true,
        }, {
            field: "customerCellPhone", title: '手机', width: 85, sortable: true,
        }, {
            field: "customerOfficePhone", title: '电话', width: 95, sortable: true,
        }, {
            field: "email", title: '邮箱', width: 120, sortable: true,
        }, {
            field: "customerQq", title: 'QQ', width: 90, sortable: true,
        }, {
            field: "cuonterManName", title: '负责人', width: 80, sortable: true
        }, {
            field: "type", title: '客户类型', width: 60, sortable: true
        }, {
            field: "hy2008CustomerId", title: '2008系统客户编号', width: 125, sortable: true,
        }, {
            field: "winxinOpenid", title: '微信openID', width: 125, sortable: true,
        }]],
    });

    $('#custom').datagrid('unselectAll');

}


/*日期运算*/
function DateDiff(d1, d2) {
    var day = 24 * 60 * 60 * 1000;
    try {
        var dateArr = d1.split("-");
        var checkDate = new Date();
        checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
        var checkTime = checkDate.getTime();

        var dateArr2 = d2.split("-");
        var checkDate2 = new Date();
        checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
        var checkTime2 = checkDate2.getTime();

        var cha = (checkTime - checkTime2) / day;
        return cha;
    } catch (e) {
        return false;
    }
}


/**
 * 发送微信信息
 */
function wechatClick(jsonArray, url) {
    var rows = $('#custom').datagrid('getSelections');
    if (rows.length == 0) {
        $.messager.alert('提示', '请选择要推送微信消息的客户记录！', 'error');
    } else if (rows.length > 50) {
        $.messager.alert('提示', '一次最多只能向50位客户推送微信消息，请重新选择！', 'error');
    } else {
        var openids = [];
        for (var i = 0; i < rows.length; i++) {
            if ((rows[i].winxinOpenid).length > 0)
                openids.push(rows[i].winxinOpenid);
            else {
                $.messager.alert('提示', '您选择的客户中存在未绑定微信号的客户，绿色标注的客户已经绑定微信号，请重新选择！', 'error');
                return false;
            }
        }


        $.ajax({
            url: 'http://www.e-conitl.com/pcbas-weixin/weixinTemplateMessage/' + url,
            //url : 'http://127.0.0.1:8080/pcbas-weixin/weixinTemplateMessage/'+url,
            dataType: 'jsonp',
            crossDomain: true,
            data: {openid: openids.join(','), content: jsonArray},
            type: "POST",
            async: false,
            success: function (rsp) {
                if (rsp == "success") {
                    $('#custom').datagrid('unselectAll');
                    $.messager.show({title: '提示', msg: '微信推送成功！'});
                    $('#customForm').dialog('close');
                    for (var i = 0; i < rows.length; i++) {
                        doLog(url.split(".")[0], jsonArray + "," + rows[i].winxinOpenid);
                    }
                } else {
                    $.messager.confirm("提示", "推送失败，请重新尝试！");
                    $('#customForm').dialog('close');
                }
            }
        });
    }
}

/**
 * 查询，将查询参数不为空的放入JSON传入后台,该写法支持模糊查询
 */
function serchCustom() {
    $('#custom').datagrid('load', sy.serializeObject($('#searchForm3')));
}

/**
 * 点击清空按钮触发事件，注意将查询JSON置为空
 */
function clearCustom() {
    $('#searchForm3').form('clear');
    $('#custom').datagrid({url: getContextPath() + '/customer/list.do',});
    $('#custom').datagrid('load', {});
}

/**
 * 设置海运报价编辑对话框中的元素为只读状态
 */
function dialogDisable() {
    $parent("#start").datebox({readonly: true, required: false});
    $parent("#end").datebox({readonly: true, required: false});

    $parent('#loadingPortId2').combobox({readonly: true, required: false});
    $parent('#route2').combobox({readonly: true, required: false});
    $parent('#dischargingPortId').combobox({readonly: true, required: false});
    $parent('#shippingCompanyId2').combobox({readonly: true, required: false});
    $parent('#transshipmentPortId').combobox({readonly: true});
    $parent('#loadingWharfId').combobox({readonly: true});
    $parent('#currencyId').combobox({readonly: true, required: false});

    $parent("textarea").attr("readonly", "true");
    $parent("input").attr("readonly", "true");
    $parent("select").attr("readonly", "true");
}


/**
 * 动态往JSON中添加修改数据
 */
var json = {};//海运报价查询参数
// 参数：prop = 属性，val = 值
function createJson(json, prop, val) {
    // 如果 val 被忽略
    if (typeof val === "undefined") {
        // 删除属性
        delete json[prop];
    } else {
        // 添加 或 修改
        json[prop] = val;
    }
}


/**
 * 查询，将查询参数不为空的放入JSON传入后台
 */
function searchQuotation() {
    json = {};//将查询参数JSON置为空
//	var queryParams = $('#datagrid').datagrid('options').queryParams;

    if($("#brandScac").combobox('getValue') ==''
        || $("#queryHistory").combobox('getValue') == ""
        || $("#originCityName").combobox('getText') == ''
        || $("#destinationCityName").combobox('getText') == '') {

        $.messager.alert('提示', '查询条件不能为空！', 'error');
        return;

    }

    if ($("#brandScac").combobox('getValue').length > 0) {
        createJson(json, "brandScac", $("#brandScac").combobox('getValue'));
    }

    if ($("#queryHistory").combobox('getValue').length > 0)
        createJson(json, "queryHistory", $("#queryHistory").combobox('getValue'));

    if ($("#originCityName").combobox('getText') != '') {

        // if ($("#originCityName").combobox('getValue') != undefined)
            createJson(json, "originCityName", $("#originCityName").combobox('getValue'));
        // else {
        //     alert("起运港输入有误！");
        //     return;
        // }
    }

    if ($("#destinationCityName").combobox('getText') != '') {

        // if ($("#destinationCityName").combobox('getValue') != undefined)
            createJson(json, "destinationCityName", $("#destinationCityName").combobox('getValue'));
        // else {
        //     alert("目的港输入有误！");
        //     return;
        // }
    }

    if ($('#departureDate').datetimebox('getText') != '') {
        createJson(json, "departureDate", $('#departureDate').datetimebox('getValue'));
    }

    if ($("#queryHistory").combobox('getValue').length > 0) {
        createJson(json, "queryHistory", $("#queryHistory").combobox('getValue'));
    }

    containerSizeTypeArray = [];
    $.each($('input[name=containerSizeType]:checked'),function(i,object){

        // alert(ob.value)
        containerSizeTypeArray[i] = object.value;
    });

    createJson(json, "containerSizeType",containerSizeTypeArray);

    //
    // if ($("#containerSizeType").combobox('getValue').length > 0) {
    //     createJson(json, "containerSizeType", $("#containerSizeType").combobox('getValue'));
    // }



    // queryParams = JSON.stringify(json);
//	alert(queryParams);
    $('#datagrid').datagrid({data: listMaerskSpotPrice(json)});
    //url:getContextPath()+'/offer/query.do?queryCondition='+queryParams});


}

/**
 * 点击清空按钮触发事件，注意将查询JSON置为空
 */
function clearQuotation() {
    $('#searchForm').form('clear');
    $("#queryHistory").combobox('setValue', false);
    $("#queryHistory").combobox('setText', '否');
    // json = {};//将查询参数JSON置为空
    // $('#datagrid').datagrid({url:getContextPath()+"/quotation/listOnlyReleased.do",});
    // $('#datagrid').datagrid('load', {});

    //重置目的港信息
    $("#brandScac").combobox('setValue', 'maeu');
    $("#brandScac").combobox('setText', 'maeu || MaerskLine');
    $('#destinationCityName').combobox('reload', getContextPath() + '/location/list.do')

    $('#departureDate').datebox('setValue',$.date.format($.date.addDays(new Date(),2), 'yyyy-MM-dd') );


}

/*//导出excel
function tableexport() {
	var form=$("#searchForm");
	form.attr("action","/salesys-pc-web/quotation/exportExcel.do");
	form.submit();
}*/

//记录查看详情，微信推送日志
var doLog = function (operation, message) {
    $.ajax({
        type: "get",
        contentType: "application/json",
        url: getContextPath() + "/log/doLog.do",
        async: true,
        data: {
            operation: operation,
            message: message
        },
        dataType: 'json',
        success: function (data) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
    return 1;
};


/**
 * 查询报价接口
 * @param queryCondition
 * @returns {*}
 */
function listMaerskSpotPrice(queryCondition) {
    var listSpotPrice;
    $.ajax({
        type: "post",
        contentType: "application/json",

        url: getContextPath() + "/offer/query.do",
        // url : getContextPath()+"/maersk/response-detail.json",
        async: false,
        data: JSON.stringify(queryCondition),
        dataType: 'json',
        success: function (data) {

            listSpotPrice = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
    return listSpotPrice;
};

//记录查看详情，微信推送日志
function queryMaerskSpotPrice(schedulePriceId) {
    var spotPrice;
    $.ajax({
        type: "get",
        contentType: "application/json",

        url: getContextPath() + "/offer/detail.do",
        // url : getContextPath()+"/maersk/response-detail.json",
        async: false,
        data: {
            schedulePriceId: schedulePriceId
        },
        dataType: 'json',
        success: function (data) {

            console.log(data);
            spotPrice = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
    return spotPrice;
};

function setMaerskSpotPrice(scheduleWithPrice) {

    // var scheduleWithPrice = rowData.spotOffers[0].scheduleWithPrices[0];

    fromLocation = scheduleWithPrice.routeSchedule.fromLocation
    $("#fromLocation").text(fromLocation.cityName + "(" + fromLocation.regionName + ")," + fromLocation.countryName);
    $("#departDatetime").text(scheduleWithPrice.departureDatetimeString);
    $("#transitTime").text(scheduleWithPrice.routeSchedule.transitTime + "天");
    $("#siteName").text(fromLocation.siteName);

    toLocation = scheduleWithPrice.routeSchedule.toLocation;
    $("#toLocation").text(toLocation.cityName + "(" + toLocation.regionName + ")," + toLocation.countryName);
    $("#arriveDatetime").text(scheduleWithPrice.arriveDatetimeString);
    $("#firstVesselNameAndvoyageNumber").text(scheduleWithPrice.routeSchedule.firstVesselName + " ( " + scheduleWithPrice.routeSchedule.voyageNumber + " )");
    $("#totalPrice").text("USD " + scheduleWithPrice.priceInfo.totalPrice);


    if (scheduleWithPrice.routeSchedule.details && scheduleWithPrice.routeSchedule.details.length >0
        && scheduleWithPrice.routeSchedule.details[0].deadlineList) {
            let cyDeadLineTime ='';
            let vgmDeadLineTime = '';
            $.each(scheduleWithPrice.routeSchedule.details[0].deadlineList, function (index, value) {
                if (value.deadlineKey == 'CY')
                    cyDeadLineTime= value.deadlineTimeString;

                if(value.deadlineKey == 'VGM')
                    vgmDeadLineTime = value.deadlineTimeString;
            })
        $("#cyDeadLineTime").text(cyDeadLineTime ==''?'NA':cyDeadLineTime);
        $("#vgmDeadLineTime").text(vgmDeadLineTime ==''?'NA':vgmDeadLineTime);

    }


    if (scheduleWithPrice.routeSchedule.details && scheduleWithPrice.routeSchedule.details.length > 1 ) {
        //  return row.routeSchedule.toLocation.cityName;
        let transshipmentPort  = '';
        for (var i = 1; i < scheduleWithPrice.routeSchedule.details.length; i++) {
            transshipmentPort = transshipmentPort + scheduleWithPrice.routeSchedule.details[i].fromLocation.cityName + ","
        }
        $("#transshipmentPort").text(transshipmentPort);
    }

    //设置基础运费
    basPrice = scheduleWithPrice.priceInfo.bas;
    var basPriceInfoText = "";
    containerSizeType = basPrice.containerSizeType == null ? "" : (" ( " + basPrice.containerSizeType + " )");

    basPriceInfoText += ' <label style="float:left" >' +
        basPrice.chargeDescription + containerSizeType +
        '                                        </label>' +
        '                                        <label style="float:right">' +
        basPrice.currency + " " + basPrice.rateUSD +
        '                                        </label></br></br>';
    $("#basPrice").html(basPriceInfoText);

    //设置附加运费
    freightPriceList = scheduleWithPrice.priceInfo.freightPriceList;
    var priceInfoText = "";
    for (i = 0; i < freightPriceList.length; i++) {
        containerSizeType = freightPriceList[i].containerSizeType == null ? "" : (" ( " + freightPriceList[i].containerSizeType + " )");

        priceInfoText += ' <label style="float:left" >' +
            freightPriceList[i].chargeDescription + containerSizeType +
            '                                        </label>' +
            '                                        <label style="float:right">' +
            freightPriceList[i].currency + " " + freightPriceList[i].rateUSD +
            '                                        </label></br></br>';

    }

    $("#freightPriceList").html(priceInfoText);

    //设置起始港运费
    originPriceList = scheduleWithPrice.priceInfo.originPriceList;
    var priceInfoText = "";
    for (i = 0; i < originPriceList.length; i++) {
        containerSizeType = originPriceList[i].containerSizeType == null ? "" : (" ( " + originPriceList[i].containerSizeType + " )");

        priceInfoText += ' <label style="float:left">' +
            originPriceList[i].chargeDescription + containerSizeType +
            '                                        </label>' +
            '                                        <label style="float:right">' +
            originPriceList[i].currency + " " + originPriceList[i].rate +
            '                                        </label></br>' +
            '                                        <label style="float:right">' +
            'USD ' + originPriceList[i].rateUSD + '</br>' +
            '                                        </label></br></br>';

    }

    $("#originPriceList").html(priceInfoText);

    //设置目的港运费
    destinationPriceList = scheduleWithPrice.priceInfo.destinationPriceList;
    var priceInfoText = "";
    for (i = 0; i < destinationPriceList.length; i++) {
        containerSizeType = destinationPriceList[i].containerSizeType == null ? "" : (" ( " + destinationPriceList[i].containerSizeType + " )");


        priceInfoText += ' <label style="float:left">' +
            destinationPriceList[i].chargeDescription + containerSizeType +
            '                                        </label>' +
            '                                        <label style="float:right"">' +
            destinationPriceList[i].currency + " " + destinationPriceList[i].rate +
            '                                        </label></br>' +
            '                                        <label style="float:right">' +
            'USD ' + destinationPriceList[i].rateUSD + '</br>' +
            '                                        </label></br></br>';

    }

    $("#destinationPriceList").html(priceInfoText);
}
