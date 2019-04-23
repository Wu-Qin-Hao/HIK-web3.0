// Init plugin

// overall save the current selected window
var g_iWndIndex = 0; //don't have to set the variable; default to use the current selected window without transmiting value when the interface has window parameters
$(function () {
	// check the installation status of plugin 
	if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
		alert(" If the plugin is uninstalled, please install the WebComponents.exe!");
		return;
	}
	
	// Init plugin parameters and insert the plugin
	WebVideoCtrl.I_InitPlugin(500, 300, {
        iWndowType: 2,
		cbSelWnd: function (xmlDoc) {
			g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
			var szInfo = "selected window number：" + g_iWndIndex;
			showCBInfo(szInfo);
		}
	});
	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

	// check plugin to see whether it is the latest
	if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
		alert("Detect the latest version, please double click WebComponents.exe to update！");
		return;
	}

	// window event binding
	$(window).bind({
		resize: function () {
			var $Restart = $("#restartDiv");
			if ($Restart.length > 0) {
				var oSize = getWindowSize();
				$Restart.css({
					width: oSize.width + "px",
					height: oSize.height + "px"
				});
			}
		}
	});

    //init date
    var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
    $("#starttime").val(szCurTime + " 00:00:00");
    $("#endtime").val(szCurTime + " 23:59:59");
});

// display operation info
function showOPInfo(szInfo) {
	szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
	$("#opinfo").html(szInfo + $("#opinfo").html());
}

// display callback info
function showCBInfo(szInfo) {
	szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
	$("#cbinfo").html(szInfo + $("#cbinfo").html());
}

// time format
function dateFormat(oDate, fmt) {
	var o = {
		"M+": oDate.getMonth() + 1, //month
		"d+": oDate.getDate(), //day
		"h+": oDate.getHours(), //hour
		"m+": oDate.getMinutes(), //minute
		"s+": oDate.getSeconds(), //second
		"q+": Math.floor((oDate.getMonth() + 3) / 3), //quarter
		"S": oDate.getMilliseconds()//millisecond
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

// get window size
function getWindowSize() {
	var nWidth = $(this).width() + $(this).scrollLeft(),
		nHeight = $(this).height() + $(this).scrollTop();

	return {width: nWidth, height: nHeight};
}

// open option dialog 0: folder, 1: file 
	function clickOpenFileDlg(id, iType) {
	var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);
	
	if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
		$("#" + id).val(szDirPath);
	}
}

// get local parameters
function clickGetLocalCfg() {
	var xmlDoc = WebVideoCtrl.I_GetLocalCfg();

	$("#netsPreach").val($(xmlDoc).find("BuffNumberType").eq(0).text());
	$("#wndSize").val($(xmlDoc).find("PlayWndType").eq(0).text());
	$("#rulesInfo").val($(xmlDoc).find("IVSMode").eq(0).text());
	$("#captureFileFormat").val($(xmlDoc).find("CaptureFileFormat").eq(0).text());
	$("#packSize").val($(xmlDoc).find("PackgeSize").eq(0).text());
	$("#recordPath").val($(xmlDoc).find("RecordPath").eq(0).text());
	$("#downloadPath").val($(xmlDoc).find("DownloadPath").eq(0).text());
	$("#previewPicPath").val($(xmlDoc).find("CapturePath").eq(0).text());
	$("#playbackPicPath").val($(xmlDoc).find("PlaybackPicPath").eq(0).text());
	$("#playbackFilePath").val($(xmlDoc).find("PlaybackFilePath").eq(0).text());
    	$("#protocolType").val($(xmlDoc).find("ProtocolType").eq(0).text());

	showOPInfo("local configuration success！");
}

