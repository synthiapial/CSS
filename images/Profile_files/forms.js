/*°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸


  Licensed Materials - Property of IBM5725-N92© Copyright IBM Corp.
  2014, 2017.US Government Users Restricted Rights- Use,
  duplication or disclosure restricted by GSA ADP Schedule Contract  with IBM Corp.
  

°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸*/

/*
// NoComment PRESERVE START
*/

window.initFormsMethods = function () {

    var isMobile = false;
    var errormsgs = "";
    var draftMode = false;
    var calcFailed = false;
    var confirmCalc = false;
    var reroutefields = {};
    var reroutecompfields = {};
    var rerouteconf = false;
    var btnClicked = false;
    var bdg;
    var ajaxresponse;
    var applyMode = false;
    var msgs = {};
    var where = $("input[name='where']").val();
    var hidQBFields = [];
    var faxmlObj = null;
    var formulaFields = [];
    var hasCalcFields = false;
    var prevFAParent = "";
    var faFields = {};

    if ($("input[type='reset']").length > 0) {

        $("input[type='reset']").click();
    }
    msgs = eval('(' + $("#msgs").val() + ')');



    // QUESTION BRANCHING OBJECT START
    var QBObj = {
        checkQBFA: function () {
            $.each($("[enableparent='1']"), function (index, value) {

                if ($(value).attr("qbparent") == "1") {
                    QBObj.showChild(value);
                }


            });

            $.each($("[qbparent='1'][enableparent='0']"), function (index, value) {

                QBObj.showChild(value);

            });
        },
        displayQBChildren: function (obj, type, hide) {

            if (type == "select") {
                var qbchildren = "";
                $(obj).find("option:selected").each(function () { if (qbchildren.indexOf("," + $(this).attr("qbchildren") + ",") == -1) qbchildren += ("," + $(this).attr("qbchildren") + ",") });

                var prevqbchildren = "";
                if ($(obj).attr("prevval") && $(obj).attr("prevval") != "") {
                    $.each($(obj).attr("prevval").split(","), function (index, value) { var qbopt = $(obj).find("option[value='" + value + "']").first().attr("qbchildren"); if (prevqbchildren.indexOf("," + qbopt + ",") == -1) prevqbchildren += ("," + qbopt + ",") })
                }

                qbchildren = typeof qbchildren != "undefined" && !hide ? qbchildren.split(',') : [];
                prevqbchildren = typeof prevqbchildren != "undefined" ? prevqbchildren.split(',') : [];
                $(obj).attr("prevval", $(obj).val());

                this.executeQB(prevqbchildren, qbchildren);

            }
            else {

                var qbchildren = "";
                var controlVal = "";
                $("input[name='" + $(obj).attr("name") + "']:checked").each(function () { if (qbchildren.indexOf("," + $(this).attr("qbchildren") + ",") == -1) qbchildren += ("," + $(this).attr("qbchildren") + ","); controlVal += ("," + $(this).val()); });

                var prevqbchildren = "";
                if ($(obj).attr("prevval") && $(obj).attr("prevval") != "") {
                    $.each($(obj).attr("prevval").split(","), function (index, value) { if (value != "") { var qbopt = $("[name=" + $(obj).attr('name') + "][value='" + value + "']").first().attr("qbchildren"); if (prevqbchildren.indexOf("," + qbopt + ",") == -1) prevqbchildren += ("," + qbopt + ","); } })
                }

                qbchildren = typeof qbchildren != "undefined" && !hide ? qbchildren.split(',') : [];
                prevqbchildren = typeof prevqbchildren != "undefined" ? prevqbchildren.split(',') : [];


                $("[name='" + $(obj).attr("name") + "']").each(function (index, value) {
                    $(value).attr("prevval", controlVal);


                });

                this.executeQB(prevqbchildren, qbchildren);
            }


        },
        executeQB: function (prevqbchildren, qbchildren) {

            $.each(prevqbchildren, function (index, value) {
                if (value != "" && value != "undefined") {
                    if ($("[name*='" + value + "']").length == 0) return;
                    var $childControl;
                    if ($("[name*='" + value + "']").attr("name").match(/jsq/g))
                        $childControl = $("[name*='jsq-" + value + "_']");
                    else if ($("[name*='" + value + "']").attr("name").match(/profile_-/g)) {
                        $childControl = $("[name*='profile_" + value + "_']");
                        if ($childControl.attr("name").match(/profile_-5_/g)) {
                            $("[name*='profile_-3_']").val($childControl.val());
                        }
                        else if ($childControl.attr("name").match(/profile_-3_/g)) {
                            $("[name*='profile_-5_']").val($childControl.val());
                        }
                    }
                    else
                        $childControl = $("[name*='custom_" + value + "_']");

                    if ($childControl.attr("name").match(/lbl/g)) {
                        $childControl.parent().addClass("hiddenQB");

                    }
                    else {
                        $childControl.closest(".fieldcontain").addClass("hiddenQB");
                    }
                    QBObj.updateQBArr($childControl, "hide");
                    if ($childControl.attr("qbparent") == "1")
                        QBObj.displayQBChildren($childControl, $childControl.prop("tagName").toLowerCase(), true);
                }
            });
            $.each(qbchildren, function (index, value) {
                if (value != "" && value != "undefined") {
                    if ($("[name*='" + value + "']").length == 0) return;
                    var $childControl;
                    if ($("[name*='" + value + "']").attr("name").match(/jsq/g))
                        $childControl = $("[name*='jsq-" + value + "_']");
                    else if ($("[name*='" + value + "']").attr("name").match(/profile_-/g)) {
                        $childControl = $("[name*='profile_" + value + "_']");
                        if ($childControl.attr("name").match(/profile_-5_/g)) {
                            $("[name*='profile_-3_']").val($childControl.val());
                        }
                        else if ($childControl.attr("name").match(/profile_-3_/g)) {
                            $("[name*='profile_-5_']").val($childControl.val());
                        }
                    }
                    else
                        $childControl = $("[name*='custom_" + value + "_']");

                    if ($childControl.attr("name").match(/lbl/g)) {
                        $childControl.parent().removeClass("hiddenQB");
                    }
                    else {

                        $childControl.closest(".fieldcontain").removeClass("hiddenQB");
                    }

                    if (typeof $childControl.closest(".fieldcontain").css("background-color") != "undefined" && !$childControl.closest(".fieldcontain").css("background-color").match(/255/gi)) {
                        $childControl.closest(".fieldcontain").effect("highlight", {}, 0);
                    }
                    QBObj.updateQBArr($childControl, "show");
                    if ($childControl.attr("qbparent") == "1")
                        QBObj.displayQBChildren($childControl, $childControl.prop("tagName").toLowerCase(), false);
                }
            });

        },
        loadQBSections: function () {
            $.each($("#hidSections").val().split(","), function (index, value) {
                if (value != "") {
                    $("#" + value).css({ "display": "none" });
                }
            });
            if ($("#hidQB").length > 0) {
                hidQBFields = $("#hidQB").val().split(",");
            }

        },
        updateQBArr: function (obj, mode) {
            var qid = obj.attr("name").split("_")[1];
            var qindex = $.inArray(qid, hidQBFields);
            if (qindex != -1 && mode == "show") {
                hidQBFields.splice(qindex, 1);
            }
            else if (qindex == -1 && mode == "hide") {
                hidQBFields.push(qid);
            }

        },
        showQBSections: function () {
            $.each($("div[id*='ls_']"), function (index, value) {
                var show = false;

                $(value).find("div.fieldcontain,h3").each(function (i, v) {

                    var $vobj = $(v).parent().hasClass("ui-bar-d") ? $(v).parent() : $(v);
                    if ($vobj.css("display") == "block" || $vobj.css("display") == "inline-block" || $vobj.css("display") == "inline") {
                        $(value).css({ "display": "block" });
                        show = true;
                        return false;
                    }

                });


                if (!show) {
                    $(value).css({ "display": "none" });
                }

            });
        },
        showChild: function (obj) {

            if ($(obj).prop("tagName").toLowerCase() == "select") {
                $(obj).attr("prevval", $(obj).val());
                $(obj).change(function () {

                    QBObj.displayQBChildren(obj, "select");
                });
            } else {
                var controlVal = "";
                $("input[name='" + $(obj).attr("name") + "']:checked").each(function () { controlVal += ("," + $(this).val()); });
                $(obj).attr("prevval", controlVal);
                $(obj).click(function () {
                    QBObj.displayQBChildren(obj, "radiocheckbox");

                });

            }


        }
    }
    // QUESTION BRANCHING OBJECT END

    QBObj.checkQBFA();

    //FA OBJECT START
    var FAObj = {
        serialize: function () {
            var result = "";

            for (var k in faFields) {

                if (typeof k.query != "undefined" && k.query != "") {
                    result += ("&" + k + "-query=" + k.query);
                }
                result += ("&" + k + "=");
                if (typeof k.responses != "undefined" && k.responses.length > 0) {
                    result += ("&" + k + "-query=" + k.query);
                }

            }
        },

        makeFACall: function (fieldData) {
            var fieldDel = '~|~';
            var nmValDel = '_|_';
            var pval = "";
            var mselval = "";
            var aqid = "";

            $.each($("[enableparent='1']"), function (index, value) {
                if ($(value).attr("type") == "radio" || $(value).attr("type") == "checkbox") {

                    if (pval.indexOf($(value).attr("name")) == -1) {
                        pval += fieldDel + $(value).attr("name") + nmValDel;
                        if ($(value).is(":checked")) {
                            pval += $(value).val();
                        }
                        aqid += fieldDel + $(value).attr("name");
                    }
                    else if ($(value).is(":checked")) {
                        pval += $(value).val();

                    }
                }
                else {
                    var fieldVal = "";
                    $(value).find("option:selected").each(function (index, value) { fieldVal += ($(this).val()) });
                    pval += fieldDel + $(value).attr("name") + nmValDel + fieldVal;
                    aqid += fieldDel + $(value).attr("name");
                }
            });

            $.each($("[enablechild='1']"), function (index, value) {
                if ($(value).attr("type") == "radio" || $(value).attr("type") == "checkbox") {

                    if (mselval.indexOf($(value).attr("name")) == -1) {
                        mselval += fieldDel + $(value).attr("name") + nmValDel;
                        if ($(value).is(":checked")) {
                            mselval += $(value).val();

                        }
                        aqid += fieldDel + $(value).attr("name");
                    }
                    else if ($(value).is(":checked")) {
                        mselval += $(value).val();

                    }
                }
                else {
                    var fieldVal = "";
                    $(value).find("option:selected").each(function (index, value) { fieldVal += ($(this).val()) });
                    mselval += fieldDel + $(value).attr("name") + nmValDel + fieldVal;
                    aqid += fieldDel + $(value).attr("name");
                }
            });

            fieldData.pval = pval;
            fieldData.mselval = mselval;
            fieldData.aqid = aqid;
            fieldData.pnval = fieldData.pnval.replace("&", "^amp^");
            var $pnobj = $("[name='" + fieldData.pnm + "']");
            if ($("#loadingajax").length == 0) {
                if ($pnobj.prop("tagName").toLowerCase() == "select") {
                    $pnobj.before('<span id="loadingajax" class="ui-autocomplete-loading"></span>');
                }
                else if ($pnobj.prop("tagName").toLowerCase() == "input") {
                    $pnobj.closest(".ui-controlgroup-controls").after('<span id="loadingajax" class="ui-autocomplete-loading"></span>');
                }
            }
            $.ajax({
                type: "POST",
                url: "/FieldAssociations.UserInterface/FieldAssocGateway.aspx",
                data: fieldData,
                crossdomain: true
            }).then(function (response) {
                if (prevFAParent == fieldData.pnm) {
                    faxmlObj = response;
                }
                $("#save").css({ "visibility": "hidden" });
                $(response).children("faquestions").attr("pnm", fieldData.pnm);

                processFAResponse(response, "useract");
                $("#save").css({ "visibility": "visible" });
                $("#loadingajax").remove();
            });

        },


        faResponse: function processFAResponse(response, mode) {
            hasCalcFields = false;
            var pageMode = document.location.href.match(/add/gi) && mode == "load" ? "add" : "";
            $(response).children("faquestions").children("question").each(function () {

                var questionid = $(this).attr("QuestionID");
                var seltype = $(this).attr("selecttype");
                var type = $(this).attr("fieldtype");

                if ((mode == "load" && (type != "text" && type != "numeric" && pageMode != "add")) || ($("[name*='_" + questionid + "_']").length == 0)) {
                    return;
                }

                var $control = $("[name*='_" + questionid + "_']").first();
                var controltype = $control.attr("type") ? $control.attr("type") : "";
                type = (controltype == "hidden" ? controltype : type);
                var name = $control.attr("name");
                var qbparent = typeof $control.attr("qbparent") != "undefined" ? " qbparent='" + $control.attr("qbparent") + "'" : "";
                var enableparent = typeof $control.attr("enableparent") != "undefined" ? " enableparent='" + $control.attr("enableparent") + "'" : "";
                var enablechild = typeof $control.attr("enablechild") != "undefined" ? " enablechild='" + $control.attr("enablechild") + "'" : "";
                var $container = $control.closest(".fieldcontain");
                var html = "";
                faFields[name] = {};
                faFields[name].responses = [];
                switch (type) {
                    case "single-select":
                    case "multi-select":
                    case "query-select":
                        html += "<option value=''>Choose..</option>";
                        if ($(this).find("query1").length > 0) {


                            var qbchildren = $(this).find("qbchildren").text().length > 0 ? " qbchildren='" + $(this).find("qbchildren").text() + "'" : [];
                            var selectedvalues = $(this).find("selectedvalues").text().split(",");
                            var selecteddescriptions = $(this).find("selecteddescriptions").length > 0 ? $(this).find("selecteddescriptions").text().split(",") : selectedvalues;
                            var keyval = {};
                            $.each(selecteddescriptions, function (index, value) {
                                var arrvals = value.split("^|^");
                                var val = (arrvals.length > 1 ? arrvals[1] : arrvals[0]).replace("#@#", "");
                                var key = arrvals[0];
                                keyval[key] = val;
                            });
                            if (typeof selectedvalues != "undefined") {

                                $.each(selectedvalues, function (index, value) {

                                    if (value != "") {
                                        var selected = " selected";
                                        var desc = keyval[$.trim(value.replace("#@#", ""))];

                                        html += "<option value='" + $.trim(value).replace(/'/g, "&#39;") + "'" + selected + qbchildren + ">" + desc + "</value>";
                                        var $searchControl = $("#" + $control.attr("name") + "-input");
                                        if ($searchControl.length > 0) {

                                            if (seltype != "multi-select" && type != "multi-select") {
                                                $searchControl.val(desc);
                                            }
                                        }
                                        faFields[name].respones.push(value);
                                    }
                                });
                            }

                        }
                        else {
                            if (pageMode == "add") {

                                $(this).children("option[selected='true']").each(function (index, value) {

                                    var $controlopt = $control.find("option[value='" + $(value).attr("code") + "']");
                                    if ($controlopt.length > 0) {
                                        $controlopt.prop("selected", true);
                                    }
                                });
                            }
                            else {
                                $(this).children("option").each(function (index, value) {

                                    var selected = $(value).attr("selected") == "true" ? " selected" : "";
                                    var qbchildren = typeof $(value).attr("qbchildren") != "undefined" ? " qbchildren='" + $(value).attr("qbchildren") + "'" : "";
                                    html += "<option value='" + $(value).attr("code").replace(/'/g, "&#39;") + "'" + selected + qbchildren + ">" + $(value).attr("optiondesc") + "</value>";
                                });

                            }
                        }
                        if (pageMode != "add" || $(this).find("query1").length > 0) {
                            $control.html(html);
                        }
                        if (seltype != "multi-select" && type != "multi-select" && $(this).find("query1").length == 0 && isMobile) {

                            $control.selectmenu().selectmenu("refresh");;

                        }


                        if (typeof $control.attr("multiple") != "undefined") {
                            if (!isMobile) {
                                var $group = $control.closest(".fieldcontain").find("fieldset");

                                if ($group.length > 0) {
                                    updateMultiSS($group, $control);
                                }
                            }
                            else {
                                $control.selectmenu().selectmenu("refresh");
                            }
                        }


                        if ($control.parent().css('display') == "block")
                            displayQBChildren($control, "select");


                        break;
                    case "checkbox":
                    case "radio":
                        var $group = $control.parent().parent().parent();
                        if (pageMode != "add") {
                            if ($control.attr("qbparent") == "1") {
                                $("input[name='" + name + "']:checked").each(function () { $(this).prop('checked', false); });
                                displayQBChildren($control, "checkboxradio");
                            }
                            $control.parent().parent().empty();
                        }
                        if (pageMode == "add") {
                            $(this).children("option[selected='true']").each(function (index, value) {
                                var $controlopt = $group.find("input[value='" + $(value).attr("code") + "']");
                                if ($controlopt.length > 0) {
                                    $controlopt.prop("checked", true).checkboxradio().checkboxradio('refresh');
                                }
                            });
                        }
                        else {
                            $(this).children("option").each(function (index, value) {

                                var checked = $(value).attr("selected") == "true" ? " checked" : "";
                                var qbchildren = typeof $(value).attr("qbchildren") != "undefined" ? " qbchildren='" + $(value).attr("qbchildren") + "'" : "";

                                html += "<input type='" + type + "' value='" + $(value).attr("code") + "'" + checked + qbchildren + qbparent + enableparent + enablechild + " name='" + name + "' id='" + name + "-" + $(value).attr("code") + "' crb='true'>";
                                html += "<label for='" + name + "-" + $(value).attr("code") + "'>" + $(value).attr("optiondesc") + "</label>";
                            });
                        }

                        if (pageMode != "add") {

                            $group.controlgroup().controlgroup("container").append(html);
                        }
                        $group.controlgroup().enhanceWithin().controlgroup("refresh");


                        if ($control.attr("enableparent") == "1") {

                            $($group).find("input").each(function (index, value) {
                                if (pageMode != "add") {

                                    if ($control.attr("qbparent") == "1") {
                                        showChild(value);
                                    }
                                    $(value).click(function () {
                                        var data = { pnm: $(value).attr("name"), pnval: $(value).val(), src: "usract", pval: "", aqid: "", ftid: $("input[name='formtypeid']").val(), lang: $("input[name='flanguage']").val(), mselval: "" };
                                        makeFACall(data);

                                    });
                                }
                                if ($control.attr("qbparent") == "1" && $(value).is(":checked") && $group.parent().css('display') == "block") {
                                    displayQBChildren($(value), "checkboxradio");
                                    $(value).prop('checked', true).checkboxradio('refresh');
                                }

                            });


                        }
                        else if ($control.attr("qbparent") == "1") {
                            $($group).find("input").each(function (index, value) {
                                if (pageMode != "add") {
                                    showChild(value);
                                }
                                if ($(value).is(":checked") && $group.parent().css('display') == "block") {
                                    displayQBChildren($(value), "checkboxradio");
                                    $(value).prop('checked', true).checkboxradio('refresh');
                                }

                            });
                        }


                        break;
                    case "text":
                    case "textarea":
                    case "numeric":
                    case "email":
                    case "ssn":
                        $(this).children("option").each(function (index, value) {
                            var $opt = $(response).children("faquestions").children("option[questionid='" + questionid + "']");
                            if ($opt.length > 0) {
                                $opt.attr("dbfieldname", $(value).parent().attr("dbfieldname"));
                                $opt.attr("fieldtype", $(value).parent().attr("fieldtype"));
                            }
                            var res = calculate($opt.length > 0 ? $opt : value, response, "load");

                            $control.val(res);
                            if ($control.prop("tagName").toLowerCase() == "textarea" && $("#" + $control.attr("id") + "-input").length > 0) {
                                $("#" + $control.attr("id") + "-input").html(res);
                            }
                            $control.valid();


                        });
                        if ($(this).children("option").length == 0 && mode != "load") {
                            $control.val("");
                            if ($control.prop("tagName").toLowerCase() == "textarea" && $("#" + $control.attr("id") + "-input").length > 0) {
                                $("#" + $control.attr("id") + "-input").html("");
                            }
                            $control.rules("remove", "calcvalidation");
                            $control.valid();
                        }
                        break;
                    case "hidden":

                        $(this).children("option").each(function (index, value) {

                            if (typeof $(value).attr("code") != "undefined" && typeof $(value).attr("selected") != "undefined" && $(value).attr("selected") == "true") {
                                if ($control.length > 0) {
                                    $control.parent().find('.lblview').html((index > 0 ? ($control.parent().find('.lblview').html() + "<br/>") : "") + $(value).attr("optiondesc"));
                                    $control.val((index > 0 ? ($control.val()) : "") + $(value).attr("code"));
                                }
                                else
                                    faFields[name].responses.push($(value).attr("code"));
                            }
                            else {
                                var $opt = $(response).children("faquestions").children("option[questionid='" + questionid + "']");
                                if ($opt.length > 0) {
                                    $opt.attr("dbfieldname", $(value).parent().attr("dbfieldname"));
                                    $opt.attr("fieldtype", $(value).parent().attr("fieldtype"));
                                }
                                var res = calculate($opt.length > 0 ? $opt : value, response, "load");
                                if ($control.length > 0) {
                                    $control.parent().find('.lblview').html(res);
                                    $control.val(res);
                                    $control.valid();
                                }
                                else
                                    faFields[name].responses.push(res);
                            }
                        });
                        if ($(this).children("option").length == 0 && mode != "load") {
                            $control.val("");
                            $control.parent().find('.lblview').html("");
                            $control.rules("remove", "calcvalidation");
                            $control.valid();
                        }
                        break;

                }
                if (($container.css("display") == "block" || $container.css("display") == "inline-block") && typeof $container.css("background-color") != "undefined" && !$container.css("background-color").match(/255/gi)) {
                    $container.effect("highlight", {}, 2000);
                }
            });

            processCalculatedFields(response);

        },

        calculateXml: function updateCalcFAXml(response) {
            $(response).find("option[formula]").each(function (index, value) {
                $(value).text($(value).attr("formula"));
            });
        },
        calculate: function calculate(value, response, mode) {
            var res = "";

            if ($(value).text().match(/@[\w]*@/gi) || $(value).text().match(/#\[/gi)) {
                $("#recalculate").css({ "display": "inline" });
                if (!hasCalcFields) {
                    hasCalcFields = true;
                    faxmlObj = response;
                    prevFAParent = $(response).children("faquestions").attr("pnm");
                }
                if (mode == "load") {
                    $(value).attr("formula", $(value).text());
                }
                var matches = $(value).text().match(/@[\w]*@/gi);
                var fo = {};
                fo.formula = $(value).text().replace("#[", "").replace("]#", "");
                fo.fields = [];
                fo.dbfieldname = $(value).attr("dbfieldname") ? $(value).attr("dbfieldname") : $(value).parent().attr("dbfieldname");
                fo.questionid = $(value).attr("questionid");
                var flg = false;
                var $ff;
                var $opt;

                if (matches != null) {
                    $.each(matches, function (i, v) {
                        v = v.replace(/@/g, "");
                        if ($(response).find("question[dbfieldname='" + v + "']").length > 0) {
                            $ff = $(response).find("question[dbfieldname='" + v + "']");
                            $opt = $(response).children("faquestions").children("option[questionid='" + $ff.attr("QuestionID") + "']");

                            $ff = $opt.length > 0 ? $opt : $ff.children("option").first();
                            if ($ff.text().match(/@[\w]*@/gi)) {
                                fo.fields.push({ field: v, type: "1" });
                                flg = true;
                            }
                            else {
                                var fieldres = $("[dbfieldname='" + v + "']").length > 0 ? $("[dbfieldname='" + v + "']").first().val() : "";
                                var fares = fieldres != "" || $ff.text().match(/#\[/gi) ? fieldres : $ff.text();
                                if (fares != "") {
                                    fo.formula = fo.formula.replace("@" + v + "@", fares);
                                    fo.fields.push({ field: v, type: "2" });
                                }
                                else
                                    flg = true;
                            }

                        }
                        else {
                            var fieldres = $("[dbfieldname='" + v + "']").length > 0 ? $("[dbfieldname='" + v + "']").first().val() : "";

                            if (fieldres != "") {

                                fo.formula = fo.formula.replace("@" + v + "@", fieldres);
                                fo.fields.push({ field: v, type: "3" });

                            }
                            else
                                flg = true;
                        }
                    });
                }

                if (!flg) {
                    var mt = fo.formula.match(/\d*%/gi);

                    if (mt != null && mt.length > 0) {
                        $.each(mt, function (mi, mv) {
                            fo.formula = fo.formula.replace(new RegExp(mv, "gi"), "(" + mv + ")");
                        });
                    }

                    res = fo.formula.replace("%", "/100");
                    var comparefield = "";

                    var fv = "";
                    var fvarr = [];
                    var $field;
                    if (res.match(/max|min|between/gi)) {
                        fvarr = res.split(":");
                        fv = fvarr[0];
                        comparefield = fv.substring(fv.indexOf("(") + 1, fv.indexOf(")"));

                        if (fvarr.length > 1) {
                            res = res.split(":")[1];
                        }
                        else {
                            $field = $("[dbfieldname='" + fo.dbfieldname + "']").first();
                            res = $field.val();
                        }

                    }
                    try {

                        if (res != "") {
                            if ($(value).parent().attr("fieldtype") == "numeric" || $(value).attr("fieldtype") == "numeric") {
                                res = Math.round(eval('(' + res + ')'));
                            }
                            else {
                                res = eval('(' + res + ')');
                            }
                        }
                        if (fv.match(/max/gi)) {
                            if ((parseFloat(res) > parseFloat(comparefield)) || $.trim(res) == "") {
                                flg = true;
                                fo.formula = "#[" + fo.formula + "]#";
                                formulaFields.push(fo);
                                if (fvarr.length > 1 || $.trim(res) == "") {
                                    res = "";
                                }
                                else {
                                    $field.attr("maxcalc", comparefield);
                                }
                            }
                            else {
                                if ($field != null && $field.attr("maxcalc"))
                                    $field.attr("maxcalc", comparefield);
                            }

                        }
                        else if (fv.match(/min/gi)) {
                            if ((parseFloat(res) < parseFloat(comparefield)) || $.trim(res) == "") {
                                flg = true;
                                fo.formula = "#[" + fo.formula + "]#";
                                formulaFields.push(fo);
                                if (fvarr.length > 1 || $.trim(res) == "") {
                                    res = "";
                                }
                                else {
                                    $field.attr("mincalc", comparefield);
                                }
                            }
                            else {
                                if ($field != null && $field.attr("maxcalc"))
                                    $field.attr("mincalc", comparefield);
                            }
                        }
                        else if (fv.match(/between/gi)) {
                            if (!comparefield.match(/,/) || !(parseFloat(res) >= parseFloat(comparefield.split(",")[0]) && parseFloat(res) <= parseFloat(comparefield.split(",")[1])) || $.trim(res) == "") {
                                flg = true;
                                fo.formula = "#[" + fo.formula + "]#";
                                formulaFields.push(fo);
                                if (fvarr.length > 1 || $.trim(res) == "") {
                                    res = "";
                                }
                                else {
                                    $field.attr("betweencalc", comparefield);
                                }
                            }
                            else {
                                if ($field != null && $field.attr("betweencalc"))
                                    $field.attr("betweencalc", comparefield);
                            }
                        }

                    }
                    catch (ex) { res = ""; }
                    if (fv != "" && flg) {
                        $(value).text(fo.formula);
                    }
                    else {
                        $(value).text(res);
                    }

                }
                else {
                    fo.formula = fo.formula.replace("%", "/100");
                    $(value).text(fo.formula);
                    formulaFields.push(fo);
                }

            }
            else {
                res = $(value).text();
            }


            return res;

        },

        processCalculatedFields: function processCalculatedFields(response) {
            var res = "";
            var finalArr = formulaFields.concat([]);
            formulaFields = [];
            $.each(finalArr, function (index, value) {
                var $field = $("[dbfieldname='" + finalArr[index].dbfieldname + "']").first()
                var $opt = $(response).children("faquestions").children("option[questionid='" + finalArr[index].questionid + "']");
                var $question = $opt.length > 0 ? $opt : $(response).find("question[dbfieldname='" + finalArr[index].dbfieldname + "']");

                if ($opt.length > 0 || $question.length > 0) {
                    var $value = $opt.length > 0 ? $opt : $question.children("option");
                    var res = calculate($value, response, "check");
                    if (res != "") {
                        $field.val(res);
                        $field.valid();
                    }
                }
            });

            if (formulaFields.length > 0 && finalArr.length != formulaFields.length) {
                processCalculatedFields(response);
            }
            else {

                if (formulaFields.length > 0) {

                    $.validator.addMethod("calcvalidation", function (value, element, param) {
                        if (value != "" || confirmCalc) {

                            if (!confirmCalc) {
                                var fieldatt = $(element).attr("mincalc") ? "min:" + $(element).attr("mincalc") : ($(element).attr("betweencalc") ? "between:" + $(element).attr("betweencalc") : ($(element).attr("maxcalc") ? "max:" + $(element).attr("maxcalc") : ""));

                                if (fieldatt.match(/min/gi)) {
                                    if (parseFloat(value) < parseFloat(fieldatt.split(":")[1])) {
                                        calcFailed = true;
                                        return false;
                                    }
                                }
                                else if (fieldatt.match(/max/gi)) {

                                    if (parseFloat(value) > parseFloat(fieldatt.split(":")[1])) {
                                        calcFailed = true;
                                        return false;
                                    }
                                }
                                else if (fieldatt.match(/between/gi)) {
                                    var bw = fieldatt.split(":")[1];
                                    var minval = bw.split(",")[0];
                                    var maxval = bw.split(",")[1];
                                    if (!(parseFloat(value) >= minval && parseFloat(value <= maxval))) {
                                        calcFailed = true;
                                        return false;
                                    }
                                }
                            }

                            return true;
                        }
                        else {
                            calcFailed = true;
                            return false;
                        }

                    }, "Calculation/Validation failed");


                    $.each(formulaFields, function (index, value) {
                        var $field = $("[dbfieldname='" + formulaFields[index].dbfieldname + "']").first();
                        $field.rules("add", {
                            calcvalidation: ""
                        });

                        $field.valid();
                    });


                    formulaFields = [];
                }

            }

            if (hasCalcFields)
                updateCalcFAXml(response);
        },
        processFATextFields: function processFATextFields() {
            processFAResponse(faxmlObj != null ? faxmlObj : $.parseXML($("input[name='hidfaxml']").val()), "load");
        }
    }
    //FA OBJECT END


    // PAGE NAVIGATION OBJECT START
    var navigationFn = {

        visiblePage: function getVisiblePage() {

            var $pageObj = {};
            $("div[id*='page_']").each(function (index, value) {

                $pageObj = $(value);
                return false;

            });
            return $pageObj;
        }
    }

    // PAGE NAVIGATION OBJECT END



    // GENERAL DOM MANIPULATION START
    var DomFunc = {
        setLabels: function setLabels() {
            try {
                var lblarr = document.querySelectorAll("label,legend,h3,span.lblview");
                var stop = lblarr.length;
                for (var k = 0; k < stop; k++) {
                    if (lblarr[k].className.indexOf("checkbox") != 0) {
                        lblarr[k].innerHTML = lblarr[k].innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                        applyScope.compileInnerHtml(lblarr[k]);
                    }

                }

                if (document.getElementById("rDiv")) {
                    document.getElementById("rDiv").innerHTML = document.getElementById("rDiv").innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                    applyScope.compileInnerHtml(rDiv);
                }
            }
            catch (e) { }
        },
        showCollapsibleSections: function showCollapsibleSections(flg) {

            if (flg == "hide") {
                $.each($(".ui-accordion-content"), function (index, value) {
                    if (!$(value).hasClass("ui-accordion-content-active")) {
                        $(value).attr("show-hidden", "true");
                        $(value).css({ "display": "block" });

                    }
                });
            }
            else {

                $.each($(".ui-accordion-content"), function (index, value) {

                    if (typeof $(value).attr("show-hidden") != "undefined" && $(value).attr("show-hidden") == "true") {
                        $(value).css({ "display": "none" });
                        $(value).removeAttr("show-hidden");
                    }
                });

            }
        },
        upateTextArea: function upateTextArea() {
            $.each($(".ui-text-editor"), function (index, value) {
                if (typeof CKEDITOR.instances[$(this).attr("id")] != "undefined") {
                    $("#" + $(value).attr("id").replace("-input", "")).val(CKEDITOR.instances[$(value).attr("id")].getData());
                }
            }
        );
        },
        enhanceSelects: function enhanceSelects() {

            $.each($("select"), function (index, value) {

                if ($("#" + $(value).attr("name") + "-input").length == 0 && typeof $(value).attr("multiple") != "undefined") {

                    //$(value).multiselect({placeholder: ' Choose...'});
                }
                else if ($("#" + $(value).attr("name") + "-input").length > 0) {

                    $(value).closest(".fieldcontain").addClass("autocomplete");

                    $(value).attr("tabindex", "-1");
                    if (typeof $(value).attr("multiple") != "undefined") {
                        $(value).closest(".fieldcontain").addClass("multiple");


                        $(value).closest(".fieldcontain").find("[name*='-sscheck']").each(function () {

                            var $select = $("#" + $(this).attr("name").replace("-sscheck", ""));
                            $(this).click(function () {

                                if ($(this).is(":checked")) {
                                    $select.find("option[value='" + $(this).val() + "']").prop("selected", "selected");
                                }
                                else {
                                    $select.find("option[value='" + $(this).val() + "']").removeAttr("selected");
                                }
                                $select.change();

                            });
                        });
                    }
                }
            });

        },
        selectItem: function selectItem(ui, select) {

            // this is needed to deal with '.' used by adp in the wotc flow
            select = select.split(".").join("\\."); //.replace('.', "\\.");
            var $selectControl = $(select);
            var $clearbtn = $("#" + $selectControl.attr("name") + "-input").parent().find("a");

            if (typeof $selectControl.attr("multiple") == "undefined") {
                $selectControl.find("option:selected").each(function () { $(this).removeAttr("selected"); $(this).prop("selected", false); });
                $selectControl.find("option[value='" + ui.item.value + "']").first().prop("selected", "selected");
            } else {
                if ($selectControl.find("option[value='" + ui.item.value + "']").first().prop("selected"))
                    $selectControl.find("option[value='" + ui.item.value + "']").first().prop("selected", false);
                else
                    $selectControl.find("option[value='" + ui.item.value + "']").first().prop("selected", "selected");
            }
            $selectControl.change();

            if ($selectControl.attr("name").indexOf("profile") == 0 && $selectControl.attr("name").indexOf("_country_") > 0) {
                var $stateSelector = $(document.querySelector('.profile select[id*="_state_"]'));
                var $stateClearbtn = $("#" + $stateSelector.attr("name") + "-input").parent().find("a");
                $("#" + $stateSelector.attr("name")).val("");
                $("#" + $stateSelector.attr("name") + "-input").val("");
                //$("#" + $stateSelector.attr("name") + "-input").attr("placeholder", msgs.msgplaceholder);
                $stateSelector.find("option:selected").each(function () { $(this).removeAttr("selected"); $(this).prop("selected", false); });
                $stateClearbtn.removeClass("icon-remove");
            }
            if ($selectControl.attr("name").indexOf("education") == 0 && $selectControl.attr("name").indexOf("_schoolname_") > 0) {
                angular.element($("#" + $selectControl.attr("name") + "-input")).triggerHandler("change");
                $("#" + $selectControl.attr("name") + "-hidden").val(ui.item.value);
            }
            if ($selectControl.attr("name").indexOf("education") == 0 && $selectControl.attr("name").indexOf("_degree") > 0) {
                angular.element($("#" + $selectControl.attr("name") + "-input")).triggerHandler("change");
                $("#" + $selectControl.attr("name") + "-hidden").val(ui.item.value);
            }

            if (typeof $selectControl.attr("multiple") != "undefined") {

                var $group = $selectControl.closest(".fieldcontain").find("fieldset");
                this.updateMultiSS($group, $selectControl);
            }
            else {
                $clearbtn.removeClass("custom-icon-angle-down");
                $clearbtn.addClass("icon-remove");
            }
            $selectControl.closest(".fieldcontain").find("input.ui-search-widget").removeClass("error");
            $selectControl.valid();


        },
        updateMultiSS: function updateMultiSS(controlgroup, control) {
            return;
            var $group = $(controlgroup);
            var $selectControl = $(control);
            $group.find(".ui-controlgroup-controls").empty();

            var html = "";
            $selectControl.find("option:selected").each(function (index, value) {

                var checked = " checked";
                if ($(value).attr("value") != "") {
                    html += "<div class='ui-checkbox'>";
                    html += "<input type='checkbox' value='" + ($(value).attr("value")) + "'" + checked + "  name='" + ($selectControl.attr("name") + "-sscheck") + "' id='" + ($selectControl.attr("name") + "-sscheck") + "-" + $(value).attr("value") + "' crb='true'>";
                    html += "<label for='" + ($selectControl.attr("name") + "-sscheck") + "-" + $(value).attr("value") + "'>" + $(value).text() + "</label>";
                    html += "</div>";
                }

            });

            $group.find(".ui-controlgroup-controls").html(html);


            $group.find("input").each(function () {

                $(this).click(function () {
                    if ($(this).is(":checked")) {
                        $selectControl.find("option[value='" + $(this).val() + "']").prop("selected", "selected");
                    }
                    else {
                        $selectControl.find("option[value='" + $(this).val() + "']").removeAttr("selected");
                    }
                    $selectControl.change();

                });
            });
        },
        updateTA: function updateTA(objname, mode) {

            var $editorObj = $("#" + objname);
            var $txtareaObj = $("#" + $editorObj.attr("id").replace("-input", ""));

            if (mode == "update") {
                $editorObj.html((CKEDITOR.instances[objname + "-popup"].getData()));
            }

            if ($.trim($editorObj.html().replace("<br>", "")) == "") {
                $editorObj.addClass("errorauto");
                $txtareaObj.val("");
                $txtareaObj.valid();
            }
            else {
                $editorObj.removeClass("errorauto");
                $txtareaObj.val((CKEDITOR.instances[objname + "-popup"].getData()).replace(/>/g, "&gt;").replace(/</g, "&lt;"));
                $txtareaObj.valid();
            }

            CKEDITOR.instances[objname + "-popup"].destroy();
        }


    }
    // GENERAL DOM MANIPULATION END


    // FORM VALIDATION OBJECT START

    var validationObj = {

        setFormValidation: function () {
            $("form[name='applyForm']").validate({
                errorClass: 'error',
                validClass: 'success',
                errorElement: 'span',
                ignore: ".noValidate,div.hiddenQB input,div.hiddenQB select,div.hiddenQB textarea",
                onfocusout: false,
                highlight: function (element, errorClass, validClass) {
                    $(element).closest(".fieldcontain").addClass("invalid");
                    $(element).attr("aria-invalid", "true");
                },
                unhighlight: function (element, errorClass, validClass) {
                    var $parentElem = $(element).removeAttr("aria-describedby").closest(".fieldcontain");

                    if (element.getAttribute("type") == "search")
                        return;

                    $parentElem.removeClass("invalid");
                    $(element).removeAttr("aria-invalid");
                },
                errorPlacement: function (error, element) {

                    error.insertAfter(element.closest(".fieldcontain").children().last());

                },
                invalidHandler: function (form, validator) {
                    var validerrors = validator.numberOfInvalids();

                    if (validerrors) {

                        window.applyScope.page.errormsgs = [];
                        if (validator.errorList.length > 0) {
                            var fobj, fcontainer, $errorLabel, $errorSpan, $control;
                            for (x = 0; x < validator.errorList.length; x++) {
                                $control = $(validator.errorList[x].element);
                                fcontainer = $control.closest(".fieldcontain");
                                if (fcontainer.length > 0) {
                                    fobj = fcontainer.find("legend").length > 0 && !fcontainer.hasClass("autocomplete") ? fcontainer.find("legend").first() : $control.prev().is("label") ? $control.prev() : fcontainer.find("label").first();
                                    var errorLabel = "";
                                    //If its a Resumewidget change the label of the error
                                    if (fobj.hasClass('buildResumePad')) {
                                        errorLabel = $.trim($("#pagecontent").find("#resumeHeading").text());
                                    }
                                    else {
                                        if (fobj.closest("ul").hasClass("AddtoError") && typeof fobj.closest("ul").attr('aria-label') != "undefined" && fobj.closest("ul").attr('aria-label').length > 0)
                                            errorLabel = $.trim(fobj.closest("ul").attr('aria-label').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); })) + " : " + $.trim(fobj.text().replace("*", "").replace("Click for tool tip.", ""));
                                        else
                                            errorLabel = $.trim(fobj.text().replace("*", "").replace("Click for tool tip.", ""));
                                    }
                                    window.applyScope.page.errormsgs.push({ label: errorLabel, error: validator.errorList[x].message });
                                }
                            }
                        }

                    }

                    _.delay(function () {
                        $(".errorContainer").scrollAndFocus();
                        $.pinToFold();
                    });
                }

            });
        },
        getDefaultDateFormat: function (inputDate) {
            var dateFormatSetting = "1";
            if (typeof appScope != "undefined" && typeof appScope.tgSettings != "undefined" && typeof appScope.tgSettings.DateFormat != "undefined") {
                dateFormatSetting = appScope.tgSettings.DateFormat;
            }
            var separatedBy = "/";
            var monthIndex = 0;
            var dayIndex = 1;
            var yearIndex = 2;
            if (dateFormatSetting == "1" || dateFormatSetting == "6" || dateFormatSetting == "7" || dateFormatSetting == "8") {
                monthIndex = 0;
                dayIndex = 1;
                yearIndex = 2;
            }
            else if (dateFormatSetting == "2" || dateFormatSetting == "3" || dateFormatSetting == "4" || dateFormatSetting == "5") {
                monthIndex = 1;
                dayIndex = 0;
                yearIndex = 2;
            }
            else if (dateFormatSetting == "9" || dateFormatSetting == "10" || dateFormatSetting == "11" || dateFormatSetting == "12") {
                monthIndex = 1;
                dayIndex = 2;
                yearIndex = 0;
            }
            //Get Month, Day and Year Indexes
            if (dateFormatSetting == "1" || dateFormatSetting == "2" || dateFormatSetting == "3" || dateFormatSetting == "6" || dateFormatSetting == "9") {
                separatedBy = "/";
            }
            else if (dateFormatSetting == "4" || dateFormatSetting == "7" || dateFormatSetting == "10" || dateFormatSetting == "12") {
                separatedBy = "-";
            }
            else if (dateFormatSetting == "5" || dateFormatSetting == "8" || dateFormatSetting == "11") {
                separatedBy = ".";
            }
            var dateInputs = inputDate.split(separatedBy);
            var defaultDateFormat = dateInputs[monthIndex] + "/" + dateInputs[dayIndex] + "/" + dateInputs[yearIndex];
            return defaultDateFormat;
        },
        addValidatorMethods: function () {
            $.validator.addMethod("daterange", function (value, element, param) {
                if (value === "")
                    return true;

                var $element = $(element),
                    inst = $element.data().datepicker,
                    minDate = $.datepicker._getMinMaxDate(inst, "min"),
                    maxDate = $.datepicker._getMinMaxDate(inst, "max"),
                    date = new Date(validationObj.getDefaultDateFormat(value));

                return date < maxDate && date > minDate;

            }, function (params, element) {
                var $element = $(element);
                var str = msgs.msgdaterange;
                str = str.replace('[MINDATE]', $element.data().minDate);
                str = str.replace('[MAXDATE]', $element.data().maxDate);

                return str;
            });

            $.validator.addMethod("notEqual", function (value, element, param) {
                return (value == "" || value.match(/^(\d{3}-\d{2}-\d{4})$/) ? true : false);
            }, msgs.msgssn);

            $.validator.addMethod("notInData", function (value, element, param) {
                return (element.getAttribute("inputTextNotInData") != "true");
            }, function (bValid, element) {
                return msgs.msgnomatches.replace("[search-term]", element.value);
            });

            $.validator.addMethod("datrequired", function (value, element, param) {
                var vdate = $("#" + $(element).attr("name").replace("year", "day")).val();
                var vmon = $("#" + $(element).attr("name").replace("year", "mon")).val();
                var dateval = (vdate + "-" + vmon + "-" + value);
                var datarr = dateval.split("-");
                return (dateval.length > 2 && (datarr[0] == "" || datarr[1] == "" || datarr[2] == "") ? false : true);

            }, msgs.msgrequired);

            $.validator.addMethod("dateformat", function (value, element, param) {

                var vdate = $("#" + $(element).attr("name").replace("year", "day")).val();
                var vmon = $("#" + $(element).attr("name").replace("year", "mon")).val();
                var dateval = new Date(value, vmon - 1, vdate);
                var convertedDate = "" + dateval.getFullYear() + (dateval.getMonth() + 1) + dateval.getDate();
                var givenDate = "" + value + vmon + vdate;
                return (givenDate == convertedDate || value == "") ? true : false;


            }, msgs.msgInValidDate);

            $.validator.addMethod("datestring", function (value, element, param) {
                if (!value)
                    return true;

                var aDate = validationObj.getDefaultDateFormat(value).split("/"),
                    nMonth, dDate, dLast;

                if (aDate.length != 3)
                    return false;

                /*
                TODO:  Localize date order
                */

                if (aDate[0] < 1 || aDate[0] > 12)
                    return false;

                dDate = new Date(aDate[2], aDate[0] - 1, aDate[1]);

                if (isNaN(dDate.getTime()))
                    return false;

                dLast = new Date(aDate[2], aDate[0], 0);

                if (isNaN(dLast.getTime()))
                    return false;

                if (aDate[1] < 1 || aDate[1] > dLast.getDate())
                    return false;

                if (aDate[2] < 0 || aDate[2] > 2100)
                    return false;

                return true;
            }, msgs.msgInValidDate);

            $.validator.addMethod("customvalidation", function (value, element, param) {
                var regexp = new RegExp($(element).attr("validationregex"));
                return (value == "" || (regexp.test(value) ? true : false));
            }, msgs.msgvalidval);


            $.validator.addMethod("phoneformat", function (value, element, param) {
                return (value == "" || value.match(/^(?:\+?\(?\d+)(?:[0-9]|[-,. ()+])+\d+$/) ? true : false);
            }, msgs.msgvalidphone);

            $.validator.addMethod("nameformat", function (value, element, param) {
                return (value == "" || !value.match(/[0-9!#\$%&\"\*\+/:;<=>_\?@\[\\\]\^\{\|\}~]+/gi) ? true : false);
            }, msgs.msgname);

            $.validator.addMethod("restricted", function (value, element, param) {
                return (value.match(/<\/?[\s\S]*?(script|applet|iframe|object).*?>/gmi) ? false : true);
            }, msgs.msgvalidval);


            $.validator.addMethod("urlformat", function (value, element, param) {
                return (value == "" || value.match(/((?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)/i) ? true : false);
            }, msgs.msgvalidurl);

            function customMessageForZipFormat() {
                var customMessage = msgs.msgzip;
                if ($("select[name*='country']").first().find(':selected').val() == "223") {
                    customMessage = msgs.msgInvalidZipCode;
                }
                return customMessage;
            }
            function validateYearRangeandGetErrorMessage(typeofyear, yearvalue, doValidate) {
                var minyear = 0, maxyear = 0, thisyear = (new Date()).getFullYear();

                if (doValidate && yearvalue == '')
                    return true;

                switch (typeofyear) {
                    case 'gradyear':
                        minyear = thisyear - 100;
                        maxyear = thisyear + 10;
                        break;

                    case 'startyear':
                        minyear = thisyear - 100;
                        maxyear = thisyear
                        break;

                    case 'endyear':
                        minyear = thisyear - 100;
                        maxyear = thisyear + 1;
                        break;
                }
                if (doValidate) {
                    return yearvalue >= minyear && yearvalue <= maxyear;
                }
                else {
                    var errormsg = msgs.msgInvalidYearRange
                    return (errormsg.replace("[MINYEAR]", minyear - 1).replace("[MAXYEAR]", maxyear + 1));
                }
            }

            $.validator.addMethod("zipformat", function (value, element, param) {
                //United States Country Code is 223, Ensuring that Zip Code matches the specified format When United States is Selected
                if ($("select[name*='country']").first().find(':selected').val() == "223") {
                    return (value == "" || value.match(/(^[0-9]{5}$)|(^[0-9]{5}-[0-9]{4}$)/) ? true : false);
                }
                else
                    return (value == "" || value.match(/^(.{0,10})$/) ? true : false);
            }, customMessageForZipFormat);

            $.validator.addMethod("year", function (value, element, param) {

                return (value == "" || value.match(/^\d{4}$/) ? true : false);
            }, msgs.msgyear);


            $.validator.addMethod("gpa", function (value, element, param) {

                return (value == "" || value.match(/^[0-9]+\.?[0-9]*$/) ? true : false);
            }, msgs.msggpa);

            $.validator.addMethod("yearranges", function (value, element, param) {
                return validateYearRangeandGetErrorMessage(param, value, true);
            }, function (param, element) { return validateYearRangeandGetErrorMessage(param, element.value, false) });

            $.validator.addClassRules("ssnfield", {
                notEqual: "___-__-____"
            }
            );

            $.validator.addClassRules("required", {
                required: function (element) {
                    return !draftMode;
                }
            });
            $.validator.addClassRules("year", {
                year: ""

            });
            $.validator.addClassRules("endYear", {
                endYear: function (element) {
                    var endyearID = $(element).attr('id');
                    return $("#startyear" + endyearID[7]).val();
                }
            });
            $.validator.addClassRules("gpa", {
                gpa: ""

            });

            $.validator.addClassRules("nohtml", {
                nohtml: ""

            });

            $.validator.addClassRules("yearranges", {
                yearranges: function (element) {

                    var typeofyear_id = $(element).attr('id');
                    var typeofyear = '';

                    if (typeofyear_id.indexOf('gradyear') >= 0)
                        typeofyear = 'gradyear';
                    else if (typeofyear_id.indexOf('startyear') >= 0)
                        typeofyear = 'startyear';
                    else if (typeofyear_id.indexOf('endyear') >= 0)
                        typeofyear = 'endyear';

                    return typeofyear;
                }
            });

            $.validator.addMethod("emailformat", function (value, element, param) {
                // RTC 89472 changes - Reverted code changes done for RTC 79642 in order to resolve the 89472 issue.
                return (value == "" || value.match(/^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ!#$%&'\/*\/+-\/\/\/=\/?\/^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/) ? true : false);

            }, msgs.msgemail);

            $.validator.addMethod("nohtml", function (value, element, param) {
                return (value == "" || value.match(/^(?!.*<.*>)/) ? true : false);
            }, msgs.msgInvalidInputHTMLTag);

            $.validator.addMethod("endYear", function (value, element, param) {
                if (value == "")
                    return true;
                if (param == "")
                    return false;
                else return (value >= param)
            }, msgs.msgInvalidEndYear);
        },
        validationMsgs: function () {
            jQuery.extend(jQuery.validator.messages, {
                required: msgs.msgrequired,
                email: msgs.msgemail,
                number: msgs.msgnumber,
                equalTo: msgs.msgconfirmfield,
                max: jQuery.validator.format(msgs.msgmax),
                min: jQuery.validator.format(msgs.msgmin)
            });

        },
        setFieldValidations: function () {
            $("#pagecontent").find("input[role=combobox]").each(function () {
                $(this).rules("add", { notInData: true });
            })


            $.each($("#pagecontent").find("input[inputvalidation='1']"), function (index, value) {

                if ($(value).attr("name").match(/num/gi)) {
                    $(value).blur(function () { $(value).val($(value).val()); });

                }

                $(value).rules("add", {
                    customvalidation: ""

                });
            });


            $("#pagecontent").find("[name*='phone'],[name*='fax']").each(function () {
                $(this).rules("add", {
                    phoneformat: "",

                });

            });

            $("#pagecontent").find("[name*='homepage']").each(function () {
                $(this).rules("add", {
                    urlformat: "",

                });

            });

            $("#pagecontent").find("[name*='zip']").each(function () {
                $(this).rules("add", {
                    zipformat: "",

                });

            });

            $("#pagecontent").find("input[type='text'][name*='firstname'],input[type='text'][name*='lastname'],input[type='text'][name*='middlename']").each(function () {
                $(this).rules("add", {
                    nameformat: "",

                });

            });

            $("#pagecontent").find("input[type='email']").each(function () {
                $(this).rules("add", {
                    emailformat: true,

                });

            });

            $("#pagecontent").find("input[type='text'],input[type='search'],input[type='email'],input[type='number'],input[type='ssn'],textarea").each(function () {
                $(this).rules("add", {
                    restricted: "",

                });

            });

            $("#pagecontent").find("input[type='number']").each(function () {
                var elementName = $(this).attr('name');
                if (typeof elementName == "undefined" || elementName == null)
                    elementName = "";
                var fieldType = elementName.split("_")[0];
                if (fieldType.toLowerCase() != "wotc" && !($(this).attr('min') == 0 && $(this).attr('max') == 0)) {
                    $(this).rules("add", {
                        min: parseInt($(this).attr('min')),
                        max: parseInt($(this).attr('max'))
                    });
                }
            });

            $("#pagecontent").find("[name*='_txa_']").each(function (index, value) {

                if ($(this).attr("maxlength")) {

                    $(value).keypress(function () {

                        if (this.length > parseInt($(this).attr("maxlength"))) {
                            return false;
                        }

                    });
                }

            });


            $.each($("input.dattxt"), function (index, value) {



                $(value).datepicker({
                    beforeShow: function () { readSelected($(value).attr("name").replace("dattxt", "")); }, onSelect: updateSelected,
                    minDate: ($(value).attr("downyears") == "0") ? new Date(new Date().getFullYear(), "0", "1") : ("-" + $(value).attr("downyears") + "Y"), maxDate: ($(value).attr("upyears") == "0") ? new Date(new Date().getFullYear(), "11", "31") : ("+" + $(value).attr("upyears") + "Y"),
                    showOn: 'both', buttonImageOnly: true, buttonImage: '/submission/img/calendar.gif',
                    changeYear: true
                });


                $('#' + $(value).attr("name").replace("dattxt", "year")).change(function () { readSelected($(value).attr("name").replace("dattxt", "")); });
                $('#' + $(value).attr("name").replace("dattxt", "mon")).change(function () { readSelected($(value).attr("name").replace("dattxt", "")); });
                $('#' + $(value).attr("name").replace("dattxt", "day")).change(function () { readSelected($(value).attr("name").replace("dattxt", "")); });


            });


            setTimeout(function () {
                $("#pagecontent").find(".confirmInput").each(function () {

                    $(this).rules("add", {

                        equalTo: '#' + $(this).attr('id').replace('-confirm', '')
                    });
                });
            }, 800);


        }
    }


    // Prepare to show a date picker linked to three select controls
    var readSelected = function (datename) {
        $('#' + datename + 'dattxt').val($('#' + datename + 'mon').val() + '/' +
    $('#' + datename + 'day').val() + '/' + $('#' + datename + 'year').val());
        return {};
    }

    // Update three select controls to match a date picker selection
    var updateSelected = function () {
        var date1 = $(this).val();
        var datecontrol = $(this).attr("name").replace("dattxt", "");
        $('#' + datecontrol + 'mon').val(date1.substring(0, 2).indexOf("0") == 0 ? date1.substring(1, 2) : date1.substring(0, 2));
        if (isMobile)
            $('#' + datecontrol + 'mon').selectmenu().selectmenu("refresh");
        $('#' + datecontrol + 'day').val(date1.substring(3, 5).indexOf("0") == 0 ? date1.substring(4, 5) : date1.substring(3, 5));
        if (isMobile)
            $('#' + datecontrol + 'day').selectmenu().selectmenu("refresh");
        $('#' + datecontrol + 'year').val(date1.substring(6, 10));
        if (isMobile)
            $('#' + datecontrol + 'year').selectmenu().selectmenu("refresh");
    }
    // FORM VALIDATION OBJECT END



    validationObj.setFormValidation();
    validationObj.addValidatorMethods();
    validationObj.setFieldValidations();
    validationObj.validationMsgs();

    // EVENT DELEGATES START

    $(document).on('mouseover click', 'h3.sectionhead', function () {

        $(this).parent().accordion({
            collapsible: true,
            heightStyle: "content"
        });
        $(this).removeClass("sectionhead");


    });

    $(document).on("click", ".my-tooltip-btn", function (event) {

        if (!isMobile) {
            $(this).href = "#";
            event.preventDefault();
            $(this).popover({ content: $("#" + $(this).attr("aria-owns")).html().replace("&lt;", "<").replace("&gt;", ">"), title: "", html: true, trigger: "focus", placement: "top" });
            $(this).focusout(function () {
                try {
                    $(this).popover("destroy");
                } catch (Error) {
                }
            });
            $(this).focus();

        }

    });

    function createFormAutocomplete(event) {

        var $autoinput = $(this).closest(".fieldcontain").find("input[id*='-input']");

        var ss = $autoinput.attr('id').replace('-input', '');
        var fieldParams = ss.split("_");
        var questionId = fieldParams[1];
        var questionType = fieldParams[0];
        var fieldName = fieldParams[3];
        var fieldType = fieldParams[4];
        var optQuestionId = questionId;
        if (fieldParams.length > 6 && fieldParams[6] != 0 && fieldParams[6] != null && fieldParams[6] != "") {
            optQuestionId = fieldParams[6];
        }
        window.pageSize = 15;
        this.pageIndex = 0;
        window.isBlanketSearch = 0;
        $(this).removeClass("ui-complete");

        var pageData = applyScope.page;
        var tgSettings = applyScope.page.tgSettings;

        $autoinput.autocomplete({
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "fit flip"
            },
            select: function (event, ui) {
                if (typeof $(this).attr('multiselect') == 'undefined') {
                    $(this).val(ui.item.label);
                    this.pageIndex = 0;
                }
                if ($(this).attr('id').indexOf('_mbcountry_') > -1 && $("#MobileCountryCode").length > 0) {
                    $("#MobileCountryCode").text(ui.item.countryCode);
                }
                DomFunc.selectItem(ui, "#" + ss);
                if (fieldType == "mslt") angular.element($autoinput).scope().toggleSelection(event, ui);
                return false;
            },
            focus: function (event, ui) {
                this.pageIndex = 0;
                return false;
            },
            close: function (event, ui) {
                this.pageIndex = 0;
                this.requestIndex = 0;
            },
            source: function (request, response) {
                if (request.term == -1) {
                    window.isBlanketSearch = 1;
                }

                $autoinput.data("autocompleteRequestData", {
                    TQRenderingID: pageData.tqrenderingid, QuestionType: questionType, QuestionId: questionId, FieldName: fieldName, LanguageId: tgSettings.deflanguageid, LocaleId: tgSettings.deflocaleid, ClientID: pageData.partnerid, Criteria: (request.term == "-1" ? "" : request.term) + ($autoinput.attr("dependantfield") ? "^" + ($("[name*='_" + $autoinput.attr("dependantfield") + "_']").val()) : ""), LanguageISOLetter: tgSettings.languageisoletter, PageSize: window.pageSize, PageIndex: this.pageIndex, OptQuestionId: optQuestionId
                });
                $autoinput.autocomplete("option", "minLength", 0);
                var prevQB = "", prevchildren = [], qbchildren = [], itemChanged = false;
                if (document.getElementById("autocomplete_" + questionId) != null) {
                    var optionsJson = jQuery.parseJSON(document.getElementById("autocomplete_" + questionId).value);
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    var filteredOptionsJson = $.grep(optionsJson, function (item, index) {
                        // return matcher.test(item.Description);
                        if (request.term != "-1")
                            return (item.Description.toLowerCase().indexOf(request.term.toLowerCase()) >= 0)
                        else
                            return true;
                    });
                    var listCount = filteredOptionsJson.length;
                    var $ss = $("#" + ss);

                    this.pageIndex = this.pageIndex || 0;

                    filteredOptionsJson = filteredOptionsJson.slice(this.pageIndex * window.pageSize, this.pageIndex * window.pageSize + window.pageSize);
                    response($.map(filteredOptionsJson, function (v, i) {
                        return {
                            label: v.Description,
                            value: v.Code
                        };
                    }), listCount);
                    var opts = "";
                    var alreadyPresentoptions = $ss.html();
                    $.each($("#" + ss + " option:selected"), function (i, val) {
                        var qbchild = $(val).attr("qbchildren") ? $(val).attr("qbchildren") : "";
                        if ($(val).attr("selected") != "selected") {
                            var Score = $(val).attr("score") ? $(val).attr("score") : "";
                            var knockout = $(val).attr("knockout") ? $(val).attr("knockout") : "false";
                            var nextPageId = $(val).attr("nextpageid") ? $(val).attr("nextpageid") : "0";
                            if (alreadyPresentoptions.indexOf(">" + $(val).html() + "</option>") != -1 && alreadyPresentoptions.indexOf(" selected='selected'>" + $(val).html() + "</option>") == -1)
                                alreadyPresentoptions = alreadyPresentoptions.replace(">" + $(val).html() + "</option>", " selected='selected'>" + $(val).html() + "</option>");
                        }
                        if ($(val).attr("selected") == "selected" && fieldType != "mslt") {
                            if (qbchild != "0") {
                                prevQB += "," + qbchild + ",";
                            }
                            if (request.term != "-1" && $(val).html() != request.term) {
                                itemChanged = true;
                            }
                        }
                    });
                    //Handling QB's when single select dropdown refreshed.
                    if (itemChanged && fieldType != "mslt") {
                        prevchildren = prevQB.split(",");
                        QBObj.executeQB(prevchildren, qbchildren);
                    }

                    if (request.append)
                        $ss.html(alreadyPresentoptions);
                    else
                        opts += alreadyPresentoptions;

                    $.each(filteredOptionsJson, function (i, val) {

                        if ($("#" + ss + " option[value='" + val.Code.replace(/'/g, "&#39;") + "']:selected").length == 0) {
                            var qbchild = val.QBChildren ? val.QBChildren : "";
                            var score = val.Score ? val.Score : "0";
                            var knockout = val.KnockOut ? val.KnockOut : "false";
                            var nextPageId = val.KnockOutPageId ? val.KnockOutPageId : "0";
                            var optionId = val.OptionId ? val.OptionId : "0";
                            opts += "<option score='" + score + "' value='" + val.Code.replace(/'/g, "&#39;") + "' qbchildren='" + qbchild + "' knockout='" + knockout + "' nextpageid='" + nextPageId + "' optionid='" + optionId + "'>" + val.Description + "</option>";
                        }
                    });

                    if (request.append)
                        $ss.append($(opts));
                    else
                        $ss.html(opts);


                    $autoinput.removeAttr("placeholder");
                }
                else {
                    $.ajax({
                        url: "/GQWeb/GetAutoCompleteResults?partnerid=" + pageData.partnerid + "&siteid=" + pageData.siteid,
                        dataType: "json",
                        data: angular.toJson($autoinput.data("autocompleteRequestData")),
                        type: "post",
                        cache: false,
                        contentType: "application/json",
                        success: function (data) {
                            this.fullCount = data.totalcount;
                            var opts = "";
                            if (!request.append) {
                                $.each($("#" + ss + " option:selected"), function (i, val) {
                                    var qbchild = $(val).attr("qbchildren") ? $(val).attr("qbchildren") : "";
                                    var score = $(val).attr("score") ? $(val).attr("score") : "0";
                                    var knockout = $(val).attr("knockout") ? $(val).attr("knockout") : "false";
                                    var nextPageId = $(val).attr("nextpageid") ? $(val).attr("nextpageid") : "0";
                                    var optionId = $(val).attr("optionid") ? $(val).attr("optionid") : "0";
                                    opts += "<option score='" + score + "' value='" + $(val).attr("value").replace(/'/g, "&#39;") + "' selected='selected'  qbchildren='" + qbchild + "' knockout='" + knockout + "' nextpageid='" + nextPageId + "' optionid='" + optionId + "'>" + $(val).text() + "</option>";

                                    if ($(val).attr("selected") == "selected" && fieldType != "mslt") {
                                        if (qbchild != "0") {
                                            prevQB += "," + qbchild + ",";
                                        }
                                        if (request.term != "-1" && $(val).html() != request.term) {
                                            itemChanged = true;
                                        }
                                    }
                                });
                            }

                            //Handling QB's when single select dropdown refreshed.
                            if (itemChanged && fieldType != "mslt") {
                                prevchildren = prevQB.split(",");
                                QBObj.executeQB(prevchildren, qbchildren);
                            }

                            $.each(data.results, function (i, val) {

                                if ($("#" + ss + " option[value='" + val.code.replace(/'/g, "&#39;") + "']:selected").length == 0) {
                                    var qbchild = val.qbchildren ? val.qbchildren : "";
                                    var score = val.score ? val.score : "0";
                                    var knockout = val.knockout ? val.knockout : "false";
                                    var nextPageId = val.knockoutPageId ? val.knockoutPageId : "0";
                                    var optionId = val.optionId ? val.optionId : "0";
                                    opts += "<option score='" + score + "' value='" + val.code.replace(/'/g, "&#39;") + "' qbchildren='" + qbchild + "' knockout='" + knockout + "' nextpageid='" + nextPageId + "' optionid='" + optionId + "'>" + val.description + "</option>";
                                }
                            });

                            response($.map(data.results, function (v, i) {

                                return {
                                    label: v.description,
                                    value: v.code,
                                    countryCode: v.mobileCountryCode
                                };

                            }
                                ), data.totalcount);

                            if (request.append)
                                $("#" + ss).append($(opts));
                            else
                                $("#" + ss).html(opts);

                            $autoinput.removeAttr("placeholder");

                        }
                    });
                }
            }
        });
        $autoinput.blur(function () {
            if (!$autoinput[0].attributes.hasOwnProperty("multiselect") && $autoinput.val() == "") {
                //Handling delete control to hide the respective QB
                var prevchildren = [], qbchildren = [];
                prevchildren.push($($('#' + ss).find("option:selected")[0]).attr("qbchildren"));
                QBObj.executeQB(prevchildren, qbchildren);
                $('#' + ss).find('option').remove().end();
            }
            //$autoinput.attr("placeholder", msgs.msgplaceholder);
            $autoinput.autocomplete("option", "minLength", 1);
        });

    }

    $(document).on("focus", ".ui-complete", createFormAutocomplete);

    if (window.appScope) {
        appScope.utils.createFormAutocomplete = function (elInput) {
            createFormAutocomplete.apply(elInput);
        }
    }

    $(document).on("focus", ".ui-text-editor", function (event) {


        if (typeof CKEDITOR.instances[$(this).attr("id") + "-popup"] == "undefined") {

            $("#editordialog").html('<div contenteditable="true" class=" ui-input-text ui-body-t ui-shadow-inset ui-body-inherit ui-corner-all ui-text-editor" id="' + $(this).attr("id") + '-popup">' + $(this).html() + '</div><br/><button role="button" aria-label="Save" class="btn btn-primary" type="button"  data-bb-handler="ok" onclick="updateTA(\'' + $(this).attr("id") + '\',\'update\');bdg.dialog(\'destroy\');">Save</button>&nbsp;&nbsp;<button role="button" aria-label="Cancel" class="btn" type="button"  data-bb-handler="ok" onclick="updateTA(\'' + $(this).attr("id") + '\',\'close\');bdg.dialog(\'destroy\');">Cancel</button>');
            bdg = $("#editordialog").dialog({
                height: 400,
                width: 650

            });

            $(this).attr("contenteditable", "true");
            $(this).html($(this).html().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));

            CKEDITOR.replace($(this).attr("id") + "-popup", {
                width: "100%",
                toolbar: [
                //The below name was added in order to resolve one ckeditor "A WAI-ARIA widget must have an accessible name".
                { name: 'document', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] }, 		// Defines toolbar group without name.
                '/', 																				// Line break - next group will be placed in new line.
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },

            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'styles', items: ['Font', 'FontSize'] },
            { name: 'colors', items: ['TextColor'] }
                ]
            });

        }


    });

    $(document).on('click', '.autoclear', function () {

        var $clearButton = $(this),
            $inputctr = $clearButton.parent().find("input");

        if ($clearButton.hasClass("custom-icon-angle-down")) {

            $inputctr.autocomplete("search", "-1");

        }
        else {
            var $selectControl = $("#" + $clearButton.parent().find("input").attr("id").replace("-input", ""));

            if (typeof $selectControl.attr("multiple") == "undefined") {
                $selectControl.find("option:selected").each(function () { $clearButton.removeAttr("selected"); $clearButton.prop("selected", false); });
                if ($selectControl.find("option[value='']").length == 0) {
                    $selectControl.append($("<option value='' selected>Choose..</option>"));
                    $clearButton.addClass("custom-icon-angle-down");
                    $clearButton.removeClass("icon-remove");
                }
                else {
                    $selectControl.find("option[value='']").prop("selected", true);
                }
                $selectControl.change();
                $inputctr.val("");
                $inputctr.autocomplete("search", "-1");

            }
        }
    });

    // EVENT DELEGATES END


    // DOM READY
    $(document).ready(function () {

        if (navigator.userAgent.indexOf("MSIE 8.0") != -1 || navigator.userAgent.indexOf("MSIE 7.0") != -1) {
            var head = document.getElementsByTagName('head')[0],
                    style = document.createElement('style');
            style.type = 'text/css';
            style.styleSheet.cssText = ':before,.ui-btn-icon-notext:after{content:none !important}';
            head.appendChild(style);
            setTimeout(function () {
                head.removeChild(style);
            }, 0);
        }


    });



    //processFATextFields();



    DomFunc.setLabels();

    $("body").css({ "visibility": "visible" });


    window.QBObj = QBObj;
    //window.FAObj = FaObj;
    window.validationObj = validationObj;
    window.hidQBFields = hidQBFields;
    window.navigationFn = navigationFn;
    window.DomFunc = DomFunc;
};

/*
// NoComment PRESERVE END
*/



