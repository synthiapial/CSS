/*°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸


  Licensed Materials - Property of IBM5725-N92© Copyright IBM Corp.
  2014, 2017.US Government Users Restricted Rights- Use,
  duplication or disclosure restricted by GSA ADP Schedule Contract  with IBM Corp.
  

°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸*/

//<<<<<<<<<<<<<<<<<<<<<<<<<<< CALLS TO LIBRARY EXTENSIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

extendLodash();
extendJQuery();
extendAngular();


//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR COMMON APP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

angular.dependencies = {};

var tgCommon = angular.module('tgCommon', ['ngSanitize', 'ngDialog'/*,'ngRoute','ngAnimate'*/]);





//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR CONFIG CONTROLLER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//used primarily for configuration by administrator/superuser when app is launched via workbench

tgCommon.controller('configTool', function ($scope, $location, $log, $window, utils) {
    if ($("#workFlow")[0].content.toLowerCase() == "referral")
        utils.init($scope.$root, true);
    else
        utils.init($scope.$root, true, $location);

    $scope.theme = window.tgTheme;
    $scope.bConfigMode = tgTheme.bConfigMode;
    $scope.$root.workFlow = "";

    if ($scope.bConfigMode) {
        document.documentElement.className += " config";
        $scope.config = new $scope.utils.configToolFactory();
        $scope.contextMenu = new $scope.utils.menuFactory({ fnItemClickHandler: $scope.config.set, fnBeforeShowCallback: $scope.config.getOptions, fnSelected: $scope.config.getSelected });
        window.configScope = $scope;
    }
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR FILTERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tgCommon.filter('isValidObject', function () {
    return function (obj) {
        return !(obj === undefined || obj === null || Object.keys(obj).length === 0);
    }
});
tgCommon.filter('showrenderedfields', function () {
    return function (aoFields) {

        var that = this;
        var renderedFields = [];
        if (!(that.bresponsiveCandidateZone && that.bCandidateZone) && that.jobFieldsToDisplay.Position1 != null) {
            renderedFields.push(_.find(aoFields, { 'QuestionName': that.jobFieldsToDisplay.Position1.toLowerCase() }));
        }
        if (that.jobFieldsToDisplay.JobTitle != null) {
            renderedFields.push(_.find(aoFields, { 'QuestionName': that.jobFieldsToDisplay.JobTitle.toLowerCase() }));
        }
        if (that.jobFieldsToDisplay.Position3.length > 0) {
            $.each(that.jobFieldsToDisplay.Position3, function (index, value) {
                renderedFields.push(_.find(aoFields, { 'QuestionName': value.toLowerCase() }));
            });
        }
        if (that.jobFieldsToDisplay.Summary != null) {
            renderedFields.push(_.find(aoFields, { 'QuestionName': that.jobFieldsToDisplay.Summary.toLowerCase() }));
        }

        _.each(renderedFields, function (opt) {
            if (opt != null) {
                if (that.jobFieldsToDisplay.Position1 != null && opt.QuestionName == that.jobFieldsToDisplay.Position1.toLowerCase())
                    opt.ClassName = "position1";
                else if (that.jobFieldsToDisplay.JobTitle != null && opt.QuestionName == that.jobFieldsToDisplay.JobTitle.toLowerCase()) {
                    opt.ClassName = "jobtitle";
                }
                else if (that.jobFieldsToDisplay.Position3.length > 0 != null && that.jobFieldsToDisplay.Position3.indexOf(opt.QuestionName.toLowerCase()) >= 0)
                    opt.ClassName = "position3";
                else if (that.jobFieldsToDisplay.Summary != null && opt.QuestionName == that.jobFieldsToDisplay.Summary.toLowerCase())
                    opt.ClassName = "jobdescription";
            }
        });
        var lastUpdatedValue = _.pluck(_.where(aoFields, { "QuestionName": "lastupdated" }), "Value").toString();
        if (that.jobFieldsToDisplay.Position1 != null && that.jobFieldsToDisplay.Position1.toLowerCase() == "lastupdated" && lastUpdatedValue.indexOf("T") > 0) {
            var asDate = lastUpdatedValue.split("T")[0].toString().split("-"); //Date Format is : 2014-08-11T00:00:00Z from Solr 
            _.where(aoFields, { "QuestionName": "lastupdated" })[0].Value = asDate[1] + "/" + _.parseInt(asDate[2]) + "/" + _.parseInt(asDate[0]); // Changed Date Format is : 08/11/2014
        }


        this.job.RenderedFields = renderedFields;
        return renderedFields;
    }
})


tgCommon.filter('matchField', function () {
    return function (aData, sField, sText, scope, sCachedArrayName) {
        sText = sText || "";
        var aOutput = sText ? _.filter(aData, function (oDatum) {
            return oDatum[sField].toLowerCase().indexOf(sText.toLowerCase()) >= 0;
        }) : aData;
        var aFiltered = scope[sCachedArrayName || "filteredArray"];

        if (aFiltered) {
            aFiltered.length = 0;
            aFiltered.push.apply(aFiltered, aOutput);
        }

        return aOutput;
    }
})

tgCommon.filter('showJobDetailsFields', function () {
    return function (aoFields) {

        var that = this;
        var renderedFields = [];
        if (that.jobDetailsFieldsToDisplay.Position1 != null) {
            var jobPos1Field = _.find(aoFields, { 'VerityZone': that.jobDetailsFieldsToDisplay.Position1.toLowerCase() });
            if (jobPos1Field != undefined)
                renderedFields.push(jobPos1Field);
        }
        if (that.jobDetailsFieldsToDisplay.JobTitle != null) {
            var jobTitleField = _.find(aoFields, { 'VerityZone': that.jobDetailsFieldsToDisplay.JobTitle.toLowerCase() });
            if (jobTitleField != undefined)
                renderedFields.push(jobTitleField);
        }
        if (that.jobDetailsFieldsToDisplay.Position3 != null && that.jobDetailsFieldsToDisplay.Position3.length > 0) {
            $.each(that.jobDetailsFieldsToDisplay.Position3, function (index, value) {
                var jobPos3Field = _.find(aoFields, { 'VerityZone': value.toLowerCase() });
                if (jobPos3Field != undefined)
                    renderedFields.push(jobPos3Field);
            });
        }
        if (that.jobDetailsFieldsToDisplay.Summary != null) {
            var jobDescritpionField = _.find(aoFields, { 'VerityZone': that.jobDetailsFieldsToDisplay.Summary.toLowerCase() });
            if (jobDescritpionField != undefined)
                renderedFields.push(jobDescritpionField);
        }
        if (that.jobDetailsFieldsToDisplay.Section2Fields != null && that.jobDetailsFieldsToDisplay.Section2Fields.length > 0) {
            $.each(that.jobDetailsFieldsToDisplay.Section2Fields, function (index, value) {
                var jobSection2Field = _.find(aoFields, { 'VerityZone': value.toLowerCase() });
                if (jobSection2Field != undefined)
                    renderedFields.push(jobSection2Field);
            });
        }
        var position = 0;
        _.each(renderedFields, function (opt) {
            if (opt != null) {

                if (that.jobDetailsFieldsToDisplay.Position1 != null && opt.VerityZone == that.jobDetailsFieldsToDisplay.Position1.toLowerCase()) {
                    opt.ClassName = "position1InJobDetails";
                    opt.QuestionName = "";
                }
                else if (that.jobDetailsFieldsToDisplay.JobTitle != null && opt.VerityZone == that.jobDetailsFieldsToDisplay.JobTitle.toLowerCase()) {
                    opt.ClassName = "jobtitleInJobDetails";
                    opt.QuestionName = "";
                }
                else if (that.jobDetailsFieldsToDisplay.Position3 != null && that.jobDetailsFieldsToDisplay.Position3.length > 0 != null && that.jobDetailsFieldsToDisplay.Position3.indexOf(opt.VerityZone.toLowerCase()) >= 0) {
                    opt.ClassName = "position3InJobDetails";
                    opt.QuestionName = "";
                }
                else if (that.jobDetailsFieldsToDisplay.Summary != null && opt.VerityZone == that.jobDetailsFieldsToDisplay.Summary.toLowerCase()) {
                    opt.ClassName = "jobdescriptionInJobDetails";
                    opt.AnswerValue = opt.AnswerValue;
                }
                else if (that.jobDetailsFieldsToDisplay.Section2Fields != null && that.jobDetailsFieldsToDisplay.Section2Fields.length > 0 != null && that.jobDetailsFieldsToDisplay.Section2Fields.indexOf(opt.VerityZone.toLowerCase()) >= 0) {
                    if (opt.QuestionType.toLowerCase() == "textarea") {
                        opt.ClassName = "section2LeftfieldsInJobDetails jobDetailTextArea";
                        position = -1;
                    }
                    else {
                        if (opt.VerityZone != null && opt.VerityZone.toLowerCase() == "dateclosed") {
                            opt.QuestionName = appScope.dynamicStrings.Lbl_RemovalDate;
                        }
                        if (position % 2 == 0) {
                            opt.ClassName = "section2LeftfieldsInJobDetails";
                        }
                        else {
                            opt.ClassName = "section2RightfieldsInJobDetails";
                        }
                    }
                    position = ++position;
                }
            }
        });
        var lastUpdatedValue = _.pluck(_.where(aoFields, { "VerityZone": "lastupdated" }), "AnswerValue").toString();
        if (that.jobDetailsFieldsToDisplay.Position1 != null && that.jobDetailsFieldsToDisplay.Position1.toLowerCase() == "lastupdated" && lastUpdatedValue.indexOf("T") > 0) {
            var asDate = new Date(lastUpdatedValue.split("T")[0].toString()); //Date Format is : 2014-08-11T00:00:00Z from Solr
            _.where(aoFields, { "VerityZone": "lastupdated" })[0].AnswerValue = that.shortMonthNames.split(',')[asDate.getUTCMonth()] + " " + asDate.getUTCDate(); // Changed Date Format is : 08/11/2014
        }
        return renderedFields;
    }
});


//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR DIRECTIVES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//IBM accessibility standards require anchors have an href even where click is handled in script
//This directive insures there will be no scrolling to top for "#" or reload for ""
tgCommon.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.href == undefined)
                $(elem).attr("href", "#0");
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#' || attrs.href == undefined) {
                elem.on('click', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
});

tgCommon.directive('ul', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            $(elem).contents().each(function () {
                if (this.nodeType == 3 && this.data.trim() == "")
                    $(this).data = "";
            });
        }
    };
});

tgCommon.directive('bindingHtmlusingjquery', function () {
    return function (scope, $el, attrs, controllers) {
        if (typeof scope.oQ != "undefined") {
            scope.$root.utils.format(scope, $el, attrs);
            $el.html(scope.oQ.Value);
            $el.find('*').removeAttr('style');
            scope.$root.utils.moreLink(scope, $el, attrs);
        }
    };
});

tgCommon.directive("fromTs", function () {
    //hide TG footer if Talent Suite footer is already shown
    return function (scope, $el, attrs) {
        if ($('#swfCoreFooter').is(':visible')) {
            $el.css("display", "none");
            //height 100% causing issue, when TG is launched from Talent Suite.(as Talent Suite append their own header and footers)
            $('body').css("height", "auto");
        }
    };
});

tgCommon.directive('fieldset', function () {
    //add radio input accessbility
    //WAI currently calls for handling of some keyboard shortcuts not supported by default in browsers
    //specifically ARROW + CTRL
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            var $fieldset = $(elem),
                $radioGroup = $fieldset.find("input[type=radio]").exists(),
                i;

            if ($radioGroup) {

                $fieldset.keydown(function (e) {
                    i = _.indexOf($radioGroup, $radioGroup.filter(":focus")[0]);

                    if (e.ctrlKey) {
                        switch (e.keyCode) {
                            case $.keyCodes.up:
                            case $.keyCodes.left:
                                i--;
                                break;

                            case $.keyCodes.down:
                            case $.keyCodes.right:
                                i++;
                                break;
                        }

                        //support circular navigation
                        if (i == $radioGroup.length)
                            i = 0;

                        $radioGroup.eq(i).focus();
                        return false;
                    }
                })
            }
            return true;
        }
    };
});

tgCommon.directive('handleSpacebar', function () {
    return function (scope, el, attrs) {
        var $el = $(el);

        $el.keydown(function (e) {
            if (e.keyCode == $.keyCodes.space)
                $el.click();
        })
    }
})

tgCommon.directive('close', function () {
    return {
        template: '<span class="dialog-close" handle-spacebar="" ng-enter="" aria-label="{{sClose}}" role="button" ng-click="closeClickHandler($event, this)" tabindex="0"></span>',
        replace: true,
        link: function (scope, el, attrs) {
            var $el = $(el),
                fnClose = scope.$eval(attrs.close),
                applicationScope, dependencies, ngDialog;

            applicationScope = window.appScope || parent.appScope;
            scope.sClose = attrs.label || (applicationScope && applicationScope.dynamicStrings && applicationScope.dynamicStrings.Button_Close) || "Close";

            if (attrs.close) {
                //accept a close click handler name as attribute value
                if (typeof (fnClose) == "function") {
                    scope.closeClickHandler = fnClose;
                }
                    //accept container to close selector as attribute value
                else {
                    scope.closeClickHandler = function () {
                        var $container = $el.closest(attrs.close || "div").hide(),
                            $trigger = $("a[aria-owns=" + $container.prop("id") + "]");

                        if ($trigger.exists)
                            $trigger.focus();
                    }
                }
            } else {
                //if we are in an iframe
                //and parent has angular dialogs
                //then close them
                dependencies = (parent && parent.angular && parent.angular.dependencies);
                ngDialog = dependencies && dependencies.ngDialog;
                if (ngDialog) {
                    scope.closeClickHandler = function () {
                        parent.$.restoreFocus();
                        ngDialog.closeAll();
                    }
                }
            }
        }
    }
});

tgCommon.directive('ibmDisabled', function () {
    //aria-disabled differs from disabled in that is maintains the control in the tab order
    //toggle aria-disabled by watching the expression in the attribute value
    //also toggle a disabled CSS class
    //and notify Jaws of changes (under construction)
    return {
        priority: 1,
        terminal: true,
        link: function (scope, el, attrs) {
            var $el = $(el),
                ngClick = attrs.ngClick,
                elements = window.appScope && window.appScope.elements,
                $screenReaderAnnouncement = $(".screenReaderAnnouncement").exists() || $("<div></div>").addClass("screenReaderText").attr("aria-live", "assertive").attr("aria-relevant", "text").insertAfter($el).uniqueId(),
                dynamicStrings = window.appScope && window.appScope.dynamicStrings,
                sEnabledMessage = dynamicStrings && dynamicStrings.Announcement_ButtonEnabled,
                sDisabledMessage = dynamicStrings && dynamicStrings.Announcement_ButtonDisabled,
                bInitializing = true;

            if (sEnabledMessage)
                sEnabledMessage = sEnabledMessage.replace("[*]", $el.text());

            if (sDisabledMessage)
                sDisabledMessage = sDisabledMessage.replace("[*]", $el.text());

            $el.addToAttr("aria-describedby", $screenReaderAnnouncement.prop("id")).click(function () {
                if ($el.attr("aria-disabled") != "true") {
                    scope.$eval(ngClick)
                }
            });

            scope.$watch(attrs.ibmDisabled, function (newValue, oldValue) {

                if (newValue) {
                    $el.addClass("disabled").attr("aria-disabled", "true");
                    // if disabled, need default text for initial page load as well as when not initializing
                    $screenReaderAnnouncement.text(sDisabledMessage || "");
                } else {
                    $el.removeClass("disabled").attr("aria-disabled", "false");
                    if (!bInitializing)
                        $screenReaderAnnouncement.text(sEnabledMessage || "");
                }

                setTimeout(function () {
                    scope.$apply();
                })

                bInitializing = false;
            });
        }
    };
});

tgCommon.directive('styledInput', function () {
    return function (scope, elem, attrs) {
        var $el = $(elem),
            sCssClass = "pseudo" + attrs.type,
            $pseudoInput = $("<span></span>").insertAfter($el).addClass(sCssClass);

        _.delay(toggleCheck);

        $el.change(toggleCheck);//in case hidden checkbox is changed programatically
        scope.$watch(attrs.ngModel, toggleCheck); //to check for 
        //avoid potential performance issues with rapid focus and blur on render
        //delay 300ms so rendering is probably complete but user has not had time to take an action
        _.delay(function () {
            $el.focus(function (e) {
                $(".pseudocheckbox.focus, .pseudoradio.focus").removeClass("focus");

                _.delay(function () {
                    $pseudoInput.addClass("focus");
                })
            }).blur(function (e) {
                $pseudoInput.removeClass("focus");
            }).change(toggleCheck);
        }, 300);

        function toggleCheck(e) {
            var bChecked = $el.prop("checked");

            if (e && attrs.type == "radio" && bChecked) {
                //if not initial call and we are a radio group and checking (as opposed to unchecking) uncheck all to start
                //(this code is only necessary due to IOS error firing change event for previously selected radio input)
                $el.closest("fieldset").find(".pseudoradio").toggleClass("checked", false);
            }

            $pseudoInput.toggleClass("checked", bChecked);
        }
    }
})

tgCommon.directive('alignLabels', function ($timeout) {
    return {
        link: function (scope, elem, attrs) {
            var alignHeightForLabels = function () {
                var firstNode = $(elem).find('label[id^=startyear]');
                var secondNode = $(elem).find('label[id^=endyear]');
                if (firstNode.length > 0 && secondNode.length > 0 && firstNode.height() != secondNode.height()) {
                    firstNode.css('padding-top', '0px');
                    secondNode.css('padding-top', '0px');
                    var nodeToBeUpdated = firstNode.height() > secondNode.height() ? secondNode : firstNode;
                    var paddingTopToBeUpdated = Math.abs(firstNode.height() - secondNode.height());
                    //Assign padding top to the Node with lesser height
                    nodeToBeUpdated.css('padding-top', paddingTopToBeUpdated);
                }
            }
            //Make sure that labels get aligned when the input is made visible
            scope.$watch(function () { return $(elem).find('input').is(':visible') }, function () {
                $timeout(alignHeightForLabels, 0);
            });
            $timeout(alignHeightForLabels, 0);
            $(window).on("resize", alignHeightForLabels);
        }
    }
});


tgCommon.directive('erase', function () {
    return function (scope, elem, attrs) {
        var $el = $(elem);

        $el.keydown(function (e) {
            if ($el.val() == "" && e.keyCode == $.keyCodes.back) {
                $(attrs.erase).click();
            }
        })
    }
})


tgCommon.directive('multiselect', function ($compile, $timeout) {
    //Add selection list to widget
    //Note that this applies to different flavors of widget, both select and autocomplete
    return {
        scope: true,
        link: function (scope, elem, attrs) {
            $timeout(function () {

                var bAutocomplete = elem[0].tagName == "INPUT",
                    sPlaceholder = attrs.placeholder,
                    $select = attrs.select ? $("#" + attrs.select) : $(elem),
                    $selectionContainer,
                    oWidget, $visibleControl;

                scope.sRemoveSelection = appScope.dynamicStrings.AriaLabel_RemoveSelection;
                scope.$select = $select;
                scope.aoSelections = getInitialSelections();
                scope.toggleSelection = toggleSelection;
                scope.isSelected = isSelected;
                scope.removeSelection = function (e, item) {
                    toggleSelection(e, { item: item });
                    $select.find("option[value=\'" + item.value + "\']").removeAttr("selected");
                    if (bAutocomplete) {
                        try {
                            $visibleControl.autocomplete("refresh");
                        } catch (error) {
                        }
                    } else {
                        $select.selectmenu("refresh");
                    }
                    clearInputText();
                    _.delay(function () {
                        $select.change().revalidate();
                    });
                }

                if ($(elem).hasClass("required"))
                    $select.addClass("required");

                if (bAutocomplete) {
                    $visibleControl = $(elem).parent();
                } else {
                    oWidget = $select.selectmenu({
                        select: toggleSelection,
                        close: function () {
                            oWidget.menu.hide();
                            clearInputText(sPlaceholder);
                        },
                        open: function () {
                            clearInputText();
                        },
                        isSelected: isSelected
                    }).selectmenu("instance");

                    $visibleControl = oWidget.button;

                    clearInputText(sPlaceholder);

                    oWidget.menu.hide();
                }

                $selectionsContainer = angular.element($compile('<ul class="selectionList" aria-live="polite"><li class="selection lightAccentBkg" ng-repeat="oSel in aoSelections" value="{{oSel.value}}">{{oSel.label}}<button type="button" class="closeButton remove" ng-click="removeSelection($event, this.oSel)"><span class="screenReaderText">{{sRemoveSelection}} {{oSel.label}}</span></button></li></ul>')(scope));

                $visibleControl.after($selectionsContainer);





                function toggleSelection(event, ui) {
                    if (isSelected(ui.item)) {
                        $select.find("option[value=\'" + ui.item.value + "\']").removeAttr("selected");
                        _.remove(scope.aoSelections, { value: ui.item.value });
                    }
                    else {
                        scope.aoSelections.push({ label: ui.item.label, value: ui.item.value });
                    }
                    _.delay(function () {
                        scope.$apply();
                        $select.change().revalidate();
                    });
                }

                function isSelected(item) {
                    return !!_.where(scope.aoSelections, { value: item.value }).length
                }

                function getInitialSelections() {
                    return _.map($select.children("option:selected"), function (sel) {
                        return { value: sel.value, label: sel.label };
                    });
                }

                function clearInputText(sPlaceholder) {
                    if (bAutocomplete)
                        $visibleControl.val("");
                    else
                        oWidget.button.children(".ui-selectmenu-text").text(sPlaceholder || "").toggleClass("prompt", sPlaceholder);
                }
            });
        }
    };
});

tgCommon.directive('laddaButton', function ($timeout) {
    //styles a loading state for buttons and links
    return {
        restrict: 'CA',
        link: function (scope, elem, attrs) {

            extendLadda();

            $timeout(function () {
                $(elem).configLadda();
            }, 0);
        }
    };
});

tgCommon.directive("loopComplete", function () {
    //execute a callback function when a loop is complete
    return function (scope, $el, attrs) {
        var sFn, obj;

        if (scope.$last) {
            sFn = attrs.loopComplete;
            if (scope[sFn])
                obj = scope
            else if (appScope[sFn])
                obj = appScope
            else if ($[sFn])
                obj = $;

            if (_.isFunction(obj[sFn]))
                obj[sFn].apply(obj, arguments);
        }
    };
});


tgCommon.directive("change", function () {
    //angular's ngChange event is really an onkeydown listener
    //so use our own directive
    return function (scope, $el, attrs) {
        $el.on("change", function (e) {
            if (scope[attrs.change])
                scope[attrs.change].call(scope, e, scope, $el);
            else
                scope.handlers[attrs.change].call(scope, e, scope, $el);
        });
        $el.on("keydown", function (e) {
            if (e.keyCode === $.keyCodes.enter) {//IE8 needs extra love to fire a change event on ENTER key down
                if (scope[attrs.change])
                    scope[attrs.change].call(scope, e, scope, $el);
                else
                    scope.handlers[attrs.change].call(scope, e, scope, $el);
                return false;
            }
        });
    };
});

tgCommon.directive("scroll", function ($window) {
    return function (scope, element, attrs) {
        angular.element($window).bind("scroll", function () {
            if (parseInt(document.documentElement.scrollTop) > 100 || parseInt($(document).scrollTop()) > 100)
                scope.scrollStart = false;
            else
                scope.scrollStart = true;


            var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
            scope.scrollBottom = scrollBottom;
            scope.$apply();

            if (!$(element).hasClass("buttonsFooter")) {
                $(element).css("bottom", "40px");
            }
            else {
                $(element).css("bottom", "0px");

            }
            //    setting scroll pointer div position when footer is present 
            if ($(".pageFooter") != null) {

                if (scrollBottom < $(".pageFooter").height()) {

                    if ($(".pageFooter").height() > 40)
                        $(element).css("bottom", $(".pageFooter").height() - scrollBottom);

                }
                else {

                    if (!$(element).hasClass("buttonsFooter")) {

                        $(element).css("bottom", "40px");
                    }
                    else {
                        $(element).css("bottom", "0px");
                    }
                }


                if (scrollBottom <= 5) {

                    if ($(".pageFooter").height() > 40)
                        $(element).css("bottom", $(".pageFooter").height());
                    else {
                        $(element).css("bottom", "40px");
                    }

                }
                else if (scrollBottom < 40 && $(".pageFooter").height() < 40) {
                    if ($(element).hasClass("buttonsFooter")) {
                        $(element).css("bottom", 40 - scrollBottom);
                        $(element).css("position", "unset");
                    }

                }
                else {
                    if ($(element).hasClass("buttonsFooter")) {
                        $(element).css("bottom", "0px");
                        $(element).css("position", "fixed");
                    }
                }


            }

        });
    };
});


tgCommon.directive("fixedPositionHack", function ($window) {
    //Currently certain Android devices have limited position fixed support
    //Position fixed elements move around during scroll actions and then jump to their proper location
    //This support is currently not detectable by modernizr or any other reasonable method
    //Sniff for the device, then fade the controls during scroll action
    return function (scope, element, attrs) {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {//sniff for Android

            scope.$root.$fixed = (scope.$root.$fixed || $()).add(element);

            $(_.once(function () {//execute only once on DOM ready

                var $fixed = appScope.$root.$fixed,
                    catchScrollInterval,
                    bFixedElementsAreVisible = true,
                    nLastScrollPos = $(window).scrollTop(),
                    tShowFailsafe;

                function hideFixedElements() {
                    bFixedElementsAreVisible = false;
                    $fixed.fadeTo(100, 0); //hide
                }

                function showFixedElements() {
                    bFixedElementsAreVisible = true;
                    $fixed.fadeTo(500, 1); //show
                    nLastScrollPos = $(window).scrollTop();
                    clearInterval(catchScrollInterval);
                }

                //assume no working scroll event
                //use touchstart and touchend
                $(document.documentElement).bind('touchstart', function (e) {
                    nLastScrollPos = $(window).scrollTop();
                    catchScrollInterval = setInterval(function () {
                        if (nLastScrollPos != $(window).scrollTop() && bFixedElementsAreVisible) {
                            nLastScrollPos = $(window).scrollTop();
                            hideFixedElements(e);
                            clearTimeout(tShowFailsafe);
                            tShowFailsafe = setTimeout(function () {
                                if (!bFixedElementsAreVisible)
                                    showFixedElements();
                            }, 2000)
                        }
                    }, 50);
                }).bind('touchend', function (e) {
                    setTimeout(showFixedElements, 500);
                });

            }));
        }
    };
});


tgCommon.directive("showMessage", function () {
    //given an anchor or button, show a message in its place when it is clicked
    //if the element is inside a dialog, center it afterwards
    return function (scope, $el, attrs) {
        var message = scope.$eval(attrs["showMessage"]),
            $dialog;

        $el = $($el);
        $dialog = $el.closest(".dialog");
        $el.show().next(".message").remove();//undo any changes from previous call
        if (!message)
            $el.hide();
        else
            $el.click(function (e) {
                $el.hide().after('<span class="message">' + message + "</span>");
                $dialog.center();
            });
    };
});

tgCommon.directive('ngRightClick', function ($parse) {
    //shows and positions a context menu on right click
    return function (scope, element, attrs) {
        if (scope.config) {
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    scope.contextMenu.showAtRightClickPosition(event, scope, element);
                });
            });
        }
    };
});

tgCommon.directive("renderCallback", function () {
    //all-purpose directive
    //calls callback method(s) when an element is placed in the DOM or attribute is parsed - the default angular directive timing
    //separate multple methods by commas
    return function (scope, $el, attrs, controllers) {
        _.each(attrs["renderCallback"].split(","), function (sMethod) {
            var fnMethod = scope.$eval(sMethod);
            if (fnMethod)
                fnMethod(scope, $el, attrs);
        });
    };
})

tgCommon.directive("captureValue", function () {
    //a bandaide method - use only when the data is not in the full response
    //capture the initial value in an input and place it in the scope
    //scope property name will be either (in order of preference) capture-value attribute, ng-model, name, or id attribute of the element
    return function (scope, $el, attrs) {
        scope.$root[attrs.captureValue || attrs.ngModel || attrs.name || attrs.id] = $el.val();
    };
})

tgCommon.directive("captureParsedValue", function () {
    //a bandaide method - use only when the data is not in the full response
    //capture the initial value in an input as a JSON object and place it in the scope
    //scope property name will be either (in order of preference) capture-value, ng-model, name, or id attribute of the element
    return function (scope, $el, attrs) {
        scope.$root[attrs.captureParsedValue || attrs.ngModel || attrs.name || attrs.id] = $el.val() ? JSON.parse(unescape($el.val())) : null;
    };
})
tgCommon.directive("captureParsedValueCallback", function () {
    //a bandaide method - use only when the data is not in the full response
    //capture the initial value in an input as a JSON object and place it in the scope
    //scope property name will be either (in order of preference) capture-value, ng-model, name, or id attribute of the element
    return function (scope, $el, attrs) {
        setTimeout(function () {
            scope.$root[attrs.captureParsedValue || attrs.ngModel || attrs.name || attrs.id] = $el.val() ? JSON.parse(unescape($el.val())) : null;
        }, 0);
    };

})

tgCommon.directive("captureEscapedParsedValue", function () {
    //a bandaide method - use only when the data is not in the full response
    //capture the initial value in an input as a JSON object and place it in the scope
    //scope property name will be either (in order of preference) capture-value, ng-model, name, or id attribute of the element
    return function (scope, $el, attrs) {
        scope.$root[attrs.captureEscapedParsedValue || attrs.ngModel || attrs.name || attrs.id] = $el.val() ? JSON.parse($el.val()) : null;
    };
})

tgCommon.directive("bindInitialValue", function () {
    //a bandaide method - use only when the data is not in the full response
    //attribute bindInitialValue="object.property" where object exists within the context of the scope
    return function (scope, $el, attrs) {
        var asModel = attrs.ngModel.split("."),
            val = $el.val();
        setTimeout(function () {
            scope[asModel[0]][asModel[1]] = val;
            scope.$apply();
        }, 0);
    };
})