// set local parameters
function clickSetLocalCfg() {
	var arrXml = [],
		szInfo = "";
	
	arrXml.push("<LocalConfigInfo>");
	arrXml.push("<PackgeSize>" + $("#packSize").val() + "</PackgeSize>");
	arrXml.push("<PlayWndType>" + $("#wndSize").val() + "</PlayWndType>");
	arrXml.push("<BuffNumberType>" + $("#netsPreach").val() + "</BuffNumberType>");
	arrXml.push("<RecordPath>" + $("#recordPath").val() + "</RecordPath>");
	arrXml.push("<CapturePath>" + $("#previewPicPath").val() + "</CapturePath>");
	arrXml.push("<PlaybackFilePath>" + $("#playbackFilePath").val() + "</PlaybackFilePath>");
	arrXml.push("<PlaybackPicPath>" + $("#playbackPicPath").val() + "</PlaybackPicPath>");
	arrXml.push("<DownloadPath>" + $("#downloadPath").val() + "</DownloadPath>");
	arrXml.push("<IVSMode>" + $("#rulesInfo").val() + "</IVSMode>");
	arrXml.push("<CaptureFileFormat>" + $("#captureFileFormat").val() + "</CaptureFileFormat>");
    	arrXml.push("<ProtocolType>" + $("#protocolType").val() + "</ProtocolType>");
	arrXml.push("</LocalConfigInfo>");

	var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));

	if (0 == iRet) {
		szInfo = "local configuration success！";
	} else {
		szInfo = "local configuration failed！";
	}
	showOPInfo(szInfo);
}

// windows number
function changeWndNum(iType) {
	iType = parseInt(iType, 10);
	WebVideoCtrl.I_ChangeWndNum(iType);
}

// login
function clickLogin() {
	var szIP = $("#loginip").val(),
		szPort = $("#port").val(),
		szUsername = $("#username").val(),
		szPassword = $("#password").val();

	if ("" == szIP || "" == szPort) {
		return;
	}

	var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
		success: function (xmlDoc) {
			showOPInfo(szIP + " login success！");

			$("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option>");
			setTimeout(function () {
				$("#ip").val(szIP);
				getChannelInfo();
			}, 10);
		},
		error: function () {
			showOPInfo(szIP + " login failed！");
		}
	});

	if (-1 == iRet) {
		showOPInfo(szIP + " login already !");
	}
}

// exit
function clickLogout() {
	var szIP = $("#ip").val(),
		szInfo = "";

	if (szIP == "") {
		return;
	}

	var iRet = WebVideoCtrl.I_Logout(szIP);
	if (0 == iRet) {
		szInfo = "exit success！";

		$("#ip option[value='" + szIP + "']").remove();
		getChannelInfo();
	} else {
		szInfo = "exit failed！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// get deivce info
function clickGetDeviceInfo() {
	var szIP = $("#ip").val();

	if ("" == szIP) {
		return;
	}

	WebVideoCtrl.I_GetDeviceInfo(szIP, {
		success: function (xmlDoc) {
			var arrStr = [];
			arrStr.push("device name：" + $(xmlDoc).find("deviceName").eq(0).text() + "\r\n");
			arrStr.push("device ID：" + $(xmlDoc).find("deviceID").eq(0).text() + "\r\n");
			arrStr.push("model：" + $(xmlDoc).find("model").eq(0).text() + "\r\n");
			arrStr.push("serial number：" + $(xmlDoc).find("serialNumber").eq(0).text() + "\r\n");
			arrStr.push("MAC address：" + $(xmlDoc).find("macAddress").eq(0).text() + "\r\n");
			arrStr.push("firmware version：" + $(xmlDoc).find("firmwareVersion").eq(0).text() + " " + $(xmlDoc).find("firmwareReleasedDate").eq(0).text() + "\r\n");
			arrStr.push("encoder version：" + $(xmlDoc).find("encoderVersion").eq(0).text() + " " + $(xmlDoc).find("encoderReleasedDate").eq(0).text() + "\r\n");
			
			showOPInfo(szIP + " get deivce info success！");
			alert(arrStr.join(""));
		},
		error: function () {
			showOPInfo(szIP + " get device info failed！");
		}
	});
}

// get channel info
function getChannelInfo() {
	var szIP = $("#ip").val(),
		oSel = $("#channels").empty(),
		nAnalogChannel = 0;

	if ("" == szIP) {
		return;
	}

	// analog channel
	WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("VideoInputChannel");
			nAnalogChannel = oChannels.length;

			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text();
				if ("" == name) {
					name = "Camera " + (id < 9 ? "0" + id : id);
				}
				oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
			});
			showOPInfo(szIP + " get analog channel success！");
		},
		error: function () {
			showOPInfo(szIP + " get analog channel failed！");
		}
	});
	// IP channel
	WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text(),
					online = $(this).find("online").eq(0).text();
				if ("false" == online) {// filter the forbidden IP channel
					return true;
				}
				if ("" == name) {
					name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
				}
				oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
			});
			showOPInfo(szIP + " get IP channel success！");
		},
		error: function () {
			showOPInfo(szIP + " get IP channel failed！");
		}
	});
	// zero-channel info
	WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("ZeroVideoChannel");
			
			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text();
				if ("" == name) {
					name = "Zero Channel " + (id < 9 ? "0" + id : id);
				}
				if ("true" == $(this).find("enabled").eq(0).text()) {//  filter the forbidden zero-channel
					oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
				}
			});
			showOPInfo(szIP + " get zero-channel success！");
		},
		error: function () {
			showOPInfo(szIP + " get zero-channel failed！");
		}
	});
}

