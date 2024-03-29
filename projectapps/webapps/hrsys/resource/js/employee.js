$(document).ready(function () {
    //调用表格初始化函数
    initTable();
    //调用负责按钮绑定事件的函数
    btnOnEvent();
});
//按钮绑定事件函数
function btnOnEvent() {
    $("#btnSearch").on("click",searchEmploy);//查找按钮
    $("#btnSave").on("click",saveDate);//模态框保存按钮
    $("#addE").on("click",addEmployee);//添加按钮
    //$("#updateE").on("click",upEmployee);//修改按钮
    $("#delE").on("click",delEmployee);//删除按钮
}
//表格初始化的函数
function initTable() {
            //设置表格的列属性
            let colArr=[
                {
                    checkbox:true
                },
                {
                    field:"employee_id",
                    title:"编号"
                },
                {
                    field:"name",
                    title: "雇员姓名"
                },
                {
                    field:"user_id.username",
                    title:"登录账号",
                },
                {
                    field:"age",
                    title:"年龄",
                },
                {
                    field:"gender.title",
                    title:"性别",
             
                },{
                    field:"city.title",
                    title:"城市",
             
                },
                {
                    field:"dept_id.name",
                    title:"所属部门",
                }
            ];
        //设置表格的属性
        $("#table").bootstrapTable(
            {
                url:"../searchEmployee",
                method:"post",
                dataType:"json",
                toolbar:"#tools",
                pagination:true,
                pageSize:8,//设置每页显示的条目数
        		pageList:[8,10,12,14],//设置每页显示条目数的选项
                columns:colArr//设置各列的属性
            });
    }
//查找按钮点击事件函数
function searchEmploy() {
        //通过ajax进行操作
        $.post("../searchEmployee",$("#frmSearch").serialize() ,function (rs) {
            //根据rs重新加载表格数据
            $("#table").bootstrapTable("load",rs);
        },"json");
      //重置查询表单数据
    	$("#frmSearch")[0].reset();
    }

//添加，修改，删除
var path=" ";//全局变量，用来存储添加或修改的后端URL地址
//保存按钮的点击函数
function saveDate() {
	//验证表单数据
	var inputObj =$("#frmEmployee").find("input.form-control");//获取:可输入框(emp_name,emp_age
	for(var i=0;i<inputObj.length;i++){
		if(inputObj[i].value==""){//存在空数据
			//显示提示标签
			$("#prompt").css("display","inline");
			return ;
		}
	}
	//判断性别单选框是否勾选
	var poststr = $("#frmEmployee").serialize();//emp_id=&emp_name=nora&emp_age=23&emp_city=&emp_uname=&emp_dept=
	if(!poststr.includes("emp_gender")){//判断传输的字段是否包含性别
		$("#prompt").css("display","inline");
		return ;
	}
	var selectList = $("#frmEmployee select");//获取表单中的select标签元素
	for(var i =0;i<selectList.length;i++){//遍历select标签元素
		//console.log(selectList[i].value);
		if(selectList[i].value==""){//过滤value值为空的选项
			$("#prompt").css("display","inline");
			return ;
		}
	}
	//
	//发送表单数据
    $.post(path,$("#frmEmployee").serialize(),function (rs) {
        alert(rs.msg);
        if(rs.flag){//成功
            //将form表单的值reset
            $("#frmEmployee").get(0).reset();
            //模态框隐藏
            $("#myModal").modal("hide");
            //刷新表单数据
            $("#table").bootstrapTable("refresh");
        }
    },"json");
}
//添加功能
    function addEmployee() {
        //给全局变量path赋值
        path="../addEmployee";
        //设置模态框标题
        $("#mtitle").text("添加雇员");
        //初始化提示文本
        $("#prompt").css("display","none");
        //初始化添加雇员面板 城市  用户 部门列表选项
        //初始化城市面板 2 城市
        $("#citylist").empty();
        
        $("<option/>").attr("value","")
		.html("请选择")
		.appendTo("#citylist");
        
        $.post("../searchDict",{"dictTypeId":2},function(rs){
        	$.each(rs,function(i,n){//i元素下标，n元素
	        	$("<option/>").attr("value",n.dct_id)
				.html(n.title)
				.appendTo("#citylist");
        	});
        },"json");
        //
        //初始化用户面板searchUser
        $("#userlist").empty();
        
        $("<option/>").attr("value","")
		.html("请选择")
		.appendTo("#userlist");
        
        $.post("../searchUser",function(rs){
        	$.each(rs,function(i,n){//i元素下标，n元素
	        	$("<option/>").attr("value",n.user_id)
	 			.html(n.username)
	 			.appendTo("#userlist");
        	 });
        },"json");
        //
        //初始化部门面板
        $("#deptlist").empty();
        
        $("<option/>").attr("value","")
		.html("请选择")
		.appendTo("#deptlist");
        
        $.post("../searchDept",function(rs){
        	$.each(rs,function(i,n){//i元素下标，n元素
        		$("<option/>").attr("value",n.dept_id)
    			.html(n.name)
    			.appendTo("#deptlist");
        	});
        },"json");
        //
        //显示模态框
        $("#myModal").modal("show");
    }
//修改功能
function upEmployee() {
	//alert("雇员信息暂时不支持修改");
    //1.获得表格选中的行
    let temp=$("#table").bootstrapTable("getSelections");
    //2.判断选中的是否仅有一行
    if(temp.length>1 || temp.length==0){
        alert("请选择一行记录进行修改");
        return;
    }
    //3.如果选中了仅一行，则将此行数据填充到表单中
    $("#frmEmployee input[name='employ_id']").val(temp[0].employee_id);
    $("#frmEmployee input[name='ename']").val(temp[0].name);
    $("#frmEmployee input[name='eage']").val(temp[0].age);
    $("#frmEmployee input[name='egender_id']").val(temp[0].gender_id);
    $("#frmEmployee input[name='ecity_id']").val(temp[0].city_Id);

    //4.设置Path路径
    path="../upEmployee";
    //5.设置模态框的标题
    $("#mtitle").text("修改员工信息");
    //6.显示模态框
    $("#myModal").modal("show");
}
//删除功能
function delEmployee() {
    //获得表格选中的行
    let temp=$("#table").bootstrapTable("getSelections");//temp 表格所选项对象数组
    //判断选中的是否仅有一行
    if(temp.length>1 || temp.length==0){
        alert("请选择一行记录进行删除");
        return;
    }
    //提示是否确认删除,确认则删除
    if(confirm("是否确定删除")){
        let data={
            "eid":temp[0].employee_id,
            "uname":temp[0].user_id.username
        }
        $.post("../delEmployee",data,function (rs) {
            alert(rs.msg);
            if(rs.flag){
                $("#table").bootstrapTable("refresh");
            }
        },"json");
    }
}