tgCommon.directive("initWidget", function () {
    //initialize the specified widget passing the standard angular arguments
    return function (scope, $el, attrs) {
        var sWidget = attrs["initWidget"],
            oWidget = scope[sWidget] || scope.$root[sWidget] || scope.$root.$$childHead[sWidget];

        if (oWidget)
            oWidget.init(scope, $el, attrs);
    };
})

tgCommon.directive("jQuery", function () {
    //call any number of jQuery methods when the element renders
    //use standard jQuery chaining syntax with parentheses optional for a single method
    //arguments will be evaluated and may reference the scope
    //use single quotes for strings
    //sample use: <span j-query="rollDown(400).center().focus()">
    //sample use: <input j-query="focus">
    //sample use: <span j-query="myJQueryExtendedMethod(scope.myProperty, {foo: 'bar'})">

    return function (scope, $el, attrs) {
        _.delay(function () {
            //timing in angular directives is very touchy
            //generally the inner directives in templates execute first
            //but this may be reversed when an ng-if is present
            //thus the timeout delay
            $el = $($el);//angular element references are jQuery light, not fully tooled jQuery collections

            if (!attrs.jQuery)
                return;

            _.each(attrs.jQuery.replace(/\)$/, "").split(")."), function (sRaw, i) {
                var aRaw = sRaw.split("("),
                    aArgs = aRaw[1] ? aRaw[1].split(",") : [],
                    sMethod = aRaw[0],
                    bUndefinedScopeVarInArgument = false;

                _.each(aArgs, function (sArg, i) {
                    if (sArg.indexOf("'") == -1)
                        try {
                            aArgs[i] = angular.nearestScopeVal(sArg, scope) || eval(sArg);
                        }
                        catch (error) {
                            bUndefinedScopeVarInArgument = sArg;
                        }
                });

                if (bUndefinedScopeVarInArgument)
                    return;
                else
                    $el[sMethod].apply($el, aArgs);

            });
        })

    };
});

tgCommon.directive("trapFocus", function () {
    return function (scope, $el, attrs) {
        _.delay(function () {
            $($el).trapFocus(attrs.trapFocus);
        })
    };
});

tgCommon.directive('dynamicHtml', function ($compile) {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, $el, attrs) {
            scope.$watch(attrs.dynamicHtml, function (html) {
                $el[0].innerHTML = html;
                $compile($el.contents())(scope);
            });
        }
    };
});

tgCommon.directive('ngEnter', function () {
    //assigns enter key listener
    return function (scope, $el, attrs) {
        $el = $($el).enter(function (event) {
            var fn = scope.$eval(attrs.ngEnter) || function () {
                $el.click();
            };

            fn(event, scope, $el);
            scope.$apply();
        })
    };
});

tgCommon.directive('ngSpace', function () {
    //assigns enter key listener
    return function (scope, $el, attrs) {
        $el = $($el).keypress(function (event) {
            if (event.keyCode == 0 || event.keyCode == 32) {
                var fn = scope.$eval(attrs.ngSpace) || function () {
                    $el.click();
                };

                fn(event, scope, $el);
                scope.$apply();
            }
        })
    };
});




tgCommon.directive('collapse', function ($compile, $timeout) {
    return {
        restrict: "E,A",
        scope: {},
        transclude: true,
        templateUrl: 'collapsibleTemplate',
        link: function (scope, el, attrs) {
            var $el = $(el),
                oTranslations = scope.$root.dynamicStrings || {};

            //first get rid of possible more or less elements which only serve to convey strings
            scope.more = attrs.more || $el.prevAll("more").remove().text() || (oTranslations.Link_More) || "more";
            scope.less = attrs.less || $el.prevAll("less").remove().text() || (oTranslations.Link_Less) || "less";

            //for screen reader link list, we need to differentiate the link with some meaningful string
            var I_MAX_DIFFERENTIATOR_LENGTH = 40,
                sPriorTextNodeContent = $el[0] && $el[0].previousSibling && $el[0].previousSibling.nodeValue,
                sPriorText = sPriorTextNodeContent || $el.prev().text().trim(),
                sPriorLastSentence = _.last(sPriorText.split("."));

            scope.sScreenReaderDifferentiator = sPriorLastSentence || $el.text().trim() || "";
            scope.leading = oTranslations.LinkSuffixForList_Leading;
            scope.trailing = oTranslations.LinkSuffixForList_Trailing;

            if (scope.sScreenReaderDifferentiator.length > I_MAX_DIFFERENTIATOR_LENGTH)
                scope.sScreenReaderDifferentiator = scope.sScreenReaderDifferentiator.substr(0, I_MAX_DIFFERENTIATOR_LENGTH) + "...";
        }
    }
})

tgCommon.directive('moreLess', function () {
    return {
        scope: {},
        templateUrl: 'moreLessTemplate',
        replace: true,
        link: function (scope, el, attrs) {
            scope.sClass = attrs.moreLess;
            scope.label = attrs.moreLess;
            scope.sScreenReaderDifferentiator = scope.$parent.sScreenReaderDifferentiator + (attrs.positionText || "");
            scope.expandCollapse = function ($event) {
                var $target = $($event.target),
                    $container = $target.closest(".collapsibleBlockWrapper"),
                    $collapsibleBlock = $container.find(".collapsibleBlock"),
                    $linkWrappers = $container.find(".moreLessLinkWrapper");

                $linkWrappers.toggle();
                $collapsibleBlock.slideToggle(function () {
                    $linkWrappers.filter(":visible").find("a").eq(0).focus();
                });
            }
        }
    }
});









tgCommon.directive('backgroundImage', function () {
    //assigns an image source to the tgTheme selected value of the property referenced in this attrubute
    //implementation as a proper css background image confounded by poor ie8 support for css3 background image properties
    return function (scope, $el, attrs) {
        $el = $($el).attr("brand-property", attrs.backgroundImage);
        scope.$watch(function () {
            return tgTheme.data[attrs.backgroundImage].selected;
        }, function () {
            $el.attr("src", tgTheme.data[attrs.backgroundImage].selected);
        })
    }
});

tgCommon.directive("shieldClicks", function () {
    //for preventing clicks in iframes controlled by third parties such as social media providers
    //if the attribute value is true or blank,
    //place a anchor before it to shield clicks 
    //anchor can be used in conjunction with confirmNavInConfigMode
    return function (scope, $el, attrs) {
        $el = $($el);

        //execute if there is no boolean specified or the boolean is true in the scope
        if (!attrs["shieldClicks"] || scope.$eval(attrs["shieldClicks"])) {
            $el.before('<a class="clickShield" href></a>');

            //it's possible that some elements which may contain iframes
            //are configurable and may simply never be populated
            //remove the click shield from such elements to prevent phantom cursor changes and click handlers
            $el.prev("a.clickShield").one("mouseover click touchstart", function () {
                if (!$el.html())
                    $el.prev().remove();
            });
        }
    };
});


tgCommon.directive('confirmNavInConfigMode', function () {
    //in config mode, leaving the page to go to legacy pages presents problems
    //alert and block or just confirm navigation
    //via any child element
    var B_CONFIRM_NGCLICK = true;
    var oDynamicStrings = (window.appScope && appScope.dynamicStrings) || JSON.parse(unescape($("#dynamicStrings").attr("value"))),
         S_CONFIRMATION_MESSAGE = oDynamicStrings["VBT_WarningMessage"] || ("The Visual Branding Tool does not control branding configurations for the selected screen(s).");
    sMethod = window.location.host == "localhost" ? "confirm" : "alert";

    return function (scope, $el, attrs) {
        if (scope.bConfigMode)
            _.delay(function () {
                $el = $($el);
                $el.find("[href], .clickShield").not("[href=#], [href=#0]").click(function (e) {
                    if (!navAfterMessage())
                        e.preventDefault();
                });
                if (B_CONFIRM_NGCLICK) {
                    $el.find("[ng-click][external-link]").each(function () {
                        var sNgClickHandler = (this.getAttribute("ng-click") || "").replace(/\(.*\)/g, ""),
                            fnNgClickHandler = scope[sNgClickHandler];


                        if (fnNgClickHandler && !fnNgClickHandler.hasConfirmation) {
                            scope[sNgClickHandler] = function () {
                                var e = _.find(arguments, { type: "click" }),
                                    elTarget = e && e.target || document.activeElement;

                                //note that the ngclick handler is being altered 
                                //for all elements that refer to it from any scope
                                //it could be a broadly defined method
                                //so we check for an external-link attribute before blocking navigation via ng-click
                                if ($(elTarget).closest("[ng-click]").attr("external-link") === undefined || navAfterMessage()) {
                                    fnNgClickHandler.apply(scope, arguments);
                                }
                            };
                            scope[sNgClickHandler].hasConfirmation = true;
                        }
                    })
                }

                function navAfterMessage() {
                    return window[sMethod](S_CONFIRMATION_MESSAGE) && sMethod == "confirm";
                }
            })
    }
});


tgCommon.directive('leaveApply', function (ngDialog, $timeout) {

    angular.dependencies.ngDialog = ngDialog;//expose ngDialog factory class for editing

    return function (scope, $el, attrs) {
        if (!scope.bConfigMode) {
            $el = $($el);
            $el.click(function (e) {

                var gqData = angular.fromJson($("#pagemetadata").val());
                var bSaveAsDraft = false;
                var saveaAsDraftButton = $('#saveasdraft');
                if (saveaAsDraftButton.is(":visible"))
                    bSaveAsDraft = true;
                if (gqData && bSaveAsDraft) {
                    scope.daysInDraft = gqData.daysdraft;
                    scope.bSaveDraft = true;
                } else {
                    scope.bSaveDraft = false;
                }
                var dialog = ngDialog.open({
                    template: 'LeaveApplyTemplate',
                    className: 'ngdialog-theme-default leavingWarningContent',
                    showClose: true,
                    closeByDocument: false,
                    appendTo: "#menuContainer",
                    ariaRole: "dialog",
                    scope: scope
                });
                dialog.closePromise.then(function (data) {
                    if (data.value == '1') {
                        if (gqData && bSaveAsDraft) {
                            $timeout(function () {
                                angular.element(saveaAsDraftButton).triggerHandler('click');
                            }, 0);
                        }
                        window.location = $el.attr("href");
                    } else {
                        angular.beforeDialogClose();
                    }
                });
                e.preventDefault();
            });
        }
    }
});

tgCommon.directive('ngdialog', function () {
    return {
        restrict: 'C',
        scope: {},
        link: function (scope, el, attrs) {
            setTimeout(function () {
                var $el = $(el),
                    sDescBy = $el.find("#dialogDesc").prop("id"),
                    sTitleId = $el.find(".title").uniqueId().prop("id"), sTitle = $el.find("iframe").prop("title");
                if (typeof sDescBy == 'undefined' || sDescBy == '' || sDescBy == null) {
                    if ($el.find(".dialogWithDescription").length > 0) {
                        sDescBy = "dialogDesc";
                    }
                }
                if (sTitle) {
                    sTitleId = "iframeDialogTitle";
                    $el.append("<label id='" + sTitleId + "' class='screenReaderText'>" + sTitle + "</label>");
                }
                $el.attr({
                    role: "dialog",
                    "aria-labelledby": sTitleId
                });
                if (sDescBy) {
                    $el.addToAttr("aria-describedby", sDescBy);
                }
                $el.unbind('click');
            }, 0);

        }
    };
});

tgCommon.directive('ngdialogContent', function () {
    return {
        restrict: 'C',
        scope: {},
        link: function (scope, el, attrs) {
            var $el = $(el),
                sTitleId = $el.find(".title").uniqueId().prop("id"), sTitle = $el.find("iframe").prop("title");
            setTimeout(function () {
                $el.unbind('click');
                $el.scrollTop(0);
            }, 200)
            //if (sTitle) {
            //    sTitleId = "iframeDialogContentTitle";
            //    $el.append("<label id='" + sTitleId + "' class='screenReaderText'>" + sTitle + "</label>");
            //}
        }
    };
});


tgCommon.directive('ngdialogClose', function (ngDialog) {
    return {
        restrict: 'C',
        scope: {},
        link: function (scope, el, attrs) {
            var $el = $(el),
                sClose = (appScope && appScope.dynamicStrings) ? appScope.dynamicStrings.Button_Close : "Close";
            $el.addClass("link");
            $el.prependTo($el.closest(".ngdialog-content")).bind('click', function () {
                var id = $el.closest(".ngdialog").attr('id');
                ngDialog.close(id);
            }).enter(function () {
                $el.click();
                scope.$apply();
            }).keydown(function (e) {
                if (e.keyCode == $.keyCodes.space) {
                    $el.click();
                    scope.$apply();
                }
            }).attr({
                tabindex: "0",
                role: "button",
                "aria-label": sClose
            });
        }
    };
});



tgCommon.directive('captureElement', function () {
    //places a reference to the DOM element as a fully tooled jQuery object
    //as part of elements object instantiated in the root scope (by utilities init)
    //useful for avoiding selectors
    return function (scope, $el, attrs) {
        scope.$root.elements[attrs.captureElement || $el[0].id || $el[0].name || $($el[0]).classList()[0]] = $($el);
    };
});

tgCommon.directive('captureElementLocal', function () {
    //places a reference to the DOM element as a fully tooled jQuery object
    //as part of elements object instantiated in the root scope (by utilities init)
    //useful for avoiding selectors
    return function (scope, $el, attrs) {
        scope.elements = scope.elements || {};
        scope.elements[attrs.captureElement || $el[0].id || $el[0].name || $el[0].tagName.toLowerCase()] = $($el);
    };
});


tgCommon.directive('captureValidString', function ($timeout) {
    //fires a callback for string input which passes a test method
    //expects the attribute to be set to a config object in the scope
    //with properties fnTest, fnSuccess, and asCaptureKeys
    return {
        scope: {
            oConfig: "=captureValidString"
        },
        link: function (scope, $el, attrs) {
            var aKeyCodes = [];

            if (scope.oConfig === false)
                return;

            _.each(scope.oConfig.asCaptureKeys, function (val) {
                aKeyCodes.push($.keyCodes[val] || (_.isNumber(val) ? val : val.charCodeAt(0)));
            });

            $($el).keydown(fnTest).blur(fnTest);


            function fnTest(e) {
                if (e.type == "blur" || _.contains(aKeyCodes, e.keyCode)) {
                    if (scope.oConfig.fnTest(scope, $el, $el.val(), e)) {
                        scope.oConfig.fnSuccess(scope, $el, $el.val());
                    }
                    else 
                        (scope.oConfig.fnFailure || _.noop)(scope, $el, $el.val());
                }
            }

        }
    }
});

tgCommon.directive('numeric', function () {
    return function (scope, el, attrs) {
        var $el = $(el);

        $el.filterInput(/[0-9]/).keydown(function (e) {
            var val = Number($el.val() || 0);

            _.delay(function () {

                //first check to see if browser is already handling arrow key action
                if ($el.val() === val) {

                    if (e.keyCode === $.keyCodes.down && val > 0)
                        $el.val(val - 1);
                    if (e.keyCode === $.keyCodes.up)
                        $el.val(val + 1);
                }
            });

            return true;
        });
    }
});

tgCommon.directive('striped', function () {
    //row striping polyfill for ie8 when not in a repeat
    //please just use ng-class-odd / ng-class-even in ng repeats
    return function (scope, $el, attrs) {
        setTimeout(function () {
            $($el).children().each(function (i) {
                if (i % 2)
                    $(this).addClass("even");
                else
                    $(this).addClass("odd");
            })
        }, 0)
    }
})

tgCommon.directive('typeAhead', function ($timeout) {
    //type-ahead widget
    //currently accepts function, array of strings, or collection of flat objects as data
    return {
        link: function (scope, $el, attrs) {
            if (scope.$eval(attrs.typeAhead) === false)
                return;

            $el = $($el);

            var sTypeAheadHint = "",
                iTypeAheadMatchIndex = -1,
                uData, $clone, $options, oTypeAheadConfig, fnCallBack, fnSource, fnSelectHandler, sPriorMatch, bMatchAlertCompleted;


            _.delay(function () {
                $clone = $el.ghost().addClass("typeAhead").attr("aria-hidden", "true");//hide type ahead span and place text in status div

                $el.keyup(typeAhead).keydown(captureTypeAhead).selectTextOnFocus().addClass("hasTypeAhead").addClass("hasClone");

                scope.$watch(attrs.ngModel, typeAhead);

                oTypeAheadConfig = scope.oConfig ? scope.oConfig.typeAheadConfig || scope.oConfig : {};
                if (typeof (oTypeAheadConfig.source) == "function") {
                    fnCallBack = oTypeAheadConfig.typeAheadCallBack = typeAhead;
                    fnSource = oTypeAheadConfig.source;
                }

                try {
                    if (attrs.typeAhead)
                        uData = scope.$eval(attrs.typeAhead) || eval(attrs.typeAhead);
                } catch (Error) {
                }
                if (typeof (uData) == "function")
                    fnSource = uData;

                fnSelectHandler = attrs.selectHandler ? scope.$eval(attrs.selectHandler) : oTypeAheadConfig.selectHandler;
            })


            function typeAhead(event) {
                var B_PREVENT_DUPLICATE_ANNOUNCEMENTS = false,
                    sMatch = "",
                    iMatchIndex = -1;

                if (typeof (event) == "object") {
                    //we are here directly via a keyup

                    if (event.keyCode < 48) {
                        clearTypeAheadIfInvalid();
                        return;//all these keystrokes require no action
                    }

                    if (fnCallBack) {
                        return;//wait for the call-back if it is configured
                    }
                }

                if (fnSource && $el.hasClass('ng-dirty')) {
                    uData = fnSource(scope, $el, attrs) || [];
                    sMatch = uData[0] || "";
                } else {
                    try {
                        uData = scope.$eval(attrs.typeAhead) || eval(attrs.typeAhead);//unfortunately there is no way to know when data arrives, so even for static data this must execute many times on key up
                    } catch (Error) {
                    }

                    if (_.isArray(uData) && uData.length) {
                        _.find(uData, function (val, i) {
                            if (typeof (val) == "string")
                                return isMatch(val, i);
                            else if (attrs.typeAheadField)
                                return isMatch(val[attrs.typeAheadField], i);
                        });

                        iTypeAheadMatchIndex = iMatchIndex;
                    }
                }

                sTypeAheadHint = sMatch.replace(new RegExp('(' + $el.val() + ')', 'i'), $el.val());

                clearTypeAheadIfInvalid();

                bMatchAlertCompleted = sMatch == sPriorMatch && $clone.attr("role") != "alert";

                if (sTypeAheadHint && attrs.announceTypeAhead && !(B_PREVENT_DUPLICATE_ANNOUNCEMENTS && bMatchAlertCompleted)) {
                    $clone.attr({ tabindex: 0, role: "alert" }).removeAttr("aria-hidden");
                    sTypeAheadHint = scope.$eval(attrs.announceTypeAhead).replace("[hint]", sTypeAheadHint);
                    scope.$parent.typeAheadAnnouncement = sTypeAheadHint.replace(/(<([^>]+)>)/ig, "");//strip screenreader tags
                    setTimeout(function () {
                        $clone.removeAttr("tabindex role").attr("aria-hidden", "true");
                        scope.$parent.typeAheadAnnouncement = "";
                    }, 1000);//need enough time to be consumed by local code like referral.js $scope.announceFilteredListChange which uses shorter timeout for throttling
                }

                sPriorMatch = sMatch;

                $clone.html(sTypeAheadHint || "");

                scope.$parent.typeAheadHint = (sTypeAheadHint || "");

                function isMatch(val, i) {
                    var bSuccess = val.toLowerCase().indexOf($el.val().toLowerCase()) == 0;
                    if (bSuccess) {
                        sMatch = val;
                        iMatchIndex = i;
                    }
                    return bSuccess;
                }
            };

            function clearTypeAheadIfInvalid() {
                var sTyped = $el.val();

                //very easy for the hint to get out of sync
                if (!$.stringContains(sTypeAheadHint, sTyped, true) || sTypeAheadHint.length <= sTyped.length || sTyped == "" || sTyped.length >= $el.prop("size")) {
                    clearTypeAhead(false);//if the existing type ahead hint is no longer valid, clear it
                }
            }

            function captureTypeAhead(event) {

                if ((event.keyCode == $.keyCodes.tab || event.keyCode == $.keyCodes.right) && !event.shiftKey && sTypeAheadHint.indexOf($el.val()) == 0 && $el.val() != sTypeAheadHint) {
                    _.setReferencedProp(scope, attrs.ngModel, sTypeAheadHint);
                    $clone.text("");
                    if (event.keyCode != $.keyCodes.right) {
                        scope.oInput.text = $el.val();
                        //scope.oInput.text = "";
                    }
                    scope.$apply();
                    //event.preventDefault();
                }

                if (event.keyCode == $.keyCodes.escape) {
                    clearTypeAhead(false);
                }

                if (event.keyCode == $.keyCodes.enter && ($el.val() || (uData && uData.length == 1))) {
                    if (fnSelectHandler) {
                        fnSelectHandler(iTypeAheadMatchIndex, scope, $el);
                    }
                    clearTypeAhead(false);
                }

            };

            function clearTypeAhead(bClearMainInput) {
                $clone.text("");
                sTypeAheadHint = "";
                scope.$parent.typeAheadHint = "";
                if (bClearMainInput !== false) {
                    $el.val("");
                    if (attrs.ngModel)
                        scope[attrs.ngModel] = "";//todo: handle nested reference
                }
                $timeout(function () {
                    scope.$apply();
                });
            }
        }
    }
});

tgCommon.directive('autocomplete', function () {
    return {
        templateUrl: function ($el, attrs) {
            if (attrs.autocomplete == "on" || attrs.autocomplete == "off")
                //if this is the standard HTML attr get out of here
                return 'nullTemplate';
            else
                return 'autocompleteTemplate';
        },
        scope: true,
        replace: false,
        link: function (scope, el, attrs) {
            var $el = $(el),
                $label = $el.prev('label');

            if (attrs.autocomplete == "on" || attrs.autocomplete == "off" || attrs.autocomplete == "new-password")
                //if this is the standard HTML attr get out of here
                return;

            scope.prefix = $el[0].id || $el.closest("[id]").prop("id");
            if (_.contains(scope.prefix, "}}"))
                scope.prefix = angular.nearestScopeVal("id", scope) + "_auto-input";
            scope.oConfig = angular.nearestScopeVal(attrs.autocomplete, scope);
            //If its a PowerSearch, Get the Values from respective keyword and location searches.
            if (attrs.autocomplete == "powerSearchKeyWordSearch") {
                scope.oConfig.text = angular.nearestScopeVal("keyWordSearch", scope).text;
            }
            else if (attrs.autocomplete == "powerSearchLocationSearch") {
                scope.oConfig.text = angular.nearestScopeVal("locationSearch", scope).text;
            }
            scope.qid = scope.prefix + "_" + (scope.oConfig.inputType || "") + "_" + scope.$id;
            scope.role = attrs.role || scope.oConfig.role || "combobox";
            if ($label.exists() && $label.prop("id"))
                $el.attr("aria-labelledby", $label.prop("id"));

            if (!$label.exists() && scope.oConfig.prompt) {
                $el.attr("input-label", scope.oConfig.prompt);
            }

            if (attrs.ariaDescribedby) {
                setTimeout(function () {
                    var $input = $el.find("input"),
                        sDescribedBy = $input.attr("aria-describedby") || "";

                    $input.addToAttr("aria-describedby", sDescribedBy);
                }, 0);
            }

            setTimeout(function () {
                var $input = $el.find("input");
                $input.addToAttr("onkeypress", "return true;");
                $input.addToAttr("aria-autocomplete", "list");
            }, 0);

            if (attrs.advsearch == "1" || attrs.advsearch == undefined) {
                scope.oConfig.searchButton = true;
                scope.oConfig.submitAfterSelection = false;
            }
            else {
                scope.oConfig.searchButton = true;
                scope.oConfig.submitAfterSelection = true;
            }
            if (scope.oConfig.text != undefined)
                scope.oInput = scope.oConfig//single autocomplete uses config - ng-model pulls text from config
            else
                scope.oInput = {
                    text: ""//many autcompletes share the config - ng-model will reflect the isolate scope
                };
            scope.clearInput = function (event) {
                scope.oInput.text = "";
                var id = scope.prefix + '_' + scope.oInput.inputType;
                $(event.target).prevAll("input.ui-autocomplete-input").focus();
                if (scope.oInput.inputType == 'keyWordSearch' || scope.oInput.inputType == 'locationSearch')
                    $("#" + id).focus();
            }
            scope.oConfig.inputType = attrs.autocomplete;
        }
    }
})

tgCommon.directive('datepicker', function () {
    return {
        templateUrl: function ($el, $attr) {
            if ($attr.hasOwnProperty("refdate"))
                //if refDate exist then add the custom template
                return 'RefdateTemplate';
            else
                //else add the default template
                return 'dateTemplate';
        },
        scope: {},
        replace: true,
        compile: function (element, attributes) {

            return {
                pre: function (scope, element, attributes, controller, transcludeFn) {

                },
                post: function (scope, el, attrs) {
                    var $el = $(el),
                        aRange = (attrs.range && attrs.range.split(",")) || [100, 100],
                        thisYear = new Date().getFullYear(),
                        $legend = $el.closest("fieldset").children("legend"),
                        $label = $el.prev('label'),
                        labelledby = attrs.labelledby || $legend.prop("id") || $label.prop("id"),
                        milliseconddate, aDate, date;

                    scope.dateLabel = $legend.text() || "";
                    scope.id = angular.element(el).scope().id || attrs.inputName || "datepicker" + scope.$id;
                    scope.inputName = attrs.inputName || "";
                    scope.required = attrs.ngRequired || "";

                    setTimeout(function () {
                        if ($el.find("input").hasClass('required')) {
                            scope.required = true;
                        }
                        if (scope.required == true) {
                            $el.find("input").attr("aria-required", true);
                        }
                    }, 0);

                    scope.inputClass = attrs.inputClass || "";
                    scope.oInput = { text: "" };
                    scope.oConfig = _.clone(angular.nearestScopeVal(attrs.datepicker, scope));
                    scope.oConfig.datepickerConfig = _.clone(scope.oConfig.datepickerConfig);//second shallow clone to get discrete datepicker config object
                    scope.oConfig.datepickerConfig.minDate = new Date(thisYear - Number(aRange[0]) - 1, 11, 31);
                    scope.oConfig.datepickerConfig.maxDate = new Date(thisYear + Number(aRange[1]) + 1, 0, 1);
                    var dateFormat = "m/d/yy";
                    var placeHolderDateFormat = "m/d/yyyy";
                    if (typeof appScope != "undefined" && typeof appScope.dynamicStrings != "undefined") {
                        if (typeof appScope.dynamicStrings.DateFormat != "undefined") {
                            dateFormat = appScope.dynamicStrings.DateFormat;
                        }
                        if (typeof appScope.dynamicStrings.PlaceHolder_DateFormat != "undefined") {
                            placeHolderDateFormat = appScope.dynamicStrings.PlaceHolder_DateFormat;
                        }
                    }

                    scope.oConfig.datepickerConfig.dateFormat = dateFormat;
                    $el.find("input").attr("placeholder", placeHolderDateFormat);
                    $el.find(".screenReaderText").html(placeHolderDateFormat);
                    $.datepicker.setDefaults($.datepicker.regional[scope.oConfig.datepickerConfig.localeCode]);

                    if (attrs.labelledby && $legend.exists()) {
                        setTimeout(function () {
                            $el.find("input").attr("aria-labelledby", $legend.uniqueId().prop("id") + " " + labelledby);
                        }, 0);
                    }

                    scope.oConfig.startEmpty = attrs.startEmpty;

                    if (attrs.date)
                        scope.oConfig.startEmpty = "";//in power search date value trumps start empty value

                    if (!scope.oConfig.startEmpty) {
                        //start empty attribute loads an empty text input with no date selected in calendar
                        //otherwise accept both milliseconds and YMD
                        if (attrs.date) {
                            millisecondsdate = Date.parse(attrs.date);
                            date = new Date(millisecondsdate);
                        } else if (attrs.yMD) {
                            aDate = attrs.yMD.split(" ");
                            date = new Date();
                            date.setFullYear(aDate[0]);
                            date.setMonth(aDate[1] - 1);
                            date.setDate(aDate[2]);
                        } else {
                            date = new Date();
                        }

                        setTimeout(function () {
                            //once the datepicker is instantiated
                            //set its date based on the date object 
                            var $input = $($el).find("input").datepicker('setDate', date);

                            if (attrs.date != "" && $input.val() == "") {
                                //preventive Fix, if Datepicker fails to initialize with predefined value within 1200timeout
                                setTimeout(function () {
                                    $input = $($el).find("input").datepicker('setDate', date);
                                    scope.oInput.text = $input.val();
                                    scope.$apply();
                                }, 1500);
                            }
                            else {
                                scope.oInput.text = $input.val();
                                scope.$apply();
                            }
                        }, 1200);
                    }


                    scope.clearInput = function (event) {
                        var $clearIcon = $(event.target),
                            $button = $clearIcon.next("button"),
                            $input = $clearIcon.prevAll("input");

                        scope.oConfig.text = "";
                        scope.oInput.text = "";

                        if (scope.question)
                            scope.question.Value = "";

                        $input.after($button);

                        setTimeout(function () {
                            $input.change().revalidate();
                        })
                    }
                }
            }
        }
    }
})