// get IP channel
function clickGetDigitalChannelInfo() {
	var szIP = $("#ip").val(),
		iAnalogChannelNum = 0;

	$("#digitalchannellist").empty();

	if ("" == szIP) {
		return;
	}

	// analog channel
	WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			iAnalogChannelNum = $(xmlDoc).find("VideoInputChannel").length;
		},
		error: function () {
			
		}
	});

	// IP channel
	WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("InputProxyChannelStatus"),
				i = 0;
			
			$.each(oChannels, function () {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					ipAddress = $(this).find("ipAddress").eq(0).text(),
					srcInputPort = $(this).find("srcInputPort").eq(0).text(),
					managePortNo = $(this).find("managePortNo").eq(0).text(),
					online = $(this).find("online").eq(0).text(),
					proxyProtocol = $(this).find("proxyProtocol").eq(0).text();
							
				var objTr = $("#digitalchannellist").get(0).insertRow(-1);
				var objTd = objTr.insertCell(0);
				objTd.innerHTML = (id - iAnalogChannelNum) < 10 ? "D0" + (id - iAnalogChannelNum) : "D" + (id - iAnalogChannelNum);
				objTd = objTr.insertCell(1);
				objTd.width = "25%";
				objTd.innerHTML = ipAddress;
				objTd = objTr.insertCell(2);
				objTd.width = "15%";
				objTd.innerHTML = srcInputPort;
				objTd = objTr.insertCell(3);
				objTd.width = "20%";
				objTd.innerHTML = managePortNo;
				objTd = objTr.insertCell(4);
				objTd.width = "15%";
				objTd.innerHTML = "true" == online ? "online" : "offline";
				objTd = objTr.insertCell(5);
				objTd.width = "25%";
				objTd.innerHTML = proxyProtocol;
			});
			showOPInfo(szIP + " get IP channel success！");
		},
		error: function () {
			showOPInfo(szIP + " no IP channel！");
		}
	});
}

// strat real play
function clickStartRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		iStreamType = parseInt($("#streamtype").val(), 10),
		iChannelID = parseInt($("#channels").val(), 10),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (oWndInfo != null) {// stop first
		WebVideoCtrl.I_Stop();
	}

	var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
		iStreamType: iStreamType,
		iChannelID: iChannelID,
		bZeroChannel: bZeroChannel
	});

	if (0 == iRet) {
		szInfo = "start real play success！";
	} else {
		szInfo = "start real play failed！";
	}

	showOPInfo(szIP + " " + szInfo);
}

