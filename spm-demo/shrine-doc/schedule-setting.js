

var IS_INIT_TREE = true;// 用于判断是否为初次加载tree

//用于计算创建组织架构tree的数量，初始化前做++，初始化完成做--,
var CREATED_ORGSTR_NUM = 0;
/**
 * 定时查询设置
 */

//window.onload = function(){
//	$('#loading-mask').fadeOut();
//}




function isSelectedOneRow(rows){
	
	
	
	if (rows.length == 1) {
		if (editRow != undefined) {
			datagrid.datagrid('endEdit', editRow);
		}
		
		return true;
		
	}
	else if(rows.length>1){                                
		$.messager.alert('提示','一次只能为一个用户进行操作，请重新选择','error');
		datagrid.datagrid('unselectAll');       
		return false;
	}else{                                                
		$.messager.alert('提示','请选择要修改的记录','error');       
		return false;
	}
}

	var datagrid;
	var editRow = undefined;// 行编辑标志
	var useSelect=[
		  	         {useType:'启用',name:'启用'},
		  	         {useType:'未启用',name:'未启用'}
		  	         ];
	$(function() {
		
		
		datagrid = $('#datagrid').datagrid({
			title : '',
			iconCls : 'icon-save',
			pagination : true,// 进度条
			pageSize : 10,// 每页显示10条
			pageList : [ 10, 20, 30, 40, 50 ],// 选择每页显示条数
			fit : true,
			fitColumns : false,// 设置false页面变窄时显示横向滚动条
			nowarp : false,// 表格内容自动折行
			border : false,
			idField : 'taskId',// 翻页选择标记（便于多页删除）
			remoteSort: false,// 定义是否从服务器给数据排序。
			striped:true,// 为true是交替显示行背景
			url : getContextPath()+'/offer/config/list.do',
			columns : [ [{
				title : '选择框',
				field : 'box',
				width : 90,
				// sortable:true,
				checkbox:true,
				
			}, {
				field:"taskId",title:'定时查询编号',width:80,hidden:true,
				editor:{
					type:'text',
					options:{
						required:false
					}
				}
			}, {
				field:"originCityName",title:'起运港城市',width:200,
				editor:{
					type:'combobox',
					options:{
						required:false,
                        valueField: 'cityName',//对应为表格中的field
                        textField: 'cityCountryName',//显示值
                        //数据，可后台，可写死（演示为固定），后台可根据ajax，自己获取，先获取到为全局变量，在放入data中。
                        url: getContextPath()+'/location/list.do?countryName=china',
                        // data: _KKXMItems
					}
				}
			}, {
				field:"destinationCityName",title:'目的港城市',width:200,
                editor: {
                    type: 'combobox',
                    options: {
                        required: false,
                        valueField: 'cityName',//对应为表格中的field
                        textField: 'cityCountryName',//显示值
                        //数据，可后台，可写死（演示为固定），后台可根据ajax，自己获取，先获取到为全局变量，在放入data中。
                        url: getContextPath() + '/location/list.do',
                    }
                }
            // }, {
            //     field:"containerSizeType",title:'箱型',width:100,
            //     editor:{
            //         type:'text',
            //         options:{
            //             required:false
            //         }
            //     }
            },{
                field:"containerSizeType",title:'箱型',width:100,
                editor:{type:'combobox',
                    options:{
                        data:[{"containerSizeType":"20DRY"},{"containerSizeType":"40DRY"},{"containerSizeType":"40HDRY"},{"containerSizeType":"45HDRY"}],
                        valueField:"containerSizeType",
                        textField:'containerSizeType',
//							parentField:'superior',
//							formatter:function(node){return node.name},
//							multiple:false
                    }
                }
            }, {
                field:"queryInterval",title:'时间间隔（秒）',width:200,
                editor:{
                    type:'text',
                    options:{
                        required:false
                    }
                }
            }, {
                field:"employeeIds",title:'推送员工ID（多个以半角逗号分割）',width:250,
                editor:{
                    type:'text',
                    options:{
                        required:false
                    }
                }
//			}
//			, {
//				field:"status",title:'是否启用',width:100,// 0未启用，1启用
//
//				editor : {
//					type : 'combobox',
//					options : {
//						missingMessage:'请选择或输入是否启用',
//						valueField:'useType',
//						textField:'name',
//						panelHeight:45,
//						data:useSelect,
//						required : false
//					}
//				}
			}] ],// 合并单元格
			toolbar : [ {
				id:"RESOURCE_20090200",
				text : '增加',
				iconCls : 'icon-add',
				handler : function() {
					if (editRow != undefined) {
						datagrid.datagrid('endEdit', editRow);
					}
					if (editRow == undefined) {
						datagrid.datagrid('insertRow', {// 首行增加

							index : 0,
							row : {
							}
						});
						var rows = datagrid.datagrid('getRows');
						// datagrid.datagrid('beginEdit', rows.length -
						// 1);//开启行编辑模式，在末尾插入index索引从零开始，因此减1
						datagrid.datagrid('beginEdit', 0);
						editRow = 0;
					}
				}

			}, '-', {
				id:"RESOURCE_20090400",
				text : '删除',
				iconCls : 'icon-remove',
				handler : function() {
                    var rows = datagrid.datagrid('getSelections');// 获得选中项
                    if(rows.length ==1){
                        $.messager.confirm('请确认','您确定要删除当前选择的记录吗？',function(b){

                            if(b){// 选择“确定”
                                // 	var ids=[];
                                // 	for(i=0;i<rows.length;i++){
                                // 		ids.push(rows[i].id);
                                // }
                                // console.info(ids.join(','));
                                $.ajax({
                                    url : getContextPath()+'/offer/config/delete.do',
                                    method:'post',
                                    data : {taskId : rows[0].taskId},//ids.join(',')
                                    dataType : 'json',
                                    success : function(rsp) {
                                        datagrid.datagrid('reload');
                                       // $.messager.alert("提示",rsp.msg);
                                    }
                                });
                            }
                            else{// 选择“取消”
                                datagrid.datagrid('unselectAll');// ////////////////////////
                            }
                        });
                    }else{
                        $.messager.alert('提示','请选择要删除的记录，一次只能删一条。','error');
                    }
                }
			}, '-', {
				id:"RESOURCE_20090300",
				text : '修改',
				iconCls : 'icon-edit',
				handler : function() {
					var rows = datagrid.datagrid('getSelections');
					if (rows.length == 1) {
						if (editRow != undefined) {
							datagrid.datagrid('endEdit', editRow);
						}
						if (editRow == undefined) {    
							var index =datagrid.datagrid('getRowIndex', rows[0]);

							datagrid.datagrid('beginEdit', index);

                            //设置启始港，目的港，箱型，推送员工等不能编辑
                            et = datagrid.datagrid('getEditor', {index:index,field:'originCityName'});
                            $(et.target).combobox('disable');//.attr('disabled','disabled');// 只读
                            et = datagrid.datagrid('getEditor', {index:index,field:'destinationCityName'});
                            $(et.target).combobox('disable');//.attr('disabled','disabled');// 只读
                            et = datagrid.datagrid('getEditor', {index:index,field:'containerSizeType'});
                            $(et.target).attr('disabled','disabled');// 只读
                            et = datagrid.datagrid('getEditor', {index:index,field:'employeeIds'});
                            $(et.target).attr('disabled','disabled');// 只读

                            editRow = index;
							datagrid.datagrid('unselectAll');
						}
					}
					else if(rows.length>1){                                    // ///////////////////////
						$.messager.alert('提示','一次只能修改一条记录，请重新选择','error');// ///////////////
						datagrid.datagrid('unselectAll');                      // ///////////////
					}else{                                                     // ///////////////
						$.messager.alert('提示','请选择要修改的记录','error');         // ///////////////
					}                                                          // ///////////
				}
			}, '-', {
				text : '保存',
				iconCls : 'icon-save',
				handler : function() {
					endEdit();
					if (datagrid.datagrid('getChanges').length) {
                        var inserted = datagrid.datagrid('getChanges', "inserted");
                        var updated = datagrid.datagrid('getChanges', "updated");
                        var effectRow ;//= new Object();
                        
                            if (inserted.length) {
                            	// effectRow["data"] = JSON.stringify(inserted);
                                effectRow = inserted[0];
                            	methodURL = '/offer/config/add.do';

                            	if(effectRow.destinationCityName == "" || effectRow.originCityName == '' || effectRow.containerSizeType == '' || effectRow.employeeIds == "" ){
                            	    alert("所有信息不能为空！");
                                    datagrid.datagrid('reload');
                            	    return;
                                }
                            }
                            if (updated.length) {
                            	// effectRow["data"] = JSON.stringify(updated);
                                effectRow = updated[0];
                                methodURL = '/offer/config/modify.do';

                            }
                         	$.post(getContextPath()+methodURL, effectRow, function(rsp) {
                         		
                         		$.messager.alert("提示",rsp == true?"保持成功！":"保持失败！");
                         		datagrid.datagrid('reload');
                         		datagrid.datagrid('unselectAll');

                         }, "JSON").error(function() {
                            $.messager.alert("提示", "提交错误（请按规范填写）！");// ///////////////////
                         });
				    }
			    }
			}, '-', {
				text : '取消',
				iconCls : 'icon-undo',
				handler : function() {
					editRow = undefined;
					datagrid.datagrid('rejectChanges');
					datagrid.datagrid('unselectAll');
				}
				
			}, '-' ],
			// 当用户编辑完成时触发
			onAfterEdit : function(rowIndex, rowData, changes) {
				console.info(rowData);// 向后台传递的数据
				editRow = undefined;
			},
			// 当用户双击一行时触发
			onDblClickRow : function(rowIndex, rowData) {// 双击编辑行
				if (editRow != undefined) {
					datagrid.datagrid('endEdit', editRow);
				}
				if (editRow == undefined) {

					var rows = datagrid.datagrid('getRows');
					datagrid.datagrid('beginEdit', rowIndex);
					editRow = rowIndex;
				}
			}
		});

	});
	
	function endEdit(){
        var rows = datagrid.datagrid('getRows');
        
        for ( var i = 0; i < rows.length; i++) {
        	datagrid.datagrid('endEdit', i);
        }
       }
	
	function searchScheduleTask(){
        queryJson = {};//将查询参数JSON置为空

        if ($('#originCityName').val() != ''){
            createJson(queryJson, "originCityName", $('#originCityName').val());

        }

        if ($('#destinationCityName').val() != ''){
            createJson(queryJson, "destinationCityName", $('#destinationCityName').val());
         }

		$('#datagrid').datagrid('load',queryJson);//sy.serializeObject()
		
	}
	
	function clearScheduleTask(){
		
		 $('#searchForm').form('clear');
		 json = {};//将查询参数JSON置为空
		 datagrid.datagrid('load', {});
		
		
	}

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