tgCommon.directive('dateValidator', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            var dateValidator = attr.dateValidator;
            var form = $("#" + attr.form);
            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                return triggerdateValidation(value);
            });
            appScope.$on('datevalidate', function (datevalidate) {
                return triggerdateValidation();
            });

            function triggerdateValidation(value) {
                ngModel.$setValidity('dateString', true);
                ngModel.$setValidity('dateRange', true);

                var isConfirmField = elem.attr('id').indexOf('confirm') > 0;
                if (isConfirmField) {
                    ngModel.$setValidity('confirmdate', true);
                }

                if (value == undefined)
                    value = ngModel.$modelValue;

                if (!ngModel.$error["required"] && appScope.RefDetailSubmit && value != "") {
                    if (!datestring(value)) {
                        ngModel.$setValidity('dateString', false);
                        elem.addClass('haserror');
                        elem.removeClass('valid');
                    } else if (!daterange(value)) {
                        ngModel.$setValidity('dateRange', false);
                        elem.addClass('haserror');
                        elem.removeClass('valid');
                    } else if (isConfirmField && !equalConfirmFields(elem.attr('id'), value)) {
                        ngModel.$setValidity('confirmdate', false);
                        elem.addClass('haserror');
                        elem.removeClass('valid');
                    } else {
                        elem.addClass('valid');
                        elem.removeClass('haserror');
                    }
                } else if (isConfirmField && !ngModel.$error["required"] && appScope.RefDetailSubmit && !equalConfirmFields(elem.attr('id'), value)) {
                    ngModel.$setValidity('confirmdate', false);
                    elem.addClass('haserror');
                    elem.removeClass('valid');
                } else {
                    elem.addClass('valid');
                    elem.removeClass('haserror');
                }
                return value;
            }

            function datestring(value) {
                var aDate = getDefaultDateFormat(value).split("/"),
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
            }
            function daterange(value) {
                var $element = elem,
                inst = $element.data().datepicker,
                minDate = $.datepicker._getMinMaxDate(inst, "min"),
                maxDate = $.datepicker._getMinMaxDate(inst, "max"),
                date = new Date(getDefaultDateFormat(value));

                var valid = date < maxDate && date > minDate;
                return valid;
            }
            function getDefaultDateFormat(inputDate) {
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
            }
            function equalConfirmFields(id, value) {
                if (value != $('#' + id.replace('confirm', '')).val())
                    return false;
                else
                    return true;
            }
        }
    };
});

tgCommon.directive('daterangepicker', function () {
    return {
        templateUrl: 'dateRangeTemplate',
        scope: {},
        replace: true,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    var sDate = iAttrs.date || angular.nearestScopeVal("question", scope).Value,
                        aDate = sDate ? sDate.split(",") : [];

                    scope.sIdStem = iAttrs.id || scope.$id;
                    scope.date1 = aDate[0] || "";
                    scope.date2 = aDate[1] || "";
                }
            }
        }
    }
})
tgCommon.directive('counter', function ($compile, $timeout) {
    return {
        restrict: 'A',
        scope: { value: '=value' },
        templateUrl: 'counterInput',
        link: function (scope, element, attributes) {
            $timeout(function () {
                // Make sure the value attribute is not missing.
                var oInput = attributes.value;
                scope.labeltext = attributes.labeltext;
                scope.id = angular.element(element).scope().id || attributes.inputName || "InputCounter" + scope.$id;
                scope.inputName = attributes.inputName || "";
                scope.required = attributes.ngRequired || "";
                scope.plustext = angular.isUndefined(attributes.plustext) ? "plus" : attributes.plustext;
                scope.minustext = angular.isUndefined(attributes.minustext) ? "plus" : attributes.minustext;

                setTimeout(function () {
                    if (element.find("input").hasClass('required')) {
                        scope.required = true;
                    }
                    if (scope.required == true) {
                        element.find("input").attr("aria-required", true);
                    }
                }, 0);

                scope.inputClass = attributes.inputClass || "";

                if (angular.isUndefined(scope.value)) {
                    scope.value = appScope[attributes.value];
                    console.log("partho your missing the value attribute on the counter directive.");
                }
                var inverse = angular.isUndefined(attributes.inverse) ? false : true;
                scope.min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
                scope.max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
                var step = angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step);
                var changeevent = "appScope." + attributes.onvalchange + '()';
                element.addClass('counter-container');

                attributes.$observe('min', function (value) {
                    scope.min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
                    console.log("min" + scope.min + "name" + scope.inputName);
                });
                attributes.$observe('max', function (value) {
                    scope.max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
                    console.log("max" + scope.max + "name" + scope.inputName);
                });

                // If the 'editable' attribute is set, we will make the field editable.
                scope.readonly = angular.isUndefined(attributes.editable) ? true : false;

                /**
                 * Sets the value as an integer.
                 */
                var setValue = function (val) {
                    appScope[oInput] = scope.value = parseInt(val);
                }

                // Set the value initially, as an integer.
                setValue(scope.value);

                /**
                 * Decrement the value and make sure we stay within the limits, if defined.
                 */
                scope.minus = function () {
                    if (inverse) {
                        if (scope.max && (scope.value >= scope.max || scope.value + step >= scope.max)) {
                            setValue(scope.max);
                            return false;
                        }

                        setValue(scope.value + step);
                    }
                    else {
                        if (scope.min && (scope.value <= scope.min || scope.value - step <= scope.min) || scope.min === 0 && scope.value < 1) {
                            setValue(scope.min);
                            return false;
                        }

                        setValue(scope.value - step);
                    }
                    setTimeout(function () {
                        eval(changeevent)
                    })
                };

                /**
                 * Increment the value and make sure we stay within the limits, if defined.
                 */
                scope.plus = function () {
                    if (inverse) {
                        if (scope.min && (scope.value <= scope.min || scope.value - step <= scope.min) || scope.min === 0 && scope.value < 1) {
                            setValue(scope.min);
                            return false;
                        }

                        setValue(scope.value - step);
                    }
                    else {
                        if (scope.max && (scope.value >= scope.max || scope.value + step >= scope.max)) {
                            setValue(scope.max);
                            return false;
                        }
                        setValue(scope.value + step);
                    }
                    setTimeout(function () {
                        eval(changeevent)
                    });
                };

                /**
                 * This is only triggered when the field is manually edited by the user.
                 * Where we can perform some validation and make sure that they enter the
                 * correct values from within the restrictions.
                 */
                scope.changed = function () {
                    var $input = $(event.target);
                    // If the user decides to delete the number, we will set it to 0.
                    if (!scope.value) setValue(0);

                    // Check if what's typed is numeric or if it has any letters.
                    if (/[0-9]/.test(scope.value)) {
                        setValue(scope.value);
                    }
                    else {
                        setValue(scope.min);
                    }

                    // If a minimum is set, let's make sure we're within the limit.
                    if (scope.min && (scope.value <= scope.min || scope.value - step <= scope.min)) {
                        setValue(scope.min);
                        return false;
                    }

                    // If a maximum is set, let's make sure we're within the limit.
                    if (scope.max && (scope.value >= scope.max || scope.value + step >= scope.max)) {
                        setValue(scope.max);
                        return false;
                    }

                    // Re-set the value as an integer.
                    setValue(scope.value);
                    setTimeout(function () {
                        eval(changeevent)
                    });
                };
            }, 0);
        }
    }
});
tgCommon.directive('cue', function () {
    //creates placeholder text in input including in browsers which don't support placeholder text
    return {
        link: function (scope, $input, attrs) {
            $input = $($input);

            var $clone = $input.ghost().addClass("cue"),
                sInputId = attrs.id;

            if (sInputId) {
                $clone.prop("id", sInputId + "_cue");
            }

            addCue();

            $input.addClass("hasCue").selectTextOnFocus().blur(addCue).change(addCue);

            if (attrs.ngModel)
                scope.$watch(attrs.ngModel, addCue);
            else
                $input.keyup(addCue);

            function addCue() {

                var attr = scope.$eval(attrs.cue.replace(" ", "")),
                    sCue = attr || "";

                if (!$input.val())
                    $clone.text(sCue);
                else
                    $clone.text("");

                if (!!scope.$eval(attrs.cueConstraint))
                    $clone.text("");
            }
        }
    };
});

tgCommon.directive('dropDownMenu', function () {
    //a simple menu directive
    return {
        templateUrl: 'menuTemplate',
        scope: true,//create an isolate scope to keep the common property names from littering the broader scopes
        link: function (scope, $el, attrs) {
            var oConfig = scope[attrs['dropDownMenu']];

            oConfig.$elContext = $($el);
            scope.oMenu = scope.oParent = scope.oRoot = new scope.menuFactory(oConfig);
            if (oConfig.sId)
                scope.$root[oConfig.sId] = scope.oMenu;//place menu in the broader scopes under its unique id if present
        }
    }
});

tgCommon.directive('jobCounterIntroText', function () {
    return {
        scope: true,//create an isolate scope to keep the common property names from littering the broader scopes
        link: function (scope, $el, attrs) {
            $($el).autocomplete(scope.keywordAutoComplete);
        }
    }
});

tgCommon.directive('configurableImage', function () {
    //creates an image with a configurable src
    //will not cause 404 errors if src is null
    return {
        template: '<div class="{{configName}}WrapperLink" ><img ng-if="! bNull" class="{{configName}}" alt="{{sAlt}}" dynamic-load-callback brand-property="{{configName}}" ng-src="{{src}}" /><span ng-if="bNull" class="configHidden {{configName}}" brand-property="{{configName}}"></span></div>',
        scope: {
            configName: "@configurableImage"
        },
        replace: true,
        link: function (scope, $el, attrs) {
            scope.oConfig = tgTheme.data[attrs.configurableImage];
            scope.sAlt = attrs.alt || "";

            function set() {
                scope.bNull = !scope.oConfig.selected || scope.oConfig.selected.toLowerCase() == "none" || scope.oConfig.selected.toLowerCase() == "https://";
                if (scope.bNull) {
                    scope.src = "";
                    // scope.href = "";
                } else if (typeof window.appScope != 'undefined') {
                    scope.src = appScope.bConfigMode ? scope.oConfig.selected + "#" + new Date().getTime() : scope.oConfig.selected;
                    // scope.href = scope.oConfig.href;
                } else if (typeof window.AssessmentScope != 'undefined') {
                    scope.src = AssessmentScope.bConfigMode ? scope.oConfig.selected + "#" + new Date().getTime() : scope.oConfig.selected;
                }
            }

            set();

            scope.$watch('oConfig', set, true);
        }
    }
});

tgCommon.directive('dynamicLoadCallback', function () {
    return {
        link: function (scope, element, attrs) {
            var fnOnLoad = (typeof window.appScope != 'undefined') ? appScope.$eval(element.parent().attr("image-load-callback")) : AssessmentScope.$eval(element.parent().attr("image-load-callback"));

            if (_.isFunction(fnOnLoad))
                element.bind('load', fnOnLoad);
        }
    }
});

tgCommon.directive('clickToToggle', function () {
    //toggles a boolean value in the root scope when clicked
    //also toggles a class name in the controller root element and the clicked element's container div
    return function (scope, $el, attrs) {
        var fnAfterToggle = scope.$eval(attrs.afterToggle);

        $el = $($el);
        scope.$root.uiBooleans = scope.$root.uiBooleans || {};
        scope.$root.elements = scope.$root.elements || {};
        scope.$root.elements.controller = scope.$root.elements.controller || $el.closest("[ng-controller]");
        $el.click(function (e) {
            scope.$root.uiBooleans[attrs['clickToToggle']] = !scope.$root.uiBooleans[attrs['clickToToggle']];
            scope.$root.elements.controller.add($el.closest("div")).toggleClass(attrs['clickToToggle']);
            setTimeout(function () {
                scope.$apply();
                if (fnAfterToggle)
                    fnAfterToggle(scope, scope.$root.uiBooleans[attrs['clickToToggle']], e);
            }, 0);
        });
    }
});

tgCommon.directive('hideOnMobile', function () {
    //Hides element at screen/device widths of 800px or less
    //if touchscreenstart event or touchpoints are present
    return function (scope, $el, attrs) {
        if (scope.$root.utils.touchScreen && screen.width < 800)
            $($el).remove();
    }
})


tgCommon.directive('html', function () {
    function link(scope, element, attrs) {

        var update = function () {
            element.html(scope.html);
        }

        attrs.$observe('html', function (value) {
            update();
        });
    }

    return {
        link: link,
        scope: {
            html: '='
        }
    };
});

//////<<<<<<<<<<<<<<<<<<<<<<<<<<<Password Match Directive>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tgCommon.directive('match', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('mismatch', currentValue);
            });
        }
    };
});

tgCommon.directive('passwordvalidation', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                scope.passMinlenth = scope.tgSettings.TGPasswordStrength == 'Strong' ? 8 : 6;
                scope.pwdValidLength = (viewValue && viewValue.length >= scope.passMinlenth && viewValue.length <= 25 ? 'valid' : undefined);
                // scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                //scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;
                if (scope.tgSettings.TGPasswordStrength == 'Strong') {
                    scope.pwdHasSpecial = (viewValue && /[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\/\-_+={}'"<>:;,]/.test(viewValue)) ? 'valid' : undefined;
                    // if (scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber && scope.pwdHasSpecial) {
                    if (scope.pwdValidLength && scope.pwdHasSpecial) {
                        scope.pwdCorrect = true;
                        ctrl.$setValidity('pwd', true);
                        scope.passwordValidationAriaLabel = scope.dynamicStrings.Label_PasswordRequirement + " " + scope.dynamicStrings.Errormessage_Mustbe8to25characters + " " + scope.dynamicStrings.Errormessage_MustContainSpecialCharacter + " " + scope.dynamicStrings.AriaLabel_PasswordReqirementMet;
                        scope.Label_PasswordReqirementMet = scope.dynamicStrings.AriaLabel_PasswordReqirementMet;
                        return viewValue;
                    } else {
                        ctrl.$setValidity('pwd', false);
                        scope.pwdCorrect = false;
                        scope.passwordValidationAriaLabel = scope.dynamicStrings.Label_PasswordRequirement + " " + scope.dynamicStrings.Errormessage_Mustbe8to25characters + " " + scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                        scope.Label_PasswordReqirementMet = '';
                        return undefined;
                    }
                }
                else {
                    if (scope.pwdValidLength) {
                        scope.pwdCorrect = true;
                        ctrl.$setValidity('pwd', true);
                        scope.passwordValidationAriaLabel = scope.dynamicStrings.Label_PasswordRequirement + " " + scope.dynamicStrings.Errormessage_Mustbe6to25characters + " " + scope.dynamicStrings.AriaLabel_PasswordReqirementMet;
                        scope.Label_PasswordReqirementMet = scope.dynamicStrings.AriaLabel_PasswordReqirementMet;
                        return viewValue;
                    } else {
                        ctrl.$setValidity('pwd', false);
                        scope.pwdCorrect = false;
                        scope.passwordValidationAriaLabel = scope.dynamicStrings.Label_PasswordRequirement + " " + scope.dynamicStrings.Errormessage_Mustbe6to25characters;
                        scope.Label_PasswordReqirementMet = '';
                        return undefined;
                    }
                }
            });
        }
    };
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<< COMMON UTILITIES ANGULAR FACTORY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

tgCommon.directive('nxEqual', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqual) {
                console.error('nxEqual expects a model as an argument!');
                model.$setValidity('nxEqual', false);
                return;
            }
            scope.$watch(attrs.nxEqual, function (value) {
                if (value != '' && model.$viewValue != '') {
                    model.$setValidity('nxEqual', value === model.$viewValue);
                }
                else {
                    model.$setValidity('nxEqual', false);
                }
            });
            model.$parsers.push(function (value) {
                if (value) {
                    var isValid = value === scope.$eval(attrs.nxEqual);
                }
                else {
                    isValid = false;
                }
                model.$setValidity('nxEqual', isValid);
                return value;
            });
        }
    };
});

tgCommon.directive("popover", function ($compile) {
    return {
        scope: {},
        link: function (scope, $el, attrs) {
            setTimeout(function () {
                var $hd = angular.element($compile('<p class="hd"><a close="div"></a></p>')(scope));

                $el = $($el).click(toggle);
                scope.toggle = toggle;
                scope.$popInfo = $("#" + $el.attr("aria-owns"));

                if (!scope.$popInfo.find(".arrow").length) {
                    scope.$popInfo.addClass("fade popover bottom").append($hd).append($('<p class="arrow"></p>'));
                }
                scope.$popInfo.attr("role", "alert");

                function toggle() {
                    //hide or show the popover

                    //tidy up animation class name if hidden by click handler in close directive
                    if (!scope.$popInfo.is(":visible"))
                        scope.$popInfo.removeClass("in");

                    //first display the popover prior to fade in/out animation
                    scope.$popInfo.css("display", "inline-block");

                    _.delay(function () {
                        //wait for popover to paint so that opacity will register as 0
                        //required for animation

                        scope.$popInfo.toggleClass("in");
                        if (scope.$popInfo.hasClass("in")) {
                            scope.$popInfo.trapFocus();
                        }
                        else {
                            //note we can NOT assume $el (the trigger button) is still in the dom
                            //find it again and focus
                            scope.$popInfo.untrapFocus();
                            $("a[aria-owns=" + scope.$popInfo.prop("id") + "]").focus();
                            _.delay(function () {
                                scope.$popInfo.hide();
                            }, 500);
                        }
                    });

                    return false;
                }
            }, 0);
        }

    }
})

