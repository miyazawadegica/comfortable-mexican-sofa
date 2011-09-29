/*!
 * jQuery timepicker addon
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 0.9.6
 * Last Modified: 07/20/2011
 * 
 * Copyright 2011 Trent Richardson
 * Dual licensed under the MIT and GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 */ 
(function($){function extendRemove(a,b){$.extend(a,b);for(var c in b)if(b[c]===null||b[c]===undefined)a[c]=b[c];return a}function Timepicker(){this.regional=[];this.regional[""]={currentText:"Now",closeText:"Done",ampm:false,timeFormat:"hh:mm tt",timeSuffix:"",timeOnlyTitle:"Choose Time",timeText:"Time",hourText:"Hour",minuteText:"Minute",secondText:"Second",timezoneText:"Time Zone"};this._defaults={showButtonPanel:true,timeOnly:false,showHour:true,showMinute:true,showSecond:false,showTimezone:false,showTime:true,stepHour:.05,stepMinute:.05,stepSecond:.05,hour:0,minute:0,second:0,timezone:"+0000",hourMin:0,minuteMin:0,secondMin:0,hourMax:23,minuteMax:59,secondMax:59,minDateTime:null,maxDateTime:null,hourGrid:0,minuteGrid:0,secondGrid:0,alwaysSetTime:true,separator:" ",altFieldTimeOnly:true,showTimepicker:true,timezoneList:["-1100","-1000","-0900","-0800","-0700","-0600","-0500","-0400","-0300","-0200","-0100","+0000","+0100","+0200","+0300","+0400","+0500","+0600","+0700","+0800","+0900","+1000","+1100","+1200"]};$.extend(this._defaults,this.regional[""])}$.extend($.ui,{timepicker:{version:"0.9.6"}});$.extend(Timepicker.prototype,{$input:null,$altInput:null,$timeObj:null,inst:null,hour_slider:null,minute_slider:null,second_slider:null,timezone_select:null,hour:0,minute:0,second:0,timezone:"+0000",hourMinOriginal:null,minuteMinOriginal:null,secondMinOriginal:null,hourMaxOriginal:null,minuteMaxOriginal:null,secondMaxOriginal:null,ampm:"",formattedDate:"",formattedTime:"",formattedDateTime:"",timezoneList:["-1100","-1000","-0900","-0800","-0700","-0600","-0500","-0400","-0300","-0200","-0100","+0000","+0100","+0200","+0300","+0400","+0500","+0600","+0700","+0800","+0900","+1000","+1100","+1200"],setDefaults:function(a){extendRemove(this._defaults,a||{});return this},_newInst:function($input,o){var tp_inst=new Timepicker,inlineSettings={};for(var attrName in this._defaults){var attrValue=$input.attr("time:"+attrName);if(attrValue){try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}tp_inst._defaults=$.extend({},this._defaults,inlineSettings,o,{beforeShow:function(a,b){if($.isFunction(o.beforeShow))o.beforeShow(a,b,tp_inst)},onChangeMonthYear:function(a,b,c){tp_inst._updateDateTime(c);if($.isFunction(o.onChangeMonthYear))o.onChangeMonthYear.call($input[0],a,b,c,tp_inst)},onClose:function(a,b){if(tp_inst.timeDefined===true&&$input.val()!="")tp_inst._updateDateTime(b);if($.isFunction(o.onClose))o.onClose.call($input[0],a,b,tp_inst)},timepicker:tp_inst});tp_inst.hour=tp_inst._defaults.hour;tp_inst.minute=tp_inst._defaults.minute;tp_inst.second=tp_inst._defaults.second;tp_inst.ampm="";tp_inst.$input=$input;if(o.altField)tp_inst.$altInput=$(o.altField).css({cursor:"pointer"}).focus(function(){$input.trigger("focus")});if(tp_inst._defaults.minDate!==undefined&&tp_inst._defaults.minDate instanceof Date)tp_inst._defaults.minDateTime=new Date(tp_inst._defaults.minDate.getTime());if(tp_inst._defaults.minDateTime!==undefined&&tp_inst._defaults.minDateTime instanceof Date)tp_inst._defaults.minDate=new Date(tp_inst._defaults.minDateTime.getTime());if(tp_inst._defaults.maxDate!==undefined&&tp_inst._defaults.maxDate instanceof Date)tp_inst._defaults.maxDateTime=new Date(tp_inst._defaults.maxDate.getTime());if(tp_inst._defaults.maxDateTime!==undefined&&tp_inst._defaults.maxDateTime instanceof Date)tp_inst._defaults.maxDate=new Date(tp_inst._defaults.maxDateTime.getTime());return tp_inst},_addTimePicker:function(a){var b=this.$altInput&&this._defaults.altFieldTimeOnly?this.$input.val()+" "+this.$altInput.val():this.$input.val();this.timeDefined=this._parseTime(b);this._limitMinMaxDateTime(a,false);this._injectTimePicker()},_parseTime:function(a,b){var c=this._defaults.timeFormat.toString().replace(/h{1,2}/ig,"(\\d?\\d)").replace(/m{1,2}/ig,"(\\d?\\d)").replace(/s{1,2}/ig,"(\\d?\\d)").replace(/t{1,2}/ig,"(am|pm|a|p)?").replace(/z{1}/ig,"((\\+|-)\\d\\d\\d\\d)?").replace(/\s/g,"\\s?")+this._defaults.timeSuffix+"$",d=this._getFormatPositions(),e;if(!this.inst)this.inst=$.datepicker._getInst(this.$input[0]);if(b||!this._defaults.timeOnly){var f=$.datepicker._get(this.inst,"dateFormat");var g=new RegExp("[.*+?|()\\[\\]{}\\\\]","g");c=".{"+f.length+",}"+this._defaults.separator.replace(g,"\\$&")+c}e=a.match(new RegExp(c,"i"));if(e){if(d.t!==-1)this.ampm=(e[d.t]===undefined||e[d.t].length===0?"":e[d.t].charAt(0).toUpperCase()=="A"?"AM":"PM").toUpperCase();if(d.h!==-1){if(this.ampm=="AM"&&e[d.h]=="12")this.hour=0;else if(this.ampm=="PM"&&e[d.h]!="12")this.hour=(parseFloat(e[d.h])+12).toFixed(0);else this.hour=Number(e[d.h])}if(d.m!==-1)this.minute=Number(e[d.m]);if(d.s!==-1)this.second=Number(e[d.s]);if(d.z!==-1)this.timezone=e[d.z];return true}return false},_getFormatPositions:function(){var a=this._defaults.timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|t{1,2}|z)/g),b={h:-1,m:-1,s:-1,t:-1,z:-1};if(a)for(var c=0;c<a.length;c++)if(b[a[c].toString().charAt(0)]==-1)b[a[c].toString().charAt(0)]=c+1;return b},_injectTimePicker:function(){var a=this.inst.dpDiv,b=this._defaults,c=this,d=(b.hourMax-b.hourMax%b.stepHour).toFixed(0),e=(b.minuteMax-b.minuteMax%b.stepMinute).toFixed(0),f=(b.secondMax-b.secondMax%b.stepSecond).toFixed(0),g=this.inst.id.toString().replace(/([^A-Za-z0-9_])/g,"");if(a.find("div#ui-timepicker-div-"+g).length===0&&b.showTimepicker){var h=' style="display:none;"',i='<div class="ui-timepicker-div" id="ui-timepicker-div-'+g+'"><dl>'+'<dt class="ui_tpicker_time_label" id="ui_tpicker_time_label_'+g+'"'+(b.showTime?"":h)+">"+b.timeText+"</dt>"+'<dd class="ui_tpicker_time" id="ui_tpicker_time_'+g+'"'+(b.showTime?"":h)+"></dd>"+'<dt class="ui_tpicker_hour_label" id="ui_tpicker_hour_label_'+g+'"'+(b.showHour?"":h)+">"+b.hourText+"</dt>",j=0,k=0,l=0,m;if(b.showHour&&b.hourGrid>0){i+='<dd class="ui_tpicker_hour">'+'<div id="ui_tpicker_hour_'+g+'"'+(b.showHour?"":h)+"></div>"+'<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';for(var n=b.hourMin;n<=d;n+=b.hourGrid){j++;var o=b.ampm&&n>12?n-12:n;if(o<10)o="0"+o;if(b.ampm){if(n==0)o=12+"a";else if(n<12)o+="a";else o+="p"}i+="<td>"+o+"</td>"}i+="</tr></table></div>"+"</dd>"}else i+='<dd class="ui_tpicker_hour" id="ui_tpicker_hour_'+g+'"'+(b.showHour?"":h)+"></dd>";i+='<dt class="ui_tpicker_minute_label" id="ui_tpicker_minute_label_'+g+'"'+(b.showMinute?"":h)+">"+b.minuteText+"</dt>";if(b.showMinute&&b.minuteGrid>0){i+='<dd class="ui_tpicker_minute ui_tpicker_minute_'+b.minuteGrid+'">'+'<div id="ui_tpicker_minute_'+g+'"'+(b.showMinute?"":h)+"></div>"+'<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';for(var p=b.minuteMin;p<=e;p+=b.minuteGrid){k++;i+="<td>"+(p<10?"0":"")+p+"</td>"}i+="</tr></table></div>"+"</dd>"}else i+='<dd class="ui_tpicker_minute" id="ui_tpicker_minute_'+g+'"'+(b.showMinute?"":h)+"></dd>";i+='<dt class="ui_tpicker_second_label" id="ui_tpicker_second_label_'+g+'"'+(b.showSecond?"":h)+">"+b.secondText+"</dt>";if(b.showSecond&&b.secondGrid>0){i+='<dd class="ui_tpicker_second ui_tpicker_second_'+b.secondGrid+'">'+'<div id="ui_tpicker_second_'+g+'"'+(b.showSecond?"":h)+"></div>"+'<div style="padding-left: 1px"><table><tr>';for(var q=b.secondMin;q<=f;q+=b.secondGrid){l++;i+="<td>"+(q<10?"0":"")+q+"</td>"}i+="</tr></table></div>"+"</dd>"}else i+='<dd class="ui_tpicker_second" id="ui_tpicker_second_'+g+'"'+(b.showSecond?"":h)+"></dd>";i+='<dt class="ui_tpicker_timezone_label" id="ui_tpicker_timezone_label_'+g+'"'+(b.showTimezone?"":h)+">"+b.timezoneText+"</dt>";i+='<dd class="ui_tpicker_timezone" id="ui_tpicker_timezone_'+g+'"'+(b.showTimezone?"":h)+"></dd>";i+="</dl></div>";$tp=$(i);if(b.timeOnly===true){$tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">'+'<div class="ui-datepicker-title">'+b.timeOnlyTitle+"</div>"+"</div>");a.find(".ui-datepicker-header, .ui-datepicker-calendar").hide()}this.hour_slider=$tp.find("#ui_tpicker_hour_"+g).slider({orientation:"horizontal",value:this.hour,min:b.hourMin,max:d,step:b.stepHour,slide:function(a,b){c.hour_slider.slider("option","value",b.value);c._onTimeChange()}});this.minute_slider=$tp.find("#ui_tpicker_minute_"+g).slider({orientation:"horizontal",value:this.minute,min:b.minuteMin,max:e,step:b.stepMinute,slide:function(a,b){c.minute_slider.slider("option","value",b.value);c._onTimeChange()}});this.second_slider=$tp.find("#ui_tpicker_second_"+g).slider({orientation:"horizontal",value:this.second,min:b.secondMin,max:f,step:b.stepSecond,slide:function(a,b){c.second_slider.slider("option","value",b.value);c._onTimeChange()}});this.timezone_select=$tp.find("#ui_tpicker_timezone_"+g).append("<select></select>").find("select");$.fn.append.apply(this.timezone_select,$.map(b.timezoneList,function(a,b){return $("<option />").val(typeof a=="object"?a.value:a).text(typeof a=="object"?a.label:a)}));this.timezone_select.val(typeof this.timezone!="undefined"&&this.timezone!=null&&this.timezone!=""?this.timezone:b.timezone);this.timezone_select.change(function(){c._onTimeChange()});if(b.showHour&&b.hourGrid>0){m=100*j*b.hourGrid/(d-b.hourMin);$tp.find(".ui_tpicker_hour table").css({width:m+"%",marginLeft:m/(-2*j)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){var a=$(this).html();if(b.ampm){var d=a.substring(2).toLowerCase(),e=parseInt(a.substring(0,2),10);if(d=="a"){if(e==12)a=0;else a=e}else if(e==12)a=12;else a=e+12}c.hour_slider.slider("option","value",a);c._onTimeChange();c._onSelectHandler()}).css({cursor:"pointer",width:100/j+"%",textAlign:"center",overflow:"hidden"})})}if(b.showMinute&&b.minuteGrid>0){m=100*k*b.minuteGrid/(e-b.minuteMin);$tp.find(".ui_tpicker_minute table").css({width:m+"%",marginLeft:m/(-2*k)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){c.minute_slider.slider("option","value",$(this).html());c._onTimeChange();c._onSelectHandler()}).css({cursor:"pointer",width:100/k+"%",textAlign:"center",overflow:"hidden"})})}if(b.showSecond&&b.secondGrid>0){$tp.find(".ui_tpicker_second table").css({width:m+"%",marginLeft:m/(-2*l)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){c.second_slider.slider("option","value",$(this).html());c._onTimeChange();c._onSelectHandler()}).css({cursor:"pointer",width:100/l+"%",textAlign:"center",overflow:"hidden"})})}var r=a.find(".ui-datepicker-buttonpane");if(r.length)r.before($tp);else a.append($tp);this.$timeObj=$tp.find("#ui_tpicker_time_"+g);if(this.inst!==null){var s=this.timeDefined;this._onTimeChange();this.timeDefined=s}var t=function(){c._onSelectHandler()};this.hour_slider.bind("slidestop",t);this.minute_slider.bind("slidestop",t);this.second_slider.bind("slidestop",t)}},_limitMinMaxDateTime:function(a,b){var c=this._defaults,d=new Date(a.selectedYear,a.selectedMonth,a.selectedDay);if(!this._defaults.showTimepicker)return;if($.datepicker._get(a,"minDateTime")!==null&&d){var e=$.datepicker._get(a,"minDateTime"),f=new Date(e.getFullYear(),e.getMonth(),e.getDate(),0,0,0,0);if(this.hourMinOriginal===null||this.minuteMinOriginal===null||this.secondMinOriginal===null){this.hourMinOriginal=c.hourMin;this.minuteMinOriginal=c.minuteMin;this.secondMinOriginal=c.secondMin}if(a.settings.timeOnly||f.getTime()==d.getTime()){this._defaults.hourMin=e.getHours();if(this.hour<=this._defaults.hourMin){this.hour=this._defaults.hourMin;this._defaults.minuteMin=e.getMinutes();if(this.minute<=this._defaults.minuteMin){this.minute=this._defaults.minuteMin;this._defaults.secondMin=e.getSeconds()}else{if(this.second<this._defaults.secondMin)this.second=this._defaults.secondMin;this._defaults.secondMin=this.secondMinOriginal}}else{this._defaults.minuteMin=this.minuteMinOriginal;this._defaults.secondMin=this.secondMinOriginal}}else{this._defaults.hourMin=this.hourMinOriginal;this._defaults.minuteMin=this.minuteMinOriginal;this._defaults.secondMin=this.secondMinOriginal}}if($.datepicker._get(a,"maxDateTime")!==null&&d){var g=$.datepicker._get(a,"maxDateTime"),h=new Date(g.getFullYear(),g.getMonth(),g.getDate(),0,0,0,0);if(this.hourMaxOriginal===null||this.minuteMaxOriginal===null||this.secondMaxOriginal===null){this.hourMaxOriginal=c.hourMax;this.minuteMaxOriginal=c.minuteMax;this.secondMaxOriginal=c.secondMax}if(a.settings.timeOnly||h.getTime()==d.getTime()){this._defaults.hourMax=g.getHours();if(this.hour>=this._defaults.hourMax){this.hour=this._defaults.hourMax;this._defaults.minuteMax=g.getMinutes();if(this.minute>=this._defaults.minuteMax){this.minute=this._defaults.minuteMax;this._defaults.secondMax=g.getSeconds()}else{if(this.second>this._defaults.secondMax)this.second=this._defaults.secondMax;this._defaults.secondMax=this.secondMaxOriginal}}else{this._defaults.minuteMax=this.minuteMaxOriginal;this._defaults.secondMax=this.secondMaxOriginal}}else{this._defaults.hourMax=this.hourMaxOriginal;this._defaults.minuteMax=this.minuteMaxOriginal;this._defaults.secondMax=this.secondMaxOriginal}}if(b!==undefined&&b===true){var i=(this._defaults.hourMax-this._defaults.hourMax%this._defaults.stepHour).toFixed(0),j=(this._defaults.minuteMax-this._defaults.minuteMax%this._defaults.stepMinute).toFixed(0),k=(this._defaults.secondMax-this._defaults.secondMax%this._defaults.stepSecond).toFixed(0);if(this.hour_slider)this.hour_slider.slider("option",{min:this._defaults.hourMin,max:i}).slider("value",this.hour);if(this.minute_slider)this.minute_slider.slider("option",{min:this._defaults.minuteMin,max:j}).slider("value",this.minute);if(this.second_slider)this.second_slider.slider("option",{min:this._defaults.secondMin,max:k}).slider("value",this.second)}},_onTimeChange:function(){var a=this.hour_slider?this.hour_slider.slider("value"):false,b=this.minute_slider?this.minute_slider.slider("value"):false,c=this.second_slider?this.second_slider.slider("value"):false,d=this.timezone_select?this.timezone_select.val():false;if(typeof a=="object")a=false;if(typeof b=="object")b=false;if(typeof c=="object")c=false;if(typeof d=="object")d=false;if(a!==false)a=parseInt(a,10);if(b!==false)b=parseInt(b,10);if(c!==false)c=parseInt(c,10);var e=a<12?"AM":"PM";var f=a!=this.hour||b!=this.minute||c!=this.second||this.ampm.length>0&&this.ampm!=e||d!=this.timezone;if(f){if(a!==false)this.hour=a;if(b!==false)this.minute=b;if(c!==false)this.second=c;if(d!==false)this.timezone=d;if(!this.inst)this.inst=$.datepicker._getInst(this.$input[0]);this._limitMinMaxDateTime(this.inst,true)}if(this._defaults.ampm)this.ampm=e;this._formatTime();if(this.$timeObj)this.$timeObj.text(this.formattedTime+this._defaults.timeSuffix);this.timeDefined=true;if(f)this._updateDateTime()},_onSelectHandler:function(){var a=this._defaults["onSelect"];var b=this.$input?this.$input[0]:null;if(a&&b){a.apply(b,[this.formattedDateTime,this])}},_formatTime:function(a,b,c){if(c==undefined)c=this._defaults.ampm;a=a||{hour:this.hour,minute:this.minute,second:this.second,ampm:this.ampm,timezone:this.timezone};var d=b||this._defaults.timeFormat.toString();if(c){var e=a.ampm=="AM"?a.hour:a.hour%12;e=Number(e)===0?12:e;d=d.toString().replace(/hh/g,(e<10?"0":"")+e).replace(/h/g,e).replace(/mm/g,(a.minute<10?"0":"")+a.minute).replace(/m/g,a.minute).replace(/ss/g,(a.second<10?"0":"")+a.second).replace(/s/g,a.second).replace(/TT/g,a.ampm.toUpperCase()).replace(/Tt/g,a.ampm.toUpperCase()).replace(/tT/g,a.ampm.toLowerCase()).replace(/tt/g,a.ampm.toLowerCase()).replace(/T/g,a.ampm.charAt(0).toUpperCase()).replace(/t/g,a.ampm.charAt(0).toLowerCase()).replace(/z/g,a.timezone)}else{d=d.toString().replace(/hh/g,(a.hour<10?"0":"")+a.hour).replace(/h/g,a.hour).replace(/mm/g,(a.minute<10?"0":"")+a.minute).replace(/m/g,a.minute).replace(/ss/g,(a.second<10?"0":"")+a.second).replace(/s/g,a.second).replace(/z/g,a.timezone);d=$.trim(d.replace(/t/gi,""))}if(arguments.length)return d;else this.formattedTime=d},_updateDateTime:function(a){a=this.inst||a,dt=new Date(a.selectedYear,a.selectedMonth,a.selectedDay),dateFmt=$.datepicker._get(a,"dateFormat"),formatCfg=$.datepicker._getFormatConfig(a),timeAvailable=dt!==null&&this.timeDefined;this.formattedDate=$.datepicker.formatDate(dateFmt,dt===null?new Date:dt,formatCfg);var b=this.formattedDate;if(a.lastVal!==undefined&&a.lastVal.length>0&&this.$input.val().length===0)return;if(this._defaults.timeOnly===true){b=this.formattedTime}else if(this._defaults.timeOnly!==true&&(this._defaults.alwaysSetTime||timeAvailable)){b+=this._defaults.separator+this.formattedTime+this._defaults.timeSuffix}this.formattedDateTime=b;if(!this._defaults.showTimepicker){this.$input.val(this.formattedDate)}else if(this.$altInput&&this._defaults.altFieldTimeOnly===true){this.$altInput.val(this.formattedTime);this.$input.val(this.formattedDate)}else if(this.$altInput){this.$altInput.val(b);this.$input.val(b)}else{this.$input.val(b)}this.$input.trigger("change")}});$.fn.extend({timepicker:function(a){a=a||{};var b=arguments;if(typeof a=="object")b[0]=$.extend(a,{timeOnly:true});return $(this).each(function(){$.fn.datetimepicker.apply($(this),b)})},datetimepicker:function(a){a=a||{};var b=this,c=arguments;if(typeof a=="string"){if(a=="getDate")return $.fn.datepicker.apply($(this[0]),c);else return this.each(function(){var a=$(this);a.datepicker.apply(a,c)})}else return this.each(function(){var b=$(this);b.datepicker($.timepicker._newInst(b,a)._defaults)})}});$.datepicker._base_selectDate=$.datepicker._selectDate;$.datepicker._selectDate=function(a,b){var c=this._getInst($(a)[0]),d=this._get(c,"timepicker");if(d){d._limitMinMaxDateTime(c,true);c.inline=c.stay_open=true;this._base_selectDate(a,b+d._defaults.separator+d.formattedTime+d._defaults.timeSuffix);c.inline=c.stay_open=false;this._notifyChange(c);this._updateDatepicker(c)}else this._base_selectDate(a,b)};$.datepicker._base_updateDatepicker=$.datepicker._updateDatepicker;$.datepicker._updateDatepicker=function(a){var b=a.input[0];if($.datepicker._curInst&&$.datepicker._curInst!=a&&$.datepicker._datepickerShowing&&$.datepicker._lastInput!=b){return}if(typeof a.stay_open!=="boolean"||a.stay_open===false){this._base_updateDatepicker(a);var c=this._get(a,"timepicker");if(c)c._addTimePicker(a)}};$.datepicker._base_doKeyPress=$.datepicker._doKeyPress;$.datepicker._doKeyPress=function(a){var b=$.datepicker._getInst(a.target),c=$.datepicker._get(b,"timepicker");if(c){if($.datepicker._get(b,"constrainInput")){var d=c._defaults.ampm,e=$.datepicker._possibleChars($.datepicker._get(b,"dateFormat")),f=c._defaults.timeFormat.toString().replace(/[hms]/g,"").replace(/TT/g,d?"APM":"").replace(/Tt/g,d?"AaPpMm":"").replace(/tT/g,d?"AaPpMm":"").replace(/T/g,d?"AP":"").replace(/tt/g,d?"apm":"").replace(/t/g,d?"ap":"")+" "+c._defaults.separator+c._defaults.timeSuffix+(c._defaults.showTimezone?c._defaults.timezoneList.join(""):"")+e,g=String.fromCharCode(a.charCode===undefined?a.keyCode:a.charCode);return a.ctrlKey||g<" "||!e||f.indexOf(g)>-1}}return $.datepicker._base_doKeyPress(a)};$.datepicker._base_doKeyUp=$.datepicker._doKeyUp;$.datepicker._doKeyUp=function(a){var b=$.datepicker._getInst(a.target),c=$.datepicker._get(b,"timepicker");if(c){if(c._defaults.timeOnly&&b.input.val()!=b.lastVal){try{$.datepicker._updateDatepicker(b)}catch(d){$.datepicker.log(d)}}}return $.datepicker._base_doKeyUp(a)};$.datepicker._base_gotoToday=$.datepicker._gotoToday;$.datepicker._gotoToday=function(a){this._base_gotoToday(a);this._setTime(this._getInst($(a)[0]),new Date)};$.datepicker._disableTimepickerDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");$(a).datepicker("getDate");if(e){e._defaults.showTimepicker=false;e._updateDateTime(d)}};$.datepicker._enableTimepickerDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");$(a).datepicker("getDate");if(e){e._defaults.showTimepicker=true;e._addTimePicker(d);e._updateDateTime(d)}};$.datepicker._setTime=function(a,b){var c=this._get(a,"timepicker");if(c){var d=c._defaults,e=b?b.getHours():d.hour,f=b?b.getMinutes():d.minute,g=b?b.getSeconds():d.second;if(e<d.hourMin||e>d.hourMax||f<d.minuteMin||f>d.minuteMax||g<d.secondMin||g>d.secondMax){e=d.hourMin;f=d.minuteMin;g=d.secondMin}c.hour=e;c.minute=f;c.second=g;if(c.hour_slider)c.hour_slider.slider("value",e);if(c.minute_slider)c.minute_slider.slider("value",f);if(c.second_slider)c.second_slider.slider("value",g);c._onTimeChange();c._updateDateTime(a)}};$.datepicker._setTimeDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");if(e){this._setDateFromField(d);var f;if(b){if(typeof b=="string"){e._parseTime(b,c);f=new Date;f.setHours(e.hour,e.minute,e.second)}else f=new Date(b.getTime());if(f.toString()=="Invalid Date")f=undefined;this._setTime(d,f)}}};$.datepicker._base_setDateDatepicker=$.datepicker._setDateDatepicker;$.datepicker._setDateDatepicker=function(a,b){var c=this._getInst(a),d=b instanceof Date?new Date(b.getTime()):b;this._updateDatepicker(c);this._base_setDateDatepicker.apply(this,arguments);this._setTimeDatepicker(a,d,true)};$.datepicker._base_getDateDatepicker=$.datepicker._getDateDatepicker;$.datepicker._getDateDatepicker=function(a,b){var c=this._getInst(a),d=this._get(c,"timepicker");if(d){this._setDateFromField(c,b);var e=this._getDate(c);if(e&&d._parseTime($(a).val(),d.timeOnly))e.setHours(d.hour,d.minute,d.second);return e}return this._base_getDateDatepicker(a,b)};$.datepicker._base_parseDate=$.datepicker.parseDate;$.datepicker.parseDate=function(a,b,c){var d;try{d=this._base_parseDate(a,b,c)}catch(e){d=this._base_parseDate(a,b.substring(0,b.length-(e.length-e.indexOf(":")-2)),c)}return d};$.datepicker._base_optionDatepicker=$.datepicker._optionDatepicker;$.datepicker._optionDatepicker=function(a,b,c){this._base_optionDatepicker(a,b,c);var d=this._getInst(a),e=this._get(d,"timepicker");if(e){if(b==="minDate"){if(e._defaults.minDate!==undefined&&e._defaults.minDate instanceof Date)e._defaults.minDateTime=new Date(c);if(e._defaults.minDateTime!==undefined&&e._defaults.minDateTime instanceof Date)e._defaults.minDate=new Date(e._defaults.minDateTime.getTime());e._limitMinMaxDateTime(d,true)}if(b==="maxDate"){if(e._defaults.maxDate!==undefined&&e._defaults.maxDate instanceof Date)e._defaults.maxDateTime=new Date(c);if(e._defaults.maxDateTime!==undefined&&e._defaults.maxDateTime instanceof Date)e._defaults.maxDate=new Date(e._defaults.maxDateTime.getTime());e._limitMinMaxDateTime(d,true)}}};$.timepicker=new Timepicker;$.timepicker.version="0.9.6"})(jQuery)