// stop real play
function clickStopRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "stop real play success！";
		} else {
			szInfo = "stop real play failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// open sound
function clickOpenSound() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var allWndInfo = WebVideoCtrl.I_GetWindowStatus();
		// close the sound by iterating over all the window
		for (var i = 0, iLen = allWndInfo.length; i < iLen; i++) {
			oWndInfo = allWndInfo[i];
			if (oWndInfo.bSound) {
				WebVideoCtrl.I_CloseSound(oWndInfo.iIndex);
				break;
			}
		}

		var iRet = WebVideoCtrl.I_OpenSound();

		if (0 == iRet) {
			szInfo = "open sound success！";
		} else {
			szInfo = "open sound failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// close sound
function clickCloseSound() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_CloseSound();
		if (0 == iRet) {
			szInfo = "close sound success！";
		} else {
			szInfo = "close sound failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// set volume
function clickSetVolume() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		iVolume = parseInt($("#volume").val(), 10),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_SetVolume(iVolume);
		if (0 == iRet) {
			szInfo = "set volume success！";
		} else {
			szInfo = "set volume failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// capture
function clickCapturePic() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var szChannelID = $("#channels").val(),
			szPicName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
			iRet = WebVideoCtrl.I_CapturePic(szPicName);
		if (0 == iRet) {
			szInfo = "capture success！";
		} else {
			szInfo = "capture failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// start record
function clickStartRecord() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var szChannelID = $("#channels").val(),
			szFileName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
			iRet = WebVideoCtrl.I_StartRecord(szFileName);
		if (0 == iRet) {
			szInfo = "start recording success！";
		} else {
			szInfo = "start recording failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// stop record
function clickStopRecord() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_StopRecord();
		if (0 == iRet) {
			szInfo = "stop recording success！";
		} else {
			szInfo = "stop recording failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// get audio channel
function clickGetAudioInfo() {
	var szIP = $("#ip").val();

	if ("" == szIP) {
		return;
	}

	WebVideoCtrl.I_GetAudioInfo(szIP, {
		success: function (xmlDoc) {
			var oAudioChannels = $(xmlDoc).find("TwoWayAudioChannel"),
				oSel = $("#audiochannels").empty();
			$.each(oAudioChannels, function () {
				var id = $(this).find("id").eq(0).text();

				oSel.append("<option value='" + id + "'>" + id + "</option>");
			});
			showOPInfo(szIP + " get audio channel success！");
		},
		error: function () {
			showOPInfo(szIP + " get audio channel failed！");
		}
	});
}

// start voice talk
function clickStartVoiceTalk() {
	var szIP = $("#ip").val(),
		iAudioChannel = parseInt($("#audiochannels").val(), 10),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (isNaN(iAudioChannel)){
		alert("please select channel first！");
		return;
	}

	var iRet = WebVideoCtrl.I_StartVoiceTalk(szIP, iAudioChannel);

	if (0 == iRet) {
		szInfo = "start voice talk success！";
	} else {
		szInfo = "start voice talk failed！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// stop voice talk
function clickStopVoiceTalk() {
	var szIP = $("#ip").val(),
		iRet = WebVideoCtrl.I_StopVoiceTalk(),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (0 == iRet) {
		szInfo = "stop voice talk success！";
	} else {
		szInfo = "stop voice talk failed！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// enable E-zoom
function clickEnableEZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_EnableEZoom();
		if (0 == iRet) {
			szInfo = "enable E-zoom success！";
		} else {
			szInfo = "enable E-zoom failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// disable E-zoom
function clickDisableEZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_DisableEZoom();
		if (0 == iRet) {
			szInfo = "disable E-zoom success！";
		} else {
			szInfo = "disable E-zoom failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// enable 3D zoom
	function clickEnable3DZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Enable3DZoom();
		if (0 == iRet) {
			szInfo = "enable 3D zoom success！";
		} else {
			szInfo = "enable 3D zoom failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// diasble 3D zoom
function clickDisable3DZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Disable3DZoom();
		if (0 == iRet) {
			szInfo = "diasble 3D zoom success！";
		} else {
			szInfo = "diasble 3D zoom failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// full screen
function clickFullScreen() {
	WebVideoCtrl.I_FullScreen(true);
}

// PTZ control, 9- auto; 1,2,3,4,5,6,7,8 -  PTZ direction control by mouse
var g_bPTZAuto = false;
function mouseDownPTZControl(iPTZIndex) {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iPTZSpeed = $("#ptzspeed").val(),
		bStop = false;

	if (bZeroChannel) {// zero-channel does not support PTZ 
		return;
	}
	
	if (oWndInfo != null) {
		if (9 == iPTZIndex && g_bPTZAuto) {
			iPTZSpeed = 0;// you can close auto mode by setting speed to 0 when auto is start already
			bStop = true;
		} else {
			g_bPTZAuto = false;// auto mode will be close when you clik other direction
			bStop = false;
		}

		WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
			iPTZSpeed: iPTZSpeed,
			success: function (xmlDoc) {
				if (9 == iPTZIndex) {
					g_bPTZAuto = !g_bPTZAuto;
				}
				showOPInfo(oWndInfo.szIP + " start PTZ success！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + " start PTZ failed！");
			}
		});
	}
}

// stop PTZ direction 
function mouseUpPTZControl() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(1, true, {
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " stop PTZ success！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + " stop PTZ failed！");
			}
		});
	}
}

// set preset
function clickSetPreset() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		iPresetID = parseInt($("#preset").val(), 10);

	if (oWndInfo != null) {
		WebVideoCtrl.I_SetPreset(iPresetID, {
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " set preset success！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + " set preset failed！");
			}
		});
	}
}

// call preset
function clickGoPreset() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		iPresetID = parseInt($("#preset").val(), 10);

	if (oWndInfo != null) {
		WebVideoCtrl.I_GoPreset(iPresetID, {
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " call preset success！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + " call preset failed！");
			}
		});
	}
}

// record searching
var iSearchTimes = 0;
function clickRecordSearch(iType) {
	var szIP = $("#ip").val(),
		iChannelID = $("#channels").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val();

	if ("" == szIP) {
		return;
	}

	if (bZeroChannel) {// zero-channel does not support record searching
		return;
	}

	if (0 == iType) {// search for the first time
		$("#searchlist").empty();
		iSearchTimes = 0;
	}

	WebVideoCtrl.I_RecordSearch(szIP, iChannelID, szStartTime, szEndTime, {
		iSearchPos: iSearchTimes * 40,
		success: function (xmlDoc) {
			if("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				
				for(var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
					var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
					if(szPlaybackURI.indexOf("name=") < 0) {
						break;
					}
					var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
					var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
					var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

					var objTr = $("#searchlist").get(0).insertRow(-1);
					var objTd = objTr.insertCell(0);
					objTd.id = "downloadTd" + i;
					objTd.innerHTML = iSearchTimes * 40 + (i + 1);
					objTd = objTr.insertCell(1);
					objTd.width = "30%";
					objTd.innerHTML = szFileName;
					objTd = objTr.insertCell(2);
					objTd.width = "30%";
					objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(3);
					objTd.width = "30%";
					objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(4);
					objTd.width = "10%";
					objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + i + ");'>download</a>";
					$("#downloadTd" + i).data("playbackURI", szPlaybackURI);
				}

				iSearchTimes++;
				clickRecordSearch(1);// contine to search
			} else if ("OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				var iLength = $(xmlDoc).find("searchMatchItem").length;
				for(var i = 0; i < iLength; i++) {
					var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
					if(szPlaybackURI.indexOf("name=") < 0) {
						break;
					}
					var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
					var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
					var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

					var objTr = $("#searchlist").get(0).insertRow(-1);
					var objTd = objTr.insertCell(0);
					objTd.id = "downloadTd" + i;
					objTd.innerHTML = iSearchTimes * 40 + (i + 1);
					objTd = objTr.insertCell(1);
					objTd.width = "30%";
					objTd.innerHTML = szFileName;
					objTd = objTr.insertCell(2);
					objTd.width = "30%";
					objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(3);
					objTd.width = "30%";
					objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(4);
					objTd.width = "10%";
					objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + i + ");'>download</a>";
					$("#downloadTd" + i).data("playbackURI", szPlaybackURI);
				}
				showOPInfo(szIP + " search video file success！");
			} else if("NO MATCHES" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				setTimeout(function() {
					showOPInfo(szIP + " no record file！");
				}, 50);
			}
		},
		error: function () {
			showOPInfo(szIP + " search record file failed！");
		}
	});
}

// start play back
function clickStartPlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iChannelID = $("#channels").val(),
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val(),
		szInfo = "",
		bChecked = $("#transstream").prop("checked"),
		iRet = -1;

	if ("" == szIP) {
		return;
	}

	if (bZeroChannel) {// zero-channel does not support play back
		return;
	}

	if (oWndInfo != null) {// stop play first
		WebVideoCtrl.I_Stop();
	}

	if (bChecked) {// enable transcode playback
		var oTransCodeParam = {
			TransFrameRate: "16",// 0：full，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
			TransResolution: "2",// 255：Auto，3：4CIF，2：QCIF，1：CIF
			TransBitrate: "23"// 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
		};
		iRet = WebVideoCtrl.I_StartPlayback(szIP, {
			iChannelID: iChannelID,
			szStartTime: szStartTime,
			szEndTime: szEndTime,
			oTransCodeParam: oTransCodeParam
		});
	} else {
		iRet = WebVideoCtrl.I_StartPlayback(szIP, {
			iChannelID: iChannelID,
			szStartTime: szStartTime,
			szEndTime: szEndTime
		});
	}

	if (0 == iRet) {
		szInfo = "start play back success！";
	} else {
		szInfo = "start play back failed！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// stop play back
function clickStopPlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "stop play back success！";
		} else {
			szInfo = "stop play back failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// start reverse play
function clickReversePlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iChannelID = $("#channels").val(),
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val(),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (bZeroChannel) {// zero-channel does not support reverse play
		return;
	}

	if (oWndInfo != null) {// stop play first
		WebVideoCtrl.I_Stop();
	}

	var iRet = WebVideoCtrl.I_ReversePlayback(szIP, {
		iChannelID: iChannelID,
		szStartTime: szStartTime,
		szEndTime: szEndTime
	});

	if (0 == iRet) {
		szInfo = "start reverse play success！";
	} else {
		szInfo = "start reverse play failed！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// single frame
	function clickFrame() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Frame();
		if (0 == iRet) {
			szInfo = "single frame play success！";
		} else {
			szInfo = "single frame play failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// pause
function clickPause() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Pause();
		if (0 == iRet) {
			szInfo = "pause success！";
		} else {
			szInfo = "pause failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// resume
function clickResume() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Resume();
		if (0 == iRet) {
			szInfo = "resume success！";
		} else {
			szInfo = "resume failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// slow play
	function clickPlaySlow() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_PlaySlow();
		if (0 == iRet) {
			szInfo = "slow play success！";
		} else {
			szInfo = "slow play failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// fast play
function clickPlayFast() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_PlayFast();
		if (0 == iRet) {
			szInfo = "fast play success！";
		} else {
			szInfo = "fast play failed！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// OSD time
function clickGetOSDTime() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
	
	if (oWndInfo != null) {
		var szTime = WebVideoCtrl.I_GetOSDTime();
		if (szTime != -1) {
			$("#osdtime").val(szTime);
			showOPInfo(oWndInfo.szIP + " get OSD time success！");
		} else {
			showOPInfo(oWndInfo.szIP + " get OSD time failed！");
		}
	}
}

// download video
var iDownloadID = -1;
var tDownloadProcess = 0;
function clickStartDownloadRecord(i) {
	var szIP = $("#ip").val(),
		szChannelID = $("#channels").val(),
		szFileName = szIP + "_" + szChannelID + "_" + new Date().getTime(),
		szPlaybackURI = $("#downloadTd" + i).data("playbackURI");

	if ("" == szIP) {
		return;
	}

	iDownloadID = WebVideoCtrl.I_StartDownloadRecord(szIP, szPlaybackURI, szFileName);

	if (iDownloadID < 0) {
		var iErrorValue = WebVideoCtrl.I_GetLastError();
		if (34 == iErrorValue) {
			showOPInfo(szIP + " download already！");
		} else if (33 == iErrorValue) {
			showOPInfo(szIP + " lack of space！");
		} else {
			showOPInfo(szIP + " download failed！");
		}
	} else {
		$("<div id='downProcess' class='freeze'></div>").appendTo("body");
		tDownloadProcess = setInterval("downProcess(" + i + ")", 1000);
	}
}
// download process
function downProcess() {
	var iStatus = WebVideoCtrl.I_GetDownloadStatus(iDownloadID);
	if (0 == iStatus) {
		$("#downProcess").css({
			width: $("#searchlist").width() + "px",
			height: "100px",
			lineHeight: "100px",
			left: $("#searchlist").offset().left + "px",
			top: $("#searchlist").offset().top + "px"
		});
		var iProcess = WebVideoCtrl.I_GetDownloadProgress(iDownloadID);
		if (iProcess < 0) {
			clearInterval(tDownloadProcess);
			tDownloadProcess = 0;
			m_iDownloadID = -1;
		} else if (iProcess < 100) {
			$("#downProcess").text(iProcess + "%");
		} else {
			$("#downProcess").text("100%");
			setTimeout(function () {
				$("#downProcess").remove();
			}, 1000);

			WebVideoCtrl.I_StopDownloadRecord(iDownloadID);

            		showOPInfo("video dowload finish");
			clearInterval(tDownloadProcess);
			tDownloadProcess = 0;
			m_iDownloadID = -1;
		}
	} else {
		WebVideoCtrl.I_StopDownloadRecord(iDownloadID);

		clearInterval(tDownloadProcess);
		tDownloadProcess = 0;
		iDownloadID = -1;
	}
}

// export configuration file
function clickExportDeviceConfig() {
	var szIP = $("#ip").val(),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	var iRet = WebVideoCtrl.I_ExportDeviceConfig(szIP);

	if (0 == iRet) {
		szInfo = " export configuration file success！";
	} else {
		szInfo = " export configuration file failed！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// import configuration file
function clickImportDeviceConfig() {
	var szIP = $("#ip").val(),
		szFileName = $("#configFile").val();

	if ("" == szIP) {
		return;
	}

	if ("" == szFileName) {
		alert("please select configuration file！");
		return;
	}

	var iRet = WebVideoCtrl.I_ImportDeviceConfig(szIP, szFileName);

	if (0 == iRet) {
		WebVideoCtrl.I_Restart(szIP, {
			success: function (xmlDoc) {
				$("<div id='restartDiv' class='freeze'>reboot...</div>").appendTo("body");
				var oSize = getWindowSize();
				$("#restartDiv").css({
					width: oSize.width + "px",
					height: oSize.height + "px",
					lineHeight: oSize.height + "px",
					left: 0,
					top: 0
				});
				setTimeout("reconnect('" + szIP + "')", 20000);
			},
			error: function () {
				showOPInfo(szIP + " reboot failed！");
			}
		});
	} else {
		showOPInfo(szIP + " export failed！");
	}
}

// reconnection
function reconnect(szIP) {
	WebVideoCtrl.I_Reconnect(szIP, {
		success: function (xmlDoc) {
			$("#restartDiv").remove();
		},
		error: function () {
			setTimeout(function () {reconnect(szIP);}, 5000);
		}
	});
}

// start upgrade
m_tUpgrade = 0;
function clickStartUpgrade(szIP) {
	var szIP = $("#ip").val(),
		szFileName = $("#upgradeFile").val();

	if ("" == szIP) {
		return;
	}

	if ("" == szFileName) {
		alert("please select upgrade file！");
		return;
	}

	var iRet = WebVideoCtrl.I_StartUpgrade(szIP, szFileName);
	if (0 == iRet) {
		m_tUpgrade = setInterval("getUpgradeStatus('" + szIP + "')", 1000);
	} else {
		showOPInfo(szIP + " upgrade failed！");
	}
}

// get upgrade status
function getUpgradeStatus(szIP) {
	var iStatus = WebVideoCtrl.I_UpgradeStatus();
	if (iStatus == 0) {
		var iProcess = WebVideoCtrl.I_UpgradeProgress();
		if (iProcess < 0) {
			clearInterval(m_tUpgrade);
			m_tUpgrade = 0;
			showOPInfo(szIP + " get process failed！");
			return;
		} else if (iProcess < 100) {
			if (0 == $("#restartDiv").length) {
				$("<div id='restartDiv' class='freeze'></div>").appendTo("body");
				var oSize = getWindowSize();
				$("#restartDiv").css({
					width: oSize.width + "px",
					height: oSize.height + "px",
					lineHeight: oSize.height + "px",
					left: 0,
					top: 0
				});
			}
			$("#restartDiv").text(iProcess + "%");
		} else {
			WebVideoCtrl.I_StopUpgrade();
			clearInterval(m_tUpgrade);
			m_tUpgrade = 0;

			$("#restartDiv").remove();

			WebVideoCtrl.I_Restart(szIP, {
				success: function (xmlDoc) {
					$("<div id='restartDiv' class='freeze'>reboot...</div>").appendTo("body");
					var oSize = getWindowSize();
					$("#restartDiv").css({
						width: oSize.width + "px",
						height: oSize.height + "px",
						lineHeight: oSize.height + "px",
						left: 0,
						top: 0
					});
					setTimeout("reconnect('" + szIP + "')", 20000);
				},
				error: function () {
					showOPInfo(szIP + " reboot failed！");
				}
			});
		}
	} else if (iStatus == 1) {
		WebVideoCtrl.I_StopUpgrade();
		showOPInfo(szIP + " upgrade failed！");
		clearInterval(m_tUpgrade);
		m_tUpgrade = 0;
	} else if (iStatus == 2) {
		mWebVideoCtrl.I_StopUpgrade();
		showOPInfo(szIP + " language does not match！");
		clearInterval(m_tUpgrade);
		m_tUpgrade = 0;
	} else {
		mWebVideoCtrl.I_StopUpgrade();
		showOPInfo(szIP + " get status failed！");
		clearInterval(m_tUpgrade);
		m_tUpgrade = 0;
	}
}

// check plugin version
function clickCheckPluginVersion() {
	var iRet = WebVideoCtrl.I_CheckPluginVersion();
	if (0 == iRet) {
		alert("your plugin version is the latest！");
	} else {
		alert("detect the latest plugin version！");
	}
}

// remote configuration library
function clickRemoteConfig() {
	var szIP = $("#ip").val(),
		iDevicePort = parseInt($("#deviceport").val(), 10) || "",
		szInfo = "";
	
	if ("" == szIP) {
		return;
	}

	var iRet = WebVideoCtrl.I_RemoteConfig(szIP, {
		iDevicePort: iDevicePort,
		iLan: 0
	});

	if (-1 == iRet) {
		szInfo = "call remote configuration library failed！";
	} else {
		szInfo = "call remote configuration library success！";
	}
	showOPInfo(szIP + " " + szInfo);
}

function clickRestoreDefault() {
    var szIP = $("#ip").val(),
        szMode = "basic";
    WebVideoCtrl.I_RestoreDefault(szIP, szMode, {
        success: function (xmlDoc) {
            $("#restartDiv").remove();
            showOPInfo(szIP + " restore default success！");
            //reboot after restore
            WebVideoCtrl.I_Restart(szIP, {
                success: function (xmlDoc) {
                    $("<div id='restartDiv' class='freeze'>reboot...</div>").appendTo("body");
                    var oSize = getWindowSize();
                    $("#restartDiv").css({
                        width: oSize.width + "px",
                        height: oSize.height + "px",
                        lineHeight: oSize.height + "px",
                        left: 0,
                        top: 0
                    });
                    setTimeout("reconnect('" + szIP + "')", 20000);
                },
                error: function () {
                    showOPInfo(szIP + " reboot failed！");
                }
            });
        },
        error: function () {
            showOPInfo(szIP + " restore default failed！");
        }
    });
}

function PTZZoomIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(10, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " Zoom+success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  Zoom+failed！");
            }
        });
    }
}

function PTZZoomout() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " Zoom-success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  Zoom-failed！");
            }
        });
    }
}

function PTZZoomStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " stop zoom success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  stop zoom failed！");
            }
        });
    }
}

function PTZFocusIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " focus+success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  focus+failed！");
            }
        });
    }
}

function PTZFoucusOut() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(13, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " focus-success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  focus-failed！");
            }
        });
    }
}

function PTZFoucusStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " stop focus success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  stop focus failed！");
            }
        });
    }
}

function PTZIrisIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " Iris+success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  Iris+failed！");
            }
        });
    }
}

function PTZIrisOut() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(15, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " Iris-success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  Iris-failed！");
            }
        });
    }
}

function PTZIrisStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " stop Iris success！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  stop Iris failed！");
            }
        });
    }
}

dateFormat = function (oDate, fmt) {
    var o = {
        "M+": oDate.getMonth() + 1, 
        "d+": oDate.getDate(), 
        "h+": oDate.getHours(), 
        "m+": oDate.getMinutes(), 
        "s+": oDate.getSeconds(), 
        "q+": Math.floor((oDate.getMonth() + 3) / 3), 
        "S": oDate.getMilliseconds()//毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if(new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

// change mode
function changeIPMode(iType) {
	var arrPort = [0, 7071, 80];

	$("#serverport").val(arrPort[iType]);
}

// get device ip
function clickGetDeviceIP() {
	var iDeviceMode = parseInt($("#devicemode").val(), 10),
		szAddress = $("#serveraddress").val(),
		iPort = parseInt($("#serverport").val(), 10) || 0,
		szDeviceID = $("#deviceid").val(),
		szDeviceInfo = "";

	szDeviceInfo = WebVideoCtrl.I_GetIPInfoByMode(iDeviceMode, szAddress, iPort, szDeviceID);

	if ("" == szDeviceInfo) {
		showOPInfo("get device ip failed！");
	} else {
		showOPInfo("get device ip success！");

		var arrTemp = szDeviceInfo.split("-");
		$("#loginip").val(arrTemp[0]);
		$("#deviceport").val(arrTemp[1]);
	}
}