tgCommon.directive('containsSpecialCharacter', function () {
    return {
        // restrict to an attribute type.
        restrict: 'A',
        // element must have ng-model attribute.
        require: 'ngModel',
        link: function (scope, ele, attrs, ctrl) {

            // add a parser that will process each time the value is
            // parsed into the model when the user updates it.
            ctrl.$parsers.unshift(function (value) {
                if (value) {
                    // test and set the validity after update.
                    var validspecial = (value && /[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\/\-_+={}'"<>:;,]/.test(value)) ? true : false;
                    ctrl.$setValidity('noSpecialCharacter', validspecial);
                    //checking for length
                    var validlength = (value.length >= 8 && value.length <= 25);
                    ctrl.$setValidity('notValidLength', validlength);
                    ctrl.$setValidity('required', true);
                } else if (value == "") {
                    //default setvalidity setting when ctrl + delete is used to remove password
                    ctrl.$setValidity('noSpecialCharacter', false);
                    ctrl.$setValidity('notValidLength', false);
                }
                if (ctrl.$name == 'newPassword') {
                    ctrl.$setValidity('passwordSameAsUsername', true);
                    ctrl.$setValidity('recentlyUsedPasswrd', true);
                    ctrl.$setValidity('sameOldNewPasswrd', true);
                    ctrl.$setValidity('containsSpace', true);
                    if (scope.updateAccount && scope.updateAccount.errormsgs.length > 0) {
                        scope.updateAccount.errormsgs = _.filter(scope.updateAccount.errormsgs, function (o) { return o.field !== 'newPassword'; });
                    }
                }
                var valid = validspecial && validlength;
                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return value;
            });

        }
    }
});
tgCommon.directive('defaultPasswordValidation', function () {
    return {
        // restrict to an attribute type.
        restrict: 'A',
        // element must have ng-model attribute.
        require: 'ngModel',
        link: function (scope, ele, attrs, ctrl) {

            // add a parser that will process each time the value is
            // parsed into the model when the user updates it.
            ctrl.$parsers.unshift(function (value) {
                if (value) {
                    // test and set the validity after update.
                    var validlength = (value.length >= 6 && value.length <= 25);
                    ctrl.$setValidity('notValidLength', validlength);
                    ctrl.$setValidity('required', true);
                }
                var valid = validlength;
                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return value;
            });

        }
    }
});

tgCommon.directive('confirmField', function ($compile) {

    return {
        restrict: 'A',
        replace: false,
        link: function (scope, $el, attrs) {

            var $fieldcontainer = $($el).closest(".fieldcontain");
            var $clone = $fieldcontainer.clone();
            var $input = $clone.find('input');
            var $labelLiner = $clone.find("label .textlabel");
            var $label = $labelLiner.parent();
            var $popInfo = $clone.find(".popover");
            var $popInfoLabel = $clone.find('.popover label');
            var $fieldHelpLink = $clone.find('.fieldHelp');

            $labelLiner.html($($el).attr('confirmprefix') + " " + $labelLiner.html());
            if ($label.attr("for"))
                $label.attr("for", $label.attr("for") + "-confirm");
            if ($label.attr("id"))
                $label.attr("id", $label.attr("id") + "-confirm");

            $input.attr('id', $input.attr('id') + '-confirm');
            $input.attr('name', $input.attr('name') + '-confirm');

            if ($input.attr("aria-labelledby"))
                $input.attr('aria-labelledby', $input.attr('aria-labelledby') + '-confirm');

            $input.removeAttr("confirm-field");
            $input.addClass("confirmInput")

            if ($popInfo && $popInfo.attr("id"))
                $popInfo.attr('id', $popInfo.attr('id') + '-confirm');

            if ($popInfoLabel && $popInfoLabel.attr("for"))
                $popInfoLabel.attr('for', $popInfoLabel.attr('for') + '-confirm');

            if ($fieldHelpLink && $fieldHelpLink.attr('aria-owns'))
                $fieldHelpLink.attr('aria-owns', $fieldHelpLink.attr('aria-owns') + '-confirm');

            $fieldcontainer.after($clone);

        }
    };
});

tgCommon.directive('hideControl', function ($compile) {

    return {
        restrict: 'A',
        replace: false,
        link: function (scope, $el, attrs) {

            if (scope.page.pagetype != 3) {
                scope.page.hiddenFields[attrs.hideControl] = $($el).html();
            }
            $($el).remove();


        }
    };
});

tgCommon.factory("utils", function () {
    return new utilityFactory();//utility object contains pointers to configToolFactory, menuFactory, and global theme object


    //<<<<<<<<<<<<<< CONFIG TOOL FACTORY CLASS >>>>>>>>>>>>>
    //controls interaction between the angular model and the contextual menu / controls

    function configToolFactory() {

        var that = this;

        this.toolbar = { sToolbarClass: "brandingToolbar", controls: [{ id: "undo", helperText: "Undo", labelClass: "fa fa-undo", type: "button", disabled: true }, { id: "redo", labelClass: "fa fa-repeat", helperText: "Redo", type: "button", disabled: true }, { id: "advanced", displayName: "Advanced / CSS", type: "button" }, { id: "save", displayName: "Save", type: "button", disabled: $.queryParams().canSave == "false", laddaButton: "ladda-button" }, { id: "cancel", displayName: "Cancel", type: "button" }], clickHandler: tgTheme.toolbarActionHandler };

        this.data = tgTheme.data;
        this.getOptionsByType = function (event, scope, sType) {
            var sSelectedValue = that.data[scope.oItem.id].selected,
                aoOptions, oImageColorInfo, sAbsolutePath, bSwatchSelected;

            switch (sType) {
                case "font":
                    aoOptions = tgTheme.fontFamilyOptions;
                    break;
                case "color":
                    oImageColorInfo = scope.theme.imgColorValues($("img.primaryHeaderLogo")[0]);
                    aoOptions = oImageColorInfo ? _.map(oImageColorInfo.colors, function (oVal) {
                        if (oVal.hex == sSelectedValue)
                            bSwatchSelected = true;
                        return { display: "swatch", backgroundColor: oVal.hex, value: oVal.hex, dark: parseInt(oVal.brightness) < 13.5 };
                    }) : [];
                    aoOptions.push({ display: "colorTextbox", value: sSelectedValue, selected: !bSwatchSelected });
                    break;

                case "size":
                    aoOptions = [{ display: "textbox", value: sSelectedValue }];
                    break;

                case "image":
                    aoOptions = _.clone(that.data[scope.oItem.id].options, true);
                    if (_.where(aoOptions, { completePath: sSelectedValue }).length || sSelectedValue.indexOf("https://") == "-1")
                        sAbsolutePath = "https://";
                    else
                        sAbsolutePath = sSelectedValue;
                    if (aoOptions.indexOf("none") == -1) {
                        if (scope.oItem.id == "backgroundImage")
                            aoOptions.push({ label: "none (placeholder image)", value: "none" });
                        else
                            aoOptions.push("none");
                    }
                    aoOptions.push({ display: "imageTextbox", completePath: sAbsolutePath });
                    aoOptions.push({ display: "helpText", heading: "Image Recommendations:", value: that.data[scope.oItem.id].helpText });
                    break;
            }
            return aoOptions;
        },

        this.getOptionDisplayName = function (scope) {
            //infer the display name from the option value
            var oItem = scope.oItem,
                sDisplayName = "";

            //font values are CSS font families
            //to get the display name take the first font
            //then separate Pascal case names with spaces and remove single quotes
            if (scope.oParent.type == "font") {
                sDisplayName = oItem.replace(/([A-Z])/g, ' $1').split(",")[0].replace(/'/g, "").trim();
                if (_.contains(sDisplayName, "Helvetica"))
                    sDisplayName += "/Arial";
            } else {
                sDisplayName = oItem.label || oItem.completePath || oItem.value || oItem;
            }
            return sDisplayName;
        },

        this.getOptions = function (event, scope, uTarget) {
            //target type is unknown:  accepts string or jQuery object
            //primary menu returns a jQuery object containing the clicked element
            //if a string is passed populate submenu options by type
            if (typeof (uTarget) == "string")
                return that.getOptionsByType(event, scope, uTarget);


            //a jQuery object has been passed as uTarget and we are populating a submenu
            //ignore right clicks on the branding toolbar itself
            if (uTarget.closest(".brandingToolbar").length)
                return null;

            var aOptions = [],
                asBackgroundColorClasses = ["baseColorPalette", "foreground", "facet", "foregroundTransluscent", "accentBkg", "lightAccentBkg", "veryLightAccentBkg", "darkAccentBkg", "pageHeader", "button", "autocompleteWrapper", "pageFooter", "hd", "submitResumeWidget", "welcomeBanner"],
                sBackgroundColorSelector = "." + asBackgroundColorClasses.join(", .") + ", button, body",
                $backgroundColorAncestor = uTarget.closest(sBackgroundColorSelector),
                brandProp = uTarget.attr('brand-property') || $backgroundColorAncestor.attr('brand-property'),
                $brandPropSerrogate = $($backgroundColorAncestor.attr("brand-property-serrogate")),
                bHasOwnText = (uTarget.text().trim().length > uTarget.find("*").text().trim().length || uTarget.closest(".controlWrapper").length) && uTarget.attr("no-text") == undefined && !uTarget.is(".controlWrapper, textarea, input[type=text]"),
                bTransparent = uTarget.css("backgroundColor") == "rgba(0, 0, 0, 0)" || uTarget.css("backgroundColor") == "transparent",
                bAutoFontColor = $backgroundColorAncestor.is(".foregroundTransluscent, .controlWrapper, button, .button"),
                bHardCodedBackground = !!uTarget.closest(".controlWrapper").length;

            //consider the branding property of elements beneath (but not ancestors of) targets are tranluscent or transparent element
            if ($brandPropSerrogate.length) {
                var offset = $brandPropSerrogate.offset(),
                    left = offset.left,
                    top = offset.top,
                    right = left + $brandPropSerrogate.width(),
                    bottom = top + $brandPropSerrogate.height();

                $.normalizeEventCoords(event);

                if (event.pageX > left && event.pageX < right && event.pageY > top && event.pageY < bottom)
                    brandProp = $brandPropSerrogate.attr("brand-property");
            }

            //if element clicked has a branding property attribute corresponding to config/theme data include it as a menu item
            if (brandProp)
                aOptions.push({ id: that.data[brandProp].id, label: that.data[brandProp].displayName, type: "image", submenu: true });


            if (uTarget.is(".primaryButton")) {
                aOptions.push(colorItem("buttonBackgroundColor", "Button Background Color"));
            } else if (uTarget.is(".UnderLineLink") && uTarget.closest(".headerLink").length) {
                aOptions.push(colorItem("headerLinkColor", "Header Link Color"));
            } else if (uTarget.is(".footerLink a")) {
                aOptions.push(colorItem("footerLinkColor", "Footer Link Color"));
            } else if (uTarget.is(".tgLocale a")) {
                aOptions.push(colorItem("footerLinkColor", "Footer Link Color"));
            }
            if (bHasOwnText) {
                //if element clicked has text include relevant text options
                //always compare with the currently selected text option to make sure we are not deriving or overriding the selected value
                if ((uTarget.is("a, .jobtitle") || uTarget.closest("a, .jobtitle").length) && tgTheme.colorsAreEqual(uTarget.css("color"), tgTheme.data.linkColor.selected))
                    aOptions.push(colorItem("linkColor", "Link Color"));
                else {
                    if ((tgTheme.colorsAreEqual(uTarget.css("color"), tgTheme.data.baseFontColor.selected) || $backgroundColorAncestor.is(".foreground")) && !bAutoFontColor)
                        aOptions.push(colorItem("baseFontColor", "Base Font Color"));
                    if (uTarget.css("fontSize") == tgTheme.data.baseFontSize.selected)
                        aOptions.push.apply(aOptions, [{ id: "baseFontSize", label: "Base Font Size", type: "size", submenu: true }]);
                }
                aOptions.push.apply(aOptions, [{ id: "baseFontFamily", label: "Base Font", type: "font", submenu: true }]);
            }

            //calculate the appropriate background color branding property
            if ($backgroundColorAncestor.is(".foreground"))
                aOptions.push(colorItem("foregroundColor", "Foreground Color"));
            if ($backgroundColorAncestor.is(".pageHeader") && !brandProp)//don't add headerBackgroundColor to logo options
                aOptions.push(colorItem("headerBackgroundColor", "Header Background Color"));
            if ($backgroundColorAncestor.is(".pageFooter"))
                aOptions.push(colorItem("footerBackgroundColor", "Footer Background Color"));
            if (($backgroundColorAncestor.is(".baseColorPalette, body") || $backgroundColorAncestor.is(".hd") || $backgroundColorAncestor.is(".submitResumeWidget") || $backgroundColorAncestor.is(".welcomeBanner")) && !(brandProp == "backgroundImage" && tgTheme.data.backgroundImage.selected != "none"))
                aOptions.push(colorItem("backgroundColor", "Background Color"));

            return aOptions;

            function colorItem(id, displayName) {
                return { id: id, label: displayName, type: "color", submenu: true }
            }
        };

        this.getSelected = function (scope, $el, attrs) {
            var sId = (scope.oParent && scope.oParent.id) || (scope.oItem && scope.oItem.id);
            return sId ? scope.config.data[sId].selected : null;
        };

        this.isSelected = function (scope) {
            var uSelected = this.getSelected(scope),
                sDisplayName = this.getOptionDisplayName(scope),
                oGrandItem = scope.$parent.$parent.oItem,
                bFontComparison = oGrandItem && oGrandItem.type == "font";

            if (bFontComparison) {
                uSelected = uSelected.split(" ")[0].replace("'", "");
                sDisplayName = scope.oItem.split(" ")[0].replace("'", "");
            }

            return uSelected == scope.oItem || _.contains(uSelected, sDisplayName) && sDisplayName != "https://";
        };

        this.set = function (event, scope) {
            var bValid = false, val, sAbsolutePath;

            if (scope.oItem) {
                val = scope.oItem.value || scope.oItem;
                bValid = true;

                if (scope.oParent.type == "color")
                    bValid = scope.theme.isValidColor(val);

                if (scope.oParent.type == "size")
                    bValid = scope.theme.isValidSize(val);

                if (scope.oParent.type == "image") {
                    bValid = val == "none" || !!val.label || (val.completePath && val.completePath.indexOf("https://") == 0);
                    val = val.completePath || val || "";
                }

                if (scope.oItem.submenu)
                    return;

                if (bValid) {
                    scope.config.data[scope.oParent.id].selected = val;
                    tgTheme.pushHistory();
                }

            }

            //note:  scope.oParent is NOT a pointer to scope.config.data[scope.oParent.id]
            if (scope.theme.hasKey(scope.oParent.id) && bValid)
                scope.theme.update(scope.oParent.id, scope.config.data[scope.oParent.id].selected);

            return bValid;
        };
    }


    //<<<<<<<<<<< MENU / CONTEXT MENU FACTORY CLASS >>>>>>>>>>>>>>
    //a simple, general use, context menu widget, agnostic to model

    function menuFactory(oConfig) {
        //Configs: sId, fnItemClickHandler, fnSelected, fnBeforeShowCallback, $elContext
        var that = this;

        this.oConfig = oConfig;
        this.bVisible = false;
        this.aoItems = oConfig.aData || [];
        this.$menuCollection = $();
        this.init = function (scope, $el, attrs) {
            //init for new menu including submenus - called from initWidget directive
            if (that.$menuCollection.length == 0 && oConfig.sId)
                $el.attr("id", oConfig.sId);
            if (that.$menuCollection.length > 0)
                $el.addClass(that.$menuCollection[0].className);
            that.$menuCollection = that.$menuCollection.add($el);
            if (that.$lastClickTarget) {
                //initializing a child menu
                setTimeout(function () {
                    that.$menuCollection.last().positionAsChildMenu(that.$lastClickTarget.addClass("active"));
                }, 0);
            } else if (that.$menuCollection.length == 1 && oConfig.$elContext) {
                //initializing a standard primary menu (not a context menu)
                setTimeout(function () {
                    that.$menuCollection.last().positionAsChildMenu(oConfig.$elContext, true);
                }, 0);
            }
            if (oConfig.fnSelected)
                this.selected = oConfig.fnSelected(scope, $el, attrs);
        };
        this.showAtRightClickPosition = function (event, scope, element) {
            //initial show handler for the menu - does not fire when submenus show
            var $possibleTarget = $(event.target),
                possibleTargetScope = angular.element(this.$target).scope(),
                aoItems = oConfig.fnBeforeShowCallback(event, possibleTargetScope, $possibleTarget);


            if ($possibleTarget.is(".menu a"))
                return this.itemClickHandler(event, angular.element(event.target).scope());

            this.hide();

            if (aoItems && aoItems.length) {
                this.$target = $possibleTarget;
                this.targetScope = possibleTargetScope;
                this.bVisible = true;
                this.selected = oConfig.fnSelected ? oConfig.fnSelected(scope, this.$target) : null;
                this.aoItems = aoItems;
                scope.$root.$$childHead.aoItems = aoItems;
                $.normalizeEventCoords(event);
                _.delay(function (event, $target) {
                    that.$target.addClass("contextMenuTarget");
                    that.$menuCollection.eq(0).stop(false, true).show().positionConstrained(event.pageX, event.pageY).hide().slideDown(null, completeHandler);
                }, 400, event, this.$target);
            }

            function completeHandler() {
                var $menu = $(this);
                setTimeout(function () {
                    if (aoItems.length == 1)
                        that.$menuCollection.eq(0).find("li").click();
                    else
                        $menu.trapFocus();
                }, 0);
            }
        }
        this.hide = function (bDestroy) {
            var sCssClass = (that.$menuCollection.prop("class") || "").split(" ")[0],
                sSelector = sCssClass ? "." + sCssClass : "";

            $(".contextMenuTarget").removeClass("contextMenuTarget");
            if (that.$menuCollection) {
                if (bDestroy) {
                    that.$menuCollection.add(sSelector).remove();
                    that.$menuCollection = $();
                } else
                    that.$menuCollection.add(sSelector).slideUp();
            }
        };
        this.itemClickHandler = function (event, scope) {
            var $target = $(event.target),
                $targetMenu = $target.closest(".menu"),
                bAbortedMenuBranch;
            if (scope.oItem && scope.oItem.submenu) {

                //if menu branch clicked is not terminal then remove more distal branches and reset active items
                that.$menuCollection.each(function (i) {
                    var $submenu = $(this)

                    if (bAbortedMenuBranch) {
                        $submenu.slideUp();
                        that.$menuCollection.splice(i, 1);
                    }
                    bAbortedMenuBranch = bAbortedMenuBranch || $submenu.is($targetMenu);
                })
                if (bAbortedMenuBranch)
                    $targetMenu.find(".active").removeClass("active");

                //reset, pause for Angular to catch up, and then set the menu items to trigger init method above
                scope.oItem.aoItems = null;
                _.delay(function () {
                    scope.oItem.aoItems = oConfig.fnBeforeShowCallback(event, scope, scope.oItem.type);
                    scope.$apply();
                });

                scope.$parent.selected = scope.oItem;
                that.$lastClickTarget = $target;
            } else {
                //only set the value for text inputs when ENTER key pressed, not on click
                if (event.target.tagName != "INPUT" || (event.keyCode && event.keyCode == $.keyCodes.enter)) {
                    //only close the menu if the value being set is valid
                    if (oConfig.fnItemClickHandler(event, scope))
                        that.hide();//note context is the window when called via custom ngEnter directive
                }
            }
        }

        $(document.body).click(function (e) {
            if ($(e.target).closest(".menu").length == 0)
                that.hide();
        });

        return this;
    }


    //<<<<<<<< COMMON UTILITY OBJECT >>>>>>>>>>
    //a master object factory class with helper methods
    //contains pointer to config and context menu factory classes
    //contains pointer to preexsiting global theme object

    function utilityFactory() {
        var B_RENDER_MORE_LESS_LINKS = true;
        var utils = this;

        this.init = function (scope, bDiscreteObject, $location) {

            scope.$root.elements = {};
            scope.$root.$ = $;//allow jquery object to be accessible in $eval method
            scope.queryParams = _.transform($.queryParams(), function (result, val, key) {
                result[key.toLowerCase()] = val;
            }); //change query parameter name to all lower case
            if ($location) {
                this.$location = $location;
                var AddHome = true;
                //preserving state and browser history buttons
                if ($location.hash().length > 0) {
                    var hashparameter = $location.hash().toLowerCase();

                    if (hashparameter.indexOf('showprivacypolicy') > -1 || hashparameter.indexOf('inactivitylogout') > -1 || hashparameter.indexOf('jobdetails=') > -1) {
                        AddHome = false;
                    }
                    setTimeout(function () {

                        if (hashparameter.indexOf('inactivitylogout') > -1) {
                            appScope.ShowInactivityLogoutDialog();
                        }
                        else if (hashparameter.indexOf('showprivacypolicy') > -1) {
                            AddHome = false;
                            appScope.showSMNewAccnt();
                        }
                        else if (hashparameter.indexOf('jobdetails=') > -1) {
                            var parameters = hashparameter.replace('#', '').split('&');
                            _.each(parameters, function (val) {
                                if (val.indexOf('jobdetails') > -1) {
                                    if (val.toLowerCase().indexOf('undefined') > -1 || val.toLowerCase().indexOf('_') < 0) {
                                        $location.hash("home")
                                    }
                                    else {
                                        appScope.showStandAloneJobDetails(val);
                                        AddHome = false;
                                    }

                                }
                            });

                        }

                    }, 10);
                }
                else if (typeof $.queryParams().PageType != "undefined" && $.queryParams().PageType != "") {
                    switch ($.queryParams().PageType.toLowerCase()) {
                        case "jobdetails":
                            AddHome = false;
                            break;
                        case "searchresults":
                            AddHome = false;
                            $location.hash("keyWordSearch=&locationSearch=");
                            break;
                        case "selectedgroup":
                            AddHome = false;
                            $location.hash("SelectedGroup");
                            break;
                        case "assessments":
                            AddHome = false;
                            $location.hash("ResponsiveAssessment");
                            break;
                        default:
                            AddHome = false;
                            $location.hash("home");
                            break;
                    }
                }
                else if ((typeof $.queryParams().reqid != "undefined" && $.queryParams().reqid != "") || $location.hash() == "InactivityLogout" || $location.hash() == "showPrivacyPolicy" || $location.hash().toLowerCase().indexOf('jobdetails') > -1) {
                    AddHome = false;
                }

                if (AddHome && (typeof $.queryParams().fromSM == "undefined" || (typeof $.queryParams().fromSM != "undefined" && !$.queryParams().fromSM)))
                    $location.hash("home")//to prevent oddities when refreshing where a hash is present
                //***Note well:
                //A CONDITIONAL FOR SPECIFIC HASHES WILL BE REQUIRED ABOVE IF HASHBANGING FROM EXTERNAL LEGACY PAGES


                scope.$root.oHistory = {};
                scope.$root.$on("$locationChangeStart", function (event, next, current) {
                    var handleback = true;
                    if (current.split("#")[1] == undefined)
                        handleback = true;
                    else if (current.split("#")[1] != undefined && (current.split("#")[1].indexOf("ResetPassword") != -1) || (current.split("#")[1].indexOf("ChangeSecurityQuestion") != -1))
                        handleback = false;

                    if (next.split("#")[0] == current.split("#")[0] && scope.setPrevHash && handleback) {
                        scope.setPrevHash($location.hash())
                        if (scope.$root.oHistory[$location.hash()] && $location.hash() != "") {
                            if (next.split("#")[1].indexOf("Applypage") == 0) {
                                // scope.$root.workFlow = "apply";
                                //history.back();
                                scope.historyApplyCallback();
                            } else
                                scope.historyStateCallback();
                        }
                        else if (scope.storeHistoryState && $location.hash() != "") {
                            setTimeout(function () {
                                scope.storeHistoryState();
                            }, 0);
                        }
                    }
                });
            }

            if (bDiscreteObject)
                scope.utils = this;//create a discrete utility object within the scope
            else
                _.assign(scope, this);//add all individual utility methods to the scope
        };


        this.touchScreen = (function isTouchSupported() {
            var msTouchEnabled = window.navigator.msMaxTouchPoints;
            var generalTouchEnabled = "ontouchstart" in document.createElement("div");

            if (msTouchEnabled || generalTouchEnabled) {
                return true;
            }
            return false;
        })();


        this.storePayload = function (oPayload, oContext, fnParentFunction) {
            //for recreating state beyond the stored scope alone when browser history buttons are used

            if (!oPayload)
                return appScope.payload = null;

            var aPayloadResponse = _.toArray(oPayload),
                fnPayload = arguments.callee.caller;

            //add true flag to indicate when payload function will be called from history
            aPayloadResponse.push(true);

            appScope.payload = {
                aPayloadResponse: aPayloadResponse,
                fnPayload: fnPayload,
                fnPayloadParent: fnParentFunction,//note that parent is often not caller
                oPayloadContext: oContext
            }
        };

        this.isNewHash = function (sHash, scope) {
            return !(scope || window.appScope).$root.oHistory[sHash];
        };

        this.updateHistory = function (sLocation) {
            window.appScope.$root.oHistory[sLocation] = appScope.oHistory[sLocation] = _.clone(window.appScope);
        };

        this.userMarkup = function (key, scope) {
            return _.indexOf((scope || appScope).userMarkupFields, key) >= 0;
        };

        this.renderSafe = function (value, linkTitle, bFullText) {
            //Content taken from text area fields may contain user generated markup which may be poorly formed or invalid
            //Wrap this content in a table so that it can not break the surrounding layout

            bFullText = B_RENDER_MORE_LESS_LINKS && bFullText;

            var xBlockLevelTags = x = /(<|<\/)(br|p|pre|table|tbody|tr|hr|td|strong|h3|div|section|ul|ol|li)[^>]*>/gi,
                xLeadingNonBreakingSpaces = /^(&nbsp;(\s*))*/gi,
                xRepeatedNonBreakingSpaces = /&nbsp;(\s*){2,}/gi,
                xBullets = /\u2022/g,
                sSpaces = "&nbsp; &nbsp; &nbsp;",
                sLessLink = bFullText ? '<a class="less" href="#0" >' + appScope.$root.dynamicStrings.Link_Less + '<span class="screenReaderText">' + linkTitle + '</span></a>' : '',
                sClass = bFullText ? "sanitizedTextFull" : "sanitizedText",//This CSS class will determine whether the output displays as truncated or full
                sTrimmedValue = value.trim().replace(xBlockLevelTags, sSpaces).replace(xLeadingNonBreakingSpaces, "").replace(xRepeatedNonBreakingSpaces, "").replace("•", " "),
                sOutput = '<table class="sanitize" presentation role="presentation"><tr><td class="' + sClass + '">' + sTrimmedValue + '</td></tr></table>';

            return bFullText ? sLessLink + sOutput + sLessLink : sOutput;
        };

        this.renderSafeHtml = function (value) {
            //Content taken from text area fields may contain user generated markup which may be poorly formed or invalid
            //Wrap this content in a table so that it can not break the surrounding layout

            var xBlockLevelTags = x = /(<|<\/)(br|p|pre|table|tbody|tr|hr|td|strong|h3|div|section|ul|ol|li)[^>]*>/gi,
                xLeadingNonBreakingSpaces = /^(&nbsp;(\s*))*/gi,
                xRepeatedNonBreakingSpaces = /&nbsp;(\s*){2,}/gi,
                xBullets = /\u2022/g,
                sSpaces = "&nbsp; &nbsp; &nbsp;",
                sClass = "sanitizedTextFull",//This CSS class will determine whether the output displays as truncated or full
                sTrimmedValue = value.trim().replace(xBlockLevelTags, sSpaces).replace(xLeadingNonBreakingSpaces, "").replace(xRepeatedNonBreakingSpaces, "").replace("•", " "),
                sOutput = '<table class="sanitize" presentation role="presentation"><tr><td class="' + sClass + '">' + sTrimmedValue + '</td></tr></table>';

            return sOutput;
        };

        this.removeUnsafeCharacters = function (scope) {
            var text;

            if (!scope.oQ)
                return;

            if (scope.oQ.Value)
                text = scope.oQ.Value;
            else
                text = scope.oQ.AnswerValue;
            var regex = RegExp("<.*?>", "gi");
            var strArray = text.match(regex);
            _.forEach(strArray, function (eachHTMl) {
                if (eachHTMl.indexOf("</") == -1) {
                    var re = new RegExp("^<[a-z]+\\s+[a-zA-Z]+=.*(\")+", "gi");
                    var test = eachHTMl.substring(0, eachHTMl.length - 1).replace(eachHTMl.substring(0, eachHTMl.length - 1).match(re), "");
                    text = text.replace(test, "");
                }
            });
            if (scope.oQ.Value) {
                scope.oQ.Value = text;
            }
            else {
                scope.oQ.AnswerValue = text;
            }
        }

        this.truncatedMarkup = function (oQ) {
            return this.renderSafe(oQ.OriginalValue, '', false, this);//ellipsis with tag stripping and more/less link
            //return '<p class="ellipsis">' + oQ.OriginalValue + '</p>';//basic ellipsis overflow
        };

        this.fullMarkup = function (oQ, linkTitle) {
            return this.renderSafe(oQ.OriginalValue, linkTitle, true, this);
        };

        this.renderFullMarkUp = function (value, linkTitle) {
            return this.renderSafeHtml(value);
        };

        this.moreLink = function (scope, $el, attrs) {
            //if (utils.userMarkup(scope.getName(scope), scope) && B_RENDER_MORE_LESS_LINKS)
            setTimeout(function () {
                if ($el.hasClass("jobdescription")) {
                    $el.children("table").attr("role", "presentation");
                    var $textCell = $($el).find(".sanitizedText");
                    utils.moreLinkSubfunction($textCell);
                }
            }, 0);
        };

        this.moreLinkSubfunction = function ($textCell) {
            var mediaTagExists = false;//It's used for binding more link for media files like img/video/embed, even there is no text.
            var mediaTags = ["<iframe", "<embed", "<img"];
            var descriptionHavingMediaOnly = false;
            var tempJobDescription = $textCell.html();
            _.each(mediaTags, function (item) {
                if (!mediaTagExists && tempJobDescription.indexOf(item) >= 0) {
                    mediaTagExists = true;
                }
            });

            //Checking the job description, when it contains media tags only with out any text.
            //Here replacing all HTML tags and checking for final text. If text is empty considering the description having only media tags.
            tempJobDescription = tempJobDescription.replace(/<\/?\w+((\s+\w+(\s*=\s*(?:"(.|\n)*?"|'(.|\n)*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g, "");
            if (tempJobDescription.trim() == "") {
                descriptionHavingMediaOnly = true;//This flag is used to display the media files without more link. 
            }

            if (descriptionHavingMediaOnly) { //When media tag exists without any description, not binding more link.
                $textCell.css({ "height": "auto", "white-space": "normal" });
            } else {
                if (mediaTagExists) {
                    //This is to hide media files in short description view. When description contains some text along with media tags.                    
                    $textCell.html($textCell.html().replace(/<iframe/gi, "<iframe style=\"display:none\"").replace(/<img/gi, "<img style=\"display:none\"").replace(/<embed/gi, "<embed style=\"display:none\""));
                }
                if ($textCell.width() > $textCell.parent().width() || mediaTagExists) {
                    $textCell.css("float", "none");
                    if (!$textCell.next(".more").length) {
                        $('<td class="more link"></td>').append($('<a href="#0" ></a>').html(appScope.$root.dynamicStrings.Link_More + ' <span class="screenReaderText">' + $textCell.parents(".job").find(".jobtitle").html() + '</span>')).insertAfter($textCell);
                        appScope.iMoreLinkWidth = appScope.iMoreLinkWidth || $textCell.next().children("a").width() + 1;
                        $textCell.next().css("width", appScope.iMoreLinkWidth + "px");
                    }
                } else if (!(navigator.appVersion && navigator.appVersion.indexOf("MSIE 8.0") >= 0)) {
                    $textCell.next(".more").remove();
                }
            }
        };

        this.reassessMoreLinksOnWindowResize = function () {
            $(window).on("resize", function () {
                $(".jobdescription .sanitizedText").each(function () {
                    utils.moreLinkSubfunction($(this).css("float", "left"));
                })
            });
        }

        this.stackPageFooter = function () {
            $(window).on("resize", function () {
                stackFooter();
            }).on("load", function () { stackFooter(); });
        }

        function stackFooter() {
            if ($(".pageFooter")) {
                $(".pageFooter").removeClass("stackedFooter"); $(".footerLinkContainer").removeClass("stackedFooter");
                if ($(".footerLinkContainer").height() >= 40 || $(".tgLocale").height() >= 40)
                { $(".pageFooter").addClass("stackedFooter"); $(".footerLinkContainer").addClass("stackedFooter"); }
                else { $(".pageFooter").removeClass("stackedFooter"); $(".footerLinkContainer").removeClass("stackedFooter"); }
            }


        }


        this.format = function (scope, $el, attrs) {
            var name = scope.getName(scope);
            if (scope.formatters[name])
                scope.formatWrapper.call(scope, scope, scope.formatters[name]);
        },
        this.highlightText = function (text, sMatchText) {
            var regex = new RegExp('(' + sMatchText + ')', 'gi');
            return sMatchText ? text.replace(regex, '<em>$1</em>') : text;
        };
        this.ellipsis = function () {
            setTimeout(function () {
                $(".multilineTitle").each(function (i, el) {
                    var $el = $(el);
                    var lineHeight = parseInt($el.css('line-height'));
                    var initialBindedHtml = "";
                    if (typeof $el.attr("initialBindedHtml") == "undefined") {
                        initialBindedHtml = $el.html();
                        $el.attr("initialBindedHtml", initialBindedHtml);
                    }
                    else {
                        initialBindedHtml = $el.attr("initialBindedHtml");
                    }
                    if (initialBindedHtml != "") {
                        $el.html(initialBindedHtml);
                    }
                    if ($el.height() > lineHeight + 5) {
                        $el.height(lineHeight * 2);
                        var text = $el.html();
                        $el.addClass('ellipsisMultiline');
                        var t = $($el[0].cloneNode(true))
                            .hide()
                            .css('position', 'absolute')
                            .css('overflow', 'visible')
                            .width($el.width())
                            .height('auto');

                        $el.after(t);

                        function height() { return t.height() > $el.height() + 3; };

                        var func = height;

                        while (text.length > 0 && func()) {
                            text = text.substr(0, text.length - 1);
                            t.html(text + "&hellip;");
                        }

                        $el.html(t.html());
                        t.remove();
                    }
                    else {
                        $el.removeClass('ellipsisMultiline');
                    }
                });
            }, 100);
        }
        this.transition = function (scope, $el, attrs) {
            setTimeout(function () {
                $el.addClass('transition');
            }, 0);
        };

        this.closeDialog = function (event, scope) {
            if (parent.dialogBuilder) {
                window.top.$("body").removeClass("noScroll");
                parent.dialogBuilder.destroyDialog($.queryParams().dialogIndex);//todo:  this fails cross domain
            }
            else {
                (event ? $(event.target).closest(".dialog") : $(".dialog")).hide().siblings(".grayBox").hide();
            }
        };

        this.configToolFactory = configToolFactory;

        this.menuFactory = menuFactory;

        this.cleanUpAutocompletes = function () {
            //not elegant but necessary clean-up in case we have multiple instances of the same autocomplete control
            $(".typeAhead").text("");
            $(".ui-autocomplete.ui-menu").hide();
        };

        this.socialSourceMethods = new function () {
            var methods = this;

            this.createSocialSourceCollection = function (aaSourceProps, scope, aActiveSourceIds) {
                //Returns a collection of social source object based on available options configured by the client
                var socialSources = {};

                _.each(aaSourceProps, function (aVal, i) {
                    var id = aVal[0], name = aVal[1], img = aVal[2], bIsPostableNetwork = aVal[3] !== false;
                    if (_.contains(aActiveSourceIds, String(id)) || _.contains(scope.response.WorkFlowsAvailable, name)) {
                        //check both for configured active social source ID's and workflows such as Send Via Email which are treated as a source
                        socialSources[name] = new methods.socialSource(id, name, img, bIsPostableNetwork, scope);
                    }
                });
                return socialSources;
            };

            this.socialSource = function (id, name, image, bIsPostableNetwork, scope) {
                //Factory class for social source objects
                var oSourceAuth = _.where(scope.response.oAuthPersistedInfo, { SMSiteId: id })[0];

                if (methods.sourceCounter)
                    methods.sourceSorceCounter++;
                else
                    methods.sourceCounter = 0;

                this.id = id;/*1 LinkedIn; 2 Facebook; 3	Twitter; 4 Gmail; 5	Hotmail (Outlook); 6 Yahoo */
                this.name = name;
                this.authorized = !!oSourceAuth;
                this.postTo = this.authorized;
                this.postSucceeded = null;
                this.message = "";
                this.defaultMessage = this.name + ":  succeeded";//TODO:  LOCALIZE ***
                this.profileId = oSourceAuth ? oSourceAuth.SMProfileId : "";
                this.icon = image;
                this.sortOrder = methods.sourceSorceCounter;
                this.applyUrl = null;
                this.appId = null;
                this.isPostableNetwork = bIsPostableNetwork;
            };

            this.mapParams = function (action, socialSource, scope) {
                //Maps query parameters to an object for interaction with social media action page

                var S_DELIMITER = "#@#";

                oOutput = {
                    action: action,
                    clientid: scope.queryParams.partnerid,
                    tgsiteid: scope.queryParams.siteid,
                    resumekey: 0,
                    bruid: scope.response.BRUId,
                    callee: scope.workFlow,
                    localeid: scope.queryParams.localeid,
                    tgsiteid: scope.queryParams.siteid,
                    smsid: socialSource ? scope.socialSources[socialSource].id : "",
                    reqids: scope.queryParams.jobids ? scope.queryParams.jobids.replace(/_/g, ",") : "",
                    referredcandidateprofileId: scope.profileId != undefined ? scope.profileId : ""
                };

                if (action == "post" || action == "sendviaemail" || action == "message") {
                    if (action == "message")
                        oOutput.mychkprofs = _(scope.selectedContacts).map(function (contact) {
                            return scope.socialSources[socialSource].id + S_DELIMITER + contact.id;
                        }).value().join(",");
                    else
                        oOutput.mychkprofs = socialSource ? scope.socialSources[socialSource].id + S_DELIMITER + scope.socialSources[socialSource].profileId : _(scope.socialSources).filter("postTo").map(function (member) {
                            return member.id + S_DELIMITER + member.profileId;
                        }).value().join(",");
                    oOutput.message = scope.message ? scope.message.text : "";
                    oOutput.subject = scope.subject ? scope.subject.text : "";

                    if (scope.dialog.source == "sendviaemail") {
                        oOutput.message = ""; //241824: Replace new line characters in send via email with line breaks
                        oOutput.rcptemails = "";

                    }
                }

                return oOutput;
            };

            this.sendRequest = function (action, socialSource, scope) {
                //Sends a request using methods above to social source action page launched in a new window
                var sBaseUrl = "/TGWebHost/SocialMediaIntegration.aspx?";
                var qparams = methods.mapParams(action, socialSource, scope);
                sQuery = _.serialize(qparams);
                if (action == "sendviaemail") {
                    var SaveToSessionRequest = {
                        PartnerId: scope.queryParams.partnerid,
                        SiteId: scope.queryParams.siteid,
                        EncryptedSessionId: "",
                        SessionItems: { "ReferralMailMessage": scope.message.text, "RecipientEmails": _.pluck(scope.selectedContacts, "label").join(",") }
                    };
                    var rft = $("[name='__RequestVerificationToken']").val();
                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/SaveToSession",
                        data: JSON.stringify(SaveToSessionRequest),
                        headers: { 'Content-Type': 'application/json', 'RFT': rft },
                        success: function (data) {
                            if (data.Success == true)
                                window.open(sBaseUrl + sQuery, "_blank", "resizable=yes, top=200, left=200");
                        }

                    });
                }
                else {
                    window.open(sBaseUrl + sQuery, "_blank", "resizable=yes, top=200, left=200");
                }




            };
        };

        this.htmlEncode = function (str) {
            var rexp = new RegExp('<(?![^<]*>)');
            var matches = rexp.test(str, 'gm');

            var rexpTag = /<>/g;
            var emptytag = false;
            if (str !== null)
                emptytag = str.match(rexpTag);
            if (emptytag) {
                _.each(emptytag, function (tag) {
                    str = str.replace(tag, '&lt;&gt;');
                });
            }

            if (matches) {
                return str.replace(rexp, '&lt;');
            }
            else return str;

        };
    };
});

tgCommon.directive("outsideClick", ['$document', '$parse', function ($document, $parse) {
    return {
        link: function ($scope, $element, $attributes) {
            var scopeExpression = $attributes.outsideClick,
                onDocumentClick = function (event) {
                    if ($scope.bcandidatezoneSubmenu && event.target != $element[0] && event.target.className.indexOf("iAmInsideClick") == -1 && !$(event.target).parents().hasClass('iAmInsideClick')) {
                        $scope.$apply(scopeExpression);
                    }
                };

            $document.on("click", onDocumentClick);

            $element.on('$destroy', function () {
                $document.off("click", onDocumentClick);
            });
        }
    }
}]);

tgCommon.directive("dropdownMenuOutsideClick", ['$document', '$parse', function ($document, $parse) {
    return {
        link: function ($scope, $element, $attributes) {
            var scopeExpression = $attributes.dropdownMenuOutsideClick;

            $element.bind('click', function (e) {
                if ($(e.target).closest('.actionMenu')[0] != $element[0] || ($(e.target).closest('.actionMenu')[0] == $element[0] && (!$(e.currentTarget).parent().find('.dropdown').is(':visible') || $(e.target).hasClass('actionsLink')))) {

                    //Setting Top position for dropdown for case when dropdown is cut at the end of window
                    var winheight = $(window).height();
                    var actionElemTop = $(e.currentTarget).offset()['top'];
                    var menuHeight = $(e.currentTarget).parent().find('.dropdown').height();

                    if (actionElemTop - $(window).scrollTop() + menuHeight >= winheight) {
                        var curMenuTop = $(e.currentTarget).parent().find('.dropdown').css('top');
                        if (typeof curMenuTop != 'undefined') {
                            curMenuTop = parseFloat(curMenuTop.replace('px', ''));
                            if (!(curMenuTop < 0)) {
                                $(e.currentTarget).parent().find('.dropdown').css({ 'top': curMenuTop - menuHeight - 20 + 'px' });
                            }
                        }
                    }
                    else {
                        $(e.currentTarget).parent().find('.dropdown').css({ 'top': '40px' });
                    }

                    $(e.currentTarget).parent().find('.dropdown').toggle();
                }
                if (!$(e.target).hasClass('savedSearchAction') && !$(e.target).hasClass('actionLink')) {
                    // this part keeps it from firing the click on the document.
                    e.stopPropagation();
                }
            });
            $document.bind('click', function () {
                $scope.$apply($attributes.dropdownMenuOutsideClick);
            })

            $element.find('a').on('blur', function (e) {
                setTimeout(function () {
                    var focused = $(document.activeElement);
                    if (!focused.hasClass('actionsLink') && !focused.hasClass('ui-menu-item') && focused.parents('.dropdown').length === 0) {
                        $scope.$apply($attributes.dropdownMenuOutsideClick);
                    }
                });
            });
        }
    }
}]);

tgCommon.directive('ngBindHtmlCompile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.ngBindHtmlCompile);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);
tgCommon.directive('ngBindHref', function () {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.ngBindHref);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.attr("href", value);
            }
        );
    };
});


tgCommon.directive('dynamicName', function ($compile, $parse, $timeout) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem, attrs) {
            $timeout(function () {

                var name = "Input_" + $parse(elem.attr('dynamic-name'))(scope);
                // $interpolate() will support things like 'skill'+skill.id where parse will not
                elem.removeAttr('dynamic-name');
                elem.attr('name', name);
                $compile(elem)(scope);
            });
        }
    };
});




tgCommon.directive('onScrollToBottom', function ($document) {
    //This function will fire an event when the container/document is scrolled to the bottom of the page
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var doc = angular.element($document)[0].body;

            $document.bind("scroll", function () {

                //console.log('in scroll');
                //console.log("scrollTop + offsetHeight:" + (doc.scrollTop + doc.offsetHeight));
                //console.log("scrollHeight: " + doc.scrollHeight);

                if (doc.scrollTop + doc.offsetHeight >= doc.scrollHeight) {
                    //run the event that was passed through
                    scope.$apply(attrs.onScrollToBottom);
                }
            });
        }
    };
});
//<<<<<<<<<<<<<<<<<<<<<<<<<< THEMEBUILDER CLASS >>>>>>>>>>>>>>>>>>>>>>>>
//stores and manipulates data for interaction with LESS CSS
//especially colors

(function () {

    function tgThemeBuilder() {

        var B_ADVANCED_BRANDING = true,
            that = this,
            brandingConfigsJson = $("#brandingConfigs").attr("value"),
            rawMappedData, sErrorCode;


        this.bConfigMode = !!($("#configMode").attr("value") == "1" || $.queryParams().configtest);

        this.keys = ["@backgroundColor", "@foregroundColor", "@baseFontColor", "@linkColor", "@baseFontFamily", "@baseFontSize", "@headerBackgroundColor", "@headerLinkColor", "@buttonBackgroundColor", "@footerBackgroundColor", "@footerLinkColor", "@welcomeBackgroundColor", "@welcomeTextColor"];
        this.value = {};
        this.fontFamilyOptions = [
                "'Helvetica Neue', Helvetica, Arial, sans-serif",
                "Verdana, Geneva, sans-serif",
                "TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif",
                "Tahoma, Verdana, Segoe, sans-serif"
        ];
        this.defaultData = {
            "primaryHeaderLogo": {
                "selected": "none",
                "options": [],
                "type": "img",
                "dir": "",
                "displayName": "Header Main Logo",
                "id": "primaryHeaderLogo",
                "href": "",
                "helpText": "height 50px, width no more than 130px, file size no more than 50kb."
            },
            "backgroundImage": {
                "selected": "none",
                "options": [],
                "type": "img",
                "dir": "",
                "displayName": "Background Image",
                "id": "backgroundImage",
                "helpText": " height 400x, width no more than 1100px, file size no more than 600kb."
            },
            "secondaryHeaderLogo": {
                "selected": "none",
                "options": [],
                "type": "img",
                "id": "secondaryHeaderLogo",
                "displayName": "Tag Line or Secondary Logo",
                "dir": "",
                "href": "",
                "helpText": "height 20px, width no more than 350px, file size no more than 50kb."
            },
            "baseFontFamily": {
                "selected": "'Helvetica Neue', Helvetica, Arial, sans-serif",
                "type": "font",
                "id": "baseFontFamily"
            },
            "baseFontSize": {
                "selected": "16px",
                "type": "size",
                "id": "baseFontSize"
            },
            "backgroundColor": {
                "selected": "#ffffff",
                "type": "color",
                "id": "backgroundColor"
            },
            "baseFontColor": {
                "selected": "#333333",
                "type": "color",
                "id": "baseFontColor"
            },
            "linkColor": {
                "selected": "#00648D",
                "type": "color",
                "id": "linkColor"
            },
            "foregroundColor": {
                "selected": "#A6266E",
                "type": "color",
                "id": "foregroundColor"
            },
            "buttonBackgroundColor": {
                "selected": "#008571",
                "type": "color",
                "id": "buttonBackgroundColor"
            },
            "headerBackgroundColor": {
                "selected": "#008571",
                "type": "color",
                "id": "headerBackgroundColor"
            },
            "headerLinkColor": {
                "selected": "#336fbb",
                "type": "color",
                "id": "headerLinkColor"
            },
            "footerBackgroundColor": {
                "selected": "#5A5A5A",
                "type": "color",
                "id": "footerBackgroundColor"
            },
            "footerLinkColor": {
                "selected": "#ffffff",
                "type": "color",
                "id": "footerLinkColor"
            },
            "welcomeBackgroundColor": {
                "selected": "#A6266E",
                "type": "color",
                "id": "welcomeBackgroundColor"
            },
            "welcomeTextColor": {
                "selected": "#ffffff",
                "type": "color",
                "id": "welcomeTextColor"
            },
            "advancedCSS": "",
            "compiledCSS": ""
        };


        this.bPriorColorData = false;

        this.data = this.defaultData;

        this.setValues = function () {
            _(this.keys).each(function (val, key, obj) {
                that.value[val] = (that.data[val.substr(1)] || {}).selected;
            }).value();
        }

        this.setValues();

        this.host = window.location.host == "localhost" ? "https://qa4tgweb.br.swglab.ibm.com" : "https://" + window.location.host;

        this.getCompleteImagePath = function (sImgName, sDir) {
            if (!sImgName)
                return "none";

            var bAbsolute = sImgName.indexOf("https://") == 0,
                oSelectedOption;

            sDir = sDir || "/Images_" + $.queryParams().partnerid + "_" + $.queryParams().siteid;

            return bAbsolute || sImgName == "none" ? sImgName : that.host + "/img" + sDir + "/" + escape(sImgName);
        }

        this.wbBrandingHostDomain = $("#wbBrandingHostDomain").attr("value") || "";

        try {
            if (brandingConfigsJson && !$.queryParams().defaultbranding)
                this.rawData = JSON.parse(unescape(brandingConfigsJson));
            else {
                this.rawData = { brandingSettings: {} };

                if ($.queryParams().defaultbranding) {
                    $.log("default branding query parameter");
                    setTimeout(function logCompiledDefaultCss() {
                        var xRemoveLineBreaks = /\r?\n|\r/g;
                        $.log($("style[id*=less]").text().replace(xRemoveLineBreaks, ""));
                    }, 7000);
                }

                else
                    $.log("<!> Branding JSON is null.");

            }
        } catch (Error) {
            this.rawData = { brandingSettings: {} };
            this.brandingParseError = Error;
            $.log("<!> Branding JSON is poorly formed.");
        }

        sErrorCode = this.rawData.brandingSettings && this.rawData.brandingSettings.ERROR

        if (sErrorCode && $("#workFlow").attr("content") == "search") {

            $(document.documentElement).css("visibility", "hidden");

            setTimeout(function () {
                var oDynamicStrings = (window.appScope && appScope.dynamicStrings) || JSON.parse(unescape($("#dynamicStrings").attr("value"))),
                    sErrorMessage = oDynamicStrings["Error_Branding_" + sErrorCode] || ("Configuration error: " + sErrorCode);

                alert(sErrorMessage);
            }, 2000)


        } else {

            rawMappedData = _.transform(this.rawData.brandingSettings, function (result, val, prop) {
                var mappedProp = prop.replace(/Responsive_/i, "");

                mappedProp = mappedProp.substring(0, 1).toLowerCase() + mappedProp.substring(1);
                if (that.data[mappedProp] || that.data[mappedProp] === "") {

                    if (that.data[mappedProp].type == "color") {
                        if (val !== "")
                            that.bPriorColorData = true;
                        if (val.match(/^[a-f0-9]{6}$/i) !== null)
                            //historically, colors are stored by workbench as hex values with no hash prefix
                            val = "#" + val;
                    }
                    if (mappedProp == "baseFontFamily" && val && val.indexOf(",") == -1)
                        //font is stored (and displayed) as a single font but must be set to a font family as a LESS var
                        val = _.find(that.fontFamilyOptions, function (str) {
                            return str.toLowerCase().indexOf(val.toLowerCase()) == 0;
                        })
                    result[mappedProp] = val;
                }

            });

            _.each(rawMappedData, function (value, key) {
                if (that.value["@" + key] && value)
                    that.value["@" + key] = value;
                if (that.data[key] && value)
                    that.data[key].selected = value;
                if (key == "compiledCSS")
                    that.data[key] = (value || "").replace(/#Q#/g, '"').replace(/#SQ#/g, "'").replace(/#@#/g, "'");
                if (key == "advancedCSS")
                    that.data[key] = (value || "").replace(/#Q#/g, '"').replace(/#SQ#/g, "'").replace(/#T#/g, '\t').replace(/#N#/g, '\n').replace(/#BS#/g, '\\').replace(/#@#/g, "'");
            });
        }

        if (this.rawData.images) {

            this.imageOptions = _.map(this.rawData.images, function (oImage) {
                return {
                    completePath: that.getCompleteImagePath(oImage.fileName, oImage.dir),
                    label: oImage.fileName
                };
            })
            _.each(this.data, function (oConfig) {
                if (oConfig.type == "img") {
                    oConfig.options.push.apply(oConfig.options, that.imageOptions);
                }
            });
        }

        _.each(this.data, function (oConfig) {
            if (oConfig.type == "img") {
                oConfig.selected = that.getCompleteImagePath(oConfig.selected);
            }
        });

        var defaultCompiledCss = ".baseFontColor {  color: #333333;}.baseColorPalette {  background-color: #ffffff;  color: #333333;}.accentBkg {  background-color: #ebebeb;  color: #333333;}.lightAccentBkg {  background-color: #f3f3f3;}.veryLightAccentBkg {  background-color: #f9f9f9;}.darkAccentBkg {  background-color: #cccccc;  color: #333333;}.gateway.themed .accentBkg .borderInAccentBkg {  border-color: #cccccc;}.linkColorOnBkg {  background-color: #ffffff;  color: #00648d;  border-color: #00648d;  outline-color: #00648d;}body,.ui-widget-content a,input {  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;  font-size: 16px;}body,.pageHeader,button,.menu,.dialog .region,.dialog .body,.gateway .baseColorPalette,.ui-widget-content,.facet ul.liner {  background-color: #ffffff;  color: #333333;}.themed .pageHeader {  background-color: #008571;}.themed .headerLink {  color: #336fbb;}.themed.pageFooter {  background-color: #5a5a5a;}.themed.pageFooter .footerLink,.themed.pageFooter .tgLocale {  border-color: #E0E0E0;  color: #ffffff;}.themed.pageFooter a {  color: #ffffff;  border-color: #ffffff;}.themed.pageFooter i {  display: inline-block;  color: #ffffff;  border-color: #ffffff;}svg.styleableColor path,svg.styleableColor rect {  fill: #333333;  stroke: #333333;}a,a:visited,.link,.gateway.themed .linkColor,.jobtitle,.gateway .baseColorPalette a,.gateway .baseColorPalette a:visited,.facetFilterAccordion h3:after {  color: #00648d;}a.sidebarNav,.gateway .sidebarOverlay .sidebar {  background-color: #ffffff;}.backLink {  color: #00648d;}.cue,.prompt,[disabled],::-webkit-input-placeholder,:-moz-placeholder,::-moz-placeholder,:-ms-input-placeholder {  color: #8f8f8f;}.foreground {  color: #ffffff;  background-color: #a6266e;}.foreground span,.foreground a,.foreground a:visited {  color: #ffffff;}.gateway.themed .controlWrapper span,.gateway.themed .controlWrapper a,.gateway.themed .controlWrapper a:visited {  color: #333333;}.themed .hover,.menu a:hover,.ui-menu {  background-color: #f9f9f9;}.ui-state-hover {  outline-color: #333333;}.striped :nth-child(even),.even,.ui-menu-item.ui-state-focus,.ui-datepicker .ui-state-default,.ui-widget-header {  background-color: #f3f3f3;}.backgroundColor,.themed .down,.menu a:active,.menu a.active,.applyFlow .layoutsection .heading:before,.themed .ngdialog.ngdialog-theme-default .ngdialog-content {  background-color: #ffffff;}.highlighted > a,.gateway.themed .selectedTile {  background-color: #ebebeb;  color: #333333;}.themed .primaryButton {  background-color: #008571;  color: #ffffff;}.themed .primaryButton:hover {  background-color: #005548;  color: #ffffff;}.themed .primaryButton:active {  background-color: #008571;  color: #ffffff;}.themed .primaryButton .ladda-label,.themed .primaryButton .button-label {  outline-color: #ffffff;}.themed button,a.button {  background-color: #363636;  color: #ffffff;}.themed button:hover,a.button:hover {  background-color: #404040;  color: #ffffff;}.themed button:active,a.button:active {  background-color: #4d4d4d;  color: #ffffff;}.themed button .ladda-label,a.button .ladda-label,.themed button .button-label,a.button .button-label {  outline-color: #ffffff;}.themed .closeButton,.themed .close {  color: #333333;}.themed .closeButton:hover,.themed .close:hover {  background: #d6d6d6;}.themed .closeButton:active,.themed .close:active {  background: #ebebeb;}.themed .clearButton {  color: #333333;}.themed .progressBarContainer .progressBar .meter {  background-color: #a6266e;}.pseudoradio.checked:after {  background-color: #333333;}",
            compiledCss = this.data.compiledCSS || defaultCompiledCss,
            advancedCss = this.data.advancedCSS || "";

        this.styleEditor = new styleEditor();

        if ((!this.bConfigMode && this.data.compiledCSS) || this.brandingParseError || $("#useCompiledCSS").attr("value") == "true") {

            //there are odd issues when trying to add two style tags to the head of the document synchronously
            //so just combine the two dynamic css strings
            compiledCss += advancedCss;

            this.styleEditor.write(compiledCss, "compiledCss");

            //note: even though we are not in config mode
            //image directive relies on tgTheme object data
            //ladda button directive currently relies on tgTheme object methods and less.js color data
            //so until that code can be refactored, tgTheme object code must execute in its entirety. 
        }

        if (this.bConfigMode && advancedCss) {
            this.styleEditor.write(advancedCss, "advancedCss");
        }

        this.store = function () {
            //once shared branded areas have rendered
            //store all branding data and variable branded markup
            //for use in legacy pages
            sessionStorage.setItem("header", $(".pageHeaderContainer").prop("outerHTML"));
            sessionStorage.setItem("footer", $(".homeFooterWrapper").prop("outerHTML"));
            if (typeof appScope != "undefined") {
                sessionStorage.setItem("headerData", JSON.stringify(appScope.response.HeaderInfo));
                sessionStorage.setItem("footerData", JSON.stringify(appScope.response.FooterInfo));
            }
            if (typeof tgTheme != "underfined")
                sessionStorage.setItem("brandingData", JSON.stringify(tgTheme.data));
        };

        $(this.store);

        $(window).load(function () {
            //flag the body once the load event fires
            //this is useful for performance enhancements
            //we can effectively delay the loading of large images if desired via css
            $(document.body).addClass("window-loaded");
        });

        this.advancedCssGuidelines = "/*\nGUIDELINES\n\n\u2022  Enter CSS here.\n\n\u2022  Please take care not to compromise accessibility including color contrast.\n\n\u2022  Please test all window widths so that all responsive break-points remain in tact.\n\n\u2022  Please refer to attributes of the body tag to limit the scope of your rules to a single workflow, or else be sure to check each individual workflow.\n*/\n\n";

        this.history = [_.clone(that.data, true)];

        this.historyPosition = 0;

        this.hasKey = function (key) {
            return _.contains(this.keys, "@" + key);
        }

        this.font = function (scope, $el, attr) {
            //callback used in config base font menu
            $el.css("fontFamily", scope.$parent.oItem);
        }

        this.render = function () {
            that.checkNegativeColorScheme();
            if (that.bConfigMode && window.less && less.modifyVars)
                less.modifyVars(this.value);
        };

        this.init = function () {
            window.less = {
                env: "development",
                async: false,
                fileAsync: false,
                poll: 1000,
                functions: {},
                //dumpLineNumbers: "comments",
                relativeUrls: false,
                rootpath: "../../../../",
                globalVars: this.value
            };
            return this;
        }

        this.update = function (key, value) {
            this.value["@" + key] = value;
            this.data[key].selected = value;

            if (this.data[key].type == "color")
                this.bPriorColorData = true;

            this.render();
        };

        this.toolbarActionHandler = function (e, scope) {
            var $target = $(e.target).closest("button"),
                sAction = $target.classList()[0],
                fnAction = !$target.hasClass("disabled") && sAction && that[sAction];

            if (fnAction)
                fnAction($target, scope);
        }

        this.pushHistory = function () {
            setTimeout(function () {
                that.historyPosition++;
                that.history.length = that.historyPosition;//clip any undone history beyond this point of new action
                that.history.push(_.clone(tgTheme.data, true));
                that.$buttons = that.$buttons || $(".brandingToolbar button");
                that.$buttons.filter(".redo").addClass("disabled");
                that.$buttons.filter(".undo").removeClass("disabled");
            }, 0)
        }

        this.applyAdvancedBranding = function () {
            that.data.advancedCSS = that.data.roughAdvancedCSS;
            that.styleEditor.write(that.data.advancedCSS, "advancedCss");
            that.haveAppliedAdvancedChanges = true;
            that.pushHistory();
        }

        this.doState = function (nIncrement, $target) {
            if (!$target.hasClass("disabled")) {
                that.historyPosition += nIncrement;
                that.data = _.clone(that.history[that.historyPosition], true);
                that.setValues();
                that.render();
                that.styleEditor.write(that.data.advancedCSS, "advancedCss");
                $target.siblings(".undo, .redo").removeClass("disabled");
            }
        }

        this.undo = function ($target) {
            that.doState(-1, $target);
            if (that.historyPosition == 0)
                $target.addClass("disabled");
        }

        this.redo = function ($target) {
            that.doState(1, $target);
            if (that.historyPosition == that.history.length - 1)
                $target.addClass("disabled");
        }

        this.advanced = function ($target) {
            var ngDialog = angular.dependencies.ngDialog,
                bAdvancedDialogIsVisible = $(ngDialog.$result).is(".advanced-branding-dialog:visible");

            if (bAdvancedDialogIsVisible)
                ngDialog.close();
            else {
                that.data.roughAdvancedCSS = that.data.advancedCSS || (that.haveAppliedAdvancedChanges ? "" : that.advancedCssGuidelines);
                ngDialog.open.call(ngDialog, {
                    template: 'brandingAdvancedDialog',
                    scope: appScope,
                    className: 'ngdialog-theme-default advanced-branding-dialog',
                    showClose: true,
                    closeByDocument: false,
                    draggable: true
                })
            }
        }

        if (that.bConfigMode && B_ADVANCED_BRANDING) {
            $(function () {
                var sSaveUrl = that.wbBrandingHostDomain.replace("BrandingSettings", "SaveBrandingSettings"),
                    src = that.wbBrandingHostDomain.replace("BrandingSettings", "BrandingHelper");

                that.$iframeRelay = $('<iframe></iframe>').attr("src", src).attr("id", "workbenchRelay").css("display", "none").appendTo(document.body);
            });
        }

        this.save = function ($target, scope) {

            var $style = $("style[id*=less]"),
                aoBrandingConfiguration, oData, sData;

            if (scope.oActiveLaddaButton)
                scope.oActiveLaddaButton.start();

            that.data.compiledCSS = ($style.text() || $style[0].styleSheet.cssText).replace(/\r?\n|\r/g, "").replace(/\t/g, "").replace(/"/g, "#Q#").replace(/'/g, "#SQ#");

            aoBrandingConfiguration = _.transform(that.data, function (aoResult, oVal, sProp) {
                var sMappedProp = "Responsive_" + sProp.substring(0, 1).toUpperCase() + sProp.substring(1),
                    oSelectedOption
                if (oVal.type == "img") {
                    //find the image data object in the original WB raw data based on the index of the selected image in the transformed UI options
                    //if the object exists return its relative path, otherwise return the hot linked absolute path or "none"
                    oSelectedOption = (that.rawData.images || [])[_.findIndex((that.imageOptions || []), { completePath: oVal.selected })];
                    aoResult[sMappedProp] = oSelectedOption ? oSelectedOption.fileName : oVal.selected;
                } else if (sProp == "advancedCSS")
                    //advancedCSS must preserve formatting
                    aoResult[sMappedProp] = oVal.replace(/\r?\n|\r/g, "#N#").replace(/\t/g, "#T#").replace(/"/g, "#Q#").replace(/'/g, "#SQ#").replace(/\\/g, "#BS#");
                else
                    aoResult[sMappedProp] = oVal.selected || oVal;
            });

            oData = {
                brandingSettings: aoBrandingConfiguration,
                siteId: Number(appScope.queryParams.siteid),
                cascadeToAllMembers: !!$("#cascadeToAllMembers").attr("value")
            };

            sData = JSON.stringify(oData);


            if (B_ADVANCED_BRANDING) {

                var win, uRawData, aResponse, status, message;

                if (!that.bAdvancedSaveEnabled) {

                    function postMessageHandler(e) {

                        if (scope.oActiveLaddaButton)
                            scope.oActiveLaddaButton.stop();

                        uRawData = e.data || e.originalEvent.data;

                        try {
                            aResponse = uRawData && uRawData.split("::");
                        } catch (error) {
                            "Save return value can not be interpretted."
                        }

                        if (aResponse) {
                            status = aResponse[0];
                            message = aResponse[1];

                            if (status == 401)
                                alert("You are not authorized to complete this action.");
                            else if (status == 200)
                                $.log("branding configuration saved");
                            else {
                                alert("Save failed  \nError code: " + status);
                                $.log(oData, status, message);
                            }

                        }

                    }

                    if (window.attachEvent)
                        window.attachEvent("onmessage", postMessageHandler);
                    else
                        window.addEventListener("message", postMessageHandler);

                    that.bAdvancedSaveEnabled = true;
                }

                win = that.$iframeRelay.prop("contentWindow");

                if (win)
                    win.postMessage(sData, '*');

            } else {
                $.ajax({
                    success: function (data, status, jqxhr) {
                        if (data && data.statusCode == 401)
                            alert("You are not authorized to complete this action.");
                        else if (window.console)
                            console.log("branding configuration saved", sSaveUrl, oData);
                        window.open('', '_self', '');
                        window.close();
                    },
                    error: function (jqxhr, status, error) {

                        if (window.console)
                            console.log("save failed:", status, error, "\n jqxhr:", jqxhr, "\n URL:", sSaveUrl, "\n request data:", oData);
                    },
                    data: oData,
                    dataType: "jsonp",
                    url: sSaveUrl
                });
            }
        }


        this.cancel = function (e, scope) {
            window.open('', '_self', '');
            window.close();
        }

        this.imgColorValues = imgColorValues;
        this.toHex = toHex;
        this.normalizeColor = normalizeColor;

        this.checkNegativeColorScheme = function () {
            var backgroundBrightness = getBrightness(normalizeColor(that.data.backgroundColor.selected).split(",")),
                fontBrightness = getBrightness(normalizeColor(that.data.baseFontColor.selected).split(",")),
                linkBrightness = getBrightness(normalizeColor(that.data.linkColor.selected).split(",")),
                fieldBkgBrightness = getBrightness(normalizeColor("#ffffff"));
            that.isNegativeColorIcon = linkBrightness < 12 ? (linkBrightness <= fieldBkgBrightness) : true;
            that.isNegativeColorScheme = linkBrightness >= backgroundBrightness || fontBrightness >= backgroundBrightness;
            $(document.body).toggleClass("negativeColorScheme", that.isNegativeColorScheme);
            $(document.body).toggleClass("iconNegativeColorScheme", that.isNegativeColorIcon);
        };

        setTimeout(that.checkNegativeColorScheme, 0);

        this.isValidColor = function (sColor) {
            //accept rgb, hex, or browser recognized english language names
            if (_.isString(sColor))
                return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(sColor) ||
                /^rgb\s*\(\s*[012]?[0-9]{1,2}\s*,\s*[012]?[0-9]{1,2}\s*,\s*[012]?[0-9]{1,2}\s*\)$/i.test(sColor) ||
                less.tree.Color.fromKeyword(sColor);
        }

        this.isValidSize = function (sSize) {
            var iSize = parseInt(sSize);
            return /^[0-9]*px$/i.test(sSize) && iSize >= 16 && iSize <= 32;
        }

        this.colorsAreEqual = function (sColor1, sColor2) {
            var s1 = normalizeColor(sColor1),
                s2 = normalizeColor(sColor2);

            return s1 && s2 && s1 == s2;
        }

        this.trySetColorsToPrimaryLogo = function (e) {
            //called on image load (primary header logo) in PageHeader.cshtml via directive dynamicLoadCallback

            var MIN_COLOR_DIF_FOR_USABILITY = .5,
                BRIGHTNESS_OF_WHITE = 16,
                oLogoColors, oMidTone;

            if (that.bConfigMode && !that.bPriorColorData) {

                oLogoColors = that.imgColorValues(this);

                if (oLogoColors) {
                    that.data.backgroundColor.selected = "White";
                    that.data.headerBackgroundColor.selected = "White";
                    that.data.linkColor.selected = oLogoColors.darkest.hex;
                    that.data.headerLinkColor.selected = oLogoColors.darkest.hex;
                    that.data.foregroundColor.selected = oLogoColors.colors[0].hex;
                    _.each(oLogoColors.colors, function (oColor, nColorIndex) {
                        if (oColor.brightness - oLogoColors.darkest.brightness > MIN_COLOR_DIF_FOR_USABILITY && BRIGHTNESS_OF_WHITE - oColor.brightness > MIN_COLOR_DIF_FOR_USABILITY)
                            that.data.buttonBackgroundColor.selected = oColor.hex;
                    });
                    that.setValues();
                    that.render();
                }

            }
        }





        function styleEditor() {
            var self = this;

            self.write = function (css, title) {

                title = title || "dynamicStyles";

                var $style = $('style[title=' + title + ']').prop("disabled", true).remove(),
                    head = document.head || document.getElementsByTagName("head")[0],
                    style = document.createElement('style');

                style.type = 'text/css';
                style.title = title;

                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                    style.styleSheet.title = title;
                } else {
                    style.appendChild(document.createTextNode(css));
                    style.title = title;
                }

                head.appendChild(style);
            };

        };


        function normalizeColor(sColor) {
            //returns comma delimmited rgb string for all color values
            var oColorFromName = less.tree && less.tree.Color.fromKeyword(sColor),
                aColor;

            try {

                if (oColorFromName)
                    aColor = oColorFromName.rgb;
                if (sColor.indexOf("#") >= 0)
                    aColor = hexToRgb(sColor);
                if (sColor.indexOf("rgb") >= 0)
                    aColor = sColor.match(/\d+/g);

                return aColor.join(",");

            } catch (Error) {
                if (window.console && window.console.log)
                    console.log("unable to normalize color", Error);

                return null;
            }
        }

        function getBrightness(aRGB) {
            return Math.sqrt(.241 * aRGB[0] + .691 * aRGB[1] + .068 * aRGB[2])
        }

        function increaseBrightness(sRGB, percent) {
            if (!sRGB || sRGB == "transparent")
                return sRGB;

            var aRGB = (sRGB.indexOf("#") == 0) ? hexToRgb(sRGB) : sRGB.replace(/[rgb()\s]/g, "").split(","),
                r = Number(aRGB[0]),
                g = Number(aRGB[1]),
                b = Number(aRGB[2]);

            return '#' +
               ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
               ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
               ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
        }

        function hexToRgb(hex) {
            var xThreeDigitHex = /^#?[a-f\d][a-f\d][a-f\d]$/i,
                aRawHex;

            if (xThreeDigitHex.test(hex)) {
                aRawHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
                _.each(aRawHex, function (sVal, i, aRaw) {
                    aRaw[i] = sVal + sVal;
                });
            } else {
                aRawHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            }

            return aRawHex ? [parseInt(aRawHex[1], 16), parseInt(aRawHex[2], 16), parseInt(aRawHex[3], 16)] : null;
        }

        function toHex(v) {
            //converts an rgb array to hex
            //use tgTheme.toHex(tgTheme.normalizeColor(myColor).split(",")) where format is unknown
            return '#' + _.map(v, function (c) {
                c = _.clamp(Math.round(c), 255);
                return (c < 16 ? '0' : '') + c.toString(16);
            }).join('');
        }

        function imgColorValues(imgEl) {

            if (!Modernizr.canvas || !imgEl)
                return null;

            that.imgColorValuesCache = that.imgColorValuesCache || {};

            if (that.imgColorValuesCache[imgEl.src])
                return that.imgColorValuesCache[imgEl.src];

            var canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d'),
                data, width, height,
                i = -4,
                length,
                rgb = { r: 0, g: 0, b: 0 },
                nCount = 0,
                result = {};

            function roundInt(num) {
                var nAccuracy = 5;
                return Math.round(num / nAccuracy) * nAccuracy;
            }

            function threshold(value, key) {
                var MIN_FRACTION_OF_TESTED_PX = .04;
                return value > nCount / blockSize * MIN_FRACTION_OF_TESTED_PX;
            }

            function sort(a1, a2) {
                if (a2[1] > a1[1])
                    return 1;
                else if (a2[1] < a1[1])
                    return -1;
                else return 0;
            }

            function renderValues(sValue) {
                return ({ hex: toHex(sValue.split(",")), rgb: "rgb(" + sValue + ")", brightness: getBrightness(sValue.split(",")) });
            }

            if (!imgEl || !context) {
                return null;
            }

            height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
            width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

            try {
                context.drawImage(imgEl, 0, 0);
                data = context.getImageData(0, 0, width, height);
            } catch (e) {
                //img can't be accessed on different domain
                //or img file not found
                return null;
            }

            length = data.data.length;

            var OPACITY_THRESHOLD = 254,
                aPixels = [],
                blockSize = _.clamp(Math.round(data.data.length / 10000), 50, 1);// visit every blocksize pixels based on image size



            while ((i += blockSize * 4) < length) {
                if (roundInt(data.data[i + 3]) > OPACITY_THRESHOLD) {
                    ++nCount;
                    sRgb = roundInt(data.data[i]) + "," + roundInt(data.data[i + 1]) + "," + roundInt(data.data[i + 2]);
                    aPixels.push(sRgb);
                }
            }

            function mergeEquivalentColor(aStoredColorData, aTestColorData) {
                function equivalent(a1, a2) {
                    THRESHOLD = 36,
                    bSuccess = true;
                    _.each(a1, function (val, i) {
                        if (Math.abs(val - a2[i]) > THRESHOLD)
                            return bSuccess = false;
                    });
                    return bSuccess;
                }

                var aRgb1 = aStoredColorData[0].split(","),
                    aRgb2 = aTestColorData[0].split(","),
                    aNewRgb = [], iCombinedWeight;

                if (equivalent(aRgb1, aRgb2)) {
                    iCombinedWeight = aStoredColorData[1] + aTestColorData[1];
                    _.each(aRgb1, function (val, i) {
                        aNewRgb[i] = Math.round((val * aStoredColorData[1] + aRgb2[i] * aTestColorData[1]) / iCombinedWeight)
                    });
                    aStoredColorData[0] = aNewRgb.join(",");
                    aStoredColorData[1] = iCombinedWeight;
                    return true;
                }
            }


            var aRawColors = _(aPixels).countBy().pick(threshold).pairs().value();
            var aRounded = [];
            _.each(aRawColors, function (val, i, array) {
                var present = false;
                _.each(aRounded, function (storedVal, iStoredVal) {
                    if (mergeEquivalentColor(storedVal, val)) {
                        present = true;
                        return false;
                    }
                });
                if (!present)
                    aRounded.push(val);
            });

            result.colors = _(aRounded).sort(sort).pluck(0).map(renderValues).value();

            result.lightest = _.max(result.colors, "brightness");

            result.darkest = _.min(result.colors, "brightness");

            that.imgColorValuesCache[imgEl.src] = result;

            return result;
        }
    }

    window.tgTheme = new tgThemeBuilder().init();

})();






//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR EXTENSIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>




function extendAngular() {

    $(function () {

        function beforeDialogClose() {
            if (this.$result != undefined) {
                var $iframe = this.$result.find("iframe"),
                    frameWindow = $iframe.prop("contentWindow");

                if (frameWindow != undefined) {
                    frameWindow.blur();
                    document.body.focus();
                    $iframe.remove();
                }
            }
            $.untrapFocus();

            return true;
        }

        if (angular.dependencies && angular.dependencies.ngDialog) {
            //wait for ngDialog to be added as a property of the angular object in directive
            _.addCallBack(angular.dependencies.ngDialog, "open", function (oOptions) {
                var that = this,
                    $dialog;
                if (oOptions.template != "InActivityWarning")
                    appScope.scrolltop();
                setTimeout(function () {
                    $dialog = $(that.$result).trapFocus();

                    if (oOptions.draggable) {
                        $dialog.addClass("draggable").children(".ngdialog-content").draggable();
                    }
                }, 0)

            });

            _.doBefore(angular.dependencies.ngDialog, "close", beforeDialogClose);

            _.doBefore(angular.dependencies.ngDialog, "closeAll", beforeDialogClose);

            _.addCallBack(angular.dependencies.ngDialog, "close", function () {
                setTimeout(tgTheme.store, 0);
            });

            _.addCallBack(angular.dependencies.ngDialog, "closeAll", function () {
                setTimeout(tgTheme.store, 0);
            });

            angular.beforeDialogClose = function () {
                beforeDialogClose.apply({ $result: $(".ngdialog:visible").eq(0) });
            };
        }
    })

    angular.nearestScopeVal = function (sTerm, originalScope) {
        //returns the evaluation of the term in the scope passed
        //or in ancestor scopes or in descendant scopes
        //EVEN IF THE SCOPES ARE ISOLATE SCOPES

        var scope = originalScope,
            uReturnVal;

        checkForValue();
        if (uReturnVal)
            return uReturnVal;

        //check ancestor scopes
        while (scope.$parent) {
            scope = scope.$parent;
            checkForValue();
            if (uReturnVal)
                return uReturnVal;
        }

        //check descendant scopes
        scope = originalScope;
        while (scope.$$childHead) {
            scope = scope.$$childHead;
            checkForValue();
            if (uReturnVal)
                return uReturnVal;
        }


        function checkForValue() {
            var uVal;
            try {
                uVal = scope.$eval(sTerm)
                if (uVal)
                    uReturnVal = uVal;
            } catch (Error) {
            };
        }
    }
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LO-DASH EXTENSIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function extendLodash() {
    _.assign(_, {
        clamp: function clamp(v, max, min) {
            return Math.min(Math.max(v, min || 0), max || 1000000000);
        },
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        },
        serialize: function (obj) {
            var aOutput = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    aOutput.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return aOutput.join("&");
        },
        deserialize: function (sSeries, sInitialDelimiter) {
            var sData = sSeries.split(sInitialDelimiter || "?")[1];

            return _.object(_.each(sData ? sData.split("&") : [], function (str, i, a) {
                a[i] = str.split("=");
            }))
        },
        setState: function (oTarget, oReference, nMaxLevel, nLevel) {
            if (oTarget) {
                nLevel = nLevel || 1;
                nMaxLevel = nMaxLevel || 10;
                _.forIn(oReference, function (val, key, oRef) {
                    if (_.isObject(val) || _.isArray(val)) {
                        oTarget[key] = _.clone(val, false);
                        if (nLevel < nMaxLevel)
                            _.setState(oTarget[key], val, nMaxLevel, nLevel + 1);
                    } else
                        oTarget[key] = val;
                });
            } else {
                oTarget = oReference;
            }
        },
        setReferencedProp: function (oParent, sProps, uVal) {
            var oProp = oParent;
            _.each(sProps.split("."), function (sDiscreteProp, i, aProps) {
                if (i == aProps.length - 1)
                    oProp[sDiscreteProp] = uVal;
                else
                    oProp = oProp[sDiscreteProp];
            })
        },
        naturalSort: function (as, bs) {
            var a, b, a1, b1, i = 0, n, L, rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
            if (as === bs) return 0;
            a = as.toLowerCase().match(rx);
            b = bs.toLowerCase().match(rx);
            L = a.length;
            while (i < L) {
                if (!b[i]) return 1;
                a1 = a[i],
                b1 = b[i++];
                if (a1 !== b1) {
                    n = a1 - b1;
                    if (!isNaN(n)) return n;
                    return a1 > b1 ? 1 : -1;
                }
            }
            return b[i] ? -1 : 0;
        },
        sort: function (uCollection, fnSort, sField) {

            if (!uCollection || !uCollection.length || uCollection.length < 2)
                return uCollection;

            if (_.isString(fnSort)) {
                sField = fnSort;
                fnSort = null;
            }

            return uCollection.sort(fnSort || sField ? naturalSortBy : _.naturalSort);

            function naturalSortBy(o1, o2) {
                return _.naturalSort(o1[sField], o2[sField])
            }
        },

        addCallBack: function (obj, originalMethodName, callBackMethod, context, doBefore, appendOutcome) {
            var fnOriginal = obj[originalMethodName],
                outcome;

            context = context || obj;

            obj[originalMethodName] = function () {
                var doBeforeSuccessful,
                    outcome;

                if (doBefore)
                    doBeforeSuccessful = callBackMethod.apply(this, arguments);

                if (doBeforeSuccessful || !doBefore)
                    outcome = fnOriginal.apply(this, arguments);

                if (!doBefore)
                    callBackMethod.apply(this, appendOutcome ? _(arguments).union([outcome]).value() : arguments);

                return outcome;
            };
        },

        doBefore: function (obj, originalMethodName, callBackMethod, context) {
            _.addCallBack(obj, originalMethodName, callBackMethod, context, true);
        }
    });
}


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<< JQUERY EXTENSIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function extendJQuery() {
    $.extend({
        keyCodes: {
            enter: 13,
            tab: 9,
            shift: 16,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            escape: 27,
            home: 36,
            end: 35,
            space: 32,
            pageUp: 33,
            pageDown: 34,
            back: 8
        },
        queryParams: function () {
            return $.queryParamsCache = $.queryParamsCache || _.deserialize(window.location.search);
        },
        log: function () {
            if (window.console && console.log) {
                try {
                    console.log.apply(console, arguments);
                }
                catch (Error) {

                }
            }

        },

        announceActive: function (oWidget, $li, sAnnouncement) {
            //aria-activedescendant is the generally accepted method to make single select widgets screenreader friendly
            //there really is no generally accepted way to make multiselect widgets screenreader friendly
            //this method announces selections within a multiselect widget to screenreaders
            //it is used in candidate experience for both jqueryui autocompletes and jqueryui selectmenus that have been modified for multiple selections
            setTimeout(function () {
                var bChecked = $li.children(".ui-menu-item-wrapper").children(".pseudocheckbox").hasClass("checked"),
                    oStrings = (appScope && appScope.dynamicStrings) || {},
                    sScreenReaderAnnouncement = $li.text() || sAnnouncement,
                    $element = oWidget.button || oWidget.element,
                    sId = $element.prop("id") + "_active-item-status";

                if (bChecked)
                    sScreenReaderAnnouncement += (" " + oStrings.Message_Selected);

                oWidget.$activeItemStatus = $.announce($element, sScreenReaderAnnouncement, sId);
                oWidget.activeDescendant = $li;
            }, 0);
        },
        announce: function ($element, sMessage, sId) {
            //general screen-reader announcement tied to an element with focus

            sId = sId || $element.prop("id") + "-status";

            var $statusEl = $element.data("statusEl") || $('<span></span>').addClass("screenReaderText activeItemStatus").attr({
                "id": sId,
                "role": "status",
                "aria-relevant": "additions",
                "aria-live": "assertive"
            }).insertAfter($element.addToAttr("aria-describedby", sId));

            $statusEl.text(sMessage);
            setTimeout(function () {
                $statusEl.text("");
            }, 600);

            $element.data({ statusEl: $statusEl });

            return $statusEl;
        },
        stringContains: function (sComplete, sPartial, bStartsWith) {
            //case insensitive string contains test
            var i = sComplete.toLowerCase().indexOf(sPartial.toLowerCase())
            return bStartsWith ? i == 0 : i >= 0;
        },
        matchWordOrPhrase: function (sComplete, sPartial) {
            //return a complete phrase if the partial string matches the beginning of the phrase
            //otherwise return the first word within the phrase which begins with the partial string
            //argument uPartial, type unkonwn, is either a string or an index in the array of strings asArrayOfPartials
            var regex = new RegExp("\\b" + sPartial + ".*?\\b", "i"); sComplete.match(regex);

            return sComplete.toLowerCase().indexOf(sPartial.toLowerCase()) == 0 ? [sComplete] : sComplete.match(regex);
        },
        form: function (url, data, method, target, id) {
            if (method == null) method = 'POST';
            if (data == null) data = {};
            if (target == null) target = "";
            if (id == null) id = "form" + (new Date().getTime());

            var form = $('<form>').attr({
                method: method,
                action: url,
                target: target,
                id: id//some versions of safari require unique form ids where multiple forms submit
            }).css({
                display: 'none'
            });

            var addData = function (name, data) {
                if ($.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        var value = data[i];
                        addData(name + '[]', value);
                    }
                } else if (typeof data === 'object') {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            addData(name + '[' + key + ']', data[key]);
                        }
                    }
                } else if (data != null) {
                    form.append($('<input>').attr({
                        type: 'hidden',
                        name: String(name),
                        value: String(data)
                    }));
                }
            };

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    addData(key, data[key]);
                }
            }

            return form.appendTo('body');
        },

        htmlEncodeSpecial: function (obj) {
            _.each(obj, function (uVal, sProp, oObj) {
                if (_.isString(uVal) && (sProp.toLowerCase() != 'questiondescription' && sProp.toLowerCase() != 'optionname'))
                    oObj[sProp] = oObj[sProp].replace("<", "&lt;").replace(">", "&gt;");
            });
        },

        htmlDecodeSpecial: function (obj) {
            _.each(obj, function (uVal, sProp, oObj) {
                if (_.isString(uVal))
                    oObj[sProp] = oObj[sProp].replace("&lt;", "<").replace("&gt;", ">");
            });
        },
        normalizeEventCoords: function (event) {
            event.pageX = event.pageX || event.clientX + document.body.scrollLeft;
            event.pageY = event.pageY || event.clientY + document.body.scrollTop;
        },

        pinToFold: function ($new, bExclusive) {
            //pins element to the fold or repositions already pinned element(s) to the fold
            if (!this.$stuckToFold) {
                this.$stuckToFold = $();
                $(window).resize(function () {
                    $.$stuckToFold.positionAtFold();
                });
            }

            if (bExclusive === true)
                this.$stuckToFold = $();

            if ($new && $new.pinToFold)//accept only a jQuery object
                this.$stuckToFold = this.$stuckToFold.add($new);

            this.$stuckToFold.positionAtFold().removeClass("hideUntilPinned");
        },

        captureFocus: function ($el) {
            //captures the focused element as required when launching a dialog
            if (!($el instanceof $))
                $el = null;
            $.$priorFocus = $.$priorFocus || $();
            $.$priorFocus = $.$priorFocus.appendObj(($el && $el.eq(0)) || $(document.activeElement));
        },

        restoreFocus: function () {
            //restores focus to a previously focused element as required when closing a dialog
            if ($.$priorFocus) {
                $.$priorFocus.eq(-1).focus();
                $.$priorFocus.pop();
            }
        },

        untrapFocus: function (bRestore) {
            ($.$focusTrap || $()).untrapFocus(bRestore);
        },

        maintainFocus: function (e) {
            if (!$.$focusTrap)
                return;

            var $focusable = $.$focusTrap.eq(-1).find(":tabbable");

            if (e.keyCode == $.keyCodes.tab) {
                if (e.target == $focusable.last()[0] && !e.shiftKey) {
                    $focusable.first().focus();
                    e.preventDefault();
                }
                else if (e.target == $focusable.first()[0] && e.shiftKey) {
                    $focusable.last().focus();
                    e.preventDefault();
                }
            }
        },

        shout: function () {
            if ($.queryParams().debug) {
                $.messenger().size().log(arguments).logStack();
            }
        },

        loadingTextEl: function () {
            var sLoading = ($.dynamicStrings && $.dynamicStrings.Message_Loading) || "loading";
            return $('<span class="screenReaderText loadingText" role="status" aria-live="assertive"><span>').text(sLoading);
        },

        loadingGifEl: function () {
            return $('<span class="ui-autocomplete-loading"></span>').append($.loadingTextEl());
        },

        messenger: function () {
            return $.oMessenger = ($.oMessenger || new Messenger());

            function Messenger() {
                var that = this;

                this.$element = $("<div></div>").css({
                    position: "fixed",
                    zIndex: 1000,
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "White",
                    overflow: "auto",
                    border: "solid medium blue"
                }).attr("id", "debugMessengerDiv").appendTo(document.body);

                this.size = function () {
                    that.$element.css({
                        maxHeight: window.innerHeight + "px"
                    });
                    return that;
                }

                this.log = function (args) {
                    var aArgs = Array.prototype.slice.call(args),
                        text = aArgs.join(" ");

                    $("<p></p>").css("margin", "20px").html(text).appendTo(that.$element.show());
                    that.clearTimer();
                    if (!that.bPersisting)
                        that.timer = setTimeout(that.close, 8000);
                    return that;
                }

                this.logStack = function () {
                    var text = stackTrace().split(".shout")[1] || "";
                    that.log([text]);
                    that.$element.find("p").last().addClass("stack").toggle(that.bStack);
                    return that;
                }

                this.close = function () {
                    that.$element.hide(400);
                    that.clearTimer();
                }

                this.clearTimer = function () {
                    if (that.timer)
                        clearTimeout(that.timer);
                    that.timer = null;
                }

                this.bPersisting = false;

                this.$close = $("<a></a>").text(" [close] ").attr("href", "#").click(function (e) {
                    that.close();
                    e.preventDefault();
                });

                this.$persist = $("<a></a>").text(" [persist] ").attr("href", "#").click(function (e) {
                    that.bPersisting = !that.bPersisting;
                    that.$persist.text(that.bPersisting ? " [timer] " : " [persist] ");
                    if (that.bPersisting)
                        that.clearTimer();
                    e.preventDefault();
                });

                this.$clear = $("<a></a>").text(" [clear] ").attr("href", "#").click(function (e) {
                    that.$element.find("p").not(":first-child").remove();
                    e.preventDefault();
                });

                this.$stack = $("<a></a>").text(" [stack] ").attr("href", "#").click(function (e) {
                    that.bStack = !that.bStack;
                    that.$element.find("p.stack").toggle(that.bStack);
                    e.preventDefault();
                });

                $("<p></p>").append(that.$close).append(that.$persist).append(that.$clear).append(that.$stack).css("margin", "20px").appendTo(that.$element);

                function stackTrace() {
                    try {
                        var err = new Error();
                        return err.stack;
                    } catch (error) {
                        return "Can't trace stack"
                    }
                }
            }
        }
    });


    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<< JQUERY COLLECTION METHOD EXTENSIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    $.fn.extend({
        exists: function () {
            //return this (for chaining) if jQuery collection is populated OR false (for succinct conditionals) if not populated
            return (this.length > 0 && this) || false;
        },

        equals: function (uOther) {
            //return true if both collections share the same members
            return !this.not(uOther).length && !$(uOther).not(this).length;
        },

        addToAttr: function (sAttr, sAddingVal, sDelim) {
            var sOldVal = this.attr(sAttr) || "";

            if (sOldVal && sAddingVal)
                sOldVal += (sDelim || " ");

            return this.attr(sAttr, sOldVal + (sAddingVal || ""));
        },

        appendObj: function (obj) {
            var newArray = $(this).toArray();
            if (newArray.indexOf(obj) < 0)
                newArray.push(obj);
            return $(newArray);
        },

        configLadda: function (color, size) {
            var that = this,
                oLaddaButton;

            if (this.data("ladda"))
                return this;

            this.addClass("ladda-button").attr("aria-live", "assertive");

            //set color to text color
            if (!color) {
                color = this.css("color");
                if (color && tgTheme) {
                    try {
                        color = tgTheme.toHex(tgTheme.normalizeColor(color).split(",")),
                        this.attr("data-spinner-color", color);
                    } catch (Error) {

                    }
                }
            }

            //set required defaults if absent
            if (!this.attr("data-style"))
                this.attr("data-style", "expand-right");
            if (!this.attr("data-spinner-size"))
                this.attr("data-spinner-size", size || 35);
            if ($.fn.uniqueId)
                this.uniqueId();


            this.attr("aria-live", "assertive").children(".loadingText").remove();

            setTimeout(function () {
                oLaddaButton = Ladda.create(that[0])
                oLaddaButton.button = that.attr("id");

                angular.element(that).scope().oActiveLaddaButton = oLaddaButton;
                that.data("ladda", oLaddaButton);
            }, 0);

            return this;
        },

        toggleSpinner: function (color, size) {
            var that = this;

            this.configLadda(color, size);
            setTimeout(function () {
                that.data("ladda").toggle();
            });

            return this;
        },

        setFocus: function (uSelector, uNotSelector, nRecursion) {
            //for accessibility
            //method is meant to be used after ajax refresh
            //finds the first tabbable element in this (the container) matching selectors if present
            //returns jquery object containing that element and sets focus to it
            var nMaxRecursion = 10,
                that = this,
                $focusEl;

            _.delay(function () {
                //wait for possible angular compile and render               
                var $focusable = that.find(":tabbable").filter($(uSelector || "*")).not(uNotSelector || ".fieldHelp"),
                    $focusEl = $focusable.length > 1 ? $focusable.not("[class*=close], a[class*=back], .backLink > a").eq(0) : $focusable;

                $focusEl.focus();
                nRecursion = nRecursion || 0;
                if ($focusEl[0] !== document.activeElement && nRecursion < nMaxRecursion)
                    _.delay(function () {
                        that.setFocus(uSelector, uNotSelector, (nRecursion + 1));
                    }, 250);
            }, 0)

            return this;
        },

        trapFocus: function (uSelector, uNotInitialSelector, bFocus, bRemoveFocus, bCaptureFocus) {
            //for accessible modal dialogs
            //sets focus within the dialog (unless bFocus is EXPLICITLY set to false)
            //traps keyboard navigation within a circular tab order
            //restores focus properly upon closing dialog (unless bFocus is EXPLICITLY set to false)
            //last two arguments are important when widgets are frequently repainting and taking focus actions independently
            var that = this,
                bRetrapSame = $.$focusTrap && this.equals($.$focusTrap.eq(-1));

            if (!this.length) {
                return this;
            }

            if (bCaptureFocus !== false)
                $.captureFocus();

            $.untrapFocus(false);

            $.$focusTrap = ($.$focusTrap || $()).add(this.eq(0));

            this.keydown($.maintainFocus);

            //avoid setting initial focus to a close button in a dialog
            //unless it's an alert style dialog with no other focusable elements
            if (that.find(":tabbable").length > 1 && !uNotInitialSelector)
                uNotInitialSelector = "[class*=close]";

            if (bFocus !== false)
                this.setFocus(uSelector, uNotInitialSelector);

            if (bRemoveFocus === true) {
                this.focusLeave(function () {
                    //this approach to untrapping focus has been abandoned but can be utilized with the bRemoveFocus argument
                    setTimeout(function () {
                        if ($.$focusTrap.eq(-1).equals(that)) {
                            $.untrapFocus();
                        }
                    })
                })
            }

            return this;
        },

        focusLeave: function (fnHandler, oContext) {
            //trigger handler if focus has left the container element
            //this is more of a promise than a listener
            //it removes listener upon execution of handler
            var that = this;

            document.body.addEventListener("blur", checkFocusLeave, true);
            document.body.addEventListener("focus", checkFocusLeave, true);
            $(document.body).keydown(checkFocusLeave);
            $(document.body).click(checkFocusLeave);

            return this;

            function checkFocusLeave(e) {
                var newEvent = _.clone(e, true), bHandled;

                newEvent.type = "focusleave";

                //delay for other focus methods to execute and to avoid momentary activeElement of body
                setTimeout(function () {
                    var bThisIsGone = !that.is(":visible"),
                        bFocusLeft = !that.find(document.activeElement).exists();

                    //if focus has left our container, call the handler
                    if ((bThisIsGone || bFocusLeft) && !bHandled) {
                        fnHandler.apply(oContext || that, [newEvent]);
                        bHandled = true;
                        document.body.removeEventListener("blur", checkFocusLeave, true);
                        document.body.removeEventListener("focus", checkFocusLeave, true);
                        $(document.body).off("click", checkFocusLeave);
                        $(document.body).off("keydown", checkFocusLeave);
                    }
                }, 0)
            }
        },

        trapFocusInAncestor: function (uSelector) {
            this.closest(uSelector || "body").trapFocus();
            return this;
        },

        untrapFocus: function (bRestore) {
            var that = this,
                $trapHere;

            if (bRestore !== false) {
                $.restoreFocus();
                $.$focusTrap = $.$focusTrap || $();
                if ($.$focusTrap.length > 1) {
                    $.$focusTrap.pop();
                    $trapHere = $.$focusTrap.eq(-1);
                    $.$focusTrap.pop();//pop where we will trap ($trapHere) from collection since trapFocus will add it right back
                    $trapHere.trapFocus(null, null, false, null, false);
                }
            }
            that.off("keydown", $.maintainFocus).off("focusout", $.untrapFocus);

            return that;
        },

        pinToFold: function (bExclusive) {
            //pins elements to bottom of window only when body contents is shorter than window height
            $.pinToFold(this, bExclusive);
        },

        positionAtFold: function () {
            //places elements at bottom of window only when body contents is shorter than window height
            var that = this,
                pageHeight = $(document.body).height(),
                footerHeight = this.outerHeight();
            _.delay(function () {
                //if it is from Talent Suite, put the responsive footer above TalentSuite footer
                var tsHeader = 0;
                if (that.attr('fromts'))
                    tsHeader = 50;
                if ($('#swfCoreFooter').is(':visible')) {
                    if (pageHeight < $(window).height() - footerHeight) {
                        that.css({
                            'position': 'fixed',
                            'bottom': '40px'
                        });
                        //move the apply button on job detail page up
                        $(".buttonsFooter").css({ 'bottom': '50px' });
                    } else {
                        that.css({
                            'position': '',
                            'bottom': '40px'
                        });
                    }
                } else {
                    if (pageHeight < $(window).height() - footerHeight - tsHeader) {
                        that.css({
                            'position': 'absolute',
                            'bottom': '0'
                        });
                    } else {
                        that.css({
                            'position': '',
                            'bottom': ''
                        });
                    }
                }
            });

            return this;
        },

        filterInput: function (regx) {
            //only allow specific characters in an input

            return this.keypress(function (e) {
                var char = e.key;

                if (char && char.length == 1)
                    return regx.test(char);
                else
                    //strings such as "down arrow" = special keys
                    //no string = no event key property support
                    return true;
            });
        },

        selectTextOnFocus: function () {
            //selects all the text in an input upon tabbing to it or upon clicking in
            //subsequent clicks position the cursor and deselect text if it is selected
            //this is a default behavior in some but not all browsers
            var $el = this;

            this.focusin(selectText).click(selectText);
            this.focusout(function () {
                $el.data("bHasFocus", false);
            })
            return this;

            function selectText(event) {
                var el = this;

                if (!$el.data().bHasFocus) {
                    _.delay(function (event) {
                        if (el.setSelectionRange)
                            el.setSelectionRange(0, 9999);
                        else
                            el.select();
                    })
                }
                $el.data("bHasFocus", true);

            }
        },
        enter: function (fn, aArgs) {
            var that = this;
            this.bind("keydown keypress", function (event) {
                if (event.keyCode === $.keyCodes.enter) {
                    fn.apply(that, aArgs || [event, that]);
                    event.preventDefault();
                }
            });
            return this;
        },
        pop: function () {
            var top = this.eq(-1);
            this.splice(this.length - 1, 1);
            return top;
        },
        hoverClass: function (sClass) {
            this.hover(function (e) {
                $(this)[e.type == "mouseenter" ? "addClass" : "removeClass"](sClass || "hover");
            });
            return this;
        },
        downClass: function (sClass) {
            this.mousedown(function (e) {
                $(this).addClass(sClass || "down");
            }).mouseup(function (e) {
                $(this).removeClass(sClass || "down");
            }).mouseleave(function (e) {
                $(this).removeClass(sClass || "down");
            });
            return this;
        },
        actionable: function (sHoverClass, sDownClass) {
            this.hoverClass(sHoverClass).downClass(sDownClass);
        },
        slideDownSafe: function () {
            var that = this.hide(),
                args = arguments;

            _.delay(function () {
                that.slideDown.apply(that, args);
            })
            return this;
        },
        classList: function () {
            //Polyfill for IE<=9 
            return this.attr("class") ? this.attr("class").split(/\s+/) : [];
        },
        autoColor: function () {
            this.autocomplete({ source: (less.tree.colors || less.data.colors) });
            return this;
        },
        sizeToFrameContent: function (nPadding) {
            if (this.prop("tagName") == "IFRAME") {
                this.height($(this.prop("contentDocument").body).height() + (nPadding || 0) + "px");
            }
            return this;
        },
        sizeFrameElement: function (nPadding) {
            setTimeout(function () {
                parent.$(window.frameElement).sizeToFrameContent(nPadding);
            }, 0);
            return this;
        },
        positionConstrained: function (x, y, padding) {
            //positions an element constrainted to the viewport
            //be sure element is not animating or set to display none
            var originalX = x, originalY = y;

            padding = padding == undefined ? 10 : padding;
            x = _.clamp(x || this.offset().left, $(window).width() - this.outerWidth() - padding, padding);
            y = _.clamp(y || this.offset().top, $(window).scrollTop() + $(window).height() - this.outerHeight() - padding, $(window).scrollTop() + padding);
            if ((y != originalY || x != originalX) && this.hasClass("tooltip")) {
                //tooltips look crappy when they don't fit in the viewport,
                //so unstlye and center
                this.removeClass("tooltip");
                this.center();
            }
            else
                this.css({ top: y + "px", left: x + "px" });
            return this;
        },
        center: function (bFixed) {
            var that = this;

            _.delay(center);
            if (bFixed !== false) {
                $(window).resize(center);
                this.data("fixedCentered", true);
            }
            return this;

            function center() {
                if (!that.data("fullScreenMode")) {
                    that.css({
                        position: "fixed",
                        top: ($(window).height() - that.height()) / 2,
                        left: ($(window).width() - that.width()) / 2
                    });
                }
            }
        },
        fullScreen: function (bPhoneOnly) {
            var that = this;

            _.delay(setCss);
            if (bPhoneOnly)
                $(window).resize(setCss);
            return this;

            function setCss() {
                if ($(window).width() <= 480) {
                    that.data("fullScreenMode", true);
                    that.css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        width: "auto"
                    });
                } else {
                    if (that.data("fullScreenMode"))
                        with (that[0].style) {
                            top = "";
                            left = "";
                            right = "";
                            width = "";
                        };
                    that.data("fullScreenMode", false);
                }
            }
        },
        alignTooltipToParentTarget: function (nDistanceToPointer) {
            if ($.queryParams().targetX == undefined)
                return this.center().removeClass("tooltip");

            var x = $.queryParams().targetX - (nDistanceToPointer || 80),
                y = $.queryParams().targetY - this.height();

            return this.css("visibility", "visible").positionConstrained(x, y);
        },
        positionAsChildMenu: function ($parentMenuItem, bPrimary) {
            var sOriginalDisplay = this.children()[0].style.display;

            this.children()[0].style.display = "";
            this.children()[0].style.height = "auto";

            var PADDING = 10,
                that = this,
                oTargetOffset = $parentMenuItem.offset(),
                nTargetRight = oTargetOffset.left + $parentMenuItem.parent().width(),
                nRawTop = bPrimary ? oTargetOffset.top + $parentMenuItem.height() : oTargetOffset.top,
                nOverflowV = $(window).scrollTop() + $(window).height() - nRawTop - this.outerHeight() - PADDING,
                bOverflowH = nTargetRight + this.outerWidth() + PADDING > $(window).width(),
                top = nOverflowV < 0 ? Math.max(0, nRawTop + nOverflowV) : nRawTop,
                oCss = { top: top + "px" };

            if (bPrimary) {
                oCss.left = oRect.left;
                this.addClass("primaryMenu");
            }
            else if (bOverflowH)
                oCss.left = oTargetOffset.left - this.outerWidth();
            else
                oCss.left = nTargetRight;
            oCss.left += "px";
            this.css({ top: "-10000px", display: "inline-block" }).appendTo(document.body);
            this.children()[0].style.display = sOriginalDisplay;

            setTimeout(function () {
                that.css(oCss).slideDownSafe(function () {
                    $(this).trapFocus();
                });
            }, 400);
            return this;
        },
        ghost: function () {
            //create an element to display watermark style text within an element
            //for placeholder in older browsers or typeahead text
            var $original = this;

            $clone = $(document.createElement("span"))
                .attr("class", $original.attr("class")).removeClass("hasCue").removeClass("hasClone").removeClass("hasTypeAhead")
                .click(function () { $original.focus(); })
                .attr("tabIndex", -1).insertBefore($original.addClass("hasClone"));

            setTimeout(function () {
                if ($original.css("lineHeight") == "normal")
                    $original.add($clone).css("lineHeight", 1);
            }, 0);

            return $clone;
        },
        sizeDialog: function (nPercentH, nPercentW) {
            var $body = this.children(".body");
            _.delay(function () {
                if (nPercentH)
                    $body.css("height", $(window).height() * nPercentH / 100 - $body.prev().height() - $body.next().height() + "px");
                if (nPercentW)
                    $body.css("width", $(window).width() * nPercentW / 100 + "px");
            })
        },
        scrollAndFocus: function (MARGIN) {
            //focus automatically scrolls a control into view
            //but often its label element remains above the fold
            //this method scrolls to the container, then finds the input and focuses
            MARGIN = MARGIN || 20;
            var target = this.is(":hidden") ? this.closest(":not(:hidden)") : this,
                 y = target.offset().top - MARGIN;
            $("body, html").animate({ scrollTop: y }, '500', 'swing', function () {
                target.setFocus();
            });

            return this;
        },
        animateMove: function ($to, fnCallback, bStyleProxyAsTo) {
            //proxy animation
            $to = $($to).show();

            var that = this,
                $proxy = (bStyleProxyAsTo ? $to : this).clone().css({ position: "absolute", visibility: "visible" }).appendTo(document.body).position({ of: this, at: "left top", my: "left top" }),
                yMin = $(window).scrollTop(),
                yMax = yMin + $(window).height() - Math.max(this.height(), $to.height());

            this.add($to.hide().slideDown()).css("visibility", "hidden");
            $proxy.animate({ top: _.clamp($to.offset().top, yMax, yMin), left: $to.offset().left }, {
                duration: 1000, easing: "easeInBack", complete: function () {
                    $proxy.remove();
                    $to.css("visibility", "visible");
                    that.css({ maxHeight: that.height() + "px" }).animate({ padding: 0, borderWidth: 0, width: 0, margin: 0, height: 0 }, { duration: 1000, easing: "easeOutBounce", complete: fnCallback });
                }
            })
            return this;
        },
        colorizeSvg: function (cssClass) {
            //enable an image of type svg to be colorized via CSS

            var that = this;

            $.get(this.attr('src'), function (data) {
                that.replaceWith($(data).find('svg').attr({
                    id: that.attr('id'),
                    'class': (that.attr('class') || "") + " " + (cssClass || 'styleableColor')
                }).removeAttr('xmlns:a apply'));//note that addClass fails for SVG elements;);
            }, 'xml');
        },

        revalidateOnChange: function (sEvent, bValidateBeforeSubmit) {
            var that = this;

            this.on(sEvent || "change", function () {
                that.revalidate(bValidateBeforeSubmit);
            });
            return this;
        },

        revalidate: function (bValidateBeforeSubmit) {
            if (this.valid && ($(".errorContainer:visible").length || bValidateBeforeSubmit))
                this.valid();
            return this;
        },

        calendarNav: function calendarNav() {
            //add accessibility features to any calendar widget
            //including keyboard nav
            //
            //DEPENDENCIES:
            //  extended jQuery fn.show with afterShow event,
            //  jQuery fn.gridNav,
            //  jQuery fn.calendarNav,
            //  jQuery fn.trapFocus,
            //  $.keyCodes
            //  jQuery.uniqueId TODO <-- currently in jQueryUI must port over
            //  
            //add to the objects below to add libraries

            var B_RESTORE_FOCUS = true,
                fnGridNavAfterShow = this.data("gridNavAfterShow");

            if (fnGridNavAfterShow) {
                //if we are already nav enabled, just call the aftershow handler
                fnGridNavAfterShow();
                return this;
            }

            var that = this,
                oActiveClasses =
                {
                    cell: "cal-cell-hover",
                    liner: "ui-state-hover"
                },
                oSelectors =
                {
                    trigger: ".ui-datepicker-trigger",
                    title: ".ui-datepicker-title, caltitle",
                    liner: "a",
                    selected: ".ui-datepicker-current-day, .ui-datepicker-days-cell-over, .selected",
                    nextPage: ".ui-datepicker-next.ui-corner-all, .calnavright",
                    prevPage: ".ui-datepicker-prev.ui-corner-all, .calnavleft",
                    nextBook: ".next-year",
                    prevBook: ".prev-year"
                },
                oNavigation = {
                    hide: function () {
                        if ($.datepicker)
                            $.datepicker._hideDatepicker();
                        else
                            that.hide();
                        if (B_RESTORE_FOCUS) {
                            $.restoreFocus();
                        }
                    },
                    bMatchContentOnPageChange: true,
                    bTrapFocus: true
                },
                $calTitle;

            if (this.hasClass("yui-calcontainer")) {
                //YUI calendar titles lack a tag so add one
                try {
                    $calTitle = this.find(".calheader").contents().filter(function () {
                        return this.nodeType === 3
                    }).wrap('<span />').parent().addClass("caltitle");
                } catch (Error) {
                }
            }

            this.keydown(function (e) {
                //gridNav will handle most key events
                //but still need listener to close the calendar on ESC key press when focus is not on the grid 
                if (e.keyCode == $.keyCodes.escape)
                    oNavigation.hide();
            })

            this.attr("role", "dialog").gridNav(oActiveClasses, oSelectors, oNavigation);

            return this;
        },


        gridNav: function (oActiveClasses, oSelectors, oNavigation) {
            //add keyboard navigation for grids
            //with some simple pagination
            var that = this,
                bCalendar = arguments.callee.caller.name == "calendarNav",
                $activeCell = $(),
                $focus = $(),
                $title = $(),
                sWhiteList = (oSelectors && oSelectors.whiteList) || "td",
                sDisabled = "[class*=disable], [disabled], [aria-disabled=true]",
                sExclude = (oSelectors && oSelectors.exclude) || sDisabled,
                $table, fnNextPage, fnPrevPage;

            oActiveClasses = oActiveClasses || { liner: "ui-state-hover" };//default to jQueryUI active class
            oNavigation = oNavigation || {};

            //if we've passed nav button selectors
            //we can just construct the nav functions by triggering a click on them
            if (oSelectors.nextPage && !oNavigation.nextPage) {
                fnNextPage = navOnClickBuilder(oSelectors.nextPage);
            }
            if (oSelectors.prevPage && !oNavigation.prevPage) {
                fnPrevPage = navOnClickBuilder(oSelectors.prevPage);
            }
            if (oSelectors.nextBook && !oNavigation.nextBook) {
                fnNextBook = navOnClickBuilder(oSelectors.nextBook);
            }
            if (oSelectors.prevBook && !oNavigation.prevBook) {
                fnPrevBook = navOnClickBuilder(oSelectors.prevBook);
            }

            that.data("gridNavAfterShow", afterShowHandler);

            that.keydown(keydownHandler);

            that.click(function (e) {
                var aMeaningfulClassNames = [],
                    sSelector;

                //avoid confounding jQueryUI hover state classes
                for (var stop = e.target.classList.length, classCounter = 0; classCounter < stop; classCounter++) {
                    if (e.target.classList[classCounter].indexOf("hover") == -1) {
                        aMeaningfulClassNames.push(e.target.classList[classCounter]);
                    }
                };
                sSelector = "." + aMeaningfulClassNames.join(".");
                enhanceTable(false, sSelector);
                e.preventDefault();
            });

            afterShowHandler();

            return that;

            function afterShowHandler() {
                var bFocus = $(document.activeElement).is(oSelectors.trigger);

                setTimeout(function () {
                    enhanceTable(bFocus);
                    initActiveCell();
                }, 0);
            }

            function keydownHandler(e) {
                var keyCode = e.keyCode,
                    ctrlKey = e.ctrlKey;

                //handle only keystrokes on table except ENTER/SPACE on buttons
                if (e.target.tagName != "TABLE") {
                    if (e.keyCode == $.keyCodes.enter || e.keyCode == $.keyCodes.space) {
                        $focus = that.find(":focus");
                        if (that.find(oSelectors.nextPage).is(":focus") || that.find(oSelectors.nextBook).is(":focus")) {
                            keyCode = $.keyCodes.pageDown;
                            ctrlKey = that.find(oSelectors.nextBook).is(":focus");
                        }
                        if (that.find(oSelectors.prevPage).is(":focus") || that.find(oSelectors.prevBook).is(":focus")) {
                            keyCode = $.keyCodes.pageUp;
                            ctrlKey = that.find(oSelectors.prevBook).is(":focus");
                        }
                    }
                    else
                        return;
                }


                confirmActiveCell();


                switch (keyCode) {
                    case $.keyCodes.up:
                        activate($activeCell.closest("tr").prev().children().eq($activeCell.index()))
                            || newPage(fnPrevPage, cellByIndexBuilder($activeCell.index()), "last");
                        break;
                    case $.keyCodes.down:
                        activate($activeCell.closest("tr").next().children().eq($activeCell.index()))
                            || newPage(fnNextPage, cellByIndexBuilder($activeCell.index()));
                        break;
                    case $.keyCodes.left:
                        activate($activeCell.prev())
                        //only calendars handle lateral arrow keys in a serpentine manner
                            || (bCalendar && activate($activeCell.closest("tr").prev().children().last()))
                            || (bCalendar && newPage(fnPrevPage, null, "last"));
                        break;
                    case $.keyCodes.right:
                        activate($activeCell.next())
                        //only calendars handle lateral arrow keys in a serpentine manner
                            || (bCalendar && activate($activeCell.closest("tr").next().children().first()))
                            || (bCalendar && newPage(fnNextPage, null));
                        break;
                    case $.keyCodes.enter:
                    case $.keyCodes.space:
                        (oSelectors.liner ? $activeCell.find(oSelectors.liner) : $activeCell).click();
                        break;
                    case $.keyCodes.pageUp:
                        if (ctrlKey && fnPrevBook) {
                            newPage(fnPrevBook, findMatchingContent, "last");
                            e.preventDefault();
                            return false;
                        } else {
                            newPage(fnPrevPage, findMatchingContent, "last");
                        }
                        break;
                    case $.keyCodes.pageDown:
                        if (ctrlKey && fnNextBook) {
                            newPage(fnNextBook, findMatchingContent, "first");
                            e.preventDefault();
                            return false;
                        } else {
                            newPage(fnNextPage, findMatchingContent, "first");
                        }
                        break;
                    case $.keyCodes.home:
                        activate($table.find(sWhiteList), "first");
                        break;
                    case $.keyCodes.end:
                        activate($table.find(sWhiteList), "last");
                        break;
                    case $.keyCodes.escape:
                        if (oNavigation.hide)
                            oNavigation.hide();
                        break;
                    default:
                        return;
                }

                e.preventDefault();

            }

            function activate($cells, sOrderMethod) {
                var $test = $cells.not(sExclude), id;

                if ($test.length) {
                    $activeCell.add(oSelectors.selected).add("." + oActiveClasses.cell).removeClass(oActiveClasses.cell).attr("aria-selected", "false").find(oSelectors.liner).removeClass(oActiveClasses.liner);
                    $activeCell = $test[sOrderMethod || "first"]();
                    $activeCell.addClass(oActiveClasses.cell).attr("aria-selected", "true").find(oSelectors.liner).addClass(oActiveClasses.liner);
                    id = $activeCell.prop("id");

                    if (id)
                        $table.attr("aria-activedescendant", id);
                    else
                        $table.removeAttr("aria-activedescendant");//this attr can not be a null string

                    return $activeCell;
                } else
                    return false;
            }

            function newPage(fn, fnActiveCell, sOrderMethod) {
                var bTableHasFocus = $table.is(":focus");

                fnActiveCell = fnActiveCell || function () {
                    return $table.find(sWhiteList);
                }
                if (fn && fn.apply(that) !== false) {
                    setTimeout(function () {
                        enhanceTable(bTableHasFocus);
                        activate(fnActiveCell(), sOrderMethod);
                    }, 0);
                }
            }

            function navOnClickBuilder(sButton) {
                //return a function which navigates by simply clicking the appropriate button
                return function () {
                    if (that.find(sButton).not(sExclude).click().length) {
                        that.find(oActiveClasses.cell).remove(oActiveClasses.cell);
                        that.find(oActiveClasses.liner).remove(oActiveClasses.liner);
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            function cellByIndexBuilder(i) {
                var sSelector = sWhiteList + ":nth-child(" + (i + 1) + ")";

                return function () {
                    return that.find(sSelector);
                }
            }

            function initActiveCell() {
                var $initial = $table.find(oSelectors.selected);
                if (!$initial.length)
                    $initial = $table.find(sWhiteList);
                activate($initial);
            }

            function enhanceTable(bFocus, sSelector) {
                //each time the table is potentially redrawn
                //we must enchance the buttons and table again

                var $buttons = that.find(oSelectors.prevPage).add(oSelectors.nextPage).add(oSelectors.prevBook).add(oSelectors.nextBook);

                $buttons.filter(sDisabled).attr({ "aria-disabled": "true" }).attr("tabindex", -1);
                $buttons.attr("href", "#0").not(sDisabled).removeAttr("aria-disabled").attr("tabindex", 0).click(function () {
                    //store button focus on click
                    $focus = $(this);
                });
                //restore button focus if appropriate
                if ($focus.length) {
                    setTimeout(function () {
                        //assume that all buttons have been redrawn and find them
                        //then find the one that matches the previously focused button
                        $focus = that.find(oSelectors.prevPage).add(oSelectors.nextPage).add(oSelectors.prevBook).add(oSelectors.nextBook).not(sDisabled).filter(function () {
                            return this.className == $focus[0].className || $(this).is(sSelector);
                        });
                        if ($focus.length) {
                            $focus.focus();
                            $focus = $();
                        } else {
                            $table.focus();
                        }
                    }, 0);
                }

                $title = that.find(oSelectors.title).attr({
                    "role": "heading",
                    "aria-live": "assertive",
                    "aria-atomic": "true"
                }).uniqueId();

                $table = that.add(that.find("table")).attr({
                    "aria-labelledby": $title.prop("id")
                }).filter("table").eq(0).attr({
                    "tabindex": 0,
                    "role": "grid"
                });

                $table.find("tr").filter(function (i, tr) {
                    return $(tr).find(sWhiteList).not(sExclude).length;//only rows with active cells role
                }).attr("role", "row").find(sWhiteList).not(sExclude).uniqueId().attr({
                    "aria-selected": "false",
                    "role": "gridcell"
                }).find(oSelectors.liner).attr("tabindex", "-1");

                if (bFocus !== false) {
                    setTimeout(function () {
                        $table.focus();
                    })
                }

                if (oNavigation.bTrapFocus)
                    that.trapFocus(null, null, false, false, false);//momentary blurring may require that we trap focus again

                return $table;
            }

            function confirmActiveCell() {
                var x, y;
                //tables are replaced in the DOM in many widgets at odd times with few events fired
                //if table has been replaced, find active cell via coordinates
                if (!that.find($activeCell).length) {
                    x = $activeCell.index();
                    y = $activeCell.parent().index();
                    iTbody = $activeCell.parent().parent().index();
                    $activeCell = enhanceTable(false).children().eq(iTbody).children().eq(y).children().eq(x);
                }
            }

            function findMatchingContent() {
                //find cell with same content as on a previous page
                //as in page change on a calendar
                var $result = $();

                if (oNavigation.bMatchContentOnPageChange) {
                    $.each($table.find(sWhiteList).not(sExclude), function () {
                        if ($(this).text() == $activeCell.text())
                            $result = $result.add(this);
                    });
                }
                //when we can't find a matching cell
                //return all the cells and let order method in new page pick our cell
                if (!$result.length)
                    $result = $result.add(that.find(sWhiteList));
                return $result;
            }
        },


        innerNav: function () {
            //create keyboard navigation for a listbox or menu style widget
            //essential for section 508/WAI compliance

            var that = this,
                $ul = $("#" + that.attr("aria-owns")),
                i = 0;

            that.add($ul).focusin(function (e) {
                i = -1;
            }).focusout(clear).keydown(keyDownHandler);

            that.data("keyDownHandler", keyDownHandler);//so we can call externally from input

            function keyDownHandler(e) {
                var B_GUARD_AGAINST_REPAINT = false;

                if (B_GUARD_AGAINST_REPAINT)
                    $ul = $("#" + that.attr("aria-owns"));

                switch (e.keyCode) {

                    case $.keyCodes.down:
                    case $.keyCodes.right:
                        nav(1);
                        return false;

                    case $.keyCodes.up:
                    case $.keyCodes.left:
                        nav(-1);
                        return false;

                    case $.keyCodes.enter:
                        $ul.click();
                        break;

                    case $.keyCodes.escape:
                        clear();
                        i = -1;
                        break;
                }
            }

            function target() {
                return $ul.children().eq(i);
            }

            function clear() {
                $ul.children().removeClass("highlighted");
                that.removeAttr("aria-activedescendant");
            }

            function nav(iInterval) {
                var sId;

                i += iInterval;
                if (i < 0)
                    i = $ul.children().length - 1;
                if (i >= $ul.children().length)
                    i = 0;
                clear();
                target().addClass("highlighted");
                sId = target().prop("id");
                if (sId)
                    that.attr("aria-activedescendant", sId);
            }
        },

        deleteWithBounce: function (fnComplete) {
            this.css({ visibility: "hidden", maxHeight: "27px" }).animate({ padding: 0, borderWidth: 0, width: 0, height: 0, margin: 0 }, {
                duration: 1000, easing: "easeOutBounce", complete: function () {
                    if (fnComplete) {
                        fnComplete();
                        this.removeAttribute("style");
                    }

                }
            });
        }
    });
}

_.addCallBack($.fn, "show", function () {
    this.trigger("afterShow");
});

_.doBefore($.fn, "uniqueId", function (sContainerSelector) {
    //the base jQueryUI uniqueId method creates problems for QE automation
    //this method creates more stable ids should the DOM repaint the same element 

    if (this.prop("id") && this.length == 1)
        return true;

    var sAncestorName = this.closest("[name]").attr("name"),
        $idCollection = this.parents("[id]"),
        $container = this.closest(sContainerSelector).exists() || this.closest("div"),
        sAncestorId = $container.find($idCollection).prop("id") || $container.prop("id"),
        sAncestorIdentifier = sAncestorId || sAncestorName || ($container.prop("className") ? $container.prop("className").replace(" ", "_") : ""),
        sName = this.attr("name"),
        sTagName = this.prop("tagName"),
        i = this.index(),
        sThisIdentifier = sTagName + (sName ? "_" + sName : "") + "_" + i,
        id;

    if (sAncestorIdentifier) {
        id = sAncestorIdentifier + "_" + sThisIdentifier;
        $.oIdCounts = $.oIdCounts || {};
        if ($.oIdCounts[id] && document.getElementById(id)) {
            $.oIdCounts[id]++;
            id += "_" + $.oIdCounts[id];
        } else {
            $.oIdCounts[id] = 1;
        }
        if (this.length > 1) {
            this.each(function (ii) {
                if (!this.id)
                    this.id = id + "_" + ii;
            })
        } else {
            this.prop("id", id);
        }
    }

    return true;
});


//<<<<<<<<<<<<<<<<< JQUERYUI EXTENSIONS >>>>>>>>>>>>>>>>>>>>>>>

//default to starting calendar on Sunday
$.datepicker._defaults.firstDay = 0;

$.datepicker.addYearButtons = function () {
    //add accessibility features to the jQueryUI datepicker
    var $dpDiv = $.datepicker.dpDiv,
        $monthControls = $dpDiv.calendarNav().find(".ui-datepicker-header > a").attr("href", "#0"),
        bAlreadyAdded = $monthControls.eq(0).prevAll(".prev-year").exists(),
        oDynamicStrings = window.appScope && appScope.dynamicStrings || {},
        $prevYear, $nextYear;

    //setTimeout(function () { 
    if (!bAlreadyAdded) {
        //we clone the month controls to make the year controls
        //this enables us to tap into things like jqueryUI hover states for free
        //removing the ui-corner-all class will prevent our own logic from confusing the two in calendarNav method
        $prevYear = $monthControls.eq(0).clone(false, false).insertBefore($monthControls.eq(0)).addClass("prev-year").removeClass("ui-corner-all");
        $nextYear = $monthControls.eq(1).clone(false, false).insertAfter($monthControls.eq(1)).addClass("next-year").removeClass("ui-corner-all");

        $monthControls.eq(0).attr("title", oDynamicStrings.HoverText_PrevMonth);
        $monthControls.eq(1).attr("title", oDynamicStrings.HoverText_NextMonth);
        $prevYear.attr("title", oDynamicStrings.HoverText_PrevYear);
        $nextYear.eq(0).attr("title", oDynamicStrings.HoverText_NextYear);

        $prevYear.click(function () {
            var id = "#" + $.datepicker._curInst.id.replace(/\\\\/g, "\\");
            $.datepicker._adjustDate.apply($.datepicker, [id, -1, "Y"]);
        });

        $nextYear.click(function () {
            var id = "#" + $.datepicker._curInst.id.replace(/\\\\/g, "\\");
            $.datepicker._adjustDate.apply($.datepicker, [id, 1, "Y"]);
        });
    }
    //}, 0);
};

$.datepicker.dpDiv.on("afterShow", $.datepicker.addYearButtons);

$.datepicker._defaults.onChangeMonthYear = function () {
    setTimeout($.datepicker.addYearButtons, 0);
};

_.addCallBack($.datepicker, "_selectDate", function () {
    //after selection focus input and sync up scope
    var $input = $($.datepicker._curInst.input),
        scope = angular.element($input.closest("span")).scope(),
        bChanged = scope.oInput.text != $input.val();


    if (bChanged) {
        scope.oInput.text = $input.val();
        scope.$apply();
        $input.change();
    }
    $("#" + $.datepicker._curInst.id).focus();
});

_.addCallBack($.fn, "datepicker", function () {
    //start with null value if configured - not natively supported
    if (this.attr("start-empty"))
        this.val("");
    this.revalidateOnChange();
});

_.addCallBack($.datepicker, "_attachments", function (input, instance) {
    var dateFormatSetting = "1";
    if (typeof appScope != "undefined" && typeof appScope.tgSettings != "undefined" && typeof appScope.tgSettings.DateFormat != "undefined") {
        dateFormatSetting = appScope.tgSettings.DateFormat;
    }
    input.data("priorValue", input.val());

    input.on("change", correctDateFormat);

    //wait for aria-labelledby property to be set in angular
    //the nested timeouts of zero should be much more robust than a numerical one

    setTimeout(function () {

        setTimeout(function () {
            if (instance.trigger) {
                var sLabelledBy = input.attr("aria-labelledby"),
                    sLabelText = sLabelledBy ? _.map(sLabelledBy.split(" "), function (id) {
                        return $("#" + id).text();
                    }).join(" ") : $("[for=" + input.prop("id") + "]").text();

                //set hidden button text for screenreader announcements
                //this should be unique for optimal screenreader button list as well
                instance.trigger.text(instance.trigger.text().replace("[date]", sLabelText));

                instance.trigger.click(function () {
                    $.captureFocus(instance.trigger);
                });
            }

        }, 0);

    }, 0);

    //keep the launch button calendar icon after the clear button in DOM order
    if (instance.trigger && instance.trigger.next().is(".clearButton"))
        instance.trigger.insertAfter(instance.trigger.next());

    if (appScope.bPowerSearchVisible) {
        input.attr('name', input.attr('id'));
        $("#powerSearchForm").validate({
            errorClass: 'error',
            validClass: 'success',
            errorElement: 'span',
            //ignore: "div.hiddenQB input,div.hiddenQB select,div.hiddenQB textarea",
            onfocusout: false,
            highlight: function (element, errorClass, validClass) {
                if ($(element).parents('.dateLiner').parent().attr('daterangepicker') == 'dateRange') {
                    $(element).parents('.dateLiner').parent().addClass("invalid");
                }
                else {
                    $(element).closest(".dateWrapper").addClass("invalid");
                }
                $(element).attr("aria-invalid", "true");
            },
            unhighlight: function (element, errorClass, validClass) {
                var $parentElem;
                var isValid = true;
                if ($(element).parents('.dateLiner').parent().attr('daterangepicker') == 'dateRange') {
                    $parentElem = $(element).parents('.dateLiner').parent();
                    if ($(element).attr('id') != $parentElem.attr('previd')) {
                        isValid = false;
                    }
                }
                else {
                    $parentElem = $(element).removeAttr("aria-describedby").closest(".dateWrapper");
                }
                if (isValid) {
                    $parentElem.removeClass("invalid");
                    $(element).removeAttr("aria-invalid");
                }
            },
            errorPlacement: function (error, element) {
                if ($(element).parents('.dateLiner').parent().attr('daterangepicker') == 'dateRange') {
                    var $parentElem = $(element).parents('.dateLiner').parent();
                    $parentElem.find('.error').remove();
                    error.insertAfter($parentElem.children().last());
                    $parentElem.addClass("invalid").attr('previd', $(element).attr('id'));
                }
                else {
                    error.insertAfter(element.closest(".dateWrapper").children().last());
                }
            }
        });

        $.validator.addMethod("datestring", function (value, element, param) {
            if (!value)
                return true;

            var aDate = getDefaultDateFormat(value).split("/");
            var nMonth, dDate, dLast;

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
        }, appScope.dynamicStrings.ErrorMessage_InvalidDate);
        $.validator.addMethod("daterange", function (value, element, param) {
            if (value === "")
                return true;

            var $element = $(element),
                inst = $element.data().datepicker,
                minDate = $.datepicker._getMinMaxDate(inst, "min"),
                maxDate = $.datepicker._getMinMaxDate(inst, "max"),
                date = new Date(getDefaultDateFormat(value));

            return date < maxDate && date > minDate;

        }, function (params, element) {
            var $element = $(element);
            var str = appScope.dynamicStrings.ErrorMessage_InvalidDateRange;//msgs.msgdaterange;
            str = str.replace('[MINDATE]', $element.data().minDate);
            str = str.replace('[MAXDATE]', $element.data().maxDate);

            return str;
        });
        input.rules("add", { daterange: true, datestring: true });
    }
    else {
        if ($.validator.methods.daterange && $.validator.methods.datestring) {
            setTimeout(function () {
                input.rules("add", { daterange: true, datestring: true });
            }, 100);
        }
    }

    input.data({
        minDate: this._formatDate(instance, this._getMinMaxDate(instance, "min")),
        maxDate: this._formatDate(instance, this._getMinMaxDate(instance, "max"))
    })

    function getDefaultDateFormat(inputDate) {
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
    }


    function correctDateFormat(e) {
        //convert other numeric formats the user may input into m/y/dd
        var $this = $(this),
            oDatePicker = $this.data("datepicker"),
            fnOnSelectCallBack = $.datepicker._get(instance, "onSelect");
        if (this.value) {
            var aVal;
            var separatedBy = "/";
            if (dateFormatSetting == "1" || dateFormatSetting == "2" || dateFormatSetting == "3" || dateFormatSetting == "6" || dateFormatSetting == "9") {
                separatedBy = "/";
            }
            else if (dateFormatSetting == "4" || dateFormatSetting == "7" || dateFormatSetting == "10" || dateFormatSetting == "12") {
                separatedBy = "-";
            }
            else if (dateFormatSetting == "5" || dateFormatSetting == "8" || dateFormatSetting == "11") {
                separatedBy = ".";
            }
            aVal = this.value.split(separatedBy);
            var yearIndex = 2;//0 based index
            if (dateFormatSetting == "9" || dateFormatSetting == "10" || dateFormatSetting == "11" || dateFormatSetting == "12") {
                yearIndex = 0;
            }
            revertInvalid = false;

            _.each(aVal, function (val, i) {
                aVal[i] = Number(val);
                if (_.isNaN(aVal[i]))
                    revertInvalid = true;
            });

            if (aVal[yearIndex] != undefined && aVal[yearIndex] < 100)
                aVal[yearIndex] += 2000;

            if (revertInvalid) {
                this.value = $this.data("priorValue");
            }

            else
                this.value = aVal.join(separatedBy);
        }

        $this.data("priorValue", this.value);

        if (fnOnSelectCallBack) {
            fnOnSelectCallBack.apply(this, [this.value, instance]);
        }
    }
});


//NOTE WELL
//Any select or multiselect widget with autocomplete (more than 200 options) in the candidate experience
//is built from the jQueryUI autocomplete widget, not from the select widget
//Both widgets are modified fairly extensively to handle multple selections and to meet IBM accessibility standards

$.ui.selectmenu.prototype.options.icons.button = "ui-icon-triangle-1-s linkColor";

$.ui.selectmenu.prototype.options.position.collision = "fit flip";

$.ui.selectmenu.prototype.options.appendTo = "#menuContainer";

$.extend($.ui.selectmenu.prototype, {

    _getSelectedItem: function () {
        var i = this.element[0].selectedIndex;

        if (i == -1)
            i = 0;

        return this.menuItems.eq(i).parent("li");
    },

    _select: function (item, event) {

        if (this.element.prop("multiple")) {

            var B_SHOW_CURRENT_SELECTION = false,
                $li = this.menuInstance.active,
                aVal = [];

            if ((event.type == "menufocus") || !this.isOpen)//only single selects sift through options while menu is closed
                return;

            $li.add($li.children().children()).toggleClass("checked");

            item.element[0].selected = !item.element[0].selected;

            if (B_SHOW_CURRENT_SELECTION) {
                //alternate design - input shows last selection
                if (item.element[0].selected)
                    this._setText(this.buttonItem, item.label);
                else
                    this._setText(this.buttonItem, "");
            }

            this._trigger("select", event, { item: item });
            this._trigger("change", event, { item: item });
            if (this.menu.active)
                $.announceActive(this, this.menu.active);

        } else {

            if (event.target != null && event.target.id == "AttachementCatagory-menu" && !this.isOpen) {
                return;
            }

            if (event.target != null && event.target.id == "ApplicationDetailAction-menu" && !this.isOpen && event.keyCode == $.keyCodes.down) {
                this.open();
                this.val("");
                this.selectmenu("refresh");
                return;
            }

            if (event.keyCode == $.keyCodes.enter) {
                event.stopImmediatePropagation();
            }
            var oldIndex = this.element[0].selectedIndex;

            // Change native select element
            this.element[0].selectedIndex = item.index;
            this._setAria(item);
            this._trigger("select", event, { item: item });

            if (item.index !== oldIndex) {
                this._trigger("change", event, { item: item });
            }

            this._setText(this.buttonItem, item.label);

            this.close(event);
        }

        this.element.trigger("change").revalidate();

    },

    _renderItem: function (ul, item) {

        var li = $("<li>"),
            wrapper = $("<div>", {
                title: item.element.attr("title")
            });

        li.attr("role", "listitem");
        li.attr("aria-label", item.label)

        if (item.disabled) {
            li.addClass("ui-state-disabled");
        }

        this._setText(wrapper, item.label);

        if (this.element[0].multiple) {
            wrapper.prepend('<span class="pseudocheckbox"></span>')

            if (item.element[0].selected) {
                wrapper.add(wrapper.children()).addClass("checked");
            }
        }

        return li.append(wrapper).appendTo(ul);
    },

    // override the native _setAria to remove the setting of aria-labelledby.  It as setting aria-labelledby to just the selected list item and thereby losing the relationship to the question label
    _setAria: function (item) {
        var id = this.menuItems.eq(item.index).attr("id");

        this.button.attr({
            "aria-activedescendant": id
        });
        this.menu.attr("aria-activedescendant", id);
    }
});

_.addCallBack($.ui.selectmenu.prototype, "open", function () {
    var id = this.menuItems[0].id,
        oStrings = (appScope && appScope.dynamicStrings) || {},
        sResponseMessage = oStrings.AriaStatus_FullResults.replace("[count]", this.items.length),
        sMultiSelectInstructions = this.element.prop("multiple") ? ". " + oStrings.Message_SelectDeselect : "";

    if (this.$screenReaderInstructions) {
        this.$screenReaderInstructions.text(sResponseMessage + sMultiSelectInstructions);
    }

    this.menuItems.removeClass("ui-state-focus");
    $("#" + id).addClass("ui-state-focus");
    this.activeDescendant = null;
    this.menu.hide().slideToggle();

});

_.addCallBack($.ui.selectmenu.prototype, "close", function () {
    this.menu.removeAttr("aria-activedescendant");
    this.button.removeAttr("aria-activedescendant");
});

_.addCallBack($.ui.selectmenu.prototype, "_create", function () {
    var that = this,
        oStrings = (appScope && appScope.dynamicStrings) || {},
        $selectionList;

    $("[id=\'" + this.menu.prop("id") + "\']").not(this.menu).remove();
    if (this.element.attr("aria-label")) {
        //Accept aria-label if present
        this.button.attr("aria-label", this.element.attr("aria-label"));
    }
    else {
        //Label the single select with the question label and the current selection if present 
        this.button.addToAttr("aria-labelledby", this.element.attr("aria-labelledby"))
    }
    this.button.attr("aria-required", this.element.attr("aria-required"));
    this.button.uniqueId();
    if (this.element.prop("multiple")) {
        setTimeout(function () {
            var sLabel = that.element.attr("aria-label") || $("#" + that.element.attr("aria-labelledby")).text().trim();
            $selectionList = that.element.nextAll(".selectionList"),
            $selectionList.attr("aria-label", (oStrings.AriaLabel_SelectedOptions || "").replace("[question label]", sLabel));

            that.button.addToAttr("aria-describedby", that.button.prop("id") + "_selection-list").nextAll(".selectionList").attr("aria-live", "assertive").attr("id", that.button.prop("id") + "_selection-list");
            that.menuInstance.options.focus = function (e, ui) {

                //native jqueryui method

                var item = ui.item.data("ui-selectmenu-item");

                // Prevent inital focus from firing and check if its a newly focused item
                if (that.focusIndex != null && item.index !== that.focusIndex) {
                    that._trigger("focus", e, { item: item });
                    if (!that.isOpen) {
                        that._select(item, e);
                    }
                }
                that.focusIndex = item.index;

                //removed set aria-activedescendant

                //end native jqueryui method

                $.announceActive(that, ui.item);
            };
        });


        this.button.on("keydown", function (e) {
            switch (e.keyCode) {

                case $.keyCodes.down:
                    if (!that.isOpen)
                        that.open();
                    else
                        return true;
                    break;
            }
        });


        this.$screenReaderInstructions = $('<span class="screenReaderText"></span>').attr("id", this.element.prop("id") + "_instructions").insertAfter(this.button);

        this.button.addToAttr("aria-describedby", this.$screenReaderInstructions.prop("id"));
    } else {

        this.button.on("keydown", function (e) {
            var isAttachment = false;
            if (e.target != null && e.target.id == "AttachementCatagory-button") {
                isAttachment = true;
            }
            switch (e.keyCode) {
                case $.keyCodes.enter:
                    if (!that.isOpen)
                        that.open();
                    else
                        return true;
                    break;
                case $.keyCodes.up:
                case $.keyCodes.down:
                    if (isAttachment) {
                        if (!that.isOpen)
                            that.open();
                    }
                    break;
            }
        });


        this.button.addToAttr("aria-labelledby", this.button.prop("id") + "_text").children(".ui-selectmenu-text").attr("aria-live", "assertive").attr("id", this.button.prop("id") + "_text");
    }
    this.element.removeAttr("aria-label");
});

$.ui.autocomplete.prototype.options.position.collision = "fit flip";

$.ui.autocomplete.prototype.options.appendTo = "#menuContainer";

_.addCallBack($.ui.autocomplete.prototype, "_move", function () {
    if (this.menu.active)
        $.announceActive(this, this.menu.active);
});

_.addCallBack($.ui.autocomplete.prototype, "_create", function () {
    var self = this,
        name = self.element.attr("name"),
        ul = this.menu.element,
        oStrings = (appScope && appScope.dynamicStrings) || {},
        ariaLabel = this.element.closest("[input-label]").attr("input-label"),
        labelledBy = this.element.closest("[labelledby]").attr("labelledby") || this.element.closest("div").find("legend").prop("id"),
        $selectionList = this.element.parent().nextAll(".selectionList"),
        sSelectionListId, sLabel;
    self.freeFormSelect = typeof name == "undefined" ? false : name.indexOf("education") == 0 && (name.indexOf("_schoolname_") > 0 || name.indexOf("_degree") > 0) || name.indexOf("keyWordSearch") == 0 || name.indexOf("locationSearch") == 0 || name.indexOf('powerSearchKeyWordSearch') == 0 || name.indexOf('powerSearchLocationSearch') == 0;
    self.bIsMultiselect = self.element.attr("multiselect") != undefined;
    setTimeout(function () {
        self.element.attr({ autocomplete: "off" });//Prevent chrome autofill from interfering with our own autocomlete logic
    }, 0);
    if ($selectionList.exists()) {
        sSelectionListId = this.element.prop("id") + "_selection-list";
        $selectionList.attr("id", sSelectionListId);
        this.element.addToAttr("aria-describedby", sSelectionListId);
    }

    _.doBefore(this.menu, "select", function (e) {
        //do not select on tabbing off multiselect autocomplete
        if (e.keyCode == $.keyCodes.tab && self.bIsMultiselect)
            return false;
        else
            return true;
    });

    _.doBefore(this.menu, "blur", function () {
        //do not reset active item when selecting
        if (!(self.bIsMultiselect && self.selecting)) {
            return true;
        }
    });

    _.doBefore(this.menu.element, "hide", function () {
        //keep multiselect autocomplete open when selecting
        if (!(self.bIsMultiselect && self.selecting)) {
            return true;
        }
    });



    if (labelledBy)
        this.element.attr("aria-labelledby", labelledBy);
    else if (ariaLabel)
        this.element.attr("aria-label", ariaLabel);//this fallback generally comes from the placeholder text

    if ($selectionList.exists()) {
        sLabel = this.element.attr("aria-label") || $("#" + this.element.attr("aria-labelledby")).text().trim();
        $selectionList.attr("aria-label", (oStrings.AriaLabel_SelectedOptions || "").replace("[question label]", sLabel));
    }

    ul.attr("role", "listbox");
    ul.attr("aria-label", "Option List");
    ul.attr("aria-live", "assertive");
    ul.prop("id", (this.element.prop("id") || this.element.prop("name")) + "_listbox");

    if (this.element.attr("role").toLowerCase() == "combobox")
        this.element.attr("aria-expanded", "false");

    this.element.attr("aria-owns", ul.prop("id"))

    this.element.before(this.liveRegion);
    this.element.on("keyup", function (e) {
        if (!self.element.val())
            self.element.next(".ui-icon").removeClass("icon-remove");
    });

    this.menu.options.role = "list";//required to trigger active descendant changes in menu UL

    _.delay(function () {
        //wait for configured options to populate

        self.options.select = self.options.select || _.noop;

        _.doBefore(self.options, "select", function (e, ui) {
            //track when menu has just closed upon selection for logic in following keydown listeners
            //this is to prevent reopening if selection is made via ENTER key
            self.selecting = true;
            _.delay(function () {
                self.selecting = false;
            }, 350);
            return true;

        }, self.element[0]);//note that context must be correct for existing select handlers to function

        _.addCallBack(self.options, "select", function (e, ui) {
            if (self.menu.active) {
                self.menu.active.children(".ui-menu-item-wrapper").children(".pseudocheckbox").toggleClass("checked");
                $.announceActive(self, self.menu.active);
                setTimeout(function () {
                    //prevent inaccurate announcements in screenreaders that the dropdown has collapsed upon selection
                    if (self.bIsMultiselect && self.menu.element.is(":visible")) {
                        self.element.attr("aria-expanded", "true");
                    }
                }, 0);
            }
        });

    });

    this.element.on("keydown", function (e) {
        switch (e.keyCode) {

            case $.keyCodes.enter:
                if (self.options.freeFormSelect) {
                    if (self.element.attr("multiselect") == undefined)
                        self.menu.collapse();
                    self.options.select(e, { item: { value: self.term } });
                } else if (!(self.bIsMultiselect && self.menu.element.is(":visible"))) {
                    blanketSearch();
                }
                return false;

            case $.keyCodes.space:
                if (self.bIsMultiselect && self.menu.element.is(":visible")) {
                    self.menu.active.children(".ui-menu-item-wrapper").children(".pseudocheckbox").click();
                } else if (!self.term) {
                    blanketSearch();
                    e.preventDefault();
                }
                else if (self.term.trim() != "") {
                    return true;
                }

                return false;

            case $.keyCodes.down:
                if (self.selecting)
                    return;
                blanketSearch();
                return false;

            case $.keyCodes.tab:
                self.close();
                break;
            case $.keyCodes.up:
                break;
            default:
                self.pageIndex = 0;
                window.isBlanketSearch = 0;
                break;
        }

        return true;


        function blanketSearch() {

            if (self.selecting)
                return;
            //perform blanket search as if down arrow icon was clicked
            var newEvent;

            scope = angular.element(self.element).scope();
            newEvent = _.clone(e);
            newEvent.target = $(e.target).nextAll(".ui-icon")[0];

            if (!self.menu.element.is(":visible") && scope.blanketSearch && newEvent.target) {
                scope.blanketSearch(newEvent);
                e.preventDefault();
                return true;
            }
        }
    });


    this.element.blur(function (e) {
        if (!ul.is(':visible')) { //If Menu is Visible, Do not Close it(in ie, blur event gets fired even when scroll is made)
            if (self.bIsMultiselect && !self.freeFormSelect) {
                self.clearInput(e, self);
            } else if (self.freeFormSelect) // If freeFormSelect is true we can enter selecting the value that is not present in the autocomplete list. At that time we should not clear the input.
            {

            }
            else {
                //it's possible the user has tabbed out of a single select autocomplete
                //before an autocomplete search could initiate
                //run the search to determine if the input value is part of a valid result set
                //if not the input can be cleared
                self.search();
            }
        }
    });
    //In IE, When clicked on scroll bar of the menu, focus is getting shifted to menu, As the above blur doesnt fire in that case, ensuring same thing happens here.
    ul.on('focusout', function (e) {
        if (document.activeElement != self.element[0]) { //In case of multi select, the focus will manually be changed to input element, So skip in that case
            if (self.bIsMultiselect && !self.freeFormSelect) {
                self.clearInput(e, self);
            } else {
                //it's possible the user has tabbed out of a single select autocomplete
                //before an autocomplete search could initiate
                //run the search to determine if the input value is part of a valid result set
                //if not the input can be cleared
                self.search();
            }
        }
    });
});

$.ui.autocomplete.prototype.clearInput = function (e, oAuto) {
    var oStrings = (appScope && appScope.dynamicStrings) || {},
        sMessage, sLabel;

    if (oAuto.element.val()) {
        sLabel = oAuto.element.closest(".fieldcontain").find("label").text();
        sMessage = (oStrings.AriaAlert_Clearing || "").replace("[string]", oAuto.element.val()).replace("[question]", sLabel);
        oAuto.element.val("");
        oAuto.menu.element.removeClass("ui-state-disabled");
        $.announce(oAuto.element, sMessage);
    }

    oAuto.close();
}

$.ui.autocomplete.prototype.delayClearInput = function (e, oAuto) {
    //throttle a call to the clear input method in case the user is typing quickly
    setTimeout(function () {
        if (oAuto.invalidTerm && !oAuto.freeFormSelect) {
            oAuto.clearInput(e, oAuto);
            $("#" + oAuto.element[0].id.replace('-input', '')).find('option').remove().end();
            //$("#" + oAuto.element[0].id).attr("placeholder", appScope.dynamicStrings.PlaceHolder_AutoComplete);
            oAuto.invalidTerm = false;
        }
    }, 750);
}

$.ui.autocomplete.prototype.options.open = function () {
    var oAuto = $(this).data("ui-autocomplete");

    if (oAuto.element.is(":focus")) {
        //animate in the menu
        if (!oAuto.menu.element.is(":visible")) {
            oAuto.menu.element.hide().slideToggle();
        }
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            $('.ui-autocomplete').off('menufocus hover mouseover');
        }
        if (oAuto.element.attr("role") != "textbox")
            oAuto.element.attr("aria-expanded", true);
    } else {
        //do not show the menu if input has lost focus
        oAuto.menu.element.hide();
    }
};


_.addCallBack($.ui.autocomplete.prototype, "close", function () {
    if (this.element.attr("role") != "textbox")
        this.element.attr("aria-expanded", false);
    this.lastClosedTime = new Date();
    this.menu.element.removeAttr("aria-activedescendant");
});

_.addCallBack($.ui.autocomplete.prototype, "search", function () {
    this.pageIndex = 0;
});

_.doBefore($.ui.autocomplete.prototype, "_search", function () {
    if (this.element.is(":focus")) {
        this.liveRegion.children(".loadingText").remove();
        this.liveRegion.append($.loadingTextEl());
        return true;
    } else if (!this.bIsMultiselect || self.freeFormSelect) {
        //complete the search for single selects that have lost focus
        //so we can determine if the text typed in is part of the result set
        //and clear if it is not,
        //but don't show the loading state
        return true;
    } else {
        return false;
    }
});



_.doBefore($.ui.autocomplete.prototype, "_suggest", function (aResponse) {
    //flag single selects if the user has typed a search term not present in the response data
    //if the input has lost focus, make a throttled call to clear the input - allowing time for impending rapid keystrokes to be evaluated
    if (!this.bIsMultiselect) {
        this.invalidTerm = false;
        this.persistentSelectedItem = this.selectedItem || this.persistentSelectedItem;
        bSearchTextIsInResultSet = this.persistentSelectedItem != null ? this.term == this.persistentSelectedItem.label : (this.term == this.previous ? (this.term == "" ? false : true) : false);
        if (!bSearchTextIsInResultSet) {
            this.invalidTerm = true;
        }
        if (!this.element.is(":focus")) {
            this.delayClearInput({ type: "_suggest" }, this);
            return false;
        }
    }
    return true;
});



_.addCallBack($.ui.autocomplete.prototype, "_suggest", function (aResponse) {
    var nShown = aResponse.length,
        nTotal = this.fullCount || nShown,
        oStrings = (appScope && appScope.dynamicStrings) || {},
        sResponseMessage = nShown == nTotal ? oStrings.AriaStatus_FullResults : oStrings.AriaStatus_PartialResults,
        scope = angular.element(this.element).scope(),
        sHint = scope.typeAheadHint ? ". " + oStrings.AriaStatus_TypeAheadMessage.replace("[type ahead hint]", scope.typeAheadHint) : "",
        sMultiSelectInstructions = this.element.attr("multiselect") != undefined ? " " + oStrings.Message_SelectDeselect : "",
        bSearchTextIsInResultSet = false;

    sResponseMessage = sResponseMessage.replace("[count]", nTotal).replace("[full-count]", nTotal).replace("[shown-count]", nShown);

    this.liveRegion.children(".loadingText").remove();
    this.liveRegion.text(sResponseMessage + sHint + sMultiSelectInstructions);
});

_.doBefore($.ui.autocomplete.prototype, "open", function () {
    return this.element.is(":focus");
});

_.doBefore($.ui.autocomplete.prototype, "close", function () {
    this.liveRegion.text("");
    //avoid redundant close method calls
    if (this.widget().is(":visible")) {
        return true;
    }
});

$.extend($.ui.autocomplete.prototype, {
    _response: function () {
        var index = ++this.requestIndex;

        return $.proxy(function (content, fullCount) {
            if (index === this.requestIndex) {
                this.__response(content, fullCount);
            }

            this.pending--;
            if (!this.pending) {
                this.element.removeClass("ui-autocomplete-loading");
                this.liveRegion.children().remove();
            }
        }, this);
    },

    __response: function (content, fullCount) {
        var dynamicStrings = window.appScope && window.appScope.dynamicStrings,
            sNoData = dynamicStrings && dynamicStrings.Message_NoMatches || "No matches";
        if (this.options.emptyNoMatch)
            sNoData = "";

        this.fullCount = fullCount;

        if (content) {
            content = this._normalize(content);
        }
        if (content == null) {
            if (sNoData) {
                content = new Array();
                content.push({ label: sNoData, value: "no-data-message" })
                this.menu.element.addClass("ui-state-disabled");
            }
        }
        else if (this.element.val() && !content.length) {
            content.push({ label: sNoData, value: "no-data-message" })
            this.menu.element.addClass("ui-state-disabled");
        } else {
            this.menu.element.removeClass("ui-state-disabled");
        }
        this._trigger("response", null, { content: content });
        if (!this.options.disabled && content && content.length && !this.cancelSearch) {
            this._suggest(content);
            this._trigger("open");
        } else {
            // use ._close() instead of .close() so we don't cancel future searches
            this._close();
        }
    },
    _renderItem: function (ul, item) {
        var li = $("<li>"), wrapper = $("<div>").text(item.label);

        li.attr("role", "option");
        li.attr("aria-label", item.label)

        if (this.element.attr("multiselect") != undefined && item.value != "no-data-message") {
            wrapper.prepend('<span class="pseudocheckbox"></span>');
            if (angular.element(this.element).scope().isSelected(item))
                wrapper.add(wrapper.children()).addClass("checked");
        }
        return li.append(wrapper).appendTo(ul);
    },
    _renderMenu: function (ul, items) {
        var self = this;

        //remove scroll event to prevent attaching multiple scroll events to one container element
        ul.unbind("scroll");
        this._scrollMenu(ul, items);
        ul.attr("aria-live", "assertive");
        ul.attr("aria-relevant", "additions");
    },

    _scrollMenu: function (ul, items) {
        var self = this,
            optionsPerPage = self.options.resultsPerPage || window.pageSize || 15,
            results = items.slice(0, optionsPerPage),
            pages = self.fullCount ? self.fullCount / optionsPerPage : 1,
            $autoinput = self.element;
        if ($autoinput.prop('id').indexOf('Auto') > -1)
            var ss = $autoinput.prop('id').replace('Auto_', '').replace('_slt', '');
        else
            var ss = $autoinput.prop('id').replace('-input', '');

        this.pageIndex = 0;

        if (pages > 1) {
            ul.scroll(scrollItems).prop("scrollTop", 0);
        }

        $.each(results, function (index, item) {
            self._renderItemData(ul, item);
        });



        function scrollItems() {
            if (isScrollbarBottom(ul[0])) {
                self.pageIndex++;
                if (self.pageIndex >= pages) return;
                $("<li style='text-align:center;padding-top:5px;'></li>")
                    .data("item.autocomplete", items)
                    .append($.loadingGifEl())
                    .appendTo(ul);
                ul.unbind("scroll");


                //call into the configured source method

                self.source({ term: window.isBlanketSearch == 0 ? self.term : "", append: true }, function (results) {

                    //callback once items added

                    ul.find('li:last-child').remove();

                    $.each(results, function (index, item) {
                        self._renderItemData(ul, item);
                    });

                    self.menu.refresh();

                    // size and position menu
                    ul.show();
                    self._resizeMenu();
                    ul.position($.extend({
                        of: self.element
                    }, self.options.position));

                    if (self.options.autoFocus) {
                        self.menu.next(new $.Event("mouseover"));
                    }

                    ul.scroll(scrollItems);
                });
            }
        }


        function isScrollbarBottom(ul) {
            var y = ul.scrollHeight - ul.scrollTop - ul.offsetHeight;

            return y <= 2;
        }

    }
});

if ($.validator) {
    $.extend($.validator.prototype, {
        elements: function () {
            var validator = this,
                rulesCache = {};

            // select all valid inputs inside the form (no submit or reset buttons)
            return $(this.currentForm)
            .find("input, select, textarea, .validatable")
            .not(":submit, :reset, :image, [disabled]")
            .not(this.settings.ignore)
            .filter(function () {
                if (!this.name && validator.settings.debug && window.console) {
                    console.error("%o has no name assigned", this);
                }

                // select only the first element for each name, and only those with rules specified
                if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                    return false;
                }

                rulesCache[this.name] = true;
                return true;
            });
        },
        showLabel: function (element, message) {
            var place, group, errorID,
                error = this.errorsFor(element),
                elementID = this.idOrName(element),
                describedBy = $(element).attr("aria-describedby");
            if (error.length) {
                // refresh error/success class
                error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                // replace message on existing label
                error.html(message);
            } else {
                // create error element
                error = $("<" + this.settings.errorElement + ">")
                    .attr("id", elementID + "-error")
                    .addClass(this.settings.errorClass)
                    .html(message || "");

                // Maintain reference to the element to be placed into the DOM
                place = error;
                if (this.settings.wrapper) {
                    // make sure the element is visible, even in IE
                    // actually showing the wrapped element is handled elsewhere
                    place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                }
                if (this.labelContainer.length) {
                    this.labelContainer.append(place);
                } else if (this.settings.errorPlacement) {
                    this.settings.errorPlacement(place, $(element));
                } else {
                    place.insertAfter(element);
                }

                // Link error back to the element
                if (error.is("label")) {
                    // If the error is a label, then associate using 'for'
                    error.attr("for", elementID);
                } else if (error.parents("label[for='" + elementID + "']").length === 0) {
                    // If the element is not a child of an associated label, then it's necessary
                    // to explicitly apply aria-describedby

                    errorID = error.attr("id").replace(/(:|\.|\[|\])/g, "\\$1");
                    // Respect existing non-error aria-describedby
                    if (!describedBy) {
                        describedBy = errorID;
                    } else if (!describedBy.match(new RegExp("\\b" + errorID + "\\b"))) {
                        // Add to end of list if not already present
                        describedBy += " " + errorID;
                    }
                    $(element).addToAttr("aria-describedby", describedBy);

                    // If this element is grouped, then assign to all elements in the same group
                    group = this.groups[element.name];
                    if (group) {
                        $.each(this.groups, function (name, testgroup) {
                            if (testgroup === group) {
                                $("[name='" + name + "']", this.currentForm)
                                    .addToAttr("aria-describedby", error.attr("id"));
                            }
                        });
                    }
                }
                if (!message && this.settings.success) {
                    error.text("");
                    if (typeof this.settings.success === "string") {
                        error.addClass(this.settings.success);
                    } else {
                        this.settings.success(error, element);
                    }
                }
            }
            this.toShow = this.toShow.add(error);
        }
    });
}


//<<<<<<<<<<<<<<<<<<<<<<<<<<< LADDA EXTENSIONS >>>>>>>>>>>>>>>>>>>>


function extendLadda() {

    if (angular.laddaExtended || !window.Ladda)
        return;

    _.addCallBack(Ladda, "create", function ($el, oInstance) {
        //Add screenreader announcement to Ladda spinner buttons and links

        if ($el && oInstance) {

            _.addCallBack(oInstance, "start", function () {
                $.loadingTextEl().appendTo($el);
            });

            _.addCallBack(oInstance, "stop", function () {
                try {
                    $($el).children(".loadingText").remove();
                } catch (Error) {

                }
            })
        }

    }, null, null, true);//last argument gives access to result of function we are adding to

    angular.laddaExtended = true;
}




function setReadyForSocialReferral(ready, clid, stid, pride, localeid, button, fn, ln) {
    var scope = appScope;
    scope.SocialReferral_READY = ready;
    scope.SocialReferral_ProfileId = pride;
    scope.SocialReferral_SiteId = stid;
    scope.SocialReferral_LocaleId = localeid;
    scope.SocialReferral_FirstName = fn;
    scope.SocialReferral_LastName = ln;
    if (ready == "yes") {
        scope.LaunchSocialReferralMenu(scope, document.getElementById(button));
    }
}


window.onerror = function (msg, url, lineNo, columnNo, error) {

    LogJSErrors(msg, url, lineNo, columnNo, error);
}

//$(document).ajaxError(function (event, jqxhr, settings, exception) {
//    var jsError = {
//        PartnerId: $.queryParams().partnerid,
//        SiteId: $.queryParams().siteid,
//        EncryptedSessionId: "",
//        LineNumber: lineNo,
//        ColNumber: columnNo,
//        Message: exception,
//        Url: url,
//        AdditionalInfo: (error != undefined) ? error.toString() : "",
//        BrowserInfo: "Platform :::" + navigator.platform + " Agent :::" + navigator.userAgent + " Language :::" + navigator.language,

//    };
//    $.ajax({
//        type: "POST",
//        url: "/TgNewUI/Search/Ajax/LogJSError",
//        data: jsError,
//        success: function (data) {
//            //do nothing 
//        }

//    });
//    return false;
//});

function LogJSErrors(msg, url, lineNo, columnNo, error) {

    var jsError = {
        PartnerId: $.queryParams().partnerid,
        SiteId: $.queryParams().siteid,
        EncryptedSessionId: "",
        LineNumber: lineNo,
        ColNumber: columnNo,
        Message: msg,
        Url: url,
        AdditionalInfo: (error != undefined) ? error.toString() : "",
        BrowserInfo: "Platform :::" + navigator.platform + " Agent :::" + navigator.userAgent + " Language :::" + navigator.language,

    };
    $.ajax({
        type: "POST",
        url: "/TgNewUI/Search/Ajax/LogJSError",
        data: jsError,
        success: function (data) {
            //do nothing 
        }

    });
    return false;
}


function onSignIn(googleUser) {

    if (appScope.tgSettings.SocialMedia.split(",").indexOf(appScope.smType.Google.toString()) > -1) {
        var profile = googleUser.getBasicProfile();
        appScope.SM_ProfileID = profile.getId();
        appScope.SM_AccessToken = googleUser.Zi.access_token;
        appScope.SM_FullName = profile.getName();
        appScope.SM_FirstName = profile.getGivenName();
        appScope.SM_LastName = profile.getFamilyName();
        appScope.SM_EmailID = profile.getEmail();
        appScope.SM_ProfilePicture = profile.getImageUrl();
        appScope.SM_SiteID = appScope.smType.Google;
        if (appScope.bLoggedIn && appScope.candidatezoneSubView == "accountSettings") {
            appScope.createConnection(appScope.smType.Google);
        }
        else if (!appScope.bLoggedIn) {
            appScope.googleSignedIn = true;
            // Useful data for your client-side scripts:
            console.log("ID: " + profile.getId()); // Don't send this directly to your server!
            console.log('Full Name: ' + profile.getName());
            console.log('First Name: ' + profile.getGivenName());
            console.log('Last Name: ' + profile.getFamilyName());
            console.log("Image URL: " + profile.getImageUrl());
            console.log("Email: " + profile.getEmail());
            console.log("Access_Token: " + googleUser.Zi.access_token)
            // The ID token you need to pass to your backend:
            //818668905647-rc99ph2e8hj97i12gulpnkjdruqvkoau.apps.googleusercontent.com

            var id_token = googleUser.getAuthResponse().id_token;
            console.log("ID Token: " + id_token);
            $(".smSubmit").trigger("click");
        }
    }
}

function googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        appScope.SM_ProfileID = "";
        appScope.SM_AccessToken = "";
        appScope.SM_FullName = "";
        appScope.SM_FirstName = "";
        appScope.SM_LastName = "";
        appScope.SM_EmailID = "";
        appScope.SM_ProfilePicture = "";
        appScope.SM_SiteID = "";
        console.log('User signed out.');
    });
}
