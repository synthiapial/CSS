/*°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸


  Licensed Materials - Property of IBM5725-N92© Copyright IBM Corp.
  2014, 2017.US Government Users Restricted Rights- Use,
  duplication or disclosure restricted by GSA ADP Schedule Contract  with IBM Corp.
  

°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸*/

//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR APP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var searchApp = angular.module('searchApp', ['tgCommon', 'ngDialog', 'ngIdle', 'ngImgCrop']);



//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR DIRECTIVES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR CONTROLLER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


searchApp.controller('searchResults', function ($scope, $http, $timeout, $location, $log, $window, $sce, ngDialog, $compile, $interpolate, Idle) {

    dynamicResizeIframe = function () {
        setTimeout(function () {
            $("#profileBuilder").height($("#profileBuilder").contents().find(".ImportProfile").height() + (-10) + "px");
        }, 10);
    };
    $.dynamicStrings = $scope.dynamicStrings;

    $scope.enumForDashBoardActiveSection = {
        UnfinishedApplications: 1,
        FinishedApplications: 2
    };
    $scope.smType = {
        None: 0,
        LinkedIn: 1,
        Facebook: 2,
        Twitter: 3,
        Google: 12
    };
    $scope.customScriptRendering = {
        All: 1,
        Search: 2,
        CandidateZone: 3
    };
    $scope.SM_SiteID = $scope.smType.None;
    $scope.enumForSavedSearchActions = {
        Configure: 1,
        Renew: 2,
        Delete: 3
    };
    $scope.showVBTWarningAlert = function (flag) {
        if (typeof appScope.bConfigMode != 'undefined' && appScope.bConfigMode && flag) {
            window.alert(appScope.dynamicStrings.VBT_WarningMessage);
            return true;
        }
        return false;
    };

    $scope.prevalidate = function (scope, fn, formID) {
        $('#' + formID).find('input').each(function () {
            if ($(this).id == 'loginField' || $(this).id == 'password')
                $(this).$setValidity("required", true);
        });
        $('#' + formID).find('select').each(function () {
            if ($(this).name == 'selectSecurityQuestion1' || $(this).name == 'selectSecurityQuestion2' || $(this).name == 'selectSecurityQuestion3')
                $(this).$setValidity("required", true);
        });
        fn(scope);

    };


    $scope.setTitle = function (newValue, oldValue) {
        var title;

        switch (newValue) {
            case "welcome":
                title = $scope.dynamicStrings.Title_SearchWelcome;
                break;
            case "searchResults":
                title = [$scope.keyWordSearch.text, $scope.locationSearch.text].join(" ");
                if (title.trim())
                    title += " - ";
                title += $scope.dynamicStrings.Title_SearchResults;
                break;
            case "jobDetails":
                title = $("h1.jobtitleInJobDetails:visible").text() + " - " + $scope.dynamicStrings.AriaLabel_JobDetails;
                break;
            case "powerSearch":
                title = $scope.dynamicStrings.Title_PowerSearch;
                break;
            case "logIn":
                title = $scope.dynamicStrings.Button_LogIn;
                break;
            case "apply":
                if ($("#ApplyPageHead").is(":visible") && $scope.standAloneGQ > 0) {
                    title = $("#ApplyPageHead:visible").text();
                }
                else if ($("#ApplyPageHead").is(":visible") && $("h2.jobTitle").is(":visible"))
                    title = $("#ApplyPageHead:visible").text() + "(" + $("h2.jobTitle:visible").text() + ") - " + $scope.dynamicStrings.AriaLabel_Apply;
                break;
            case "JobCart":
                title = $scope.dynamicStrings.SavedJobs;
                break;
            case "Profile":
                title = $scope.dynamicStrings.Profile;
                break;
            case "MyFile":
                title = $scope.dynamicStrings.My_Files;
                break;
            case "AccountSettings":
                title = $scope.dynamicStrings.Lbl_AccountSettings;
                break;
            case "Applications":
                title = $scope.dynamicStrings.MyApplications;
                break;
            case "SavedSearches":
                title = $scope.dynamicStrings.Lbl_SavedSearches;
                break;
            case "ApplicationDetail":
                title = $("h1.Applicationjobtitle:visible").text() + "-" + $scope.dynamicStrings.Label_Application.charAt(0).toUpperCase() + $scope.dynamicStrings.Label_Application.substr(1).toLowerCase();
                break;
            case "Assessments":
                title = $scope.dynamicStrings.Link_Assessments;
                break;
            case "createNewAccount":
                title = $scope.dynamicStrings.Lbl_createNewAccount;
                break;
            case "forgotPassword":
                title = $scope.dynamicStrings.Lbl_forgotPassword;
                break;
            case "SelectedGroup":
                title = $scope.dynamicStrings.Lbl_SelectedGroup;
                break;
            case "Communication":
                title = $scope.dynamicStrings.Heading_Message_Archives;
                break;
            case "Referrals":
                title = $scope.dynamicStrings.Link_ResponsiveReferrals;
                break;
            case "AddFiles":
                title = $scope.dynamicStrings.Lbl_AddFiles;
                break;
        }

        if ($scope.bLoggedIn) {
            $scope.getNotificationMsgCount();
        }

        if (title) {
            document.title = title;
        }
        if ($scope.updateAccount && $scope.updateAccount.updated && ((newValue.toLowerCase() != 'welcome' && $scope.updateAccount.updated == 'delete') || (newValue != 'AccountSettings' && $scope.updateAccount.updated.toLowerCase() != 'delete')))
            $scope.updateAccount.updated = '';
        if ($scope.profileImportStatus == 1 && !(newValue.toLowerCase() == 'profile' || newValue.toLowerCase() == 'apply'))
            $scope.profileImportStatus = 0;
        if ($scope.sendToFriendInfo && $scope.sendToFriendInfo.emailSent)
            $scope.sendToFriendInfo.emailSent = false;
        if ($scope.communicationDeleted && newValue != 'Communication')
            $scope.communicationDeleted = false;
    }

    $scope.$watch("workFlow", $scope.setTitle);



    /////Reset UserName Password Starts here
    $scope.focusAt = function (ID, Submit) {
        setTimeout(function () { $scope.$apply(); }, 0);
        $("#" + ID).focus();
        if (["loginfield", "password"].indexOf(ID.toLowerCase()) !== -1) {
            $("#" + ID + "Mobile").focus();
        }
    };
    $scope.LoginChangePassword = false;
    $scope.LoginChangeSecQuestion = false;
    $scope.ResetNamePass = function ($scope) {
        $scope.timer = null;
        $scope.LoginChangePassword = false;
        $scope.login = {
            NameOrPass: 'password',
            UserEmail: '',
            FirstName: '',
            LastName: '',
            HomePhone: '',
            Username: '',
            SecurityQuestion1: '',
            SecurityAnswer1: '',
            SecurityQuestion2: '',
            SecurityAnswer2: '',
            SecurityQuestion3: '',
            SecurityAnswer3: '',
            pwd: '',
            pwdConfirm: '',
            ResetUser: false,
            SecQuestions: true,

            ValidEmailPhone: false,
            submit11: false,
            submit12: false,
            submit13: false,
            submit14: false,
            submit15: false,
            submit16: false,

            submit21: false,
            submit22: false,
            submit23: false,
            ResetUser: false,
            submit3: false,

            blurred3: false,
            blurred4: false,
            ForgotPass: false,
            EmailPageError: '',
            EmailErrorID: '',
            EmailPageSuccess1: '',
            EmailPageSuccess2: '',
            SecurityQuestionsPageError: '',
            SecurityQuestionsErrorID: '',
            SecurityQuestionsPageSuccess: '',
            ResetPasswordPageError: '',
            ResetPasswordErrorID: '',
            ResetPasswordID: '',
            ResetPasswordPageSuccess: ''
        };
        $("#ForgotUsrPassContainer").setFocus();

    }
    $scope.ResetNamePass($scope);
    $scope.focusEmailpage = function (str) {
        $scope.login.focusThis = "true";
    }
    $scope.rbtNameorPass = function () {
        $scope.login.submit11 = false;
        $scope.login.submit12 = false;
        $scope.login.submit13 = false;
        $scope.login.submit14 = false;
        $scope.login.submit15 = false;
        $scope.login.submit16 = false;
        $scope.login.UserEmail = '';
        $scope.login.FirstName = '';
        $scope.login.LastName = '';
        $scope.login.HomePhone = '';
        $scope.login.Username = '';
        $scope.login.EmailPageSuccess1 = '';
        $scope.login.EmailPageSuccess2 = '';
        $scope.login.EmailPageError = '';
        return $scope.login;
    };
    $scope.ForgotPassword = function () {
        ngDialog.closeAll();
        $scope.ResetNamePass($scope);
        $scope.bSignInView = false;
        $scope.showInFullView = false;
        $scope.login.ForgotPass = true;
        $scope.bCreateAccount = false;
        $scope.bPrivacyPages = false;
        $scope.bPrivacyOptOut = false;
        $scope.bPrivacyPolicyStatement = false;
        $scope.bPrivacyPolicyQuestion = false;
        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "forgotPassword";
        $scope.setTitle("forgotPassword");
        $scope.setHash();
        $scope.loadwebtrackerscript("/TGNewUI/ResetUsernamePassword", $scope.customScriptRendering.Search);
        //        $("#homeContainer ul:empty").each(
        //        function () {
        //            var LItems = $(this);
        //            if (LItems.children().length == 0) {
        //                $(this).append($("<li>"));
        //            }
        //        });
    };
    $scope.ResetSecurityQuestionsPageFunc = function () {
        $scope.login.OldEmail = $scope.login.UserEmail;
        $scope.login.submit21 = false;
        $scope.login.submit22 = false;
        $scope.login.submit23 = false;
        return $scope.login;
    };

    $scope.loadwebtrackerscript = function (pageid, categoryid) {
        var webtrackerRequest = {
            PartnerId: $("#partnerId").val(),
            SiteId: $("#siteId").val(),
            PageId: pageid,
            GetBodyTag: true
        };
        var rft = $("[name='__RequestVerificationToken']").val();
        $.ajax({
            type: "POST",
            url: "/TgNewUI/WebTracker/WebTracker/GetScript",
            headers: { 'Content-Type': 'application/json', 'RFT': rft },
            data: JSON.stringify(webtrackerRequest),
            success: function (response) {
                eval(response.Script);
            }
        });

        try {

            if ($scope.response.CustomWebTrackerResponse != null && $scope.response.CustomWebTrackerResponse.length > 0) {
                _.each($scope.response.CustomWebTrackerResponse, function (customWebTrackerResponse) {
                    var executeScript = false;
                    if (customWebTrackerResponse.CategoryIds.toLowerCase().trim() == 'all' || (typeof categoryid != "undefined" && Object.getOwnPropertyNames(appScope.customScriptRendering)[categoryid - 1].toLowerCase().trim().indexOf(customWebTrackerResponse.CategoryIds.toLowerCase()) > -1)) {
                        executeScript = true;
                    }
                    if (executeScript) {
                        eval(customWebTrackerResponse.Body);
                    }
                });
            }
        }
        catch (error) {
        }
    };

    $scope.focusFirstJob = function () {
        $("#mainJobListContainer").setFocus();
        $.pinToFold();
    };
    $scope.EmailPageAjax = function ($scope) {
        $scope.oActiveLaddaButton.start();
        var ForgotPasswordRequest = {
            partnerId: $("#partnerId").val(),
            siteId: $("#siteId").val(),
            username: $scope.tgSettings.LoginType == 1 ? $scope.login.Username : $scope.login.UserEmail,
            cookievalue: $("#CookieValue").val(),
            subjectName: $scope.dynamicStrings.PasswordRecoverySubject
        };
        // Ladda.create("EmailSubmit").start();
        $.ajax({
            type: "POST",
            url: "/TgNewUI/Search/Ajax/ForgotPassword",
            data: ForgotPasswordRequest,
            success: function (data) {
                $scope.oActiveLaddaButton.stop();
                if (data.ForgotPasswordResult == 0) {
                    $scope.login.EmailPageSuccess1 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailSent1;
                    $scope.login.EmailPageSuccess2 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailSent2;
                }
                else if (data.ForgotPasswordResult == 1 || data.ForgotPasswordResult == 2) {

                    if ($scope.tgSettings.LoginType == 1) {
                        $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_UserDoesntExist;
                        $scope.login.InvalidFields.push({
                            "ErrorField": $scope.dynamicStrings.Label_Username,
                            "ErrorID": 'Username',
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_UserDoesntExist
                        });
                    } else if ($scope.tgSettings.LoginType == 0) {
                        $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_UserDoesntExist;
                        $scope.login.InvalidFields.push({
                            "ErrorField": $scope.dynamicStrings.Label_Email,
                            "ErrorID": 'Email',
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_UserDoesntExist
                        });
                    }
                }
                else if (data.ForgotPasswordResult == 3) {

                    $scope.login.EmailPageSuccess1 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailAlreadySent1;
                    $scope.login.EmailPageSuccess2 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailAlreadySent2;
                }
                else if (data.ForgotPasswordResult == 4) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_EmailDoesntExist;
                    if ($scope.tgSettings.LoginType == 1) {
                        $scope.login.InvalidFields.push({
                            "ErrorField": $scope.dynamicStrings.Label_Username,
                            "ErrorID": 'Username',
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_EmailDoesntExist
                        });
                    } else if ($scope.tgSettings.LoginType == 0) {
                        $scope.login.InvalidFields.push({
                            "ErrorField": $scope.dynamicStrings.Label_Email,
                            "ErrorID": 'Email',
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_EmailDoesntExist
                        });
                    }
                }
                else if (data.ForgotPasswordResult == 6) { //account locked out while loggin
                    $scope.login.EmailPageSuccess1 = $scope.dynamicStrings.ErrorMessage_PasswordLockedOut;
                    $scope.login.EmailPageSuccess2 = $scope.dynamicStrings.ErrorMessage_TryAgainlater;
                }
                else if (data.ForgotPasswordResult == 5) {
                    if (data.SecurityQuestions != null) {
                        if (data.SecurityQuestions.SecurityQuestion1 != null && data.SecurityQuestions.SecurityQuestion1 != '') {
                            $scope.login.SecurityQuestion1 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion1);
                        }
                        else {
                            $scope.login.SecurityQuestion1 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion2 != null && data.SecurityQuestions.SecurityQuestion2 != '') {
                            $scope.login.SecurityQuestion2 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion2);
                        }
                        else {
                            $scope.login.SecurityQuestion2 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion3 != null && data.SecurityQuestions.SecurityQuestion3 != '') {
                            $scope.login.SecurityQuestion3 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion3);
                        }
                        else {
                            $scope.login.SecurityQuestion3 = '';
                        }
                    }
                    if ($scope.login.SecurityQuestion1 == '' && $scope.login.SecurityQuestion2 == '' && $scope.login.SecurityQuestion3 == '') {
                        $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_ContactHelpDesk
                    }
                    $scope.login.SecurityQuestionsPageError = '';
                    $scope.login.SecurityQuestionsPageSucces = '';
                    $scope.ActivePage('SecurityQuestions');
                }
                setTimeout(function () { $scope.$apply(); }, 0);
            }
        });
    };
    $scope.UserNamePageAjax = function ($scope) {
        $scope.oActiveLaddaButton.start();
        var ForgotUsernameRequest = {
            partnerId: $("#partnerId").val(),
            siteId: $("#siteId").val(),
            firstname: $scope.login.FirstName,
            lastname: $scope.login.LastName,
            homephone: ($scope.login.HomePhone == '') ? '' : $scope.login.HomePhone,
            username: ($scope.login.UserEmail == '') ? '' : $scope.login.UserEmail,
            cookievalue: $("#CookieValue").val(),
            deflanguageId: $scope.tgSettings.DefLanguageId
        };
        $.ajax({
            type: "POST",
            url: "/TgNewUI/Search/Ajax/ForgotUsername",
            data: ForgotUsernameRequest,
            success: function (data) {
                $scope.oActiveLaddaButton.stop();
                if (data.Result == 'ProfileFound') {
                    if (data.SecurityQuestions != null) {
                        if (data.SecurityQuestions.SecurityQuestion1 != null && data.SecurityQuestions.SecurityQuestion1 != '') {
                            $scope.login.SecurityQuestion1 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion1);
                        }
                        else {
                            $scope.login.SecurityQuestion1 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion2 != null && data.SecurityQuestions.SecurityQuestion2 != '') {
                            $scope.login.SecurityQuestion2 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion2);
                        }
                        else {
                            $scope.login.SecurityQuestion2 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion3 != null && data.SecurityQuestions.SecurityQuestion3 != '') {
                            $scope.login.SecurityQuestion3 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion3);
                        }
                        else {
                            $scope.login.SecurityQuestion3 = '';
                        }
                    }
                    if ($scope.login.SecurityQuestion1 == '' && $scope.login.SecurityQuestion2 == '' && $scope.login.SecurityQuestion3 == '') {
                        $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_ContactHelpDesk
                    }
                    $scope.login.SecurityQuestionsPageError = '';
                    $scope.login.SecurityQuestionsPageSucces = '';
                    $scope.ActivePage('SecurityQuestions');
                    //Forgot password email successfully sent
                    //You have asked to recover your password. For your protection, this operation is carried out through a secured e-mail, which has been sent to the address associated with your user profile. Please click on the link in the e-mail to reset your password. Check your e-mail for a message called 'Password recovery.'
                }
                else if (data.Result == 'UserNotFound') {
                    //User does not exist
                    //The information you entered does not match our records. Please try again.

                    //$scope.login.EmailErrorID = $scope.dynamicStrings.Label_Email;
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_InfoDoesntExist;
                }
                else if (data.Result == 'ExceededAllowedAttempts') {
                    //User does not exist

                    //$scope.login.EmailErrorID = $scope.dynamicStrings.Label_Email;
                    $scope.login.EmailPageError = data.UNameRetrievalUnsuccessfulCustomText;
                }
                else if (data.Result == 'InCorrectResponse') {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Email,
                        "ErrorID": 'Email',
                        "ErrorField2": $scope.dynamicStrings.Label_homePhone,
                        "ErrorID2": 'HomePhone',
                        "ErrorEmailPhn": true,
                        "ErrorType": $scope.dynamicStrings.ErrorMessage_IsRequired
                    });
                    $scope.login.ValidEmailPhone = true;
                }

                setTimeout(function () { $scope.$apply(); }, 0);
            }

        });
    };
    $scope.SecurityAnswersAjax = function ($scope) {
        $scope.oActiveLaddaButton.start();
        $scope.login.SecurityQuestionsPageError = '';
        var ConfirmSecurityAnswersRequest = {
            partnerId: $("#partnerId").val(),
            siteId: $("#siteId").val(),
            username: $scope.login.UserEmail,
            LoginMgmtType: angular.uppercase($scope.tgSettings.LoginDetailsManagement),
            Token: $("#Token").val(),
            CalledFrom: $scope.login.CalledFrom,
            SecurityQuestions: 'YES',
            SAnswerOne: ($scope.login.SecurityAnswer1 == '') ? '' : $scope.login.SecurityAnswer1,
            SAnswerTwo: ($scope.login.SecurityAnswer2 == '') ? '' : $scope.login.SecurityAnswer2,
            SAnswerThree: ($scope.login.SecurityAnswer3 == '') ? '' : $scope.login.SecurityAnswer3,
            cookievalue: $("#CookieValue").val(),
            DefLanguageId: $scope.tgSettings.DefLanguageId
        };
        $.ajax({
            type: "POST",
            url: "/TgNewUI/Search/Ajax/SecurityAnswers",
            data: ConfirmSecurityAnswersRequest,
            success: function (data) {
                $scope.oActiveLaddaButton.stop();
                if (data.Result == 'CorrectAnswers') {
                    if ($scope.login.NameOrPass == 'username') {
                        $scope.login.Username = data.Username;
                    }
                    $scope.login.EmailPageError = '';
                    $scope.login.EmailPageError = '';
                    $scope.login.EmailPageSuccess1 = '';
                    $scope.login.EmailPageSuccess2 = '';
                    $scope.ActivePage('ResetUserNamePassword');
                }
                if (data.Result == 'LockedOut') {
                    if ($scope.login.NameOrPass == 'password') {
                        $scope.login.SecurityQuestionsPageError = $scope.dynamicStrings.ErrorMessage_PasswordLockedOut + $scope.dynamicStrings.ErrorMessage_TryAgainlater;
                    } else {
                        $scope.login.SecurityQuestionsPageError = data.UNameRetrievalUnsuccessfulCustomText;
                    }
                }
                if (data.Result == 'TryAgain') {
                    $scope.login.SecurityQuestionsPageError = $scope.dynamicStrings.ErrorMessage_TryAgain;
                    //The answer you provided does not match the answer to your security question.  Please try again.
                }
                setTimeout(function () { $scope.$apply(); }, 0);
            }

        });
    };
    $scope.ResetPasswordAjax = function (scope) {
        scope.oActiveLaddaButton.start();
        $scope.login.ResetPasswordPageSuccess = '';
        $scope.login.ResetPasswordPageError = '';
        $scope.login.ResetPasswordErrorID = '';
        $scope.login.ResetPasswordID = '';
        var ChangePasswordRequest = {};
        ChangePasswordRequest.ClientId = $("#partnerId").val();
        ChangePasswordRequest.SiteId = $("#siteId").val();
        ChangePasswordRequest.username = $scope.login.UserEmail;
        ChangePasswordRequest.EncryptedSessionId = $("#CookieValue").val();
        ChangePasswordRequest.LanguageId = $scope.tgSettings.DefLanguageId;
        ChangePasswordRequest.LocaleId = $scope.tgSettings.DefLocaleId;
        ChangePasswordRequest.NewPassword = $scope.login.pwd;
        ChangePasswordRequest.ChangePasswordEmailSubject = $scope.dynamicStrings.ChangePasswordEmailSubject;
        //searchFields: that.keywordFields
        var url = "/TgNewUI/Search/Ajax/ChangePassword"
        $http.post(url, ChangePasswordRequest).success(function (data, status, headers, config) {
            scope.oActiveLaddaButton.stop();
            // data.Result = 0;
            //2 'Old password was incorrect
            if (data.Result == 0) {
                $scope.encryptedBruid = data.EncryptedBruId;
                $scope.hashCode = data.HashCode;
                $scope.loadwebtrackerscript("/TGNewUI/Login", $scope.customScriptRendering.Search);
                $timeout(function () { $scope.$apply(); }, 0);
                if (data.NewSessionId != null || data.NewSessionId != "") {
                    $("#CookieValue").val(data.NewSessionId);
                }

                //alert("Password Change Succesfull");
                if ($scope.LoginChangePassword == true) {
                    var rft = $("[name='__RequestVerificationToken']").val();
                    if ($scope.standAloneGQ > 0) {
                        $scope.bLoggedIn = true;
                        $scope.standAloneGQApply();
                    }
                    else if ($scope.jobApplyUrl != "") {
                        $http.get("/gqweb/apply?bruid=" + encodeURIComponent(data.EncryptedBruId) + $scope.jobApplyUrl + "&RFT=" + rft)
                            .success(function (result) {
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                $scope.$root.applyResponse = result;
                                $scope.bLoggedIn = true;
                                $scope.bSignInView = false;
                                $scope.showInFullView = false;
                                $scope.login.ForgotPass = false;
                                scope.loginField = "";
                                scope.password = "";
                            });
                    } else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                        $scope.bLoggedIn = true;
                        $scope.bSignInView = false;
                        $scope.bCreateAccount = false;
                        $scope.login.ForgotPass = false;
                        if (appScope.bJobDetailsShown) {
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                            $scope.login.ForgotPass = false;
                            $scope.SingleJobApplyDupCheckAjax();
                            //if ($scope.calledFrom == "save")
                            //    $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                        } else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                            ngDialog.closeAll();
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                            var SMLoginjobids = $scope.SearchResultsJobsSelectedScope.jobIds.split(",").length > 0 ? $scope.SearchResultsJobsSelectedScope.jobIds : "";
                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                            _.each(appScope.jobs, function (job) {
                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                    job.Selected = true;
                                }
                            });

                            if ($scope.calledFrom == "save") {
                                $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                            }
                            else {
                                $scope.postToNextPage('', appScope, 'mulapplyvald');
                            }
                            $scope.login.ForgotPass = false;
                        }
                    } else if (appScope.PortalPwdReset) {
                        $scope.LoginChangeSecQuestion = true;
                        $scope.LoginChangePassword = false;
                        $scope.login.ForgotPass = false;
                        $scope.ResetChangeSecQuestfunction($scope);
                    } else if ($scope.bresponsiveCandidateZone) {
                        $scope.login.ForgotPass = false;
                        $scope.bCandidateZone = true;
                        $scope.ViewDashBoardData("SavedJobs");
                    }
                    else {
                        var candidateZoneRequest = {};
                        candidateZoneRequest.PartnerId = $("#partnerId").val();
                        candidateZoneRequest.SiteId = $("#siteId").val();
                        candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                        candidateZoneRequest.SIDValue = $("#SIDValue").val();
                        url = '/TgNewUI/Search/Ajax/CandidateZone';
                        $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                            $scope.login.ForgotPass = false;
                            $scope.bCandidateZone = true;
                            $scope.CandidateZoneData = data;
                            $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                            $scope.bLoggedIn = true;
                            $scope.bSignInView = false;
                            $scope.showInFullView = false;
                            $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                            $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                            $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                            $scope.loadwebtrackerscript("/TGNewUI/CandidateZone", $scope.customScriptRendering.CandidateZone);
                            if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                                $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                                $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                                $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                            }
                            setTimeout(function () {
                                tgTheme.store();
                            }, 0);
                        });
                    }
                }
                else {
                    $scope.login.ResetPasswordPageSuccess = $scope.dynamicStrings.ChangePasswordSuccess;
                    $scope.login.ResetPasswordPageError = '';
                }
                //$scope.ActivePage('Back_Home');
                //You have successfully reset your password.
                //0'Password has been changed ;
            }
            else if (data.Result == 1 || data.Result == 2) {
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.Errormessage_AnswersDidNotMatch;
                //answer you provided did not match
                //Exceptions during password change
            }
            else if (data.Result == 3) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                //You cannot use your username as your password.
            }
            else if (data.Result == 4) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_SameOldNewPasswrd;
                //4'New password is same as old password
                //Your new password cannot be same as old password.
            }
            else if (data.Result == 5) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_RecentlyUsedPasswrd;
                //You cannot use a password that has recently been used.

            }
            else if (data.Result == 6) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                //Your password must be a minimum of 6 and a maximum of 25 characters.
            }
            else if (data.Result == 7) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_Mustbe8Char;
                //7'Pasword should have at least 8 characters
            }
            else if (data.Result == 8) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                //Your password may not contain spaces.
            }
            else if (data.Result == 9) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                //9'Pasword should have special characters
            }
            else if (data.Result == 10) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                // $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_8PrecedingPasswrd;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_RecentlyUsedPasswrd;
                //Your password may not be the same as any of the 8 preceding passwords.
            }
            else if (data.Result == 12) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                // $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_8PrecedingPasswrd;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_PasswordRecentChange;
                //Your password may not be the same as any of the 8 preceding passwords.
            }
            setTimeout(function () {
                $scope.$apply();
            }, 0);
        });
    };

    $scope.ValidateEmailPage = function ($scope) {
        $scope.login.ValidEmailPhone = false;
        $scope.login.EmailPageError = '';
        $scope.login.InvalidFields = [];
        if ($scope.login.NameOrPass == 'password') {
            if ($scope.tgSettings.LoginType == 1) {
                if ($scope.login.submit15 && (!angular.isDefined($scope.Email.Username) || (!$scope.login.Username || $scope.login.Username.length == 0))) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Username,
                        "ErrorID": 'Username',
                        "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                    });
                }
                else if ($scope.login.submit15 && angular.isDefined($scope.Email.Username) && $scope.login.Username.length > 0 && $scope.Email.Username.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Username,
                        "ErrorID": 'Username',
                        "ErrorType": "Invalid username"
                    });
                }
            }
            else if ($scope.tgSettings.LoginType == 0) {
                if ($scope.login.submit16 && (!angular.isDefined($scope.Email.email) || (!$scope.login.UserEmail || $scope.login.UserEmail.length == 0))) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Email,
                        "ErrorID": 'Email',
                        "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                    });
                }
                else if ($scope.login.submit16 && angular.isDefined($scope.Email.email) && $scope.login.UserEmail.length > 0 && $scope.Email.email.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Email,
                        "ErrorID": 'Email',
                        "ErrorType": "Invalid email"
                    });
                }
            }

        }
        else if ($scope.login.NameOrPass == 'username') {
            if ($scope.login.submit11 && (!angular.isDefined($scope.Email.FirstName) || (!$scope.login.FirstName || $scope.login.FirstName.length == 0))) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": $scope.dynamicStrings.Label_firstName,
                    "ErrorID": 'Firstname',
                    "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                });
            }
            else if ($scope.login.submit11 && angular.isDefined($scope.Email.FirstName) && $scope.login.FirstName.length > 0 && $scope.Email.FirstName.$invalid) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": $scope.dynamicStrings.Label_firstName,
                    "ErrorID": 'Firstname',
                    "ErrorType": "Invalid first name"
                });
            }

            if ($scope.login.submit12 && (!angular.isDefined($scope.Email.LastName) || (!$scope.Email.LastName.$viewValue || $scope.Email.LastName.$viewValue.length == 0))) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": $scope.dynamicStrings.Label_lastName,
                    "ErrorID": 'LastName',
                    "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                });
            }
            else if ($scope.login.submit12 && angular.isDefined($scope.Email.LastName) && $scope.Email.LastName.$viewValue.length > 0 && $scope.Email.LastName.$invalid) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": $scope.dynamicStrings.Label_lastName,
                    "ErrorID": 'LastName',
                    "ErrorType": "Invalid last name"
                });
            }
            if (($scope.login.submit13 || $scope.login.submit14) && (!angular.isDefined($scope.Email.email) || (!$scope.login.UserEmail || $scope.login.UserEmail.length == 0)) && (!angular.isDefined($scope.Email.HomePhone) || (!$scope.login.HomePhone || $scope.login.HomePhone.length == 0))) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": $scope.dynamicStrings.Label_Email,
                    "ErrorID": 'Email',
                    "ErrorField2": $scope.dynamicStrings.Label_homePhone,
                    "ErrorID2": 'HomePhone',
                    "ErrorEmailPhn": true,
                    "ErrorType": $scope.dynamicStrings.ErrorMessage_IsRequired
                });
                $scope.login.ValidEmailPhone = true;
            }
            else {

                if ($scope.login.submit13 && angular.isDefined($scope.Email.HomePhone) && $scope.Email.HomePhone.length > 0 && $scope.Email.HomePhone.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_homePhone,
                        "ErrorID": 'HomePhone',
                        "ErrorType": "Invalid home phone"
                    });
                }
                if ($scope.login.submit14 && angular.isDefined($scope.Email.email) && $scope.Email.email.length > 0 && $scope.Email.email.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Email,
                        "ErrorID": 'Email',
                        "ErrorType": "Invalid email"
                    });
                }
            }

        }
        return $scope;
    };
    $scope.validateAndcontinue1 = function ($scope) {
        $scope.login.EmailPageSuccess1 = '';
        $scope.login.EmailPageSuccess2 = '';
        $scope.login.EmailPageError = '';
        $scope.login.EmailErrorID = '';
        $scope.login.InvalidFields = [];
        $scope.login.submit11 = true;
        $scope.login.submit12 = true;
        $scope.login.submit13 = true;
        $scope.login.submit14 = true;
        $scope.login.submit15 = true;
        $scope.login.submit16 = true;

        $scope.login.ValidEmailPhone = false;
        $scope.ValidateEmailPage($scope);

        if ($scope.login.EmailPageError == '') {
            $scope.login.EmailErrorID = '';
            $scope.login.EmailPageError = '';
            $scope.login.InvalidFields = [];
            if ($scope.login.NameOrPass == 'password') {
                $scope.EmailToSecQuestions = false;
                $scope.ResetSecurityQuestionsPageFunc($scope);
                $scope.EmailPageAjax($scope);
            }
            else if ($scope.login.NameOrPass == 'username') {
                $scope.EmailToSecQuestions = false;
                $scope.ResetSecurityQuestionsPageFunc($scope);
                $scope.UserNamePageAjax($scope);
            }
            $("#securityQuestionContainer").setFocus();
            $scope.login.SecurityQuestionsPageError = '';
            $scope.login.InvalidSecQuestions = [];
            $scope.login.SecurityQuestionsErrorID = '';
        }
        else {
            return $scope;
        }
    };

    $scope.validateAndcontinue2 = function ($scope) {
        $scope.login.SecurityQuestionsPageError = '';
        $scope.login.InvalidSecQuestions = [];
        $scope.login.SecurityQuestionsErrorID = '';

        $.each($scope.SecurityQuestions.$error, function (errorType, allErrors) {
            if (allErrors != false) {
                if (errorType == "required") {
                    $.each(allErrors, function (index, error) {
                        $scope.login.InvalidSecQuestions.push({
                            "Question": error.$name == 'SecurityAnswer1' ? $scope.login.SecurityQuestion1 : error.$name == 'SecurityAnswer2' ? $scope.login.SecurityQuestion2 : $scope.login.SecurityQuestion3,
                            "SecurityAnsID": 'txt' + error.$name,
                            "ErrorMsg": $scope.dynamicStrings.ErrorMessage_AnswerRequired
                        });
                        if ($scope.login.SecurityQuestionsErrorID == '')
                            $scope.login.SecurityQuestionsErrorID = 'txt' + error.$name;
                    });
                }
                if (errorType == "pattern") {
                    $.each(allErrors, function (index, error) {
                        $scope.login.InvalidSecQuestions.push({
                            "Question": error.$name == 'SecurityAnswer1' ? $scope.login.SecurityQuestion1 : error.$name == 'SecurityAnswer2' ? $scope.login.SecurityQuestion2 : $scope.login.SecurityQuestion3,
                            "SecurityAnsID": 'txt' + error.$name,
                            "ErrorMsg": $scope.dynamicStrings.ErrorMessage_InvalidSecurityAnswer
                        });
                        if ($scope.login.SecurityQuestionsErrorID == '')
                            $scope.login.SecurityQuestionsErrorID = 'txt' + error.$name;
                    });
                }
            }
        });


        if (!$scope.SecurityQuestions.$valid) {
            $scope.login.SecurityQuestionsPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
            return;
        }
        else {
            $scope.login.blurred3 = false;
            $scope.login.blurred4 = false;
            $scope.login.pwd = '';
            $scope.login.pwdConfirm = '';
            $scope.pwdValidLength = false;
            $scope.pwdHasSpecial = false;
            $scope.pwdCorrect = false;
            if ($scope.login.NameOrPass == 'username') {
                $scope.login.CalledFrom = "forgotuname";
            }
            else {
                $scope.login.CalledFrom = '';
            }
            $scope.SecurityAnswersAjax($scope);
        }

    };
    $scope.validateAndcontinue3 = function ($scope) {
        $scope.login.ResetPasswordPageSuccess = '';
        $scope.login.ResetPasswordPageError = '';
        $scope.login.ResetPasswordErrorID = '';
        $scope.login.ResetPasswordID = '';
        if (angular.isDefined($scope.login.pwd) && $scope.login.pwd != '' && angular.isDefined($scope.login.pwdConfirm) && $scope.login.pwdConfirm != '') {
            if ($scope.login.pwdConfirm != '') {
                if ($scope.login.pwd.length > 0 && $scope.login.pwdConfirm.length > 0 && !$scope.ResetPassword.pwdConfirm.$error.mismatch) {
                    $scope.ResetPasswordAjax($scope)
                }
                else {
                    if (!angular.isDefined($scope.login.pwdConfirm) || $scope.login.pwdConfirm == '' || $scope.ResetPassword.pwdConfirm.$error.mismatch == true) {
                        $scope.login.ResetPasswordID = 'txtPwdConfirm';
                        $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_ReEnterNewPassword;
                        $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                        $("#resetPwdErrorMsg").focus();
                    }
                    else {
                        $scope.login.ResetPasswordID = 'txtPwd';
                        $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                        $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                        $("#resetPwdErrorMsg").focus();
                    }

                }

            }
        }
        else if (!angular.isDefined($scope.login.pwd) || $scope.login.pwd == '' || $scope.pwdCorrect != true) {
            $scope.login.ResetPasswordID = 'txtPwd'
            $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
            $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
            $("#resetPwdErrorMsg").focus();
        }
        else if (!angular.isDefined($scope.login.pwdConfirm) || $scope.login.pwdConfirm == '' || $scope.ResetPassword.pwdConfirm.$error.mismatch == true) {
            $scope.login.ResetPasswordID = 'txtPwdConfirm'
            $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_ReEnterNewPassword;
            $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
            $("#resetPwdErrorMsg").focus();
        }
        else {
            return false;
        }

    };
    $scope.isNameOrPass = function (NameOrPass) {
        return NameOrPass === $scope.login.NameOrPass;
    };
    $scope.returnToHome = function () {
        console.log("close dialogue");
        $scope.dialog.close();
        $timeout.cancel($scope.timer);
        $("#gateway").attr("aria-hidden", "false");
        $scope.ActivePage('Back_Home');


        return;
    };
    $scope.extendTime = function () {
        $("#gateway").attr("aria-hidden", "false");
        $timeout.cancel($scope.dialogTimer);
        $scope.dialog.close();

        $scope.ActivePage('ResetUserNamePassword');

    };

    //$scope.ForgotPassworBack = function () {
    //    if()
    //};

    $scope.ForgotPasswordContinue = function () {
        var srcqs = $.queryParams().srcqs
        if (typeof srcqs == 'undefined' || srcqs == "" || srcqs == null) {
            $scope.ActivePage('Back_Home');
        }
        else {
            window.location = '../../../TGwebhost/srcentry.aspx?q=' + srcqs
        }
    };

    $scope.ActivePage = function (activeTab) {
        if (activeTab == 'Email') {
            $scope.setTitle("forgotPassword");
            $scope.login.ActiveTab = 'Email';
            $scope.login.SecQuestions = true;
            if ($scope.timer != null)
            { $scope.timer = 1; }
            return $scope;
        }
        else if (activeTab == 'SecurityQuestions') {
            $scope.setTitle("forgotPassword");
            $scope.login.submit12 = false;
            $scope.login.submit13 = false;
            $scope.login.submit14 = false;
            $scope.login.submit15 = false;
            $scope.login.submit16 = false;
            $scope.login.ActiveTab = 'SecurityQuestions';
            $scope.login.SecQuestions = false;
            $scope.login.ResetUser = false;

            setTimeout(function () {
                $scope.setHash();
            }, 0);
            if ($scope.timer != null)
            { $scope.timer = 1; }
            return $scope;
        }
        else if (activeTab == 'ResetUserNamePassword') {
            $scope.setTitle("forgotPassword");
            $scope.login.ActiveTab = 'ResetUserNamePassword';
            $scope.login.ResetUser = true;
            angular.dependencies.ngDialog = ngDialog;
            $scope.setHash();//expose ngDialog factory class for editing
            if ($scope.login.ResetUser == true && $scope.login.NameOrPass == 'username') {
                $timeout.cancel($scope.timer);
                $scope.timeOutSeconds = parseInt($scope.tgSettings.TimeOutSec * 1000);
                if ($scope.timeOutSeconds < 1) {
                    $scope.timeOutSeconds = 60000;
                }

                $scope.timer = $timeout(function () {
                    $("#gateway").attr("aria-hidden", "true");
                    $scope.dialog = ngDialog.open({
                        template: 'TimeOutWarning',
                        className: 'ngdialog-theme-default leavingWarningContent',
                        showClose: true,
                        closeByDocument: false,
                        appendTo: "#menuContainer",
                        ariaRole: "dialog",
                        scope: $scope
                    });
                    $scope.dialogTimer = $timeout(function () {
                        $scope.returnToHome();
                    }, $scope.timeOutSeconds);
                }, $scope.timeOutSeconds);

            }
            return $scope;
        }
        else if (activeTab == 'Back_Home') {
            $timeout.cancel($scope.timer);
            //Reset Input values values
            var width = $(window).width();
            $scope.bError = false;
            $scope.ResetNamePass($scope);
            if (width < 769 || $scope.backtobSignInView) {
                if ($scope.backtobSignInView) {
                    $scope.showInFullView = true;
                }
                $scope.bSignInView = true;
                $scope.showMobileSignIn(this);
            }
            else {
                $scope.homeView();
            }
        }


    };
    $scope.CloseDialogs = function () {
        ngDialog.closeAll();
    };

    $scope.LaunchSearchResultsFromJobCart = function () {
        $scope.searchMatchedJobs(this);
    };

    $scope.LaunchSearchResultsFromDashBoard = function () {

        var isSearchResultsLaunchedAtleastOnce = false;
        if (typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
            _.each($scope.oHistory, function (oPriorScope, sName) {
                if (sName.indexOf('keyWordSearch') != -1) {
                    isSearchResultsLaunchedAtleastOnce = true;
                    return;
                }
            });
        if (isSearchResultsLaunchedAtleastOnce) {
            $scope.bCandidateZone = false;
            $scope.bSearchResults = true;
            $scope.bSidebarVisible = true;
            $scope.bSidebarShown = true;
            $scope.bSidebarOverlay = true;
            $scope.$root.workFlow = "searchResults";
            if ($scope.jobsCache != null) {
                $scope.jobs = $scope.jobsCache;
            }
            $scope.jobs = _.each($scope.jobs, function (job) {
                job.Selected = false;
            });
            if (typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
                _.each($scope.oHistory, function (oPriorScope, sName) {
                    if (sName.indexOf('keyWordSearch') != -1) {
                        $scope.oHistory[sName].SelectJobs = $scope.tgSettings.SelectJobsText;;
                        $scope.oHistory[sName].toggleCheckBoxes = true;
                        $scope.oHistory[sName].SelectedJobsChecked = false;
                    }
                });
            $scope.setHash();
        }
        else {
            $scope.bCanZoneJobsLoadingState = true;
            $scope.searchMatchedJobs(this);
        }

    };

    $scope.LaunchJobCartFromSearchResultsOrJobDetails = function () {
        if ($scope.bJobDetailsShown) {
            $scope.bJobCartLaunchedFromJobDetails = true;
        }
        else {
            $scope.bJobCartLaunchedFromSearchResults = true;
        }
        if ($scope.bresponsiveCandidateZone) {
            $scope.savedJobsCache = null;
            $scope.bCandidateZone = true;
            $scope.bJobDetailsShown ? $scope.DashboardPrevPage = ["JobDetails"] : $scope.DashboardPrevPage = ["SearchResults"];
            $scope.ViewDashBoardData("SavedJobs");
        }
        else {
            $scope.ViewJobCartAjax();
        }
    };

    $scope.RemoveJobFromCart = function (event, scope, job) {
        var siteId = _.pluck(_.where(job.Questions, { "QuestionName": "siteid" }), "Value").toString();
        var partnerId = $("#partnerId").val();
        var jobId = _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString();
        var jobSiteInfo = jobId + "_" + siteId;
        $scope.RemoveFromJobCartAjax(partnerId, siteId, jobSiteInfo, job);
    };


    $scope.InitialiseJobdetails = function (AlertVal) {
        $scope.ShowJobAlert = AlertVal;
        $scope.bBypassGQLogin = false;
        if (!$scope.bLoggedIn)
            $scope.AnonymousLoginType = "";
        setTimeout(function () {
            $scope.$apply();
        }, 0);
        setTimeout(function () {
            $scope.setTitle("jobDetails");
        }, 10);
    };

    $scope.CallApply = function () {
        $timeout(function () {
            $scope.$apply();
        }, 0);
    }

    $scope.CloseExpiredJobAlert = function () {
        $scope.bShowExpiredJobAlert = false;
        $scope.CallApply();
    };

    $scope.CloseApplicationsExpiredJobAlert = function () {
        $scope.CandZoneApplicationsExpiredJobs = null;
        $scope.NotificationExpiredJobs = null;
        $scope.NotificationExpiredDrafts = null;
        $scope.draftNotificationExpired = false;
    }

    $scope.CloseSubmittedApplicationsExpiredJobAlert = function () {
        $scope.CandZoneSubmittedApplicationsExpiredJobs = null;
    }

    $scope.CloseJobRemovalJobAlert = function () {
        $scope.bJobRemovalStatus = false;
        $scope.bAppsRemovalStatus = false;
        if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
            $scope.$root.oHistory['SavedJobs'].bJobRemovalStatus = false;
        }
        $scope.CallApply();
    };

    $scope.CloseJobsSavedAlert = function () {
        $scope.bJobsSaved = false;
        $scope.CallApply();
    };

    $scope.CloseJobSavedAlert = function () {
        $scope.bJobSaved = false;
        $scope.CallApply();
    };

    $scope.CloseHeaderStickerAlert = function (property) {
        if (property == 'AttachFilesFromApplicationDetail') {
            $scope.attachFilesStatus = 0;
            return;
        } else if (property == 'CompleteFormFromApplicationDetail') {
            $scope.candPortalFormStatus = 0;
            return;
        }
        $scope[property] = false;
        $scope.CallApply();
        if (property == 'ApplicationRemoved' || property == 'WithdrawlFromSubmittedApplications' || property == 'ReactivateFromSubmittedApplications') {
            $scope.oHistory["Applications"][property] = false;
        }
    };
    $scope.CloseHeaderStickerEnumAlert = function (property) {
        $scope[property] = 0;
        $scope.CallApply();
        if (property == 'savedSearchActionCompletion') {
            $scope.oHistory["SavedSearches"][property] = 0;
        }
    };
    if ($scope.EmailToSecQuestions == true) {
        $scope.login.ForgotPass = true;
        if ($scope.TokenResponse.SecurityQuestions != null) {
            if ($scope.TokenResponse.SecurityQuestions.SecurityQuestion1 != null && $scope.TokenResponse.SecurityQuestions.SecurityQuestion1 != '') {
                $scope.login.SecurityQuestion1 = eval("$scope.securityQuestions." + $scope.TokenResponse.SecurityQuestions.SecurityQuestion1);
            }
            if ($scope.TokenResponse.SecurityQuestions.SecurityQuestion2 != null && $scope.TokenResponse.SecurityQuestions.SecurityQuestion2 != '') {
                $scope.login.SecurityQuestion2 = eval("$scope.securityQuestions." + $scope.TokenResponse.SecurityQuestions.SecurityQuestion2);
            }
            if ($scope.TokenResponse.SecurityQuestions.SecurityQuestion3 != null && $scope.TokenResponse.SecurityQuestions.SecurityQuestion3 != '') {
                $scope.login.SecurityQuestion3 = eval("$scope.securityQuestions." + $scope.TokenResponse.SecurityQuestions.SecurityQuestion3);
            }
        }
        if ($scope.login.SecurityQuestion1 == '' && $scope.login.SecurityQuestion2 == '' && $scope.login.SecurityQuestion3 == '') {
            if ($scope.TokenResponse.TokenResult == 2) {
                $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_EmailLinkExpired;
                //ErrorMessage_EmailLinkExpired
            }
            else if ($scope.TokenResponse.TokenResult == 3) {
                $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_EmailLinkAlreadyUsed;
                //ErrorMessage_EmailLinkAlreadyUsed
            }
            else
                $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_ContactHelpDesk;
        }
        $scope.ActivePage('SecurityQuestions');
    }



    ///  ///Reset UserName Password Ends here


    var that = $scope,
        asNativeScopeKeys = (_.keys($scope.$new())),
        response = $scope.preloadResponse || $scope.searchResponse,
        preLoadSmartSearchResponse = $scope.preloadResponse && $scope.preloadResponse.SmartSearchJSONValue ? JSON.parse($scope.preloadResponse.SmartSearchJSONValue) : '',
        bMapProvider = response.ClientSettings.ProximitySearch.toLowerCase() == "yes",
        isJobsNearMeOn = (response.ClientSettings.HideHighlightedJobsSection.toLowerCase() == "no" && response.ClientSettings.ShowJobsNearMe.toLowerCase() == "yes" && response.ClientSettings.ProximitySearch.toLowerCase() == "yes") ? true : false;

    window.appScope = $scope;
    $scope.$root.appScope = $scope;

    $scope.$root.workFlow = $("#workFlow").attr("content");

    $scope.$root.historyStateCallback = $scope.historyStateCallback || _.noop;
    $scope.$root.historyApplyCallback = $scope.historyApplyCallback || _.noop;

    $scope.$root.storeHistoryState = $scope.storeHistoryState || _.noop;

    $scope.$root.setPrevHash = $scope.setPrevHash || _.noop;

    $scope.utils.reassessMoreLinksOnWindowResize();

    $scope.utils.stackPageFooter();



    if ($.queryParams().brandingTest) {
        response.ClientSettings.ShowJobSearchHeader = "Always";
        response.FooterInfo = [{ Name: "link1" }, { Name: "link2" }];
        console.log("forcing show job search header to always");
    }

    $scope.$watch("jobs", function (val) {
        //check footer position when no jobs are returned
        //when jobs are returned, loopComplete directive will do the same
        if (val && val.length === 0)
            setTimeout(function () {
                $.pinToFold();
            }, 0);
    });

    _.assign($scope, {
        $location: $location,
        $window: $window,
        response: response,
        showHeader: response.ClientSettings.ShowJobSearchHeader.toLowerCase(),
        bresponsiveCandidateZone: response.ResponsiveCandidateZone,

        bcandidatezoneSubmenu: false,
        LoginFromLinkView: false,
        PortalLogin: false,
        PortalPwdReset: false,
        shortMonthNames: $("#shortMonthNames").val(),
        storeHistoryState: function () {
            var applyHashData = [];
            if (typeof applyScope != "undefined" && typeof applyScope.page != "undefined") {
                applyHashData = {
                    ReqID: applyScope.page.reqid,
                    TQID: applyScope.page.tqid,
                    SiteId: applyScope.page.siteid,
                    SID: applyScope.page.sid,
                    ApidId: applyScope.page.aipid,
                    LocaleId: applyScope.page.localeid,
                    GQSessionID: applyScope.page.gqsessionid,
                    PageId: applyScope.page.pageid
                }
            }

            var oState = $scope.$root.oHistory[$location.hash()] = $scope.oHistory[$location.hash()] = _.clone($scope, false);
            oState.applyPageData = _.clone(applyHashData, true);
            oState.facets = _.clone($scope.facets, true);
            oState.powerSearchQuestions = _.clone($scope.powerSearchQuestions, true);
            oState.jobs = _.clone($scope.jobs, true);
            oState.payload = _.clone($scope.payload, false);
        },
        historyStateCallback: function setSearchStateFromHash() {
            var searchResultsFromJobDetails = false;
            //Retain some Social referral Scope which are used universally, reset other scope based on History Hash
            appScope.$root.oHistory[$location.hash()].SocialReferral_FirstName = $scope.$root.oHistory[$location.hash()].SocialReferral_FirstName = $scope.oHistory[$location.hash()].SocialReferral_FirstName = $scope.SocialReferral_FirstName;
            appScope.$root.oHistory[$location.hash()].SocialReferral_LastName = $scope.$root.oHistory[$location.hash()].SocialReferral_LastName = $scope.oHistory[$location.hash()].SocialReferral_LastName = $scope.SocialReferral_LastName;
            appScope.$root.oHistory[$location.hash()].SocialReferral_ProfileId = $scope.$root.oHistory[$location.hash()].SocialReferral_ProfileId = $scope.oHistory[$location.hash()].SocialReferral_ProfileId = $scope.SocialReferral_ProfileId;
            appScope.$root.oHistory[$location.hash()].SocialReferral_READY = $scope.$root.oHistory[$location.hash()].SocialReferral_READY = $scope.oHistory[$location.hash()].SocialReferral_READY = $scope.SocialReferral_READY;

            //Retain some Scope which are used universally, reset other scope based on History Hash
            appScope.$root.oHistory[$location.hash()].mobileScreen = $scope.$root.oHistory[$location.hash()].mobileScreen = $scope.oHistory[$location.hash()].mobileScreen = $scope.mobileScreen;
            appScope.$root.oHistory[$location.hash()].ShowTimeoutMessage = $scope.$root.oHistory[$location.hash()].ShowTimeoutMessage = $scope.oHistory[$location.hash()].ShowTimeoutMessage = $scope.ShowTimeoutMessage;
            appScope.$root.oHistory[$location.hash()].bLoggedIn = $scope.$root.oHistory[$location.hash()].bLoggedIn = $scope.oHistory[$location.hash()].bLoggedIn = $scope.bLoggedIn;
            appScope.$root.oHistory[$location.hash()].ProfileDetails = $scope.$root.oHistory[$location.hash()].ProfileDetails = $scope.oHistory[$location.hash()].ProfileDetails = $scope.ProfileDetails;
            appScope.$root.oHistory[$location.hash()].welcomeTitle = $scope.$root.oHistory[$location.hash()].welcomeTitle = $scope.oHistory[$location.hash()].welcomeTitle = $scope.welcomeTitle;
            appScope.$root.oHistory[$location.hash()].welcomeText = $scope.$root.oHistory[$location.hash()].welcomeText = $scope.oHistory[$location.hash()].welcomeText = $scope.welcomeText;
            appScope.$root.oHistory[$location.hash()].AnonymousLoginType = $scope.$root.oHistory[$location.hash()].AnonymousLoginType = $scope.oHistory[$location.hash()].AnonymousLoginType = $scope.AnonymousLoginType;

            //Retain DuplicateVariables
            appScope.$root.oHistory[$location.hash()].LimitExceededMessage = $scope.$root.oHistory[$location.hash()].LimitExceededMessage = $scope.oHistory[$location.hash()].LimitExceededMessage = $scope.LimitExceededMessage;
            appScope.$root.oHistory[$location.hash()].ApplyDifference = $scope.$root.oHistory[$location.hash()].ApplyDifference = $scope.oHistory[$location.hash()].ApplyDifference = $scope.ApplyDifference;
            appScope.$root.oHistory[$location.hash()].AllowReApply = $scope.$root.oHistory[$location.hash()].AllowReApply = $scope.oHistory[$location.hash()].AllowReApply = $scope.AllowReApply;
            appScope.$root.oHistory[$location.hash()].Applied = $scope.$root.oHistory[$location.hash()].Applied = $scope.oHistory[$location.hash()].Applied = $scope.Applied;
            appScope.$root.oHistory[$location.hash()].bellNumber = $scope.$root.oHistory[$location.hash()].bellNumber = $scope.oHistory[$location.hash()].bellNumber = $scope.bellNumber;

            //resets state based on browser history controls or location input
            var storedScope = $scope.oHistory[$location.hash()];
            _.forIn(storedScope, function (val, key) {
                if (_.isBoolean(val) || _.isBoolean(this[key]))
                    this[key] = val;
                if (_.isNumber(val) || _.isNumber(this[key]))
                    this[key] = val;
                if ((_.isString(val) || _.isString(this[key])) && key != "encryptedBruid")
                    this[key] = val;
                if (val && val.text != undefined)
                    this[key].text = val.text;
                else if (key == "facets" || key == "powerSearchJobs" || key == "powerSearchQuestions" || key == "oldPowerSearchQuestions")
                    //deep operatation to set state
                    _.setState(this[key], val, 3);
                else if (key == "jobs") {
                    this[key] = val;
                }
                else if (_.isArray(val) && this[key] != val && key.indexOf("$$") != 0 && this[key] != null) {
                    //shallow operation to set state
                    this[key].length = 0;
                    this[key].push.apply(this[key], val);
                }

            }, $scope);

            if ($location.hash()) {
                if (storedScope.payload && ($location.hash().indexOf("keyWordSearch") != -1 || $location.hash().indexOf("locationSearch") != -1 || $location.hash().indexOf("jobDetails") != -1)) {
                    if ($location.hash().indexOf("keyWordSearch") != -1 || $location.hash().indexOf("locationSearch") != -1) {
                        $scope.setTitle("searchResults");
                        if (appScope.$root.workFlow.toLowerCase() == "jobdetails") {
                            searchResultsFromJobDetails = true;
                        }
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                        if (searchResultsFromJobDetails) {
                            setTimeout(function () {
                                $(window).scrollTop($("#" + $scope.ActiveElementInSearchResults).offset().top + $scope.searchResultsScrollTopPosition);
                                $("#" + $scope.ActiveElementInSearchResults).focus();
                            }, 0);
                        }
                    } else if ($location.hash().indexOf("jobDetails") != -1) {
                        setTimeout(function () {
                            $scope.setTitle("jobDetails");
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                        }, 10);
                    }
                    if (storedScope.payload.fnPayloadParent) {
                        storedScope.payload.fnPayloadParent(true);
                        setTimeout(function () { $scope.$apply(); }, 0);
                    } else {
                        storedScope.payload.fnPayload.apply(storedScope.payload.oPayloadContext, storedScope.payload.aPayloadResponse);
                    }
                }
                else if ($location.hash().indexOf("advancedSearch") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "powerSearch";
                    $scope.setTitle("powerSearch");
                }
                else if ($location.hash().indexOf("SelectedGroup") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "SelectedGroup";
                    $scope.setTitle("SelectedGroup");
                }
                else if ($location.hash().indexOf("ForgotUsernamePassword") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "forgotPassword";
                    $scope.ActivePage('Email');
                }
                else if ($location.hash().indexOf("CreateAccount") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = true;
                    $scope.bPrivacyPages = false;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyOptOut = false;
                }
                else if ($location.hash().indexOf("PolicyQuestion") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = false;
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = true;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyOptOut = false;

                }
                else if ($location.hash().indexOf("PolicyStatement") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = false;
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bPrivacyPolicyStatement = true;
                    $scope.bPrivacyOptOut = false;

                }
                else if ($location.hash().indexOf("PolicyOptOut") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = false;
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyOptOut = true;

                }
                else if ($location.hash().indexOf("SavedJobs") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("JobCart");
                    $scope.DashBoardMenu("SavedJobs");
                }
                else if ($location.hash().indexOf("Applications") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Applications");
                    $scope.candidatezoneSubView == 'dashBoard';
                    $scope.candidatezoneDashBoardView = "Applications";
                    setTimeout(function () {
                        $scope.CallCollapse("CollapsedUnfinishedApplications", "CollapsedAppliedApplications");
                    }, 100);

                }
                else if ($location.hash().indexOf("SavedSearches") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("SavedSearches");
                    $scope.DashBoardMenu("SavedSearches");
                }
                else if ($location.hash().indexOf("myFiles") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("MyFile");
                    $scope.candidatezoneSubView == 'jobProfile';
                    $scope.candidatezoneDashBoardView = "myFiles";
                }
                else if ($location.hash().indexOf("profile") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Profile");
                    $scope.candidatezoneSubView == 'jobProfile';
                    $scope.candidatezoneEditProfileView = "profile";
                }
                else if ($location.hash().indexOf("accountSettings") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("AccountSettings");
                    $scope.candidatezoneSubView == 'accountSettings';
                }
                else if ($location.hash().indexOf("applicationDetail") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.candidatezoneSubView == 'applicationDetail';
                    setTimeout(function () { $scope.contructAppDetailActions($scope.appliedApplicationDetail, true); $scope.setTitle("ApplicationDetail"); }, 100);

                }
                else if ($location.hash().indexOf("applicationPreview") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.candidatezoneSubView == 'applicationPreview';
                    setTimeout(function () { $scope.setTitle("applicationPreview"); }, 100);
                }
                else if ($location.hash().indexOf("JobCart") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("JobCart");
                    $scope.$root.workFlow = 'JobCart';
                }
                else if ($location.hash().indexOf("ResponsiveAssessment") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Assessments");
                    $scope.candidatezoneSubView == 'ResponsiveAssessment';
                }
                else if ($location.hash().indexOf("ResponsiveReferrals") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Referrals");
                    $scope.candidatezoneSubView == 'ResponsiveReferrals';
                    setTimeout(function () {
                        $scope.CallCollapse("ActiveReferrals", "SentReferrals");
                    }, 100);

                } else if ($location.hash().indexOf("appAddFiles") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("AddFiles");
                    $scope.candidatezoneSubView == 'ApplicationAddFiles';
                    $scope.penddingAttachments = [];
                    $scope.candidatezoneDashBoardView = "Applications";
                }
                else if ($location.hash().indexOf("keyWordSearch") != -1 || $location.hash().indexOf("locationSearch") != -1) {
                    if (appScope.$root.workFlow.toLowerCase() == "jobdetails") {
                        searchResultsFromJobDetails = true;
                        setTimeout(function () {
                            $(window).scrollTop($("#" + $scope.ActiveElementInSearchResults).offset().top + $scope.searchResultsScrollTopPosition);
                            $("#" + $scope.ActiveElementInSearchResults).focus();
                        }, 0);
                    }
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults"
                    $scope.setTitle("searchResults");
                }
                else if ($location.hash().indexOf("jobDetails") != -1) {
                    setTimeout(function () {
                        $scope.setTitle("jobDetails");
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                    }, 10);
                } else if ($location.hash().indexOf("communication") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Communication");
                    $scope.candidatezoneSubView == 'messageArchive';
                } else if ($location.hash().indexOf("ReferralDetails") != -1) {
                } else if ($location.hash().indexOf("CandidateZone") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                }
                else {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                    $scope.setTitle("welcome");
                    $scope.showInitialJobs(true);
                }
            } else {
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                $scope.setTitle("welcome");
                $scope.showInitialJobs(true);
            }
            if (!searchResultsFromJobDetails)
                $scope.scrolltop();

            setTimeout(function () { $.pinToFold; }, 0);
        },

        setPrevHash: function (prevHash) {
            if (typeof previousHashes === 'undefined') {
                previousHashes = [];
            }
            previousHashes[previousHashes.length] = prevHash;
        },

        setHash: function (bResettingFromHistory, oPayloadData, oPayloadContext) {
            //sets window location hash
            //triggering the locationChangeStart event
            //see handler in shared.js 

            var B_TREAT_FILTER_AS_NEW_PAGE = true,
                aHash = [];

            if (bResettingFromHistory)
                return;

            //if ($location.hash() === "") {
            //    //location coordinates are not available when initial load history state is stored
            //    //so store it before moving to next screen
            //    $scope.$root.oHistory[""].geoLocationLongitude = $scope.geoLocationLongitude;
            //    $scope.$root.oHistory[""].geoLocationLatitude = $scope.geoLocationLatitude;
            //}
            //oPayloadContext.appScope = appScope;

            if ($scope.bJobDetailsShown) {
                aHash.push("jobDetails=" + $scope.jobDetailsJobShown);
                if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone) {
                    aHash.push("fromSavedJobs=" + true);
                }
            }
            else if ($scope.bInitialLoad) {
                if ($scope.login.ForgotPass == true) {
                    if ($scope.login.ActiveTab == 'Email')
                        aHash.push("ForgotUsernamePassword");
                    else if ($scope.login.ActiveTab == 'SecurityQuestions')
                        aHash.push("SecurityQuestions");
                    else if ($scope.login.ActiveTab == 'ResetUserNamePassword' && $scope.login.NameOrPass == 'username')
                        aHash.push("ForgotUsername");
                    else if ($scope.login.ActiveTab == 'ResetUserNamePassword' && $scope.login.NameOrPass != 'username')
                        aHash.push("ResetPassword");
                    else
                        aHash.push("ForgotUsernamePassword");
                }
                else if ($scope.bPrivacyPages) {
                    if ($scope.bPrivacyPolicyQuestion)
                        aHash.push("PolicyQuestion");
                    else if ($scope.bPrivacyPolicyStatement)
                        aHash.push("PolicyStatement");
                    else if ($scope.bPrivacyOptOut)
                        aHash.push("PolicyOptOut");
                }
                else if ($scope.bCreateAccount)
                    aHash.push("CreateAccount");
                else if ($scope.LoginChangeSecQuestion)
                    aHash.push("ChangeSecurityQuestion");
                else if ($scope.bCandidateZone) {
                    if ($scope.bJobCart) {
                        aHash.push("JobCart");
                    }
                    else {
                        aHash.push("CandidateZone");
                    }
                }
                else {
                    if (appScope.$root.workFlow != "ReferralDetails")
                        aHash.push("home");
                }
            }
            else if ($scope.bSelectedGroup) {
                aHash.push("SelectedGroup");
            }
            else if ($scope.bCandidateZone) {
                if (!$scope.bresponsiveCandidateZone && $scope.bJobCart) {
                    aHash.push("JobCart");
                }
                else if ($scope.candidatezoneSubView == 'dashBoard') {
                    switch ($scope.candidatezoneDashBoardView) {
                        case "SavedJobs":
                            aHash.push("SavedJobs");
                            break;
                        case "Applications":
                            aHash.push("Applications");
                            break;
                        case "SavedSearches":
                            aHash.push("SavedSearches");
                            break;
                        default:
                            aHash.push("SavedJobs");
                            break;
                    }
                }
                else if ($scope.candidatezoneSubView == 'jobProfile') {
                    switch ($scope.candidatezoneEditProfileView) {
                        case "myFiles":
                            aHash.push("myFiles");
                            break;
                        case "profile":
                            aHash.push("profile");
                            break;
                        default:
                            aHash.push("profile");
                            break;
                    }

                }
                else if ($scope.candidatezoneSubView == 'accountSettings') {
                    aHash.push("accountSettings");
                }
                else if ($scope.candidatezoneSubView == 'messageArchive') {
                    aHash.push("communication");
                }
                else if ($scope.candidatezoneSubView == 'applicationDetail') {
                    if ($scope.previewOfSubmittedApplication) {
                        aHash.push("applicationPreview");
                    } else if ($scope.candPortalFormView) {
                        aHash.push("candPortalFormView");
                    } else if ($scope.candPortalPacketView) {
                        aHash.push("candPortalPacketView");
                    }
                    else {
                        aHash.push("applicationDetail");
                    }
                }
                else if ($scope.candidatezoneSubView == 'ResponsiveAssessment')
                    aHash.push("ResponsiveAssessment");
                else if ($scope.candidatezoneSubView == 'ResponsiveReferrals')
                    aHash.push("ResponsiveReferrals");
                else if ($scope.candidatezoneSubView == 'ApplicationAddFiles')
                    aHash.push("appAddFiles");
                else
                    aHash.push("CandidateZone");
            }
            else if (appScope.$root.workFlow != "ReferralDetails") {
                if ($scope.bPowerSearchVisible)
                    aHash.push("advancedSearch");
                else if (appScope.powerSearchQuestions.length) {
                    aHash.push.apply(aHash, _(appScope.powerSearchQuestions).map(function (q, i) {
                        var prefix = q.QuestionName + "=";

                        if (q.Value)
                            return prefix + escape(q.Value);
                        if (_.some(q.Options, { Selected: true })) {
                            return prefix + _(q.Options).map(function (opt) {
                                if (opt.Selected)
                                    return opt.OptionName;
                            }).compact().valueOf().join(",");
                        }
                        if (q.selectedOptions != undefined) {
                            var selectedOptions = _.pluck(q.selectedOptions, "value");
                            selectedOptions = selectedOptions.join(',');
                            return prefix + selectedOptions;
                        }
                    }).compact().valueOf());
                }
                if (!$scope.keyWordSearch.hidden)
                    aHash.push("keyWordSearch=" + $scope.keyWordSearch.text);
                if (!$scope.locationSearch.hidden)
                    aHash.push("locationSearch=" + $scope.locationSearch.text);
                if ($scope.keyWordSearch.hidden && $scope.locationSearch.hidden)
                    aHash.push("keyWordSearchlocationSearch");

                if (B_TREAT_FILTER_AS_NEW_PAGE && $scope.filterAppliedCount) {
                    _.each($scope.facets, function (oFacet) {
                        if (oFacet.SelectedCount) {
                            var aSelectedOptions = _.pluck(_.filter(oFacet.Options, { Selected: true }), "OptionName");
                            aHash.push(oFacet.Description + "=" + aSelectedOptions.join("_or_"));
                        }
                    })
                }
            }
            if ($scope.$root.workFlow == "ReferralDetails" || $scope.workFlow == "ReferralDetails") {
                aHash = []
                aHash.push("ReferralDetails");
            }
            else {
                $scope.utils.storePayload(oPayloadData, oPayloadContext);
            }
            //if ($scope.bLoggedIn)
            //    aHash.push("loggedIn=" + $scope.bLoggedIn);
            $location.hash(aHash.join("&"));

            setTimeout(function () { $scope.adjustTSHeight(); $.pinToFold }, 0);
        },
        historyApplyCallback: function () {
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                },
                template: 'RedirectToApplyTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
            });
            var applyPageData = $scope.oHistory[$location.hash()].applyHashData;
            var rft = $("[name='__RequestVerificationToken']").val();
            if (applyPageData.ApidId == "-1" || applyPageData.GQSessionID == "")
                var URL = "/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + "&tqid=" + applyPageData.TQID + "&localeid=" + applyPageData.LocaleId + "&reqid=" + applyPageData.ReqID + "&partnerid=" + $("#partnerId").val() + "&siteid=" + applyPageData.SiteId + "&sid=" + applyPageData.SID + "&loadingViaAjax=true&RFT=" + rft;
            else
                var URL = "/gqweb/apply?BRUID=" + encodeURIComponent($scope.encryptedBruid) + "&TQId=" + applyPageData.TQID + "&GQSessionId=" + applyPageData.GQSessionID + "&reqid=" + applyPageData.ReqID + "&partnerid=" + $("#partnerId").val() + "&PageId=" + applyPageData.PageId + "&AIPID=" + applyPageData.ApidId + "&siteid=" + applyPageData.SiteId + "&wbmode=false&loadingViaAjax=true&RFT=" + rft;
            history.back();


            $.ajax({
                method: "GET",
                url: URL,
                success: function (result) {
                    ngDialog.closeAll();
                    $scope.$root.applyResponse = result;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                }
            });
        },

        welcomeState: function (bSetWorkflowState) {
            var bWelcome = this.bInitialLoad && !this.bPrivacyPages && !this.bCreateAccount && !this.bCandidateZone && !(this.login && this.login.ForgotPass) && !this.LoginChangeSecQuestion && !(this.bSignInView && !this.calledFromDesktop);

            if (bWelcome && bSetWorkflowState !== false)
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";

            return bWelcome;
        },

        showSearchResults: function () {
            var bShow = (!$scope.bPrivacyPages && !$scope.bSelectedGroup && !$scope.bCreateAccount && !$scope.login.ForgotPass && !$scope.bCandidateZone && !$scope.bSignInView && !$scope.LoginChangeSecQuestion) || ($scope.bSignInView && ($scope.calledFromDesktop || $scope.bRenderPhoneViewSearch));

            return bShow;
        },
        afterShowSearchResults: function () {

            if (!$scope.welcomeState(false) && !$scope.bPowerSearchVisible && $scope.bSidebarVisible && !$scope.bJobDetailsShown)
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";


            $scope.bBypassGQLogin = false;
            if (!$scope.bLoggedIn)
                $scope.AnonymousLoginType = "";
        },

        keyWordSearch: {
            hidden: response.ClientSettings.HideKeywordSearchBox.toLowerCase() == "yes",
            text: preLoadSmartSearchResponse.Keyword == undefined ? "" : preLoadSmartSearchResponse.Keyword,
            prompt: response.ClientSettings.KeywordSearchText,
            labelText: $scope.dynamicStrings.Label_KeywordSearchBox,
            submitAfterSelection: false,
            searchButton: true,
            enterKeyHit: false,  //To handle immediate enter key hit.          
            autocompleteConfig: {
                source: function (request, response) {
                    var autocompleterequest = {
                        partnerId: $("#partnerId").val(),
                        siteId: $("#siteId").val(),
                        searchString: request.term,
                        searchFields: that.keywordFields
                    };

                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/KeywordAutoComplete",
                        data: autocompleterequest,
                        success: function (oRawData) {
                            if (!$scope.keyWordSearch.enterKeyHit && oRawData != null && oRawData.Options && oRawData.Options.length) {
                                data = _.sort(oRawData.Options).slice(0, 10);
                                data = _.map(data, function (job) {
                                    job = job.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
                                    return job;
                                });
                                $scope.keyWordSearch.autoCompleteResponse = data;
                                if ($scope.keyWordSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                    $scope.keyWordSearch.typeAheadConfig.typeAheadCallBack();
                                response(data);
                            }
                            else {
                                response(null);
                                if ($scope.keyWordSearch.enterKeyHit) {
                                    $scope.utils.cleanUpAutocompletes();
                                }
                                $scope.keyWordSearch.enterKeyHit = false;

                            }
                        },
                        error: function (jqxhr, status, error) {
                            response(null);
                        }
                    });

                },
                minLength: 1,
                select: function (event, ui) {
                    /*
                    * The select event firing two times,
                    * 1. when option is going to be selected.
                    * 2. After selection when list box is going to be closed.
                   */
                    if (!ui.item.value && $scope.bPowerSearchVisible) {
                        $scope.keyWordSearch.text = $scope.powerSearchKeyWordSearch.text;
                    } else {
                        if ($scope.keyWordSearch.enterKeyHit && ui.item.value != "" && ui.item.value != event.target.value) {
                            $scope.keyWordSearch.text = event.target.value;
                        } else if (ui.item.value && ui.item.value != "") {
                            $scope.keyWordSearch.text = ui.item.value;
                        } else if (event.target.value != "") {
                            $scope.keyWordSearch.text = event.target.value
                        } else {
                            $scope.keyWordSearch.text = $(event.toElement).text();
                        }
                        $scope.powerSearchKeyWordSearch.text = $scope.keyWordSearch.text;
                    }
                    $scope.$apply();

                    //Handled enter and tab key for selecting the item from the list.
                    if (event.originalEvent && (
                            (event.originalEvent.originalEvent && event.originalEvent.originalEvent.keyCode == $.keyCodes.tab) ||
                            (event.originalEvent.target.type == "" && event.originalEvent.keyCode == $.keyCodes.enter) ||
                            (event.originalEvent.type == "menuselect")
                        )
                    ) {
                        $scope.keyWordSearch.submitAfterSelection = false;
                        return;
                    } else if ($scope.keyWordSearch.submitAfterSelection) {
                        //Fetching job matched results for enter key press on textbox.
                        $scope.keyWordSearch.submitAfterSelection = false;
                        $scope.utils.cleanUpAutocompletes();
                        if ($scope.workFlow == "powerSearch") {
                            $(".powerSearchContainer").find("button.ladda-button").trigger("click");
                        } else {
                            $(".searchBoxContainer").find("button.ladda-button").trigger("click");
                        }
                    } else {
                        $scope.utils.cleanUpAutocompletes();
                    }
                },
                freeFormSelect: true,
                emptyNoMatch: true
            },
            addButtonClickHandler: function (scope) {
                //implementation assumes that the autocomplete has fetched relevant results
                //TODO: add a failsafe in autocomplete results return to prevent timing glitches
                var sText = angular.nearestScopeVal("oInput.text", scope),
                    rxTester = new RegExp(sText.replace("(", "\\(").replace(")", "\\)"), "gi"),
                    oOption = _.find(oQuestion.aAvailableOptions, function (oAvailableOption) {
                        //return rxTester.test(oAvailableOption.label);
                        return sText.toLowerCase() == oAvailableOption.label.toLowerCase();
                    });

                $scope.advancedSearch.handleSubmit(scope, oQuestion, oOption);
            },
            autoCompleteResponse: [],
            typeAheadConfig: {
                source: function () {
                    $scope.keyWordSearch.enterKeyHit = false;
                    var aMatches = [];
                    _.each($scope.keyWordSearch.autoCompleteResponse, function (sHit) {
                        aMatches = $.matchWordOrPhrase(sHit, $scope.keyWordSearch.text);
                        if (aMatches)
                            return false;//break out of loop at first start word or phrase match
                    });
                    return aMatches;
                }
            },
            submit: function () {
                $scope.keyWordSearch.enterKeyHit = true;//This flag is used for stoping source binding for auto list, when immediately pressing enter with sometext on textbox.
                $scope.keyWordSearch.submitAfterSelection = true;
            }
        },
        advancedSearch: {
            searchButton: true,
            autocompleteConfig: {
                source: function (request, response) {
                    var scope = angular.element(this.element).scope(),
                        oQuestion = angular.nearestScopeVal("question", scope);
                    var selectedOptions = "";
                    if (oQuestion.ParentQuestionId != 0) {
                        var parentQuestion;
                        var parentQuestion = _.find(that.powerSearchQuestions, { 'QId': _.parseInt(oQuestion.ParentQuestionId) });
                        if (parentQuestion != null) {
                            selectedOptions = _.pluck(parentQuestion.selectedOptions, "data");
                            selectedOptions = selectedOptions.join(',');
                        }
                    }
                    autocompleterequest = {
                        partnerId: $("#partnerId").val(),
                        siteId: $("#siteId").val(),
                        questionId: String(oQuestion.QId),
                        searchString: request.term,
                        parentQuestionId: oQuestion.ParentQuestionId,
                        parentQuestionCodes: selectedOptions
                    };
                    if (oQuestion.selectedOptions != null) {
                        autocompleterequest.selectedQuestionCodes = _.pluck(oQuestion.selectedOptions, "data").join("#@#");
                    } else {
                        autocompleterequest.selectedQuestionCodes = null;
                    }

                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/PowerSearchAutoComplete",
                        data: autocompleterequest,
                        success: function (oData) {
                            oQuestion.oAvailableOptions = oData;
                            if (oQuestion.QId == "0" && $scope.dynamicStrings.Option_All.toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                                oData.Options["11111111"] = $scope.dynamicStrings.Option_All;
                            }
                            var aData = $.map(oData.Options, function (val, id) {
                                return {
                                    data: id,
                                    label: val,
                                    value: val
                                };
                            });

                            oQuestion.aAvailableOptions = aData;
                            if ($scope.advancedSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                $scope.advancedSearch.typeAheadConfig.typeAheadCallBack();
                            response(aData);
                        }
                    });
                },
                select: function (event, ui) {
                    var elem = angular.element(this);
                    var scope = elem.scope().$parent;
                    scope.oInput.text = ui.item.value;
                    $scope.advancedSearch.submit(event, scope, elem);
                },
                minLength: 1
            },
            typeAheadConfig: {
                source: function (scope, $el) {
                    var oQuestion = angular.nearestScopeVal("question", scope),
                        aMatches = [];

                    _.each(oQuestion.aAvailableOptions, function (sHit) {
                        aMatches = $.matchWordOrPhrase(sHit.label, scope.oInput.text);
                        if (aMatches)
                            return false;//break out of loop at first start word or phrase match
                    });
                    return aMatches;
                }
            },
            addButtonClickHandler: function (scope, oQuestion) {
                //implementation assumes that the autocomplete has fetched relevant results
                //TODO: add a failsafe in autocomplete results return to prevent timing glitches
                var sText = angular.nearestScopeVal("oInput.text", scope),
                    // rxTester = new RegExp(sText.replace("(", "\\(").replace(")", "\\)"), "gi"),
                    oOption = _.find(oQuestion.aAvailableOptions, function (oAvailableOption) {
                        // return rxTester.test("/^(" + oAvailableOption.label + ")$/gi");
                        return sText.toLowerCase() == oAvailableOption.label.toLowerCase();
                    });

                $scope.advancedSearch.handleSubmit(scope, oQuestion, oOption);
            },
            submit: function (i, scope, $el) {
                //really just an enter key handler in this case
                var oQuestion = angular.nearestScopeVal("question", scope);

                $scope.advancedSearch.addButtonClickHandler(scope, oQuestion);
            },
            handleSubmit: function (scope, oQuestion, oOption) {
                if (oOption) {
                    oQuestion.selectedOptions = oQuestion.selectedOptions || [];
                    if (!_.some(oQuestion.selectedOptions, { data: oOption.data })) {
                        oQuestion.selectedOptions.push(oOption);
                        angular.nearestScopeVal("oInput", scope).text = "";
                        $scope.$root.utils.cleanUpAutocompletes();
                        $timeout(function () { $scope.$apply() });
                    }
                }
            }
        },

        locationSearch: {
            hidden: response.ClientSettings.HideLocationSearchBox.toLowerCase() == "yes",
            text: preLoadSmartSearchResponse.Location == undefined ? "" : preLoadSmartSearchResponse.Location,
            prompt: response.ClientSettings.LocationSearchText,
            labelText: $scope.dynamicStrings.Label_LocationSearchBox,
            submitAfterSelection: false,
            searchButton: true,
            enterKeyHit: false,  //To handle immediate enter key hit.
            autocompleteConfig: {
                source: function (request, response) {
                    var //matcher = new RegExp("(" + $.ui.autocomplete.escapeRegex(request.term) + ")", "gi"),
                        autocompleterequest = {
                            partnerId: $("#partnerId").val(),
                            siteId: $("#siteId").val()
                        };

                    if (bMapProvider) {
                        autocompleterequest.location = request.term;
                        autocompleterequest.mapProvider = that.tgSettings.MapsProviderforProximitysearch;
                        autocompleterequest.languageISOLetter = that.tgSettings.LanguageISOLetter;
                        that.latitude = 0;
                        that.longitude = 0;
                        $.ajax({
                            type: "POST",
                            url: "/TgNewUI/Search/Ajax/ProximityLocationAutoComplete",
                            data: autocompleterequest,
                            success: function (oRawData) {
                                if (!$scope.locationSearch.enterKeyHit && oRawData) {
                                    data = _.sort(_.map(oRawData.Options, function (item) {
                                        return {
                                            data: item,
                                            label: item.LocationName,
                                            value: item.LocationName
                                        }
                                    }), "label").slice(0, 10);
                                    $scope.locationSearch.autoCompleteResponse = _.pluck(data, "label");
                                    if ($scope.locationSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                        $scope.locationSearch.typeAheadConfig.typeAheadCallBack();
                                    response(data);
                                } else {
                                    response(null);
                                    if ($scope.locationSearch.enterKeyHit) {
                                        $scope.utils.cleanUpAutocompletes();
                                    }
                                    $scope.locationSearch.enterKeyHit = false;
                                }
                            }
                        });

                    } else {
                        autocompleterequest.searchString = request.term;
                        autocompleterequest.searchFields = that.locationFields;
                        $.ajax({
                            type: "POST",
                            url: "/TgNewUI/Search/Ajax/LocationAutoComplete",
                            data: autocompleterequest,
                            success: function (oRawData) {
                                if (!$scope.locationSearch.enterKeyHit && oRawData) {
                                    data = _.sort(_.pluck(oRawData.Options, "LocationName")).slice(0, 10);
                                    data = _.map(data, function (job) {
                                        job = job.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
                                        return job;
                                    });
                                    $scope.locationSearch.autoCompleteResponse = data;
                                    if ($scope.locationSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                        $scope.locationSearch.typeAheadConfig.typeAheadCallBack();
                                    response(data);
                                } else {
                                    response(null);
                                    if ($scope.locationSearch.enterKeyHit) {
                                        $scope.utils.cleanUpAutocompletes();
                                    }
                                    $scope.locationSearch.enterKeyHit = false;
                                }
                            }
                        });
                    }
                },
                select: function (event, ui) {
                    /*
                    * The select event firing two times,
                     * 1. when option is going to be selected.
                     * 2. After selection when list box is going to be closed.
                    */
                    if (!ui.item.value && $scope.bPowerSearchVisible) {
                        $scope.locationSearch.text = $scope.powerSearchLocationSearch.text;
                    } else {
                        if (bMapProvider && ui.item.data) {
                            that.latitude = ui.item.data.Latitude;
                            that.longitude = ui.item.data.Longitude;
                        }
                        if ($scope.locationSearch.enterKeyHit && ui.item.value != "" && ui.item.value != event.target.value) {
                            $scope.locationSearch.text = event.target.value;
                        } else if (ui.item.value && ui.item.value != "") {
                            $scope.locationSearch.text = ui.item.value;
                        } else if (event.target.value != "") {
                            $scope.locationSearch.text = event.target.value
                        } else {
                            $scope.locationSearch.text = $(event.toElement).text();
                        }
                        $scope.powerSearchLocationSearch.text = $scope.locationSearch.text;
                    }
                    $scope.$apply();

                    //Handled enter and tab key for selecting the item from the list.
                    if (event.originalEvent && (
                            (event.originalEvent.originalEvent && event.originalEvent.originalEvent.keyCode == $.keyCodes.tab) ||
                            (event.originalEvent.target.type == "" && event.originalEvent.keyCode == $.keyCodes.enter) ||
                            (event.originalEvent.type == "menuselect")
                        )
                    ) {
                        $scope.locationSearch.submitAfterSelection = false;
                        return;
                    } else if ($scope.locationSearch.submitAfterSelection) {
                        //Fetching job matched results for enter key press on textbox.
                        $scope.locationSearch.submitAfterSelection = false;
                        $scope.utils.cleanUpAutocompletes();
                        if ($scope.workFlow == "powerSearch") {
                            $(".powerSearchContainer").find("button.ladda-button").trigger("click");
                        } else {
                            $(".searchBoxContainer").find("button.ladda-button").trigger("click");
                        }
                    } else {
                        $scope.utils.cleanUpAutocompletes();
                    }
                },
                minLength: 1,
                freeFormSelect: true
            },
            autoCompleteResponse: [],
            typeAheadConfig: {
                source: function () {
                    $scope.locationSearch.enterKeyHit = false;
                    var aMatches = "";
                    _.each($scope.locationSearch.autoCompleteResponse, function (sHit) {
                        aMatches = $.matchWordOrPhrase(sHit, $scope.locationSearch.text);
                        if (aMatches)
                            return false;//break out of loop at first start word or phrase match
                    });
                    return aMatches;
                }
            },
            submit: function () {
                $scope.locationSearch.enterKeyHit = true;//This flag is used for stoping source binding for auto list, when immediately pressing enter with sometext on textbox. 
                $scope.locationSearch.submitAfterSelection = true;
            }
        },

        postingDate: {
            datepickerConfig: {
                showOn: "button",
                buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                dateFormat: "m/d/yy",
                maxDate: 0,
                localeCode: response.ClientSettings.LocaleCode,
                shortMonthNames: $("#shortMonthNames").val(),
                onSelect: function (sDateText, oDatepicker) {
                    var selectedDate = oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay;
                    var scope = angular.element(this).scope(),
                        oQuestion = angular.nearestScopeVal("question", scope);

                    if (sDateText === "")//clear icon clicked
                        selectedDate = "";

                    oQuestion.Value = selectedDate;
                }
            }
        },

        candStackingDate: {
            datepickerConfig: {
                showOn: "button",
                buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                dateFormat: "yy-m-d",
                maxDate: 0,
                localeCode: response.ClientSettings.LocaleCode,
                shortMonthNames: $("#shortMonthNames").val(),
                onSelect: function (sDateText, oDatepicker) {
                    var selectedDate = oDatepicker.selectedYear + "-" + (oDatepicker.selectedMonth + 1) + "-" + oDatepicker.selectedDay;
                    if (sDateText === "")//clear icon clicked
                        selectedDate = "";

                    $scope.ProfileCandStackField = selectedDate;
                }
            }
        },

        dateRange: {
            datepickerConfig1: {
                datepickerConfig: {
                    showOn: "button",
                    buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                    dateFormat: "m/d/yy",
                    maxDate: 0,
                    localeCode: response.ClientSettings.LocaleCode,
                    shortMonthNames: $("#shortMonthNames").val(),
                    onSelect: function (sDateText, oDatepicker) {
                        var selectedDate = sDateText ? oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay : "",
                            scope = angular.element(this).scope(),
                            oQuestion = angular.nearestScopeVal("question", scope),
                            aValue = oQuestion.Value ? oQuestion.Value.split(",") : ["", ""];

                        aValue[0] = selectedDate;
                        if (!aValue[0] && !aValue[1])
                            oQuestion.Value = null;
                        else {
                            oQuestion.Value = aValue.join(",");
                            oQuestion.rangeValid = 1;
                        }
                    }
                }
            },
            datepickerConfig2: {
                datepickerConfig: {
                    showOn: "button",
                    buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                    dateFormat: "m/d/yy",
                    maxDate: 0,
                    localeCode: response.ClientSettings.LocaleCode,
                    shortMonthNames: $("#shortMonthNames").val(),
                    onSelect: function (sDateText, oDatepicker) {
                        var selectedDate = sDateText ? oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay : "",
                            scope = angular.element(this).scope(),
                            oQuestion = angular.nearestScopeVal("question", scope),
                            aValue = oQuestion.Value ? oQuestion.Value.split(",") : ["", ""];


                        aValue[1] = selectedDate;
                        if (!aValue[0] && !aValue[1])
                            oQuestion.Value = null;
                        else {
                            oQuestion.Value = aValue.join(",");
                            oQuestion.rangeValid = 1;
                        }
                    }
                }
            }
        },

        sortby: 0,

        jobsHeading: "",

        jobApplyUrl: "",

        completedSearchText: "",

        bInitialLoad: true,

        bSearchResults: false,

        bSidebarShown: false,

        bSidebarOverlay: false,

        bSidebarVisible: false,

        bJobDetailsShown: false,

        bSelectedGroup: false,

        bEditProfile: false,

        bJobCart: false,

        SavedSearchesMetaData: {},

        bFileManager: false,

        bJobRemovalStatus: false,

        bJobSaved: false,

        bGQLaunchedFromJobCart: false,

        bShowRemovedJobAlert: false,

        bShowExpiredJobAlert: false,

        bJobCartLaunchedFromHome: false,

        bJobCartLaunchedFromSearchResults: false,

        bJobCartLaunchedFromJobDetails: false,

        jobsCache: null,

        savedJobsCache: null,

        expiredJobs: null,

        JobsAddedToCart: null,

        JobsAlreadyPresentInCart: null,

        bJobsSavedExceeded: false,

        bNotAppliedJobsInJobCart: false,

        bAppliedJobsInJobCart: false,

        bCandidateZone: false,

        bStandAloneAssessView: false,

        isApplyflowLogin: true,

        bSignInView: false,

        showInFullView: false,

        bJobDetailsAPIError: false,

        bRefreshSession: false,

        SaveSearchCriteria: false,

        CollapsedAppliedApplications: false,

        CollapsedUnfinishedApplications: false,

        ActiveReferrals: false,

        SentReferrals: false,

        ProfileDetails: response != null ? response.BasicProfileDetails : {},

        CandidateZoneData: null,

        bFromTalentSuite: $("#talentSuiteJobMenu").attr("value") ? true : false,

        bLoggedIn: response.ClientSettings.LoggedIn == "true" ? true : false,

        bSearchAgentEnabled: response.ClientSettings.DisableAgents.toLowerCase() == "no",

        bHideBackButtonInJobDetails: $("#hideBackButtonOnly").val() == "1" ? true : false,

        bShowBackButton: $("#noback").val() == "0" ? false : true,

        userMarkupFields: ['jobdescription'],

        SIDValue: $("#SIDValue").val(),

        renderedFields: ["jobtitle", "addedon", "jobdescription"],

        jobFieldsToDisplay: response.JobFieldsToDisplay,

        bJobDescriptions: response.JobFieldsToDisplay ? !!response.JobFieldsToDisplay.Summary : false,

        jobs: response.searchResultsResponse ? response.searchResultsResponse.Jobs.Job : (response.HotJobs ? response.HotJobs.Job : null),

        featuredJobs: response.searchResultsResponse ? response.searchResultsResponse.Jobs.Job : (response.HotJobs ? response.HotJobs.Job : null),

        totalCount: response.TotalCount,

        tgSettings: response.ClientSettings,

        isGTG: response.IsGTG,

        jobCounterIntroText: response.TotalCount ? response.ClientSettings.JobCounterIntroText.replace("[#jobcount#]", response.TotalCount) : response.ClientSettings.JobCounterIntroText.replace("[#jobcount#]", 0),

        refineResultsText: response.ClientSettings.RefineResultsText,

        searchResultsText: response.ClientSettings.SearchResultsText,

        filtersAppliedText: response.ClientSettings.FiltersAppliedText,

        selectedJobValues: { "selectedJobs": "" },

        hitCount: 0,

        jobsCount: 0,

        latitude: 0,

        longitude: 0,

        geoLocationLatitude: 0,

        geoLocationLongitude: 0,

        bShowMoreButton: false,

        toggleCheckBoxes: true,

        SelectedJobsChecked: false,

        SelectJobs: response.ClientSettings.SelectJobsText,

        keywordFields: response.KeywordCustomSolrFields || preLoadSmartSearchResponse.KeywordCustomSolrFields,

        locationFields: response.LocationCustomSolrFields || preLoadSmartSearchResponse.LocationCustomSolrFields,

        hideAdvancedSearch: (response.ClientSettings.HideAdvancedSearch.toLowerCase() == "yes") ? true : false,

        sortFields: "",

        pageNumber: 1,

        sendToFriendButtonText: (response.ClientSettings.SearchResultsSendToFriendButtonText != "") ? response.ClientSettings.SearchResultsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend,

        welcomeTitle: response.ClientSettings.LoggedIn == "true" ? response.ClientSettings.LandingLoggedWelcomePageTitle : response.ClientSettings.LandingNonLoggedWelcomePageTitle,

        nonLoggedInWelcomeTitle: response.ClientSettings.LandingNonLoggedWelcomePageTitle,

        welcomeText: response.ClientSettings.LoggedIn == "true" ? response.ClientSettings.LandingLoggedWelcomeText : response.ClientSettings.CandLandPageText,

        bWelcome: (response.ClientSettings.LandingNonLoggedWelcomePageTitle != undefined || response.ClientSettings.CandLandPageText != undefined) ? true : false,

        regexEquation: (response.ClientSettings.LoginType == 0) ? /^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ!#$%&'\/*\/+-\/\/\/=\/?\/^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/ : /^[\u0021-\u003b=\u003f-\u007e\u009f-\uffff\s]+$/,

        regexUsernameEqn: /^[\u0021-\u003b=\u003f-\u007e\u009f-\uffff\s]+$/,

        regexPhonenumberEqn: /^((\d|-|\.){5,})$/,

        regexNoHtml: /^(?!.*<.*>)/,

        regexNameEqn: /[^0-9\[\]!#\$%&\*\+/:; _<=>\?@\\\\-\^\{\|\}~]+$/,
        ///^[a-zA-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ ,.'-]+$/,  

        regexUserEmailEqn: /^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ!#$%&'\/*\/+-\/\/\/=\/?\/^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/,

        regexSSN: /^\d\d\d-\d\d-\d\d\d\d$/,

        facets: response.Facets ? _.each(response.Facets.Facet, function (facet) {
            _.each(facet.Options, function (opt) {
                opt.Selected = false;
            });
        }) : null,

        previousHashes: [],

        facetOptionLimit: 4,

        powerSearchQuestions: [],

        oldPowerSearchQuestions: [],

        bPowerSearchVisible: false,
        preloadPowerSearch: false,

        filterAppliedCount: 0,

        enableSocialReferral: response.ClientSettings.EnableSocialReferral.toLowerCase() == "yes" ? true : false,

        enableSendToFriend: response.ClientSettings.SendToFriend.toLowerCase() == "yes" ? true : false,

        enableApplyToJobs: response.ClientSettings.Responsive && response.ClientSettings.Responsive.toLowerCase() == "true" ? false : true,

        LoginBoxUsername: response.ClientSettings.LoginType == "0" ? $scope.dynamicStrings.EmailAddress : $scope.dynamicStrings.Username,

        disableJobCart: response.ClientSettings.DisableJobCart.toLowerCase() == "yes" ? true : false,

        isNonProfileAllowed: typeof (response.ClientSettings.IsNonProfileAllowed) != "undefined" ? response.ClientSettings.IsNonProfileAllowed.toLowerCase() == "true" : false,

        standAloneGQ: typeof (response.ClientSettings.StandAloneGQ) != "undefined" ? _.parseInt(response.ClientSettings.StandAloneGQ) > 0 ? _.parseInt(response.ClientSettings.StandAloneGQ) : 0 : 0,

        EnableResponsiveCandidatePortal: typeof (response.ClientSettings.EnableResponsiveCandidatePortal) != "undefined" ? response.ClientSettings.EnableResponsiveCandidatePortal.toLowerCase() == "yes" : false,

        AnonymousLoginType: "",

        maxConReqSubmission: response.ClientSettings.MaxConReqSubmission == "" ? 10 : parseInt(response.ClientSettings.MaxConReqSubmission),

        SocialReferral_READY: response.ClientSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no",

        SocialReferral_FirstName: encodeURIComponent(response.ClientSettings.SocialReferral_FirstName),

        SocialReferral_LastName: encodeURIComponent(response.ClientSettings.SocialReferral_LastName),

        SocialReferral_SiteId: $("#siteId").val(),

        SocialReferral_LocaleId: response.ClientSettings.DefLocaleId,

        SocialReferral_ProfileId: response.ClientSettings.profileId,

        jobIds: "",

        jobRestrictedJobSelected: false,

        SelectedJobsChecked: false,

        scrollStart: true,

        timeOut: "",

        featuredOrLatestJobsAjax: null,

        keywordTextTemp: "",

        locationTextTemp: "",

        encryptedBruid: (response.EncryptedBruid) ? response.EncryptedBruid : "",

        hashCode: (response.HashCode) ? response.HashCode : "",

        messageDetail: null,

        ///Job Details section added

        jobDetailsFieldsToDisplay: "",
        jobDetailFields: "",
        isHotJob: false,
        enableJobDetailsSendToFriend: false,
        enablePostToMySocialNetwork: false,
        jobDetailsUrlForSocialMedia: "",
        jobIds: "",
        jobDetailsButtonText: "",
        searchResultsURL: "",
        fileStatus: 0,
        profileImportStatus: 0,
        noSwitchSiteWarning: false,

        createAccount:
        {
            bSocialNetwork: false,
            login: {
                userName: '',
                password: '',
                confirmPassword: '',
            },
            securityQuestion:
            {
                value1: '',
                value2: '',
                value3: '',
                answer1: '',
                answer2: '',
                answer3: '',
                errorValue1: false,
                errorValue2: false,
                errorValue3: false,
                errorAnswer1: false,
                errorAnswer2: false,
                errorAnswer3: false
            },
            errormsgs: [],
            displayPasswordErrorBox: false,
            displayRePasswordErrorBox: false,
            passwordTooltipVisible: false,
            reenterPassowrdTooltipVisible: false,
            userNameError: false,
            passwordError: false,
            mainError: '',
            submitted: false,
            CAsubmitted1: false,
            CAsubmitted2: false,
            CAsubmitted3: false,

            //noOfSecurityQuestions: response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : response.ClientSettings.TGSecurityQuestionOverride,
            noOfSecurityQuestions: (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride,
            showForgotPasswordLink: false
        },


        resetcreatAccount: function ($scope) {

            $scope.createAccount.login.userName = '';
            $scope.createAccount.login.password = '';
            $scope.createAccount.login.confirmPassword = '';
            $scope.createAccount.securityQuestion.value1 = '';
            $scope.createAccount.securityQuestion.value2 = '';
            $scope.createAccount.securityQuestion.value3 = '';
            $scope.createAccount.securityQuestion.answer1 = '';
            $scope.createAccount.securityQuestion.answer2 = '';
            $scope.createAccount.securityQuestion.answer3 = '';
            $scope.createAccount.securityQuestion.errorValue1 = false;
            $scope.createAccount.securityQuestion.errorValue2 = false;
            $scope.createAccount.securityQuestion.errorValue3 = false;
            $scope.createAccount.securityQuestion.errorAnswer1 = false;
            $scope.createAccount.securityQuestion.errorAnswer2 = false;
            $scope.createAccount.securityQuestion.errorAnswer3 = false;
            $scope.createAccount.errormsgs = [];
            $scope.createAccount.displayPasswordErrorBox = false;
            $scope.createAccount.displayRePasswordErrorBox = false;
            $scope.createAccount.passwordTooltipVisible = false;
            $scope.createAccount.reenterPassowrdTooltipVisible = false;
            $scope.createAccount.userNameError = false;
            $scope.createAccount.passwordError = false;
            $scope.createAccount.mainError = '';
            $scope.createAccount.submitted = false;
            $scope.createAccount.noOfSecurityQuestions = (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride;
            $scope.createAccount.showForgotPasswordLink = false;
            setTimeout(function () { $scope.$apply(); }, 0);
            setTimeout(function () {
                $("#CreateAccnttitle").focus();
            }, 0);

        },

        bcreateAccount: false,
        securityQuestionsArray: _.values(JSON.parse(securityQuestions.value || "{}")) || [],
        //End of JobDetails fileds

        updateAccount:
        {
            login: {
                userName: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            },
            errormsgs: [],
            displayPasswordErrorBox: false,
            displayRePasswordErrorBox: false,
            mainError: '',
            updated: '',
            submitted: false,
            LIOption: 1,
            FBOption: 1,
            LINewOption: 1,
            FBNewOption: 1,
            LIConnect: false,
            FBConnect: false,
            TWConnect: false,
            SMUpdateStatus: 0,
            SMUpdateError: ''
        },

        autocompleteConfig: {
            aData: [],
            sId: "autocompleteMenu",
            fnItemClickHandler: function (event, scope) {
                //that.searchText = scope.oItem;
                scope.searchText = scope.oItem;
                setTimeout(function () { scope.$apply(); }, 0);
            }
        },

        handlers: {

            trapHeaderLinkFocus: function (scope, bVisible, e) {
                if (scope.mobileScreen) {

                    var $headerLinkContainer = scope.elements.headerLinkContainer;

                    if (bVisible) {
                        $headerLinkContainer.css("visibility", "visible");
                        scope.elements.headerLinkContainer.trapFocus().keydown(toggle);
                    } else {
                        off();
                    }

                    function toggle(e) {
                        if (e.keyCode == $.keyCodes.escape) {
                            scope.elements.threeLineIcon.click();
                        } else {
                            return true;
                        }
                    }

                    function off() {
                        scope.elements.headerLinkContainer.off("keydown");
                        scope.elements.threeLineIcon.focus();//note that this automatically untraps focus
                        setTimeout(function () {
                            //use css visibility property to get header links out of the tab order when offscreen    
                            if (appScope.$root.uiBooleans['bPhoneViewLinksVisible'] == false) {
                                $headerLinkContainer.css("visibility", "hidden");
                            }
                        }, 800)//a rare case where a numeric timeout is OK since all we care about is that animation is complete
                    }
                }
            },

            more: function (scope, Q, $p) {
                var h;
                var linkTitle = $p.parents('.job').find('.jobtitle').html();
                $p.html(scope.$root.utils.fullMarkup(Q, linkTitle));
                $p.find('*').removeAttr('style');
                var curWindowHeight = $(window).height();
                var winCenter = 0;
                winCenter = $p.offset().top - Math.ceil(curWindowHeight / 2);
                _.delay(function () {
                    h = $p.height();
                    $p.css({ top: -24, height: 48 }).animate({ top: 0, height: h }).setFocus();
                    //To make the current job view at center of the screen.
                    $('html, body').stop().animate({ scrollTop: winCenter }, 300);
                });
            },

            less: function (scope, Q, $p) {
                $p.animate({ height: 48, top: -24 }, 400, function () {
                    $p.html(scope.$root.utils.truncatedMarkup(Q));
                    $p.find('*').removeAttr('style');
                    scope.$root.utils.moreLink(scope, $p);
                    scope.$apply();
                    $p.css({ height: "auto", top: 0 });
                }).setFocus().find(".less").css({ visibility: "hidden" });

            },


            jobClick: function (event, scope) {
                var Q = scope.oQ,
                    $target = $(event.target),
                    $p = $target.closest("p");

                if ($scope.bSearchResults && event.ctrlKey && !($target.parent().hasClass("more") || $target.hasClass("less"))) {
                    var win = window.open($target.closest(".jobtitle")[0].href, '_blank');
                    win.focus();
                }
                else {
                    //To hanlde #tag while accessing more/less job description view.
                    var descViewAccessed = false;

                    if ($target.parent().hasClass("more")) {
                        scope.handlers.more(scope, Q, $p);
                        descViewAccessed = true;
                    }

                    if ($target.hasClass("less")) {
                        scope.handlers.less(scope, Q, $p);
                        descViewAccessed = true;
                    }

                    if (descViewAccessed == true) {
                        event.preventDefault();
                        descViewAccessed = false;
                    }

                    if ($target.closest(".jobtitle").length || $target.closest(".noJobDescriptions .job").length || window.innerWidth <= 480 || window.screen.width <= 480) {
                        $scope.SelectJobs = $scope.tgSettings.SelectJobsText;
                        if (!$scope.bJobCart) {
                            $scope.toggleCheckBoxes = true;
                            $scope.SelectedJobsChecked = false;
                            _.each($scope.jobs, function (job) {
                                job.Selected = false;
                            });
                            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                                $scope.utils.updateHistory($scope.$location.hash());
                        }
                        scope.handlers.jobTitle(scope);
                    }
                }
            },

            jobTitle: function (scope, launchJobDetailsOnLoad) {

                if ($scope.workFlow == "searchResults" && $scope.bSearchResults && typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
                    _.each($scope.oHistory, function (oPriorScope, sName) {
                        if (sName.indexOf('keyWordSearch') != -1) {
                            $scope.oHistory[sName].ActiveElementInSearchResults = document.activeElement.id;
                            $scope.oHistory[sName].searchResultsScrollTopPosition = $(window).scrollTop() - $("#" + document.activeElement.id).offset().top;
                        }
                    });

                $scope.ShowJobAlert = true;
                $scope.bJobSaved = false;
                $scope.bJobDetailsAPIError = false;
                //scope.saveSearchCriteria();
                //window.location = "../home/JobDetails?partnerId=" + $("#partnerId").val() + "&siteId=" + $("#siteId").val() + 
                //"&JobId=" + scope.job.Questions[0].Value + "&JobSiteId=" + _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value").toString() + "&configMode=" + $("#configMode").val() //, "JobDetails", 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                var url = '/TgNewUI/Search/Ajax/JobDetails',
                    jobDetailsRequest = {};
                var jobId;
                var jobSiteId;
                if (typeof launchJobDetailsOnLoad != "undefined" && launchJobDetailsOnLoad) {
                    $scope.bHideBackButtonInJobDetails = true;
                    var jobdetailsInfo = $scope.JobDetailsHash.split('=')[1];
                    jobId = jobdetailsInfo.split('_')[0];
                    if (typeof (jobId) == 'undefined' || isNaN(jobId)) {
                        jobId = _.pluck(_.where($scope.jobDetailFields.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString();
                    }
                    jobSiteId = jobdetailsInfo.split('_')[1];
                    if (typeof (jobSiteId) == 'undefined' || isNaN(jobSiteId)) {
                        jobSiteId = $scope.jobDetailFields.JobSiteId;
                    }
                }
                else {
                    $scope.bHideBackButtonInJobDetails = false;
                    jobId = scope.job.Questions[0].Value;
                    jobSiteId = _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value").toString();
                }

                if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone && jobSiteId != $("#siteId").val()) {
                    if (!$scope.noSwitchSiteWarning) {
                        ngDialog.openConfirm({
                            template: 'SwitchSiteWarningTemplate', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                        }).then(function (value) {
                            if (value) {
                                //update this selection on candidate profile
                                var updateWarningRequest = {};
                                updateWarningRequest.partnerId = $("#partnerId").val();
                                updateWarningRequest.siteId = $("#siteId").val();
                                updateWarningRequest.sessionID = $("#CookieValue").val(),
                                $.ajax({
                                    success: function (data, status, jqxhr) {
                                        $scope.noSwitchSiteWarning = true;
                                    },
                                    error: function (jqxhr, status, error) {
                                    },
                                    url: '/TgNewUI/CandidateZone/Ajax/DisableSiteSiwtchWarning',
                                    data: updateWarningRequest,
                                    type: 'POST'
                                });
                            }
                            $scope.switchSite(jobSiteId, "savedJobs");
                            window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + jobSiteId + "&jobid=" + jobId + "&PageType=jobdetails";
                        }, function (value) {
                            if (angular.isDefined(scope.oActiveLaddaButton))
                                scope.oActiveLaddaButton.stop();
                        });
                    } else {
                        $scope.switchSite(jobSiteId, "savedJobs");
                        window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + jobSiteId + "&jobid=" + jobId + "&PageType=jobdetails";
                    }
                    return;
                }

                jobDetailsRequest.partnerId = $("#partnerId").val();
                jobDetailsRequest.siteId = $("#siteId").val();
                jobDetailsRequest.jobid = jobId;
                jobDetailsRequest.configMode = $("#configMode").val();
                jobDetailsRequest.jobSiteId = jobSiteId;

                $scope.jobDetailsJobShown = jobDetailsRequest.jobid + "_" + jobSiteId;

                $http.post(url, jobDetailsRequest).success(function (data, status, headers, config, bFromHistory) {
                    $scope.LimitExceededMessage = data.ServiceResponse.LimitExceededMessage;
                    $scope.ApplyDifference = data.ServiceResponse.ApplyDiff;
                    $scope.AllowReApply = data.ServiceResponse.ApplyStatus != null ? data.ServiceResponse.ApplyStatus.AllowReApply : true;
                    $scope.Applied = data.ServiceResponse.ApplyStatus != null ? data.ServiceResponse.ApplyStatus.Applied : false;
                    $scope.jobDetailsFieldsToDisplay = data.ServiceResponse.JobFieldsToDisplay,
                    $scope.encryptedBruid = data.ServiceResponse.EncryptedBruid,
                    $scope.hashCode = data.ServiceResponse.HashCode,
                    $scope.jobDetailFields = data.ServiceResponse.Jobdetails;
                    if ($scope.jobDetailFields != null) {
                        $scope.isHotJob = _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "hotjob" }), "AnswerValue").toString().toLowerCase() == "yes",
                        $scope.enableJobDetailsSendToFriend = $scope.tgSettings.SendToFriend.toLowerCase() == "yes" ? true : false,
                        $scope.enablePostToMySocialNetwork = $scope.tgSettings.EnablePostToMySocialNetworkLink.toLowerCase() == "yes" && $scope.tgSettings.SocialMedia != "" ? true : false,
                        $scope.jobDetailsUrlForSocialMedia = $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + jobSiteId + "&gqid=" + _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString(),
                        $scope.jobDetailsButtonText = $scope.tgSettings.JobDetailsSendToFriendButtonText != "" ? $scope.tgSettings.JobDetailsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend;
                    }
                    $scope.searchResultsURL = "";
                    that.bSidebarVisible = false;
                    that.bInitialLoad = false;
                    that.bJobDetailsShown = true;
                    $scope.jobSiteInfo = jobId + '_' + jobSiteId;
                    $scope.bJobSaved = false;
                    if ($scope.jobDetailFields != null) {
                        $scope.JobDetailQuestionsSocialShare = data.ServiceResponse.Jobdetails.JobDetailQuestions;
                    }
                    $("#title").nextUntil('meta[name=lcGlobalBaseUrl]', 'meta').remove();
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                    var metaTag = $scope.tgSettings.JobDetailsMetaTagText.replace(/#ClientName#/g, $scope.tgSettings.PartnerName);
                    var jobdesc = "";
                    var jobtitl = "";
                    if (data.ServiceResponse.Jobdetails != null) {
                        jobdesc = _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "jobdescription" }), "AnswerValue").toString();
                        jobdesc = jobdesc.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                        if (jobdesc.length > 50) {
                            jobdesc = jobdesc.substring(0, 50);
                        }
                        jobtitl = data.ServiceResponse.Jobdetails.Title.toString();
                        jobtitl = jobtitl.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                        if (jobtitl.length > 50) {
                            jobtitl = jobtitl.substring(0, 50);
                        }
                    }
                    metaTag = metaTag.replace("#JobDescription#", jobdesc);
                    $("#title").after(metaTag.replace("#JobTitle#", jobtitl));

                    if (data.ServiceResponse.Jobdetails != null && data.ServiceResponse.googlejobsMappingfielddataJson != null) {
                        $("#title").after(data.ServiceResponse.googlejobsMappingfielddataJson);
                    }

                    //if ($scope.tgSettings.ShowSocMediaButtonsOnJobDetailsPage == 'yes') {
                    //  $scope.handlers.JobdetailSocialShare();
                    //}
                    if (launchJobDetailsOnLoad) {
                        setTimeout(function () {
                            $scope.bInitialPageLoad = false;
                            $scope.$apply();
                            $(".MainContent").show();
                            $scope.setTitle("jobDetails");
                        }, 10);
                    }
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                    setTimeout(function () {
                        $scope.setHash(bFromHistory, arguments, this);
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                        $scope.utils.updateHistory($scope.$location.hash());
                    }, 10);
                }).error(function (data, status, headers, config) {
                    console.log("failed with status of " + status);
                });

                $scope.loadwebtrackerscript("/TGNewUI/JobDetails", $scope.customScriptRendering.Search);
            },
            JobdetailSocialShare: function () {
                if ($scope.tgSettings.ShowSocMediaButtonsOnJobDetailsPage == 'yes') {
                    if ($scope.tgSettings.SocialMedia.indexOf('1') > -1) {
                        if (typeof (IN) != 'undefined') {
                            $('.linkedin').html("<script type='IN/Share' data-counter='right' data-url='" + $scope.jobDetailsUrlForSocialMedia + "'></script>");
                            IN.parse();
                        } else {
                            if ($("#pageURL").val().indexOf("https://") > -1) {
                                $.getScript('https://platform.linkedin.com/in.js', function () {
                                    $('.linkedin').html("<script type=IN/Share data-counter='right' data-url='" + $scope.jobDetailsUrlForSocialMedia + "'></script>");
                                });
                            }
                            else {
                                $.getScript('http://platform.linkedin.com/in.js', function () {
                                    $('.linkedin').html("<script type=IN/Share data-counter='right' data-url='" + $scope.jobDetailsUrlForSocialMedia + "'></script>");
                                });
                            }

                        }
                    }
                    if ($scope.tgSettings.SocialMedia.indexOf('2') > -1) {

                        if (typeof (FB) != 'undefined') {
                            $('.facebook').html("<fb:like href='" + $scope.jobDetailsUrlForSocialMedia + "' send='false' layout='button_count' show_faces='false' font=''></fb:like>");
                            FB.init({ status: true, cookie: true, xfbml: true, version: 'v2.8' });

                        } else {
                            if ($("#pageURL").val().indexOf("https://") > -1) {
                                $.getScript("https://connect.facebook.net/en_US/sdk.js", function () {
                                    $('.facebook').html("<fb:like href='" + $scope.jobDetailsUrlForSocialMedia + "' send='false' layout='button_count' show_faces='false' font=''></fb:like>");
                                    FB.init({ status: true, cookie: true, xfbml: true, version: 'v2.8' });
                                });
                            }
                            else {
                                $.getScript("http://connect.facebook.net/en_US/sdk.js", function () {
                                    $('.facebook').html("<fb:like href='" + $scope.jobDetailsUrlForSocialMedia + "' send='false' layout='button_count' show_faces='false' font=''></fb:like>");
                                    FB.init({ status: true, cookie: true, xfbml: true, version: 'v2.8' });
                                });
                            }
                        }
                    }
                    if ($scope.tgSettings.SocialMedia.indexOf('3') > -1) {
                        if (typeof (twttr) != 'undefined') {
                            $('.Twitter').html("<a href='https://twitter.com/share' class='twitter-share-button' data-url='" + $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.JobDetailQuestionsSocialShare, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail" + "' data-count='horizontal' data-lang='" + $scope.tgSettings.DefLocaleId + "'>Tweet</a>");
                            twttr.widgets.load();
                        } else {
                            $('.Twitter').html("<a href='https://twitter.com/share' class='twitter-share-button' data-url='" + $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.JobDetailQuestionsSocialShare, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail" + "' data-count='horizontal' data-lang='" + $scope.tgSettings.DefLocaleId + "'>Tweet</a><script type='text/javascript' src='https://platform.twitter.com/widgets.js'></script>");
                        }
                    }
                }
            },
            jobDetailsBackClick: function (scope) {
                // $scope.jobDetailFields = null;
                if (typeof previousHashes[previousHashes.length - 2] == "undefined") {
                    $scope.homeView();
                }
                else
                    history.back();
            },

            jobDetailsBackToSaveDrafts: function (scope) {
                document.location.href = "/tgwebhost/aip.aspx?sid=" + $("#SIDValue").val();
            },

            selectedCloseClickHandler: function (event, scope) {
                $(event.target).parent().deleteWithBounce(function () {
                    scope.op.Selected = false;
                    scope.$apply();
                    $scope.utils.updateHistory($scope.$location.hash());
                    scope.filterJobsByFacet(scope);
                })
            },

            selectedPowerSearchOptionCloseClickHandler: function (event, scope) {
                $(event.target).parent().deleteWithBounce(function () {
                    _.remove(angular.nearestScopeVal("question.selectedOptions", scope), scope.op);
                    scope.$apply();
                });
            },

            hideShowFacetOptions: function (event, scope) {
                $scope.bRenderFacetFilterAccordion = true;

                setTimeout(function () {
                    var $target = $(event.target),
                        $accordionContainer = $scope.elements.facetFilterAccordion,
                        bAccordion = !!($accordionContainer && $accordionContainer.length),
                         sId = $target.parent().attr('name'),
                        $facetWithOptions;

                    if (bAccordion) {

                        if (sId) {
                            //show only the options for the category selected
                            $accordionContainer.find(".facetFilterAccordionOptions #" + sId).show().siblings("li").hide();
                            if (sId == "bRenderPhoneViewSearch")
                                $scope[sId] = !$scope[sId];
                            else
                                $scope.oActiveFacet = scope.facet;
                        }

                        //erase any inline styles left over from slideToggle in toggleFilterFacetAccordion
                        $scope.elements.facetFilterAccordionOptions[0].style.display = "";

                        if (!$scope.bShowFacetAccordionOptions) {
                            $scope.bShowFacetAccordionOptions = true;
                            scope.$apply();
                        }
                        else {
                            //set the left style inline to trigger animation
                            //NOT bShowFacetAccordionOptions = true --> ng-class --> .showOptions class added
                            //that would hide the options immediately and mess up the animation
                            $accordionContainer.css("left", "0");

                            setTimeout(function () {
                                //wait until animation complete
                                //not as accurate as the currently poorly supported transition end event
                                //but we don't need much accuracy here -- just want to avoid swiping to hidden content
                                //please refer to qc defect 238620 LDP251: Mobile: Swipes are moving views between facet filters and filter options
                                //$accordionContainer.removeClass("showOptions");
                                $scope.bRenderPhoneViewSearch = false;
                                $scope.bShowFacetAccordionOptions = !$scope.bShowFacetAccordionOptions;
                                scope.$apply();
                                //erase the inline style
                                $scope.elements.facetFilterAccordion[0].style.left = "";
                            }, 650);

                        }
                        $scope.$apply();
                    } else {
                        //in sidebar
                    }
                }, 0)
            },

            toggleFilterFacetAccordion: function () {
                var $accordion = $scope.bShowFacetAccordionOptions ? $scope.elements.facetFilterAccordionOptions.add($scope.elements.facetFilterAccordionCategories) : $scope.elements.facetFilterAccordionCategories;

                $scope.$root.bRenderFacetFilterAccordion = true;
                $scope.$root.bShowFilterAccordion = !$scope.$root.bShowFilterAccordion;
                setTimeout(function () {//give the lazy loaded options container div time to render
                    $accordion.slideToggle(null, $scope.handlers.clipAccordionHeight);

                }, 0)
            },

            clipAccordionHeight: function () {
                var bClip, $accordion, y;

                if ($scope.bShowFilterAccordion) {
                    $accordion = $scope.bShowFacetAccordionOptions ? $scope.elements.facetFilterAccordionOptions : $scope.elements.facetFilterAccordionCategories;
                    y = $accordion.offset().top + $accordion.height();
                    bClip = y > $(window).height();
                }

                if (bClip) {
                    $scope.bHideMainJobList = true;
                    $scope.bPinFacetArrow = true;
                } else {
                    $scope.bHideMainJobList = false;
                    $scope.bPinFacetArrow = false;
                }

                setTimeout(function () { $scope.$apply(); });

            },

            clearAllFacetOptions: function () {
                _.each($scope.facets, function (facet) {
                    _.each(facet.Options, function (oOption) {
                        oOption.Selected = false;
                    });
                    facet.SelectedCount = 0;
                });
                $scope.utils.updateHistory($scope.$location.hash());
                $scope.filterJobsByFacet(null, $scope.oActiveFacet);
            },
            clearCurrentFacetOptions: function () {
                _.each($scope.oActiveFacet.Options, function (oOption) {
                    oOption.Selected = false;
                });
                $scope.oActiveFacet.SelectedCount = 0;
                _.each($scope.facets, function (eachFacet) {
                    if (eachFacet.Description == $scope.oActiveFacet.Description) {
                        _.each(eachFacet.Options, function (eachOption) {
                            eachOption.Selected = false;
                        });
                        eachFacet.SelectedCount = 0;
                    }
                });
                $timeout(function () {
                    $scope.$apply();
                    $scope.utils.updateHistory($scope.$location.hash());
                    $scope.filterJobsByFacet(null, $scope.oActiveFacet);
                }, 0);
            },
            toggleAdvancedOptions: function (e, scope) {
                var $target = $(e.target).focus().toggleClass("open"),
                    $textSpan = $target.children();

                $target.closest("li").find("p").slideToggle();
                if ($target.hasClass("open"))
                    $textSpan.text($textSpan.attr("open-text"));
                else
                    $textSpan.text($textSpan.attr("closed-text"));
            }
        },
        navigateNextRegion: function (event, container) {
            if (event.keyCode == $.keyCodes.escape) { // 27 = esc key
                $scope.escFromtrap = event.target;
                function hideOnEscape(event) {
                    if (event.keyCode == $.keyCodes.tab && event.shiftKey) {
                        if ($("." + event.target.parentElement.classList[0]).children().first()[0] == event.target)
                            $($scope.escFromtrap).focus();
                    } else if (event.keyCode == $.keyCodes.tab) {
                        if ($("." + event.target.parentElement.classList[0]).children().last()[0] == event.target)
                            $($scope.escFromtrap).focus();
                    }
                }
                if ($("." + container).is(":visible")) {
                    $("." + container).children().first().focus();
                    $("." + container).trapFocus().keydown(hideOnEscape);
                }
                // $('[role="region"]');
                event.preventDefault();
            }
        },
        formatters: {
            addedon: function (val) {
                var B_DAYS_AGO = false

                //retaining days ago format logic
                //currently not part of design
                if (B_DAYS_AGO) {
                    var nDaysAgo = Math.round((new Date - new Date(val)) / (360000 * 24));
                    if (nDaysAgo == 0)
                        return "Today";
                    else if (nDaysAgo == 1)
                        return "Yesterday"
                    else if (nDaysAgo > 30)
                        return "30+ days ago";
                    else
                        return nDaysAgo + " days ago";
                }

                //month day format
                var asDate = new Date(val).toString().split(" ");
                return asDate[1] + " " + _.parseInt(asDate[2]);
            },
            jobdescription: function (val, oQ) {
                oQ.OriginalValue = oQ.OriginalValue || oQ.Value;
                return $scope.$root.utils.truncatedMarkup(oQ);
            }
        },

        formatWrapper: function (scope, fnFormatter) {
            return scope.oQ.Value = fnFormatter.call(scope, scope.oQ.Value, scope.oQ);
        },

        getName: function (scope) {
            return (scope.job.RenderedFields[scope.$index] || {}).ClassName
        },
        updateHeading: function (jobsType) {
            jobsType = jobsType ? jobsType.toLowerCase() : "";
            $scope.hotJobsType = jobsType;
            if (jobsType == "jobsnearme") {
                $scope.jobsHeading = response.ClientSettings.JobsNearMeText;
            }
            else if (jobsType == "featuredjobs" || (response.HotJobs && response.HotJobs.Job && response.HotJobs.Job.length && !jobsType)) {
                $scope.jobsHeading = response.ClientSettings.FeaturedJobsText;
            }
            else if (jobsType == "mostrecentjobs") {
                $scope.jobsHeading = response.ClientSettings.MostRecentJobsText;
            }
            _.delay(function () {
                $scope.$apply();
            });
        },
        showFeaturedJobsOrLatestJobs: function () {
            clearTimeout($scope.timeOut);
            var FeaturedJobsrequest = {};
            FeaturedJobsrequest.partnerId = $("#partnerId").val();
            FeaturedJobsrequest.siteId = $("#siteId").val();
            FeaturedJobsrequest.turnOffHttps = $.queryParams().sec == 1;
            $scope.featuredOrLatestJobsAjax = $.ajax({
                success: function (data, status, jqxhr) {
                    that.jobs = data.Jobs.Job;
                    that.featuredJobs = data.Jobs.Job;
                    that.jobsCount = data.Jobs.Job.length;
                    that.$apply();
                    $scope.updateHeading(data.JobsType);

                    if ($.sizeThisFrame)
                        $.sizeThisFrame();
                },
                error: function (jqxhr, status, error) {
                },
                url: '/TgNewUI/Search/Ajax/FeaturedJobsOrLatestJobs',
                data: FeaturedJobsrequest,
                type: 'POST'
            });
        },

        showJobsNearMe: function (position) {
            clearTimeout($scope.timeOut);
            var JobsNearMeRequest = {};
            JobsNearMeRequest.partnerId = $("#partnerId").val();
            JobsNearMeRequest.siteId = $("#siteId").val();
            JobsNearMeRequest.latitude = parseFloat(position.coords.latitude.toString().replace(",", "."));
            JobsNearMeRequest.longitude = parseFloat(position.coords.longitude.toString().replace(",", "."));
            JobsNearMeRequest.turnOffHttps = $.queryParams().sec == 1;
            that.geoLocationLatitude = parseFloat(position.coords.latitude.toString().replace(",", "."));
            that.geoLocationLongitude = parseFloat(position.coords.longitude.toString().replace(",", "."));
            $scope.featuredOrLatestJobsAjax = $.ajax({
                success: function (data, status, jqxhr) {
                    that.jobs = data.Jobs.Job;
                    that.featuredJobs = data.Jobs.Job;
                    that.jobsCount = data.Jobs.Job.length;
                    that.$apply();
                    $scope.updateHeading(data.JobsType);

                    if ($.sizeThisFrame)
                        $.sizeThisFrame();
                },
                error: function (jqxhr, status, error) {
                },
                url: '/TgNewUI/Search/Ajax/JobsNearMe',
                data: JobsNearMeRequest,
                type: 'POST'
            });
        },

        showInitialJobs: function (bfromHistory) {
            $scope.bCreateAccount = false;
            $scope.bPrivacyPages = false;
            $scope.bSelectedGroup = false;
            $scope.bJobCart = false;
            $scope.sortby = 0;
            $scope.login.ForgotPass = bfromHistory == false ? $scope.login.ForgotPass : false;
            that.bPowerSearchVisible = false;
            that.getPowerSeachInputId = function (scope) {
                return scope.question.QuestionType + (scope.QId || "") + "_" + scope.$id;
            }
            that.bInitialLoad = true;
            if ($scope.standAloneGQ > 0) {
                if ($scope.bLoggedIn) {
                    $scope.standAloneGQApply();
                }
                else if ($scope.isNonProfileAllowed) {
                    if ($scope.tgSettings.PrivacyStatement != '') {
                        //Show Privacy Policy...
                        $scope.showPrivacyPolicyForNonLoggedIn("NoLogin");
                    }
                    else {
                        $scope.standAloneGQApply();
                    }
                }
                else if ($scope.tgSettings.SSOGateway != "1") {
                    if ($scope.tgSettings.ByPassGQLogin == 'True') {
                        $scope.bBypassGQLogin = true;
                        $scope.AnonymousLoginType = "";
                    }
                    $scope.backtobSignInView = true;
                    $scope.bSignInView = true;
                    $scope.showInFullView = true;
                    $scope.workFlow = $scope.$root.workFlow = 'logIn';
                    setTimeout(function () {
                        $scope.setHash();
                        $scope.setTitle("logIn");
                        $scope.$apply();
                    }, 0);
                }
            }
            else {
                if ($("#pageType").val() != "") {
                    that.powerSearchQuestions = response.PowerSearchQuestions != null ? response.PowerSearchQuestions.Questions : "";
                    $scope.TranslatePowerSearchQuestions(that.powerSearchQuestions);
                    _.forEach(that.powerSearchQuestions, function (aQuestion) {
                        $.htmlEncodeSpecial(aQuestion);
                        if (aQuestion.QuestionType == "date") {
                            aQuestion.rangeValid = 1;
                        }
                        if (aQuestion.QId == "0") {
                            aQuestion.Options.unshift(
                           {
                               OptionName: $scope.dynamicStrings.Option_All,
                               OptionValue: "11111111",
                               Selected: false,
                               Count: 0
                           });
                        }
                        if (preLoadSmartSearchResponse.PowerSearchOptions != null) {
                            var powerSearchOption = _(preLoadSmartSearchResponse.PowerSearchOptions.PowerSearchOption).where({ VerityZone: aQuestion.VerityZone }).value();
                            if (aQuestion.IsAutoComplete) {
                                _.forEach(_.pluck(powerSearchOption, "OptionCodes")[0], function (option) {
                                    var selectedOption = _.find(aQuestion.Options, function (questionOption) {
                                        return questionOption.OptionName.toLowerCase() == option.toLowerCase();
                                    });//_.forEach(, function (questionOption) { return _(questionOption).where({ "OptionName": option }).value() });
                                    if (selectedOption != undefined)
                                        selectedOption.Selected = true;
                                });
                            }
                            else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                                aQuestion.Value = _.pluck(powerSearchOption, "Value")[0];
                            }
                            else {
                                _.forEach(_.pluck(powerSearchOption, "OptionCodes")[0], function (option) {
                                    var selectedOption = _.find(aQuestion.Options, function (questionOption) {
                                        return questionOption.OptionName.toLowerCase() == option.toLowerCase();
                                    });//_.forEach(, function (questionOption) { return _(questionOption).where({ "OptionName": option }).value() });
                                    if (selectedOption != undefined)
                                        selectedOption.Selected = true;
                                });
                            }
                        }
                    });
                    if ($("#pageType").val().toLowerCase() == "createaccount") {
                        //$scope.homeView();
                        $timeout(function () {

                            $scope.bPrivacyPages = false;
                            $scope.bPrivacyPolicyStatement = false;
                            $scope.bCreateAccount = true;
                            $scope.resetcreatAccount($scope);
                            $scope.setHash();
                            $scope.loadwebtrackerscript("/TGNewUI/CreateAccount", $scope.customScriptRendering.Search);
                            $timeout(function () {
                                if ($.queryParams()["Qs"] != "" && typeof $.queryParams()["SMError"] != "undefined") {
                                    $scope.createAccount.SMmainError = $scope.dynamicStrings.ErrorMessage_CreateAccntPastUsingSM;
                                    $scope.createAccount.showForgotPasswordLink = true;
                                    $scope.createAccount.bSocialNetwork = true;
                                    $scope.error_displayForgotPasswordLink();
                                }
                                $scope.$apply();
                                $(".createAccountContainer .backLink").css("display", "none");
                                $("#pageType").val("");
                            }, 10);
                        }, 10);

                    }
                    else if ($("#pageType").val().toLowerCase() == "advancedsearch") {
                        that.bPowerSearchVisible = true;
                        that.preloadPowerSearch = true;
                        $scope.bLoggedIn = response.LoggedIn;
                        $scope.loadwebtrackerscript("/TGNewUI/AdvancedSearch", $scope.customScriptRendering.Search);
                    }
                    else if ($("#pageType").val().toLowerCase() == "jobcart") {
                        $scope.bLoggedIn = true;
                        if (response.ResponsiveCandidateZone) {
                            $scope.bCandidateZone = true;
                            $scope.bresponsiveCandidateZone = true;
                            $scope.bJobCartLaunchedFromHome = true;
                            $scope.renderDashBoard(response.DashboardData, 1, 1);
                        }
                        else {

                            $scope.bJobCartLaunchedFromHome = true;
                            $scope.renderJobCart(response.JobCartResponse);
                        }

                    }
                    else if ($("#pageType").val().toLowerCase() == "saveddrafts" && response.ResponsiveCandidateZone) {
                        $scope.bLoggedIn = true;
                        $scope.bresponsiveCandidateZone = true;
                        $scope.bCandidateZone = true;
                        $scope.renderDashBoard(response.DashboardData, 2, $scope.enumForDashBoardActiveSection.UnfinishedApplications);
                    }
                    else if ($("#pageType").val().toLowerCase() == "saveddraftsfromlink") {
                        $scope.showInFullView = true;
                        $scope.LoginFromLinkView = true;
                        if ($scope.tgSettings.SSOGateway != "1") {
                            $scope.showMobileSignIn($scope);
                        }
                    } else if ($("#pageType").val().toLowerCase() == "portal") {
                        sessionStorage.setItem('pageType', "portal");
                        sessionStorage.setItem('portalReqId', $.queryParams().reqId);
                        if (response.LoggedIn) {
                            $scope.bLoggedIn = true;
                            $scope.PortalLogin = true;
                            if ($scope.bresponsiveCandidateZone && $scope.CandidateZoneData != null && $scope.CandidateZoneData.HRstatusCategoriesConfiguredForCP == true && $scope.EnableResponsiveCandidatePortal) {
                                $scope.bCandidateZone = true;
                                $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.FinishedApplications);
                            }
                            else
                                window.location = '../../../TGwebhost/candidateportal.aspx?SID=' + $("#SIDValue").val();
                        }
                        else {
                            $scope.showInFullView = true;
                            $scope.LoginFromLinkView = true;
                            $scope.PortalLogin = true;
                            if ($scope.tgSettings.SSOGateway != "1") {
                                $scope.showMobileSignIn($scope);
                            }
                        }
                    }
                    else if ($("#pageType").val().toLowerCase() == "assessments" && response.ResponsiveCandidateZone) {



                        $scope.bLoggedIn = true;
                        $scope.bSignInView = false;
                        $scope.bSearchResults = false;
                        $scope.bJobDetailsShown = false;
                        $scope.bSidebarVisible = false;
                        $scope.bSidebarShown = false;
                        $scope.bSidebarOverlay = false;
                        $scope.bPowerSearchVisible = false;
                        $scope.bJobCart = false;
                        $scope.bSelectedGroup = false;

                        $scope.bCreateAccount = false;
                        $scope.bEditProfileEditMode = false;
                        $scope.savedSearchActionCompletion = 0;
                        $scope.searchResultsFromSavedSearch = null;

                        $scope.bCandidateZone = true;
                        $scope.bresponsiveCandidateZone = true;
                        $scope.candidatezoneSubView = 'ResponsiveAssessment';
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Assessments";
                        $scope.setTitle("Assessments");
                        $scope.bInitialLoad = false;
                        $scope.PendingAssessmentsUrl = "/TgNewUI/CandidateZone/Ajax/ViewAssessments?q=" + $.queryParams().q;
                        $scope.PendingAssessments = response.PendingAssessments.PendingAssessments;

                        // $scope.renderAssessments("/TgNewUI/CandidateZone/Ajax/ViewAssessments?q=" + $queryParams().q);
                        $timeout(function () {
                            $scope.$apply();
                            $scope.alignCards("AssesmentsCards", "jobCard");
                        }, 1000);

                    }
                    else {
                        that.bInitialLoad = false;
                        if ($("#pageType").val().toLowerCase().indexOf("selectedgroup") >= 0) {
                            $scope.SelectedGroupAjax($("#partnerId").val(), $("#siteId").val());
                            $scope.bLoggedIn = true;
                            $scope.loadwebtrackerscript("/TGNewUI/SelectedGroup", $scope.customScriptRendering.Search);
                        } else {
                            that.preloadPowerSearch = true;
                            that.bSearchResults = true;
                            that.bSidebarShown = true;
                            that.bSidebarVisible = true;

                        }

                        $scope.encryptedBruid = response.EncryptedBruid;
                        $scope.hashCode = response.HashCode;
                        if (response.searchResultsResponse.Facets) {
                            that.facets = response.searchResultsResponse.Facets.Facet;
                        }
                        else
                            that.facets = null;
                        $scope.updateAriaLabelForFacetDescription(that.facets);
                        that.pageNumber = 1;
                        var searchCriteria = "";
                        if (preLoadSmartSearchResponse.Keyword) {
                            searchCriteria = preLoadSmartSearchResponse.Keyword;
                            $scope.keyWordSearch.text = preLoadSmartSearchResponse.Keyword;
                        }
                        else {
                            $scope.keyWordSearch.text = "";
                        }
                        that.keywordFields = preLoadSmartSearchResponse.KeywordCustomSolrFields;
                        if (preLoadSmartSearchResponse.Location) {
                            searchCriteria += ("," + preLoadSmartSearchResponse.Location);
                            $scope.locationSearch.text = preLoadSmartSearchResponse.Location;
                        }
                        else {
                            $scope.locationSearch.text = "";
                        }
                        that.locationFields = preLoadSmartSearchResponse.LocationCustomSolrFields;
                        $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", response.searchResultsResponse.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                        if (response.searchResultsResponse.JobsCount <= 0) {
                            $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                        }
                        $scope.filterAppliedCount = response.searchResultsResponse.FiltersCount;
                        $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", response.searchResultsResponse.FiltersCount);
                        that.jobsCount = response.searchResultsResponse.JobsCount;
                        if (that.jobsCount > (50 * that.pageNumber)) {
                            that.bShowMoreButton = true;
                        }
                        else {
                            that.bShowMoreButton = false;
                        }
                        $scope.bLoggedIn = response.LoggedIn;
                        $scope.sortFields = that.sortFields = _.each(response.searchResultsResponse.SortFields, function (field) {
                            field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                        });


                        if ($("#pageType").val().toLowerCase() == "searchresults" && (window.location.href.toLowerCase().indexOf("reqid") >= 0 && $.queryParams().reqid != "" || $.queryParams().actiontype == "savesearchfromsearchresults")) {
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                            var SMLoginjobids = $.queryParams().reqid.split(",").length > 0 ? $.queryParams().reqid : "";
                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                            $scope.toggleCheckBoxes = true;
                            _.each(appScope.jobs, function (job) {
                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                    job.Selected = true;
                                }
                            });
                            var proceedPostToNextPage = true;
                            if ($location.hash().toLowerCase().indexOf('showprivacypolicy') > -1)
                                proceedPostToNextPage = false;
                            
                            if ($.queryParams().actiontype == "applyfromsearchresults" && proceedPostToNextPage)
                                $scope.postToNextPage('', appScope, 'mulapplyvald');
                            else if ($.queryParams().actiontype == "referfromsearchresults" && proceedPostToNextPage) {
                                $scope.SelectedJobsChecked = true;
                                $scope.postToNextPage('', appScope, 'refer');
                            }
                            else if ($.queryParams().actiontype == "savefromsearchresults" && proceedPostToNextPage) {
                                $scope.SelectedJobsChecked = true;
                                $scope.postToNextPage('', appScope, 'save');
                            }
                            else if ($.queryParams().actiontype == "savesearchfromsearchresults" && proceedPostToNextPage && sessionStorage.getItem('savesearchaftersocialmedialogin') != "false") {

                                try {
                                    $scope.powerSearchQuestions = JSON.parse(sessionStorage.getItem('powersearchquestions'));
                                    if ($scope.powerSearchQuestions == null || $scope.powerSearchQuestions.length == 0) {
                                        $scope.preloadPowerSearch = false;
                                    }
                                    $scope.facets = JSON.parse(sessionStorage.getItem('facets'));
                                    $scope.jobs = JSON.parse(sessionStorage.getItem('jobs'));
                                    $scope.latitude = sessionStorage.getItem('latitude');
                                    $scope.longitude = sessionStorage.getItem('longitude');
                                    $scope.keyWordSearch.text = sessionStorage.getItem('keyword');
                                    $scope.locationSearch.text = sessionStorage.getItem('location');
                                    $scope.sortby = sessionStorage.getItem('sortby');
                                    $scope.jobsHeading = sessionStorage.getItem('jobsheading');
                                }
                                catch (error) {

                                }
                                sessionStorage.setItem('savesearchaftersocialmedialogin', false);
                                $scope.ClearSaveSearchCriteriaToLocalSession();
                                $scope.getSavedSearchesMetaDataAndOpenDialog();
                            }

                        }
                        if ($("#pageType").val().toLowerCase() == "jobdetails") {
                            //if(hash & jobid mistamch){}else{

                            $scope.jobDetailsFieldsToDisplay = response.JobDetailFieldsToDisplay;
                            $scope.encryptedBruid = response.EncryptedBruid;
                            $scope.hashCode = response.HashCode;
                            $scope.jobDetailFields = response.Jobdetails;
                            $scope.isHotJob = response.Jobdetails == null ? false : _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "hotjob" }), "AnswerValue").toString().toLowerCase() == "yes",
                            $scope.enableJobDetailsSendToFriend = $scope.tgSettings.SendToFriend.toLowerCase() == "yes" ? true : false,
                            $scope.enablePostToMySocialNetwork = $scope.tgSettings.EnablePostToMySocialNetworkLink.toLowerCase() == "yes" && $scope.tgSettings.SocialMedia != "" ? true : false,
                            $scope.jobDetailsUrlForSocialMedia = response.Jobdetails == null ? "" : $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + $("#siteId").val() + "&gqid=" + _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString(),
                            $scope.jobDetailsButtonText = $scope.tgSettings.JobDetailsSendToFriendButtonText != "" ? $scope.tgSettings.JobDetailsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend,
                            $scope.bHideBackButtonInJobDetails = $("#hideBackButtonOnly").val() == "1" ? true : false;// This hides only the back button in jobdetails page
                            $scope.bShowBackButton = $("#noback").val() == "0" ? false : true;// this hides back button as well as page header (home and signin/register) links also.
                            if ($.queryParams().noback) {
                                $scope.bSearchResults = false;
                            }
                            //if (response.Jobdetails != null) {
                            //    $scope.handlers.JobdetailSocialShare();
                            //}
                            $scope.bLoggedIn = response.LoggedIn;

                            if (response.Jobdetails != null) {
                                $scope.JobDetailQuestionsSocialShare = response.Jobdetails.JobDetailQuestions;
                                $scope.bJobDetailsAPIError = false;
                                that.LimitExceededMessage = response.LimitExceededMessage;
                                that.ApplyDifference = response.ApplyDiff;
                                that.AllowReApply = response.ApplyStatus != null ? response.ApplyStatus.AllowReApply : true;
                                that.Applied = response.ApplyStatus != null ? response.ApplyStatus.Applied : false;
                                that.bJobDetailsShown = true;
                                that.bSearchResults = false;
                                that.bSidebarVisible = false;
                                that.ErrorMessageJobTitle = response.Jobdetails.Title.toString();
                                that.jobDetailsJobShown = _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString();
                                that.jobDetailsJobShown += "_" + _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "siteid" }), "AnswerValue").toString();
                                if ($.queryParams().actiontype == "referfromjobdetails" && $scope.bLoggedIn && (!that.Applied && that.ApplyDifference > 0)) {
                                    $scope.postToNextPageFromDetails('', $scope, 'refer');
                                }
                                else if ($.queryParams().actiontype == "savefromjobdetails" && $scope.bLoggedIn) {
                                    $scope.postToNextPageFromDetails('', $scope, 'save');
                                }
                                else if (that.tgSettings.GoDirectToLoginFromExternalURL.toLowerCase() == 'yes' && $scope.bLoggedIn && (!that.Applied && that.ApplyDifference > 0)) {
                                    $scope.postToNextPageFromDetails('', $scope, 'apply');
                                }
                                else if (that.tgSettings.GoDirectToLoginFromExternalURL.toLowerCase() == 'yes' && !$scope.bLoggedIn) {
                                    $scope.postToNextPageFromDetails('', $scope, 'apply');
                                }
                                else if (that.tgSettings.GoDirectToLoginFromExternalURL.toLowerCase() == 'yes' && $scope.bLoggedIn) {
                                    $scope.bJobDetailsAPIError = true;
                                }
                                else {
                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                                    setTimeout(function () { $scope.setTitle("jobDetails"); }, 10);
                                }

                                var jobidSiteid = "jobdetails=" + $scope.jobDetailsJobShown;
                                if ($location.hash() == "" || $location.hash().toLowerCase().indexOf(jobidSiteid) > -1) {
                                    $scope.setHash();
                                }

                            }
                            else {
                                that.bJobDetailsShown = true;
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                                setTimeout(function () { $scope.setTitle("jobDetails"); }, 10);
                            }
                            $scope.loadwebtrackerscript("/TGNewUI/JobDetails", $scope.customScriptRendering.Search);
                        }
                    }
                }
                else if ($.queryParams().fromSM && $scope.bLoggedIn && sessionStorage.getItem('pageType') == "portal") {
                    if ($scope.bresponsiveCandidateZone && $scope.CandidateZoneData != null && $scope.CandidateZoneData.HRstatusCategoriesConfiguredForCP == true && $scope.EnableResponsiveCandidatePortal) {
                        $scope.bCandidateZone = true;
                        $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.FinishedApplications);
                    }
                    else
                        window.location = '../../../TGwebhost/candidateportal.aspx?SID=' + $("#SIDValue").val();
                }
                else {
                    if (isJobsNearMeOn) {
                        if (bfromHistory) {
                            if (appScope.geoLocationLatitude != 0 && appScope.geoLocationLongitude != 0) {
                                $scope.showJobsNearMe({ "coords": { "latitude": appScope.geoLocationLatitude, "longitude": appScope.geoLocationLongitude } });
                            }
                            else {
                                $scope.showFeaturedJobsOrLatestJobs();
                            }
                        }
                        else {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition($scope.showJobsNearMe, $scope.showFeaturedJobsOrLatestJobs);
                                $scope.timeOut = setTimeout(function () { $scope.showFeaturedJobsOrLatestJobs(); }, 10000);
                            }
                            else {
                                $scope.showFeaturedJobsOrLatestJobs();
                            }
                        }
                    }
                    else if (bfromHistory && $scope.tgSettings.ShowMostRecentJobs.toLowerCase() != "yes" && $scope.tgSettings.ShowFeaturedJobs.toLowerCase() != "yes") {
                        $scope.jobs = null;
                    }
                    else if (response.HotJobs && response.HotJobs.Job && response.HotJobs.Job.length > 0) {
                        that.jobsCount = response.HotJobs.Job.length;
                    }
                    else if ($scope.featureJobs && $scope.featureJobs.length > 0) {
                        that.jobsCount = $scope.featureJobs.length;
                    }

                    $scope.updateHeading(response.JobsType);
                }
                if ($scope.candidateZoneResponse != null && !(window.location.href.toLowerCase().indexOf("reqid") >= 0 && $.queryParams().reqid != "")) {
                    $scope.bCandidateZone = true;
                    $scope.bLoggedIn = true;
                    $scope.CandidateZoneData = $scope.candidateZoneResponse;
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.welcomeTitle = $scope.candidateZoneResponse.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = $scope.candidateZoneResponse.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.loadwebtrackerscript("/TGNewUI/CandidateZone", $scope.customScriptRendering.CandidateZone);
                } else if (window.location.hash == '' && $scope.bLoggedIn == true && $scope.bresponsiveCandidateZone == true && window.location.href.toLowerCase().indexOf("czsubmenu") >= 0 && $.queryParams().czsubmenu != "") {
                    var subMenuLink = [];
                    subMenuLink.CandidateZoneLinkId = $.queryParams().czsubmenu;
                    subMenuLink.responsive = true;
                    $scope.responsivecandidateZoneView(subMenuLink);
                } else if ($("#pageType").val() == "" && sessionStorage.getItem('pageType') != "portal") {
                    $scope.bCandidateZone = false;
                    $scope.candidatezoneSubView = '';
                }
            }
        },

        showNextSetOfJobs: function () {
            that.pageNumber = that.pageNumber + 1;
            that.sortJobs(true);
        },

        updateAriaLabelForFacetDescription: function (facets) {
            if (facets != null && facets.length > 0) {
                $.each(facets, function (i, facet) {
                    facet.AriaLabel_FilterResultsByFacet = appScope.dynamicStrings.AriaLabel_FilterResultsByFacet.replace("[facet_description]", facet.Description);
                });
            }
        },

        updateCandidateZoneData: function () {
            if ($scope.bresponsiveCandidateZone && $scope.ProfileDetails != null) {
                $scope.CandidateZoneData = $scope.ProfileDetails.CandidateZonePageResponse;
                if (typeof $scope.CandidateZoneData != 'undefined' && $scope.CandidateZoneData != null) {
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.welcomeTitle = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomeText;

                    $scope.SearchOpeningsSummaryText = $scope.CandidateZoneData.LandingLoggedSearchOpeningsSummaryText != "" ? $scope.CandidateZoneData.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    if ($scope.CandidateZoneData.LoggedInSettings.GeneralSocialReferral == "yes") {
                        $scope.SocialReferral_READY = $scope.CandidateZoneData.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                        $scope.SocialReferral_FirstName = encodeURIComponent($scope.CandidateZoneData.LoggedInSettings.SocialReferral_FirstName);
                        $scope.SocialReferral_LastName = encodeURIComponent($scope.CandidateZoneData.LoggedInSettings.SocialReferral_LastName);
                        $scope.SocialReferral_ProfileId = $scope.CandidateZoneData.LoggedInSettings.profileId;
                    }
                }
            }

        },

        sortJobs: function (Nextpagejobs) {
            var powerSearchOptions = [];
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var sortJobsRequest = {};
            sortJobsRequest.partnerId = $("#partnerId").val();
            sortJobsRequest.siteId = $("#siteId").val();
            sortJobsRequest.keyword = $scope.keyWordSearch.text;
            sortJobsRequest.location = $scope.locationSearch.text;
            sortJobsRequest.keywordCustomSolrFields = that.keywordFields;
            sortJobsRequest.locationCustomSolrFields = that.locationFields;
            facetFilterFields = $scope.GetFilteredFacets(appScope.facets);
            sortJobsRequest.linkId = $("#linkId").val();

            if ($scope.locationSearch.text != "") {
                sortJobsRequest.Latitude = that.latitude;
                sortJobsRequest.Longitude = that.longitude;
            }
            else {
                sortJobsRequest.Latitude = 0;
                sortJobsRequest.Longitude = 0;
            }
            $scope.sortby = (Nextpagejobs == true) ? $scope.sortby : null;
            $scope.sortby = ($scope.sortby == null && $scope.sortby == undefined) ? $("#sortBy").val() : $scope.sortby;
            sortJobsRequest.facetfilterfields = { "Facet": facetFilterFields };
            sortJobsRequest.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            sortJobsRequest.SortType = $scope.sortFields[$scope.sortby].Name;
            if (Nextpagejobs == true) {
                sortJobsRequest.pageNumber = that.pageNumber;
            }
            else {
                sortJobsRequest.pageNumber = that.pageNumber = 1;
            }

            sortJobsRequest.encryptedSessionValue = $("#CookieValue").val();

            //sortJobsRequest = that.formJson();
            var url = '/TgNewUI/Search/Ajax/ProcessSortAndShowMoreJobs';
            $http.post(url, sortJobsRequest).success(function (data, status, headers, config) {
                if (data.Jobs) {
                    if (Nextpagejobs == true) {
                        $.merge(that.jobs, data.Jobs.Job);
                    }
                    else {
                        that.jobs = data.Jobs.Job;
                    }
                }
                else {
                    $("#searchResults").val('');
                    that.jobs = null;
                }
                if (that.jobsCount > (50 * that.pageNumber)) {
                    that.bShowMoreButton = true;
                }
                else {
                    that.bShowMoreButton = false;
                }
                //241711: start Added to display the current keyword texts
                var searchCriteria = "";
                if ($scope.keyWordSearch.text) {
                    searchCriteria = $scope.keyWordSearch.text;
                }
                if ($scope.locationSearch.text) {
                    searchCriteria += ("," + $scope.locationSearch.text);
                }
                $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", (searchCriteria.replace(/(^,)|(,$)/g, "")));
                if (data.JobsCount <= 0) {
                    $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                    $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                }

                //241711: End
                setTimeout(function () {
                    $scope.$apply();
                    $("#sortBy").val($scope.sortby);
                }, 0);
            }).error(function (data, status, headers, config) {
                //console.log("failed with status of " + status);
            });
        },

        throttleSortJobs: function () {
            that.throttleSortJobsSubfunction = that.throttleSortJobsSubfunction || _.throttle(that.sortJobs, 450, { leading: true, trailing: true });
            that.throttleSortJobsSubfunction();
        },

        throttleAttachment: function () {
            $("span.error").hide();
            if ($("#AttachementCatagory").val() != undefined && $("#AttachementCatagory").val() != "")
                window.applyScope.page.uploadServices("Attachments", $("#AttachementCatagory").val());
        },

        formJson: function () {
            var json = {};
            facetFilterFields = _.forEach(that.facets, function (facet) { return _.filter(facet.Options, { Selected: true }) });
            json = { "SiteId": $("#siteId").val(), "PartnerId": $("#partnerId").val(), "Keyword": $scope.keyWordSearch.text, "Location": $scope.locationSearch.text, "KeywordCustomSolrFields": that.keywordFields, "LocationCustomSolrFields": that.locationFields, "Latitude": $scope.locationSearch.text != "" ? that.latitude : 0, "Longitude": $scope.locationSearch.text != "" ? that.longitude : 0, "FacetFilterFields": { "Facet": facetFilterFields }, "SortType": $scope.sortFields[$("#sortBy").val()].Name, "PageNumber": that.pageNumber };
            return json;
        },


        searchMatchedJobs: function (scope) {
            $scope.bJobsSaved = false;
            $scope.bSearchSaved = false;
            $scope.sortby = 0;
            if (angular.isDefined(scope) && typeof scope.oActiveLaddaButton != 'undefined')
                scope.oActiveLaddaButton.start();
            clearTimeout($scope.timeOut);
            if ($scope.featuredOrLatestJobsAjax != null) {
                $scope.featuredOrLatestJobsAjax.abort();
            }
            var smartSearchRequest = {};
            $scope.utils.cleanUpAutocompletes();
            smartSearchRequest.partnerId = $scope.$root.queryParams.partnerid;
            smartSearchRequest.siteId = $scope.$root.queryParams.siteid;
            smartSearchRequest.keyword = $scope.keyWordSearch.text;
            smartSearchRequest.location = $scope.locationSearch.text;
            smartSearchRequest.keywordCustomSolrFields = that.keywordFields;
            smartSearchRequest.locationCustomSolrFields = that.locationFields;
            smartSearchRequest.facetfilterfields = null;
            smartSearchRequest.turnOffHttps = $.queryParams().sec == 1;
            if ($scope.locationSearch.text != "") {
                smartSearchRequest.Latitude = that.latitude;
                smartSearchRequest.Longitude = that.longitude;
            }
            else {
                smartSearchRequest.Latitude = 0;
                smartSearchRequest.Longitude = 0;
            }
            $scope.updateSaveSearchCritetia(smartSearchRequest);
            smartSearchRequest.encryptedsessionvalue = $("#CookieValue").val();
            $.ajax({
                success: function (data, status, jqxhr, bResettingFromHistory) {

                    var elActive = document.activeElement,
                        sPriorActiveSearchControlSelector = "dummyValue";

                    if (elActive)
                        sPriorActiveSearchControlSelector = elActive.tagName + (elActive.name ? ("[name=" + elActive.name + "]") : "");

                    if (angular.isDefined(scope) && typeof scope.oActiveLaddaButton != 'undefined')
                        scope.oActiveLaddaButton.stop();

                    if (that.bJobCart || (typeof (that.candidatezoneSubView) !== "undefined" && that.candidatezoneSubView.toLowerCase() == "responsivereferrals")) {
                        that.bGQLaunchedFromJobCart = false;
                        $scope.bCandidateZone = false;
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                    }

                    if (data.Jobs) {
                        $scope.jobs = data.Jobs.Job;
                    }
                    else {
                        $("#searchResults").val('');
                        $scope.jobs = null;
                    }
                    if (data.Facets)
                        that.facets = data.Facets.Facet;
                    else
                        that.facets = null;
                    $scope.updateAriaLabelForFacetDescription(that.facets);
                    that.bInitialLoad = false;
                    that.bSidebarShown = true;
                    that.bSidebarVisible = true;
                    that.bSearchResults = true;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                    that.bJobDetailsShown = false;
                    if (that.bRenderPhoneViewSearch)
                        $scope.handlers.toggleFilterFacetAccordion();
                    that.bRenderPhoneViewSearch = false;
                    that.pageNumber = 1;
                    that.filterAppliedCount = 0;
                    $("#title").nextUntil('meta[name=lcGlobalBaseUrl]', 'meta').remove();
                    $("#title").after($scope.tgSettings.SearchResultsMetaTagText.replace(/#ClientName#/g, $scope.tgSettings.PartnerName));
                    if ($scope.bShowFilterAccordion || $scope.bShowFacetAccordionOptions) {
                        $scope.bShowFilterAccordion = false;
                        $scope.bRenderFacetFilterAccordion = false;
                        $scope.bShowFacetAccordionOptions = false;
                        $scope.bFilterAccordionOpen = false;
                        $scope.bPinFacetArrow = false;
                    }
                    var searchCriteria = "";
                    if ($scope.keyWordSearch.text) {
                        searchCriteria = $scope.keyWordSearch.text;
                    }
                    if ($scope.locationSearch.text) {
                        searchCriteria += ("," + $scope.locationSearch.text);
                    }
                    $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", (searchCriteria.replace(/(^,)|(,$)/g, "")));

                    if (data.JobsCount <= 0) {
                        $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                    } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                        $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    }
                    that.sortFields = _.each(data.SortFields, function (field) {
                        field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                    }),
                    that.jobsCount = data.JobsCount;
                    if (that.jobsCount > (50 * that.pageNumber)) {
                        that.bShowMoreButton = true;
                    }
                    else {
                        that.bShowMoreButton = false;
                    }
                    that.preloadPowerSearch = false;
                    that.powerSearchQuestions = [];

                    if (data.Latitude > 0) {
                        $scope.latitude = data.Latitude;
                    }
                    if (data.Longitude > 0) {
                        $scope.longitude = data.Longitude;
                    }

                    $scope.jobs = _.each($scope.jobs, function (job) {
                        job.Selected = false;
                    });
                    $scope.SelectedJobsChecked = false;
                    $scope.toggleCheckBoxes = true;
                    if (typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
                        _.each($scope.oHistory, function (oPriorScope, sName) {
                            if (sName.indexOf('keyWordSearch') != -1) {
                                $scope.oHistory[sName].SelectJobs = $scope.tgSettings.SelectJobsText;;
                                $scope.oHistory[sName].toggleCheckBoxes = true;
                                $scope.oHistory[sName].SelectedJobsChecked = false;
                            }
                        });


                    $scope.setHash(bResettingFromHistory, arguments, this);
                    setTimeout(function () {
                        $scope.scrolltop();
                        $scope.$apply();
                        $("#mainJobListContainer").focus();
                    }, 0);

                    $scope.setTitle($scope.workFlow);

                    $(".searchControls [role=status]").html("");

                    var $statusEl = $(document.activeElement).prev("[role=status]");

                    if ($statusEl.exists()) {
                        $statusEl.text($scope.jobsHeading);
                    }

                    $scope.loadwebtrackerscript("/TGNewUI/SearchResults", $scope.customScriptRendering.Search);

                },
                error: function (jqxhr, status, error) {
                    if (angular.isDefined(scope))
                        scope.oActiveLaddaButton.stop();
                },
                data: smartSearchRequest,
                url: '/TgNewUI/Search/Ajax/MatchedJobs',
                type: 'POST'
            });


        },
        powerSearchJobs: function (scope) {
            var isValid = 1;
            $scope.sortby = 0;
            $scope.bSearchSaved = false;
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    if (aQuestion.QuestionType == "date") {
                        var selecteddate = aQuestion.Value;
                        if (selecteddate != null && selecteddate.indexOf(",") >= 0) {
                            date1 = selecteddate.substring(0, selecteddate.indexOf(","));
                            date2 = selecteddate.substring(selecteddate.indexOf(",") + 1);
                            if (date1 != "" && date2 != "") {
                                var millisecondsdate1 = Date.parse(date1);
                                var date1 = new Date(millisecondsdate1);
                                var millisecondsdate2 = Date.parse(date2);
                                var date2 = new Date(millisecondsdate2);
                                if (date1 > date2) {
                                    aQuestion.rangeValid = 0;
                                    isValid = 0;
                                }
                            }
                        }
                    }
                });
            }

            if (isValid == 0 || !$("#powerSearchForm").valid()) {
                that.$apply();
                return;
            }

            var powerSearchOptions = [];
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var smartSearchRequest = {};
            smartSearchRequest.partnerId = $("#partnerId").val();
            smartSearchRequest.siteId = $("#siteId").val();
            $scope.keyWordSearch.text = $scope.powerSearchKeyWordSearch.text;
            $scope.locationSearch.text = $scope.powerSearchLocationSearch.text;
            smartSearchRequest.keyword = $scope.powerSearchKeyWordSearch.text;
            smartSearchRequest.location = $scope.powerSearchLocationSearch.text;
            smartSearchRequest.keywordCustomSolrFields = that.keywordFields;
            smartSearchRequest.locationCustomSolrFields = that.locationFields;
            smartSearchRequest.turnOffHttps = $.queryParams().sec == 1;
            facetFilterFields = [];// _.forEach(this.$parent.facets, function (facet) { return _.filter(facet.Options, { Selected: true }) });

            if ($scope.powerSearchLocationSearch.text != "") {
                smartSearchRequest.Latitude = that.latitude;
                smartSearchRequest.Longitude = that.longitude;
            }
            else {
                smartSearchRequest.Latitude = 0;
                smartSearchRequest.Longitude = 0;
            }
            $scope.updateSaveSearchCritetia(smartSearchRequest);
            smartSearchRequest.facetfilterfields = { "Facet": facetFilterFields };
            smartSearchRequest.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            smartSearchRequest.sortField = $("#sortBy").val();
            smartSearchRequest.encryptedsessionvalue = $("#CookieValue").val();
            scope.oActiveLaddaButton.start();
            var url = '/TgNewUI/Search/Ajax/PowerSearchJobs';
            $http.post(url, smartSearchRequest).success(function powerSearchAjax(data, status, headers, config, bFromHistory) {
                scope.oActiveLaddaButton.stop();
                if (data.Jobs) {
                    $scope.jobs = data.Jobs.Job;
                }
                else {
                    $("#searchResults").val('');
                    $scope.jobs = null;
                }
                $scope.SaveSearchCriteria.Latitude = data.Latitude;
                $scope.SaveSearchCriteria.Longitude = data.Longitude;
                if (data.Facets)
                    that.facets = data.Facets.Facet;
                else
                    that.facets = null;
                $scope.updateAriaLabelForFacetDescription(that.facets);
                that.bInitialLoad = false;
                that.bSidebarShown = true;
                that.bSidebarVisible = true;
                that.bSearchResults = true;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                that.pageNumber = 1;
                var searchCriteria = "";
                if ($scope.keyWordSearch.text != "") {
                    searchCriteria = $scope.keyWordSearch.text
                }
                if ($scope.locationSearch.text != "") {
                    searchCriteria = searchCriteria + "," + $scope.locationSearch.text;
                }
                $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                if (data.JobsCount <= 0) {
                    $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                    $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                }
                if ($scope.bShowFilterAccordion) {
                    $scope.bShowFilterAccordion = false;
                    $scope.bRenderFacetFilterAccordion = false;
                    $scope.bShowFacetAccordionOptions = false;
                    $scope.bFilterAccordionOpen = false;
                    $scope.bPinFacetArrow = false;
                }
                $scope.filterAppliedCount = data.FiltersCount;
                $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", data.FiltersCount);
                that.jobsCount = data.JobsCount;
                //that.sortFields = data.SortFields;
                that.sortFields = _.each(data.SortFields, function (field) {
                    field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                });
                if (that.jobsCount > (50 * that.pageNumber)) {
                    that.bShowMoreButton = true;
                }
                else {
                    that.bShowMoreButton = false;
                }
                that.bPowerSearchVisible = false;
                that.preloadPowerSearch = true;
                $scope.toggleCheckBoxes = true;
                $scope.SelectedJobsChecked = false;
                $scope.jobs = _.each($scope.jobs, function (job) {
                    job.Selected = false;
                })
                setTimeout(function () {
                    $scope.$apply();
                    $scope.scrolltop();
                    $("#mainJobListContainer").focus();
                }, 0);


                $scope.setHash(bFromHistory, arguments, this);

                $scope.loadwebtrackerscript("/TGNewUI/SearchResults", $scope.customScriptRendering.Search);

            }).error(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
                //console.log("failed with status of " + status);
            });

        },

        filterJobsByFacet: function (scope, oFacet) {

            var nDeltaSelectedCount = scope ? (scope.op.Selected ? 1 : -1) : 0,
                powerSearchOptions = [];

            $scope.bJobsLoadingState = true;

            oFacet = oFacet || scope.$parent.facet;
            oFacet.SelectedCount = (oFacet.SelectedCount || 0) + nDeltaSelectedCount;
            if ($scope.oActiveFacet != null && typeof $scope.oActiveFacet != "undefined") {
                $scope.oActiveFacet.SelectedCount = oFacet.SelectedCount;
            }

            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var smartSearchRequest = {};
            smartSearchRequest.partnerId = $("#partnerId").val();
            smartSearchRequest.siteId = $("#siteId").val();
            smartSearchRequest.keyword = $scope.keyWordSearch.text;
            smartSearchRequest.location = $scope.locationSearch.text;
            smartSearchRequest.keywordCustomSolrFields = that.keywordFields;
            smartSearchRequest.locationCustomSolrFields = that.locationFields;
            smartSearchRequest.turnOffHttps = $.queryParams().sec == 1;
            smartSearchRequest.linkId = $("#linkId").val();
            facetFilterFields = $scope.GetFilteredFacets($scope.facets);

            if ($scope.locationSearch.text != "") {
                smartSearchRequest.Latitude = that.latitude;
                smartSearchRequest.Longitude = that.longitude;
            }
            else {
                smartSearchRequest.Latitude = 0;
                smartSearchRequest.Longitude = 0;
            }
            smartSearchRequest.encryptedsessionvalue = $("#CookieValue").val();
            smartSearchRequest.facetfilterfields = { "Facet": facetFilterFields };
            smartSearchRequest.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            if ($("#sortBy").val() != undefined && $("#sortBy").val() != "") {
                smartSearchRequest.sortField = $scope.sortFields[$("#sortBy").val()].Name;
            }
            else {
                smartSearchRequest.sortField = "";
            }


            var url = '/TgNewUI/Search/Ajax/MatchedJobs';
            $http.post(url, smartSearchRequest).success(function (data, status, headers, config) {
                $scope.bJobsLoadingState = false;
                $scope.jobs = data.Jobs.Job;
                if (data.Facets) {
                    _.each($scope.facets, function (oCurrentFacet, i) {
                        var iDataOptionCounter = 0;
                        var currentFacet = null;
                        _.each(oCurrentFacet.Options, function (oOption, j) {
                            currentFacet = _.find(data.Facets.Facet, function (facet) {
                                return oCurrentFacet.Name == facet.Name;
                            });
                            if (currentFacet != null && (currentFacet.Name != oFacet.Name)) {
                                var oDataOption = currentFacet ? currentFacet.Options[iDataOptionCounter] : null;
                                //var oDataOption = data.Facets.Facet[i] ? data.Facets.Facet[i].Options[iDataOptionCounter] : null;
                                if (oDataOption && oDataOption.OptionValue == oOption.OptionValue) {
                                    oOption.Count = oDataOption.Count;
                                    iDataOptionCounter++;
                                } else {
                                    oOption.Count = 0;
                                }
                            }
                        })
                    });
                }
                else
                    that.facets = null;
                $scope.updateAriaLabelForFacetDescription(that.facets);

                that.bInitialLoad = false;
                that.bSidebarShown = true;
                that.bSidebarVisible = true;
                that.pageNumber = 1;
                var searchCriteria = "";
                if ($scope.keyWordSearch.text) {
                    searchCriteria = $scope.keyWordSearch.text;
                }
                if ($scope.locationSearch.text) {
                    searchCriteria += ("," + $scope.locationSearch.text);
                }
                $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                if (data.JobsCount <= 0) {
                    $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                    $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                }
                $scope.filterAppliedCount = data.FiltersCount;
                $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", data.FiltersCount);
                that.jobsCount = data.JobsCount;
                if (that.jobsCount > (50 * that.pageNumber)) {
                    that.bShowMoreButton = true;
                }
                else {
                    that.bShowMoreButton = false;
                }
                if (data.Latitude > 0) {
                    $scope.latitude = data.Latitude;
                }
                if (data.Longitude > 0) {
                    $scope.longitude = data.Longitude;
                }

                setTimeout(function () {
                    $scope.scrolltop();
                    $scope.$apply();
                    $scope.setHash();
                    if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                        $scope.utils.updateHistory($scope.$location.hash());

                    $("#mainJobListContainer").focus();
                }, 0);
            }).error(function (data, status, headers, config) {
                $scope.bJobsLoadingState = false;
            });
            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                $scope.utils.updateHistory($scope.$location.hash());

        },
        getPowerSearchQuestions: function () {

            setTimeout(function () {
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "powerSearch";
            }, 0);

            if (!that.bPowerSearchVisible) {
                that.bInitialLoad = false;
                $scope.keywordTextTemp = $scope.keyWordSearch.text;
                $scope.locationTextTemp = $scope.locationSearch.text;
                if (!that.preloadPowerSearch && !(that.powerSearchQuestions && that.powerSearchQuestions.length)) {
                    var powerSearchRequest = {};
                    powerSearchRequest.partnerId = $("#partnerId").val();
                    powerSearchRequest.siteId = $("#siteId").val();
                    var url = '/TgNewUI/Search/Ajax/PowerSearch';
                    $http.post(url, powerSearchRequest).success(function (data, status, headers, config) {
                        that.bPowerSearchVisible = !that.bPowerSearchVisible;
                        that.powerSearchQuestions = data.Questions;
                        $scope.TranslatePowerSearchQuestions(that.powerSearchQuestions);
                        if (that.powerSearchQuestions != "") {
                            _.forEach(that.powerSearchQuestions, function (aQuestion) {
                                $.htmlEncodeSpecial(aQuestion);
                                if (aQuestion.QuestionType == "date") {
                                    aQuestion.rangeValid = 1;
                                }
                                if (aQuestion.QId == "0") {
                                    aQuestion.Options.unshift(
                                   {
                                       OptionName: $scope.dynamicStrings.Option_All,
                                       OptionValue: "11111111",
                                       Selected: false,
                                       Count: 0
                                   });
                                }
                            });
                        }
                        if ($scope.bShowFilterAccordion || $scope.bShowFacetAccordionOptions) {
                            $scope.bShowFilterAccordion = false;
                            $scope.bRenderFacetFilterAccordion = false;
                            $scope.bShowFacetAccordionOptions = false;
                            $scope.bFilterAccordionOpen = false;
                            $scope.bPinFacetArrow = false;
                        }
                        $scope.setHash();
                    }).error(function (data, status, headers, config) {
                        //console.log("failed with status of " + status);
                    });
                } else {
                    that.bPowerSearchVisible = true;
                    that.bInitialLoad = false;
                    $scope.oldPowerSearchQuestions = that.powerSearchQuestions;
                }

            }
            else {
                that.powerSearchQuestions = $scope.oldPowerSearchQuestions;
                $scope.TranslatePowerSearchQuestions(that.powerSearchQuestions);
                $scope.keyWordSearch.text = $scope.keywordTextTemp;
                $scope.locationSearch.text = $scope.locationTextTemp;
                that.bPowerSearchVisible = false;
                that.bInitialLoad = !that.bSidebarShown;
                // $scope.utils.updateHistory('profile&loggedIn=true');
                history.back();
            }
            if (that.bRenderPhoneViewSearch) {
                setTimeout(function () {
                    $scope.handlers.toggleFilterFacetAccordion();
                    that.bRenderPhoneViewSearch = false;
                }, 1000);
            }
        },
        clearPowerSearch: function () {
            $scope.keyWordSearch.text = "";
            $scope.locationSearch.text = "";
            $scope.powerSearchKeyWordSearch.text = "";
            $scope.powerSearchLocationSearch.text = "";
            if ($scope.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    if (aQuestion.IsAutoComplete) {
                        aQuestion.selectedOptions = [];
                        aQuestion.aAvailableOptions = [];
                        aQuestion.oAvailableOptions = [];
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        aQuestion.Value = "";
                    }
                    else {
                        _.forEach(aQuestion.Options, function (opt) {
                            opt.Selected = false;
                        })
                    }
                });
            }
            $scope.powerSearchQuestions = that.powerSearchQuestions;
            that.bPowerSearchVisible = false;
            $timeout(function () {
                that.bPowerSearchVisible = true;
            }, 0);

        },
        sidebarSlider: {
            init: function (scope, $el, attr) {
                $($el).click(function () {
                    appScope.bSidebarOverlay = !appScope.bSidebarOverlay;
                    appScope.$apply();
                })
            }

        },

        toggleSidebar: function () {
            appScope.bSidebarOverlay = !appScope.bSidebarOverlay;
        },
        hideShrtcutAndPopOver: function (init) {
            if (init == "new")
                $scope.showShortCuts = false;
            else if (init == "show")
                $scope.showShortCuts = true;
            else if (init == "hide" && $("#popupInfo-shortcuts").is(":hidden"))
                $scope.showShortCuts = false;
        },
        searchResultsBackLink: function () {
            var backTo = "";

            if (typeof previousHashes[previousHashes.length - 2] == "undefined") {
                $scope.homeView();
            } else {
                if ($scope.bresponsiveCandidateZone) {
                    if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
                        $scope.savedJobsCache = null;
                        $scope.$root.oHistory['SavedJobs'].savedJobsCache = null;
                    }
                    if (!$scope.utils.isNewHash('SavedSearches', $scope)) {
                        $scope.SavedSearches = null;
                        $scope.$root.oHistory['SavedSearches'].SavedSearches = null;
                    }
                }
                history.back();
            }

        },
        BackfromSelectedGroup: function () {

            if (typeof previousHashes[previousHashes.length - 2] == "undefined") {
                $scope.homeView();
            }
            else {
                history.back();
                if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone) {
                    $scope.alignCards("SavedJobsContainer", "jobCard");
                }
            }

        },
        BackFromJobCart: function () {
            $scope.bJobCart = false;
            if ($scope.jobsCache != null) {
                $scope.jobs = $scope.jobsCache;
            }
            if ($scope.bJobCartLaunchedFromHome) {
                $scope.bJobCartLaunchedFromHome = false;
                $scope.homeView();
            }
            else {
                history.back();
            }
        },
        MultipleApplyDupCheckAjax: function (scope, clientId, siteId, jobsiteIds, selectedJobs) {
            var DuplicateCheckRequestForMultipleJobs = {
                clientId: clientId,
                siteId: siteId,
                jobAndSiteIds: jobsiteIds,
                sid: $("#CookieValue").val(),
                jobInfo: scope.jobInfo
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/CheckDuplicateSubmissionForMultipleJobs",
                data: DuplicateCheckRequestForMultipleJobs,
                success: function (data) {
                    scope.ApplyDifference = data.ApplyDiff;
                    scope.LimitExceededMessage = data.LimitExceededMessage;
                    scope.MultipleJobStatus = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })) : "";
                    scope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    scope.AllJobsApplied = scope.NoofJobsApplied == selectedJobs.length ? true : false;
                    if (scope.ApplyDifference <= 0) {
                        //scope.NoOfJobsExceededMaxLimit = ((scope.ApplyDifference * -1) + 1) == (selectedJobs.length - scope.NoofJobsApplied) ? 0 : ((scope.ApplyDifference * -1) + 1);
                        scope.NoOfJobsExceededMaxLimit = (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions)) > 0 ? (selectedJobs.length - (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions))) : 0;
                    }
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    if (scope.jobIds != data.ReqsThatCanBeApplied) {
                        if (data.ReqsThatCanBeApplied == null) {
                            _.each(scope.jobs, function (job) {
                                job.Selected = false;
                            });
                        }
                        else {
                            var splittedJobs = data.ReqsThatCanBeApplied.split(",");
                            _.each(scope.jobs, function (job) {
                                if (_.contains(splittedJobs, _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString())) {
                                    job.Selected = true;
                                }
                                else {
                                    job.Selected = false;
                                }
                            });
                        }

                    }
                    scope.jobIds = data.ReqsThatCanBeApplied;
                    scope.isGQResponsive = data.IsGQResponsiveForMultipleJobsHavingSingleGQ;
                    scope.dialogCalledfrom = 'Apply';
                    //remove duplicate jobs from the reqids
                    $timeout(function () {
                        scope.$apply();
                    }, 0);
                    if (scope.NoofJobsApplied > 0 || scope.ApplyDifference <= 0) {
                        $scope.MultipleApplyFormData = scope;
                        $('body').addClass('noScroll');
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $('body').removeClass('noScroll');
                                $.restoreFocus();
                            },
                            template: 'MultipleApplyValidations', scope: scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                        });
                    }
                    else {
                        $scope.postToNextPage("", scope, 'apply');
                    }

                }
            });
        },

        SingleJobApplyDupCheckAjax: function () {
            var Questions = $scope.jobDetailFields.JobDetailQuestions;
            jobId = _.pluck(_.where(Questions, { "VerityZone": "reqid" }), "AnswerValue").toString();
            siteId = _.pluck(_.where(Questions, { "VerityZone": "siteid" }), "AnswerValue").toString();

            var DuplicateCheckRequestForMultipleJobs = {
                clientId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                jobAndSiteIds: jobId + "_" + siteId,
                sid: $("#CookieValue").val(),
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/CheckDuplicateSubmissionForMultipleJobs",
                data: DuplicateCheckRequestForMultipleJobs,
                success: function (data) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                    $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                    if ($scope.calledFrom == "save") {
                        $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                    }
                    else if (!$scope.Applied && $scope.ApplyDifference > 0) {
                        $scope.postToNextPageFromDetails('', $scope, "apply");
                    }
                    else
                        return;
                }
            });
        },

        SelectedGroupAjax: function (clientId, siteId, jobSiteInfo) {
            var SelectedJobsRequest = {
                ClientId: clientId,
                SiteId: siteId,
                JobSiteInfo: jobSiteInfo,
                SessionID: $("#CookieValue").val()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/GroupSelectedJobs",
                data: SelectedJobsRequest,
                success: function (data) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "SelectedGroup";
                    $scope.setTitle("SelectedGroup");
                    $scope.SelectedGroups = data.Groups;
                    $scope.bSelectedGroup = true;
                    $scope.bCreateAccount = false;
                    if (!$scope.utils.isNewHash('SelectedGroup', $scope))
                        $scope.utils.updateHistory('SelectedGroup');

                    $scope.setHash();
                    setTimeout(function () {
                        $scope.scrolltop();
                        $scope.$apply();
                    }, 0);
                }
            });
        },

        GroupJobApplyAjax: function (Group, scope) {
            var switchSite = false;
            var type = "";
            if ($scope.bCandidateZone && $scope.bJobCart) {
                type = "cart-srchresults";
            }
            else {
                type = "selectedjobs-srchresults";
            }
            if (Group.siteId != $("#siteId").val()) {
                $scope.switchSite(Group.siteId, "fromApply");
                switchSite = true;
                //switch site
            }
            if (Group.GQId == "0") {
                postValues = { JobInfo: Group.JobInfo, ApplyCount: Group.reqIds.split(',').length, type: type, JobSiteId: Group.siteId, hdRft: $("#rfToken").val() };
                redirectPage = "apply.aspx";
                $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
            }
            else {
                if ($.queryParams().applyTest || Group.IsGQResponsive) {
                    //IS responsive GQ
                    if (switchSite) {
                        window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + Group.siteId + "&TQId=" + Group.GQId + "&bruid=" + encodeURIComponent($scope.encryptedBruid) + "&reqid=" + Group.reqIds + "&calledFrom=SelectedGroup";
                    }
                    else {
                        var rft = $("[name='__RequestVerificationToken']").val();
                        $.ajax({
                            method: "GET",
                            url: "/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + "&tqid=" + Group.GQId + "&localeid=" + Group.LocaleId + "&reqid=" + Group.reqIds + "&partnerid=" + $("#partnerId").val() + "&siteid=" + Group.siteId + "&wbmode=false&loadingViaAjax=true&RFT=" + rft,
                            success: function (result) {
                                $scope.$root.applyResponse = result;
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                setTimeout(function () {
                                    $scope.$apply();
                                }, 0);
                            }
                        });
                    }
                }
                else {
                    if ($scope.tgSettings.Mobileoptimised == "true") {
                        postValues = { JobInfo: Group.JobInfo, ApplyCount: Group.reqIds.split(',').length, type: type, JobSiteId: Group.siteId, GQLoginURL: "../" + Group.LocaleId + "/asp/tg/GQLogin.asp?SID=GQSESSION&gqid=" + Group.GQId + "&jobinfo=" + Group.JobInfo.replace(/%%/g, "__") + "&applycount=" + Group.reqIds.split(',').length + "&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url
                        redirectPage = "apply.aspx";
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();

                    }
                    else {
                        window.open("../../../" + Group.LocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&gqid=" + Group.GQId + "&jobinfo=" + Group.JobInfo.replace(/%%/g, "__") + "&applycount=" + Group.reqIds.split(',').length, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                        if (switchSite) {
                            window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + Group.siteId + "&PageType=selectedgroup";
                        }
                        if (angular.isDefined(scope.oActiveLaddaButton))
                            scope.oActiveLaddaButton.stop();
                    }
                }

            }
        },
        removeDuplicateJobsforMultiApply: function () {
            $scope.MultipleApplyFormData.NoOfJobsExceededMaxLimit = $scope.MultipleApplyFormData.NoOfJobsExceededMaxLimit - $scope.MultipleApplyFormData.NoofJobsApplied;
            $scope.MultipleApplyFormData.NoofJobsApplied = 0;

            ngDialog.closeAll();
            if ($scope.MultipleApplyFormData.NoofJobsApplied > 0 || $scope.MultipleApplyFormData.ApplyDifference <= 0) {
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'MultipleApplyValidations', scope: $scope.MultipleApplyFormData, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                });
            }
            else {
                $scope.postToNextPage(event, $scope.MultipleApplyFormData, 'apply');
            }

        },

        SaveToJobCartAjax: function (clientId, siteId, JobsToBeSaved, scope) {
            $scope.bJobsSaved = false;
            $scope.bJobSaved = false;
            if (JobsToBeSaved.length > 0) {
                var SaveToJobCartRequest = {
                    ClientId: clientId,
                    SiteId: siteId,
                    JobsToBeSaved: JobsToBeSaved,
                    SessionID: $("#CookieValue").val()
                };
                var url = '/TgNewUI/CandidateZone/Ajax/AddJobsToCart';
                $http.post(url, SaveToJobCartRequest).success(function (data, status, headers, config) {
                    $scope.SaveToCartPrompt(data, scope, JobsToBeSaved, $scope.bJobDetailsShown);
                });
            }
        },

        SaveToCartPrompt: function (data, oldScope, JobsToBeSaved, fromJobDetails) {
            $scope.bJobsAlreadySaved = false;
            $scope.JobsToBeDeSelected = 0;
            $scope.bJobsSavedExceeded = false;
            $scope.JobsAlreadyPresentInCart = data.JobsAlreadyPresentInCart;
            $scope.JobsAddedToCart = data.JobsAddedToCart;
            $scope.MaximumJobsToSave = 50;
            $scope.bJobsSavedReachedMaxLimit = (data.JobsSavedBeforeAddingToCart) >= $scope.MaximumJobsToSave && data.JobsToBeAddedToCart != 0 ? true : false;
            if (!$scope.bJobsSavedReachedMaxLimit) {
                $scope.bJobsSavedExceeded = (data.JobsSavedBeforeAddingToCart + data.JobsToBeAddedToCart) > $scope.MaximumJobsToSave ? true : false;
                if ($scope.bJobsSavedExceeded) {
                    $scope.JobsToBeDeSelected = (data.JobsSavedBeforeAddingToCart + data.JobsToBeAddedToCart) - ($scope.MaximumJobsToSave);
                }
                else {
                    if (data.JobsAlreadyPresentInCart != null && data.JobsAlreadyPresentInCart.length > 0) {
                        $scope.bJobsAlreadySaved = true;
                    }
                    else {
                        $scope.bJobsAlreadySaved = false;
                    }
                }
            }


            if (typeof fromJobDetails != 'undefined' && fromJobDetails && !($scope.bJobsSavedReachedMaxLimit || $scope.bJobsSavedExceeded || $scope.JobsAlreadyPresentInCart.length > 0)) {
                $scope.bJobSaved = true;
                $scope.adjustHeaderStickers();
            }
            else if ($scope.bSearchResults && !fromJobDetails && $scope.JobsAlreadyPresentInCart.length == 0 && $scope.JobsAddedToCart.length > 0) {
                $scope.bJobsSaved = true;
                $scope.adjustHeaderStickers();
            }
            else {
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        if (!$scope.bJobDetailsShown && $scope.JobsAddedToCart.length > 0 && !($scope.bCandidateZone && $scope.bJobCart)) {
                            $scope.bJobsSaved = true;
                            $scope.adjustHeaderStickers();
                        }
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'JobCartValidations', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, ariaRole: "dialog", appendTo: '#dialogContainer'
                });
            }
            $scope.CallApply();
        },

        RemoveFromJobCartAjax: function (clientId, siteId, jobSiteInfo, jobFromDashBoard) {
            $scope.bJobRemovalStatus = false;
            var SelectedJobsRequest = {
                ClientId: clientId,
                SiteId: siteId,
                JobSiteInfo: jobSiteInfo,
                SessionID: $("#CookieValue").val()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RemoveSelectedJobs",
                data: SelectedJobsRequest,
                success: function (data) {
                    if (data.isSucess) {
                        $scope.bNotAppliedJobsInJobCart = false;
                        $scope.bAppliedJobsInJobCart = false;
                        if (typeof jobFromDashBoard != "undefined") {
                            _.remove($scope.jobs, jobFromDashBoard);
                        }
                        else {
                            $scope.jobs = _.where($scope.jobs, { "Selected": false });
                        }
                        $scope.CandZoneSavedJobsCount = $scope.jobs.length;
                        $scope.savedJobsCache = $scope.jobs;
                        $scope.bJobRemovalStatus = true;
                        if ($scope.jobs != null && $scope.jobs.length > 0) {
                            $scope.scrolltop();
                            if (_.where($scope.jobs, { "Applied": false }).length > 0) {
                                $scope.bNotAppliedJobsInJobCart = true;
                            }
                            if (_.where($scope.jobs, { "Applied": true }).length > 0) {
                                $scope.bAppliedJobsInJobCart = true;
                            }
                        }
                        $scope.SelectedJobsChecked = false;
                        setTimeout(function () {
                            $scope.$apply();
                        }, 0);
                        if (!$scope.utils.isNewHash('JobCart', $scope))
                            $scope.utils.updateHistory('JobCart');
                        if (!$scope.utils.isNewHash('SavedJobs', $scope))
                            $scope.utils.updateHistory('SavedJobs');
                        if (!$scope.utils.isNewHash('SavedSearches', $scope)) {
                            $scope.oHistory["SavedSearches"].CandZoneSavedJobsCount = $scope.CandZoneSavedJobsCount;
                        }
                        if (!$scope.utils.isNewHash('Applications', $scope)) {
                            $scope.oHistory["Applications"].CandZoneSavedJobsCount = $scope.CandZoneSavedJobsCount;
                        }
                    }
                }
            });
        },


        ViewJobCartAjax: function (fromDashBoard) {
            if (fromDashBoard && $scope.savedJobsCache != null && $scope.savedJobsCache.length > 0) {
                $scope.bJobCart = true;
                $scope.jobs = $scope.savedJobsCache;
                $scope.CallApply();
                return;
            }
            var jobCartRequest = {
                partnerId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                sid: $("#CookieValue").val(),
                configuredJobTitle: $scope.GetConfiguredJobTitle()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/ViewJobCart",
                data: jobCartRequest,
                success: function (data) {
                    $scope.renderJobCart(data, fromDashBoard);
                    if (!$scope.utils.isNewHash('JobCart', $scope))
                        $scope.utils.updateHistory('JobCart');
                    $scope.setHash();
                }
            });
        },

        renderJobCart: function (response, fromDashBoard) {
            $scope.bNotAppliedJobsInJobCart = false;
            $scope.bAppliedJobsInJobCart = false;
            $scope.bJobRemovalStatus = false;
            $scope.bInitialLoad = false;
            $scope.SelectedJobsChecked = false;
            if ($scope.jobsCache == null) {//As the Jobs gets overrided with Saved Jobs, Saving them to a temp, such that we can assign them back, When Job Cart is left.
                $scope.jobsCache = $scope.jobs;
            }
            $scope.jobs = response.SavedJobs;
            if (fromDashBoard) {
                $scope.CandZoneSavedJobsCount = $scope.jobs.length;
            }
            if ($scope.jobs != null && $scope.jobs.length > 0) {
                if (_.where($scope.jobs, { "Applied": false }).length > 0) {
                    $scope.bNotAppliedJobsInJobCart = true;
                }
                if (_.where($scope.jobs, { "Applied": true }).length > 0) {
                    $scope.bAppliedJobsInJobCart = true;
                }
            }
            $scope.savedJobsCache = $scope.jobs;
            if (response.ExpiredJobs != null && response.ExpiredJobs.length > 0) {
                $scope.bShowExpiredJobAlert = true;
                $scope.expiredJobs = response.ExpiredJobs;
            }
            else {
                $scope.bShowExpiredJobAlert = false;
            }
            $scope.bJobCart = true;
            if ($scope.bJobDetailsShown) {
                $scope.bJobDetailsShown = false;
            }
            if (!fromDashBoard) {
                $scope.bCandidateZone = true;
                $timeout(function () { appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = 'JobCart'; }, 0);
            }
            $scope.CloseDialogs();
            $scope.scrolltop();
            $scope.CallApply();
            if (fromDashBoard) {
                $scope.alignCards("SavedJobsContainer", "jobCard");
            }
        },

        alignCards: function (container, elementClass) {
            var isApplicationsContainer = false;
            if (container == "ApplicationsContainer") {
                isApplicationsContainer = true;
                container = "CollapsedUnfinishedApplications";
            }
            $("." + container + " ." + elementClass).css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');
            $timeout(function () {
                var heights = $("." + container + " ." + elementClass).map(function () {
                    return $(this).height();
                }).get();
                var maxHeight = _.max(heights);
                $("." + container + " ." + elementClass).height(maxHeight).find('.cardFooter').addClass('cardFooterPosition');
            }, 0);
            if (isApplicationsContainer) {
                $scope.alignCards("CollapsedAppliedApplications", "jobCard");
            }
        },

        FileManagerAjax: function () {
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.setTitle("MyFile");
            $scope.bcandidatezoneSubmenu = false;
            var fileManagerRequest = {
                partnerId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                sid: $("#CookieValue").val()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/FileManager",
                data: fileManagerRequest,
                success: function (data) {
                    $scope.renderFileManager(data);
                    if (!$scope.utils.isNewHash('myFiles', $scope))
                        $scope.utils.updateHistory('myFiles');
                    $scope.setHash();
                    $scope.loadwebtrackerscript("/TGNewUI/MyFiles", $scope.customScriptRendering.CandidateZone);
                }
            });
        },

        resetFileStatus: function () {
            $scope.fileStatus = 0;
        },

        resetCategory: function () {
            $('#AttachementCatagory').val('');
            $('#AttachementCatagory-button_text').text($('#attachmentCategoryPlaceHolder').text());
        },

        renderFileManager: function (response) {
            $scope.bFileManager = true;
            $scope.bEditProfileEditMode = false;
            var savedFiles = response.SavedFiles;

            $scope.savedResumes = _.filter(savedFiles, function (file) {
                return file.FileType == 0;
            });

            $scope.savedCoverLetters = _.filter(savedFiles, function (file) {
                return file.FileType == 1;
            });

            $scope.savedAttachments = _.filter(savedFiles, function (file) {
                return file.FileType == 2;
            });

            $scope.savedCategories = _.keys(_.countBy($scope.savedAttachments, function (file) { return file.CategoryName; }));

            $scope.attachmentCategories = response.AttachmentCategories;

            if (!$scope.utils.isNewHash('MyFile', $scope))
                $scope.utils.updateHistory('MyFile');
            $scope.setHash();

            $scope.scrolltop();
            $scope.CallApply();
            if ($scope.fileStatus == 3) {
                setTimeout(function () { $scope.resetCategory(); }, 0);
            }
            setTimeout(function () {
                $('#AttachementCatagory-button').attr("aria-controls", "AttachementCatagory");
            }, 500);
        },

        addAttachment: function () {
            if ($("#AttachementCatagory").val() != undefined && $("#AttachementCatagory").val() != "") {
                if ($scope.candidatezoneSubView == "ApplicationAddFiles")
                    $scope.addFile("2", $("#AttachementCatagory").val(), "appdetails");
                else
                    $scope.addFile("2", $("#AttachementCatagory").val(), "addfile");
            }
        },

        openFile: function (filePath, FileName) {
            filePath = filePath.replace(/\+/g, "_plus_");
            var BRUID;
            if ($scope.encryptedBruid.indexOf('+') === -1)
                BRUID = $scope.encryptedBruid;
            else
                BRUID = $scope.encryptedBruid.replace(/\+/g, "_plus_");
            window.location.href = "/TGNewUI/Profile/Home/PreviewResume?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&EncryptedResumePath=" + filePath + " &FileName=" + encodeURIComponent(FileName) + "&BRUID=" + BRUID;
        },

        openAttachment: function (AttchmentName, AttachmentID) {

            var BRUID;
            if ($scope.encryptedBruid.indexOf('+') === -1)
                BRUID = $scope.encryptedBruid;
            else
                BRUID = $scope.encryptedBruid.replace(/\+/g, "_plus_");

            window.location.href = "/GQWeb/DownloadAttachment?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&BRUID=" + BRUID + "&FileName=" + encodeURIComponent(AttchmentName) + "&AttachmentId=" + AttachmentID;
        },

        addFile: function (fileType, AttachmentCat, source) {
            var calledFrom = "addfile";
            if (typeof source != 'undefined' && source != null && source != "") {
                calledFrom = source;
            }
            var title = '';
            if (fileType == "0") {
                title = $scope.dynamicStrings.Heading_AddResume;
            }
            else if (fileType == "1") {
                title = $scope.dynamicStrings.Heading_AddCoverLetter;
            }
            else if (fileType == "2" && typeof AttachmentCat != "undefined") {
                var indexOfDot = AttachmentCat.indexOf(".");
                title = $scope.dynamicStrings.Title_Attachments.replace("[Category]", AttachmentCat.substr(indexOfDot + 1).replace("'", "&apos;"));
            }
            ngDialog.open({
                preCloseCallback: function (value) {
                    var $iframe = $("#profileBuilder"),
                         frameWindow = $iframe.prop("contentWindow");

                    if (frameWindow != undefined) {
                        frameWindow.blur();
                        document.body.focus();
                        $iframe.remove();
                    }

                    if (AttachmentCat) {
                        $scope.resetCategory();
                    }
                },
                template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='" + title + "' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&calledFrom=" + calledFrom + "&FileType=" + fileType + "&AttachmentCat=" + encodeURI(AttachmentCat) + "' tabindex='0'> </iframe>",
                plain: true,
                className: 'ngdialog-theme-default customDialogue dialogWithIFrame',
                showClose: false,
                appendTo: "#dialogContainer",
                closeByDocument: false
            });
        },

        getPenddingAttachmentsByCat: function (catId) {
            return $.grep($scope.penddingAttachments, function (e) { return e.CategoryId == catId; })
        },

        removePenddingAttachment: function (attchmentId) {
            $scope.penddingAttachments = $.grep($scope.penddingAttachments, function (e) { return e.Id != attchmentId; })
        },

        attachFilesToApplication: function () {
            var reqId = $scope.appliedApplicationDetail.ReqId;
            var attchmentIds = $.map($scope.penddingAttachments, function (obj) { return obj.Id }).join(',');

            var attachFilesRequest = {
                partnerId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                sid: $("#CookieValue").val(),
                reqId: reqId,
                attachmentIds: attchmentIds
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/AttachFilesToApplication",
                data: attachFilesRequest,
                success: function (data) {
                    var status = 0;
                    if (data.Success) {
                        status = 1;
                    } else {
                        status = -1;
                    }
                    $scope.penddingAttachments = [];

                    $scope.DashBoardBack();
                    $timeout(function () {
                        $scope.attachFilesStatus = status;
                        $scope.adjustHeaderStickers();
                    }, 300);
                }
            });
        },

        showRemovePromt: function (job) {
            $('body').addClass('noScroll');
            var dialog = ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                    $.restoreFocus();
                },
                template: 'RemovalConfirmation',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue RemovalConfirmationContainer',
                showClose: true,
                closeByDocument: false,
                appendTo: "#dialogContainer",
                ariaRole: "dialog",
                data: { Job: job }
            });
        },
        deleteFile: function (fileType, fileId, isDeletable) {
            var dialog = ngDialog.open({
                template: 'DeleteFileConfirmationTemplate',
                className: 'ngdialog-theme-default',
                showClose: true,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog",
                data: { FileType: fileType, FileDeletable: isDeletable }
            });
            dialog.closePromise.then(function (data) {
                if (data.value == '1') {
                    var fileManagerRequest = {
                        partnerId: $("#partnerId").val(),
                        siteId: $("#siteId").val(),
                        sid: $("#CookieValue").val(),
                        fileType: fileType,
                        fileId: fileId
                    };
                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/CandidateZone/Ajax/DeleteFile",
                        data: fileManagerRequest,
                        success: function (data) {
                            if (fileType == 0)
                                $scope.fileStatus = -1;
                            else if (fileType == 1)
                                $scope.fileStatus = -2;
                            else if (fileType == 2)
                                $scope.fileStatus = -3;

                            $scope.renderFileManager(data);
                        }
                    });
                } else {
                    angular.beforeDialogClose();
                }
            });
        },

        AccountSettingsView: function () {
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "AccountSettings";
            $scope.setTitle("AccountSettings");
            $scope.bInitialLoad = false;
            if (!$scope.updateAccount.login) {
                $scope.updateAccount =
                    {
                        login: {
                            userName: '',
                            currentPassword: '',
                            newPassword: '',
                            confirmNewPassword: ''
                        },
                        errormsgs: [],
                        displayPasswordErrorBox: false,
                        displayRePasswordErrorBox: false,
                        mainError: '',
                        updated: '',
                        submitted: false,
                        LIOption: 1,
                        FBOption: 1,
                        LIConnect: false,
                        FBConnect: false,
                        TWConnect: false,
                        SMUpdateStatus: 0
                    };
            };
            var accountSettingsRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val()
            };
            $scope.SMSConsentInfo = null;
            $scope.editTextMessagingSettings = false;
            $('#menuContainer').empty();
            $http.post("/TgNewUI/CandidateZone/Ajax/ViewAccountSettings", accountSettingsRequest).success(function (data, status, headers, config) {
                $scope.SMSConsentInfo = data.SMSConsentInfo;
                if ($scope.tgSettings.SSOGateway != "1") {
                    $scope.UserName = data.LoginInfo;
                }
                _.forEach(data.SMAuthorizations, function (sm) {
                    switch (sm.SMId) {
                        case 1:
                            $scope.updateAccount.LIConnect = true;
                            $scope.updateAccount.LIOption = sm.Option;
                            break;
                        case 2:
                            $scope.updateAccount.FBConnect = true;
                            $scope.updateAccount.FBOption = sm.Option;
                            break;
                        case 3:
                            $scope.updateAccount.TWConnect = true;
                            break;
                        case 12:
                            $scope.updateAccount.GoogleConnect = true;
                            break;
                    }
                });
                if (!$scope.updateAccount.LIConnect) {
                    $scope.updateAccount.LINewOption = 1;
                }
                if (!$scope.updateAccount.FBConnect) {
                    $scope.updateAccount.FBNewOption = 1;
                }

                $scope.loadwebtrackerscript("/TGNewUI/AccountSettings", $scope.customScriptRendering.CandidateZone);
            }
            );
            $scope.subViewInitialized = true;
            if (!$scope.utils.isNewHash('accountSettings', $scope))
                $scope.utils.updateHistory('accountSettings');
            $scope.setHash();
        },

        updateLogin: function (updateType) {
            $scope.updateAccount.login = {
                userName: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            };
            $scope.updateAccount.mainError = '';
            if (updateType == 'security') {
                $scope.ResetChangeSecQuestfunction($scope);
                var url = "/TgNewUI/CandidateZone/Ajax/GetSecurityQuestions";
                var securityQuestionRequest = {};
                securityQuestionRequest.ClientId = $("#partnerId").val();
                securityQuestionRequest.SiteId = $("#siteId").val();
                securityQuestionRequest.SessionID = $("#CookieValue").val();
                $http.post(url, securityQuestionRequest).success(function (data, status, headers, config) {
                    if (data) {
                        if (data.SecurityAnswerOne) {
                            $scope.ChangeSecQuest.securityQuestion.value1 = data.SecurityQuestionOneId.toString();
                            $scope.ChangeSecQuest.securityQuestion.answer1 = data.SecurityAnswerOne;
                        }
                        if (data.SecurityAnswerTwo) {
                            $scope.ChangeSecQuest.securityQuestion.value2 = data.SecurityQuestionTwoId.toString();;
                            $scope.ChangeSecQuest.securityQuestion.answer2 = data.SecurityAnswerTwo;
                        }
                        if (data.SecurityAnswerThree) {
                            $scope.ChangeSecQuest.securityQuestion.value3 = data.SecurityQuestionThreeId.toString();;
                            $scope.ChangeSecQuest.securityQuestion.answer3 = data.SecurityAnswerThree;
                        }
                    };
                    setTimeout(function () {
                        $scope.$apply();
                        $('#optSecurityQuestion1').selectmenu('refresh', true);
                        $('#optSecurityQuestion2').selectmenu('refresh', true);
                        $('#optSecurityQuestion3').selectmenu('refresh', true);
                    }, 10);
                }).error(function (data, status, headers, config) {
                    $scope.updateAccount.mainError = "Error getting security questions";
                    console.log("failed with status of " + status);
                    return false;
                });

            }
            $('body').addClass('noScroll');
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                    $.restoreFocus();
                },
                template: 'resetUserNamePasswordTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue updateAccountDialog',
                showClose: true,
                closeByDocument: false,
                appendTo: "#dialogContainer",
                ariaRole: "dialog",
                data: { UpdateType: updateType }
            });


        },

        openSendToFriend: function (sendToFriendCalledFrom, jobs) {

            var jobTitles = [];
            var moreJobTitles = [];
            var nameString = "", emailID = "";
            $scope.sendToFriendCalledFrom = sendToFriendCalledFrom;
            if (sendToFriendCalledFrom == "1") {
                $.each(jobs, function (key, job) {
                    var obj = $.grep(job.Questions, function (e) { return e.ClassName == "jobtitle" });
                    var info = {};
                    info.ClassName = "jobtitleInJobDetails";
                    info.AnswerValue = obj[0].Value
                    if (key < 3) {
                        jobTitles.push(info);
                    }
                    else {
                        moreJobTitles.push(info)
                    }
                }
            )
            }
            else {
                jobTitles = $.grep(jobs.JobDetailQuestions, function (e) { return e.ClassName == "jobtitleInJobDetails" });
            }
            //Multiple Flows are effecting the fillup of updated contact e-mail Adress of cand in send to friend input field
            //Hence making an ajax call for getting the latest profile dets via ajax call.
            if ($scope.bLoggedIn) {
                var profiledetailsRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SessionID: $("#CookieValue").val(),
                    ResponsiveCandidateZone: $scope.bresponsiveCandidateZone
                };
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/Search/Ajax/Getprofiledetails",
                    data: profiledetailsRequest,
                    success: function (data) {
                        if ($scope.ProfileDetails == null || (typeof $scope.ProfileDetails == "undefined")) {
                            $scope.ProfileDetails = {};
                        }
                        $scope.ProfileDetails.FirstName = data.BasicProfileDetails.FirstName;
                        $scope.ProfileDetails.LastName = data.BasicProfileDetails.LastName;
                        $scope.ProfileDetails.email = emailID = data.BasicProfileDetails.email;
                        nameString = $scope.ProfileDetails ? ($scope.ProfileDetails.FirstName ? $scope.ProfileDetails.FirstName : "") + ($scope.ProfileDetails.LastName ? " " + $scope.ProfileDetails.LastName : "") : "";
                        $scope.openSendToFriendDialog(nameString, jobTitles, moreJobTitles, emailID);
                    }
                });
            }
            else {
                $scope.openSendToFriendDialog(nameString, jobTitles, moreJobTitles, emailID);
            }
        },
        openSendToFriendDialog: function (nameString, jobTitles, moreJobTitles, emailID) {

            $scope.sendToFriendInfo = {
                email: '',
                name: nameString,
                yourEmail: emailID,
                jobTitles: jobTitles,
                moreJobTitles: moreJobTitles,
                showMore: false,
            };
            $('body').addClass('noScroll');
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                    $.restoreFocus();
                },
                template: 'sendToFriendTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue updateAccountDialog',
                showClose: false,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog",
                data: {}
            });

        },

        sendToFriendMoreClick: function () {
            $scope.showMore = !$scope.showMore;
        },

        submitSendToFriend: function (sendToFriendForm, scope) {
            $scope.sendToFriendInfo.mainError = '';
            $scope.sendToFriendInfo.errormsgs = [];
            $("[aria-invalid]").removeAttr("aria-invalid");

            $.each(sendToFriendForm.$error, function (errorType, allErrors) {
                if (allErrors != false) {
                    if (errorType == "required") {

                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            msg.error = ' - ' + $scope.getRequiredErrorByName(error.$name);
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.sendToFriendInfo.errormsgs.push(msg);

                        });
                    }

                    if (errorType == "pattern") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if (error.$name == "yourName")
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidName;
                            else
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidEmail;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.sendToFriendInfo.errormsgs.push(msg);
                        });
                    }
                }
            });

            if (sendToFriendForm.$valid) {

                var sendToFriendRequest = {};
                sendToFriendRequest.ClientId = $("#partnerId").val();
                sendToFriendRequest.SiteId = $("#siteId").val();
                sendToFriendRequest.jobInfo = $scope.jobInfo;
                sendToFriendRequest.fromEmailAddress = sendToFriendForm.yourEmail.$modelValue
                sendToFriendRequest.ToEmailAddress = sendToFriendForm.email.$modelValue
                sendToFriendRequest.JobSiteInfo = $scope.jobSiteInfo;
                sendToFriendRequest.CalledFromPage = $scope.sendToFriendCalledFrom;
                sendToFriendRequest.senderName = sendToFriendForm.yourName.$modelValue

                url = '/TgNewUI/Search/Ajax/SendToFriend';

                $http.post(url, sendToFriendRequest).success(function (data, status, headers, config) {

                    if (data.EmailStatus == '0') {
                        $scope.sendToFriendInfo.emailSent = sendToFriendRequest.CalledFromPage;
                    }
                    else {
                        $scope.sendToFriendInfo.emailSent = 'error'
                    }
                    ngDialog.closeAll();

                })

            }

        },
        submitUpdateAccount: function (updateAccountForm, scope) {
            $scope.updateAccount.mainError = '';
            $scope.updateAccount.errormsgs = [];
            $("[aria-invalid]").removeAttr("aria-invalid");
            if ($scope.updateAccount.login.newPassword && $scope.updateAccount.login.newPassword != "" && $scope.updateAccount.login.newPassword.indexOf(" ") > 0) {
                var msg = {};
                msg.label = '';
                msg.error = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                msg.field = "password";
                $("#" + msg.field).attr("aria-invalid", "true");
                $scope.updateAccount.errormsgs.push(msg);
                updateAccountForm.newPassword.$setValidity("containsSpace", false);
                return;
            }

            var updateType = scope.ngDialogData.UpdateType;
            if (updateType == 'security') {
                $scope.ChangeSecQuest.submitted1 = true;
                $scope.ChangeSecQuest.submitted2 = true;
                $scope.ChangeSecQuest.submitted3 = true;

                updateAccountForm.selectSecurityQuestion1.$setValidity('duplicate', true);
                if (updateAccountForm.selectSecurityQuestion2)
                    updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', true);
                if (updateAccountForm.selectSecurityQuestion3)
                    updateAccountForm.selectSecurityQuestion3.$setValidity('duplicate', true);

                updateAccountForm.securityQuestion1Answer.$setValidity('duplicate', true);
                if (updateAccountForm.securityQuestion2Answer)
                    updateAccountForm.securityQuestion2Answer.$setValidity('duplicate', true);
                if (updateAccountForm.securityQuestion3Answer)
                    updateAccountForm.securityQuestion3Answer.$setValidity('duplicate', true);

                //check Duplicate Question
                if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value2) {
                        updateAccountForm.selectSecurityQuestion1.$setValidity('duplicate', false);
                        updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', false);
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) && scope.ChangeSecQuest.securityQuestion.value3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value3) {
                        updateAccountForm.selectSecurityQuestion1.$setValidity('duplicate', false);
                        updateAccountForm.selectSecurityQuestion3.$setValidity('duplicate', false);
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) && scope.ChangeSecQuest.securityQuestion.value3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.value2 == scope.ChangeSecQuest.securityQuestion.value3) {
                        updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', false);
                        updateAccountForm.selectSecurityQuestion3.$setValidity('duplicate', false);
                    }
                }


                //check for duplicate answer
                if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer2) {
                        updateAccountForm.securityQuestion1Answer.$setValidity('duplicate', false);
                        updateAccountForm.securityQuestion2Answer.$setValidity('duplicate', false);
                        scope.ChangeSecQuest.errorAnwser1 = true;
                        scope.ChangeSecQuest.errorAnwser2 = true;
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) && scope.ChangeSecQuest.securityQuestion.answer3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer3) {
                        updateAccountForm.securityQuestion1Answer.$setValidity('duplicate', false);
                        updateAccountForm.securityQuestion3Answer.$setValidity('duplicate', false);
                        scope.ChangeSecQuest.errorAnwser1 = true;
                        scope.ChangeSecQuest.errorAnwser3 = true;
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) && scope.ChangeSecQuest.securityQuestion.answer3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.answer2 == scope.ChangeSecQuest.securityQuestion.answer3) {
                        updateAccountForm.securityQuestion2Answer.$setValidity('duplicate', false);
                        updateAccountForm.securityQuestion3Answer.$setValidity('duplicate', false);
                        scope.ChangeSecQuest.errorAnwser2 = true;
                        scope.ChangeSecQuest.errorAnwser3 = true;
                    }
                }
            }

            $.each(updateAccountForm.$error, function (errorType, allErrors) {
                if (allErrors != false) {
                    if (errorType == "required") {
                        var nxtvalue = 0;
                        $.each(allErrors, function (index, error) {
                            if (error.$name != "confirmNewPassword") {
                                var msg = {};
                                if (nxtvalue == 0 || error.$name != 'securityQuestion' + nxtvalue + 'Answer') {
                                    msg.label = $scope.getLabelByName(error.$name);
                                    msg.error = ' - ' + $scope.getRequiredErrorByName(error.$name);
                                    msg.field = error.$name;
                                    $("#" + msg.field).attr("aria-invalid", "true");
                                    $scope.updateAccount.errormsgs.push(msg);
                                }
                                if (error.$name == 'updateSecurityQuestion1') {
                                    nxtvalue = 1;
                                }
                                else if (error.$name == 'updateSecurityQuestion2') {
                                    nxtvalue = 2;
                                }
                                else if (error.$name == 'updateSecurityQuestion3') {
                                    nxtvalue = 3;
                                }
                                else {
                                    nxtvalue = 0;
                                }
                            }
                        });
                    }
                    if (errorType == "duplicate") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if (error.$name.indexOf('Answer') >= 0) {
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SecurityAnswerMustBeUnique;
                                msg.field = error.$name;
                            }
                            else {
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SecurityQuestionAlreadyUsed;
                                msg.field = error.$name.replace('select', 'opt');
                            }

                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "notValidLength") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default' || error.$name == "currentPassword")
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe6characters;
                            else
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "noSpecialCharacter") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            msg.error = ' - ' + $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "pattern") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if (updateType == "username") {
                                if ($scope.tgSettings.LoginType == '1')
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidUsername;
                                else
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidEmail;
                            } else if (updateType == "security") {
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidSecurityAnswer;
                            }
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "nxEqual") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.dynamicStrings.Label_ReenterPassword;
                            msg.error = ' - ' + $scope.dynamicStrings.Errormessage_PasswordMustMatch;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                }
            });


            if (updateAccountForm.$valid) {
                if ($scope.updateAccount.mainError == "") {
                    var updateAccountRequest = {};
                    updateAccountRequest.ClientId = $("#partnerId").val();
                    updateAccountRequest.SiteId = $("#siteId").val();
                    var url;
                    if (updateType == 'username') {
                        updateAccountRequest.SessionID = $("#CookieValue").val();
                        updateAccountRequest.LoginInfo = $scope.updateAccount.login.userName;
                        url = '/TgNewUI/CandidateZone/Ajax/UpdateLogin';
                    }
                    else if (updateType == 'password') {
                        updateAccountRequest.EncryptedSessionId = $("#CookieValue").val();
                        updateAccountRequest.OldPassword = $scope.updateAccount.login.currentPassword;
                        updateAccountRequest.NewPassword = $scope.updateAccount.login.newPassword;
                        updateAccountRequest.Source = 'AccountSettings';
                        url = '/TgNewUI/CandidateZone/Ajax/ChangePassword';
                    } else if (updateType == 'security') {
                        updateAccountRequest = {};
                        updateAccountRequest.partnerId = $("#partnerId").val();
                        updateAccountRequest.siteId = $("#siteId").val();
                        updateAccountRequest.SQuestionOne = ($scope.ChangeSecQuest.securityQuestion.value1 === '') ? '' : $scope.ChangeSecQuest.securityQuestion.value1;
                        updateAccountRequest.SQuestionTwo = ($scope.ChangeSecQuest.securityQuestion.value2 === '') ? '' : $scope.ChangeSecQuest.securityQuestion.value2;
                        updateAccountRequest.SQuestionThree = ($scope.ChangeSecQuest.securityQuestion.value3 === '') ? '' : $scope.ChangeSecQuest.securityQuestion.value3;
                        updateAccountRequest.SAnswerOne = ($scope.ChangeSecQuest.securityQuestion.answer1 == '') ? '' : $scope.ChangeSecQuest.securityQuestion.answer1;
                        updateAccountRequest.SAnswerTwo = ($scope.ChangeSecQuest.securityQuestion.answer2 == '') ? '' : $scope.ChangeSecQuest.securityQuestion.answer2;
                        updateAccountRequest.SAnswerThree = ($scope.ChangeSecQuest.securityQuestion.answer3 == '') ? '' : $scope.ChangeSecQuest.securityQuestion.answer3;
                        updateAccountRequest.cookievalue = $("#CookieValue").val();
                        updateAccountRequest.Source = 'AccountSettings';
                        url = '/TgNewUI/Search/Ajax/ChangeSecurityQuestion';
                    } else if (updateType == 'delete') {
                        updateAccountRequest.SessionID = $("#CookieValue").val();
                        url = '/TgNewUI/CandidateZone/Ajax/DeleteAccount';
                    }
                    $http.post(url, updateAccountRequest).success(function (data, status, headers, config) {
                        if (data) {
                            if (updateType == 'username') {
                                if (data.Result == "-1") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdateLoginFail;
                                    return false;
                                }
                                else if (data.Result == "3") { //bad username
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UsenameAlreadyUsed;
                                    return false;
                                }
                                else if (data.Result == "0") {
                                    $scope.UserName = $scope.updateAccount.login.userName;
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $timeout(function () {
                                        $scope.$apply();
                                    }, 0);
                                    return true;
                                }
                            } else if (updateType == 'password') {
                                if (data.Result == "0") {
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $timeout(function () {
                                        $scope.$apply();
                                    }, 0);
                                    return true;
                                } else if (data.Result == "3") {
                                    //$scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;

                                    var msg = {};
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                                    msg.field = "newPassword";
                                    msg.label = $scope.getLabelByName("newPassword");
                                    $scope.updateAccount.errormsgs.push(msg);
                                    updateAccountForm.newPassword.$setValidity("passwordSameAsUsername", false);
                                    return false;
                                } else if (data.Result == "5") {
                                    var msg = {};
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RecentlyUsedPasswrd;
                                    msg.field = "newPassword";
                                    msg.label = $scope.getLabelByName("newPassword");
                                    $scope.updateAccount.errormsgs.push(msg);
                                    updateAccountForm.newPassword.$setValidity("recentlyUsedPasswrd", false);
                                    return false;
                                }
                                else if (data.Result == "6" || data.Result == "7") {
                                    if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                        $scope.updateAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe6characters
                                    else
                                        $scope.updateAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                                    return false;
                                }
                                else if (data.Result == "8") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                                    return false;
                                }
                                else if (data.Result == "9") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                                    return false;
                                } else if (data.Result == "11") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_IncorrectCurrentPassword;
                                    return false;
                                }
                                else if (data.Result == "12") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_PasswordRecentChange;
                                    return false;
                                } else if (data.Result == "4") {
                                    var msg = {};
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SameOldNewPasswrd;
                                    msg.field = "newPassword";
                                    msg.label = $scope.getLabelByName("newPassword");
                                    $scope.updateAccount.errormsgs.push(msg);
                                    updateAccountForm.newPassword.$setValidity("sameOldNewPasswrd", false);
                                    return false;
                                }
                                else {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdatePasswordFail;
                                    console.log("failed with status of " + status);
                                    return false;
                                }

                            } else if (updateType == 'security') {
                                if (data.Success == true) {
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $timeout(function () {
                                        $scope.$apply();
                                    }, 0);
                                    return true;
                                } else {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdateSecurityQuestionFail;
                                    console.log("failed with status of " + status);
                                    return false;
                                }
                            } else if (updateType == 'delete') {
                                if (data.Result == '1') {
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $scope.logOutCandidate();
                                    return true;
                                }
                            }
                        };
                    }).error(function (data, status, headers, config) {
                        $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdateLoginFail;
                        console.log("failed with status of " + status);
                        return false;
                    });
                }
            }
            else {
                $(".errorContainer:visible").setFocus();
                setTimeout(function () {
                    $(".ngdialog-content").scrollTop(0);
                }, 0);
            }
        },

        showInvalidUpdateLoginDetails: function () {
            if (["optSecurityQuestion1", "optSecurityQuestion2", "optSecurityQuestion3"].indexOf($('#updateAccountForm .ng-invalid').first().attr("ID")) !== -1) {
                $('[id="' + $('#updateAccountForm .ng-invalid').first().attr("ID") + '-button"]').focus();
            }
            else
                $('#updateAccountForm .ng-invalid').first().focus();
        },

        updateSMSetting: function (smSite, revokeAccess) {
            if (smSite == 2 && !revokeAccess) {
                if ($scope.updateAccount.FBNewOption == $scope.updateAccount.FBOption) {
                    $scope.updateAccount.SMUpdateStatus = -2;
                    $scope.updateAccount.SMUpdateError = 'Option has not changed';
                    return;
                }
            }
            var updateAccountRequest = {};
            updateAccountRequest.ClientId = $("#partnerId").val();
            updateAccountRequest.SiteId = $("#siteId").val();
            updateAccountRequest.SessionID = $("#CookieValue").val();
            updateAccountRequest.SMSiteId = smSite;
            if (revokeAccess) {
                updateAccountRequest.Option = -1;
            } else if (smSite == 2) {
                updateAccountRequest.Option = $scope.updateAccount.FBNewOption;
            }
            url = '/TgNewUI/CandidateZone/Ajax/UpdateSocialMediaSetting';
            $http.post(url, updateAccountRequest).success(function (data, status, headers, config) {
                if (data) {
                    if (data.Result == 1) {
                        $scope.updateAccount.SMUpdate = 0;
                        if (revokeAccess) {
                            $scope.updateAccount.SMUpdateStatus = 3 + smSite;
                            switch (smSite) {
                                case 1:
                                    $scope.updateAccount.LIConnect = false;
                                    $scope.updateAccount.LINewOption = 1;
                                    break;
                                case 2:
                                    $scope.updateAccount.FBConnect = false;
                                    $scope.updateAccount.FBNewOption = 1;
                                    break;
                                case 3:
                                    $scope.updateAccount.TWConnect = false;
                                    break;
                                case 12:
                                    $scope.updateAccount.GoogleConnect = false;
                                    $scope.updateAccount.SMUpdateStatus = 11;
                                    break;
                            }
                        } else {
                            $scope.updateAccount.SMUpdateStatus = smSite;
                            if (smSite == 2) {
                                $scope.updateAccount.FBOption = $scope.updateAccount.FBNewOption;
                            }
                        }
                    } else {
                        $scope.updateAccount.SMUpdateStatus = -1 * smSite;
                    }
                };
            }).error(function (data, status, headers, config) {
                $scope.updateAccount.mainError = "Update Social Media setting failed";
                console.log("failed with status of " + status);
                return false;
            });
        },

        authorizeSM: function (smSite, isUpdate) {
            var option = 2;
            if (smSite == 1) {
                if (isUpdate && $scope.updateAccount.LINewOption == $scope.updateAccount.LIOption) {
                    $scope.updateAccount.SMUpdateStatus = 1; //not need to update
                    $scope.updateAccount.SMUpdate = 0;
                    return;
                }
                option = $scope.updateAccount.LINewOption;
            }
            else if (smSite == 2)
                option = $scope.updateAccount.FBNewOption;
            var BRUID;
            if ($scope.encryptedBruid.indexOf('+') === -1)
                BRUID = $scope.encryptedBruid;
            else
                BRUID = $scope.encryptedBruid.replace(/\+/g, "||");

            if (smSite == 12) {
                $('#GoogleRenderedButton').children(":first").trigger('click');
            }
            else {
                var socialmediaurl = "../../../tgwebhost/socialmediaIntegration.aspx?action=smsetting&smsid=" + smSite + "&clientid=" + $("#partnerId").val() + "&bruid=" + BRUID + "&callee=TG&tgsiteid=" + $("#siteId").val() + "&option=" + option + "&sid=" + $("#SIDValue").val() + "&oht=1";
                window.open(socialmediaurl, "_blank", "resizable=yes,scrollbar=yes, top=200, left=200");
            }
        },

        createConnection: function () {
            var createConnectionRequest = {};
            createConnectionRequest.PartnerId = $("#partnerId").val();
            createConnectionRequest.SiteId = $("#siteId").val();
            createConnectionRequest.SMSiteId = appScope.SM_SiteID;
            createConnectionRequest.LoggedInWithSocialMedia = true;
            createConnectionRequest.EncryptedSessionId = $("#CookieValue").val();


            var basicProfileInfo = {};
            basicProfileInfo.SM_ProfileID = appScope.SM_ProfileID;
            basicProfileInfo.SM_AccessToken = appScope.SM_AccessToken;
            basicProfileInfo.SM_FullName = appScope.SM_FullName;
            basicProfileInfo.SM_FirstName = appScope.SM_FirstName;
            basicProfileInfo.SM_LastName = appScope.SM_LastName;
            basicProfileInfo.SM_EmailID = appScope.SM_EmailID;
            basicProfileInfo.SM_ProfilePicture = appScope.SM_ProfilePicture;
            basicProfileInfo.SM_SiteID = appScope.SM_SiteID;

            createConnectionRequest.SocialMediaLoginRequest = basicProfileInfo;

            url = '/TgNewUI/CandidateZone/Ajax/CreateConnection';
            $http.post(url, createConnectionRequest).success(function (data, status, headers, config) {
                if (data.Success) {
                    $scope.updateAccount.SMUpdateStatus = 10;
                    $scope.updateAccount.GoogleConnect = true;
                }
            }).error(function (data, status, headers, config) {
                console.log("failed with status of " + status);
                return false;
            });
        },

        updateSocialMediaSettingCallback: function (smSite) {
            $scope.updateAccount.SMUpdateStatus = 6 + parseInt(smSite);
            $scope.updateAccount.SMUpdate = 0;
            if (smSite == 1) {
                if ($scope.updateAccount.LIConnect) {
                    $scope.updateAccount.SMUpdateStatus = 1;
                } else
                    $scope.updateAccount.LIConnect = true;
                $scope.updateAccount.LIOption = $scope.updateAccount.LINewOption;
            } else if (smSite == 2) {
                $scope.updateAccount.FBConnect = true;
                $scope.updateAccount.FBOption = $scope.updateAccount.FBNewOption;
            } else if (smSite == 3) {
                $scope.updateAccount.TWConnect = true;
            }
        },

        showSMInfo: function (helpId) {
            var helpDiv = $('#' + helpId);
            helpDiv.css("display", "block");
            if ($scope.SMPopupId != '' && $scope.SMPopupId != helpId) {
                $('#' + $scope.SMPopupId).removeClass("show");
            }
            helpDiv.trapFocus();

            var helpIcon = helpDiv.siblings(".socialMediaInfo").find(".fa-info-circle");
            var sWidth = $(window).innerWidth();
            var helpIconPos = helpIcon.offset().left;

            if (sWidth < 480 && helpIconPos > 300) {
                helpDiv.offset({ left: 80 });
            } else if (sWidth < 480 && helpIconPos > 200) {
                helpDiv.offset({ left: 20 });
            } else if (helpIcon.offset().left > 150)
                helpDiv.offset({ left: helpIconPos - 150 });
            else
                helpDiv.offset({ left: 5 });

            if (!helpDiv.hasClass('showAtBottom')) {
                helpDiv.offset({ top: helpIcon.offset().top - (helpDiv.outerHeight() + 10) });
            }

            helpDiv.addClass("show");
            helpDiv.find('.closeHelp').focus();
            $scope.SMPopupId = helpId;
        },

        hideSMInfo: function (event, helpId) {
            $('#' + helpId).untrapFocus();
            event.stopPropagation();
            $('#' + helpId).removeClass("show");
            $scope.SMPopupId = '';
        },
        OpenCloseAssessments: function (hrefUrl) {
            var Assesmentwindow = window.open(hrefUrl, "Assessments");

            //Assesmentwindow.onunload = function () {
            //    $scope.renderAssessments();
            //};
        },

        renderAssessments: function (URL) {

            if (sessionStorage.getItem('showAssessmentsCompletionMessage') == null) {
                sessionStorage.setItem('showAssessmentsCompletionMessage', true);
            }
            $scope.showAssessmentsCompletionMessage = sessionStorage.getItem('showAssessmentsCompletionMessage') == "true";
            $scope.bCandidateZone = true;
            $scope.AutoLaunchAssessUrl = "";
            $scope.bCanZoneJobsLoadingState = true;
            $scope.candidatezoneSubView = 'ResponsiveAssessment';
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Assessments";
            $scope.setTitle("Assessments");
            $scope.bInitialLoad = false;
            $scope.bJobDetailsShown = false;
            if (!($scope.isNonProfileAllowed || $scope.AnonymousLoginType == 'ByPassGQLogin')) {
                _.each($scope.CandidateZoneData.Links, function (Link) {
                    if (Link.CandidateZoneLinkId == "ResponsiveAssessment") {
                        $scope.PendingAssessmentsUrl = Link.CandidateZoneLinkURL;
                        return;
                    }
                });
            }

            var showCompletionMessage = true;
            if (typeof URL != 'undefined' && URL != null && URL != "") {
                $scope.PendingAssessmentsUrl = URL;
                showCompletionMessage = false;
            }
            $scope.setHash();
            $.ajax({
                type: "POST",
                url: $scope.PendingAssessmentsUrl,
                success: function (data) {
                    if ($location.hash() == "ResponsiveAssessment") {
                        $scope.bJobDetailsShown = false;
                        $scope.bSelectedGroup = false;
                        $scope.bCandidateZone = true;
                        $scope.candidatezoneSubView = 'ResponsiveAssessment';
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Assessments";
                        $scope.setTitle("Assessments");
                        $scope.bInitialLoad = false;
                        $scope.ExpiredAssessments = data.ExpiredAssessments;
                        ($scope.ExpiredAssessments != null && $scope.ExpiredAssessments.length > 0) ? $scope.bShowExpiredAssesmentAlert = true : $scope.bShowExpiredAssesmentAlert = false;
                        $scope.PendingAssessments = data.PendingAssessments;
                        $scope.AutoLaunchAssessUrl = data.AutoLaunchAssessUrl;
                        var pendingAssessmentsCount = 0;
                        $scope.currentAssessmentCompleted = false;
                        if ($scope.PendingAssessments != null) {
                            pendingAssessmentsCount = $scope.PendingAssessments.length;
                        }
                        if (sessionStorage.getItem('PendingAssessmentsCount') != null && showCompletionMessage) {
                            if (pendingAssessmentsCount < sessionStorage.getItem('PendingAssessmentsCount')) {
                                $scope.currentAssessmentCompleted = true;
                            }
                        }
                        sessionStorage.setItem('PendingAssessmentsCount', pendingAssessmentsCount);
                        $scope.bCanZoneJobsLoadingState = false;
                        $timeout(function () {
                            $scope.alignCards("AssesmentsCards", "jobCard");
                        }, 1000);
                        if (!$scope.utils.isNewHash('ResponsiveAssessment', $scope))
                            $scope.utils.updateHistory('ResponsiveAssessment');
                        $scope.setHash();
                        if ($scope.PendingAssessments.length > 0 && $scope.AutoLaunchAssessUrl != null && $scope.AutoLaunchAssessUrl != "") {
                            $scope.OpenCloseAssessments($scope.AutoLaunchAssessUrl);
                        }
                        $scope.loadwebtrackerscript("/TGNewUI/Assessments", $scope.customScriptRendering.CandidateZone);
                    }
                },
                error: function (xhr, textStatus, error) {
                    $scope.bCanZoneJobsLoadingState = false;
                }
            });



        },
        SocialRefQAfocusAt: function (scope) {
            if (scope === undefined) {
                $("[name='" + $scope.SocialRefErrormsgs[0].field + "']").scrollAndFocus().focus();
            } else
                $("[name='" + this.msgs.field + "']").scrollAndFocus().focus();
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        SocialRefexecuteQB: function (prevqbchildren, qbchildren, parentid) {
            //Hide all PrevChildren
            $.each(prevqbchildren, function (index, value) {
                if (value != "" && value != "undefined") {
                    if ($("[id='Container_" + value + "']").length == 0) return;
                    var $childControl = $("[id='Container_" + value + "']");
                    if ($childControl.attr("QBParent")) {
                        var QBParent = $childControl.attr("QBParent").split(",");
                        _.remove(QBParent, function (Parentid) {
                            return Parentid === parentid;
                        });
                        $childControl.attr('QBParent', parentid);
                        $childControl.addClass("hiddenQB");
                    }
                    else {
                        $childControl.removeAttr('QBParent');
                        $childControl.addClass("hiddenQB");
                    }
                    //For Confirm Fields (SSN)
                    if ($("[id='Container_" + value + "confirm']").length > 0) {
                        var $confirmchildControl = $("[id='Container_" + value + "confirm']");

                        if ($confirmchildControl.attr("QBParent")) {
                            var QBParent = $confirmchildControl.attr("QBParent").split(",");
                            _.remove(QBParent, function (Parentid) {
                                return Parentid === parentid;
                            });
                            $confirmchildControl.attr('QBParent', parentid);
                            $confirmchildControl.addClass("hiddenQB");
                        }
                        else {
                            $confirmchildControl.removeAttr('QBParent');
                            $confirmchildControl.addClass("hiddenQB");
                        }
                    }

                }
            });
            //show all QBChildren
            $.each(qbchildren, function (index, value) {
                if (value != "" && value != "undefined") {
                    if ($("[id='Container_" + value + "']").length == 0) return;
                    var $childControl = $("[id='Container_" + value + "']");

                    if ($childControl.attr("QBParent")) {
                        $childControl.attr('QBParent', parentid);
                        $childControl.removeClass("hiddenQB");
                    }
                    else {
                        $childControl.attr('QBParent', parentid);
                        $childControl.removeClass("hiddenQB");
                    }
                    if (typeof $childControl.css("background-color") != "undefined") {
                        $childControl.effect("highlight", {}, 2000);
                    }


                    //For Confirm Fields (SSN)
                    if ($("[id='Container_" + value + "confirm']").length > 0) {
                        var $confirmchildControl = $("[id='Container_" + value + "confirm']");

                        if ($confirmchildControl.attr("QBParent")) {
                            $confirmchildControl.attr('QBParent', parentid);
                            $confirmchildControl.removeClass("hiddenQB");
                        }
                        else {
                            $confirmchildControl.attr('QBParent', parentid);
                            $confirmchildControl.removeClass("hiddenQB");
                        }
                        if (typeof $confirmchildControl.css("background-color") != "undefined") {
                            $confirmchildControl.effect("highlight", {}, 2000);
                        }
                    }
                }
            });

        },
        SocialRefQBinit: function (AllRefQuestion) {
            $timeout(function () {
                _.each(AllRefQuestion.Questions, function (RefQuestion) {
                    if (RefQuestion.QuestionType == 'checkbox' || RefQuestion.QuestionType == 'multi-select' || RefQuestion.QuestionType == 'radio' || RefQuestion.QuestionType == 'single-select')
                        $scope.SocialRefQB(RefQuestion);
                });
            }, 0);
        },
        SocialRefQB: function (RefQuestion) {
            if (RefQuestion.QuestionType == 'radio' || RefQuestion.QuestionType == 'single-select')
                var qbExecutable = _.pick(_.map(RefQuestion.Options, function (option) {
                    if (option.FieldName == RefQuestion.Answers)
                        return option.QBChildren;
                }), _.identity);
            else {
                if (RefQuestion.QuestionType == 'checkbox')
                    var answers = RefQuestion.Answers.split("#@#");
                else
                    var answers = RefQuestion.Answers;
                var qbExecutable = _.pick(_.map(RefQuestion.Options, function (option) {
                    if (answers != undefined && _.indexOf(answers, option.FieldName) != -1)
                        return option.QBChildren;
                }), _.identity);
            }
            qbExecutable = _.uniq(_.flatten(_.map(qbExecutable, function (o) { return o.split(/,\s*/) })));
            //_.uniq(_.chain(_.map(qbExecutable, function (o) { return o.split(/,\s*/) })).flatten().__wrapped__);

            var qbRevertable = _.pick(_.map(RefQuestion.Options, "QBChildren"), _.identity);
            qbRevertable = _.uniq(_.flatten(_.map(qbRevertable, function (o) { return o.split(/,\s*/) })));
            // _.uniq(_.chain(_.map(qbRevertable, function (o) { return o.split(/,\s*/) })).flatten().__wrapped__);
            qbRevertable = _.difference(qbRevertable, qbExecutable);

            if (qbRevertable.length > 0 || qbExecutable.length > 0)
                $scope.SocialRefexecuteQB(qbRevertable, qbExecutable, RefQuestion.QuestionId);
        },
        referralFieldsChange: function (RefQuestion) {
            switch (RefQuestion.QuestionType) {
                case 'checkbox':
                    var Answers = "";
                    var result = _.select(RefQuestion.Options, function (obj) {
                        if (obj.Selected)
                            (Answers.length > 0) ? Answers = Answers + "#@#" + obj.FieldName : Answers = obj.FieldName;
                        return obj.Selected === true
                    });
                    RefQuestion.Answers = Answers;
                    break;
                case 'radio':
                    break;
                case 'single-select':
                    if (RefQuestion.Answers != "") {
                        if (RefQuestion.IsAutoComplete)
                            $("#Auto_" + RefQuestion.QuestionId + "_slt").removeClass('error');
                        else
                            $("#" + RefQuestion.QuestionId + "-button").removeClass('error');
                    }
                    else if ($scope.RefDetailSubmit && RefQuestion.Required) {
                        if (RefQuestion.IsAutoComplete)
                            $("#Auto_" + RefQuestion.QuestionId + "_slt").addClass('error');
                        else
                            $("#" + RefQuestion.QuestionId + "-button").addClass('error');
                    }
                    break;
                case 'multi-select':
                    if (RefQuestion.Answers !== undefined && RefQuestion.Answers.length > 0) {
                        if (RefQuestion.IsAutoComplete)
                            $("#Auto_" + RefQuestion.QuestionId + "_mslt").removeClass('error');
                        else
                            $("#" + RefQuestion.QuestionId + "-button").removeClass('error');
                    }
                    else if ($scope.RefDetailSubmit && RefQuestion.Required) {
                        if (RefQuestion.IsAutoComplete)
                            $("#Auto_" + RefQuestion.QuestionId + "_mslt").addClass('error');
                        else
                            $("#" + RefQuestion.QuestionId + "-button").addClass('error');
                    }
                    break;
                case 'text':
                case 'email':
                case 'textarea':
                case 'numeric':
                case 'auto-fill':
                    if ($("#" + RefQuestion.QuestionId).hasClass('valid'))
                        $("#" + RefQuestion.QuestionId).removeClass("error");
                    else if ($scope.RefDetailSubmit) {
                        $("#" + RefQuestion.QuestionId).addClass("error");
                    }
                    break;
                case 'ssn':
                    if ($("#" + RefQuestion.QuestionId).hasClass('valid'))
                        $("#" + RefQuestion.QuestionId).removeClass("error");
                    else if ($scope.RefDetailSubmit) {
                        $("#" + RefQuestion.QuestionId).addClass("error");
                    }
                    var Questionid = RefQuestion.QuestionId;
                    if ($scope.RefDetailSubmit && $("#" + Questionid + "confirm").val()) {
                        if ($("#" + Questionid).val() != "" && $("#" + Questionid + "confirm").val() != $("#" + Questionid).val()) {
                            $("#" + Questionid + "confirm").addClass("error");
                            this.ReferralDetailsForm["Input_" + Questionid + "confirm"].$setValidity("confirmssn", false);
                        }
                        else {
                            $("#" + Questionid + "confirm").removeClass("error");
                            this.ReferralDetailsForm["Input_" + Questionid + "confirm"].$setValidity("confirmssn", true);
                        }
                    }
                    break;
                case 'Confirm_SSN':
                    if ($("#" + RefQuestion.QuestionId).hasClass('valid'))
                        $("#" + RefQuestion.QuestionId).removeClass("error");
                    else if ($scope.RefDetailSubmit) {
                        $("#" + RefQuestion.QuestionId).addClass("error");
                    }
                    var Questionid = RefQuestion.QuestionId;
                    if ($scope.RefDetailSubmit) {
                        if ($("#" + Questionid.replace("confirm", '')).val() != "" && $("#" + Questionid.replace("confirm", '')).val() != $("#" + Questionid).val()) {
                            $("#" + Questionid).addClass("error");
                            this.ReferralDetailsForm["Input_" + Questionid].$setValidity("confirmssn", false);
                        }
                        else {
                            $("#" + Questionid).removeClass("error");
                            this.ReferralDetailsForm["Input_" + Questionid].$setValidity("confirmssn", true);
                        }
                    }
                    break;
            }
            if (RefQuestion.QuestionType == 'checkbox' || RefQuestion.QuestionType == 'multi-select' || RefQuestion.QuestionType == 'radio' || RefQuestion.QuestionType == 'single-select')
                $scope.SocialRefQB(RefQuestion);
        },
        referralDetailsBack: function () {
            $scope.$root.workFlow = $scope.workFlow = "Not referral";
            history.back();
        },
        toggleRow: function (event, rowIdwithjobId, qname) {
            var selectedCheckBoxes;
            $("div.gridColumns." + rowIdwithjobId).children().slideToggle("slow", function () {
            });
            $("span.checkedBoxText." + rowIdwithjobId).slideToggle("slow", function () {
                selectedCheckBoxes = undefined;
                $("div.gridColumns." + rowIdwithjobId + " [name='" + qname + "']:checked").parent().find("label").each(function () {
                    if (selectedCheckBoxes == undefined) { selectedCheckBoxes = $(this).html() } else { selectedCheckBoxes += ", " + $(this).html() }
                });
                if (selectedCheckBoxes == undefined) {
                    $(this).html(appScope.dynamicStrings.PlaceHolder_NoneSelected);
                }
                else {
                    $(this).html(selectedCheckBoxes);
                }
            });
            if ($(event.currentTarget).find("span.fa").hasClass("fa-angle-down")) {
                $(event.currentTarget).find("span.fa").removeClass("fa-angle-down").addClass("fa-angle-up");
            }
            else {
                $(event.currentTarget).find("span.fa").removeClass("fa-angle-up").addClass("fa-angle-down");
            }
            $(event.currentTarget).scrollAndFocus();
        },
        constRefGrid: function (RefQuestion) {
            $timeout(function () {
                var gridAnswers = RefQuestion.Answers.split(',');
                var Questionid = RefQuestion.QuestionId;
                _.each(RefQuestion.Rows, function (row) {
                    if ($("div.gridColumns." + row.id + "." + Questionid).next("span.lblview").text().trim().length == 0) {
                        $("div.gridColumns." + row.id + "." + Questionid).next("span.lblview").html(appScope.dynamicStrings.PlaceHolder_NoneSelected);
                    }
                });
                _.each(gridAnswers, function (gridAnswer) {
                    if (gridAnswer != "") {
                        var gridParams = gridAnswer.split("_");
                        var row = gridParams[0];
                        var coloumn = gridParams[1];
                        var Selectedtext = "";
                        if ($("div.gridColumns." + row + "." + Questionid).next("span.lblview").text() != appScope.dynamicStrings.PlaceHolder_NoneSelected)
                            Selectedtext = $("div.gridColumns." + row + "." + Questionid).next("span.lblview").text().trim() + ",";
                        var selectedlabel = [];
                        $("div.gridColumns." + Questionid + "." + row).children().each(function () {
                            if ($(this).children('input').val() == gridAnswer) {
                                $(this).children('input')[0].checked = true;
                                selectedlabel.push($('label[for="' + $(this).children('input').attr('id') + '"]')[0].innerText);
                            }
                        });
                        if (selectedlabel.length > 0)
                            $("div.gridColumns." + row + "." + Questionid).next("span.lblview").html(Selectedtext + selectedlabel.join(','));
                    }
                });
            }, 0);
        },
        renderReferralQuestions: function (langID) {
            SRRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionID: $("#CookieValue").val(),
                LocaleId: $scope.tgSettings.DefLocaleId,
                LangId: langID == null || langID == undefined ? appScope.tgSettings.DefLanguageId : langID
            }
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/GetSocialReferralQuestionAndAnswers",
                data: SRRequest,
                success: function (data) {
                    $scope.SocialRefErrormsgs = [];
                    $scope.SocialRefQA = data;
                    $scope.RefDetailSubmit = false;
                    _.each($scope.SocialRefQA.Questions, function (questions) {
                        questions.Answers = "";
                        var universalRegex = "/^.*$/";
                        if (questions.ValidationRegex == "0" || questions.ValidationRegex == null) {
                            questions.ValidationRegex = universalRegex;
                        }

                        if (questions.QuestionType == "email" && questions.ValidationRegex == universalRegex) {
                            questions.ValidationRegex = $scope.regexUserEmailEqn.toString();
                        }
                        if (questions.QuestionType == "numeric" && questions.ValidationRegex == universalRegex) {
                            questions.ValidationRegex = "/^[0-9]*$/";
                        }
                        if ((questions.QuestionType == "ssn" || questions.QuestionType == "Confirm_SSN") && questions.ValidationRegex == universalRegex) {
                            questions.ValidationRegex = $scope.regexSSN.toString();
                        }

                        if (questions.QuestionType.toLowerCase() == "checkbox")
                            questions.Answers = _.map(questions.Answer, function (answer) { if (typeof (answer.FieldName) != "undefined") { return answer.FieldName } }).join("#@#");
                        else if (questions.QuestionType.toLowerCase() != "multi-select")
                            questions.Answers = _.map(questions.Answer, function (answer) { if (typeof (answer.FieldName) != "undefined") { return answer.FieldName } }).join("");
                        else
                            questions.Answers = _.map(questions.Answer, function (answer) { if (typeof (answer.FieldName) != "undefined") { return answer.FieldName } });


                        if (questions.QuestionType == "date" || questions.QuestionType.toLowerCase() == "confirm_date") {
                            var dateElement = (questions.QuestionType.toLowerCase() == "date") ? ("date_" + questions.QuestionId) : ("date_" + questions.QuestionId + "confirm");
                            $scope[dateElement] = {
                                datepickerConfig: {
                                    showOn: "button",
                                    buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                                    dateFormat: "m/d/yy",
                                    maxDate: 0,
                                    localeCode: response.ClientSettings.LocaleCode,
                                    shortMonthNames: $("#shortMonthNames").val(),
                                    onSelect: function (sDateText, oDatepicker) {
                                        var scope = angular.element(this).scope(),
                                            RefQuestion = angular.nearestScopeVal("RefQuestion", scope);
                                        RefQuestion.Answers = sDateText;
                                        appScope.$broadcast('datevalidate');
                                    },
                                }
                            };
                        }
                        if (questions.QuestionType.toLowerCase() == "confirm_date") {
                            questions.QuestionId = questions.QuestionId + "confirm";
                        }
                        if (questions.QuestionType == "numeric" && questions.Answers != "") {
                            questions.Answers = parseInt(questions.Answers);
                        }
                        if (questions.QuestionType == "single-select" || questions.QuestionType == "multi-select") {
                            if (questions.Options.length > 15) {
                                questions.IsAutoComplete = true;
                            }
                        }
                        if (questions.QuestionType == "Confirm_SSN") {
                            questions.QuestionId = questions.QuestionId + "confirm";
                        }

                        if (questions.Hidden == true) {
                            questions.Required = false;
                        }
                    });
                    $scope.SocialRefQARequired = _.some($scope.SocialRefQA.Questions, function (questions) {
                        return questions.Required == true;
                    });
                    $scope.$root.workFlow = $scope.workFlow = "ReferralDetails";
                    $scope.setTitle("Referrals");
                    //$("#ReferralDetailsForm").validate().settings.ignore = ":hidden *";
                    $("#ReferralDetailsForm").validate({
                        ignore: ":hidden"
                    });
                    $timeout(function () {
                        $(document).on("focus", ".ui-complete", createRefFormAutocomplete);
                    }, 10);

                    // $("#ReferralDetailsForm").on("focus", ".ui-complete", createFormAutocomplete);
                    $timeout(function () {
                        $scope.$apply();
                    }, 0);
                    if (!$scope.utils.isNewHash("ReferralDetails", $scope))
                        $scope.utils.updateHistory("ReferralDetails");
                    $scope.setHash();
                    $scope.loadwebtrackerscript("/TGNewUI/SubmitGeneralReferral", $scope.customScriptRendering.Search);
                },
                error: function (error) {
                    $timeout(function () {
                        $scope.$apply();
                    }, 0);
                    $scope.setTitle("Referrals");
                    if (!$scope.utils.isNewHash("ReferralDetails", $scope))
                        $scope.utils.updateHistory("ReferralDetails");
                    $scope.setHash();
                }
            });
            $timeout(function () {
                if ($(".responsiveCandZoneMenu").is(":visible")) {
                    $scope.responsivecandidateZoneView();
                }
            }, 10);
        },

        evaluateFormElements: function (scope, id, expression) {
            var myelement = "Input_" + id;

            if (expression === undefined && (scope.ReferralDetailsForm[myelement] != undefined)) {
                if (scope.ReferralDetailsForm[myelement].$error)
                    return true;
                else
                    return false;
            } else if (scope.ReferralDetailsForm[myelement] != undefined) {
                switch (expression) {
                    case "$error.number":
                        if (scope.ReferralDetailsForm[myelement].$error.number) return true; else return false;
                        break;
                    case "$error.pattern":
                        if (scope.ReferralDetailsForm[myelement].$error.pattern) return true; else return false;
                        break;
                    case "$error.required":
                        if (scope.ReferralDetailsForm[myelement].$error.required) return true; else return false;
                        break;
                    case "$error.email":
                        if (scope.ReferralDetailsForm[myelement].$error.email) return true; else return false;
                        break;
                    case "$error.max":
                        if (scope.ReferralDetailsForm[myelement].$error.max) return true; else return false;
                        break;
                    case "$error.min":
                        if (scope.ReferralDetailsForm[myelement].$error.min) return true; else return false;
                        break;
                    case "$error.dateString":
                        if (scope.ReferralDetailsForm[myelement].$error.dateString) return true; else return false;
                        break;
                    case "$error.dateRange":
                        if (scope.ReferralDetailsForm[myelement].$error.dateRange) return true; else return false;
                        break;
                    case "$error.confirmssn":
                        if (!scope.ReferralDetailsForm[myelement].$error.required && !scope.ReferralDetailsForm[myelement].$error.pattern && scope.ReferralDetailsForm[myelement].$error.confirmssn) return true; else return false;
                        break;
                    case "$error.confirmdate":
                        if (scope.ReferralDetailsForm[myelement].$error.confirmdate) return true; else return false;
                        break;
                }

            } else {
                return true;
            }
        },
        saveReferralQuestions: function (scope) {
            $scope.RefDetailSubmit = true;
            var RefQAFormValid = true;
            $scope.SocialRefErrormsgs = [];
            var removedControls = [];
            _.each($scope.SocialRefQA.Questions, function (question) {
                if (question.QuestionType == "grid") {
                    var Questionid = question.QuestionId;
                    var Answers = "";
                    _.each(question.Rows, function (row) {
                        $("div.gridColumns." + Questionid + "." + row.id).children().each(function () {
                            if ($(this).children('input')[0].checked == true) {
                                if (Answers == "")
                                    Answers = $(this).children('input').val();
                                else
                                    Answers += "," + $(this).children('input').val();
                            }
                        });
                    });
                    question.Answers = Answers;
                }
                if ((question.QuestionType == "date" || question.QuestionType.toLowerCase() == "confirm_date") && question.Answers != "") {
                    appScope.$broadcast('datevalidate');
                }
                if (question.QuestionType == "Confirm_SSN") {
                    var Questionid = question.QuestionId;
                    if ($("#" + Questionid.replace("confirm", '')).val() != "" && $("#" + Questionid.replace("confirm", '')).val() != $("#" + Questionid).val()) {
                        $("#" + Questionid).addClass("error");
                        scope.ReferralDetailsForm["Input_" + Questionid].$setValidity("confirmssn", false);
                    }
                    else {
                        $("#" + Questionid).removeClass("error");
                        scope.ReferralDetailsForm["Input_" + Questionid].$setValidity("confirmssn", true);
                    }
                }
                if ($("#Container_" + question.QuestionId).css('display') == 'none') {
                    question.Answers = "";
                    //Removing controls and adding them into array as angular form also validates hidden fields.. :(
                    if (typeof scope.ReferralDetailsForm["Input_" + question.QuestionId] != "undefined") {
                        var ctrl = scope.ReferralDetailsForm["Input_" + question.QuestionId];
                        removedControls.push(ctrl);
                        scope.ReferralDetailsForm.$removeControl(ctrl);
                    }
                }
                else if (question.QuestionType != "label" && question.Required && question.Answers == "" && $("#Container_" + question.QuestionId).css('visibility') == "visible") {
                    RefQAFormValid = false;
                }
            });
            if ($("form[name='ReferralDetailsForm']").valid() && scope.ReferralDetailsForm.$valid && RefQAFormValid) {
                var Fields = [];
                _.each($scope.SocialRefQA.Questions, function (question) {
                    if (question.QuestionType == "multi-select") {
                        var Answers;
                        //var Answers = _.map(question.Answer[0].FieldName).join('#@#');

                        Answers = _.map(question.Answers).join('#@#');
                        if (Answers != "#@#" && Answers != null && Answers != "") {
                            Fields.push({
                                Answers: Answers,
                                QuestionId: question.QuestionId,
                                QuestionName: question.FieldName,
                                Questiontype: question.QuestionType
                            });
                        }
                    }
                    else if (question.QuestionType == "date") {
                        if (question.Answers != null && question.Answers != "") {
                            Fields.push({
                                Answers: ChangetoDefaultDateFormat(question.Answers),
                                QuestionId: question.QuestionId,
                                QuestionName: question.FieldName,
                                Questiontype: question.QuestionType
                            });
                        }
                    }
                    else {
                        if (!(question.Answers == "" || question.Answers == null || question.QuestionType.toLowerCase() == "confirm_ssn" || question.QuestionType.toLowerCase() == "confirm_date")) {

                            Fields.push({
                                Answers: question.Answers,
                                QuestionId: question.QuestionId,
                                QuestionName: question.FieldName,
                                Questiontype: question.QuestionType
                            });

                        }
                    }
                });
                scope.oActiveLaddaButton.start();
                var SaveSRRequest = {
                    PartnerId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    EncryptedSession: $("#CookieValue").val(),
                    LocaleId: $scope.tgSettings.DefLocaleId,
                    Fields: Fields
                }
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/SaveSocialReferralQuestionAndAnswers",
                    contentType: 'application/json',
                    data: JSON.stringify(SaveSRRequest),
                    success: function (data) {
                        scope.oActiveLaddaButton.stop();
                        $scope.referralDetailsBack();
                        $timeout(function () {
                            $scope.$apply();
                        }, 0);
                        $timeout(function () {
                            appScope.SocialReferral_READY = $scope.SocialReferral_READY = "yes";
                            appScope.SocialReferral_FirstName = $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFN);
                            appScope.SocialReferral_LastName = $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLN);
                            appScope.SocialReferral_ProfileId = $scope.SocialReferral_ProfileId = data.ProfileId;
                            if (!(typeof (appScope.ReferrButtonCalledFrom) == 'undefined' || appScope.ReferrButtonCalledFrom == "")) {
                                $("#submitGeneralReferral").click();
                            } else {
                                $("#SocialReferralButton").click();
                            }
                        }, 1000);
                    },
                    error: function (error) {
                        scope.oActiveLaddaButton.stop();
                        $scope.SocialRefErrormsgs = $scope.dynamicStrings.SaveReferralQuestionFailed;
                        $timeout(function () {
                            $(".errorContainer").scrollAndFocus();
                        }, 100);
                    }
                });
            }
            else {
                //Adding controls from array into the form.. :(
                _.each(removedControls, function (ctrl) {
                    scope.ReferralDetailsForm.$addControl(ctrl);
                    angular.forEach(ctrl.$error, function (validity, validationToken) {
                        scope.ReferralDetailsForm.$setValidity(validationToken, !validity, ctrl);
                    });
                });
                $.each(scope.ReferralDetailsForm.$error, function (errorType, allErrors) {
                    if (allErrors != false) {
                        $.each(allErrors, function (index, error) {
                            if ($("#Container_" + error.$name.replace(/^\D+/g, '')).is(":visible")) {
                                var msg = {};
                                msg.field = error.$name;
                                if ($('label[fieldfor="' + error.$name.replace(/^\D+/g, '') + '"]')[0] !== undefined)
                                    msg.label = $('label[fieldfor="' + error.$name.replace(/^\D+/g, '') + '"]')[0].innerText;
                                else
                                    msg.label = $('label[fieldfor="' + error.$name.replace(/^\D+/g, '') + '-button"]')[0].innerText;
                                if (errorType == "required") {
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RequiredField;
                                } else if (errorType == "email") {
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidEmail;
                                } else if (errorType == "pattern") {
                                    msg.error = ' - ' + $scope.dynamicStrings.Msg_InvalidField;
                                }
                                else if (errorType == "max") {
                                    msg.error = ' - ' + $scope.dynamicStrings.MsgMax.replace("{0}", $("input[name*='" + error.$name + "']").attr("max"));
                                }
                                else if (errorType == "min") {
                                    msg.error = ' - ' + $scope.dynamicStrings.MsgMin.replace("{0}", $("input[name*='" + error.$name + "']").attr("min"));
                                }
                                else if (errorType == "dateString") {
                                    $("#" + msg.field.replace("Input_", "")).addClass('haserror');
                                    msg.error = ' - ' + appScope.dynamicStrings.ErrorMessage_InvalidDate;
                                }
                                else if (errorType == "dateRange") {
                                    $("#" + msg.field.replace("Input_", "")).addClass('haserror');
                                    msg.error = ' - ' + appScope.dynamicStrings.ErrorMessage_InvalidDateRange.replace("[MINDATE]", $("input[name*='Input_14341']").data().minDate).replace("[MAXDATE]", $("input[name*='Input_14341']").data().maxDate);
                                }
                                else if (errorType == "confirmfield" || errorType == "confirmdate") {
                                    msg.error = ' - ' + appScope.dynamicStrings.MsgConfirmField;
                                }
                                $("#" + msg.field.replace("Input_", "")).addClass('error');
                                //$("#" + msg.field).attr("aria-invalid", "true");
                                $scope.SocialRefErrormsgs.push(msg);
                            }
                        });
                    }
                });
                _.each($scope.SocialRefQA.Questions, function (question) {
                    if (question.QuestionType == "multi-select") {
                        if (question.Answers !== undefined && question.Answers != "")
                            $("#" + question.QuestionId + "-button").removeClass('error');
                        else if (question.Required) {
                            if (question.IsAutoComplete)
                                $("#Auto_" + question.QuestionId + "_mslt").addClass('error');
                            else
                                $("#" + question.QuestionId + "-button").addClass('error');
                        }
                    }
                    else if (question.QuestionType == "single-select") {
                        if (question.Answers != "")
                            $("#" + question.QuestionId + "-button").removeClass('error');
                        else if (question.Required)
                            if (question.IsAutoComplete)
                                $("#Auto_" + question.QuestionId + "_slt").addClass('error');
                            else
                                $("#" + question.QuestionId + "-button").addClass('error');
                    } else if (question.QuestionType == "radio" && $("#Container_" + question.QuestionId).is(":visible") && question.Required && question.Answers == "") {
                        var msg = {};
                        msg.label = $('label[fieldfor="' + question.QuestionId + '"]')[0].innerText;
                        msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RequiredField;
                        msg.field = "Input_" + question.QuestionId;
                        $scope.SocialRefErrormsgs.push(msg);
                    } else if (question.QuestionType == "checkbox" && $("#Container_" + question.QuestionId).is(":visible") && question.Required && question.Answers == "") {
                        var msg = {};
                        msg.label = $('label[fieldfor="' + question.QuestionId + '"]')[0].innerText;
                        msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RequiredField;
                        msg.field = "Input_" + question.QuestionId;
                        $scope.SocialRefErrormsgs.push(msg);
                    } else if (question.QuestionType == "grid" && question.Required && question.Answers == "") {
                        var msg = {};
                        msg.label = $('label[fieldfor="' + question.QuestionId + '"]')[0].innerText;
                        msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RequiredField;
                        msg.field = question.QuestionId + "_chk0";
                        $scope.SocialRefErrormsgs.push(msg);
                    }
                });
                $timeout(function () {
                    $(".errorContainer").scrollAndFocus();
                }, 100);
                return false;
            }
        },
        CommunicationView: function (startIndex) {

            $scope.bInitialLoad = false;
            $scope.notificationShow = false;
            if (startIndex !== undefined) {
                $scope.commHistStartIndex = startIndex;
            };

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                calledFrom: 'Archive',
                startIndex: $scope.commHistStartIndex
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/CommunicationHistory", communicationRequest).success(function (data, status, headers, config) {
                $scope.communications = data.CommunicationDetails;
                $scope.commHistShowMore = data.showMoreButton;
                $scope.subViewInitialized = true;
                if (!$scope.utils.isNewHash('communication', $scope))
                    $scope.utils.updateHistory('communication');
                $scope.setHash();
                $scope.setTitle("Communication");
                $scope.alignCards("Communication", "jobCard");
                $timeout(function () {
                    if ($scope.commHistStartIndex > 1) {
                        var commId = $scope.communications[($scope.commHistStartIndex - 1) * 20].CommunicationId;
                        $('#comm_subject_' + commId).focus()
                    }
                }, 100);
                $scope.loadwebtrackerscript("/TGNewUI/MessageArchive", $scope.customScriptRendering.CandidateZone);
            }
            );
        },

        ViewCommunicationDetail: function (commId, fromBell, isTGComm) {
            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                CommunicationId: commId,
                IsTGCommunication: isTGComm
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/CommunicationDetail", communicationRequest).success(function (data, status, headers, config) {
                $.$focusTrap = $();

                var message;
                if (isTGComm) {
                    message = $.grep($scope.notifications, function (e) { return e.CommunicationId == commId; });
                }
                else {
                    message = $.grep(fromBell ? $scope.messages : $scope.communications, function (e) { return e.CommunicationId == commId; });
                }

                var dateSent;
                if (message.length > 0) {
                    $scope.messageDetail = message[0];
                    dateSent = message[0].Addedon;
                }

                if (data.EmailMessage == "")
                    data.EmailMessage = $scope.dynamicStrings.Msg_Blank_Message_Content;
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $scope.messageDetail = null;
                        $.$focusTrap.pop();
                        $.restoreFocus();
                    },
                    template: 'communicationDetailTemplate',
                    scope: $scope,
                    className: 'ngdialog-theme-default customDialogue CommunicationDetailDialog',
                    showClose: true,
                    closeByDocument: false,
                    appendTo: "#dialogContainer",
                    ariaRole: "dialog",
                    data: { commDetail: data, commId: commId, fromBell: fromBell, dateSent: dateSent }
                });
                setTimeout(function () {
                    $(".ngdialog-content").scrollTop(0);
                }, 200);
            }
            );

        },

        UpdateCommStatus: function (commId, viewStatus, updateFrom, isTGComm) {
            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SID: $("#CookieValue").val(),
                CommunicationId: commId,
                ViewStatus: viewStatus,
                IsTGCommunication: isTGComm
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/UpdateCommunicationStatus", communicationRequest).success(function (data, status, headers, config) {
                if (updateFrom == 'delete') {
                    ngDialog.closeAll();
                    $scope.communicationDeleted = true;
                    $scope.communications = _.filter($scope.communications, function (o) { return o.CommunicationId !== commId; });
                } else if (updateFrom == 'bell') {
                    if (viewStatus > 2) {
                        $scope.messages = _.filter($scope.messages, function (o) { return o.CommunicationId !== commId; });
                    }
                    else {
                        if (isTGComm && data.UpdateStatus == 1) {

                            $scope.notifications = _.filter($scope.notifications, function (o) { return o.CommunicationId !== commId; });

                        }

                        var message = $.grep($scope.messages, function (e) { return e.CommunicationId == commId; });
                        if (message.length > 0) {
                            message[0].ViewStatus = viewStatus;
                        }
                        $timeout(function () { $('#msg_' + viewStatus + '_' + commId).focus() }, 100);
                    }
                } else if (updateFrom == 'archive') {
                    var message = $.grep($scope.communications, function (e) { return e.CommunicationId == commId; });
                    if (message.length > 0) {
                        message[0].ViewStatus = viewStatus;
                    }
                    if (viewStatus == 3 || viewStatus == 4)
                        $timeout(function () { $('#comm_' + viewStatus + '_' + commId).focus() }, 100);
                } else if (updateFrom == 'detail') {
                    if ($scope.messageDetail.ViewStatus < 2 && viewStatus > 2)
                        $scope.messages = _.filter($scope.messages, function (o) { return o.CommunicationId !== commId; });
                    else {
                        var refocusBtn;
                        if (($scope.messageDetail.ViewStatus == 0 && viewStatus == 1) || ($scope.messageDetail.ViewStatus == 4 && viewStatus == 3))
                            refocusBtn = "#btn_unread";
                        else if (($scope.messageDetail.ViewStatus == 1 && viewStatus == 0) || ($scope.messageDetail.ViewStatus == 3 && viewStatus == 4))
                            refocusBtn = "#btn_read";
                        if (refocusBtn) {
                            $timeout(function () { $(refocusBtn).focus() }, 0);
                        }
                    }
                    $scope.messageDetail.ViewStatus = viewStatus;
                }
            });

        },

        HideMessageArchiveStatus: function () {
            $(".MsgStatus").hide();
        },



        DeleteCommunication: function (commId) {
            var dialog = ngDialog.open({
                template: 'deleteCommunicationTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue',
                showClose: true,
                closeByDocument: false,
                appendTo: "#dialogContainer",
                ariaRole: "dialog",
                data: { commId: commId }
            });
            dialog.closePromise.then(function (data) {
                if (data.value == '1') {
                    $.$focusTrap.pop();
                    $.restoreFocus();
                }
                $.$focusTrap.eq(-1).keydown($.maintainFocus);
            });

        },

        clearCommDeleteConfirmation: function () {
            $scope.communicationDeleted = false;
        },

        communicationPanelShown: false,
        notificationShow: response.ClientSettings.EnableNotifications.toLowerCase() == 'true' ? true : false,
        notificationView: "notification",
        bellNumber: 0,
        lastBellNumberCheck: null,
        messages: [],
        notifications: [],
        messagesShown: false,
        notificationsShown: false,
        ToggleNotification: function () {


            if ($scope.communicationPanelShown) {

                $scope.communicationPanelShown = false;

            }
            else {
                $scope.communicationPanelShown = true;

                if (!$scope.notificationShow) {

                    $scope.notificationView = 'message';
                    $scope.NotificationMenu('message');
                    $scope.notificationShow = false;

                }
                else {
                    if ($scope.tgSettings.EnableNotifications.toLowerCase() == 'true') {
                        $scope.notificationView = 'notification';
                        $scope.notificationShow = true;
                        $scope.NotificationMenu('notification');

                    }
                }

            }
            setTimeout(function () {
                $("#notificationBoxContainer").slideToggle();
            }, 0);
        },

        NotificationBack: function () {
            if ($scope.communicationPanelShown) {

                $("#notificationBoxContainer").slideToggle();
                $scope.communicationPanelShown = false;
            }
        },

        HideCommunicationPanel: function () {

            if ($scope.communicationPanelShown && $('#notificationBoxContainer:focus').length == 0 && $("#notificationBoxContainer").has(document.activeElement).length == 0 && $("#CommunicationDetail").has(document.activeElement).length == 0) {

                $("#notificationBoxContainer").slideToggle();
                $scope.communicationPanelShown = false;

            }

        },

        NotificationMenu: function (view) {
            $scope.notificationView = view;

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                calledFrom: 'Bell',
                startIndex: $scope.commHistStartIndex
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/CommunicationHistory", communicationRequest).success(function (data, status, headers, config) {
                $scope.messages = _.where(data.CommunicationDetails, { IsTGCommunication: false });
                $scope.notifications = _.where(data.CommunicationDetails, { IsTGCommunication: true });
                if (view == 'message') {

                    $scope.bellNumber = $scope.bellNumber - ($scope.messages.length);
                    $scope.notificationShow = false;
                    $scope.messagesShown = true;
                }
                else if (view == 'notification') {

                    $scope.bellNumber = $scope.bellNumber - ($scope.notifications.length);
                    $scope.notificationShow = true;
                    $scope.notificationsShown = true;
                }
                var newMessages = _.where($scope.messages, { ViewStatus: 1, ViewStatus: 0 });
                var newNotifies = _.where($scope.notifications, { ViewStatus: 0 });
                $scope.newMessages = (newMessages.length > 0 && !$scope.messagesShown && $scope.tgSettings.EnableNotifications.toLowerCase() == 'true') ? true : false;
                $scope.newNotifications = (newNotifies.length > 0 && !$scope.notificationsShown) ? true : false;

                setTimeout(function () {
                    if (view == 'message' && $scope.messages.length == 0)
                        $("#messageArchiveLink").focus();
                    else if (view == 'message' && $scope.messages.length > 0)
                        $("#archiveAllLink").focus();
                    if (view == 'notification' && $scope.notifications.length > 0)
                        $("#dismissAllLink").focus();

                    $("body").click(function (event) {
                        var notifyContainer = $("#notificationBoxContainer").length > 0 ? $.contains($("#notificationBoxContainer")[0], event.target) : true;
                        var rightIconcontainer = $(".rightIcons").length > 0 ? $.contains($(".rightIcons")[0], event.target) : true;
                        var tsBellContainer = $(".tsBell").length > 0 ? $.contains($(".tsBell")[0], event.target) : false;

                        if (!notifyContainer && !rightIconcontainer && !($(".tsBell").length > 0 && tsBellContainer)) {
                            $scope.HideCommunicationPanel();
                        }

                    });
                }, 0);


            }
            );


        },

        getNotificationMsgCount: function () {

            if (!$scope.bresponsiveCandidateZone || $scope.lastBellNumberCheck && (new Date() - $scope.lastBellNumberCheck < 60000) || $scope.isNonProfileAllowed || $scope.standAloneGQ > 0)
                return;

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                MsgOrNotificationFlag: $scope.tgSettings.EnableCommHistPage.toLowerCase() == 'yes' ? 1 : 0
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/GetBellNumber", communicationRequest).success(function (data, status, headers, config) {
                $scope.bellNumber = data.MessageNotificationsCount;
                $scope.lastBellNumberCheck = new Date();
            }
            );
        },

        ArchiveAllMessages: function () {
            if ($scope.messages.length == 0)
                return;

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SID: $("#CookieValue").val(),
                CommunicationIds: _.pluck($scope.messages, 'CommunicationId').join(",")

            };

            $http.post("/TgNewUI/CandidateZone/Ajax/ArchiveAllMessage", communicationRequest).success(function (data, status, headers, config) {

                $scope.bellNumber = $scope.bellNumber - $scope.messages.length;
                $scope.messages = [];
                $scope.lastBellNumberCheck = new Date();
            }
            );
        },

        DismissAll: function () {
            if ($scope.notifications.length == 0)
                return;

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SID: $("#CookieValue").val(),
                CommunicationIds: _.pluck(_.where($scope.notifications, { IsTGCommunication: true }), 'CommunicationId').join(",")

            };

            $http.post("/TgNewUI/CandidateZone/Ajax/DismissAll", communicationRequest).success(function (data, status, headers, config) {
                if (data.UpdateStatus == 1) {

                    $scope.bellNumber = $scope.bellNumber - $scope.notifications.length;
                    $scope.notifications = [];
                    $scope.lastBellNumberCheck = new Date();
                }
            }
            );
        },

        ActionFromNotification: function (notificationType, commId, notificationId) {

            var NotificationInfoRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                ConfiguredJobTitle: $scope.GetConfiguredJobTitle(),
                CommunicationId: commId,
                NotificationType: notificationType,
                NotificationReference: notificationId
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/GetNotificationInfo", NotificationInfoRequest).success(function (data, status, headers, config) {
                if (data.Status == true) {
                    if (notificationType == 1) // continue click of a draft
                    {
                        if (data.ExpiryDetails.ExpiredJobs == undefined && data.ExpiryDetails.ExpiredDrafts == undefined) {
                            //continue application
                            $scope.bjobInAGroupExpired = false;
                            $scope.unfinishedJobsApplyRemove(data.DraftInfo, 'UnfinishedjobsDupcheck');
                        }
                        else if ((data.DraftInfo != null && data.DraftInfo.IsApplicationGroup != undefined && data.DraftInfo.IsApplicationGroup) && (data.ExpiryDetails.ExpiredJobs != undefined || data.ExpiryDetails.ExpiredDrafts != undefined)) {
                            $scope.bjobInAGroupExpired = true;
                            $scope.unfinishedJobsApplyRemove(data.DraftInfo, 'UnfinishedjobsDupcheck');
                        }
                        else if ((data.ExpiryDetails.ExpiredJobs != null && data.ExpiryDetails.ExpiredJobs.length > 0) || (data.ExpiryDetails.ExpiredDrafts != null && data.ExpiryDetails.ExpiredDrafts.length > 0)) {

                            //show dashboard view with expired info
                            $scope.draftNotificationExpired = true;
                            $scope.NotificationExpiredJobs = data.ExpiryDetails.ExpiredJobs;
                            $scope.NotificationExpiredDrafts = data.ExpiryDetails.ExpiredDrafts;
                            $scope.bCandidateZone = true;
                            $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.UnfinishedApplications);

                        }
                        else if (data.ExpiryDetails.ExpiredJobs.length == 0 && data.ExpiryDetails.ExpiredDrafts.length == 0) {
                            $scope.draftNotificationExpired = true;
                            //show generic expired message..

                            $scope.NotificationExpiredJobs = [];
                            $scope.NotificationExpiredDrafts = [];
                            $scope.bCandidateZone = true;
                            $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.UnfinishedApplications);

                        }

                        $scope.communicationPanelShown = false;
                        $("#notificationBoxContainer").slideToggle();

                    }


                }


            }) //end of post success
        },

        ViewMessageArchive: function () {
            if ($scope.communicationPanelShown) {
                $("#notificationBoxContainer").slideToggle();
                $scope.communicationPanelShown = false;
            }
            var subMenuLink = [];
            subMenuLink.CandidateZoneLinkId = "messageArchive";
            subMenuLink.responsive = true;
            $scope.responsivecandidateZoneView(subMenuLink);
        },

        showPrivacyPolicyForNonLoggedIn: function (LoginType) {
            ngDialog.closeAll();

            if ($scope.isNonProfileAllowed || $scope.tgSettings.ByPassGQLogin == "True") {
                if ($scope.tgSettings.PrivacyStatement != '') {
                    //Show Privacy Policy...
                    $scope.newAccntScreen();
                }
                else {
                    //Create NON Profile Log In
                    $scope.CreateAnonymousLogin(LoginType);
                }
            }
            $timeout(function () {
                $scope.AnonymousLoginType = LoginType;
            }, 100);
        },

        CreateAnonymousLogin: function (loginType, callBackFunction) {

            if ($scope.standAloneGQ <= 0) {
                $scope.bPrivacyPages = false;
                $scope.bPrivacyPolicyStatement = false;
                $timeout(function () {
                    if ($scope.bJobDetailsShown) {
                        angular.element("#applyFromDetailBtn").scope().oActiveLaddaButton.start();
                    }
                    else if ($scope.bSearchResults) {
                        angular.element("#applyFromSearchResultsBtn").scope().oActiveLaddaButton.start();
                    }
                }, 500);
            }


            var url = '/TgNewUI/Search/Ajax/CreateAnonymousLogin';

            var loginProfileDetails = {};
            loginProfileDetails.ClientId = $("#partnerId").val();
            loginProfileDetails.SiteId = $("#siteId").val();
            loginProfileDetails.BrowserInfo = navigator.userAgent;
            loginProfileDetails.IPAddress = "1.1.1.1";
            loginProfileDetails.EncryptedSessionId = $("#CookieValue").val();
            loginProfileDetails.AnonymousLoginType = loginType;

            $http.post(url, loginProfileDetails).success(function (data, status, headers, config) {
                if (data.Success == false) {
                    if ($scope.bJobDetailsShown)
                        angular.element("#applyFromDetailBtn").scope().oActiveLaddaButton.stop();
                    else if ($scope.bSearchResults)
                        angular.element("#applyFromSearchResultsBtn").scope().oActiveLaddaButton.stop();

                    ngDialog.open({
                        preCloseCallback: function (value) {
                            $('body').removeClass('noScroll');
                            $.restoreFocus();
                        },
                        template: 'CreatAnonymousLoginFailed', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                    });

                } else {
                    $scope.AnonymousLoginType = loginProfileDetails.AnonymousLoginType;
                    $scope.encryptedBruid = data.EncryptedBruId;
                    $scope.hashCode = data.HashCode;
                    $scope.loadwebtrackerscript("/TGNewUI/Login", $scope.customScriptRendering.Search);
                    $scope.bLoggedIn = true;
                    $timeout(function () {
                        $scope.$apply();
                    }, 10);
                    if (typeof callBackFunction != "undefined") {
                        applyScope.page.bruid = data.EncryptedBruId;
                        callBackFunction();
                    }
                    else if ($scope.standAloneGQ > 0) {
                        $scope.standAloneGQApply();
                    }
                    else {
                        $timeout(function () {
                            if ($scope.bJobDetailsShown) {
                                $("#applyFromDetailBtn").trigger("click");
                            }
                            else if ($scope.bSearchResults) {
                                $("#applyFromSearchResultsBtn").trigger("click");
                            }
                        }, 100);
                    }

                }

            });
        },
        Showanonymouseuser: function () {
            if (($scope.bLoggedIn && $scope.AnonymousLoginType == "ByPassGQLogin") || $scope.isNonProfileAllowed)
                return true;
            else return false;
        },
        postToNextPage: function (event, scope, calledFrom, checkDraft) {
            if (appScope.showVBTWarningAlert(true)) {
                return;
            }
            if (calledFrom == "save" || calledFrom == "refer" || calledFrom == "share") {
                $.$priorFocus = null;
            }
            $scope.calledFrom = calledFrom;
            ngDialog.closeAll();
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();
            var selectedJobs = {};
            var jobId, gqId, jobInfo, parterId, siteId, langId, jobSiteInfo, chkJobClientIds, postValues, allSelectedJobsSiteIds, localeId, isGQResponsive, encryptedBruid, switchSite, jobTitle, JobsToBeSaved = [];
            $scope.MaxConSubmissionError = false;
            selectedJobs = _.where(scope.jobs, { "Selected": true });
            if (selectedJobs.length == 0) {
                alert($scope.dynamicStrings.Message_SelectAJobPosting);
                return;
            }
            else if (calledFrom == "mulapplyvald" && selectedJobs.length > scope.maxConReqSubmission) {
                scope.dialogCalledfrom = 'Apply';
                $scope.MaxConSubmissionError = true;
                $scope.MaxConReqSubmissionMessage = $scope.tgSettings.MaxConReqSubmissionMessage.replace("#maximum_concurrent_req_submissions#", scope.maxConReqSubmission)
                if ($scope.tgSettings.MaxConReqSubmissionMessage == "") {
                    $scope.MaxConReqSubmissionMessage = $scope.dynamicStrings.MaxConcurrentMessage.replace("#maximum_concurrent_req_submissions#", scope.maxConReqSubmission)
                }
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'MultipleApplyValidations', scope: scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                });
                return;
            }
            if (calledFrom == "apply" && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.responsiveGQforSingleJob) {
                scope.isGQResponsive = $scope.SearchResultsJobsSelectedScope.responsiveGQforSingleJob;
            }
            //var selectedJobIds = _.each(selectedJobs, function (job) {   _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString().join(",") });
            selectedJobs = _.sortBy(selectedJobs, function (job) { return _.pluck(_.where(job.Questions, { "QuestionName": "jobtitle" }), "Value").toString(); });
            _(selectedJobs).forEach(function (job) {
                gqId = _.pluck(_.where(job.Questions, { "QuestionName": "gqid" }), "Value").toString();
                langId = _.pluck(_.where(job.Questions, { "QuestionName": "jobreqlanguage" }), "Value").toString();
                siteId = _.pluck(_.where(job.Questions, { "QuestionName": "siteid" }), "Value").toString();
                jobTitle = _.pluck(_.where(job.Questions, { "QuestionName": "jobtitle" }), "Value").toString();
                partnerId = $("#partnerId").val();
                if (jobId == undefined) {
                    jobId = _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString();
                    partnerId = $("#partnerId").val();
                    scope.jobIds = jobId;
                    scope.jobInfo = "%%" + jobId + "|" + langId + "|" + gqId + "%%";
                    scope.jobSiteInfo = jobId + "_" + siteId;
                    scope.groupGQId = gqId;
                    allSelectedJobsSiteIds = siteId;
                    localeId = job.localeId;
                    encryptedBruid = scope.encryptedBruid;
                }
                else {
                    jobId = _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString();
                    scope.jobIds = scope.jobIds + "," + jobId;
                    scope.jobInfo = scope.jobInfo + jobId + "|" + langId + "|" + gqId + "%%";
                    scope.jobSiteInfo = scope.jobSiteInfo + "," + jobId + "_" + siteId;
                    scope.groupGQId = scope.groupGQId + "," + gqId;
                    allSelectedJobsSiteIds = allSelectedJobsSiteIds + "," + siteId;
                }

                JobsToBeSaved.push({ JobTitle: jobTitle, ReqId: jobId, SiteId: siteId, JobReqLang: langId, LocaleId: job.localeId });

            });

            if (calledFrom == "mulapplyvald" || (calledFrom == "save" && !$scope.bLoggedIn) || (calledFrom == "refer" && !$scope.bLoggedIn)) {
                if (!$scope.bLoggedIn) {
                    if ($scope.bSearchResults && !$scope.bJobDetailsShown && $scope.$root.workFlow == "searchResults") {
                        $("#hSMJobId").val(scope.jobIds);
                    }
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    $scope.SearchResultsJobsSelectedScope = scope;
                    if ($scope.isNonProfileAllowed) {
                        //Show Privacy Policy...
                        $scope.showPrivacyPolicyForNonLoggedIn("NoLogin");
                    }
                    else if ($scope.tgSettings.SSOGateway != "1") {
                        if ($scope.tgSettings.ByPassGQLogin == 'True' && (calledFrom == "apply" || calledFrom == "mulapplyvald")) {
                            $scope.bBypassGQLogin = true;
                            $scope.AnonymousLoginType = "";
                        }
                        $scope.showMobileSignInDialog(scope);
                    }
                    return;
                }
                else if (calledFrom == "mulapplyvald") {
                    $scope.MultipleApplyDupCheckAjax(scope, partnerId, $("#siteId").val(), scope.jobSiteInfo, selectedJobs);
                }

            }
            else {
                var searchCriteria
                if (calledFrom == "apply" && !(_.max(scope.groupGQId.split(",")) == _.min(scope.groupGQId.split(",")) && _.max(allSelectedJobsSiteIds.split(",")) == _.min(allSelectedJobsSiteIds.split(",")))) {
                    searchCriteria = scope.GetSearchCriteria(scope.jobSiteInfo);
                }
                else {
                    searchCriteria = scope.GetSearchCriteria();
                }
                var url = '/TgNewUI/Search/Ajax/SaveSearchCriteriaInSessionXML';
                $http.post(url, searchCriteria).success(function (data, status, headers, config) {
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    switch (calledFrom) {
                        case "apply":
                            var type = "";
                            if (($scope.bresponsiveCandidateZone && $scope.bCandidateZone && $scope.bJobCart) || $scope.$root.workFlow == 'JobCart') {
                                type = "cart";
                            }
                            else {
                                type = "search";
                            }
                            if (_.max(scope.groupGQId.split(",")) == _.min(scope.groupGQId.split(",")) && _.max(allSelectedJobsSiteIds.split(",")) == _.min(allSelectedJobsSiteIds.split(","))) {
                                if (_.max(allSelectedJobsSiteIds.split(",")) != $("#siteId").val()) {
                                    $scope.switchSite(siteId, "fromApply");
                                    switchSite = true;
                                    //switch site
                                }
                                if (_.max(scope.groupGQId.split(",")) == "0") {
                                    postValues = { JobInfo: scope.jobInfo, ApplyCount: selectedJobs.length, type: type, JobSiteId: siteId, hdRft: $("#rfToken").val() };
                                    redirectPage = "apply.aspx";
                                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                                }
                                else {
                                    if ($.queryParams().applyTest || scope.isGQResponsive) {
                                        //IS responsive GQ
                                        $scope.jobApplyUrl = "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + scope.jobIds + "&partnerid=" + partnerId + "&siteid=" + siteId + "&wbmode=false&loadingViaAjax=true";
                                        if (switchSite) {
                                            if ($scope.bCandidateZone && $scope.bJobCart) {
                                                window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(encryptedBruid) + "&reqid=" + scope.jobIds + "&calledFrom=JobCart";
                                            }
                                            else {
                                                window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(encryptedBruid) + "&reqid=" + scope.jobIds + "&calledFrom=SearchResults";
                                            }
                                        }
                                        else {
                                            var rft = $("[name='__RequestVerificationToken']").val();
                                            $.ajax({
                                                method: "GET",
                                                url: "/gqweb/apply?bruid=" + encodeURIComponent(encryptedBruid) + "&tqid=" + gqId + "&reqid=" + scope.jobIds + "&partnerid=" + partnerId + "&siteid=" + siteId + "&wbmode=false&loadingViaAjax=true&RFT=" + rft,
                                                success: function (result) {
                                                    if ($scope.bJobCart) {
                                                        $scope.bGQLaunchedFromJobCart = true;
                                                    }
                                                    $scope.$root.applyResponse = result;
                                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                                    setTimeout(function () {
                                                        $scope.$apply();
                                                    }, 0);
                                                }
                                            });
                                        }

                                    }
                                    else {

                                        if (scope.tgSettings.Mobileoptimised == "true") {
                                            postValues = { JobInfo: scope.jobInfo, ApplyCount: selectedJobs.length, type: type, JobSiteId: siteId, GQLoginURL: "../" + localeId + "/asp/tg/GQLogin.asp?SID=GQSESSION&sjfsr=true&bBasic=false&gqid=" + _.max(scope.groupGQId.split(",")) + "&jobinfo=" + scope.jobInfo.replace(/%%/g, "__") + "&applycount=" + selectedJobs.length + "&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url
                                            redirectPage = "apply.aspx";
                                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();

                                        }
                                        else {
                                            $scope.bCreateAccount = false;
                                            window.open("../../../" + localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&sjfsr=true&bBasic=false&gqid=" + _.max(scope.groupGQId.split(",")) + "&jobinfo=" + scope.jobInfo.replace(/%%/g, "__") + "&applycount=" + selectedJobs.length, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                                            if (switchSite) {
                                                window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&PageType=searchresults";
                                            }
                                        }
                                    }

                                }
                            } else {
                                //New Selected Group page
                                $scope.SelectedGroupAjax(partnerId, $("#siteId").val(), scope.jobSiteInfo);
                            }
                            break;

                        case "save":
                            $scope.SaveToJobCartAjax(partnerId, siteId, JobsToBeSaved, scope);
                            break;

                        case "share":
                            postValues = { JobInfo: scope.jobInfo, JobSiteInfo: scope.jobSiteInfo, hdRft: $("#rfToken").val() };
                            if ($scope.bresponsiveCandidateZone) {
                                $scope.jobInfo = scope.jobInfo;
                                $scope.jobSiteInfo = scope.jobSiteInfo;
                                $scope.openSendToFriend("1", selectedJobs);
                                break;
                            }
                            else if (scope.tgSettings.Mobileoptimised == "true") {
                                redirectPage = "mobile/sharejob.aspx";
                            }
                            else {
                                redirectPage = "emailtofriend.aspx";
                            }
                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                            break;
                        case "refer":
                            if ($scope.bresponsiveCandidateZone && appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
                                if (appScope.SocialReferral_READY == "yes") {
                                    appScope.SocialReferral_READY == "no"
                                    scope.LaunchSocialReferralMenu(scope, $("#SocialReferralButton")[0]);
                                } else {
                                    $scope.renderReferralQuestions(langId);
                                }
                            }
                            else if (appScope.SocialReferral_READY == "yes") {
                                scope.LaunchSocialReferralMenu(scope, $("#SocialReferralButton")[0]);
                            }
                            else {
                                $scope.jobIds = scope.jobIds;
                                redirectPage = "socialnetworkreferral.aspx";
                                postValues = { ButtonId: "SocialReferralButton", hdRft: $("#rfToken").val() }
                                $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                            }
                            break;
                        case "remove":
                            $scope.RemoveFromJobCartAjax(partnerId, siteId, scope.jobSiteInfo);
                            break;

                    }
                }).error(function (data, status, headers, config) {
                    //console.log("failed with status of " + status);
                });
            }
        },
        LaunchSocialReferralMenu: function (scope, button) {
            if ($scope.bcandidatezoneSubmenu) {
                $scope.bcandidatezoneSubmenu = !$scope.bcandidatezoneSubmenu;
                $("#responsiveCandZoneLink i").hasClass('fa-chevron-down') ? $("#responsiveCandZoneLink i").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#responsiveCandZoneLink i").removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }
            setTimeout($scope.$apply(), 0);
            if (button == undefined)
                button = $("#SocialReferralButton")[0];
            var urlstring = "../../referral/home/referralworkflowoptions?siteid=" + scope.SocialReferral_SiteId + "&partnerid=" + $("#partnerId").val() + "&localeid=" + scope.SocialReferral_LocaleId + "&bruid=" + appScope.SocialReferral_ProfileId + "&jobids=" + scope.jobIds.replace(/,/g, '_') + "&fn=" + appScope.SocialReferral_FirstName + "&ln=" + appScope.SocialReferral_LastName;
            window.dialogBuilder.showDialog(button, urlstring);
            if ($scope.bresponsiveCandidateZone && appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
                $scope.SocialReferral_READY = appScope.SocialReferral_READY = "no";
            }
        },
        checkHotJob: function (scope) {
            return _.pluck(_.where(scope.job.Questions, { "QuestionName": "hotjob" }), "Value").toString().toLowerCase() == "yes";
            //return _.pluck(_.where(scope, { "QuestionName": "hotjob" }), "Value").toString().toLowerCase() == "yes";
        },
        scrolltop: function () {

            var body = $("html, body");
            body.animate({ scrollTop: 0 }, '500', 'swing');
            $(".homeContentLiner").scrollTop(0);

        },

        CheckboxChecked: function (scope) {
            if (scope.job.Selected && scope.job.isSocialReferralJobRestricted && !$scope.jobRestrictedJobSelected) {
                $scope.jobRestrictedJobSelected = true;
                $scope.$apply();
                $("#SocialReferralButton").addClass("disabledClass");

            }
            else if ((_.where(_.where($scope.jobs, { "Selected": true }), { "isSocialReferralJobRestricted": true }).length == 0) && $scope.jobRestrictedJobSelected) {
                $scope.jobRestrictedJobSelected = false;
                $scope.$apply();
                if ($("#SocialReferralButton").hasClass("disabledClass")) $("#SocialReferralButton").removeClass("disabledClass");

            }

            if ((_.where(_.where($scope.jobs, { "Selected": true })).length > 0))
                $scope.SelectedJobsChecked = true;
            else
                $scope.SelectedJobsChecked = false;
            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                $scope.utils.updateHistory($scope.$location.hash());
        },
        SaveReqsToCart: function (Group, scope) {
            if ($scope.bLoggedIn) {
                scope.oActiveLaddaButton.start();
                if ($scope.isNonProfileAllowed) {
                    $scope.GroupJobApplyAjax(Group, scope);
                }
                else {
                    var SaveCartRequest = {};
                    SaveCartRequest.partnerId = $("#partnerId").val();
                    SaveCartRequest.siteId = $("#siteId").val();;
                    SaveCartRequest.SelectedGroups = _.reject($scope.SelectedGroups, {
                        JobInfo: Group.JobInfo
                    });
                    SaveCartRequest.encryptedSession = $("#CookieValue").val();
                    var url = '/TgNewUI/Search/Ajax/SaveToCart';
                    if (SaveCartRequest.SelectedGroups.length > 0) {
                        $http.post(url, SaveCartRequest).success(function (data, status, headers, config) {
                            $scope.GroupJobApplyAjax(Group, scope);
                        });
                    }
                    else {
                        $scope.GroupJobApplyAjax(Group, scope);
                    }
                }
            }
            else {
                $scope.postToNextPage('', scope, 'mulapplyvald');
            }

        },

        GetSearchCriteria: function (jobSiteInfo) {
            var powerSearchOptions = [];
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var searchCriteria = {};
            searchCriteria.partnerId = $("#partnerId").val();
            searchCriteria.siteId = $("#siteId").val();
            searchCriteria.keyword = $scope.keyWordSearch.text;
            searchCriteria.location = $scope.locationSearch.text;
            searchCriteria.keywordCustomSolrFields = that.keywordFields;
            searchCriteria.locationCustomSolrFields = that.locationFields;
            facetFilterFields = _.forEach(this.$parent.facets, function (facet) { return _.filter(facet.Options, { Selected: true }) });

            if ($scope.locationSearch.text != "") {
                searchCriteria.Latitude = that.latitude;
                searchCriteria.Longitude = that.longitude;
            }
            else {
                searchCriteria.Latitude = 0;
                searchCriteria.Longitude = 0;
            }
            searchCriteria.facetfilterfields = { "Facet": facetFilterFields };
            searchCriteria.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            searchCriteria.SortType = $("#sortBy").val() != undefined ? $scope.sortFields[$("#sortBy").val()].Name : "";
            searchCriteria.pageNumber = that.pageNumber;
            searchCriteria.encryptedSessionValue = $("#CookieValue").val();
            if (jobSiteInfo) {
                searchCriteria.JobSiteIds = jobSiteInfo;
            }
            return searchCriteria;

        },
        postToNextPageFromDetails: function (event, scope, calledFrom, checkDraft) {
            if (appScope.showVBTWarningAlert(true)) {
                return;
            }
            var jobId, gqId, jobInfo, partnerId, siteId, langId, jobSiteInfo, chkJobClientIds, postValues, isGQResponsive, localeId, encryptedBruid, sid, origSiteId;
            isGQResponsive = scope.jobDetailFields.isGQResponsive;
            $scope.calledFrom = calledFrom;
            $scope.backtobSignInView = false;
            $scope.bJobDetailsShown = true;
            var switchSite = false;
            referButton = $("#SocialReferralButton")[0];

            var Questions = scope.jobDetailFields.JobDetailQuestions;
            var JobsToBeSaved = [];
            jobId = _.pluck(_.where(Questions, { "VerityZone": "reqid" }), "AnswerValue").toString();
            gqId = _.pluck(_.where(Questions, { "VerityZone": "gqid" }), "AnswerValue").toString();
            langId = _.pluck(_.where(Questions, { "VerityZone": "jobreqlanguage" }), "AnswerValue").toString();
            partnerId = $("#partnerId").val();
            origSiteId = $("#siteId").val();
            siteId = _.pluck(_.where(Questions, { "VerityZone": "siteid" }), "AnswerValue").toString();

            scope.jobIds = jobId;
            sid = $("#SIDValue").val();
            scope.siteId = siteId;

            localeId = scope.jobDetailFields.localeId;
            encryptedBruid = scope.encryptedBruid;
            jobInfo = "%%" + jobId + "|" + langId + "|" + gqId + "%%";
            $scope.jobSiteInfo = jobId + "_" + siteId;

            var jobTitle = _.pluck(_.where(Questions, { "VerityZone": "jobtitle" }), "AnswerValue").toString();
            JobsToBeSaved.push({ JobTitle: jobTitle, ReqId: jobId, SiteId: siteId, JobReqLang: langId, LocaleId: localeId });

            var searchCriteria = scope.GetSearchCriteria();
            var url = '/TgNewUI/Search/Ajax/SaveSearchCriteriaInSessionXML';
            var groupGQId = gqId;
            //Temporary POC code - TO BE REMOVED
            if ((calledFrom == "apply") && ($.queryParams().applyTest || isGQResponsive)) {
                if (siteId != origSiteId) {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&calledFrom=JobDetails";
                }
                else {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&loadingViaAjax=true";
                }
                if ($scope.bLoggedIn && $scope.ApplyDifference > 0) {
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.start();
                    if (siteId != origSiteId) {
                        var switchSiteRequest = {};
                        switchSiteRequest.PartnerId = $("#partnerId").val();
                        switchSiteRequest.SwitchToSiteId = siteId;
                        switchSiteRequest.FromSiteId = $("#siteId").val();
                        switchSiteRequest.CookieValue = $("#CookieValue").val();

                        $.ajax({
                            success: function (data, status, jqxhr) {
                                if (data.Success == true) {
                                    var bruid = encryptedBruid != "" ? encryptedBruid : $.queryParams().bruid;
                                    window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(bruid) + "&reqid=" + jobId + "&calledFrom=JobDetails";
                                }

                            },
                            error: function (jqxhr, status, error) {
                            },
                            url: '/TgNewUI/Search/Ajax/SwitchSite',
                            data: switchSiteRequest,
                            type: 'POST'
                        });
                    }
                    else {
                        var rft = $("[name='__RequestVerificationToken']").val();
                        $http.get(
                            "/gqweb/apply?bruid=" + encodeURIComponent(encryptedBruid) + "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&sid=" + sid + "&loadingViaAjax=true&RFT=" + rft

                        ).success(function (result) {
                            if (angular.isDefined(scope.oActiveLaddaButton))
                                scope.oActiveLaddaButton.stop();
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                            $scope.$root.applyResponse = result;
                        });
                    }
                }
                else if (!$scope.bLoggedIn) {
                    if ($scope.isNonProfileAllowed) {
                        //Show Privacy Policy...
                        $scope.showPrivacyPolicyForNonLoggedIn("NoLogin");
                    }
                    else {
                        if ($scope.tgSettings.ByPassGQLogin == 'True' && (calledFrom == "apply" || calledFrom == "mulapplyvald")) {
                            $scope.bBypassGQLogin = true;
                            $scope.AnonymousLoginType = "";
                        }
                        $scope.backtobSignInView = true;
                        $scope.bSignInView = true;
                        $scope.showInFullView = true;
                        //pass apply information to the SM logged in form
                        $("#hSMLocalId").val(localeId);
                        $("#hSMJobId").val(jobId);
                        $("#hSMTQId").val(gqId);
                        setTimeout(function () {
                            $scope.$apply();
                            window.scrollTo(0, 0);
                            $scope.setTitle("logIn");
                        }, 0)
                    }
                }
                else {
                    $scope.ShowJobAlert = true;
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                }
                return;
            }
            //else if ((calledFrom == "apply") && !isGQResponsive && !$scope.bLoggedIn) {
            //    if ($scope.tgSettings.SSOGateway != "1") {
            //        $scope.showMobileSignInDialog(scope);
            //        return;
            //    }
            //}
            if (!$scope.bLoggedIn && (calledFrom == "save" || calledFrom == "refer")) {
                $scope.backtobSignInView = true;
                $scope.bSignInView = true;
                $scope.showInFullView = true;
                $scope.calledFrom = calledFrom;
                //pass apply information to the SM logged in form
                $("#hSMLocalId").val(localeId);
                $("#hSMJobId").val(jobId);
                $("#hSMTQId").val(gqId);
                setTimeout(function () {
                    $scope.$apply();
                    window.scrollTo(0, 0);
                }, 0);
                return;
            }
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();

            //Code changes to fix the pop up window issue since we are suspectig that Ajax call is interfering with window open
            // if (calledFrom == "apply" && gqId != "" && gqId != "0" && scope.tgSettings.Mobileoptimised != "true")
            //     window.open("../../../" + scope.jobDetailFields.localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=search_jobdetail", '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');


            $http.post(url, searchCriteria).success(function (data, status, headers, config) {
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
            }).error(function (data, status, headers, config) {
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
                //console.log("failed with status of " + status);
            });

            switch (calledFrom) {
                case "apply":
                    var type = "";
                    if ($scope.bJobCart && $scope.bCandidateZone) {
                        type = "cart_jobdetail";
                    }
                    else {
                        type = "search_jobdetail";
                    }
                    if (gqId == "0") {
                        postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: scope.siteId, hdRft: $("#rfToken").val() };
                        redirectPage = "apply.aspx";
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                    }
                    else {
                        if (scope.tgSettings.Mobileoptimised == "true") {
                            postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: scope.siteId, GQLoginURL: "../" + scope.jobDetailFields.localeId + "/asp/tg/GQLogin.asp?SID=GQSESSION&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url

                            redirectPage = "apply.aspx";
                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();

                        }
                        else {

                            if (siteId != origSiteId) {
                                $scope.switchSite(siteId, "fromApply");
                                switchSite = true;
                            }
                            window.open("../../../" + scope.jobDetailFields.localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&language=" + langId + "&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                            if (switchSite) {
                                window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&jobid=" + jobId + "&PageType=jobdetails";
                            }
                        }

                    }
                    break;

                case "save":
                    $scope.SaveToJobCartAjax(partnerId, siteId, JobsToBeSaved, scope);

                    break;

                case "email":
                    if (!$scope.bresponsiveCandidateZone) {
                        postValues = { JobInfo: jobInfo, JobSiteInfo: $scope.jobSiteInfo, hdRft: $("#rfToken").val() };
                        if (scope.tgSettings.Mobileoptimised == "true") {
                            postValues.JobTitle = scope.jobDetailFields.Title;
                            redirectPage = "mobile/sharejob.aspx";
                        }
                        else {
                            postValues.STFJobTitle = scope.jobDetailFields.Title;
                            redirectPage = "emailtofriend.aspx";
                        }
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                    }
                    else {
                        $scope.jobInfo = jobInfo
                        $scope.openSendToFriend("2", scope.jobDetailFields);
                    }
                    break;
                case "refer":
                    if ($scope.bresponsiveCandidateZone && appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
                        if (appScope.SocialReferral_READY == "yes") {
                            appScope.SocialReferral_READY == "no"
                            scope.LaunchSocialReferralMenu(scope, referButton);
                        } else {
                            $scope.renderReferralQuestions(langId);
                        }
                    }
                    else if (appScope.SocialReferral_READY == "yes") {
                        setTimeout(function () {
                            $scope.$apply();
                            scope.LaunchSocialReferralMenu(scope, referButton);
                        }, 0);
                    }
                    else {
                        $scope.jobIds = scope.jobIds;
                        redirectPage = "socialnetworkreferral.aspx";
                        postValues = { ButtonId: "SocialReferralButton", hdRft: $("#rfToken").val() }
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                    }
                    break;
                case "share":
                    postValues = { jobid: jobId, hdRft: $("#rfToken").val(), langId: langId, localeId: localeId, jobSiteId: siteId };
                    redirectPage = "socialmedia.aspx";
                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                    break;
            }

        },
        generalJobSubmissionRedirection: function ($scope) {
            if (appScope.showVBTWarningAlert(true)) {
                return;
            }
            $scope.oActiveLaddaButton.start();
            if ($scope.tgSettings.SiteGeneralJobSubmissionType != "" && _.parseInt($scope.tgSettings.SiteGeneralJobSubmissionType) > 0) {
                window.open("../../../" + $scope.tgSettings.DefLocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&fhp=true&GQID=" + $scope.tgSettings.SiteGeneralJobSubmissionType);
                $scope.oActiveLaddaButton.stop();
            }
            else {
                $scope.oActiveLaddaButton.stop();
                window.location = '../../../TGwebhost/defaultlogin.aspx?SID=' + $("#SIDValue").val() + '&RegType=SubmitNow'
            }
        },

        SetDuplicateVariablesafterLogin: function (data, loginProfileDetails, calledafter, calledFrom) {
            if (($scope.calledFrom == 'save' || $scope.calledFrom == "refer" || $scope.calledFrom == "savesearch") && calledafter == "Login") {
                ngDialog.closeAll();
                $scope.login.ForgotPass = false;
                if ($scope.bJobDetailsShown) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                    $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.CallApply();
                    $scope.bSignInView = false;
                    $scope.showInFullView = false;
                    $scope.bError = false;
                    $scope.backtobSignInView = false;
                    $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                }
                else if ($scope.calledFrom == 'savesearch') {
                    $scope.openSaveSearchDialog();
                }
                else if ($scope.bSearchResults) {
                    $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                }
            }
            else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                $scope.SearchResultsJobsSelectedScope.ApplyDifference = data.ApplyDiff;
                $scope.SearchResultsJobsSelectedScope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                $scope.SearchResultsJobsSelectedScope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                $scope.SearchResultsJobsSelectedScope.LimitExceededMessage = data.LimitExceededMessage;
                $scope.SearchResultsJobsSelectedScope.responsiveGQforSingleJob = data.IsGQResponsiveForMultipleJobsHavingSingleGQ;

                if (typeof (loginProfileDetails.JobSiteIDs) == "object" && loginProfileDetails.JobSiteIDs.length > 1) {
                    $scope.SearchResultsJobsSelectedScope.MultipleJobStatus = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })) : "";
                    $scope.SearchResultsJobsSelectedScope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    $scope.SearchResultsJobsSelectedScope.AllJobsApplied = $scope.SearchResultsJobsSelectedScope.NoofJobsApplied == loginProfileDetails.JobSiteIDs.length ? true : false;
                    if ($scope.SearchResultsJobsSelectedScope.ApplyDifference <= 0) {
                        // $scope.SearchResultsJobsSelectedScope.NoOfJobsExceededMaxLimit = (($scope.SearchResultsJobsSelectedScope.ApplyDifference * -1) + 1) == (loginProfileDetails.JobSiteIDs.length - $scope.SearchResultsJobsSelectedScope.NoofJobsApplied) ? 0 : (($scope.SearchResultsJobsSelectedScope.ApplyDifference * -1) + 1);
                        $scope.SearchResultsJobsSelectedScope.NoOfJobsExceededMaxLimit = (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions)) > 0 ? (loginProfileDetails.JobSiteIDs.length - (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions))) : 0;
                    }
                } else if (typeof (loginProfileDetails.JobSiteIDs) == "string") {
                    $scope.SearchResultsJobsSelectedScope.MultipleJobStatus = (_.where(data.ApplyStatus, { "Applied": true })) != null ? data.ApplyStatus : "";
                    $scope.SearchResultsJobsSelectedScope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    $scope.SearchResultsJobsSelectedScope.AllJobsApplied = $scope.SearchResultsJobsSelectedScope.NoofJobsApplied == 1 ? true : false;
                }

                if (data.ReqsThatCanBeApplied == null) {
                    _.each($scope.SearchResultsJobsSelectedScope.jobs, function (job) {
                        job.Selected = false;
                    });
                    data.ReqsThatCanBeApplied = undefined;
                }
                else if ($scope.SearchResultsJobsSelectedScope.jobIds != data.ReqsThatCanBeApplied) {
                    var splittedJobs = data.ReqsThatCanBeApplied.split(",");
                    _.each($scope.SearchResultsJobsSelectedScope.jobs, function (job) {
                        if (_.contains(splittedJobs, _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString())) {
                            job.Selected = true;
                        }
                        else {
                            job.Selected = false;
                        }
                    });

                }
                $scope.SearchResultsJobsSelectedScope.jobIds = data.ReqsThatCanBeApplied;
                $scope.login.ForgotPass = false;
                ngDialog.closeAll();
                if (appScope.bSearchResults && calledafter == "Login" && ($scope.SearchResultsJobsSelectedScope.NoofJobsApplied > 0 || $scope.SearchResultsJobsSelectedScope.ApplyDifference <= 0)) {
                    $scope.SearchResultsJobsSelectedScope.dialogCalledfrom = 'Apply';
                    $scope.MultipleApplyFormData = $scope.SearchResultsJobsSelectedScope;
                    $('body').addClass('noScroll');
                    ngDialog.open({
                        preCloseCallback: function (value) {
                            $('body').removeClass('noScroll');
                            $.restoreFocus();
                        },
                        template: 'MultipleApplyValidations', scope: $scope.SearchResultsJobsSelectedScope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog" // how to handle the scope over here
                    });
                }
                else if (calledafter == "Login") {
                    $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, 'apply');
                }

            }
            else if (appScope.bJobDetailsShown) {
                $scope.ApplyDifference = data.ApplyDiff;
                $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                $scope.LimitExceededMessage = data.LimitExceededMessage;
                $timeout(function () { $scope.$apply(); }, 0);
                ngDialog.closeAll();
                $scope.login.ForgotPass = false;
                //$timeout(function () {
                //    if ($scope.calledFrom == "apply" && $("#applyFromDetailBtn").is(":visible") && $("#applyFromDetailBtn").is(":disabled") == false) {
                //        $("#applyFromDetailBtn").trigger('click');
                //    }
                //}, 100);
            }
            else
                ngDialog.closeAll();
            $timeout(function () {
                $scope.$apply();
            }, 0);
        },

        validateAndSubmit: function (scope) {
            scope.oActiveLaddaButton.start();
            $scope.UnameErrorID = '';
            $scope.PassErrorID = '';
            $scope.LoginErrorID = '';
            $scope.errorAtLoggingIn = '';
            $scope.bError = false;
            $scope.LoginChangeSecQuestion = false;
            $scope.LoginChangePassword = false;
            if (appScope.SM_SiteID == appScope.smType.Google) {
                scope.signInForm.$valid = true;
                scope.signInForm.loginField.$valid = true;
                scope.signInForm.password.$valid = true;
                scope.signInForm.loginField.$error.required = false;
                scope.signInForm.password.$error.required = false;
            }
            else if (!angular.isDefined(scope.loginField) || scope.loginField == '' || !angular.isDefined(scope.password) || scope.password == '')
                scope.signInForm.$valid = false;


            if (scope.signInForm.$valid || (appScope.SM_SiteID == appScope.smType.Google)) {
                if (appScope.showVBTWarningAlert(true)) {
                    scope.oActiveLaddaButton.stop();
                    return;
                }
                var loginProfileDetails = {};
                if ($scope.jobDetailsJobShown != undefined && $scope.jobDetailsJobShown != "") {
                    loginProfileDetails.JobSiteIDs = $scope.jobSiteInfo;
                } else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobSiteInfo != undefined) {
                    loginProfileDetails.JobSiteIDs = $scope.SearchResultsJobsSelectedScope.jobSiteInfo.indexOf(",") > 0 ? $scope.SearchResultsJobsSelectedScope.jobSiteInfo.split(",") : $scope.SearchResultsJobsSelectedScope.jobSiteInfo;
                    loginProfileDetails.JobInfo = $scope.SearchResultsJobsSelectedScope.jobInfo;
                }
                loginProfileDetails.PartnerId = $("#partnerId").val();
                loginProfileDetails.SiteId = $("#siteId").val();
                loginProfileDetails.LoginType = $scope.tgSettings.LoginType;
                if (appScope.SM_SiteID == appScope.smType.Google) {
                    loginProfileDetails.socialMediaLoginRequest = {};
                    loginProfileDetails.socialMediaLoginRequest.SM_SiteID = appScope.SM_SiteID;
                    loginProfileDetails.socialMediaLoginRequest.SM_ProfileID = appScope.SM_ProfileID;
                    loginProfileDetails.socialMediaLoginRequest.SM_AccessToken = appScope.SM_AccessToken;
                    loginProfileDetails.socialMediaLoginRequest.SM_FullName = appScope.SM_FullName;
                    loginProfileDetails.socialMediaLoginRequest.SM_FirstName = appScope.SM_FirstName;
                    loginProfileDetails.socialMediaLoginRequest.SM_LastName = appScope.SM_LastName;
                    loginProfileDetails.socialMediaLoginRequest.SM_EmailID = appScope.SM_EmailID;
                    loginProfileDetails.socialMediaLoginRequest.SM_ProfilePicture = appScope.SM_ProfilePicture;
                } else {
                    loginProfileDetails.Email = scope.loginField;
                    loginProfileDetails.Password = scope.password;
                }
                loginProfileDetails.BrowserInfo = navigator.userAgent;
                loginProfileDetails.IP = "1.1.1.1";
                loginProfileDetails.Locale = $scope.tgSettings.DefLocaleId;
                loginProfileDetails.LanguageSelected = $scope.tgSettings.DefLanguageId;
                loginProfileDetails.EncryptedSessionId = $("#CookieValue").val();
                loginProfileDetails.CalledFrom = $scope.calledFrom;
                loginProfileDetails.ResponsiveCandidateZone = $scope.bresponsiveCandidateZone;
                loginProfileDetails.IsCreateAccountWorkFlow = $scope.bCreateAcount && ($scope.$root.workFlow == "createAccount");
                var url = '/TgNewUI/Search/Ajax/CheckLoginDetails';
                $http.post(url, loginProfileDetails).success(function (data, status, headers, config) {
                    scope.oActiveLaddaButton.stop();
                    switch (data.LoginResult) {
                        case 0:
                            {
                                $scope.ClearSaveSearchCriteriaToLocalSession();
                                scope.submit = false;
                                $scope.encryptedBruid = data.EncryptedBruId;
                                $scope.hashCode = data.HashCode;
                                $scope.loadwebtrackerscript("/TGNewUI/Login", $scope.customScriptRendering.Search);
                                $scope.ProfileDetails = data.BasicProfileDetails;
                                $scope.updateCandidateZoneData();
                                $scope.SavedSearchesMetaData = data.SavedSearchesMetaData;
                                if (data.NewSessionId != null || data.NewSessionId != "") {
                                    $("#CookieValue").val(data.NewSessionId);
                                }
                                $scope.ShowTimeoutMessage = false;
                                _.each($scope.oHistory, function (oPriorScope, sName) {
                                    oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
                                });
                                ngDialog.closeAll();
                                if ($scope.standAloneGQ > 0) {
                                    $scope.bLoggedIn = true;
                                    $scope.standAloneGQApply();
                                }
                                else if ($scope.jobApplyUrl != "") {
                                    if ((data.ApplyStatus != null && data.ApplyStatus[0].Applied) || data.ApplyDiff <= 0) {
                                        $scope.bLoggedIn = true;
                                        $scope.errorAtLoggingIn = "";
                                        $scope.bSignInView = false;
                                        $scope.showInFullView = false;
                                        $scope.bError = false;
                                        $scope.backtobSignInView = false;
                                        $scope.login.ForgotPass = false;
                                        $scope.bCreateAccount = false;
                                        $scope.bPrivacyPages = false;
                                        $scope.ApplyDifference = data.ApplyDiff;
                                        $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                                        $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                                        $scope.LimitExceededMessage = data.LimitExceededMessage;
                                        if (window.location.href.toLowerCase().indexOf("al=1") > -1)
                                            $scope.bJobDetailsAPIError = true;
                                        else
                                            $scope.bJobDetailsAPIError = false;
                                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                                        $timeout(function () {
                                            $scope.$apply();
                                            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                                                $scope.utils.updateHistory($scope.$location.hash());
                                        }, 0);
                                    }
                                    else {
                                        var Questions = scope.jobDetailFields.JobDetailQuestions;
                                        var siteId = _.pluck(_.where(Questions, { "VerityZone": "siteid" }), "AnswerValue").toString();
                                        if (siteId != $("#siteId").val()) {
                                            var switchSiteRequest = {};
                                            switchSiteRequest.PartnerId = $("#partnerId").val();
                                            switchSiteRequest.SwitchToSiteId = siteId;
                                            switchSiteRequest.FromSiteId = $("#siteId").val();
                                            switchSiteRequest.CookieValue = $("#CookieValue").val();

                                            $.ajax({
                                                success: function (data, status, jqxhr) {
                                                    if (data.Success == true) {
                                                        window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl;
                                                    }

                                                },
                                                error: function (jqxhr, status, error) {
                                                },
                                                url: '/TgNewUI/Search/Ajax/SwitchSite',
                                                data: switchSiteRequest,
                                                type: 'POST'
                                            });
                                        }
                                        else {
                                            var rft = $("[name='__RequestVerificationToken']").val();
                                            $http.get("/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl + "&RFT=" + rft)
                                                .success(function (result) {
                                                    ngDialog.closeAll();
                                                    $scope.login.ForgotPass = false;
                                                    $scope.bPrivacyPages = false;
                                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                                    $scope.$root.applyResponse = result;
                                                    $scope.bLoggedIn = true;
                                                    $scope.bSignInView = false;
                                                    $scope.showInFullView = false;
                                                    scope.loginField = "";
                                                    scope.password = "";
                                                });
                                        }
                                    }
                                }
                                else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                    $scope.bLoggedIn = true;
                                    $scope.errorAtLoggingIn = "";
                                    $scope.bSignInView = false;
                                    $scope.showInFullView = false;
                                    $scope.bError = false;
                                    $scope.backtobSignInView = false;
                                    $scope.login.ForgotPass = false;
                                    $scope.bCreateAccount = false;
                                    $scope.bPrivacyPages = false;
                                    appScope.bJobDetailsShown ? appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails" : appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                                    if ($scope.tgSettings.EnableSocialReferral == "yes") {
                                        $scope.SocialReferral_READY = data.SocialMediaSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                        $scope.SocialReferral_FirstName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_FirstName);
                                        $scope.SocialReferral_LastName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_LastName);
                                        $scope.SocialReferral_ProfileId = data.SocialMediaSettings.profileId;
                                    }
                                    $scope.SetDuplicateVariablesafterLogin(data, loginProfileDetails, "Login", $scope.calledFrom);

                                }
                                else {
                                    scope.loginField = "";
                                    scope.password = "";
                                    if ($scope.bresponsiveCandidateZone) {
                                        if ($scope.tgSettings.EnableSocialReferral == "yes") {
                                            $scope.SocialReferral_READY = data.SocialMediaSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                            $scope.SocialReferral_FirstName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_FirstName);
                                            $scope.SocialReferral_LastName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_LastName);
                                            $scope.SocialReferral_ProfileId = data.SocialMediaSettings.profileId;
                                        }
                                        $scope.bPrivacyPages = false;
                                        $scope.bCandidateZone = true;
                                        if ($("#pageType").val().toLowerCase() == "saveddraftsfromlink") {
                                            $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.UnfinishedApplications);

                                        } if ($("#pageType").val().toLowerCase() == "portal") {
                                            $scope.bInitialLoad = false;
                                            $scope.oHistory["home"].bSignInView = false;
                                            $scope.oHistory["home"].showInFullView = false;
                                            $scope.oHistory["home"].LoginFromLinkView = false;
                                            //101142 : Adding one more condition to check the client settings..
                                            if ($scope.CandidateZoneData != null && $scope.CandidateZoneData.HRstatusCategoriesConfiguredForCP == false && !$scope.EnableResponsiveCandidatePortal)
                                                window.location = '../../../TGwebhost/candidateportal.aspx?SID=' + $("#SIDValue").val();
                                            else
                                                $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.FinishedApplications);
                                        }
                                        else {
                                            $scope.ViewDashBoardData("SavedJobs");
                                        }
                                        $scope.login.ForgotPass = false;

                                    }
                                    else  //Non-Responsive candidate zone
                                    {
                                        var candidateZoneRequest = {};
                                        candidateZoneRequest.PartnerId = $("#partnerId").val();
                                        candidateZoneRequest.SiteId = $("#siteId").val();
                                        candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                                        candidateZoneRequest.SIDValue = $("#SIDValue").val();
                                        url = '/TgNewUI/Search/Ajax/CandidateZone';
                                        $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                                            if (!appScope.bJobDetailsShown && !appScope.bSearchResults)
                                                $scope.bCandidateZone = true;

                                            ngDialog.closeAll();
                                            $scope.CandidateZoneData = data;
                                            $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                                            $scope.bLoggedIn = true;
                                            $scope.bSignInView = false;
                                            $scope.showInFullView = false;
                                            $scope.bPrivacyPages = false;
                                            $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                                            $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                                            $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                                            if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                                                $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                                $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                                                $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                                                $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                                            }
                                            $scope.login.ForgotPass = false;
                                            if ($scope.bCandidateZone == true)
                                                $scope.setHash();

                                            //100344 Resp. Candidate Portal: eLink does not work with "Old Candidate Zone"
                                            if ($("#pageType").val().toLowerCase() == "portal")
                                                window.location = '../../../TGwebhost/candidateportal.aspx?SID=' + $("#SIDValue").val();
                                        });

                                    }
                                    $timeout(function () {
                                        $scope.$apply();

                                    }, 0);
                                    $scope.loadwebtrackerscript("/TGNewUI/CandidateZone", $scope.customScriptRendering.CandidateZone);
                                }
                                break;
                            }
                        case 1:
                            {
                                if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.updateCandidateZoneData();
                                    $scope.SavedSearchesMetaData = data.SavedSearchesMetaData;
                                    $scope.bLoggedIn = true;
                                    $scope.SetDuplicateVariablesafterLogin(data, loginProfileDetails, "ChangePassword", $scope.calledFrom);
                                }
                                else if ($scope.bresponsiveCandidateZone) {
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.updateCandidateZoneData();
                                }
                                $scope.jobApplyUrl = "";
                                $scope.ResetNamePass($scope);
                                scope.submit = false;
                                scope.loginField = "";
                                scope.password = "";
                                ngDialog.closeAll();
                                $scope.LoginChangePassword = true;
                                $scope.bSignInView = false;
                                $scope.showInFullView = false;
                                $scope.login.ForgotPass = true;
                                $scope.login.NameOrPass = 'password';
                                $scope.ActivePage('ResetUserNamePassword');
                                break;
                            }
                        case -3:
                            {
                                $scope.errorAtLoggingIn = $scope.dynamicStrings.Login_Error;
                                $scope.bError = true;
                                scope.loginField = "";
                                scope.password = "";
                                scope.submit = false;
                                break;
                            }
                        case -1:
                            {
                                $scope.errorAtLoggingIn = $scope.dynamicStrings.ErrorMessage_InvalidUsernameOrPasswordError;
                                $scope.bError = true;
                                scope.loginField = "";
                                scope.password = "";
                                scope.submit = false;
                                if ($scope.tgSettings.LoginType == 0)
                                    $scope.UnameErrorID = $scope.dynamicStrings.Label_Email;
                                else
                                    $scope.UnameErrorID = $scope.dynamicStrings.Label_Username;
                                $scope.PassErrorID = $scope.dynamicStrings.Label_Password;
                                $scope.LoginErrorID = 'loginField';
                                break;
                            }
                        case -2:
                            {
                                $scope.errorAtLoggingIn = $scope.dynamicStrings.ErrorMessage_LockOutError;
                                $scope.bError = true;
                                scope.loginField = "";
                                scope.password = "";
                                scope.submit = false;
                                break;
                            }
                        case -4:
                            {
                                if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.updateCandidateZoneData();
                                    $scope.SavedSearchesMetaData = data.SavedSearchesMetaData;
                                    $scope.bLoggedIn = true;
                                    $scope.SetDuplicateVariablesafterLogin(data, loginProfileDetails, "ChangeSecQuestion", $scope.calledFrom);
                                }
                                else if ($scope.bresponsiveCandidateZone) {
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.updateCandidateZoneData();
                                }
                                $scope.jobApplyUrl = "";
                                scope.submit = false;
                                scope.loginField = "";
                                scope.password = "";
                                ngDialog.closeAll();
                                $scope.LoginChangeSecQuestion = true;
                                $scope.bSignInView = false;
                                $scope.ResetChangeSecQuestfunction($scope);
                                break;
                            }
                        case -6:
                            {
                                $scope.jobApplyUrl = "";
                                $scope.ResetNamePass($scope);
                                scope.submit = false;
                                scope.loginField = "";
                                scope.password = "";
                                ngDialog.closeAll();
                                $scope.LoginChangePassword = true;
                                $scope.bSignInView = false;
                                $scope.showInFullView = false;
                                $scope.login.ForgotPass = true;
                                $scope.login.NameOrPass = 'password';
                                $scope.PortalPwdReset = true;
                                $scope.ActivePage('ResetUserNamePassword');
                                break;
                            }
                        case 7: { //SM Login Invalid
                            $scope.showSMNewAccnt();
                        }
                    }
                });
            }
            else {
                $scope.bError = true;
                scope.oActiveLaddaButton.stop();
                if (!angular.isDefined(scope.loginField) || scope.loginField == '') {
                    if ($scope.tgSettings.LoginType == 0) {
                        $scope.UnameErrorID = $scope.dynamicStrings.Label_Email;
                        if ($scope.LoginErrorID == '') {
                            $scope.LoginErrorID = 'loginField';
                        }
                    }
                    else {
                        $scope.UnameErrorID = $scope.dynamicStrings.Label_Username;
                        if ($scope.LoginErrorID == '') {
                            $scope.LoginErrorID = 'loginField';
                        }
                    }

                }
                if (!angular.isDefined(scope.password) || scope.password == '') {
                    $scope.PassErrorID = $scope.dynamicStrings.Label_Password;
                    if ($scope.LoginErrorID == '') {
                        $scope.LoginErrorID = 'password';
                    }
                }

                $scope.$("#loginField").attr("required", true);
                $scope.$("#password").attr("required", true);
                $scope.$("#loginField").attr("aria-invalid", true);
                $scope.$("#password").attr("aria-invalid", true);

            }
        },
        switchSite: function (switchToSiteId, calledFrom) {

            var switchSiteRequest = {};
            switchSiteRequest.PartnerId = $("#partnerId").val();
            switchSiteRequest.SwitchToSiteId = switchToSiteId;
            switchSiteRequest.FromSiteId = $("#siteId").val();
            switchSiteRequest.CookieValue = $("#CookieValue").val();

            $scope.featuredOrLatestJobsAjax = $.ajax({
                success: function (data, status, jqxhr) {
                    if (data.Success == true) {
                        if (calledFrom) {

                        }
                        else {
                            window.location = "/TgNewUI/Search/Home/Home?partnerid=" + $("#partnerId").val() + "&siteid=" + switchToSiteId;
                        }
                        $("#SIDValue").val(data.newSID);
                    }

                },
                error: function (jqxhr, status, error) {
                },
                url: '/TgNewUI/Search/Ajax/SwitchSite',
                data: switchSiteRequest,
                type: 'POST',
                async: false
            });

        },
        showMobileSignIn: function (scope) {
            if (appScope.showVBTWarningAlert(true)) {
                return;
            }
            $scope.errorAtLoggingIn = '';
            $scope.bSignInView = true;
            $scope.bTransition = true;
            $scope.bError = false;
            $scope.calledFromDesktop = false;
            $scope.setTitle("logIn");
            $timeout(function () {
                $scope.bTransition = false;
                $scope.scrolltop();
                $scope.$apply();
            }, 1000);

        },
        onClickTab: function (scope, activeTabValue) {
            scope.activeTab = !scope.activeTab;
            $scope.tabValue = activeTabValue;
        },
        backClick: function (calledFromDesktop) {
            $scope.ShowTimeoutMessage = false;
            _.each($scope.oHistory, function (oPriorScope, sName) {
                oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
            });
            $scope.errorAtLoggingIn = "";
            $scope.bSignInView = false;
            $scope.showInFullView = false;
            $scope.bError = false;
            appScope.backtobSignInView = false;
            ngDialog.closeAll();
            if (!calledFromDesktop) {
                $scope.bError = false;
                $scope.bTransition = true;
                $timeout(function () {
                    $scope.bTransition = false;
                }, 1000);
            }
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        tabValue: "loginTemplate",
        NewAccntTab: function (value) {
            $scope.createAccount.bSocialNetwork = value;
            if (value)
                $("#socialNetwork").setFocus();
            else
                $("#createOwn").setFocus();
        },
        newAccntScreen: function (RedirectHome) {
            $scope.createAccount.bSocialNetwork = false;
            $scope.bCreateAccount = false;
            $scope.setTitle("createNewAccount");
            $scope.resetcreatAccount($scope);
            if (angular.isDefined(RedirectHome) && RedirectHome == true)
                $scope.bRedirectHome = true;
            else
                $scope.bRedirectHome = false;
            $scope.showInFullView = false;
            ngDialog.closeAll();
            $scope.login.ForgotPass = false;
            if ($scope.tgSettings.PrivacyStatement == '') {
                //$scope.bNewAccntScreen = true;
                //window.location = "../../../TGwebhost/pdsstepone.aspx?RegType=Lite_Home&SID=" + $("#SIDValue").val();
                $scope.bCreateAccount = true;
                $scope.bPrivacyPages = false;
                $scope.setHash();
                $scope.loadwebtrackerscript("/TGNewUI/CreateUser", $scope.customScriptRendering.Search);
            }
            else {
                if ($scope.privacyPolicySettings == undefined) {
                    var privacyPolicyStatementRequest = {};
                    privacyPolicyStatementRequest.PartnerId = $("#partnerId").val();
                    privacyPolicyStatementRequest.SiteId = $("#siteId").val();
                    var url = "/TgNewUI/Search/Ajax/PrivacyPolicyStatement";
                    $http.post(url, privacyPolicyStatementRequest).success(function (data, status, headers, config) {
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                        $scope.privacyPolicySettings = data.PrivacyPolicySettings;
                        if (data.PrivacyPolicySettings.PrivacyPlacement == '2') {
                            $scope.bPrivacyPages = true;
                            $scope.bPrivacyPolicyQuestion = true;
                            $scope.setHash();
                        }
                        else {
                            $scope.bPrivacyPages = true;
                            $scope.bPrivacyPolicyStatement = true;
                            $scope.setHash();
                        }
                    });
                    $scope.loadwebtrackerscript("/TGNewUI/PrivacyPolicyStatement", $scope.customScriptRendering.Search);
                }
                else if ($scope.privacyPolicySettings.PrivacyPlacement == '2') {
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = true;
                    $scope.setHash();
                }
                else {
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyStatement = true;
                    $scope.setHash();
                }

            }
            $scope.bSignInView = false;
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        privacyDisAgreeAction: function () {
            $scope.bPrivacyPolicyStatement = false;
            if ($scope.privacyPolicySettings.AltPrivacyPolicy == '') {
                $scope.bPrivacyPages = false;
            }
            else {
                $scope.bPrivacyOptOut = true;
            }
            $scope.setHash();
        },
        showMobileSignInDialog: function (scope) {
            if (appScope.showVBTWarningAlert(true)) {
                return;
            }
            $.captureFocus();
            $scope.theme = 'ngdialog-theme-default';
            $scope.bShowMobileSignInDialog = true;
            $scope.errorAtLoggingIn = '';
            $scope.submit = false;
            $scope.bError = false;
            $scope.calledFrom = scope.calledFrom;
            $('body').addClass('noScroll');
            setTimeout(function () {

                ngDialog.open({
                    preCloseCallback: function (value) {
                        $scope.ShowTimeoutMessage = false;
                        _.each($scope.oHistory, function (oPriorScope, sName) {
                            oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
                        });
                        $scope.bBypassGQLogin = false;
                        $scope.AnonymousLoginType = "";
                        $scope.bShowMobileSignInDialog = false;
                        $('body').removeClass('noScroll');
                    },
                    template: 'MobileSignInTemplate', scope: appScope, className: 'ngdialog-theme-default mobileSignInDialogue', showClose: false, closeByDocument: false, data: { mobileLogin: 'true' }, appendTo: "#menuContainer", ariaRole: "dialog"
                });
            }, 100);

        },
        showLocalesDialog: function (scope) {
            ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                },
                template: 'LocalesTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer"
            })
        },
        nextPrivacyFlow: function (value) {
            if (value == "option1") {
                //window.location = "../../../TGwebhost/pdsstepone.aspx?RegType=Lite_Home&SID=" + $("#SIDValue").val();

                if (appScope.AnonymousLoginType != "") {
                    $scope.CreateAnonymousLogin(appScope.AnonymousLoginType);
                }
                else {
                    $scope.bPrivacyPages = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bCreateAccount = true;
                    $scope.resetcreatAccount($scope);
                }
                $scope.setHash();
            }
            else if (value == "option2") {
                $scope.bPrivacyPolicyQuestion = false;
                $scope.bPrivacyPolicyStatement = true;
                $scope.setHash();
            }
            else if (value == "option3") {
                $scope.bPrivacyOptOut = false;
                $scope.bPrivacyPages = false;
                $scope.setHash();
            }
        },
        openPasswordTips: function (scope) {
            $scope.bSignInView = false;
            $scope.calledFromDesktop = true;
            $scope.theme = 'ngdialog-theme-default';
            $.captureFocus();
            ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                },
                template: 'modalDialogId', scope: $scope, className: 'ngdialog-theme-default customDialogue updateAccountDialog', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
            });
        },
        validateForm: function (createuser) {
            $scope.createAccount.securityQuestion.errorValue1 = false;
            $scope.createAccount.securityQuestion.errorValue2 = false;
            $scope.createAccount.securityQuestion.errorValue3 = false;
            $scope.createAccount.securityQuestion.errorAnswer1 = false;
            $scope.createAccount.securityQuestion.errorAnswer2 = false;
            $scope.createAccount.securityQuestion.errorAnswer3 = false;
            $scope.createAccount.mainError = "";
            if ($scope.createAccount.login.userName != '' && $scope.createAccount.login.password != '') {
                if ($scope.createAccount.login.userName == $scope.createAccount.login.password) {
                    var msg = {};
                    msg.label = '';
                    msg.error = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                    msg.field = "username";
                    $scope.createAccount.errormsgs.push(msg);
                }
            }
            if (typeof $scope.createAccount.login.password != "undefined" && $scope.createAccount.login.password != "" && $scope.createAccount.login.password.indexOf(" ") > 0) {
                var msg = {};
                msg.label = '';
                msg.error = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                msg.field = "password";
                $scope.createAccount.errormsgs.push(msg);
            }
            if ($scope.createAccount.noOfSecurityQuestions >= 2) {
                if ($scope.createAccount.securityQuestion.value1 != '' && $scope.createAccount.securityQuestion.value2 != '') {
                    if ($scope.createAccount.securityQuestion.value1 == $scope.createAccount.securityQuestion.value2) {
                        $scope.createAccount.securityQuestion.errorValue1 = true;
                        $scope.createAccount.securityQuestion.errorValue2 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer1 && $scope.createAccount.securityQuestion.answer1 != '' && $scope.createAccount.securityQuestion.answer2 != '') {
                    if ($scope.createAccount.securityQuestion.answer1 == $scope.createAccount.securityQuestion.answer2) {
                        $scope.createAccount.securityQuestion.errorAnswer1 = true;
                        $scope.createAccount.securityQuestion.errorAnswer2 = true;
                    }
                }
            }
            if ($scope.createAccount.noOfSecurityQuestions >= 3) {
                if ($scope.createAccount.securityQuestion.value1 != '' && $scope.createAccount.securityQuestion.value2 != '') {
                    if ($scope.createAccount.securityQuestion.value1 == $scope.createAccount.securityQuestion.value2) {
                        $scope.createAccount.securityQuestion.errorValue1 = true;
                        $scope.createAccount.securityQuestion.errorValue2 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.value1 != '' && $scope.createAccount.securityQuestion.value3 != '') {
                    if ($scope.createAccount.securityQuestion.value1 == $scope.createAccount.securityQuestion.value3) {
                        $scope.createAccount.securityQuestion.errorValue1 = true;
                        $scope.createAccount.securityQuestion.errorValue3 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.value2 != '' && $scope.createAccount.securityQuestion.value3 != '') {
                    if ($scope.createAccount.securityQuestion.value2 == $scope.createAccount.securityQuestion.value3) {
                        $scope.createAccount.securityQuestion.errorValue2 = true;
                        $scope.createAccount.securityQuestion.errorValue3 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer1 && $scope.createAccount.securityQuestion.answer1 != '' && $scope.createAccount.securityQuestion.answer2 != '') {
                    if ($scope.createAccount.securityQuestion.answer1 == $scope.createAccount.securityQuestion.answer2) {
                        $scope.createAccount.securityQuestion.errorAnswer1 = true;
                        $scope.createAccount.securityQuestion.errorAnswer2 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer1 && $scope.createAccount.securityQuestion.answer1 != '' && $scope.createAccount.securityQuestion.answer3 != '') {
                    if ($scope.createAccount.securityQuestion.answer1 == $scope.createAccount.securityQuestion.answer3) {
                        $scope.createAccount.securityQuestion.errorAnswer1 = true;
                        $scope.createAccount.securityQuestion.errorAnswer3 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer2 && $scope.createAccount.securityQuestion.answer2 != '' && $scope.createAccount.securityQuestion.answer3 != '') {
                    if ($scope.createAccount.securityQuestion.answer2 == $scope.createAccount.securityQuestion.answer3) {
                        $scope.createAccount.securityQuestion.errorAnswer2 = true;
                        $scope.createAccount.securityQuestion.errorAnswer3 = true;
                    }
                }
            }

        },
        getLabelByName: function (name) {
            if (name == "username") return $scope.tgSettings.LoginType == "1" ? $scope.dynamicStrings.Label_Username : $scope.dynamicStrings.EmailAddress;
            if (name == "password" || name == "currentPassword") return $scope.dynamicStrings.Label_Password;
            if (name == "newPassword") return $scope.dynamicStrings.Label_NewPassword;
            if (name == "confirmPassword") return $scope.dynamicStrings.Label_ReenterPassword;
            if (name == "confirmNewPassword") return $scope.dynamicStrings.Label_ReEnterNewPassword;
            if (name == "selectSecurityQuestion1") return $scope.dynamicStrings.Label_Question1;
            if (name == "selectSecurityQuestion2") return $scope.dynamicStrings.Label_Question2;
            if (name == "selectSecurityQuestion3") return $scope.dynamicStrings.Label_Question3;
            if (name == "securityQuestion1Answer") return $scope.dynamicStrings.Label_Question1;
            if (name == "securityQuestion2Answer") return $scope.dynamicStrings.Label_Question2;
            if (name == "securityQuestion3Answer") return $scope.dynamicStrings.Label_Question3;
            if (name == "email") return $scope.dynamicStrings.Label_To;
            if (name == "yourEmail") return $scope.dynamicStrings.sendemailyouremail;
            if (name == "yourName") return $scope.dynamicStrings.sendemailyourName;

            else return "unknownlabel"
        },
        getRequiredErrorByName: function (name) {
            if (name == "username") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "password" || name == "currentPassword" || name == "newPassword") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "confirmPassword" || name == "confirmNewPassword") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "selectSecurityQuestion1") return $scope.dynamicStrings.Placeholder_Selectquestion;
            if (name == "selectSecurityQuestion2") return $scope.dynamicStrings.Placeholder_Selectquestion;
            if (name == "selectSecurityQuestion3") return $scope.dynamicStrings.Placeholder_Selectquestion;
            if (name == "securityQuestion1Answer") return $scope.dynamicStrings.ErrorMessage_AnswerRequired;
            if (name == "securityQuestion2Answer") return $scope.dynamicStrings.ErrorMessage_AnswerRequired;
            if (name == "securityQuestion3Answer") return $scope.dynamicStrings.ErrorMessage_AnswerRequired;
            if (name == "email" || name == "yourEmail") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "yourName") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            else return "unknownerrormsg"
        },
        showInvalidDetails: function () {
            if (["selectSecurityQuestion1", "selectSecurityQuestion2", "selectSecurityQuestion3"].indexOf($('#createAccountForm .ng-invalid').first().attr("ID")) !== -1) {
                $('[id="' + $('#createAccountForm .ng-invalid').first().attr("ID") + '-button"]').focus();
            }
            else if ($('#createAccountForm .ng-invalid').length > 0) {
                $('#createAccountForm .ng-invalid').first().focus();
            } else if ($('#updateAccountForm .ng-invalid').length > 0) {
                $('#updateAccountForm .ng-invalid').first().focus();
            } else if ($('#sendToFriendForm .ng-invalid').length > 0) {
                $('#sendToFriendForm .ng-invalid').first().focus();
            } else
                $(".fieldcontain.invalid").eq(0).scrollAndFocus();
        },
        scrollToInvalidField: function (scope) {
            if (["selectSecurityQuestion1", "selectSecurityQuestion2", "selectSecurityQuestion3", "optSecurityQuestion1", "optSecurityQuestion2", "optSecurityQuestion3"].indexOf(scope.msg.field) !== -1) {
                $('[id="' + scope.msg.field + '-button"]').focus();
            }
            else
                $('[name="' + scope.msg.field + '"]').focus();

        },
        ThrottleCreateAccountValidation: function () {
            if ($scope.createAccount.securityQuestion.value1 != $("#selectSecurityQuestion1").val() && $("#selectSecurityQuestion1").val() != null) {
                $scope.createAccount.securityQuestion.value1 = $("#selectSecurityQuestion1").val();
                $scope.createAccount.CAsubmitted1 = false;
            }
            if ($scope.createAccount.securityQuestion.value2 != $("#selectSecurityQuestion2").val() && $("#selectSecurityQuestion2").val() != null) {
                $scope.createAccount.securityQuestion.value2 = $("#selectSecurityQuestion2").val();
                $scope.createAccount.CAsubmitted1 = false;
            }
            if ($scope.createAccount.securityQuestion.value3 != $("#selectSecurityQuestion3").val() && $("#selectSecurityQuestion3").val() != null) {
                $scope.createAccount.securityQuestion.value3 = $("#selectSecurityQuestion3").val();
                $scope.createAccount.CAsubmitted1 = false;
            }
        },

        submitAndLoginCreateAccount: function (createAccountForm, scope) {
            $scope.createAccount.showForgotPasswordLink = false;
            $scope.createAccount.errormsgs = [];
            $("[aria-invalid]").removeAttr("aria-invalid");
            if ((appScope.SM_SiteID != appScope.smType.Google)) {
                if ($scope.createAccount.login.userName != '' && $scope.createAccount.login.password != '') {
                    if ($scope.createAccount.login.userName == $scope.createAccount.login.password) {
                        var msg = {};
                        msg.label = '';
                        msg.error = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                        msg.field = "username";
                        $("#" + msg.field).attr("aria-invalid", "true");
                        $scope.createAccount.errormsgs.push(msg);
                    }
                }
                if (typeof $scope.createAccount.login.password != "undefined" && $scope.createAccount.login.password != "" && $scope.createAccount.login.password.indexOf(" ") > 0) {
                    var msg = {};
                    msg.label = '';
                    msg.error = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                    msg.field = "password";
                    $("#" + msg.field).attr("aria-invalid", "true");
                    $scope.createAccount.errormsgs.push(msg);
                }
                $.each(createAccountForm.$error, function (errorType, allErrors) {
                    if (allErrors != false) {
                        if (errorType == "required") {
                            var nxtvalue = 0;
                            $.each(allErrors, function (index, error) {
                                if (error.$name != "confirmPassword") {
                                    var msg = {};
                                    if (nxtvalue == 0 || error.$name != 'securityQuestion' + nxtvalue + 'Answer') {
                                        msg.label = $scope.getLabelByName(error.$name);
                                        msg.error = ' - ' + $scope.getRequiredErrorByName(error.$name);
                                        msg.field = error.$name;
                                        $("#" + msg.field).attr("aria-invalid", "true");
                                        $scope.createAccount.errormsgs.push(msg);
                                    }
                                    if (error.$name == 'selectSecurityQuestion1') {
                                        nxtvalue = 1;
                                    }
                                    else if (error.$name == 'selectSecurityQuestion2') {
                                        nxtvalue = 2;
                                    }
                                    else if (error.$name == 'selectSecurityQuestion3') {
                                        nxtvalue = 3;
                                    }
                                    else {
                                        nxtvalue = 0;
                                    }
                                }
                            });
                        }
                        if (errorType == "notValidLength") {
                            $.each(allErrors, function (index, error) {
                                var msg = {};
                                msg.label = $scope.getLabelByName(error.$name);
                                if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                    msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe6characters;
                                else
                                    msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                                msg.field = error.$name;
                                $("#" + msg.field).attr("aria-invalid", "true");
                                $scope.createAccount.errormsgs.push(msg);
                            });
                        }
                        if (errorType == "noSpecialCharacter") {
                            $.each(allErrors, function (index, error) {
                                var msg = {};
                                msg.label = $scope.getLabelByName(error.$name);
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                                msg.field = error.$name;
                                $("#" + msg.field).attr("aria-invalid", "true");
                                $scope.createAccount.errormsgs.push(msg);
                            });
                        }
                        if (errorType == "pattern") {
                            $.each(allErrors, function (index, error) {
                                var msg = {};
                                msg.label = $scope.getLabelByName(error.$name);
                                msg.error = ' - ' + (error.$name.indexOf("securityQuestion") == 0 ? $scope.dynamicStrings.ErrorMessage_InvalidSecurityAnswer : $scope.dynamicStrings.ErrorMessage_InvalidEmail);
                                msg.field = error.$name;
                                $("#" + msg.field).attr("aria-invalid", "true");
                                $scope.createAccount.errormsgs.push(msg);
                            });
                        }
                        if (errorType == "nxEqual") {
                            $.each(allErrors, function (index, error) {
                                var msg = {};
                                msg.label = $scope.dynamicStrings.Label_ReenterPassword;
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_PasswordMustMatch;
                                msg.field = error.$name;
                                $("#" + msg.field).attr("aria-invalid", "true");
                                $scope.createAccount.errormsgs.push(msg);
                            });
                        }
                    }
                });
                if ($scope.createAccount.securityQuestion.errorValue1 == true || $scope.createAccount.securityQuestion.errorValue2 == true
                    || $scope.createAccount.securityQuestion.errorValue3 == true || $scope.createAccount.securityQuestion.errorAnswer1 == true
                    || $scope.createAccount.securityQuestion.errorAnswer2 == true || $scope.createAccount.securityQuestion.errorAnswer3 == true) {
                    var msg = {};
                    msg.label = '';
                    msg.error = $scope.dynamicStrings.Errormessage_SecurityQuestionsAndAnswersMustBeUnique;
                    msg.field = "selectSecurityQuestion1";
                    $("#" + msg.field).attr("aria-invalid", "true");
                    $scope.createAccount.errormsgs.push(msg);
                }
            }
            if ((appScope.SM_SiteID == appScope.smType.Google) || (createAccountForm.$valid && $scope.createAccount.errormsgs.length == 0)) {
                if (appScope.showVBTWarningAlert(true)) {
                    return;
                }
                if ((appScope.SM_SiteID == appScope.smType.Google) || (!$scope.createAccount.securityQuestion.errorValue1 && !$scope.createAccount.securityQuestion.errorValue2 && !$scope.createAccount.securityQuestion.errorValue3 && !$scope.createAccount.securityQuestion.errorAnswer1 && !$scope.createAccount.securityQuestion.errorAnswer2 && !$scope.createAccount.securityQuestion.errorAnswer3 && $scope.createAccount.mainError == "")) {
                    scope.oActiveLaddaButton.start();
                    var NewProfileLoginAndRedirectRequest = {};
                    NewProfileLoginAndRedirectRequest.PartnerId = $("#partnerId").val();
                    NewProfileLoginAndRedirectRequest.SiteId = $("#siteId").val();
                    NewProfileLoginAndRedirectRequest.CalledFrom = $scope.calledFrom;
                    if (appScope.SM_SiteID == appScope.smType.Google) {
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest = {};
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_SiteID = appScope.SM_SiteID;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_ProfileID = appScope.SM_ProfileID;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_AccessToken = appScope.SM_AccessToken;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_FullName = appScope.SM_FullName;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_FirstName = appScope.SM_FirstName;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_LastName = appScope.SM_LastName;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_EmailID = appScope.SM_EmailID;
                        NewProfileLoginAndRedirectRequest.socialMediaLoginRequest.SM_ProfilePicture = appScope.SM_ProfilePicture;
                    } else {
                        NewProfileLoginAndRedirectRequest.UserName = $scope.createAccount.login.userName;
                        NewProfileLoginAndRedirectRequest.Password = $scope.createAccount.login.password;
                        NewProfileLoginAndRedirectRequest.SQuestionOne = ($scope.createAccount.securityQuestion.value1 == '') ? '' : parseInt($scope.createAccount.securityQuestion.value1) + 1;
                        NewProfileLoginAndRedirectRequest.SQuestionTwo = ($scope.createAccount.securityQuestion.value2 == '') ? '' : parseInt($scope.createAccount.securityQuestion.value2) + 1;
                        NewProfileLoginAndRedirectRequest.SQuestionThree = ($scope.createAccount.securityQuestion.value3 == '') ? '' : parseInt($scope.createAccount.securityQuestion.value3) + 1;
                        NewProfileLoginAndRedirectRequest.SAnswerOne = $scope.createAccount.securityQuestion.answer1;
                        NewProfileLoginAndRedirectRequest.SAnswerTwo = $scope.createAccount.securityQuestion.answer2;
                        NewProfileLoginAndRedirectRequest.SAnswerThree = $scope.createAccount.securityQuestion.answer3;
                    }
                    //NewProfileLoginAndRedirectRequest.Locale = $scope.Locale;
                    NewProfileLoginAndRedirectRequest.Locale = $scope.tgSettings.DefLocaleId;
                    NewProfileLoginAndRedirectRequest.LanguageSelected = $scope.tgSettings.DefLanguageId;
                    NewProfileLoginAndRedirectRequest.LoginMgmtType = $scope.tgSettings.LoginDetailsManagement;
                    NewProfileLoginAndRedirectRequest.BrowserInfo = navigator.userAgent;
                    NewProfileLoginAndRedirectRequest.NoOfSecurityQuestions = $scope.createAccount.noOfSecurityQuestions
                    NewProfileLoginAndRedirectRequest.EncryptedSessionId = $("#CookieValue").val();
                    NewProfileLoginAndRedirectRequest.IP = "1.1.1.1";
                    NewProfileLoginAndRedirectRequest.SIDValue = $("#SIDValue").val();
                    NewProfileLoginAndRedirectRequest.ResponsiveCandidateZone = $scope.bresponsiveCandidateZone;
                    if ($scope.encryptedBruid != "")
                        NewProfileLoginAndRedirectRequest.EncryptedBruid = $scope.encryptedBruid;
                    var url = '/TgNewUI/Search/Ajax/NewProfileLoginAndRedirect';
                    $http.post(url, NewProfileLoginAndRedirectRequest).success(function (data, status, headers, config) {
                        if (data) {
                            scope.oActiveLaddaButton.stop();
                            if (data.NewProfileResult == "NEW_PROFILE_SUCCESS") {
                                if (data.LoginResult == 0) {
                                    $scope.AnonymousLoginType = "";
                                    $scope.encryptedBruid = data.EncryptedBruId;
                                    $scope.hashCode = data.HashCode;
                                    $scope.loadwebtrackerscript("/TGNewUI/Login", $scope.customScriptRendering.Search);
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.SavedSearchesMetaData = {};
                                    $scope.SavedSearchesMetaData.SavedSearches = [];
                                    $scope.updateCandidateZoneData();
                                    if (data.NewSessionId != null || data.NewSessionId != "") {
                                        $("#CookieValue").val(data.NewSessionId);
                                    }
                                    if ($scope.standAloneGQ > 0) {
                                        $scope.bLoggedIn = true;
                                        $scope.standAloneGQApply();
                                    }
                                    else if ($scope.jobApplyUrl != "") {
                                        $scope.bLoggedIn = true;
                                        var rft = $("[name='__RequestVerificationToken']").val();
                                        $http.get("/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl + "&RFT=" + rft)
                                            .success(function (result) {
                                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                                $scope.$root.applyResponse = result;
                                            });
                                    }
                                    else if (appScope.bJobDetailsShown || appScope.bSearchResults && ($scope.calledFrom == 'save' || $scope.calledFrom == 'refer' || $scope.calledFrom == 'savesearch') || $scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                                        if ($scope.calledFrom == 'save' || $scope.calledFrom == 'refer' || $scope.calledFrom == 'savesearch') {
                                            $scope.bLoggedIn = true;
                                            $scope.bCreateAccount = false;
                                            if ($scope.calledFrom == 'savesearch') {
                                                $scope.openSaveSearchDialog();
                                            }
                                            else if ($scope.bJobDetailsShown) {
                                                $scope.CallApply();
                                                $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                                            }
                                            else if ($scope.bSearchResults) {
                                                $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                                            }
                                        }
                                        else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                                            $scope.bLoggedIn = true;
                                            var SMLoginjobids = $scope.SearchResultsJobsSelectedScope.jobIds.split(",").length > 0 ? $scope.SearchResultsJobsSelectedScope.jobIds : "";
                                            $scope.bCreateAccount = false;
                                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                                            _.each(appScope.jobs, function (job) {
                                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                                    job.Selected = true;
                                                }
                                            });
                                            $scope.postToNextPage('', appScope, 'mulapplyvald');
                                            $scope.bCreateAccount = false;
                                        }
                                    }
                                    else if ($scope.bresponsiveCandidateZone) {
                                        $scope.bCandidateZone = true;
                                        $scope.ViewDashBoardData("SavedJobs");
                                    }
                                    else {
                                        $scope.bCandidateZone = true;
                                        $scope.CandidateZoneData = data;
                                        $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                                        $scope.bLoggedIn = true;
                                        $scope.bCreateAccount = false;
                                        $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                                        $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                                        $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                                        $scope.loadwebtrackerscript("/TGNewUI/CandidateZone", $scope.customScriptRendering.CandidateZone);
                                    }
                                }
                            }
                            else if (data.NewProfileResult == "EMAIL_ID_EXISTS") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_CreatedAccountInThePast;
                                $scope.createAccount.showForgotPasswordLink = true;
                                $scope.error_displayForgotPasswordLink();
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_ISUSERNAME") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_FORMAT") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_CredentialsNotValidated;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_NO_SPACES") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_SPECIAL_CHARACTERS") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_MINIMUM_LENGTH") {
                                if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                    $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe6characters
                                else
                                    $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                                return false;
                            }
                            else if (data.NewProfileResult == "EXISTING_USERNAME") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_UsenameAlreadyUsed + $scope.dynamicStrings.ErrorMessage_TryAgainlater;
                                return false;
                            }
                            else {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_CreatedAccountFailed;
                                $scope.createAccount.showForgotPasswordLink = true;
                                $scope.error_displayForgotPasswordLink();
                                console.log("failed with status of " + status);
                                return false;

                            }
                            // that.$apply();
                        }
                        setTimeout(function () {

                            $(".createAccountContainer .backLink").css("display", "block");
                            $scope.$apply();
                        }, 0);
                    }).error(function (data, status, headers, config) {
                        $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_CreatedAccountFailed;
                        $scope.createAccount.showForgotPasswordLink = true;
                        $scope.error_displayForgotPasswordLink();
                        console.log("failed with status of " + status);
                        return false;
                    });
                }
            }
            else {
                $(".errorContainer:visible").setFocus();
            }
        },
        goBackCreateUserFlow: function () {
            if ($location.hash().indexOf("CreateAccount") != -1 || $location.hash().indexOf("Policy") != -1) {
                history.back();
            }
            else {
                if ($scope.tgSettings.PrivacyStatement != '') {
                    if (that.bCreateAccount == true) {
                        that.bPrivacyPages = true;
                        if (that.bPrivacyPolicyQuestion)
                            that.bPrivacyPolicyStatement = false;
                        else
                            that.bPrivacyPolicyStatement = true;
                        that.bCreateAccount = false;
                    } else if (that.bPrivacyOptOut == true) {
                        that.bPrivacyPages = true;
                        if (that.bPrivacyPolicyQuestion)
                            that.bPrivacyPolicyStatement = false;
                        else
                            that.bPrivacyPolicyStatement = true;
                        that.bPrivacyOptOut = false;
                    }
                    else if (that.bPrivacyPages == true) {
                        if (that.bPrivacyPolicyQuestion) {
                            that.bPrivacyPolicyQuestion = false;
                            var width = $(window).width();
                            $scope.bError = false;
                            that.bCreateAccount = false;
                            that.bPrivacyPages = false;
                            if (!$scope.isNonProfileAllowed && ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView)) {
                                if ($scope.backtobSignInView) {
                                    $scope.showInFullView = true;
                                }
                                $scope.bSignInView = true;
                                $scope.showMobileSignIn(this);
                            }

                        }
                        else if (that.bPrivacyPolicyStatement && that.privacyPolicySettings.PrivacyPlacement == '2') {
                            that.bPrivacyPolicyQuestion = true;
                            that.bPrivacyPolicyStatement = false;
                        }
                        else if (that.bPrivacyPolicyStatement && (that.privacyPolicySettings.PrivacyPlacement == '1' || that.privacyPolicySettings.PrivacyPlacement == '0')) {
                            var width = $(window).width();
                            $scope.bError = false;
                            that.bCreateAccount = false;
                            that.bPrivacyPages = false;
                            if (!$scope.isNonProfileAllowed && ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView)) {
                                if ($scope.backtobSignInView) {
                                    $scope.showInFullView = true;
                                }
                                $scope.bSignInView = true;
                                $scope.showMobileSignIn(this);
                            }

                        }
                        else {
                            var width = $(window).width();
                            $scope.bError = false;
                            that.bCreateAccount = false;
                            if (!$scope.isNonProfileAllowed && ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView)) {
                                if ($scope.backtobSignInView) {
                                    $scope.showInFullView = true;
                                }
                                $scope.bSignInView = true;
                                $scope.showMobileSignIn(this);
                            }
                        }
                    }
                }
                else if ($scope.tgSettings.PrivacyStatement == '' || that.bPrivacyPages == false) {
                    var width = $(window).width();
                    $scope.bError = false;
                    that.bCreateAccount = false;
                    if (!$scope.isNonProfileAllowed && ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView)) {
                        if ($scope.backtobSignInView) {
                            $scope.showInFullView = true;
                        }
                        $scope.bSignInView = true;
                        $scope.showMobileSignIn(this);
                    }
                }
                $timeout(function () { $scope.$apply() });
            }
        },

        homeView: function () {
            appScope.$root.oHistory = _.omit(appScope.oHistory, ['ForgotUsernamePassword', 'SecurityQuestions', 'ForgotUsername', 'ResetPassword']);
            previousHashes = _.without(previousHashes, 'ForgotUsernamePassword', 'SecurityQuestions', 'ForgotUsername', 'ResetPassword');
            if ($scope.bLoggedIn == true && $scope.bresponsiveCandidateZone != true && $scope.CandidateZoneData == null) {
                var candidateZoneRequest = {};
                candidateZoneRequest.PartnerId = $("#partnerId").val();
                candidateZoneRequest.SiteId = $("#siteId").val();
                candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                candidateZoneRequest.SIDValue = $("#SIDValue").val();
                url = '/TgNewUI/Search/Ajax/CandidateZone';
                $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                    $scope.CandidateZoneData = data;
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                        $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                        $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                        $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                        $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                    }
                });
            }
            $scope.searchResultsFromSavedSearch = null;
            if ($("#pageType").val() == "") {
                $scope.jobs = $scope.featuredJobs;
                $scope.toggleCheckBoxes = true;
                $scope.SelectedJobsChecked = false;
                _.each($scope.jobs, function (job) {
                    job.Selected = false;
                });
                if ($scope.featuredJobs != null) {
                    $scope.jobsCount = $scope.featuredJobs.length;
                }
                else {
                    $scope.jobsCount = 0;
                }
                $scope.updateHeading($scope.hotJobsType);
                $scope.bInitialLoad = true;
                $scope.bSearchResults = false;
                $scope.bJobDetailsShown = false;
                $scope.bSidebarVisible = false;
                $scope.bSidebarShown = false;
                $scope.bSidebarOverlay = false;
                $scope.bShowMoreButton = false;
                $scope.bPowerSearchVisible = false;
                $scope.$root.workFlow = $scope.workFlow = "welcome";
                $("#hSMLocalId").val("");
                $("#hSMJobId").val("");
                $("#hSMTQId").val("");

                $scope.bPrivacyPages = false;
                $scope.bPrivacyOptOut = false;
                $scope.bPrivacyPolicyStatement = false;
                $scope.bPrivacyPolicyQuestion = false;
                $scope.bSelectedGroup = false;
                $scope.backtobSignInView = false;
                $scope.bCreateAccount = false;
                $scope.login.ForgotPass = false;
                $scope.bSignInView = false;
                $scope.LoginChangeSecQuestion = false;
                $scope.bCandidateZone = false;
                $scope.bRenderPhoneViewSearch = false;
                $scope.SelectJobs = $scope.tgSettings.SelectJobsText;

                if ($scope.bLoggedIn) {
                    var profiledetailsRequest = {
                        ClientId: $("#partnerId").val(),
                        SiteId: $("#siteId").val(),
                        SessionID: $("#CookieValue").val(),
                        ResponsiveCandidateZone: $scope.bresponsiveCandidateZone
                    };
                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/Getprofiledetails",
                        data: profiledetailsRequest,
                        success: function (data) {
                            if ($scope.ProfileDetails == null || (typeof $scope.ProfileDetails == "undefined")) {
                                $scope.ProfileDetails = {};
                            }
                            $scope.ProfileDetails.FirstName = data.BasicProfileDetails.FirstName;
                            $scope.ProfileDetails.LastName = data.BasicProfileDetails.LastName;
                            $scope.ProfileDetails.email = data.BasicProfileDetails.email;

                            $scope.welcomeTitle = $scope.tgSettings.LandingLoggedWelcomePageTitle;
                            $scope.welcomeText = $scope.tgSettings.LandingLoggedWelcomeText;
                            $scope.SearchOpeningsSummaryText = $scope.tgSettings.LandingLoggedSearchOpeningsSummaryText != "" ? $scope.tgSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                        }
                    });
                } else {
                    $scope.ProfileDetails != null ? $scope.ProfileDetails.FirstName = "" : null;
                    $scope.ProfileDetails != null ? $scope.ProfileDetails.LastName = "" : null;
                }

                setTimeout(function () { $scope.$apply(); }, 0);
                setTimeout(function () { $scope.setHash(false, arguments, this); }, 10);
            }
            else {
                var HomePageRequest = {};
                HomePageRequest.partnerId = $("#partnerId").val();
                HomePageRequest.siteId = $("#siteId").val();
                url = '/TgNewUI/Search/Ajax/HomeView';
                $http.post(url, HomePageRequest).success(function (data, status, headers, config) {
                    $scope.jobs = data.HotJobs.Job;
                    if (data.HotJobs.Job != null) {
                        $scope.jobsCount = data.HotJobs.Job.length;
                    }
                    else {
                        $scope.jobsCount = 0;
                    }
                    $scope.toggleCheckBoxes = true;
                    $scope.SelectedJobsChecked = false;
                    _.each($scope.jobs, function (job) {
                        job.Selected = false;
                    });
                    $scope.keywordFields = data.KeywordCustomSolrFields;
                    $scope.locationFields = data.LocationCustomSolrFields;
                    $scope.featuredJobs = data.HotJobs.Job;
                    $scope.jobCounterIntroText = $scope.jobCounterIntroText.replace("[#jobcount#]", data.TotalCount);
                    $scope.$root.queryParams.partnerid = $("#partnerId").val();
                    $("#pageType").val("");
                    $scope.showInitialJobs();
                    $scope.updateHeading(data.JobsType);
                    $scope.bInitialLoad = true;
                    $scope.bSearchResults = false;
                    $scope.bJobDetailsShown = false;
                    $scope.bSidebarVisible = false;
                    $scope.bSidebarShown = false;
                    $scope.bSidebarOverlay = false;
                    $scope.bShowMoreButton = false;
                    $scope.bPowerSearchVisible = false;
                    $scope.bHideBackButtonInJobDetails = false;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                    $("#hSMLocalId").val("");
                    $("#hSMJobId").val("");
                    $("#hSMTQId").val("");
                    $("#hideBackButtonOnly").val("0");

                    $scope.bPrivacyPages = false;
                    $scope.bPrivacyOptOut = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bSelectedGroup = false;
                    $scope.bCreateAccount = false;
                    $scope.login.ForgotPass = false;
                    $scope.bSignInView = false;
                    $scope.LoginChangeSecQuestion = false;
                    $scope.bCandidateZone = false;
                    $scope.bRenderPhoneViewSearch = false;
                    $scope.SelectJobs = $scope.tgSettings.SelectJobsText;
                    setTimeout(function () { $scope.$apply(); }, 0);
                    setTimeout(function () { $scope.setHash(false, arguments, this); }, 10);
                });
            }
            $scope.bJobCart = false;
            $scope.bFileManager = false;
            $scope.bGQLaunchedFromJobCart = false;
            $scope.bJobCartLaunchedFromSearchResults = false;
            $scope.bJobCartLaunchedFromJobDetails = false;
            $scope.SelectedJobsChecked = false;
            $scope.bJobCartLaunchedFromHome = false;

            if ($scope.bFromTalentSuite) {
                $scope.closeTSMenu();
            }
        },
        candidateZoneView: function () {

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }
            if ($scope.CandidateZoneData == null) {

                var candidateZoneRequest = {};
                candidateZoneRequest.PartnerId = $("#partnerId").val();
                candidateZoneRequest.SiteId = $("#siteId").val();
                candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                candidateZoneRequest.SIDValue = $("#SIDValue").val();
                url = '/TgNewUI/Search/Ajax/CandidateZone';
                $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                    $scope.bCandidateZone = true;
                    $scope.CandidateZoneData = data;
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.bLoggedIn = true;
                    $scope.bSignInView = false;
                    $scope.bSearchResults = false;
                    $scope.bJobDetailsShown = false;
                    $scope.bSidebarVisible = false;
                    $scope.bSidebarShown = false;
                    $scope.bSidebarOverlay = false;
                    $scope.bPowerSearchVisible = false;
                    $scope.bJobCart = false;
                    $scope.bSelectedGroup = false;
                    $scope.bJobCartLaunchedFromSearchResults = false;
                    $scope.bJobCartLaunchedFromHome = false;
                    $scope.bGQLaunchedFromJobCart = false;
                    $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.bCreateAccount = false;
                    if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                        $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                        $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                        $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                        $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                    }
                    if (!$scope.utils.isNewHash('CandidateZone', $scope))
                        $scope.utils.updateHistory('CandidateZone');
                    $scope.setHash();
                });
            }
            else {
                $scope.bCandidateZone = true;
                $scope.bSearchResults = false;
                $scope.bJobDetailsShown = false;
                $scope.bSidebarVisible = false;
                $scope.bSidebarShown = false;
                $scope.bSidebarOverlay = false;
                $scope.bPowerSearchVisible = false;
                $scope.bSelectedGroup = false;
                $scope.welcomeTitle = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomePageTitle;
                $scope.welcomeText = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomeText;
                $scope.SearchOpeningsSummaryText = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? $scope.CandidateZoneData.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                $scope.bCreateAccount = false;
                $scope.bJobCart = false;
                $scope.bFileManager = false;
                $scope.bJobCartLaunchedFromSearchResults = false;
                $scope.bGQLaunchedFromJobCart = false;
                $scope.bJobCartLaunchedFromHome = false;
                if (!$scope.utils.isNewHash('CandidateZone', $scope))
                    $scope.utils.updateHistory('CandidateZone');
                $scope.setHash();
            }

            $scope.loadwebtrackerscript("/TGNewUI/CandidateZone", $scope.customScriptRendering.CandidateZone);

        },

        responsivecandidateZoneView: function (linkDetails, $event) {
            var candidatezoneView;
            if ($scope.sendToFriendInfo && $scope.sendToFriendInfo.emailSent)
                $scope.sendToFriendInfo.emailSent = false;
            if (typeof linkDetails != 'undefined') {
                candidatezoneView = linkDetails.CandidateZoneLinkId;
            }

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }

            var d = $("#responsiveCandZoneLink").position();
            if (d != undefined)
                $('.responsiveCandZoneMenu').css({
                    "left": +(d.left) + "px",
                    'top': +(d.top + 30) + "px"
                    //'float':'left'
                });
            if (!($scope.bFromTalentSuite && typeof linkDetails != 'undefined' && linkDetails.responsive)) {
                $scope.bcandidatezoneSubmenu = !$scope.bcandidatezoneSubmenu;
                $("#responsiveCandZoneLink i").hasClass('fa-chevron-down') ? $("#responsiveCandZoneLink i").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#responsiveCandZoneLink i").removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }
            if (candidatezoneView) {
                if ((candidatezoneView == "accountSettings" || candidatezoneView == "jobProfile") && $scope.bCandidateZone && $scope.candidatezoneSubView == candidatezoneView) {
                    $scope.closeTSMenu();
                    return;
                }
                if (candidatezoneView == 'viewAssessment' || candidatezoneView == 'candidatePortal' || candidatezoneView == 'eventManager'
                    || candidatezoneView == 'communicationHistory' || candidatezoneView == 'submitGeneralReferral' || candidatezoneView == 'socialReferralStatus' || candidatezoneView == 'SearchJob') {
                    $scope.moveToNextPage(linkDetails.CandidateZoneLinkURL, $event);
                    $scope.closeTSMenu();
                    return;
                }

                $scope.bLoggedIn = true;
                $scope.bSignInView = false;
                $scope.bSearchResults = false;
                $scope.bJobDetailsShown = false;
                $scope.bSidebarVisible = false;
                $scope.bSidebarShown = false;
                $scope.bSidebarOverlay = false;
                $scope.bPowerSearchVisible = false;
                $scope.bJobCart = false;
                $scope.bSelectedGroup = false;
                $scope.bJobCartLaunchedFromSearchResults = false;
                $scope.bJobCartLaunchedFromHome = false;
                $scope.bGQLaunchedFromJobCart = false;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                $scope.bCreateAccount = false;
                $scope.bCandidateZone = true;
                $scope.candidatezoneSubView = candidatezoneView;
                $scope.bEditProfileEditMode = false;
                $scope.candidatezoneEditProfileView = "profile";
                $scope.savedSearchActionCompletion = 0;
                $scope.searchResultsFromSavedSearch = null;
                $scope.subViewInitialized = false;

                if (candidatezoneView.toLowerCase() == "dashboard")
                    $scope.ViewDashBoardData("SavedJobs");
                else if (candidatezoneView.toLowerCase() == "responsiveassessment") {
                    $scope.candidatezoneSubView = candidatezoneView;
                    $scope.renderAssessments(linkDetails.CandidateZoneLinkURL);
                } else if (candidatezoneView.toLowerCase() == "responsivereferrals") {
                    $scope.candidatezoneSubView = candidatezoneView;
                    $scope.ViewReferrals();
                } else if (candidatezoneView.toLowerCase() == "messagearchive") {
                    $scope.CommunicationView(1);
                }
                $scope.closeTSMenu();
            }
        },
        //This will be called from TS Menu only when Responsive Candidate Zone is true.
        launchSocialReferralFromTalentSuite: function () {
            $("#submitGeneralReferral")[0].click();
        },

        DashBoardBack: function () {

            history.back();
        },

        DashBoardMenu: function (currentTab) {
            ngDialog.closeAll();
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.candidatezoneDashBoardView = currentTab;
            $scope.bAppsRemovalStatus = false;
            var DashboardRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                ConfiguredJobTitle: $scope.GetConfiguredJobTitle()

            };
            var Ajaxrequest = true;
            switch (currentTab) {
                case "SavedJobs":
                    if ($scope.DashboardPrevPage[0] != "SavedJobs")
                        $scope.DashboardPrevPage.unshift("SavedJobs");
                    if ($scope.savedJobsCache != null) {
                        $scope.bJobCart = true;
                        Ajaxrequest = false;
                        $scope.setTitle("JobCart");
                        $scope.alignCards("SavedJobsContainer", "jobCard");
                    }
                    DashboardRequest.Tab = 1;
                    break;
                case "Applications":
                    if ($scope.DashboardPrevPage[0] != "Applications")
                        $scope.DashboardPrevPage.unshift("Applications");
                    if (($scope.CandZoneUnFinishedApps != null) && ($scope.CandZoneAppliedApps != null)) {
                        Ajaxrequest = false;
                        $scope.setTitle("Applications");
                        $scope.CollapsedUnfinishedApplications = $scope.oHistory["Applications"].CollapsedUnfinishedApplications;
                        $scope.CollapsedAppliedApplications = $scope.oHistory["Applications"].CollapsedAppliedApplications;
                        setTimeout(function () {
                            $scope.CallCollapse("CollapsedUnfinishedApplications", "CollapsedAppliedApplications");
                            $scope.alignCards("ApplicationsContainer", "jobCard");
                        }, 100);
                    }
                    else {
                        $scope.CandZoneApplicationCount = null;
                        $scope.CandZoneUnFinishedAppsCount = null;
                        $scope.CandZoneAppliedAppsCount = null;
                        $("#applicationTab").addClass("ApplicationCounts");
                        $(".applicationsSection").addClass("ApplicationCounts");
                    }
                    DashboardRequest.Tab = 2;
                    break;
                case "SavedSearches":
                    if ($scope.DashboardPrevPage[0] != "SavedSearches")
                        $scope.DashboardPrevPage.unshift("SavedSearches");
                    if (($scope.SavedSearches != null)) {
                        Ajaxrequest = false;
                        $scope.setTitle("SavedSearches");
                        $scope.alignCards("SavedSearchesContainer", "jobCard");
                    }
                    DashboardRequest.Tab = 3;
                    break;
                default:
                    if ($scope.DashboardPrevPage[0] != "SavedJobs")
                        $scope.DashboardPrevPage.unshift("SavedJobs");
                    DashboardRequest.Tab = 1;
                    break;
            }
            if (Ajaxrequest) {
                $scope.bCanZoneJobsLoadingState = true;
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/DashboardData",
                    data: DashboardRequest,
                    success: function (data) {
                        $scope.bCanZoneJobsLoadingState = false;
                        if (DashboardRequest.Tab == 1) {
                            $scope.setTitle("JobCart");
                            $scope.renderJobCart(data.DashboardData.JobCartResponse, true);
                            if (!$scope.utils.isNewHash('SavedJobs', $scope))
                                $scope.utils.updateHistory('SavedJobs');
                            $scope.loadwebtrackerscript("/TGNewUI/SavedJobs", $scope.customScriptRendering.CandidateZone);
                        }
                        if (DashboardRequest.Tab == 2) {
                            $scope.setTitle("Applications");
                            $scope.EnableResponsiveApplicationDetails = data.DashboardData.Applications.EnableResponsiveApplicationDetails;
                            $scope.HRStatusCatDetails = data.DashboardData.Applications.HRStatusCatDetails;
                            $scope.CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                            $scope.CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                            $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;

                            $scope.CandZoneUnFinishedApps = data.DashboardData.Applications.UnfinishedJobs;
                            $scope.CandZoneAppliedApps = data.DashboardData.Applications.AppliedJobs;
                            $scope.CandZoneApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredJobs;
                            $scope.CandZoneSubmittedApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredSubmittedApplications;
                            $scope.attachFilesStatus = 0;


                            $("#applicationTab").removeClass("ApplicationCounts");
                            $(".applicationsSection").removeClass("ApplicationCounts");
                            if (!$scope.utils.isNewHash('Applications', $scope)) {
                                $scope.CollapsedUnfinishedApplications = $scope.oHistory["Applications"].CollapsedUnfinishedApplications;
                                $scope.CollapsedAppliedApplications = $scope.oHistory["Applications"].CollapsedAppliedApplications;
                                $scope.utils.updateHistory('Applications');
                            }
                            if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
                                $scope.oHistory["SavedJobs"].CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                                $scope.oHistory["SavedJobs"].CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                                $scope.oHistory["SavedJobs"].CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                            }
                            if (!$scope.utils.isNewHash('SavedSearches', $scope)) {
                                $scope.oHistory["SavedSearches"].CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                                $scope.oHistory["SavedSearches"].CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                                $scope.oHistory["SavedSearches"].CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                            }
                            setTimeout(function () {
                                $scope.CallCollapse("CollapsedUnfinishedApplications", "CollapsedAppliedApplications");
                                $scope.alignCards("ApplicationsContainer", "jobCard");
                            }, 100);
                            $scope.loadwebtrackerscript("/TGNewUI/Applications", $scope.customScriptRendering.CandidateZone);
                        }
                        else if (DashboardRequest.Tab == 3) {
                            $scope.setTitle("SavedSearches");
                            $scope.SavedSearches = data.DashboardData.SavedSearches;
                            if ($scope.SavedSearches != null) {
                                $scope.CandZoneSearchCount = $scope.SavedSearches.length;
                            }
                            $scope.SavedSearchesMetaData = {};
                            $scope.SavedSearchesMetaData.SavedSearches = [];
                            if ($scope.SavedSearches != null) {
                                $.each($scope.SavedSearches, function (i, obj) {
                                    $scope.SavedSearchesMetaData.SavedSearches.push({ 'Name': obj.SearchName, 'Value': obj.SavedSearchId });
                                });
                            }
                            $scope.$apply();
                            $scope.alignCards("SavedSearchesContainer", "jobCard");
                            if (!$scope.utils.isNewHash('SavedSearches', $scope))
                                $scope.utils.updateHistory('SavedSearches');
                            $scope.loadwebtrackerscript("/TGNewUI/SavedSearches", $scope.customScriptRendering.CandidateZone);
                        }
                        $scope.setHash();
                    },
                    error: function (xhr, textStatus, error) {
                        $scope.bCanZoneJobsLoadingState = false;
                    }
                });
            }
            else {
                $scope.setHash();
            }

        },

        renderDashBoard: function (response, currentTab, activeSection) {

            $scope.bLoggedIn = true;
            $scope.bSignInView = false;
            $scope.bSearchResults = false;
            $scope.bJobDetailsShown = false;
            $scope.bSidebarVisible = false;
            $scope.bSidebarShown = false;
            $scope.bSidebarOverlay = false;
            $scope.bPowerSearchVisible = false;
            $scope.bJobCart = false;
            $scope.bSelectedGroup = false;
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.bCreateAccount = false;
            $scope.bEditProfileEditMode = false;
            $scope.savedSearchActionCompletion = 0;
            $scope.searchResultsFromSavedSearch = null;

            ngDialog.closeAll();
            $scope.CandZoneSavedJobsCount = null;
            $scope.CandZoneUnFinishedAppsCount = null;
            $scope.CandZoneAppliedAppsCount = null;
            $scope.CandZoneApplicationCount = null;
            $scope.CandZoneSearchCount = null;
            $scope.CandZoneUnFinishedApps = null;
            $scope.CandZoneApplicationsExpiredJobs = null;
            $scope.CandZoneSubmittedApplicationsExpiredJobs = null;
            $scope.CandZoneAppliedApps = null;
            $scope.SavedSearches = null;
            $scope.bCanZoneJobsLoadingState = true;
            $scope.bLoadCandPortalForm = false;

            $scope.bAppsRemovalStatus = false;
            $scope.draftNotificationExpired = false;
            $scope.bjobInAGroupExpired = false;
            $scope.bresponsiveCandidateZone = true;
            $scope.ApplicationRemoved = false;
            $scope.WithdrawlFromSubmittedApplications = false;
            $scope.ReactivateFromSubmittedApplications = false;

            $scope.bCanZoneJobsLoadingState = false;
            $scope.CandZoneSavedJobsCount = response.Counts.SavedJobsCount;
            $scope.CandZoneUnFinishedAppsCount = response.Counts.UnFinishedAppsCount;
            $scope.CandZoneAppliedAppsCount = response.Counts.AppliedCount;
            $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount
            $scope.CandZoneSearchCount = response.Counts.SavedSearchesCount;
            $scope.DashboardPrevPage = ["Home"];

            if (currentTab == 1) {
                $scope.setTitle("JobCart");
                $scope.DashboardPrevPage.unshift("SavedJobs");
                $scope.candidatezoneDashBoardView = "SavedJobs";
                $scope.renderJobCart(response.DashboardData.JobCartResponse, true);
                if (!$scope.utils.isNewHash('SavedJobs', $scope))
                    $scope.utils.updateHistory('SavedJobs');
                $scope.loadwebtrackerscript("/TGNewUI/SavedJobs", $scope.customScriptRendering.CandidateZone);
            }
            else if (currentTab == 2) {
                $scope.setTitle("Applications");
                $scope.DashboardPrevPage.unshift("Applications");
                $scope.candidatezoneDashBoardView = "Applications";
                $scope.EnableResponsiveApplicationDetails = response.DashboardData.Applications.EnableResponsiveApplicationDetails;
                $scope.HRStatusCatDetails = response.DashboardData.Applications.HRStatusCatDetails;
                $scope.CandZoneUnFinishedApps = response.DashboardData.Applications.UnfinishedJobs;
                $scope.CandZoneAppliedApps = response.DashboardData.Applications.AppliedJobs;
                $scope.CandZoneApplicationsExpiredJobs = response.DashboardData.Applications.ExpiredJobs;
                $scope.CandZoneSubmittedApplicationsExpiredJobs = response.DashboardData.Applications.ExpiredSubmittedApplications;
                $scope.CallApply();
                if (!$scope.utils.isNewHash('Applications', $scope)) {
                    $scope.CollapsedUnfinishedApplications = $scope.oHistory["Applications"].CollapsedUnfinishedApplications;
                    $scope.CollapsedAppliedApplications = $scope.oHistory["Applications"].CollapsedAppliedApplications;
                }
                if (typeof activeSection != "undefined") {
                    if ($scope.enumForDashBoardActiveSection.FinishedApplications == activeSection) {
                        $scope.CollapsedAppliedApplications = true;
                    }
                    else if ($scope.enumForDashBoardActiveSection.UnfinishedApplications == activeSection) {
                        $scope.CollapsedUnfinishedApplications = true;
                    }
                }
                if (!$scope.utils.isNewHash('Applications', $scope)) {
                    $scope.utils.updateHistory('Applications');
                }
                setTimeout(function () {
                    $scope.CallCollapse("CollapsedUnfinishedApplications", "CollapsedAppliedApplications");
                    $scope.alignCards("ApplicationsContainer", "jobCard");
                }, 100);
                $scope.loadwebtrackerscript("/TGNewUI/Applications", $scope.customScriptRendering.CandidateZone);
            }
            else if (currentTab == 3) {
                $scope.setTitle("SavedSearches");
                $scope.DashboardPrevPage.unshift("SavedSearches");
                $scope.candidatezoneDashBoardView = "SavedSearches";
                $scope.SavedSearches = response.DashboardData.SavedSearches;
                if ($scope.SavedSearches != null) {
                    $scope.CandZoneSearchCount = $scope.SavedSearches.length;
                }
                $scope.SavedSearchesMetaData = {};
                $scope.SavedSearchesMetaData.SavedSearches = [];
                if ($scope.SavedSearches != null) {
                    $.each($scope.SavedSearches, function (i, obj) {
                        $scope.SavedSearchesMetaData.SavedSearches.push({ 'Name': obj.SearchName, 'Value': obj.SavedSearchId });
                    });
                }

                $scope.alignCards("SavedSearchesContainer", "jobCard");
                if (!$scope.utils.isNewHash('SavedSearches', $scope))
                    $scope.utils.updateHistory('SavedSearches');
                $scope.loadwebtrackerscript("/TGNewUI/SavedSearches", $scope.customScriptRendering.CandidateZone);
            }
            setTimeout(function () {
                $scope.$apply();
            }, 0);
            $scope.setHash();
        },

        ViewDashBoardData: function (currentTab, activeSection) {

            $scope.bLoggedIn = true;
            $scope.bSignInView = false;
            $scope.bSearchResults = false;
            $scope.bJobDetailsShown = false;
            $scope.bSidebarVisible = false;
            $scope.bSidebarShown = false;
            $scope.bSidebarOverlay = false;
            $scope.bPowerSearchVisible = false;
            $scope.bJobCart = false;
            $scope.bSelectedGroup = false;
            $scope.bProcessingWithDrawReactivate = false;
            $scope.ApplicationRemoved = false;
            $scope.WithdrawlFromSubmittedApplications = false;
            $scope.ReactivateFromSubmittedApplications = false;


            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.bCreateAccount = false;
            $scope.bEditProfileEditMode = false;
            $scope.savedSearchActionCompletion = 0;
            $scope.searchResultsFromSavedSearch = null;
            $scope.candidatezoneSubView = "dashBoard";

            ngDialog.closeAll();
            if ($scope.DashboardPrevPage == undefined || ($scope.DashboardPrevPage[0] != "JobDetails" && $scope.DashboardPrevPage[0] != "SearchResults"))
                $scope.DashboardPrevPage = ["Home"];

            $scope.CandZoneSavedJobsCount = null;
            $scope.CandZoneUnFinishedAppsCount = null;
            $scope.CandZoneAppliedAppsCount = null;
            $scope.CandZoneApplicationCount = null;
            $scope.CandZoneSearchCount = null;
            $scope.CandZoneUnFinishedApps = null;
            $scope.CandZoneApplicationsExpiredJobs = null;
            $scope.CandZoneSubmittedApplicationsExpiredJobs = null;
            $scope.CandZoneAppliedApps = null;
            $scope.SavedSearches = null;
            $scope.savedJobsCache = null;
            $scope.bCanZoneJobsLoadingState = true;
            $scope.candidatezoneDashBoardView = currentTab;
            $scope.bAppsRemovalStatus = false;

            var DashboardRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                IsSearchAgentEnabled: $scope.bSearchAgentEnabled,
                ConfiguredJobTitle: $scope.GetConfiguredJobTitle()
            };
            switch (currentTab) {
                case "SavedJobs":
                    $scope.DashboardPrevPage.unshift("SavedJobs");
                    DashboardRequest.Tab = 1;
                    break;
                case "Applications":
                    $scope.DashboardPrevPage.unshift("Applications");
                    DashboardRequest.Tab = 2;
                    break;
                case "SavedSearches":
                    $scope.DashboardPrevPage.unshift("SavedSearches");
                    DashboardRequest.Tab = 3;
                    break;
                default:
                    $scope.DashboardPrevPage.unshift("SavedJobs");
                    DashboardRequest.Tab = 1;
                    break;
            }
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/Dashboard",
                data: DashboardRequest,
                success: function (data) {
                    $scope.bCanZoneJobsLoadingState = false;
                    $scope.bLoadCandPortalForm = false;
                    $scope.CandZoneSavedJobsCount = data.Counts.SavedJobsCount;
                    $scope.CandZoneUnFinishedAppsCount = data.Counts.UnFinishedAppsCount;
                    $scope.CandZoneAppliedAppsCount = data.Counts.AppliedCount;
                    $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                    $scope.CandZoneSearchCount = data.Counts.SavedSearchesCount;
                    $scope.ProfileDetails = data.BasicProfileDetails;
                    $scope.noSwitchSiteWarning = data.NoSiteChagneWarning;

                    if (DashboardRequest.Tab == 1) {
                        $scope.setTitle("JobCart");
                        $scope.renderJobCart(data.DashboardData.JobCartResponse, true);
                        if (!$scope.utils.isNewHash('SavedJobs', $scope))
                            $scope.utils.updateHistory('SavedJobs');
                        $scope.loadwebtrackerscript("/TGNewUI/SavedJobs", $scope.customScriptRendering.CandidateZone);
                    }
                    else if (DashboardRequest.Tab == 2) {
                        $scope.setTitle("Applications");
                        $scope.EnableResponsiveApplicationDetails = data.DashboardData.Applications.EnableResponsiveApplicationDetails;
                        $scope.HRStatusCatDetails = data.DashboardData.Applications.HRStatusCatDetails;
                        $scope.CandZoneUnFinishedApps = data.DashboardData.Applications.UnfinishedJobs;
                        $scope.CandZoneAppliedApps = data.DashboardData.Applications.AppliedJobs;
                        $scope.CandZoneApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredJobs;
                        $scope.CandZoneSubmittedApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredSubmittedApplications;
                        $scope.CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                        $scope.CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                        $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                        $scope.CallApply();
                        if (!$scope.utils.isNewHash('Applications', $scope)) {
                            $scope.CollapsedUnfinishedApplications = $scope.oHistory["Applications"].CollapsedUnfinishedApplications;
                            $scope.CollapsedAppliedApplications = $scope.oHistory["Applications"].CollapsedAppliedApplications;

                        }
                        if (typeof activeSection != "undefined") {
                            if ($scope.enumForDashBoardActiveSection.FinishedApplications == activeSection) {
                                $scope.CollapsedAppliedApplications = true;
                                if (($("#pageType").val().toLowerCase() == "portal" && $.queryParams().reqId != '') || sessionStorage.getItem('pageType') == "portal") {
                                    var cpApp = $.grep($scope.CandZoneAppliedApps, function (e) {
                                        if ($("#pageType").val().toLowerCase() == "portal")
                                            return e.ReqId == $.queryParams().reqId;
                                        else
                                            return e.ReqId == sessionStorage.getItem('portalReqId');
                                    });
                                    sessionStorage.setItem('portalReqId', "");
                                    sessionStorage.setItem('pageType', "");
                                    if (cpApp.length > 0) {
                                        var jobQuestions = cpApp[0].Questions;
                                        for (var i = 0, len = jobQuestions.length; i < len; i++) {
                                            if (jobQuestions[i].QuestionName == $scope.jobFieldsToDisplay.JobTitle.toLowerCase()) {
                                                jobQuestions[i].ClassName = "jobtitle";
                                                break;
                                            }
                                        }
                                        $scope.showApplicationDetail(cpApp[0]);
                                    }
                                }
                                $("#pageType").val("");
                            }
                            else if ($scope.enumForDashBoardActiveSection.UnfinishedApplications == activeSection) {
                                $scope.CollapsedUnfinishedApplications = true;
                            }
                            $scope.utils.updateHistory('Applications');
                        }

                        setTimeout(function () {
                            $scope.CallCollapse("CollapsedUnfinishedApplications", "CollapsedAppliedApplications");
                            $scope.alignCards("ApplicationsContainer", "jobCard");
                        }, 100);
                        $scope.loadwebtrackerscript("/TGNewUI/Applications", $scope.customScriptRendering.CandidateZone);
                    }
                    else if (DashboardRequest.Tab == 3) {
                        $scope.setTitle("SavedSearches");
                        $scope.SavedSearches = data.DashboardData.SavedSearches;
                        if ($scope.SavedSearches != null) {
                            $scope.CandZoneSearchCount = $scope.SavedSearches.length;
                        }
                        $scope.SavedSearchesMetaData = {};
                        $scope.SavedSearchesMetaData.SavedSearches = [];
                        if ($scope.SavedSearches != null) {
                            $.each($scope.SavedSearches, function (i, obj) {
                                $scope.SavedSearchesMetaData.SavedSearches.push({ 'Name': obj.SearchName, 'Value': obj.SavedSearchId });
                            });
                        }

                        $scope.alignCards("SavedSearchesContainer", "jobCard");
                        if (!$scope.utils.isNewHash('SavedSearches', $scope))
                            $scope.utils.updateHistory('SavedSearches');
                        $scope.loadwebtrackerscript("/TGNewUI/SavedSearches", $scope.customScriptRendering.CandidateZone);
                    }
                    $scope.setHash();
                },
                error: function (xhr, textStatus, error) {
                    $scope.bCanZoneJobsLoadingState = false;
                }
            });

        },

        unfinishedApplicationsDupCheckAjax: function (ApplyData) {
            $scope.CandZoneApplyData = ApplyData;
            var DuplicateCheckRequestForMultipleJobs = {
                clientId: $("#partnerId").val(),
                siteId: $scope.CandZoneApplyData.SiteId,
                jobAndSiteIds: $scope.CandZoneApplyData.SavedDraftInfo.JobSiteId,
                sid: $("#CookieValue").val(),
                jobInfo: $scope.CandZoneApplyData.SavedDraftInfo.JobInfo
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/CheckDuplicateSubmissionForMultipleJobs",
                data: DuplicateCheckRequestForMultipleJobs,
                success: function (data) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.MultipleJobStatus = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })) : "";
                    $scope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    $scope.AllJobsApplied = $scope.NoofJobsApplied == $scope.CandZoneApplyData.SavedDraftInfo.ReqCount ? true : false;
                    if ($scope.ApplyDifference <= 0) {
                        $scope.NoOfJobsExceededMaxLimit = (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions)) > 0 ? ($scope.CandZoneApplyData.SavedDraftInfo.ReqCount - (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions))) : 0;
                    }
                    $scope.dialogCalledfrom = 'UnfinishedJobs';
                    $scope.CandZoneDupcheck = $scope;
                    $scope.CandZoneApplyData.SavedDraftInfo.ReqID = data.ReqsThatCanBeApplied;
                    if ($scope.NoofJobsApplied > 0 || $scope.ApplyDifference <= 0) {
                        $('body').addClass('noScroll');
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $('body').removeClass('noScroll');
                                $.restoreFocus();
                            },
                            template: 'MultipleApplyValidations', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                        });
                    }
                    else
                        $scope.unfinishedJobsApplyRemove($scope.CandZoneApplyData, 'Apply');
                }
            });
        },

        removeDupUnfinsihedJobs: function () {
            ngDialog.closeAll();
            $scope.CandZoneDupcheck.NoOfJobsExceededMaxLimit = $scope.CandZoneDupcheck.NoOfJobsExceededMaxLimit - $scope.CandZoneDupcheck.NoofJobsApplied;
            $scope.CandZoneDupcheck.NoofJobsApplied = 0;
            ngDialog.closeAll();
            if ($scope.CandZoneDupcheck.NoofJobsApplied > 0 || $scope.CandZoneDupcheck.ApplyDifference <= 0) {
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'MultipleApplyValidations', scope: $scope.CandZoneDupcheck, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                });
            }
            else {
                $scope.unfinishedJobsApplyRemove($scope.CandZoneApplyData, 'Apply');
            }
        },

        unfinishedJobsApply: function () {
            ngDialog.closeAll();
            $scope.unfinishedJobsApplyRemove($scope.CandZoneApplyData, 'Apply');
        },

        unfinishedJobsApplyRemove: function (ApplyData, ajaxMethod) {
            ngDialog.closeAll();
            if (ajaxMethod == "UnfinishedjobsDupcheck") {
                $scope.unfinishedApplicationsDupCheckAjax(ApplyData);
            }
            else if (ajaxMethod == "Apply") {
                if ($.queryParams().applyTest || ApplyData.IsResponsiveGQ) {
                    if (ApplyData.SiteId != $("#siteId").val()) {
                        //SwitchSite
                        var switchSiteRequest = {};
                        switchSiteRequest.PartnerId = $("#partnerId").val();
                        switchSiteRequest.SwitchToSiteId = ApplyData.SiteId;
                        switchSiteRequest.FromSiteId = $("#siteId").val();
                        switchSiteRequest.CookieValue = $("#CookieValue").val();
                        $.ajax({
                            success: function (data, status, jqxhr) {
                                if (data.Success == true) {
                                    window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + ApplyData.SiteId + "&TQId=" + ApplyData.TQID + "&bruid=" + encodeURIComponent($scope.encryptedBruid) + "&GQSessionId=" + ApplyData.GQSessionID + "&reqid=" + ApplyData.SavedDraftInfo.ReqID + "&AIPID=" + ApplyData.AIPID + "&PageId=" + ApplyData.SavedDraftInfo.PageId + "&calledFrom=CandidateZone";
                                }
                            },
                            error: function (jqxhr, status, error) {
                            },
                            url: '/TgNewUI/Search/Ajax/SwitchSite',
                            data: switchSiteRequest,
                            type: 'POST'
                        });
                    }
                    else {
                        var rft = $("[name='__RequestVerificationToken']").val();
                        $.ajax({
                            method: "GET",
                            url: "/gqweb/apply?BRUID=" + encodeURIComponent($scope.encryptedBruid) + "&TQId=" + ApplyData.TQID + "&GQSessionId=" + ApplyData.GQSessionID + "&reqid=" + ApplyData.SavedDraftInfo.ReqID + "&partnerid=" + $("#partnerId").val() + "&PageId=" + ApplyData.SavedDraftInfo.PageId + "&AIPID=" + ApplyData.AIPID + "&siteid=" + ApplyData.SiteId + "&CalledfromSavedDrafts=" + true + "&wbmode=false&loadingViaAjax=true&RFT=" + rft,
                            success: function (result) {
                                $scope.bGQLaunchedFromunfinishedApplications = true;

                                $scope.$root.applyResponse = result;
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                setTimeout(function () {
                                    $scope.$apply();
                                }, 0);
                            }
                        });
                    }
                }
                else {

                    postValues = {
                        JobInfo: (ApplyData.SavedDraftInfo.JobInfo != null && ApplyData.SavedDraftInfo.JobInfo != "") ? ApplyData.SavedDraftInfo.JobInfo : "%%" + ApplyData.SavedDraftInfo.ReqID + "|" + appScope.tgSettings.DefLanguageId + "|" + ((ApplyData.TQID == null || ApplyData.TQID == "") ? ApplyData.SavedDraftInfo.TQID : ApplyData.TQID) + "%%",
                        ResumeId: ApplyData.ResumeId,
                        CoverLetterId: ApplyData.CoverLetterId,
                        Attachments: ApplyData.Attachments,
                        Type: ApplyData.Type,
                        AIPId: ApplyData.AIPID,
                        Site: ApplyData.SiteId,
                        GQID: (ApplyData.TQID == null || ApplyData.TQID == "") ? ApplyData.SavedDraftInfo.TQID : ApplyData.TQID,
                        drafttype: ApplyData.Type,
                        ResumeDraft: ApplyData.SavedDraftInfo.PageId + '|' + ApplyData.SavedDraftInfo.SectionId + '|' + ApplyData.ResumeId,
                        AllInactive: "",
                        Inactive: "",
                        GQTitle: ApplyData.Title,
                        ApplyCount: ApplyData.SavedDraftInfo.ReqCount,
                        hdRft: $("#rfToken").val(),
                        FromResponsive: true
                    };

                    ////Contruct the redirect url
                    var redirecturl = "../../../TGwebhost/";
                    var RedirectPath = "";

                    var target = "";

                    if (ApplyData.Type != '6' && ApplyData.Type != '7' && ApplyData.Type != '8') {
                        if ($scope.isGTG) {
                            //LDP:118 Added this AND condition to skip this validation in case of additional sites
                            if ($("#siteId").val() != ApplyData.SiteId) {
                                RedirectPath = "Yes";
                            }
                        }
                        if (ApplyData.ResumeId == -1 || ApplyData.CoverLetterId == -1) {

                            if (RedirectPath != "")
                                redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=SR";
                            else
                                redirecturl = redirecturl + "selectresume.aspx?SID=" + $("#SIDValue").val();
                        }
                        else if (ApplyData.Attachments.indexOf("UpdatedFlag") > -1) {
                            if (RedirectPath != "")
                                redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=SR";
                            else
                                redirecturl = redirecturl + "attachments.aspx?SID=" + $("#SIDValue").val();
                        }
                        else {
                            if (ApplyData.Type == 0 || ApplyData.Type == 2) // JobApply or SubmitNow flow - Questions page
                            {
                                if (RedirectPath != "")
                                    redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=AQ";
                                else
                                    redirecturl = redirecturl + "answerquestions.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            }
                            else if (ApplyData.Type == 9)
                                redirecturl = redirecturl + "selectresume.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            else if (ApplyData.Type == 10)
                                redirecturl = redirecturl + "profileprovider.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            else if (ApplyData.Type == 11)
                                redirecturl = redirecturl + "profiledetail.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            else //nType = 1 or 3 - JobApply or SubmitNow flow - AttachForm page
                            {
                                if (RedirectPath != "")
                                    redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=AF";
                                else
                                    redirecturl = redirecturl + "attachform.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            }
                        }
                    }
                    else {
                        var subWindow;
                        var w;
                        var h;

                        if (document.all) {
                            w = screen.availWidth;
                            h = screen.availHeight;
                        }
                        else if (document.layers) {
                            w = window.innerWidth;
                            h = window.innerHeight;
                        }
                        var popW = 750, popH = 550;
                        var topPos = (h - popH) / 2, leftPos = (w - popW) / 2;

                        //LDP118: Candidate API changes
                        if ($("#siteId").val() != ApplyData.SiteId) {
                            RedirectPath = "Yes";
                        }
                        if (RedirectPath != "") {
                            redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=AIP&idx=" + nIndex;
                            window.document.frmAIP.target = "_self";
                        }
                        if (ApplyData.Type != '8') {

                            subWindow = window.open("", "gqapply", 'height=' + popH + ',width=' + popW + ',screenY=' + topPos + ',screenX=' + leftPos + ',top=' + topPos + ',left=' + leftPos + ',menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                            target = "gqapply";
                            redirecturl = "../../../" + ApplyData.LocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val();
                            subWindow.focus();
                        }
                        else {
                            if (ApplyData.TQID != '0') {

                                subWindow = window.open("", "gqapply", 'height=' + popH + ',width=' + popW + ',screenY=' + topPos + ',screenX=' + leftPos + ',top=' + topPos + ',left=' + leftPos + ',menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                                target = "gqapply";
                                redirecturl = "../../../" + ApplyData.LocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val();
                                subWindow.focus();

                            }
                            else {
                                redirecturl = redirecturl + "deleteaips.aspx?SID=" + $("#SIDValue").val() + "&AIPID=" + ApplyData.AIPID + "&allinactive=trad&ji=" + ReplaceInString(ApplyData.SavedDraftInfo.JobInfo, "%", "__PERCENT__");
                            }
                        }
                    }
                    //Submit the form
                    $.form(url = redirecturl, data = postValues, method = 'POST', target = target, id = "frmClassicRedirect").submit();

                }
            }
            else if (ajaxMethod == "Remove") {
                //removeApplication
                var RemoveUnfinishedJobRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SessionID: $("#CookieValue").val(),
                    AIPID: ApplyData.AIPID

                };
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/RemoveUnfinishedJob",
                    data: RemoveUnfinishedJobRequest,
                    success: function (data) {
                        if (data.Success) {
                            _.remove($scope.CandZoneUnFinishedApps, function (currentObject) {
                                return currentObject.AIPID === ApplyData.AIPID;
                            });
                            $scope.CandZoneUnFinishedAppsCount = $scope.CandZoneUnFinishedAppsCount - 1;
                            $scope.CandZoneApplicationCount = $scope.CandZoneApplicationCount - 1;
                            $scope.bAppsRemovalStatus = true;
                            //$scope.CandZoneUnFinishedApps = _.remove($scope.CandZoneUnFinishedApps, { AIPID: ApplyData.AIPID });
                            setTimeout(function () {
                                $scope.$apply();
                                if ($scope.CandZoneUnFinishedApps.length == 0)
                                    $(".EmptyCollapsedUnfinishedApplications").css("display", "inline-block");
                            }, 0);
                        }
                    }
                });
            }
        },

        withdrawlConfirmation: function (AppliedAppData) {
            ngDialog.closeAll();
            if ($scope.candidatezoneSubView == 'applicationDetail') {
                $scope.WithdrawlFromApplicationDetail = false;
                $scope.ReactivateFromApplicationDetail = false;
            }
            else {
                $scope.WithdrawlFromSubmittedApplications = false;
                $scope.ReactivateFromSubmittedApplications = false;
            }

            if (AppliedAppData.FileAction == '0') {
                setTimeout(function () {
                    ngDialog.open({
                        preCloseCallback: function (value) {
                        },
                        template: 'WithdrawlConfirmationDialog', scope: $scope, className: 'ngdialog-theme-default customDialogue WithdrawlConfirmationContainer', showClose: true, closeByDocument: false, ariaRole: "dialog", appendTo: "#dialogContainer",
                        data: { AppliedAppData: AppliedAppData }
                    });
                }, 0);
            }
            else {
                $scope.withDrawApplyFinishedApplication(AppliedAppData);
            }
        },

        withDrawApplyFinishedApplication: function (AppliedAppData) {
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            if (!$scope.bProcessingWithDrawReactivate) {
                $scope.bProcessingWithDrawReactivate = true;
                var DashboardRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SessionID: $("#CookieValue").val(),
                    Reqid: AppliedAppData.ReqId,
                    FileAction: AppliedAppData.FileAction,
                    JobRequisitionID: AppliedAppData.JobRequisitionId,
                };
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/WithdrawReactivate",
                    data: DashboardRequest,
                    success: function (data) {
                        ngDialog.closeAll();
                        $scope.bProcessingWithDrawReactivate = false;
                        if (data.FetchingSubmittedApplicationsFromExpress) {
                            if (data.Type == 1) { //Success
                                if ($scope.EnableResponsiveApplicationDetails) {
                                    //If req is Closed/Cancelled/Deleted
                                    if (AppliedAppData.ReqStatus == 3 || AppliedAppData.ReqStatus == 4 || AppliedAppData.ReqStatus == 7) {
                                        AppliedAppData.Status = _.where(appScope.HRStatusCatDetails, { "HRStatusCatID": 6 })[0].HRStatusCatLabel;
                                        AppliedAppData.LastUpdated = AppliedAppData.ReqStatusDate;
                                    }
                                    else {
                                        AppliedAppData.Status = _.where(appScope.HRStatusCatDetails, { "HRStatusCatID": data.CurrentCategoryId })[0].HRStatusCatLabel;
                                        if (data.CurrentIntialCategoryDate == '' || data.CurrentIntialCategoryDate == null) { //if its a 0 -filed status, hrfolderid can be null.
                                            AppliedAppData.LastUpdated = AppliedAppData.JobSubmissionDate;
                                        }
                                        else {
                                            AppliedAppData.LastUpdated = data.CurrentIntialCategoryDate;
                                        }
                                    }
                                    if (data.CurrentCategoryId == 6 || data.CurrentCategoryId == 7) {
                                        //Hiding the Remove Link for now, this will be enhanched in coming builds.
                                        AppliedAppData.ShowRemoveLink = false;
                                    }
                                    else {
                                        AppliedAppData.ShowRemoveLink = false;
                                    }
                                }
                                else {
                                    AppliedAppData.Status = data.CurrentHRStatusLabel;
                                    AppliedAppData.LastUpdated = data.CurrentHRStatusDate;
                                }

                                if (AppliedAppData.FileAction == 0) { //If Withdraw is success
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        $scope.WithdrawlFromApplicationDetail = true;
                                    }
                                    else {
                                        $scope.WithdrawlFromSubmittedApplications = true;
                                    }
                                    AppliedAppData.FileAction = 2;
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        $scope.contructAppDetailActions(AppliedAppData);
                                    }
                                }
                                else if (AppliedAppData.FileAction == 2) { //If Reactivate is success
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        $scope.ReactivateFromApplicationDetail = true;
                                    }
                                    else {
                                        $scope.ReactivateFromSubmittedApplications = true;
                                    }
                                    AppliedAppData.FileAction = 0;
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        var index = $scope.ApplicationDetailActions.indexOf($scope.dynamicStrings.Lbl_ReactivateApplication);
                                        $scope.ApplicationDetailActions.splice(index, 1);
                                        $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_WithdrawApplication);
                                        _.each($("#ApplicationDetailAction-menu li"), function (innerItem) {
                                            if (innerItem.innerText == $scope.dynamicStrings.Lbl_ReactivateApplication)
                                                innerItem.innerText = $scope.dynamicStrings.Lbl_WithdrawApplication;
                                        });
                                    }

                                }
                                if ($scope.candidatezoneSubView == 'applicationDetail' && !$scope.previewOfSubmittedApplication) {
                                    $scope.showApplicationDetail(AppliedAppData, true);
                                }
                            }
                            else if (data.Type == 2 && AppliedAppData.FileAction == 2) { //Cannot Reactivate -- FileAction99
                                AppliedAppData.ShowFileAction99 = true;
                            }
                        }
                        else if (data.Type == 1) {
                            _.each($scope.CandZoneAppliedApps, function (innerItem) {
                                if (innerItem.ReqId == AppliedAppData.ReqId)
                                    innerItem.FileAction = '1';
                            });
                        }
                        setTimeout(function () {
                            $scope.$apply();
                            $scope.adjustHeaderStickers();
                        }, 0);
                    }
                }).error(function (data, status, headers, config) {
                    $scope.bProcessingWithDrawReactivate = false;
                });
            }
        },

        reApplyFromFinsihedApplications: function (job) {
            var type = "";
            var jobId, gqId, jobInfo, partnerId, siteId, langId, jobSiteInfo, postValues, isGQResponsive, localeId, encryptedBruid, sid, origSiteId;
            var switchSite = false;
            var Questions = job.Questions;
            jobId = job.ReqId;
            gqId = job.TQID;
            langId = job.JobReqLang;
            partnerId = $("#partnerId").val();
            origSiteId = $("#siteId").val();
            siteId = job.AppliedSiteid;
            if (siteId == 0) {
                siteId = job.JobSiteId;
            }

            sid = $("#SIDValue").val();
            //scope.siteId = siteId;
            isGQResponsive = job.IsResponsiveGQ;
            localeId = job.LocaleId;
            encryptedBruid = $scope.encryptedBruid;
            jobInfo = "%%" + jobId + "|" + langId + "|" + gqId + "%%";
            $scope.jobSiteInfo = jobId + "_" + siteId;
            var groupGQId = gqId;
            if (isGQResponsive) {
                if (siteId != origSiteId) {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&calledFrom=JobDetails";
                }
                else {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&loadingViaAjax=true";
                }
                //if ($scope.ApplyDifference > 0) {
                //if (angular.isDefined(scope.oActiveLaddaButton))
                //    scope.oActiveLaddaButton.start();
                if (siteId != origSiteId) {
                    var switchSiteRequest = {};
                    switchSiteRequest.PartnerId = partnerId;
                    switchSiteRequest.SwitchToSiteId = siteId;
                    switchSiteRequest.FromSiteId = origSiteId;
                    switchSiteRequest.CookieValue = $("#CookieValue").val();
                    $.ajax({
                        success: function (data, status, jqxhr) {
                            if (data.Success == true) {
                                var bruid = encryptedBruid != "" ? encryptedBruid : $.queryParams().bruid;
                                window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(bruid) + "&reqid=" + jobId + "&calledFrom=JobDetails";
                            }
                        },
                        error: function (jqxhr, status, error) {
                        },
                        url: '/TgNewUI/Search/Ajax/SwitchSite',
                        data: switchSiteRequest,
                        type: 'POST'
                    });
                }
                else {
                    var rft = $("[name='__RequestVerificationToken']").val();
                    $http.get(
                        "/gqweb/apply?bruid=" + encodeURIComponent(encryptedBruid) + "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&sid=" + sid + "&loadingViaAjax=true&RFT=" + rft

                    ).success(function (result) {
                        //if (angular.isDefined(scope.oActiveLaddaButton))
                        //    scope.oActiveLaddaButton.stop();
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                        $scope.$root.applyResponse = result;
                    });
                }
                //}
            } else {
                type = "search_jobdetail";
                if (gqId == "0") {
                    postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: siteId, hdRft: $("#rfToken").val() };
                    redirectPage = "apply.aspx";
                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                }
                else {
                    if ($scope.tgSettings.Mobileoptimised == "true") {
                        postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: siteId, GQLoginURL: "../" + localeId + "/asp/tg/GQLogin.asp?SID=GQSESSION&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url

                        redirectPage = "apply.aspx";
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                    }
                    else {
                        if (siteId != origSiteId) {
                            $scope.switchSite(siteId, "fromApply");
                            switchSite = true;
                        }
                        window.open("../../../" + localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&language=" + langId + "&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                        if (switchSite) {
                            window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&jobid=" + jobId + "&PageType=jobdetails";
                        }

                    }
                }
            }
        },

        removeFromFinishedApplications: function (job) {
            var RequestToRemoveFinishedApplication = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                LangId: job.JobReqLang,
                ReqId: job.ReqId
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RemoveFinishedApplication",
                data: RequestToRemoveFinishedApplication,
                success: function (data) {
                    $scope.CloseDialogs();
                    if (data.Success) {
                        $scope.ApplicationRemoved = true;
                        _.remove($scope.CandZoneAppliedApps, function (currentObject) {
                            return currentObject.ReqId === job.ReqId;
                        });
                        $scope.CandZoneAppliedAppsCount = $scope.CandZoneAppliedAppsCount - 1;
                        $scope.CandZoneApplicationCount = $scope.CandZoneApplicationCount - 1;
                        setTimeout(function () {
                            $scope.$apply();
                            $scope.adjustHeaderStickers();
                            if (!$scope.utils.isNewHash('Applications', $scope))
                                $scope.utils.updateHistory('Applications');
                            if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
                                $scope.oHistory["SavedJobs"].CandZoneAppliedAppsCount = $scope.CandZoneAppliedAppsCount;
                                $scope.oHistory["SavedJobs"].CandZoneApplicationCount = $scope.CandZoneApplicationCount;
                            }
                            if (!$scope.utils.isNewHash('SavedSearches', $scope)) {
                                $scope.oHistory["SavedSearches"].CandZoneAppliedAppsCount = $scope.CandZoneAppliedAppsCount;
                                $scope.oHistory["SavedSearches"].CandZoneApplicationCount = $scope.CandZoneApplicationCount;
                            }
                        }, 0);
                    }
                },
                error: function () {
                    $scope.ApplicationRemoved = true;
                    _.remove($scope.CandZoneAppliedApps, function (currentObject) {
                        return currentObject.ReqId === job.ReqId;
                    });
                }

            });
        },

        runSavedSearch: function (savedSearch) {
            $scope.bCanZoneJobsLoadingState = true;
            $scope.bSearchSaved = false;

            var origSiteId = $("#siteId").val();
            if (origSiteId != savedSearch.SiteId) {
                if (!$scope.noSwitchSiteWarning) {
                    ngDialog.openConfirm({
                        template: 'SwitchSiteWarningTemplate', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                    }).then(function (value) {
                        if (value) {
                            //update this selection on candidate profile
                            var updateWarningRequest = {};
                            updateWarningRequest.partnerId = $("#partnerId").val();
                            updateWarningRequest.siteId = $("#siteId").val();
                            updateWarningRequest.sessionID = $("#CookieValue").val(),
                            $.ajax({
                                success: function (data, status, jqxhr) {
                                    $scope.noSwitchSiteWarning = true;
                                },
                                error: function (jqxhr, status, error) {
                                },
                                url: '/TgNewUI/CandidateZone/Ajax/DisableSiteSiwtchWarning',
                                data: updateWarningRequest,
                                type: 'POST'
                            });
                        }
                        var switchSiteRequest = {};
                        switchSiteRequest.PartnerId = $("#partnerId").val();
                        switchSiteRequest.SwitchToSiteId = savedSearch.SiteId;
                        switchSiteRequest.FromSiteId = origSiteId;
                        switchSiteRequest.CookieValue = $("#CookieValue").val();
                        $.ajax({
                            success: function (data, status, jqxhr) {
                                if (data.Success == true) {
                                    sessionStorage.setItem("savedSearch", JSON.stringify(savedSearch));
                                    window.location = "/TgNewUI/Search/Home/Home?partnerid=" + $("#partnerId").val() + "&siteid=" + savedSearch.SiteId;
                                }
                            },
                            error: function (jqxhr, status, error) {
                            },
                            url: '/TgNewUI/Search/Ajax/SwitchSite',
                            data: switchSiteRequest,
                            type: 'POST'
                        });
                    }, function (value) {
                        if (angular.isDefined($scope.oActiveLaddaButton))
                            $scope.oActiveLaddaButton.stop();
                    });
                } else {
                    var switchSiteRequest = {};
                    switchSiteRequest.PartnerId = $("#partnerId").val();
                    switchSiteRequest.SwitchToSiteId = savedSearch.SiteId;
                    switchSiteRequest.FromSiteId = origSiteId;
                    switchSiteRequest.CookieValue = $("#CookieValue").val();
                    $.ajax({
                        success: function (data, status, jqxhr) {
                            if (data.Success == true) {
                                sessionStorage.setItem("savedSearch", JSON.stringify(savedSearch));
                                window.location = "/TgNewUI/Search/Home/Home?partnerid=" + $("#partnerId").val() + "&siteid=" + savedSearch.SiteId;
                            }
                        },
                        error: function (jqxhr, status, error) {
                        },
                        url: '/TgNewUI/Search/Ajax/SwitchSite',
                        data: switchSiteRequest,
                        type: 'POST'
                    });
                }
                return;
            }

            var RunSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: savedSearch.SiteId,
                EncryptedSessionValue: $("#CookieValue").val(),
                SavedSearchId: savedSearch.SavedSearchId,
                KeywordCustomSolrFields: $scope.keywordFields,
                LocationCustomSolrFields: $scope.locationFields
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RunSavedSearch",
                data: RunSavedSearchRequest,
                success: function (data) {
                    $scope.searchResultsFromSavedSearch = savedSearch;
                    $scope.bCandidateZone = false;
                    $scope.sortby = data.SelectedSortType;
                    if ($scope.sortby == "" || $scope.sortby == null) {
                        $scope.sortby = 0;
                    }
                    if (data.SearchResultsResponse.Jobs) {
                        $scope.jobs = data.SearchResultsResponse.Jobs.Job;
                    }
                    else {
                        $("#searchResults").val('');
                        $scope.jobs = null;
                    }
                    $scope.latitude = $scope.SaveSearchCriteria.Latitude = data.SearchResultsResponse.Latitude;
                    $scope.longitude = $scope.SaveSearchCriteria.Longitude = data.SearchResultsResponse.Longitude;
                    $scope.powerSearchQuestions = data.PowerSearchQuestions.Questions;

                    $scope.TranslatePowerSearchQuestions($scope.powerSearchQuestions);
                    if ($scope.powerSearchQuestions != "") {
                        _.forEach(that.powerSearchQuestions, function (aQuestion) {
                            $.htmlEncodeSpecial(aQuestion);
                            if (aQuestion.QuestionType == "date") {
                                aQuestion.rangeValid = 1;
                            }
                            if (aQuestion.QId == "0") {
                                aQuestion.Options.unshift(
                               {
                                   OptionName: $scope.dynamicStrings.Option_All,
                                   OptionValue: "11111111",
                                   Selected: data.AllLanguagesSelected,
                                   Count: 0
                               });
                            }
                            if (aQuestion.SelectedOptionsFromSavedSearch != null) {
                                var aData = $.map(aQuestion.SelectedOptionsFromSavedSearch, function (val, id) {
                                    return {
                                        data: id,
                                        label: val,
                                        value: val
                                    };
                                });
                                aQuestion.selectedOptions = aData;
                            }
                        });
                    }

                    if (data.SearchResultsResponse.Facets)
                        $scope.facets = data.SearchResultsResponse.Facets.Facet;
                    else
                        $scope.facets = null;
                    $scope.updateAriaLabelForFacetDescription($scope.facets);
                    if ($scope.facets != null) {
                        _.each($scope.facets, function (facet) {
                            facet.SelectedCount = _.filter(facet.Options, { Selected: true }).length;
                        });
                    }
                    $scope.bInitialLoad = false;
                    $scope.bSidebarShown = true;
                    $scope.bSidebarVisible = true;
                    $scope.bSearchResults = true;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                    $scope.pageNumber = 1;
                    $scope.keyWordSearch.text = data.Keyword;
                    $scope.locationSearch.text = data.Location;
                    var searchCriteria = "";
                    if ($scope.keyWordSearch.text != "") {
                        searchCriteria = $scope.keyWordSearch.text
                    }
                    if ($scope.locationSearch.text != "") {
                        searchCriteria = searchCriteria + "," + $scope.locationSearch.text;
                    }
                    $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.SearchResultsResponse.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                    if (data.SearchResultsResponse.JobsCount <= 0) {
                        $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                    } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                        $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                        //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                    }
                    if ($scope.bShowFilterAccordion) {
                        $scope.bShowFilterAccordion = false;
                        $scope.bRenderFacetFilterAccordion = false;
                        $scope.bShowFacetAccordionOptions = false;
                        $scope.bFilterAccordionOpen = false;
                        $scope.bPinFacetArrow = false;
                    }
                    $scope.filterAppliedCount = data.SearchResultsResponse.FiltersCount;
                    $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", data.SearchResultsResponse.FiltersCount);
                    $scope.jobsCount = data.SearchResultsResponse.JobsCount;
                    //that.sortFields = data.SortFields;
                    $scope.sortFields = _.each(data.SearchResultsResponse.SortFields, function (field) {
                        field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                    });
                    if ($scope.jobsCount > (50 * $scope.pageNumber)) {
                        $scope.bShowMoreButton = true;
                    }
                    else {
                        $scope.bShowMoreButton = false;
                    }
                    $scope.bPowerSearchVisible = false;
                    $scope.preloadPowerSearch = true;
                    $scope.setHash();
                    setTimeout(function () {
                        $(".MainContent").show();
                        $scope.$apply();
                        $scope.scrolltop();
                        $scope.bCanZoneJobsLoadingState = false;
                    }, 0);
                }
            });
        },

        closeActionDropDown: function (container) {
            $("." + container + " .dropdown").hide();
        },

        closeSavedSearchesActionDropDown: function () {
            $(".SavedSearchesContainer .dropdown").hide();
        },

        savedSearchAction: function (savedSearch, action) {
            $scope.closeSavedSearchesActionDropDown();
            $scope.savedSearchActionCompletion = 0;

            if (action == $scope.enumForSavedSearchActions.Configure) {
                $scope.openSaveSearchDialog(savedSearch);
            }
            else if (action == $scope.enumForSavedSearchActions.Renew) {
                $scope.RenewSavedSearchAjax(savedSearch);
            }
            else if (action == $scope.enumForSavedSearchActions.Delete) {
                $scope.DeleteSavedSearchAjax(savedSearch);
            }

        },

        openJobsInGroupDialog: function (JobsinGroup, AIPID) {
            $scope.JobsinGroup = JobsinGroup;
            $scope.JobsinGroup.AIPID = AIPID;
            //$('body').addClass('noScroll');
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                },
                template: 'JobsInGroupDialog', scope: $scope, className: 'ngdialog-theme-default dialogWithIFrame', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
            });
        },

        removeJobsInGroup: function (job, AIPID) {
            var Reqid = "";
            var TitletobeRemoved = "";
            _.each(job.Questions, function (Question) {
                if (Question.QuestionName.toLowerCase() == 'jobtitle')
                    TitletobeRemoved = Question.Value;
                if (Question.QuestionName.toLowerCase() == 'reqid') {
                    Reqid = Question.Value;
                }
            });
            var RemoveJobInGroup = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                Reqid: Reqid,
                AIPID: AIPID

            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RemoveJobsFromGroup",
                data: RemoveJobInGroup,
                success: function (data) {
                    if (data.Success) {
                        _.each($scope.CandZoneUnFinishedApps, function (currentObject) {
                            if (currentObject.AIPID === AIPID) {
                                var index = 0;
                                var spliceobject = false;

                                _.each(currentObject.JobsInGroup, function (Job) {
                                    _.each(Job.Questions, function (Question) {

                                        if (Question.QuestionName.toLowerCase() == 'reqid' && Question.Value === Reqid) {
                                            spliceobject = true;
                                            //JobInfo Manipulation
                                            if (currentObject.SavedDraftInfo.JobInfo.match(Question.Value)) {
                                                var fields = currentObject.SavedDraftInfo.JobInfo.replace(/^\__+/g, '').replace(/\__+$/g, '').split("__");
                                                var Count = 0;
                                                _.each(fields, function (JobInfo) {
                                                    if (JobInfo.indexOf(Question.Value) > -1) {
                                                        fields.splice(Count, 1);
                                                        return false;
                                                    }
                                                    ++Count
                                                });
                                                currentObject.SavedDraftInfo.JobInfo = "__" + fields.join("__") + "__";

                                            }
                                            //JobSiteID Manipulation
                                            if (currentObject.SavedDraftInfo.JobSiteId.match(Question.Value)) {
                                                var fields = currentObject.SavedDraftInfo.JobSiteId.split(",");
                                                var Count = 0;
                                                _.each(fields, function (JobsiteID) {
                                                    if (JobsiteID.indexOf(Question.Value) > -1) {
                                                        fields.splice(Count, 1);
                                                        return false;
                                                    }
                                                    ++Count
                                                });
                                                currentObject.SavedDraftInfo.JobSiteId = fields.join(",");
                                            }
                                            return false;
                                        }
                                    });
                                    if (spliceobject) {
                                        currentObject.JobsInGroup.splice(index, 1);
                                        currentObject.Title = currentObject.Title.replace(TitletobeRemoved, '').replace(/^,|,$|,(?=,)/g, '');
                                        return false;
                                    }
                                    ++index;
                                });
                                currentObject.SavedDraftInfo.ReqCount = currentObject.SavedDraftInfo.ReqCount - 1;
                                if (currentObject.JobsInGroup.length == 0) {
                                    _.remove($scope.CandZoneUnFinishedApps, currentObject);
                                    $scope.CandZoneUnFinishedAppsCount = $scope.CandZoneUnFinishedAppsCount - 1;
                                    $scope.CandZoneApplicationCount = $scope.CandZoneApplicationCount - 1;
                                    $scope.bAppsRemovalStatus = true;
                                    ngDialog.closeAll();
                                }
                                return false;
                            }
                        });
                    }
                    setTimeout(function () { $scope.$apply(); }, 0);
                }
            });
        },

        GetConfiguredJobTitle: function () {
            var configuredJobTitle = "jobtitle";
            if ($scope.jobFieldsToDisplay != null && typeof $scope.jobFieldsToDisplay.JobTitle != "undefined" && $scope.jobFieldsToDisplay.JobTitle != null && $scope.jobFieldsToDisplay.JobTitle != '') {
                configuredJobTitle = $scope.jobFieldsToDisplay.JobTitle.toLowerCase();
            }
            return configuredJobTitle;
        },

        getImagePath: function (imageName) {
            return "/TgNewUI/StyleSheets/ProfileIcon/" + imageName;
        },
        getlocalizedName: function (imageName) {
            var Name = imageName.replace("." + imageName.split('.').pop(), "").replace("-", "");
            return eval("$scope.dynamicStrings." + Name);
        },
        getImageUrl: function (imageURL) {
            var defaultimageurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABd5JREFUaAXdWktIJFcUvd0qJuA4QfxshKCtaRei6+jGX1QGnHElOC4kZKchuhGcCFkEkohudAbdhTALFRVhZoQg4mc2TtaKC/8ScOMHmVGhR9Q251Sqiu62qrtedeuYXGiqut67595T933vK48kSLa3tx9eXV09ur6+/ho/v8fjKcD1IeAf6CZO8ewDnm3huo7fX0lJSX/6fL4PiXDBEw/I5uZmbjAYfAyMRjhYgWuKIt4FCL2Fziuv1/umsLBwT1HfrO6KCAng7f8MJ1pBwGuixXEDrCCwXiJKP7khpERkd3f3i4uLi24Y/AG/z+Pw21YVhAL4PU9JSenNy8t7b1sxosAxEUThMaLwB/QzIjBu6+8xovMtovPGiQFHzWJ9ff0Z+sKrOyRB3zNok7adEIkaETSlz87Pz38H0FMnYLdYZzQ1NfU7NLWPdjZsiegk5qFYZqd8x8/fgUy1HRnbpqVH4r6Q4Dsr032yfH+WEWG7xKj0q6VGjIdnZ2eysLAgc3NzggFCDg4ONI3s7GxBx5WamhqpqqqStLS0GEjWxRjRfvT7/b9Flt4gwtGJnQxEbpRFKof+v7y8lLGxMRkaGpLc3Fypra2VkpISycnJ0art7+/LysqKzM7Oyt7enrS3t0tzc7MkJyeHwsS8B5FrTJ6NkaNZmLOcJxC+baApDbEnJyfS0dEhR0dH0t3dLeXl5VEdWlpakt7eXsnMzJTBwUFJT0+PWt+i8Bj9xRc6z4T1EU52qiTYlFpaWjRnJicnY5KgUyQ6MTGh6VCXGIqSoftqqpkR4bIDTWpDdcZua2sT6Mjw8LAg7CawkxvY05oY9aivItAJoIl9ZSxnzIhw7aRKYmZmRtbW1qS/v1+ZBJ2GI5ouMYilIvSVPhs6GhFGAwxbjYdOrozCwMCA1jfcjkC0Q132L2IRU0XoM32njkYEIX4CEDM6TsCWl5e1tt3Q0OCketQ6xGA/IaaK0Gf4zm3Ev0RwfaICwLqLi4tSWVmpNQ9V3cj6bGLEIqYLaaSOlzs7MKtQBdja2pLi4mJVNdv6xCKmqtB3cvCiwzyCsurOTg4PD4WzdaKEWMR0ISnk4AWj+7SecsFDOEiUsYP73WhnZWWZ6yg3+pE6XJMR06X4ScTnRrmgoEBWV1fdqFrqEIuYLsXHpsWUjbIYowxn53iFGMYo6AaLHBgRI++khFFaWqpNZtPT00p6VpWJwYmRmC7lgdIkGGqE66POzk5t9epi0WdCUZcrYGIR062QyKlb5bq6OikqKpKuri7l5QVtoklousSor6936wb1Tr14C65TlnyDfX192kaJbzQQCDh2hnWpw00WMeIR+PGeEeFGyrWwbY+MjAg3V01NTcJNUyxhHdalDnXjWXTSFiK77cH+/AVuvo9lPFb5XW11rfxARF54NjY2mjH8jVpVcPOMnfc2kw9WPmHR+dTDBRe2jVzkKK+3rEA/wbML5ImzvDyfQGjefgIHEmKSvpODkYthXvcbFWSmdebn52VnZ0find25H8nPz5fq6motjaTiB+rSd9FmID3x8Dc6vaMJkvNGImZ0K4e5W2QOwIkgGkG8hC+ZgNAc5w1IvHSiPD4+fmskaJ8viDacCH2+kUXhSREYxpzRpqamnNiIq44TG/SVPhuGzKZEZih8bhTYXTHv2BUl7LkTG/TViAYNm0T4h8dduBzz3k6QUrUrSthzBzaOdV9Nm2FEmEvlcRfYqiWYTLjbv6Fv9JG+hloLI8IChItndj2hle7ZfY/uY5hbN4iwVD9/SNiyJcxifH9Grc5GCGm7k/nfHL2hDX7kmR3I3ofI8DDU9vwwakRYaAiP4nD/CyYg2wgadRN51QedHrvmFGrLsWNYxtzrDwYcEyF7Hs395z/hCA0jF5k8ZEHoW9HcLEe+0PpO7oF1dx/VRDqkr5p5JMHzlQpcVTdnxmdOr7GKfR265Ii0Feu/UtOKBsadJrPiIMSkOPPJPtwzi2kkALUPz/CfyQ5+ePYOM3TCPjz7ByLavtZM3CByAAAAAElFTkSuQmCC";
            return (imageURL != null && imageURL != '') ? imageURL : defaultimageurl;
        },
        picOptionsMenu: function () {
            $scope.picloading = false;
            $scope.picSubpage = "0";
            $scope.myImage = '';
            $scope.myCroppedImage = '';
            $scope.uploadedPictureFile = "";
            $scope.ProfilePicError = "";
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                },
                template: 'ProfielPicDialog', scope: $scope, className: 'ngdialog-theme-default dialogWithIFrame', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
            });

        },
        closetimer: function () {
            $scope.picloading = false;
            $scope.CanvasHeight = $("img-crop").children().height();
            $scope.CanvasWidth = $("img-crop").children().width();
            $scope.CropperSize = Math.min(200, Math.round($scope.CanvasWidth / 2), Math.round($scope.CanvasHeight / 2));
            $scope.CropperPosheight = Math.round($scope.CanvasHeight / 2);
            $scope.CropperPoswidth = Math.round($scope.CanvasWidth / 2);
            setTimeout(function () {
                $(".cropArea").height($scope.CanvasHeight).width($scope.CanvasWidth)
            }, 1000);
        },
        resetCropper: function () {
            $scope.CanvasHeight = $("img-crop").children().height();
            $scope.CanvasWidth = $("img-crop").children().width();
            $scope.CropperSize = Math.min(200, Math.round($scope.CanvasWidth / 2), Math.round($scope.CanvasHeight / 2));
            $scope.CropperPosheight = Math.round($scope.CanvasHeight / 2);
            $scope.CropperPoswidth = Math.round($scope.CanvasWidth / 2);
            $scope.$broadcast('keyboardCropPosition', {
                size: $scope.CropperSize,
                x: $scope.CropperPoswidth,
                y: $scope.CropperPosheight
            });
            setTimeout(function () {
                var event = new Event('mousemove');  // (*)
                window.document.dispatchEvent(event);
            }, 0);
        },
        CropperChange: function () {

            $scope.$broadcast('keyboardCropPosition', {
                size: $scope.CropperSize,
                x: $scope.CropperPoswidth,
                y: $scope.CropperPosheight
            });
            setTimeout(function () {
                var event = new Event('mousemove');  // (*)
                window.document.dispatchEvent(event);
            }, 0);
        },
        errorloadingCroptool: function () {
            $scope.picSubmenu('0', 'upldPic');
            $scope.picloading = false;
            $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorloadingImageFile;
        },
        startspinner: function () {
            $scope.picloading = true;
        },
        handleFileSelect: function (evt) {

            var file = "";//evt.currentTarget.files[0];
            if (evt.target) {
                file = evt.target.files[0];
            } else if (evt.srcElement) {
                file = evt.srcElement.files[0];
            }
            var extension = file.name.split('.').pop().toLowerCase();
            var Name = file.name.replace("." + file.name.split('.').pop(), "");
            extension = extension.toLowerCase();
            var specials = /\*|\||\\|\<|\>|\?|\/|\"|\:/g;

            switch (extension) {
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'bmp':
                    flag = true;
                    break;
                default:
                    flag = false;
            }
            if (flag == false) {
                $scope.ProfilePicError = $scope.dynamicStrings.Profilepic_UnsupportedFileType;
            }
            else if (Name.match(specials)) {
                $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_InvalidProfilePicName;
            }
            else if (file.size > 5242880)  //1572864 keeping 5 mb 5242880 file size limit before cropping //do something if file size more than 5 mb (1048576)
            {
                $scope.ProfilePicError = $scope.dynamicStrings.ErrorMsg_LimitExceedPic;
            }
            else {
                $scope.ProfilePicError = "";
                $scope.picSubmenu('1');
                $scope.uploadedPictureFile = file;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.picloading = true;
                    $scope.myImage = evt.target.result;
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                };
                reader.readAsDataURL(file);
            }
        },

        picSubmenu: function (args, Elemfocus) {
            $scope.picSubpage = args;
            if (args == "2") {
                $(".ProfilePicContainer").addClass("Backpageoverlay");
                $scope.picloading = true;
                $scope.LibImageRadio = 1;
                $scope.EnumLibPic = [

                    { key: "a", value: "Cat.png" },
                    { key: "b", value: "Dog.png" },
                    { key: "c", value: "Lucy.png" },
                    { key: "d", value: "Elephants.png" },
                    { key: "e", value: "Falcon.png" },
                    { key: "f", value: "Tiger.png" },
                    { key: "g", value: "Drum.png" },
                    { key: "h", value: "Guitar.png" },
                    { key: "i", value: "Piano.png" },
                    { key: "j", value: "Saxophone.png" },
                    { key: "k", value: "Violin.png" },
                    { key: "l", value: "Earth.png" },
                    { key: "m", value: "Lightning.png" },
                    { key: "n", value: "Autumn.png" },
                    { key: "o", value: "Shells.png" },
                    { key: "p", value: "Sunflower.png" },
                    { key: "q", value: "Baseball.png" },
                    { key: "r", value: "Basketball.png" },
                    { key: "s", value: "Billiards.png" },
                    { key: "t", value: "Golf.png" },
                    { key: "u", value: "Soccer.png" },
                    { key: "v", value: "China.png" },
                    { key: "w", value: "Egypt.png" },
                    { key: "x", value: "Everest.png" },
                    { key: "y", value: "Northern-lights.png" },
                    { key: "z", value: "Taj-mahal.png" }
                ];

                setTimeout(function () {
                    $scope.picloading = false;

                    setTimeout(function () {
                        $(".ProfilePicContainer").removeClass("Backpageoverlay");
                    }, 700);
                }, 1000);
            }
            setTimeout(function () {
                if (Elemfocus)
                    $("." + Elemfocus).focus();
            }, 100);

        },
        croppedPicUpload: function (scope) {
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();

            var imageBase64 = $("#croppedpic").attr("src");
            //function dataURLtoFile(dataurl, filename) {
            //    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            //        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            //    while (n--) {
            //        u8arr[n] = bstr.charCodeAt(n);
            //    }
            //    return new File([u8arr], filename, { type: $scope.uploadedPictureFile.type, lastModified: new Date().getTime() });
            //}

            //Usage example:
            //var file = dataURLtoFile(imageBase64, $scope.uploadedPictureFile.name);
            //$scope.uploadProfilePic(file, "", scope);
            $scope.uploadPicture(imageBase64, "", scope);
        },

        uploadPicture: function (File, IconID, scope) {
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();

            var uploadPicture = {};

            uploadPicture.ClientId = $("#partnerId").val();
            uploadPicture.SiteId = $("#siteId").val();
            uploadPicture.SessionID = $("#CookieValue").val();
            if (File != "") {
                uploadPicture.Base64File = File.split(',')[1];
                uploadPicture.FileName = $scope.uploadedPictureFile.name;
                uploadPicture.FileType = $scope.uploadedPictureFile.name.split('.').pop().toLowerCase();
            } else {
                uploadPicture.IconID = IconID;
            }

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Profile/Home/UploadPicture",
                data: uploadPicture,
                success: function (data) {
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    if (data.Success.toLowerCase() == "true") {
                        $scope.ProfileDetails.ProfilePicDataURL = data.ProfilePicDataURL;
                        ngDialog.closeAll();
                    }
                    else {
                        switch (data.Success) {
                            case "false":
                            case "-1":
                                $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorUploadingFile;
                                break;
                            case "-2":
                                $scope.ProfilePicError = $scope.dynamicStrings.Picture_FileSizeExceed;
                                break;
                            case "-3":
                                $scope.ProfilePicError = $scope.dynamicStrings.Profilepic_UnsupportedFileType;
                                break;
                            case "-4":
                                $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_InvalidProfilePicName;
                                break;
                        }
                    }
                },
                error: function () {
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorUploadingFile;
                }
            });
        },

        uploadProfilePic: function (files, IconID, scope) {
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();
            var formData = new FormData();
            formData.append("ClientId", $("#partnerId").val());
            formData.append("SiteId", $("#siteId").val());
            formData.append("SessionID", $("#CookieValue").val());
            formData.append("IconID", IconID);
            if (files != "") {
                alert(files);
                formData.append("file", files);
            }

            $http.post("/TgNewUI/Profile/Home/UploadProfilePic", formData, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (data) {
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
                if (data.Success.toLowerCase() == "true") {
                    $scope.ProfileDetails.ProfilePicDataURL = data.ProfilePicDataURL;
                    ngDialog.closeAll();
                }
                else {
                    switch (data.Success) {
                        case "false":
                        case "-1":
                            $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorUploadingFile;
                            break;
                        case "-2":
                            $scope.ProfilePicError = $scope.dynamicStrings.Picture_FileSizeExceed;
                            break;
                        case "-3":
                            $scope.ProfilePicError = $scope.dynamicStrings.Profilepic_UnsupportedFileType;
                            break;
                        case "-4":
                            $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_InvalidProfilePicName;
                            break;
                    }
                }
            });
        },
        deleteProfilePicAjax: function () {
            var DeleteProfilePic = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val()
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Profile/Home/DeleteProfilePic",
                data: DeleteProfilePic,
                success: function (data) {
                    if (data.Success.toLowerCase() == "true") {
                        if (data.ProfilePicDataURL != null)
                            $scope.ProfileDetails.ProfilePicDataURL = data.ProfilePicDataURL;
                        ngDialog.closeAll();
                    }
                    else {
                        $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorDeletingFile;
                    }
                }
            });
        },

        showApplicationDetail: function (AppliedApplication, showWithdrawReactivateMessage) {
            $scope.previewOfSubmittedApplication = false;
            $scope.candPortalFormView = false;
            $scope.bLoadCandPortalForm = false;
            $scope.candPortalPacketView = false;
            AppliedApplication.ShowFileAction99 = false;
            $scope.candPortalFormStatus = 0;
            if (!showWithdrawReactivateMessage) {
                $scope.WithdrawlFromApplicationDetail = false;
                $scope.ReactivateFromApplicationDetail = false;
            }
            $scope.candidatezoneSubView = "applicationDetail";
            $scope.appliedApplicationDetail = AppliedApplication;
            $scope.appliedApplicationDetail.HRStatusCategory = "";
            var HrStatusRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                AppliedSiteId: AppliedApplication.AppliedSiteid,
                SessionID: $("#CookieValue").val(),
                Reqid: AppliedApplication.ReqId,
                LangId: AppliedApplication.JobReqLang,
                LocaleId: $scope.tgSettings.DefLocaleId,
                AppliedSiteLocaleId: AppliedApplication.AppliedSiteLocaleId,
                DSTSubmissionDelayed: AppliedApplication.DSTSubmissionDelayed
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/HrStatusDetail",
                data: HrStatusRequest,
                success: function (data) {
                    //As DST Submission failed, we are now fetching GQ Details.
                    if ($scope.appliedApplicationDetail.DSTSubmissionDelayed) {
                        $scope.appliedApplicationDetail.IsResponsiveGQ = data.IsResponsiveGQ;
                        $scope.appliedApplicationDetail.TQID = data.TQID;
                    }
                    $scope.appliedApplicationHrstatus = data.HRStatusCatDetails;
                    $scope.HRCatgryTab = 1;
                    $scope.bApplicationAddFiles = data.AttchmentCatNum > 0;
                    _.each($scope.appliedApplicationHrstatus, function (currentObject, index) {
                        if (currentObject.HRStatus == 2) {
                            $scope.HRCatgryTab = (1 + index);
                            $scope.appliedApplicationDetail.HRStatusCategory = currentObject.HRStatusCatLabel;
                        }
                    });
                    if ($scope.appliedApplicationHrstatus[0].LastUpdated == "" || $scope.appliedApplicationHrstatus[0].LastUpdated == null) {
                        if ($scope.appliedApplicationHrstatus[0].HRStatus == 2)
                            $scope.appliedApplicationHrstatus[0].LastUpdated = $scope.appliedApplicationDetail.LastUpdated;
                        else
                            $scope.appliedApplicationHrstatus[0].LastUpdated = $scope.appliedApplicationDetail.JobSubmissionDate;
                    }
                    if (!$scope.utils.isNewHash('applicationDetail', $scope))
                        $scope.utils.updateHistory('applicationDetail');

                    if (!$scope.utils.isNewHash('applicationDetail', $scope))
                        $scope.utils.updateHistory('applicationDetail');
                    $scope.CandPortalDocCount = data.DocCount;
                    $scope.CandPortalFormCount = data.FormCount;
                    $scope.appliedApplicationDetail.LocalizedLabels = data.LocalizedLabels;
                    $scope.AppDetailTab = "status";
                    $scope.contructAppDetailActions($scope.appliedApplicationDetail);
                    $scope.setTitle("ApplicationDetail");
                    $scope.loadwebtrackerscript("/TGNewUI/ApplicationDetail", $scope.customScriptRendering.CandidateZone);
                    //$scope.setHash();
                }
            });
        },

        AppDetailTabChange: function (currentTab) {
            $scope.AppDetailTab = currentTab;
            if (currentTab == 'document' || currentTab == 'form') {
                var portalRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SessionID: $("#CookieValue").val(),
                    ReqId: $scope.appliedApplicationDetail.ReqId,
                    LoadCPFormsOnly: currentTab == 'form' ? 1 : 0
                };

                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/GetCandidatePortalInfo",
                    data: portalRequest,
                    success: function (data) {
                        $scope.CandPortalDocuments = data.SavedCandidatePortalDocuments;
                        $scope.currentCandPortalDoc = null;
                        $scope.candPortalPacketView = false;
                        $scope.$apply();
                        $scope.alignCards("candPortalTab", "jobCard");
                    }
                });
            }
        },

        openCandPortalDoc: function (doc, isForm) {
            if (doc.DocumentType == 3) {
                $.ajax({
                    method: "GET",
                    url: doc.DocumentHyperlinkURL,
                    success: function (data) {
                        $scope.CandPortalPacketDocuments = data.SavedDocumentPackets;
                        $scope.currentCandPortalDoc = null;
                        $scope.candPortalPacketView = true;
                        $scope.PacketTitle = data.Title;
                        $scope.PacketMessage = data.PacketMessage;
                        $scope.$apply();
                        $scope.alignCards("candPortalPocketDocList", "jobCard");
                    }
                });
            } else if (!isForm) {
                window.location.href = doc.ViewAttachmentURL;
            } else {
                $scope.bLoadCandPortalForm = true;
                $scope.candPortalFormView = true;
                $scope.currentCandPortalDoc = doc;
                $('#candPortalFormDiv').append("<iframe scrolling='no' allowtransparency='true' id='PortalForm' title='Candidate Portal Form' src='" + doc.DocumentHyperlinkURL + "' tabindex='0' style='width:100%; height:600px; border:0'> </iframe>");
            }
            $timeout(function () {
                $scope.$apply();
            }, 0);
        },

        openCandidatePortalForm: function () {
            $scope.bLoadCandPortalForm = true;
            $scope.candPortalFormView = true;
            $('#candPortalFormDiv').append("<iframe scrolling='no' allowtransparency='true' id='PortalForm' title='Candidate Portal Form' src='" + $scope.DocFormURL + "' tabindex='0' style='width:100%; height:600px; border:0'> </iframe>");
            $timeout(function () {
                $scope.$apply();
            }, 0);
        },

        CloseCandPortalIframe: function (formCompleted) {
            $('#PortalForm').remove();
            $scope.candPortalFormView = false;
            $scope.bLoadCandPortalForm = false;
            $scope.candPortalPacketView = false;
            $scope.CandPortalPacketDocuments = [];
            if (formCompleted) {
                $scope.AppDetailTabChange($scope.AppDetailTab);
                $scope.candPortalFormStatus = 1;
            }
            $scope.$apply();
            $scope.alignCards("candPortalTab", "jobCard");
        },

        contructAppDetailActions: function (appliedApplicationDetail, backLink) {
            var $selectctrl = $("#ApplicationDetailAction");
            var opts = "<option disabled selected value=''>" + $scope.dynamicStrings.Link_More + "</option>";
            var ActionCount = 0;
            var Items = [];
            $selectctrl.find('option').remove().end();
            $scope.ApplicationDetailActions = [];

            //ActionItems based on Configuration
            if ($scope.appliedApplicationDetail.FileAction == '2' || $scope.appliedApplicationDetail.FileAction == '99') {
                Items.push($scope.dynamicStrings.Lbl_ReactivateApplication);
            }
            if (!appliedApplicationDetail.IsManuallyFiled && appliedApplicationDetail.IsResponsiveGQ) {
                Items.push($scope.dynamicStrings.Link_ViewApplication);
            }
            Items.push($scope.dynamicStrings.Lbl_Viewjobdescription);
            if ($scope.bApplicationAddFiles)
                Items.push($scope.dynamicStrings.Lbl_AddFiles);
            if ($scope.appliedApplicationDetail.FileAction == '0' && $scope.tgSettings.EnableJobSubmissionWithdrawal.toLowerCase() == 'yes') {
                Items.push($scope.dynamicStrings.Lbl_WithdrawApplication);
            }
            if ($scope.appliedApplicationDetail.AllowReApply) {
                Items.push($scope.dynamicStrings.Lbl_Reapply);
            }

            //ActionItemsBasedon Width
            if ($(window).width() <= 768 & $(window).width() > 668) {
                ActionCount = 3;
            }
            else if ($(window).width() <= 668 && $(window).width() > 400) {
                ActionCount = 2;
            }
            else if ($(window).width() <= 400) {
                ActionCount = 1;
                opts = "<option disabled selected value=''>" + $scope.dynamicStrings.AriaLabel_Actions + "</option>";
            }

            //The Logic
            if (Items.length > ActionCount && $(window).width() <= 768) {
                for (i = 0 ; i < Items.length ; i++) {
                    if (i < (ActionCount - 1))
                        $scope.ApplicationDetailActions.push(Items[i])
                    else
                        opts += "<option value='" + Items[i] + "'>" + Items[i] + "</option>";
                }
                if (backLink)
                    $selectctrl.selectmenu("destroy");
                $selectctrl.append($(opts));
                $("#ApplicationDetailAction-button").css('display', 'inline-block');
                $selectctrl.selectmenu();
                if (backLink)
                    $selectctrl.on("selectmenuchange", $scope.ThrottleApplicationDetailAction);
                $selectctrl.selectmenu("refresh", true);
                $("#ApplicationDetailAction-button").children(".ui-selectmenu-text").attr("aria-live", "assertive").attr("id", "ApplicationDetailAction-button_text");
            } else {
                $selectctrl.css('display', 'none');
                $("#ApplicationDetailAction-button").css('display', 'none');
                $scope.ApplicationDetailActions = Items;
            }
            setTimeout(function () {
                $scope.$apply();
                if (!$scope.utils.isNewHash('applicationDetail', $scope))
                    $scope.utils.updateHistory('applicationDetail');
                $scope.setHash();
            }, 0);
        },
        ThrottleApplicationDetailAction: function () {
            switch ($("#ApplicationDetailAction").val()) {
                case $scope.dynamicStrings.Lbl_Viewjobdescription:
                    $scope.showJobDescriptionAjax($scope.appliedApplicationDetail);
                    break;
                case $scope.dynamicStrings.Lbl_AddFiles:
                    $scope.addFilesAjax($scope.appliedApplicationDetail);
                    break;
                case $scope.dynamicStrings.Lbl_WithdrawApplication:
                case $scope.dynamicStrings.Lbl_ReactivateApplication:
                    $scope.withDrawApplyFinishedApplication($scope.appliedApplicationDetail);
                    break;
                case $scope.dynamicStrings.Lbl_ReactivateApplication:
                    $scope.appliedApplicationDetail.ShowFileAction99 = true;
                    break;
                case $scope.dynamicStrings.Lbl_Reapply:
                    $scope.reApplyFromFinsihedApplications($scope.appliedApplicationDetail);
                    break;
                case $scope.dynamicStrings.Link_ViewApplication:
                    $scope.GetGQPreviewOfSubmittedApplication($scope.appliedApplicationDetail);
                    break;
            }
            $('#ApplicationDetailAction').val('');

            setTimeout(function () {
                $("#ApplicationDetailAction-button_text").text($scope.dynamicStrings.Link_More);
                $("#ApplicationDetailAction").selectmenu("refresh");
            }, 1000);

        },
        AppDetailReaderText: function (MyBoolean) {
            var statusString = "";
            if (MyBoolean == "1") {
                statusString = $scope.dynamicStrings.Lbl_Completed + "-";
            } else if (MyBoolean == "2") {
                statusString = $scope.dynamicStrings.Lbl_ReachedStep + "-";
            } else {
                statusString = $scope.dynamicStrings.Lbl_NotCompleted + "-";
            }
            return statusString;
        },
        updateHRCategoryTab: function (value) {
            $scope.HRCatgryTab = value;
            $("#HRCatgryDetails").scrollAndFocus();
        },

        showJobDescriptionAjax: function (AppliedApplication) {
            var jobDescRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                ReqId: AppliedApplication.ReqId,
                JobReqLang: appScope.tgSettings.DefLanguageId
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/GetJobDescription",
                data: jobDescRequest,
                success: function (data) {
                    $scope.appliedApplicationDesc = data.jobDesc;
                    $('body').addClass('noScroll');
                    ngDialog.open({
                        preCloseCallback: function (value) {
                            $('body').removeClass('noScroll');
                            $.restoreFocus();
                        },
                        template: 'jobApplicationDescription', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                    });
                }
            });
        },
        addFilesAjax: function (AppliedApplication) {
            var attachmentCatRequest = {
                partnerId: $("#partnerId").val(),
                siteId: $("#siteId").val()
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/GetAttachmentCategories",
                data: attachmentCatRequest,
                success: function (data) {
                    $scope.attachmentCategories = data;
                    $scope.penddingAttachments = [];
                    setTimeout(function () {
                        $scope.candidatezoneSubView = 'ApplicationAddFiles';
                        $scope.setTitle("AddFiles");
                        if (!$scope.utils.isNewHash('appAddFiles', $scope))
                            $scope.utils.updateHistory('appAddFiles');
                        $scope.setHash();
                    }, 0);
                }
            });

        },

        GetGQPreviewOfSubmittedApplication: function (AppliedApplication) {
            //scope.oActiveLaddaButton.start();
            var tqid = AppliedApplication.TQID;
            if (tqid < 1) {
                tqid = _.pluck(_.where(AppliedApplication.Questions, { "QuestionName": "gqid" }), "Value").toString();
            }
            var PreviewPageRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: AppliedApplication.AppliedSiteid,
                ReqId: AppliedApplication.ReqId,
                LangId: AppliedApplication.JobReqLang,
                LocaleId: AppliedApplication.AppliedSiteLocaleId,
                TQId: tqid,
                BRUID: $scope.encryptedBruid
            };

            $.ajax({
                type: "POST",
                url: "/gqweb/GetGQPreviewOfSubmittedApplication",
                data: PreviewPageRequest,
                success: function (data) {
                    $scope.previewOfSubmittedApplication = true;
                    $scope.applicationPreviewPage = data;
                    $scope.CallApply();
                    setTimeout(function () {
                        $("#applicationPreviewPageContent").html($scope.applicationPreviewPage);
                        $compile($("#applicationPreviewPageContent").contents())($scope);
                        $scope.CallApply();
                        if (!$scope.utils.isNewHash('applicationPreview', $scope))
                            $scope.utils.updateHistory('applicationPreview');
                        $scope.setHash();
                    }, 0);
                }
            });
        },



        ViewReferrals: function () {
            $scope.bCandidateZone = true;
            $scope.bCanZoneJobsLoadingState = true;
            $scope.candidatezoneSubView = 'ResponsiveReferrals';
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Referrals";
            $scope.setTitle("Referrals");
            $scope.bInitialLoad = false;
            $scope.bJobDetailsShown = false;
            $scope.ReferralData == null;
            var SRStatusCheckRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionID: $("#CookieValue").val(),
                LocaleId: $scope.tgSettings.DefLocaleId,
                LangId: $scope.tgSettings.DefLanguageId
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/Referrals",
                data: SRStatusCheckRequest,
                success: function (data) {
                    //data = { "Referrals": [{ "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationmlwkci\u0027\u0026[)2017-03-28-0842-41", "AutoReq": "2922BR", "ReferralSubmissionDate": "28-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationjpdyka\u0027;*\u00262017-03-23-0658-23", "AutoReq": "2810BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationgdmjnx\u0027{-,2017-03-23-1124-31", "AutoReq": "2803BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationjrmjnx\u0027{-,2017-03-23-1106-07", "AutoReq": "2801BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationzqxyka\u0027;*\u00262017-03-23-1048-09", "AutoReq": "2800BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationmgymrs\u0027.}$2017-03-23-0223-40", "AutoReq": "2799BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationuhqizn\u0027?`/2017-03-22-1014-17", "AutoReq": "2784BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationyigizn\u0027?`/2017-03-22-0956-09", "AutoReq": "2783BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationqsgizn\u0027?`/2017-03-22-0927-00", "AutoReq": "2782BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationswmizn\u0027?`/2017-03-22-0855-03", "AutoReq": "2781BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationoloizn\u0027?`/2017-03-22-0832-48", "AutoReq": "2780BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationwuujnx\u0027{-,2017-03-14-0856-11", "AutoReq": "2599BR", "ReferralSubmissionDate": "14-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationnrcaou\u0027(#}2017-02-25-1208-07", "AutoReq": "2316BR", "ReferralSubmissionDate": "25-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationiwaaou\u0027(#}2017-02-16-0555-09", "AutoReq": "2291BR", "ReferralSubmissionDate": "16-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationmuhyka\u0027;*\u00262017-02-16-0533-31", "AutoReq": "2284BR", "ReferralSubmissionDate": "16-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationpdnyka\u0027;*\u00262017-02-16-0321-49", "AutoReq": "2280BR", "ReferralSubmissionDate": "16-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationlllyka\u0027;*\u00262017-02-13-0201-50", "AutoReq": "2275BR", "ReferralSubmissionDate": "13-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationguozzk\u0027+^!2017-02-10-0747-16", "AutoReq": "2270BR", "ReferralSubmissionDate": "10-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationjbxmrs\u0027.}$2017-02-09-0419-53", "AutoReq": "2251BR", "ReferralSubmissionDate": "09-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationqbxmrs\u0027.}$2017-01-28-0818-26", "AutoReq": "2208BR", "ReferralSubmissionDate": "28-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationsvijnx\u0027{-,2017-01-12-1058-12", "AutoReq": "2110BR", "ReferralSubmissionDate": "12-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationfkfyka\u0027;*\u00262017-01-03-0548-59", "AutoReq": "2079BR", "ReferralSubmissionDate": "03-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationkvkzzk\u0027+^!2017-01-03-0501-23", "AutoReq": "2077BR", "ReferralSubmissionDate": "03-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationzrdzzk\u0027+^!2016-12-31-0526-17", "AutoReq": "2059BR", "ReferralSubmissionDate": "31-Dec-2016", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": "AutoDeleteypokjnxv, AutoDeletecebejnxv AutoDeleteypokjnxv, AutoDeletecebejnxv", "JobTitle": "AutoDelete-Aû-ómationypojnx\u0027{-,2017-02-25-1208-27", "AutoReq": "2317BR", "ReferralSubmissionDate": "25-Feb-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletegdbcmrsr, AutoDeletektoxmrsr", "JobTitle": "AutoDelete-Aû-ómationgdbmrs\u0027.}$2017-02-10-0747-51", "AutoReq": "2271BR", "ReferralSubmissionDate": "10-Feb-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletelrhojnxv, AutoDeletephujjnxv", "JobTitle": "AutoDelete-Aû-ómationlrhjnx\u0027{-,2017-01-31-0350-17", "AutoReq": "2236BR", "ReferralSubmissionDate": "31-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeleteqrzkxupb, AutoDeletegyvzxupb", "JobTitle": "AutoDelete-Aû-ómationqrzxup\u0027@:~2017-01-16-1006-31", "AutoReq": "2144BR", "ReferralSubmissionDate": "16-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletekpsekcig, AutoDeleteoegzkcig", "JobTitle": "AutoDelete-Aû-ómationkpskci\u0027\u0026[)2017-01-16-0217-24", "AutoReq": "2138BR", "ReferralSubmissionDate": "16-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletemfcijnxv, AutoDeletequqdjnxv", "JobTitle": "AutoDelete-Aû-ómationmfcjnx\u0027{-,2017-01-15-0125-05", "AutoReq": "2128BR", "ReferralSubmissionDate": "15-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletepaozykam, AutoDeletegikoykam", "JobTitle": "AutoDelete-Aû-ómationpaoyka\u0027;*\u00262017-01-12-1059-00", "AutoReq": "2111BR", "ReferralSubmissionDate": "12-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletefvhlmrsr, AutoDeletewdcamrsr", "JobTitle": "AutoDelete-Aû-ómationfvhmrs\u0027.}$2016-12-31-0534-50", "AutoReq": "2061BR", "ReferralSubmissionDate": "31-Dec-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletehvvajnxv, AutoDeletehvvajnxv", "JobTitle": "AutoDelete-Aû-ómationqnzjnx\u0027{-,2016-12-15-0755-39", "AutoReq": "2028BR", "ReferralSubmissionDate": "15-Dec-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeleteookgaoui, AutoDeletefwfvaoui", "JobTitle": "AutoDelete-Aû-ómationkywaou\u0027(#}2016-12-03-0809-08", "AutoReq": "1981BR", "ReferralSubmissionDate": "03-Dec-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletetimjxupb, AutoDeletejqhyxupb", "JobTitle": "AutoDelete-Aû-ómationoszxup\u0027@:~2016-11-16-0521-57", "AutoReq": "1895BR", "ReferralSubmissionDate": "16-Nov-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletecduqkcig, AutoDeleteslqfkcig", "JobTitle": "AutoDelete-Aû-ómationynhkci\u0027\u0026[)2016-11-07-0457-22", "AutoReq": "1832BR", "ReferralSubmissionDate": "07-Nov-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletewtrkxupb, AutoDeletembmaxupb", "JobTitle": "AutoDelete-Aû-ómationwtrxup\u0027@:~2016-10-04-0143-05", "AutoReq": "1569BR", "ReferralSubmissionDate": "04-Oct-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }], "ExpiredReferrals": ["AutoDelete-Aû-ómationjztjnx\u0027{-,2016-09-26-0209-59 (1495BR)", "AutoDelete-Aû-ómationiaonhc\u0027#,+2016-09-26-0514-25 (1513BR)", "AutoDelete-Aû-ómationasunhc\u0027#,+2016-10-03-0501-36 (1539BR)", "AutoDelete-Aû-ómationsqwnhc\u0027#,+2016-10-03-0559-08 (1542BR)", "AutoDelete-Aû-ómationvlfkci\u0027\u0026[)2016-10-03-1027-54 (1554BR)", "AutoDelete-Aû-ómationixyaou\u0027(#}2016-10-04-0702-18 (1564BR)", "AutoDelete-Aû-ómationpexaou\u0027(#}2016-10-04-0908-52 (1568BR)", "AutoDelete-Aû-ómationpyowff\u0027?~}2016-11-02-0709-08 (1796BR)", "AutoDelete-Aû-ómationrtryka\u0027;*\u00262016-11-02-0746-00 (1797BR)", "AutoDelete-Aû-ómationpdbjnx\u0027{-,2016-11-05-0639-30 (1800BR)", "AutoDelete-Aû-ómationhhkxup\u0027@:~2016-11-07-0457-22 (1831BR)", "AutoDelete-Aû-ómationhhkxup\u0027@:~2016-11-07-0457-22 (1831BR)", "AutoDelete-Aû-ómationtzjjnx\u0027{-,2016-11-08-0526-44 (1837BR)", "AutoDelete-Aû-ómationaspnhc\u0027#,+2016-11-23-0606-45 (1958BR)", "AutoDelete-Aû-ómationeqxwff\u0027?~}2016-12-03-0806-05 (1978BR)", "AutoDelete-Aû-ómationkajxup\u0027@:~2016-12-05-0617-17 (1996BR)", "AutoDelete-Aû-ómationizxxup\u0027@:~2016-12-14-1226-49 (2010BR)"] };
                    $scope.bCanZoneJobsLoadingState = false;
                    $scope.ReferralData = _.groupBy(data.Referrals, "IsActiveReferralOrSentReferral")
                    $scope.ExpiredReferrals = data.ExpiredReferrals;
                    $scope.ExpiredActiveReferrals = data.ExpiredActiveReferrals;
                    ($scope.ExpiredReferrals != null && $scope.ExpiredReferrals.length > 0) ? $scope.bShowExpiredReferralAlert = true : $scope.bShowExpiredReferralAlert = false;
                    ($scope.ExpiredActiveReferrals != null && $scope.ExpiredActiveReferrals.length > 0) ? $scope.bShowActiveExpiredReferralAlert = true : $scope.bShowActiveExpiredReferralAlert = false;
                    $scope.ExpActiveRefquantity = 4;
                    $scope.ExpRefquantity = 4;
                    $scope.setTitle("Referrals");
                    $scope.$apply();
                    if (!$scope.utils.isNewHash('ResponsiveReferrals', $scope)) {
                        $scope.ActiveReferrals = $scope.oHistory["ResponsiveReferrals"].ActiveReferrals;
                        $scope.SentReferrals = $scope.oHistory["ResponsiveReferrals"].SentReferrals;
                        $scope.utils.updateHistory('ResponsiveReferrals');
                    }
                    $scope.setHash();
                    setTimeout(function () {
                        $scope.CallCollapse("ActiveReferrals", "SentReferrals");
                        $scope.alignCards("ActiveReferrals", "jobCard");
                        $scope.alignCards("SentReferrals", "jobCard");
                    }, 100);
                    $scope.loadwebtrackerscript("/TGNewUI/Referrals", $scope.customScriptRendering.CandidateZone);
                },
                error: function (error) {
                    $scope.bCanZoneJobsLoadingState = false;
                    $scope.setTitle("Referrals");
                    $scope.setHash();
                }
            });
        },
        ExpRefquantityrefresh: function (value, isActiveReferral) {
            if (isActiveReferral) {
                $scope.ExpActiveRefquantity = value.toString();
            }
            else {
                $scope.ExpRefquantity = value.toString();
            }

            setTimeout(function () {
                $scope.$apply();
            }, 0)

        },
        compileInnerHtml: function (el) {
            //method to update scope externally in forms.js
            $compile($(el).contents())($scope);
        },


        education: [],
        educationDetails: {
            IsSchoolModified: false,
            IsDegreeModified: false,
            SchoolName: "",
            EduMajor: "",
            EduDegree: "",
            GradYear: "",
            GPA: "",
            MostRecent: 0,
            Saved: false

        },
        experience: [],
        experienceDetails: {
            PositionTitle: "",
            EmployerName: "",
            Responsibilities: "",
            Skills: "",
            StartDate: "",
            EndDate: "",
            MostRecent: 0,
            Saved: false

        },

        communications: [],
        communicationDeleted: false,
        commHistStartIndex: 1,
        commHistShowMore: false,

        trustedHtml: function (val) {
            return (val.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>'));
        },

        EditProfileMenu: function (EditProfileView) {
            $scope.candidatezoneEditProfileView = EditProfileView;
            if (EditProfileView == 'profile') {
                $scope.editProfileView();
            } else if (EditProfileView == 'myFiles') {
                $scope.FileManagerAjax();
            }
        },

        resetProfileImportStatus: function () {
            $scope.profileImportStatus = 0;
        },

        reloadProfile: function (status) {
            $scope.profileImportStatus = (typeof status === 'undefined') ? 1 : status;
            $scope.editProfileView();
            $scope.CloseDialogs();
        },

        editProfileView: function () {

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }
            $scope.setTitle("Profile");
            var editProfileRequest = {};
            editProfileRequest.PartnerId = $("#partnerId").val();
            editProfileRequest.SiteId = $("#siteId").val();
            editProfileRequest.EncryptedSessionId = $("#CookieValue").val();
            url = '/TgNewUI/CandidateZone/Ajax/ViewEditProfile';
            $scope.bInitialLoad = false;
            $('#menuContainer').empty();

            $http.post(url, editProfileRequest).success(function (data, status, headers, config) {

                _.forEach(data.Responses, function (info) {
                    switch (info.Name) {
                        case "firstname":
                            $scope.ProfileFirstName = info.Code;
                            $scope.ProfileDetails.FirstName = info.Code;
                            break;
                        case "middlename":
                            $scope.ProfileMiddleName = info.Code;
                            break;
                        case "lastname":
                            $scope.ProfileLastName = info.Code;
                            $scope.ProfileDetails.LastName = info.Code;
                            break;
                        case "address1":
                            $scope.ProfileAddress1 = info.Code;
                            break;
                        case "address2":
                            $scope.ProfileAddress2 = info.Code;
                            break;
                        case "countryname":
                            $scope.ProfileCountryName = info.Code;
                            break;
                        case "country":
                            $scope.ProfileCountryCode = info.Code;
                            break;
                        case "city":
                            $scope.ProfileCity = info.Code;
                            break;
                        case "state":
                            $scope.ProfileState = info.Code;
                            break;
                        case "fullstate":
                            $scope.ProfileFullState = info.Code;
                            break;
                        case "zip":
                            $scope.ProfileZip = info.Code;
                            break;
                        case "homephone":
                            $scope.ProfileHomePhone = info.Code;
                            break;
                        case "workphone":
                            $scope.ProfileWorkPhone = info.Code;
                            break;
                        case "fax":
                            $scope.ProfileFax = info.Code;
                            break;
                        case "cellphone":
                            $scope.ProfileCellPhone = info.Code;
                            break;
                        case "homepage":
                            $scope.ProfileWebAddress = info.Code;
                            if (info.Code.indexOf('.') > 0) {
                                if (info.Code.toLowerCase().indexOf('http:') == 0)
                                    $scope.ProfileURL = info.Code;
                                else
                                    $scope.ProfileURL = 'http://' + info.Code;
                            } else {
                                $scope.ProfileURL = '';
                            }
                            break;
                        case "CandidateStackingField":
                            $scope.ProfileCandStackField = info.Code;
                            break;
                        case "CandidateStackingFieldDate":
                            $scope.ProfileCandStackFieldDate = info.Code;
                            break;
                        case "email":
                            $scope.ProfileEmailAddress = info.Code;
                            break;
                        case "lnpronunciationkey":
                            $scope.ProfileLNPronunKey = info.Code;
                            break;
                        case "fnpronunciationkey":
                            $scope.ProfileFNPronunKey = info.Code;
                            break;

                    }
                    $scope.ProfileFields = data.ProfileFields;
                })


                var showFields = $.grep($scope.ProfileFields, function (e) { return e.hide == 0 && e.ReadOnly == 0 });
                $scope.incompleteProfile = false;
                $scope.bProfileContactEditable = false;
                $scope.bEnableInportProfile = false;
                if (showFields.length > 0) {
                    $scope.bProfileContactEditable = true;

                    var importableFields = $.grep(showFields, function (e) { return e.Id != 16 && e.Id != 17 });
                    if (importableFields.length > 0)
                        $scope.bEnableInportProfile = true;
                }
                $scope.fileStatus = 0;
                $scope.ProfileAdressString = "";
                ProfileAdressStringStart = "";
                if ($scope.ProfileAddress1)
                    ProfileAdressStringStart += $scope.ProfileAddress1 + "\n";
                if ($scope.ProfileAddress2)
                    ProfileAdressStringStart += $scope.ProfileAddress2 + "\n";
                if ($scope.ProfileCity)
                    $scope.ProfileAdressString += $scope.ProfileCity + ", ";
                if ($scope.ProfileState)
                    $scope.ProfileAdressString += $scope.ProfileState + " ";
                if ($scope.ProfileZip)
                    $scope.ProfileAdressString += $scope.ProfileZip;
                if ($scope.ProfileCountryName)
                    $scope.ProfileAdressString += "\n" + $scope.ProfileCountryName;

                if ($scope.ProfileAdressString.indexOf(",") == 0)
                    $scope.ProfileAdressString = $scope.ProfileAdressString.substring(2);
                if ($scope.ProfileAdressString.indexOf(", ") == $scope.ProfileAdressString.length)
                    $scope.ProfileAdressString = $scope.ProfileAdressString.substring(0, $scope.ProfileAdressString.length - 2);

                if (!$scope.ProfileFullState && $scope.ProfileState != '')
                    $scope.ProfileFullState = $scope.ProfileState;

                $scope.ProfileAdressString = ProfileAdressStringStart + $scope.ProfileAdressString
                $scope.hasProfileDetails = false;

                $scope.education = data.Education;
                $scope.experience = data.Experience;

                $scope.editEduExpErrormsgs = [];

                $scope.resumeReadOnly = false;
                if (data.ResumeCoverLetters.length > 0 && data.ResumeCoverLetters[0].ReadOnly)
                    $scope.resumeReadOnly = true;

                if ($scope.ProfileFirstName || $scope.ProfileLastName || $scope.ProfileAdressString || $scope.ProfileEmailAddress || $scope.ProfileHomePhone || $scope.education.length > 0 || $scope.experience.length > 0) {
                    $scope.hasProfileDetails = true;
                    $scope.enterProfileEditMode(false, false);
                }
                $scope.LoadedTGSettings = data.Settings;
                var settings = JSON.parse(data.Settings);
                $scope.CustomStackingLabel = settings['customstackinglabel'];
                var requiredFields = settings['requiredfields'];
                if (requiredFields == '')
                    requiredFields = "1,3,11";
                $scope.profileRequiredFields = requiredFields.split(',');
                $scope.CandStackingEditable = settings['tgreadonlystackinglogic'] == "0" ? false : true;
                $scope.HideProfileEdu = settings['hideeducation'].toLowerCase() == "yes" ? true : false;
                $scope.HideProfileExp = settings['hideexperience'].toLowerCase() == "yes" ? true : false;
                $scope.HideProfileGPA = settings['hidegpaeducationinputfield'].toLowerCase() == "yes" ? true : false;
                $scope.HideProfileGradYear = settings['hidegradyeareducationinputfield'].toLowerCase() == "yes" ? true : false;
                $scope.MetaData = "{\"partnerid\":\"" + config.data.PartnerId + " \",\"siteid\":\"" + config.data.SiteId + "\"}";
                $scope.stackingPattern = settings['stackingpattern'];
                $scope.stackingErrorMessage = settings['customstackingerrormessage'];
                $scope.stackingType = settings['stackingtype'];
                $scope.stackingUpYears = settings['stackingupyears'];
                $scope.stackingDownYears = settings['stackingdownyears'];
                if ($scope.stackingType == 'date') {
                    if ($scope.ProfileCandStackField)
                        $scope.ProfileCandStackField = $scope.ProfileCandStackField.replace(/-/, '/').replace(/-/, '/');
                    if ($scope.stackingUpYears == '')
                        $scope.stackingUpYears = '1';
                    if ($scope.stackingDownYears == '')
                        $scope.stackingUpYears = '75';
                }

                if (!$scope.HideProfileEdu && ($scope.education.length == 0 || !$scope.education[0].ReadOnly)) {
                    $scope.bEnableInportProfile = true;
                } else if (!$scope.HideProfileExp && ($scope.experience.length == 0 || !$scope.experience[0].ReadOnly)) {
                    $scope.bEnableInportProfile = true;
                }

                $scope.subViewInitialized = true;
                if (!$scope.utils.isNewHash('profile', $scope))
                    $scope.utils.updateHistory('profile');
                $scope.setHash();

                setTimeout(function () {
                    initFormsMethods();

                    if ($scope.googleLoggedIn == "googledrive") {
                        $scope.googleLoggedIn = "";
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $.restoreFocus();
                            },
                            template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                        });
                    }

                }, 0);

                if ($scope.hasProfileDetails) {
                    //check for validation of the information we got
                    var profileFieldNames = ["FirstName", "MiddleName", "LastName", "EmailAddress", "Address1", "Address2", "City", "Zip", "CountryCode", "State", "HomePhone", "WorkPhone", "CellPhone", "Fax", "WebAddress", "LNPronunKey", "FNPronunKey", "CandStackField"];
                    var contactValid = true;
                    for (i = 0; i < profileFieldNames.length; i++) {
                        if ($scope.isProfileFieldReadOnly(i + 1))
                            continue;

                        var fieldName = profileFieldNames[i];
                        var fieldVal = $scope["Profile" + fieldName];
                        var required = $scope.profileRequiredFields.indexOf((i + 1).toString()) > -1;
                        if (required && (fieldVal == null || fieldVal == "")) {
                            contactValid = false;
                            break;
                        }
                        if (fieldVal) { //check format
                            var validFormat = "";
                            if (fieldName.indexOf("Name") > -1) {
                                validFormat = /[0-9!#\$%&\"\*\+/:;<=>_\?@\[\\\]\^\{\|\}~]+/gi;
                                if (fieldVal.match(validFormat)) {
                                    contactValid = false;
                                    break;
                                }
                            }
                            else {
                                if (fieldName.indexOf("Phone") > -1 || fieldName == "Fax") {
                                    validFormat = /^(?:\+?\(?\d+)(?:[0-9]|[-,. ()+])+\d+$/;
                                } else if (fieldName.indexOf("Address") > -1 || fieldName.indexOf("PronunKey") > -1) {
                                    validFormat = /^(?!.*<.*>)/;
                                } else if (fieldName == "EmailAddress") {
                                    validFormat = /^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ!#$%&'\/*\/+-\/\/\/=\/?\/^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
                                } else if (fieldName == "Zip" && $scope.ProfileCountryCode == "223") {
                                    validFormat = /(^[0-9]{5}$)|(^[0-9]{5}-[0-9]{4}$)/;
                                } else if (fieldName == "WebAddress") {
                                    validFormat = /((?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)/i;
                                } else if (fieldName == "CandStackField" && $scope.stackingType != 'date') {
                                    validFormat = $scope.stackingPattern;
                                }

                                if (validFormat && !fieldVal.match(validFormat)) {
                                    contactValid = false;
                                    break;
                                }
                            }
                        }
                    };

                    if (!contactValid) {
                        $timeout(function () { $scope.incompleteProfile = true; });
                        $scope.enterProfileEditMode(true, false);
                    }

                    if (!$scope.HideProfileEdu) {
                        _.forEach($scope.education, function (edu, index) {
                            if (edu.SchoolName == "" || edu.EduMajor == "")
                                $scope.updateEducation(index);
                        });
                    };

                    if (!$scope.HideProfileExp) {
                        _.forEach($scope.experience, function (exp, index) {
                            if (exp.EmployerName == "" || exp.PositionTitle == "" || exp.StartDate == "") {
                                $scope.updateExperience(index);
                            }
                        });
                    };
                    setTimeout(function () {
                        if (!$scope.HideProfileExp) {
                            _.forEach($scope.experience, function (exp, index) {
                                if (exp.updateMode) {
                                    $scope.saveExperience(index, true);
                                }
                            });
                        };
                        if (!$scope.HideProfileEdu) {
                            _.forEach($scope.education, function (edu, index) {
                                if (edu.updateMode)
                                    $scope.saveEducation(index, true);
                            });
                        };

                        if (!contactValid)
                            $('#editProfileForm').valid();
                    }, 500);
                }
                $scope.loadwebtrackerscript("/TGNewUI/Profile", $scope.customScriptRendering.CandidateZone);
            });

        },
        createFormAutocomplete: function (event) {

            var $autoinput = $(this).closest(".fieldcontain").find("input[id*='-input']");

            var ss = $autoinput.attr('id').replace('-input', '');
            var fieldParams = ss.split("_");
            var questionId = fieldParams[1];
            var questionType = fieldParams[0];
            var fieldName = fieldParams[3];
            var fieldType = fieldParams[4];
            window.pageSize = 15;
            this.pageIndex = 0;
            window.isBlanketSearch = 0;
            $(this).removeClass("ui-complete");

            $autoinput.autocomplete({
                minLength: 1,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "fit flip"
                },
                select: function (event, ui) {
                    $scope.SMSConsentInfo.MobileCountryCode = ui.item.countryCode;
                    $scope.SMSConsentInfo.MobileCountry = ui.item.label;
                    $scope.SMSConsentInfo.CountryCode = ui.item.value;
                    if (typeof $(this).attr('multiselect') == 'undefined') {
                        $(this).val(ui.item.label);
                        this.pageIndex = 0;
                    }
                    select = "#" + ss.split(".").join("\\."); //.replace('.', "\\.");

                    var $selectControl = $(select);
                    var $clearbtn = $("#" + $selectControl.attr("name") + "-input").parent().find("a");


                    if (typeof $selectControl.attr("multiple") == "undefined") {

                        $selectControl.find("option:selected").each(function () { $(this).removeAttr("selected"); $(this).prop("selected", false); });
                    }
                    $selectControl.find("option[value='" + ui.item.value + "']").first().prop("selected", "selected");
                    $clearbtn.removeClass("custom-icon-angle-down");
                    $clearbtn.addClass("icon-remove");
                    $selectControl.closest(".fieldcontain").find("input.ui-search-widget").removeClass("error");

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
                        TQRenderingID: 0, QuestionType: questionType, QuestionId: questionId, FieldName: fieldName, LanguageId: appScope.tgSettings.DefLanguageId, LocaleId: appScope.tgSettings.DefLocaleId, ClientID: $("#partnerId").val(), Criteria: (request.term == "-1" ? "" : request.term), LanguageISOLetter: appScope.tgSettings.LanguageISOLetter, PageSize: window.pageSize, PageIndex: this.pageIndex
                    });
                    $autoinput.autocomplete("option", "minLength", 0);

                    $.ajax({
                        url: "/GQWeb/GetAutoCompleteResults?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val(),
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
                                    var inputVal = (typeof $("#profile_9_0_mbcountry_slt_0_0-input").val() != "undefined") ? $("#profile_9_0_mbcountry_slt_0_0-input").val().trim() : '';
                                    if (inputVal == $(val).text().trim()) {
                                        opts += "<option value='" + $(val).attr("value").replace(/'/g, "&#39;") + "' selected='selected'>" + $(val).text() + "</option>";
                                    }
                                });
                            }
                            $.each(data.results, function (i, val) {

                                if ($("#" + ss + " option[value='" + val.code.replace(/'/g, "&#39;") + "']:selected").length == 0) {
                                    opts += "<option value='" + val.code.replace(/'/g, "&#39;") + "' >" + val.description + "</option>";
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
            });
            $autoinput.blur(function () {
                if (!$autoinput[0].attributes.hasOwnProperty("multiselect") && $autoinput.val() == "") {
                    $('#' + ss).find('option').remove().end();
                }
                //$autoinput.attr("placeholder", msgs.msgplaceholder);
                $autoinput.autocomplete("option", "minLength", 1);
            });

        },



        turnOnSMS: function (fromEditMode) {
            $scope.smsErrormsgs = [];
            $scope.fromEditMode = fromEditMode;
            $scope.editTextMessagingSettings = true;
            $scope.SMSConsentInfo.SMSTurnedOn = true;
            $scope.SMSConsentInfo.InitialMobileCountryCode = $scope.SMSConsentInfo.MobileCountryCode;
            $scope.SMSConsentInfo.InitialMobileCountry = $scope.SMSConsentInfo.MobileCountry;
            $scope.SMSConsentInfo.InitialCountryCode = $scope.SMSConsentInfo.CountryCode;
            $scope.SMSConsentInfo.InitialMobilePhoneNumber = $scope.SMSConsentInfo.MobilePhoneNumber;

            setTimeout(function () {
                var msgs = eval('(' + $("#SMSValidationMessages").val() + ')');

                $.validator.addMethod("phoneformat", function (value, element, param) {
                    return (value == "" || value.match(/^(?:\+?\(?\d+)(?:[0-9]|[-,. ()+])+\d+$/) ? true : false);
                }, msgs.msgvalidphone);

                jQuery.extend(jQuery.validator.messages, {
                    required: msgs.msgrequired,
                    number: msgs.msgnumber
                });

                $('#smsForm').validate({
                    rules: {
                        country: { required: true },
                        cellphone: { phoneformat: true, required: true }
                    },
                    errorClass: 'contactError',
                    validClass: 'success',
                    errorElement: 'span',
                    onfocusout: false,
                    highlight: function (element, errorClass, validClass) {
                        $(element).closest(".fieldcontain").addClass("invalid");
                        $(element).attr("aria-invalid", "true");
                    },
                    unhighlight: function (element, errorClass, validClass) {
                        var $parentElem = $(element).removeAttr("aria-describedby").closest(".fieldcontain");
                        $parentElem.removeClass("invalid");
                        $(element).removeAttr("aria-invalid");
                    },
                    errorPlacement: function (error, element) {
                        error.insertAfter(element.closest(".fieldcontain").children().last());
                    },
                    invalidHandler: function (form, validator) {
                        var validerrors = validator.numberOfInvalids();

                        if (validerrors) {

                            $scope.smsErrormsgs = [];
                            if (validator.errorList.length > 0) {
                                var fobj, fcontainer, $errorLabel, $errorSpan, $control;
                                for (x = 0; x < validator.errorList.length; x++) {
                                    $control = $(validator.errorList[x].element);
                                    fcontainer = $control.closest(".fieldcontain");
                                    if (fcontainer.length > 0) {
                                        fobj = $control.prev().is("label") ? $control.prev() : fcontainer.find("label").first();
                                        $scope.smsErrormsgs.push({ label: $.trim(fobj.text().replace("*", "").replace("Click for tool tip.", "")), error: validator.errorList[x].message, field: $control.attr("name") });
                                    }
                                }
                            }

                        }
                    }
                });
                $scope.adjustTSHeight();
            }, 0);

            $(document).on("focus", ".ui-complete", $scope.createFormAutocomplete);
        },

        turnOffSMS: function (updateInServer) {
            $scope.editTextMessagingSettings = false;
            $scope.SMSConsentInfo.MobileCountryCode = $scope.SMSConsentInfo.InitialMobileCountryCode;
            $scope.SMSConsentInfo.MobileCountry = $scope.SMSConsentInfo.InitialMobileCountry;
            $scope.SMSConsentInfo.CountryCode = $scope.SMSConsentInfo.InitialCountryCode;
            $scope.SMSConsentInfo.MobilePhoneNumber = $scope.SMSConsentInfo.InitialMobilePhoneNumber;


            $scope.SMSConsentInfo.SMSTurnedOn = false;
            //Write an ajax call to update profile XML with SMS Turned Off...
            if ((typeof updateInServer == "undefined" || (typeof updateInServer != "undefined" && updateInServer)) && $scope.fromEditMode) {
                $scope.updateSMSSettings();
            }
        },

        cancelSMS: function () {
            if ($scope.fromEditMode) {
                $scope.SMSConsentInfo.MobileCountryCode = $scope.SMSConsentInfo.InitialMobileCountryCode;
                $scope.SMSConsentInfo.MobileCountry = $scope.SMSConsentInfo.InitialMobileCountry;
                $scope.SMSConsentInfo.CountryCode = $scope.SMSConsentInfo.InitialCountryCode;
                $scope.SMSConsentInfo.MobilePhoneNumber = $scope.SMSConsentInfo.InitialMobilePhoneNumber;
                $scope.editTextMessagingSettings = false;
            }
            else {
                $scope.turnOffSMS(false);
            }
        },

        validateAndUpdateSMSSettings: function () {
            var countryInputElement = $("#profile_9_0_mbcountry_slt_0_0-input");
            var validTerm = true;
            if (typeof countryInputElement.data() != "undefined" && countryInputElement.data() != null && countryInputElement.data().uiAutocomplete != null && typeof countryInputElement.data().uiAutocomplete != "undefined") {
                var countryAutoCompleteObj = countryInputElement.data().uiAutocomplete;
                validTerm = (typeof countryAutoCompleteObj.selectedItem != "undefined" && countryAutoCompleteObj.selectedItem != null) ? countryAutoCompleteObj.term == countryAutoCompleteObj.selectedItem.label : (countryAutoCompleteObj.term != "" && countryAutoCompleteObj.term == $scope.SMSConsentInfo.InitialMobileCountry);
            }

            if (!validTerm || $scope.SMSConsentInfo.MobileCountryCode == "+" || $scope.SMSConsentInfo.MobileCountryCode == "") {
                countryInputElement.val('');
            }
            if (!$('#smsForm').valid())
                return false;
            $scope.smsErrormsgs = [];
            $scope.updateSMSSettings();

        },

        openSMSConsentPopUp: function () {

            setTimeout(function () {
                ngDialog.open({
                    preCloseCallback: function (value) {
                    },
                    template: 'SMSMessagingCandConsentPopupMsg', scope: $scope, className: 'ngdialog-theme-default SMSMessagingCandConsentPopup customDialogue', showClose: true, closeByDocument: false, ariaRole: "dialog", appendTo: "#dialogContainer"
                });
            }, 0);
        },

        updateSMSSettings: function () {
            angular.element("#UpdateSMSSettings").scope().oActiveLaddaButton.start();
            var request = {};
            request.SMSConsent = $scope.SMSConsentInfo;
            request.ClientId = $("#partnerId").val();
            request.SiteId = $("#siteId").val();
            request.SessionId = $("#CookieValue").val();
            $.ajax({
                success: function (data, status, jqxhr) {
                    if (data.Success == true) {
                        $scope.editTextMessagingSettings = false;
                    }
                    else {
                        $('#smsForm').valid();
                    }
                },
                contentType: 'application/json',
                data: JSON.stringify(request),
                error: function (jqxhr, status, error) {
                    angular.element("#UpdateSMSSettings").scope().oActiveLaddaButton.stop();
                },
                url: '/TgNewUI/CandidateZone/Ajax/UpdateSMSSettings',
                type: 'POST'
            });
        },

        promptGoogleLogout: function (googleLoggedIn) {

            $scope.googleLoggedIn = googleLoggedIn;
        },

        setEduExpValidator: function (formSelector) {
            $(formSelector).validate({
                errorClass: 'error',
                validClass: 'success',
                errorElement: 'span',
                onfocusout: false,
                highlight: function (element, errorClass, validClass) {
                    $(element).closest(".fieldcontain").addClass("invalid");
                    $(element).attr("aria-invalid", "true");
                },
                unhighlight: function (element, errorClass, validClass) {
                    var $parentElem = $(element).removeAttr("aria-describedby").closest(".fieldcontain");
                    $parentElem.removeClass("invalid");
                    $(element).removeAttr("aria-invalid");
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element.closest(".fieldcontain").children().last());
                },
                invalidHandler: function (form, validator) {
                    var validerrors = validator.numberOfInvalids();
                    var eduExp = form.target.id == "editEduForm" ? "edu" : "exp";
                    var labelPrefix = form.target.id == "editEduForm" ? $scope.dynamicStrings.Education_History : $scope.dynamicStrings.Work_Experience;
                    var oldErrors = _.filter($scope.editEduExpErrormsgs, function (o) { return o.form != eduExp; });
                    var newErrors = [];

                    if (validerrors) {
                        if (validator.errorList.length > 0) {
                            var fobj, fcontainer, $errorLabel, $errorSpan, $control, ulcontainer;
                            for (x = 0; x < validator.errorList.length; x++) {
                                $control = $(validator.errorList[x].element);
                                fcontainer = $control.closest(".fieldcontain");
                                ulcontainer = $control.closest("ul");
                                var idx;
                                if (ulcontainer.length > 0) {
                                    $.each(ulcontainer.attr('class').split(/\s+/), function () {
                                        if (this.length == 4 && (this.startsWith("edu") || this.startsWith("exp")))
                                            idx = parseInt(this.substring(3, 4)) + 1;
                                    });
                                }

                                if (fcontainer.length > 0) {
                                    fobj = $control.prev().is("label") ? $control.prev() : fcontainer.find("label").first();
                                    newErrors.push({ form: eduExp, label: labelPrefix + " " + idx + ": " + $.trim(fobj.text().replace("*", "").replace("Click for tool tip.", "")), error: validator.errorList[x].message, field: $control.attr("name") });
                                }
                            }
                        }

                    }

                    if (eduExp == "edu") {
                        $scope.editEduExpErrormsgs = newErrors.concat(oldErrors);
                    } else {
                        $scope.editEduExpErrormsgs = oldErrors.concat(newErrors);
                    }
                }
            });
        },

        hasRequiredFields: function () {
            return !!$('.requiredFieldIndicator').not(".requiredFieldsDescription span").length;
        },

        isProfileFieldHidden: function (fieldId) {
            var field = $.grep($scope.ProfileFields, function (e) { return e.Id == fieldId; });
            if (field.length > 0 && field[0].hide == "1")
                return true;
            else
                return false;
        },

        isProfileFieldReadOnly: function (fieldId) {
            var field = $.grep($scope.ProfileFields, function (e) { return e.Id == fieldId; });
            if (field.length > 0 && field[0].ReadOnly == "1")
                return true;
            else
                return false;
        },

        getProfileFieldLabel: function (fieldId) {
            var field = $.grep($scope.ProfileFields, function (e) { return e.Id == fieldId; });
            if (field.length > 0)
                return field[0].Label;
            else
                return "";
        },

        enterProfileEditMode: function (mode, fromEmptyProfile) {
            ngDialog.closeAll();
            $scope.editProfileErrormsgs = [];

            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            if (mode) {
                $scope.returnToEmptyProfile = fromEmptyProfile;
                $scope.hasProfileDetails = true;
                if (fromEmptyProfile) {
                    $scope.ProfileCountryInputCode = $scope.tgSettings.DefCountryId;
                    $scope.ProfileCountryInputName = $scope.tgSettings.DefCountryName;
                } else {
                    $scope.ProfileCountryInputCode = $scope.ProfileCountryCode;
                    $scope.ProfileCountryInputName = $scope.ProfileCountryName;
                }
            }
            else {
                if (!($scope.ProfileFirstName || $scope.ProfileLastName))
                    $scope.hasProfileDetails = !$scope.returnToEmptyProfile;
            }
            $timeout(function () {
                $scope.bEditProfileEditMode = mode;
            })

            initFormsMethods();
            $scope.scrolltop();
            $scope.CallApply();

            if (mode) {
                _.delay(function () {
                    $('#profile_9_0_country_slt_0_0-input').autocomplete({
                        change: function (event, ui) {
                            if (this.value == '') {
                                var $stateSelector = $(document.querySelector('.profile select[id*="_state_"]'));
                                var $stateClearbtn = $("#" + $stateSelector.attr("name") + "-input").parent().find("a");
                                $("#" + $stateSelector.attr("name") + "-input").val("");
                                $stateSelector.find("option:selected").each(function () { $(this).removeAttr("selected"); $(this).prop("selected", false); });
                                $stateClearbtn.removeClass("icon-remove");
                            }
                        }
                    });
                    $('#editProfileForm').validate({
                        rules: {
                            firstname: { nameformat: true, required: $scope.profileRequiredFields.indexOf('1') > -1 },
                            middlename: { nameformat: true, required: $scope.profileRequiredFields.indexOf('2') > -1 },
                            lastname: { nameformat: true, required: $scope.profileRequiredFields.indexOf('3') > -1 },
                            email: { emailformat: true, required: $scope.profileRequiredFields.indexOf('4') > -1 },
                            address1: { nohtml: true, required: $scope.profileRequiredFields.indexOf('5') > -1 },
                            address2: { nohtml: true, required: $scope.profileRequiredFields.indexOf('6') > -1 },
                            city: { required: $scope.profileRequiredFields.indexOf('7') > -1 },
                            zip: { zipformat: true, required: $scope.profileRequiredFields.indexOf('8') > -1 },
                            country: { required: $scope.profileRequiredFields.indexOf('9') > -1 },
                            state: { required: $scope.profileRequiredFields.indexOf('10') > -1 },
                            homephone: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('11') > -1 },
                            workphone: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('12') > -1 },
                            cellphone: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('13') > -1 },
                            fax: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('14') > -1 },
                            webaddress: { urlformat: true, required: $scope.profileRequiredFields.indexOf('15') > -1 },
                            lnpronouncekey: { nohtml: true, required: $scope.profileRequiredFields.indexOf('16') > -1 },
                            fnpronouncekey: { nohtml: true, required: $scope.profileRequiredFields.indexOf('17') > -1 },
                            stacking: { required: $scope.profileRequiredFields.indexOf('18') > -1, customvalidation: true }
                        },
                        messages: { stacking: { customvalidation: $scope.stackingErrorMessage } },
                        errorClass: 'contactError',
                        validClass: 'success',
                        errorElement: 'span',
                        onfocusout: false,
                        highlight: function (element, errorClass, validClass) {
                            $(element).closest(".fieldcontain").addClass("invalid");
                            $(element).attr("aria-invalid", "true");
                        },
                        unhighlight: function (element, errorClass, validClass) {
                            var $parentElem = $(element).removeAttr("aria-describedby").closest(".fieldcontain");
                            $parentElem.removeClass("invalid");
                            $(element).removeAttr("aria-invalid");
                        },
                        errorPlacement: function (error, element) {
                            error.insertAfter(element.closest(".fieldcontain").children().last());
                        },
                        invalidHandler: function (form, validator) {
                            var validerrors = validator.numberOfInvalids();

                            if (validerrors) {

                                $scope.editProfileErrormsgs = [];
                                if (validator.errorList.length > 0) {
                                    var fobj, fcontainer, $errorLabel, $errorSpan, $control;
                                    for (x = 0; x < validator.errorList.length; x++) {
                                        $control = $(validator.errorList[x].element);
                                        fcontainer = $control.closest(".fieldcontain");
                                        if (fcontainer.length > 0) {
                                            fobj = $control.prev().is("label") ? $control.prev() : fcontainer.find("label").first();
                                            $scope.editProfileErrormsgs.push({ label: $scope.dynamicStrings.Contact_Information + ": " + $.trim(fobj.text().replace("*", "").replace("Click for tool tip.", "")), error: validator.errorList[x].message, field: $control.attr("name") });
                                        }
                                    }
                                }

                            }
                        }
                    });
                }, 100);
            }
        },

        uploadServices: function (calledFrom, AttachmentCat) {
            if (this.wbpreview == "true" || this.wbpagepreview == "true") {
                return;
            }

            var title = '';
            if (calledFrom == "profile") {
                title = $scope.dynamicStrings.CreateProfile;
            }
            else if (calledFrom == "resume") {
                title = $scope.dynamicStrings.Heading_AddResume;
            }
            else if (calledFrom == "coverletter") {
                title = $scope.dynamicStrings.Heading_AddCoverLetter;
            }
            else if (calledFrom == "Attachments" && typeof AttachmentCat != "undefined") {
                var indexOfDot = AttachmentCat.indexOf(".");
                title = $scope.dynamicStrings.Title_Attachments.replace("[Category]", AttachmentCat.substr(indexOfDot + 1).replace("'", "&apos;"));
            }

            ngDialog.open({

                preCloseCallback: function (value) {
                    var $iframe = $("#profileBuilder"),
                         frameWindow = $iframe.prop("contentWindow");

                    if (frameWindow != undefined) {
                        frameWindow.blur();
                        document.body.focus();
                        $iframe.remove();
                    }
                },
                template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='" + title + "' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&calledFrom=" + calledFrom + "&AttachmentCat=" + encodeURI(AttachmentCat) + "&NoOfAttachments=" + $scope.NoOfAttachments + "' tabindex='0'> </iframe>",
                //template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='Profile Builder' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&calledFrom=addfile&FileType=" + fileType + "&AttachmentCat=" + encodeURI(AttachmentCat) + "' tabindex='0'> </iframe>",
                //template: "<iframe 'scrolling=no' allowtransparency='true' id='profileBuilder' height='100%' width='100%' src='../../Profile/Home/ProfileBuilder?partnerId=11713&siteId=6786&encryptedSessionId=^BtwhqVBm/UVWG7f3Yjw2svJgCnSNA7NnRySV08WQSKEMqjVi4dGlZOfwUvw3D1DAm0qvkLv1x0jm0EGxpdnWSUPzOpPqOkVUC6XEjJ3En18='></iframe>",
                plain: true,
                className: 'ngdialog-theme-default dialogWithIFrame',
                showClose: false,
                appendTo: "#dialogContainer",
                closeByDocument: false
            });
        },

        noThanks: function (googleLoggedIn) {
            $('#AttachementCatagory').val('');
            $("#AttachementCatagory-button").children("span.ui-selectmenu-text").text(appScope.dynamicStrings.PlaceHolder_Choose);
            //By default focus will be reset to current Active Element on parent window. 
            //if the TG hosted on iframe, the focus will be just on parent window.
            if (window.location == window.parent.location) {
                window.parent.$.restoreFocus();
            }
            ngDialog.closeAll();
            if (googleLoggedIn == "googledrive") {
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $.restoreFocus();
                    },
                    template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                });
            }
        },

        GoogleLogOut: function () {
            $scope.googleLoggedIn = "";
            win = window.open("https://www.google.com/accounts/Logout", "something", "width=550,height=570");
            setTimeout("win.close();", 3000);
            parent.$.restoreFocus();
            ngDialog.closeAll();
            if ($scope.SubmitAfterGoogleLogout) {
                $scope.SubmitAfterGoogleLogout = !$scope.SubmitAfterGoogleLogout;
                page.showSuccessMessage = true;
            }
        },

        noThanksGoogleOut: function () {
            parent.$.restoreFocus();
            ngDialog.closeAll();
            if ($scope.SubmitAfterGoogleLogout) {
                $scope.SubmitAfterGoogleLogout = !$scope.SubmitAfterGoogleLogout;
                page.showSuccessMessage = true;
            }

        },

        addRemoveEducation: function (mode, $index, $event, confirmed) {
            if (mode == "add") {
                if (!this.education)
                    this.education = [];

                this.education.unshift(_.assign({ updateMode: true }, this.educationDetails));
                $timeout(function () {
                    $("html,body").animate({ scrollTop: $(".edu0").offset().top - 50 }, 500);
                });

                _.delay(function () {
                    $scope.setEduExpValidator('#editEduForm');
                });
            }
            else {
                if (!confirmed) {

                    this.openProfileWarningDialog($index, 'edu', $event, this);
                }
                else {
                    this.education.splice($index, 1);
                    this.submitEducationExperience();
                    if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                        setTimeout(function () { $("#addEdu").focus(); })
                    }
                    else {
                        setTimeout(function () { $($event.target).focus(); })
                    }
                }
            }
            $scope.education = this.education;
        },
        addRemoveExperience: function (mode, $index, $event, confirmed) {

            if (mode == "add") {
                if (!this.experience)
                    this.experience = [];

                this.experience.unshift(_.assign({ updateMode: true }, this.experienceDetails));
                $timeout(function () {
                    $("html,body").animate({ scrollTop: $(".exp0").offset().top - 50 }, 500);
                });

                _.delay(function () {
                    $scope.setEduExpValidator('#editExpForm');
                });
            }
            else {
                if (!confirmed) {

                    this.openProfileWarningDialog($index, 'exp', $event, this);
                }
                else {
                    this.experience.splice($index, 1);
                    this.submitEducationExperience();
                    if ($("#addExp") != undefined && $("#addExp").length > 0) {
                        setTimeout(function () { $("#addExp").focus(); })
                    }
                    else {
                        setTimeout(function () { $($event.target).focus(); })
                    }

                }
                $scope.experience = this.experience;
            }
        },

        openProfileWarningDialog: function ($index, mode, $event, scope) {
            ngDialog.open({
                template: mode + "ProfileRemoveTemplate",
                className: "ngdialog-theme-default profileWarningDialog",
                scope: scope,
                controller: ['$scope', function ($scope) {
                    $scope.mode = mode;
                    $scope.currentProfileIndex = $index;
                    $scope.scope = scope;
                    $scope.removeProfileData = function () {
                        if ($scope.mode == "edu") {
                            $scope.scope.addRemoveEducation('remove', $scope.currentProfileIndex, $event, true)
                        }
                        else {
                            $scope.scope.addRemoveExperience('remove', $scope.currentProfileIndex, $event, true)

                        }
                        $scope.cancelDialog($scope.mode);
                    }
                    $scope.cancelDialog = function (mode) {
                        ngDialog.closeAll();
                        if (mode == "edu" && $("#addEdu") != undefined && $("#addEdu").length > 0) {
                            $("#addEdu").focus();
                        }
                        else if (mode == "exp" && $("#addExp") != undefined && $("#addExp").length > 0) {
                            $("#addEdu").focus();
                        }
                        else {
                            $($event.target).focus();
                        }
                    }

                }]

            });

        },

        saveEducation: function ($index, validateOnly) {
            var validEdu = true;
            var invalidElement;

            $(".edu" + $index + " input").each(function (i, e) {
                if (!$(e).valid()) {
                    validEdu = false;
                    if (!invalidElement) {
                        invalidElement = $(e);
                    }
                }

            });
            $('#editEduForm').valid();
            if (validEdu && !validateOnly) {
                this.education[$index].updateMode = false;
                this.education[$index].Saved = true;
                $.htmlEncodeSpecial(this.education[$index]);
                for (var k in this.education[$index]) {
                    if (typeof this.educationDetails[k] != "undefined") {
                        this.education[$index][k + "_default"] = this.education[$index][k];
                    }
                }

                this.education[$index].IsSchoolModified = false;
                this.education[$index].IsDegreeModified = false;
                this.submitEducationExperience();
                $timeout(function () { $("html,body").animate({ scrollTop: $(".edu0").offset().top - 50 }, 500); });
                if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                    setTimeout(function () {
                        $("#addEdu").focus();
                    })
                }
                else {
                    setTimeout(function () { $("#updateEdu" + $index).focus(); })
                }
            }
            else {
                $("html,body").animate({ scrollTop: invalidElement.offset().top - 100 }, 500);
                invalidElement.valid();
                invalidElement.focus();
            }
        },
        updateEducation: function ($index, $event) {
            this.education[$index].updateMode = true;
            $.htmlDecodeSpecial(this.education[$index]);
            if (this.education[$index].Saved == null) {
                for (var k in this.education[$index]) {
                    if (typeof this.educationDetails[k] != "undefined") {
                        this.education[$index][k + "_default"] = this.education[$index][k];
                    }

                }
            }
            if ($event)
                $($event.target).closest(".widgetinner").setFocus();
            _.delay(function () {
                $scope.setEduExpValidator('#editEduForm');
            });
        },
        updateSchoolModified: function ($index) {
            this.education[$index].IsSchoolModified = true;
            $("#education_" + $index + "_0_schoolname_slt_0-hidden").val("");
        },
        updateDegreeModified: function ($index) {
            this.education[$index].IsDegreeModified = true;
            $("#education_" + $index + "_0_degree_slt_0-hidden").val("");
        },
        cancelEducation: function ($index) {
            if (!this.education[$index].Saved && this.education[$index].Saved != null) {
                this.education.splice($index, 1);
            }
            else {
                this.education[$index].updateMode = false;
                for (var k in this.education[$index]) {
                    if (typeof this.educationDetails[k] != "undefined") {
                        this.education[$index][k] = this.education[$index][k + "_default"];
                    }

                }
            }
            if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                setTimeout(function () { $("#addEdu").focus(); })
            }
            else {
                setTimeout(function () { $("#updateEdu" + $index).focus(); })
            }
            //Error span is persisting to display in view mode even when we click cancel
            //Not sure why this is happening hence fixing alternately by removing this once cancel is clicked in education section
            $("span.error[for = gradyear" + $index + "]", "#editEduForm").remove();
            removeInvalidClass($(".edu" + $index));
            $scope.editEduExpErrormsgs = _.filter($scope.editEduExpErrormsgs, function (o) { return o.form == "exp" || !o.field.endsWith($index); });
        },
        saveExperience: function ($index, validateOnly) {
            var validExp = true;
            var invalidElement;

            $(".exp" + $index + " input,.exp" + $index + " textarea").each(function (i, e) {
                if (!$(e).valid()) {
                    validExp = false;
                    if (!invalidElement) {
                        invalidElement = $(e);
                    }
                }
            });
            $('#editExpForm').valid();
            if (validExp && !validateOnly) {
                this.experience[$index].updateMode = false;
                this.experience[$index].Saved = true;
                $.htmlEncodeSpecial(this.experience[$index]);
                for (var k in this.experience[$index]) {
                    if (typeof this.experienceDetails[k] != "undefined") {
                        this.experience[$index][k + "_default"] = this.experience[$index][k];
                    }

                }
                this.submitEducationExperience();
                $timeout(function () { $("html,body").animate({ scrollTop: $(".exp0").offset().top - 50 }, 500); });
                if ($("#addExp") != undefined && $("#addExp").length > 0) {
                    setTimeout(function () { $("#addExp").focus(); })
                }
                else {
                    setTimeout(function () { $("#updateExp" + $index).focus(); })
                }
            }
            else {
                $("html,body").animate({ scrollTop: invalidElement.offset().top - 100 }, 500);
                invalidElement.valid();
                invalidElement.focus();

            }
        },
        validateEndYear: function (event) {
            var endYear = event.target;
            $(endYear).valid();
        },
        updateExperience: function ($index, $event) {
            this.experience[$index].updateMode = true;
            $.htmlDecodeSpecial(this.experience[$index]);
            if (this.experience[$index].Saved == null) {
                for (var k in this.experience[$index]) {
                    if (typeof this.experienceDetails[k] != "undefined") {
                        this.experience[$index][k + "_default"] = this.experience[$index][k];
                    }

                }
            }
            _.delay(function () {
                $scope.setEduExpValidator('#editExpForm');
            });
            if ($event)
                $($event.target).closest(".widgetinner").setFocus();
        },
        cancelExperience: function ($index) {
            if (!this.experience[$index].Saved && this.experience[$index].Saved != null) {
                this.experience.splice($index, 1);
            }
            else {
                this.experience[$index].updateMode = false;
                for (var k in this.experience[$index]) {
                    if (typeof this.experienceDetails[k] != "undefined") {
                        this.experience[$index][k] = this.experience[$index][k + "_default"];
                    }

                }

            }
            if ($("#addExp") != undefined && $("#addExp").length > 0) {
                setTimeout(function () { $("#addExp").focus(); })
            }
            else {
                setTimeout(function () { $("#updateExp" + $index).focus(); })
            }
            removeInvalidClass($(".exp" + $index));
            $scope.editEduExpErrormsgs = _.filter($scope.editEduExpErrormsgs, function (o) { return o.form == "edu" || !o.field.endsWith($index); });
        },

        showMostRecent: function (mode, $index) {
            var recordIndex = -1;

            if (mode == "edu") {
                recordIndex = _.findIndex(this.education, function (n) {
                    return n.MostRecent == 1 || n.MostRecent;
                });

            }
            else {
                recordIndex = _.findIndex(this.experience, function (n) {
                    return n.MostRecent == 1 || n.MostRecent;
                });

            }
            return recordIndex == -1 || recordIndex == $index;
        },

        blanketSearch: function (e) {
            var $target = $(e.target),
                $input = ($target.is("input") ? $target : $target.siblings("input")),
                oAuto;

            if (!$input.is(":focus"))
                $input.focus();

            _.delay(function () {
                //wait for autcomplete widget creation
                oAuto = $input.data().uiAutocomplete;

                if (oAuto == undefined)
                    oAuto = $target.prevAll("input:visible").data().uiAutocomplete;

                if ($target.is(".icon-remove")) {
                    $input.val("");
                    return;
                }


                if (oAuto) {
                    var nMilisecondsSincedClosed = new Date() - oAuto.lastClosedTime,
                        bMenuWasOpen = nMilisecondsSincedClosed < 200;

                    if (bMenuWasOpen) {
                        //menu was open but has closed based on second click of the show menu button or similar keyboard action
                        //nothing more to do
                        return;
                    } else {
                        //otherwise blanket search
                        oAuto.pageIndex = 0;
                        oAuto.requestIndex = 0;
                        oAuto.search("-1");
                    }
                }

            });
        },

        submitEditProfileForm: function (editProfileForm, scope) {
            var editProfileRequest = {};
            if ($('#profile_9_0_country_slt_0_0-input')) {
                if (typeof $('#profile_9_0_country_slt_0_0-input').val() != "undefined" && typeof $('#profile_9_0_country_slt_0_0 option:selected').text() != "undefined" && $('#profile_9_0_country_slt_0_0 option:selected').text().trim() == $('#profile_9_0_country_slt_0_0-input').val().trim()) {
                    editProfileRequest.Country = $('#profile_9_0_country_slt_0_0-input').val();
                    if (editProfileRequest.Country != '') {
                        editProfileRequest.CountryCode = $('#profile_9_0_country_slt_0_0').val();
                    } else {
                        editProfileRequest.CountryCode = '';
                    }
                }
                else {
                    $('#profile_9_0_country_slt_0_0-input').val('');
                    $('#profile_9_0_country_slt_0_0').val('');
                    editProfileRequest.Country = '';
                    editProfileRequest.CountryCode = '';
                }
            }
            if ($('#profile_10_0_state_slt_0_0-input')) {
                if (typeof $('#profile_10_0_state_slt_0_0-input').val() != "undefined" && typeof $('#profile_10_0_state_slt_0_0 option:selected').text() != "undefined" && $('#profile_10_0_state_slt_0_0 option:selected').text().trim() == $('#profile_10_0_state_slt_0_0-input').val().trim()) {
                    editProfileRequest.State = $('#profile_10_0_state_slt_0_0-input').val();
                    if (editProfileRequest.State != '') {
                        editProfileRequest.StateCode = $('#profile_10_0_state_slt_0_0').val();
                    } else {
                        editProfileRequest.StateCode = '';
                    }
                }
                else {
                    $('#profile_10_0_state_slt_0_0-input').val('');
                    $('#profile_10_0_state_slt_0_0').val('');
                    editProfileRequest.State = '';
                    editProfileRequest.StateCode = '';
                }

            }
            if (!$('#editProfileForm').valid())
                return false;


            if (editProfileForm.firstname)
                editProfileRequest.FirstName = editProfileForm.firstname.$modelValue;
            if (editProfileForm.middlename)
                editProfileRequest.MiddleName = editProfileForm.middlename.$modelValue;
            if (editProfileForm.lastname)
                editProfileRequest.LastName = editProfileForm.lastname.$modelValue;
            if (editProfileForm.address1)
                editProfileRequest.Address1 = editProfileForm.address1.$modelValue;
            if (editProfileForm.address2)
                editProfileRequest.Address2 = editProfileForm.address2.$modelValue;
            if (editProfileForm.city)
                editProfileRequest.City = editProfileForm.city.$modelValue;


            if (editProfileForm.zip)
                editProfileRequest.Zip = editProfileForm.zip.$modelValue;
            if (editProfileForm.homephone)
                editProfileRequest.HomePhone = editProfileForm.homephone.$modelValue;
            if (editProfileForm.workphone)
                editProfileRequest.WorkPhone = editProfileForm.workphone.$modelValue;
            if (editProfileForm.fax)
                editProfileRequest.Fax = editProfileForm.fax.$modelValue;
            if (editProfileForm.cellphone)
                editProfileRequest.CellPhone = editProfileForm.cellphone.$modelValue;
            if (editProfileForm.email)
                editProfileRequest.email = editProfileForm.email.$modelValue;
            if (editProfileForm.webaddress)
                editProfileRequest.WebAddress = editProfileForm.webaddress.$modelValue;
            if (editProfileForm.lnpronouncekey)
                editProfileRequest.LNPronunKey = editProfileForm.lnpronouncekey.$modelValue;
            if (editProfileForm.fnpronouncekey)
                editProfileRequest.FNPronunKey = editProfileForm.fnpronouncekey.$modelValue;
            if (editProfileForm.stacking)
                editProfileRequest.CandidateStacking = editProfileForm.stacking.$modelValue;
            else if ($scope.stackingType == 'date')
                editProfileRequest.CandidateStacking = $scope.ProfileCandStackField;

            editProfileRequest.Education = $scope.education;
            editProfileRequest.Experience = $scope.experience;

            editProfileRequest.PartnerId = $("#partnerId").val();
            editProfileRequest.SiteId = $("#siteId").val();
            editProfileRequest.EncryptedSessionId = $("#CookieValue").val();
            $scope.scope = this;
            url = '/TgNewUI/CandidateZone/Ajax/SaveEditProfileChanges';
            $http.post(url, editProfileRequest).success(function (result) {
                $scope.ProfileDetails.FirstName = editProfileForm.firstname.$modelValue;
                $scope.ProfileDetails.LastName = editProfileForm.lastname.$modelValue;
                $scope.ProfileDetails.email = editProfileRequest.email;
                $scope.ProfileCountryCode = editProfileRequest.CountryCode;
                $scope.ProfileCountryName = editProfileRequest.CountryName;

                $scope.editProfileView();
            });
        },

        submitEducationExperience: function () {

            var editProfileRequest = {};
            editProfileRequest.FirstName = $scope.ProfileFirstName;
            editProfileRequest.MiddleName = $scope.ProfileMiddleName;
            editProfileRequest.LastName = $scope.ProfileLastName;
            editProfileRequest.Address1 = $scope.ProfileAddress1;
            editProfileRequest.Address2 = $scope.ProfileAddress2;
            editProfileRequest.Zip = $scope.ProfileZip;
            editProfileRequest.HomePhone = $scope.ProfileHomePhone;
            editProfileRequest.WorkPhone = $scope.ProfileWorkPhone;
            editProfileRequest.Fax = $scope.ProfileFax;
            editProfileRequest.CellPhone = $scope.ProfileCellPhone;
            editProfileRequest.WebAddress = $scope.ProfileWebAddress;

            editProfileRequest.City = $scope.ProfileCity;
            editProfileRequest.email = $scope.ProfileEmailAddress;
            editProfileRequest.LNPronunKey = $scope.ProfileLNPronunKey;
            editProfileRequest.FNPronunKey = $scope.ProfileFNPronunKey;
            editProfileRequest.CandidateStacking = $scope.ProfileCandStackField;
            editProfileRequest.State = $scope.ProfileFullState;
            editProfileRequest.StateCode = $scope.ProfileState;
            editProfileRequest.Country = $scope.ProfileCountryName;
            editProfileRequest.CountryCode = $scope.ProfileCountryCode;

            editProfileRequest.Education = $scope.education;
            editProfileRequest.Experience = $scope.experience;

            editProfileRequest.PartnerId = $("#partnerId").val();
            editProfileRequest.SiteId = $("#siteId").val();
            editProfileRequest.EncryptedSessionId = $("#CookieValue").val();
            $scope.scope = this;
            url = '/TgNewUI/CandidateZone/Ajax/SaveEditProfileChanges';
            $http.post(url, editProfileRequest);

        },

        moveToNextPage: function (redirectUrl, event, calledFrom) {
            if (calledFrom == 'JobCart') {
                $scope.ViewJobCartAjax();
            }
            else {
                if (redirectUrl.indexOf("SocialNetworkReferral") > -1) {
                    SocialNetworkReferral(this, event);
                } else if (redirectUrl.indexOf("TGSocialNetworking.aspx") > -1) {
                    window.open(redirectUrl, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                } else {
                    window.location = redirectUrl;
                }
            }


        },
        CallCollapse: function (Class1, Class2) {
            if ($scope[Class1] && $("div." + Class1).css("display", "none")) {
                $scope.Collapse(Class1)
            }
            if ($scope[Class2] && $("div." + Class2).css("display", "none")) {
                $scope.Collapse(Class2)
            }
        },
        CollapseSection: function (myclass) {
            $scope[myclass] = !$scope[myclass];
            if (!$scope.utils.isNewHash($location.hash(), $scope))
                $scope.utils.updateHistory($location.hash());
            $scope.Collapse(myclass);
        },
        Collapse: function (myclass) {
            if ($("div." + myclass).length == 0) {
                myclass = "Empty" + myclass;
            }
            $("div." + myclass).slideToggle("slow", function () {
                if ($(this).is(':visible')) {
                    $(this).css('display', 'inline-block');
                    $scope.alignCards(myclass, "jobCard");
                }
            });

            $("." + myclass + " .jobCard").css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');
            if (myclass == 'ActiveReferrals' || myclass == 'SentReferrals') {
                $scope.$root.utils.ellipsis();
            }
            else {
                setTimeout(function () { $scope.adjustTSHeight(); $.pinToFold }, 0);
            }
        },
        CollapseReferrals: function (myclass) {
            if ($("div." + myclass).length == 0)
                myclass = "Empty" + myclass;


            $("div." + myclass).slideToggle("slow", function () {
                if ($(this).is(':visible')) {
                    $(this).css('display', 'inline-block');
                    $scope.alignCards(myclass, "jobCard");
                }

                (myclass == 'ActiveReferrals' || myclass == 'EmptyActiveReferrals') ? ($("#ActiveReferralArrow").hasClass('fa-chevron-down') ? $("#ActiveReferralArrow").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#ActiveReferralArrow").removeClass('fa-chevron-up').addClass('fa-chevron-down')) : ($("#SentReferralArrow").hasClass('fa-chevron-down') ? $("#SentReferralArrow").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#SentReferralArrow").removeClass('fa-chevron-up').addClass('fa-chevron-down'));
            });
            $("." + myclass + " .jobCard").css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');
            $scope.$root.utils.ellipsis();
        },

        viewHRStatus: function () {
            if ($scope.bresponsiveCandidateZone) {
                $scope.bCandidateZone = true;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                $scope.bJobDetailsShown ? $scope.DashboardPrevPage = ["JobDetails"] : $scope.DashboardPrevPage = ["SearchResults"];
                $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.FinishedApplications);
            }
            else
                document.location.href = "/tgwebhost/statuscheck.aspx?sid=" + $("#SIDValue").val();
        },

        logOutCandidate: function (logoutCalledFrom) {

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }
            var logOutCandidateRequest = {};
            logOutCandidateRequest.PartnerId = $("#partnerId").val();
            logOutCandidateRequest.SiteId = $("#siteId").val();
            logOutCandidateRequest.EncryptedSessionId = $("#CookieValue").val();
            var redirectURL = "/TGnewUI/Search/Home/Home?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val();
            url = '/TgNewUI/Search/Ajax/LogOutCandidate';
            $scope.loadwebtrackerscript("/TGNewUI/LogoutCandidate", $scope.customScriptRendering.Search);
            $http.post(url, logOutCandidateRequest).success(function (data, status, headers, config) {
                if (appScope.SM_SiteID == appScope.smType.Google) {
                    googleSignOut();
                }

                if (typeof logoutCalledFrom != "undefined" && logoutCalledFrom == "ByPassGQLogin") {
                    document.location.href = "/TGnewUI/Search/Home/CreateAccntWithPreload?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&Qs=" + appScope.encryptedBruid.replace("+", "_plus_");
                }

                $scope.bLoggedIn = false;
                sessionStorage.setItem('showAssessmentsCompletionMessage', true);
                sessionStorage.setItem('pageType', "");
                if ($scope.bJobCart) {
                    $scope.bJobCart = false;
                    $scope.jobs = $scope.jobsCache;
                }
                $("#CookieValue").val(data.NewEncryptedSessionId);
                $("#smlid").val(data.IdForSocialLogin);
                $scope.LoginChangeSecQuestion = false;
                $scope.LoginChangePassword = false;
                $scope.encryptedBruid = "";
                if ($scope.response)
                    $scope.response.encryptedBruid = "";

                $scope.oHistory = _.pick($scope.oHistory, ['home']);
                $scope.$root.oHistory = _.pick($scope.$root.oHistory, ['home']);
                previousHashes = [];
                previousHashes[previousHashes.length] = "home";

                $scope.ProfileDetails = {};
                if ($scope.updateAccount.updated == 'delete')
                    $scope.updateAccount = { updated: 'delete' };
                else
                    $scope.updateAccount = {};
                $scope.UserName = '';
                $scope.password = '';
                $scope.InActivityWarning = null;
                $scope.ProfileFirstName = "";
                $scope.ProfileMiddleName = "";
                $scope.ProfileLastName = "";
                $scope.ProfileAddress1 = ""
                $scope.ProfileAddress2 = ""
                $scope.ProfileCountryName = "";
                $scope.ProfileCity = "";
                $scope.ProfileState = "";
                $scope.ProfileFullState = "";
                $scope.ProfileCountryCode = "";
                $scope.ProfileZip = "";
                $scope.ProfileHomePhone = "";
                $scope.ProfileWorkPhone = "";
                $scope.ProfileFax = "";
                $scope.ProfileCellPhone = "";
                $scope.ProfileWebAddress = "";
                $scope.ProfileURL = "";
                $scope.ProfileCandStackField = "";
                $scope.ProfileEmailAddress = "";
                $scope.hasProfileDetails = false;

                $scope.bFileManager = false;
                $scope.savedResumes = {};
                $scope.savedCoverLetters = {};
                $scope.savedAttachments = {};
                $scope.savedCategories = {};
                $scope.attachmentCategories = {};
                $scope.candidatezoneEditProfileView = "";
                $scope.candidatezoneSubView = "dashBoard";
                $scope.communications = [];
                $scope.messages = [];
                $scope.notifications = [];
                $scope.SocialReferral_READY = "no";
                $scope.SocialReferral_FirstName = "";
                $scope.SocialReferral_LastName = "";
                $scope.SocialReferral_ProfileId = "";

                if (data.RedirectURLForSSO != null && data.RedirectURLForSSO != "") {
                    window.location = data.RedirectURLForSSO;
                }
                else if ($scope.tgSettings.SSOGateway == "1") {
                    $scope.AnonymousLoginType = "";
                    //@GlobalResources.InactiveTooLong
                    if ($scope.ShowTimeoutMessage)
                        document.write("<HTML><HEAD><TITLE>" + $scope.dynamicStrings.LogoutTitle + "</TITLE></HEAD><BODY><TABLE width='100%' align=center cellPadding=0 cellSpacing=0><TBODY><TR><TD align='center' valign='top'><span class='TEXT'>" + $scope.dynamicStrings.InactiveTooLong + "</span></TD></TR></TBODY></TABLE></BODY></HTML>");
                    else
                        document.write("<HTML><HEAD><TITLE>" + $scope.dynamicStrings.LogoutTitle + "</TITLE></HEAD><BODY><TABLE width='100%' align=center cellPadding=0 cellSpacing=0><TBODY><TR><TD align='center' valign='top'><span class='TEXT'>" + $scope.tgSettings.LogoutConfirmationMessage + "</span></TD></TR></TBODY></TABLE></BODY></HTML>");
                    document.close();
                }
                else {

                    if (typeof logoutCalledFrom != "undefined" && (logoutCalledFrom == "standAloneGQ" || logoutCalledFrom == "standAloneGQKnockedOut")) {
                        if (logoutCalledFrom == "standAloneGQ") {
                            setTimeout(function () {
                                ngDialog.open({
                                    preCloseCallback: function (value) {
                                    },
                                    template: 'StandAloneGQSucessfullSubmission', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                                });
                            });
                        }
                        else if (logoutCalledFrom == "standAloneGQKnockedOut") {
                            setTimeout(function () {
                                ngDialog.open({
                                    preCloseCallback: function (value) {
                                    },
                                    template: 'StandAloneGQKnockedOut', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                                });
                            });
                        }
                        $scope.AnonymousLoginType = "";
                    }
                    else {
                        if ($scope.isNonProfileAllowed || $scope.AnonymousLoginType == "ByPassGQLogin") {
                            setTimeout(function () {
                                ngDialog.open({
                                    preCloseCallback: function (value) {
                                    },
                                    template: 'NoLoginSessionTimedout', scope: $scope, className: 'ngdialog-theme-default NoLoginSessionTimedoutContainer', showClose: false, closeByDocument: false, ariaRole: "dialog"
                                });
                            });
                            if ($scope.standAloneGQ > 0 && $scope.isNonProfileAllowed) {
                                $scope.showInitialJobs(true);
                                return;
                            }
                        }
                        else if ($scope.standAloneGQ > 0) {
                            $scope.showInitialJobs(true);
                            return;
                        }

                        $scope.AnonymousLoginType = "";
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                        $scope.bWelcome = !($scope.bWelcome);

                        $scope.homeView();

                        $scope.welcomeTitle = $scope.tgSettings.LandingNonLoggedWelcomePageTitle;
                        setTimeout(function () { $scope.welcomeText = $scope.tgSettings.CandLandPageText; $scope.bWelcome = !($scope.bWelcome); $scope.$apply(); }, 10);
                        $scope.jobApplyUrl = "";

                        if (window.location.href.indexOf("ApplyWithPreLoad") > -1 && $scope.ShowTimeoutMessage) {
                            window.location = redirectURL + "#InactivityLogout";
                        }
                        else if (window.location.href.indexOf("ApplyWithPreLoad") > -1)
                            window.location = redirectURL;
                    }
                }
            });

        },
        applyPreload: function () {
            if (typeof $.queryParams().jobSiteId != 'undefined' && $.queryParams().jobSiteId != '' && $.queryParams().jobSiteId != $("#siteId").val()) {
                var origSiteId = $("#siteId").val();
                var switchSiteRequest = {};
                switchSiteRequest.PartnerId = $("#partnerId").val();
                switchSiteRequest.SwitchToSiteId = $.queryParams().jobSiteId;
                switchSiteRequest.FromSiteId = origSiteId;
                switchSiteRequest.CookieValue = $("#CookieValue").val();
                $.ajax({
                    success: function (data, status, jqxhr) {
                        if (data.Success == true) {
                            var bruid = $scope.encryptedBruid != "" ? $scope.encryptedBruid : decodeURIComponent($.queryParams().bruid);
                            window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + $.queryParams().jobSiteId + "&TQId=" + $.queryParams().tqid + "&bruid=" + encodeURIComponent(bruid) + "&reqid=" + $.queryParams().reqid + "&aipid=" + $.queryParams().aipid + "&pageid=" + $.queryParams().pageid + "&gqsessionId=" + $.queryParams().gqsessionId;
                        }

                    },
                    error: function (jqxhr, status, error) {
                    },
                    url: '/TgNewUI/Search/Ajax/SwitchSite',
                    data: switchSiteRequest,
                    type: 'POST'
                });
                return;
            }


            var rft = $("[name='__RequestVerificationToken']").val();
            $http.post(
                   "/gqweb/" + ($scope.applyPreloadJSON.WBMode ? "wbpreview" : "apply") + "?partnerid=" + $scope.applyPreloadJSON.PartnerId + "&siteid=" + ($scope.applyPreloadJSON.JobSiteId ? $scope.applyPreloadJSON.JobSiteId : $scope.applyPreloadJSON.SiteId) + "&localeid=" + $scope.applyPreloadJSON.LocaleId, { bruid: ($scope.applyPreloadJSON.BRUID), tqid: $scope.applyPreloadJSON.TQId, pageid: $scope.applyPreloadJSON.PageId, aipid: $scope.applyPreloadJSON.AIPID, localeid: $scope.applyPreloadJSON.LocaleId, reqid: $scope.applyPreloadJSON.ReqId, partnerid: $scope.applyPreloadJSON.PartnerId, siteid: $scope.applyPreloadJSON.SiteId, wbmode: $scope.applyPreloadJSON.WBMode, guid: $scope.applyPreloadJSON.GUID, gqsessionid: $scope.applyPreloadJSON.GQSessionId, loadingViaAjax: true },
                   { headers: { 'Content-Type': 'application/json', 'RFT': rft }, }

               ).success(function (result) {
                   appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                   $scope.$root.applyResponse = result;
                   $scope.bLoggedIn = true;
                   $scope.bShowBackButton = $("#noback").val() == "0" ? false : true;
                   $scope.applyPreLoad = false;
                   $scope.bJobDetailsShown = true;
               });
        },
        ////Change Security Question starts
        ResetChangeSecQuestfunction: function (scope) {
            scope.ChangeSecQuest.InvalidQuestions = [];
            scope.ChangeSecQuest.InvalidAnswers = [];
            scope.ChangeSecQuest.ErrorMsg = '';
            scope.ChangeSecQuest.errorID = '';
            scope.ChangeSecQuest.submitted1 = false;
            scope.ChangeSecQuest.submitted2 = false;
            scope.ChangeSecQuest.submitted3 = false;
            scope.ChangeSecQuest.noOfSecurityQuestions = (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride;
            scope.ChangeSecQuest.securityQuestion.value1 = '';
            scope.ChangeSecQuest.securityQuestion.value2 = '';
            scope.ChangeSecQuest.securityQuestion.value3 = '';
            scope.ChangeSecQuest.securityQuestion.answer1 = '';
            scope.ChangeSecQuest.securityQuestion.answer2 = '';
            scope.ChangeSecQuest.securityQuestion.answer3 = '';
            scope.ChangeSecQuest.securityQuestion.errorValue1 = false;
            scope.ChangeSecQuest.securityQuestion.errorValue2 = false;
            scope.ChangeSecQuest.securityQuestion.errorValue3 = false;
            scope.ChangeSecQuest.securityQuestion.errorAnswer1 = false;
            scope.ChangeSecQuest.securityQuestion.errorAnswer2 = false;
            scope.ChangeSecQuest.securityQuestion.errorAnswer3 = false;
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        ChangeSecQuest:
        {
            InvalidQuestions: [],
            InvalidAnswers: [],
            ErrorMsg: '',
            errorID: '',
            submitted1: false,
            submitted2: false,
            submitted3: false,
            noOfSecurityQuestions: (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride,
            //noOfSecurityQuestions: response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : response.ClientSettings.TGSecurityQuestionOverride,
            securityQuestion: {
                value1: '',
                value2: '',
                value3: '',
                answer1: '',
                answer2: '',
                answer3: '',
                errorValue1: false,
                errorValue2: false,
                errorValue3: false,
                errorAnswer1: false,
                errorAnswer2: false,
                errorAnswer3: false
            },
        },
        CommonErrorMessage: function (scope) {
            scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.Errormessage_SecurityQuestionsAndAnswersMustBeUnique;
            return scope;
        },
        ChangeSecQAfocusAt: function (ID, Submit) {
            if (ID != ("optSecurityQuestion1") && ID != ("optSecurityQuestion2") && ID != ("optSecurityQuestion3"))
                $("#" + ID).focus();
            else
                $('[id="' + ID + '-button"]').focus();

            setTimeout(function () { $scope.$apply(); }, 0);
        },
        ChangeSecurityQuestionAjax: function (scope) {
            var ChangeSecQuestRequest = {};
            ChangeSecQuestRequest.partnerId = $("#partnerId").val();
            ChangeSecQuestRequest.siteId = $("#siteId").val();
            ChangeSecQuestRequest.SQuestionOne = (scope.ChangeSecQuest.securityQuestion.value1 == '') ? '' : scope.ChangeSecQuest.securityQuestion.value1;
            ChangeSecQuestRequest.SQuestionTwo = (scope.ChangeSecQuest.securityQuestion.value2 == '') ? '' : scope.ChangeSecQuest.securityQuestion.value2;
            ChangeSecQuestRequest.SQuestionThree = (scope.ChangeSecQuest.securityQuestion.value3 == '') ? '' : scope.ChangeSecQuest.securityQuestion.value3;
            ChangeSecQuestRequest.SAnswerOne = (scope.ChangeSecQuest.securityQuestion.answer1 == '') ? '' : scope.ChangeSecQuest.securityQuestion.answer1;
            ChangeSecQuestRequest.SAnswerTwo = (scope.ChangeSecQuest.securityQuestion.answer2 == '') ? '' : scope.ChangeSecQuest.securityQuestion.answer2;
            ChangeSecQuestRequest.SAnswerThree = (scope.ChangeSecQuest.securityQuestion.answer3 == '') ? '' : scope.ChangeSecQuest.securityQuestion.answer3;
            ChangeSecQuestRequest.cookievalue = $("#CookieValue").val();
            var url = "/TgNewUI/Search/Ajax/ChangeSecurityQuestion"
            $http.post(url, ChangeSecQuestRequest).success(function (data, status, headers, config) {
                if (data.Success == true) {

                    $scope.encryptedBruid = data.EncryptedBruId;
                    $scope.hashCode = data.HashCode;
                    $scope.loadwebtrackerscript("/TGNewUI/Login", $scope.customScriptRendering.Search);
                    $timeout(function () { $scope.$apply(); }, 0);
                    if (data.NewSessionId != null || data.NewSessionId != "") {
                        $("#CookieValue").val(data.NewSessionId);
                    }
                    if ($scope.standAloneGQ > 0) {
                        $scope.bLoggedIn = true;
                        $scope.standAloneGQApply();
                    }
                    else if ($scope.jobApplyUrl != "") {
                        if ((data.ApplyStatus != null && data.ApplyStatus[0].Applied) || data.ApplyDiff <= 0) {
                            $scope.bLoggedIn = true;
                            $scope.bSignInView = false;
                            $scope.ApplyDifference = data.ApplyDiff;
                            $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                            $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                            $scope.LimitExceededMessage = data.LimitExceededMessage;
                            $scope.LoginChangeSecQuestion = false;
                            if (window.location.href.toLowerCase().indexOf("al=1") > -1)
                                $scope.bJobDetailsAPIError = true;
                            else
                                $scope.bJobDetailsAPIError = false;

                            $timeout(function () {
                                $scope.$apply();
                            }, 0);
                        }
                        else {
                            var rft = $("[name='__RequestVerificationToken']").val();
                            $http.get("/gqweb/apply?bruid=" + encodeURIComponent(data.EncryptedBruId) + $scope.jobApplyUrl + "&RFT=" + rft)
                                .success(function (result) {
                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                    $scope.$root.applyResponse = result;
                                    $scope.bLoggedIn = true;
                                    $scope.bSignInView = false;
                                    $scope.showInFullView = false;
                                    $scope.LoginChangeSecQuestion = false;
                                    setTimeout(function () {
                                        $(".pageFooter").pinToFold();
                                    }, 10);
                                    scope.loginField = "";
                                    scope.password = "";
                                });
                        }
                    } else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                        $scope.bLoggedIn = true;
                        $scope.bSignInView = false;
                        $scope.LoginChangeSecQuestion = false;
                        $scope.bCreateAccount = false;


                        if (appScope.bJobDetailsShown) {
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                            $scope.login.ForgotPass = false;
                            $scope.SingleJobApplyDupCheckAjax();
                            //if ($scope.calledFrom == "save")
                            //    $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                        }
                        else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                            ngDialog.closeAll();
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                            var SMLoginjobids = $scope.SearchResultsJobsSelectedScope.jobIds.split(",").length > 0 ? $scope.SearchResultsJobsSelectedScope.jobIds : "";
                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                            _.each(appScope.jobs, function (job) {
                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                    job.Selected = true;
                                }
                            });
                            if ($scope.calledFrom == "save") {
                                $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                            }
                            else {
                                $scope.postToNextPage('', appScope, 'mulapplyvald');
                            }
                        }
                    } else if ($scope.PortalLogin) {
                        $scope.LoginChangeSecQuestion = false;
                        $scope.bCandidateZone = true;
                        if ($scope.bresponsiveCandidateZone && $scope.EnableResponsiveCandidatePortal)
                            $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.FinishedApplications);
                        else
                            window.location = '../../../TGwebhost/candidateportal.aspx?SID=' + $("#SIDValue").val();
                    } else if ($scope.bresponsiveCandidateZone) {
                        $scope.bCandidateZone = true;
                        $scope.LoginChangeSecQuestion = false;
                        $scope.ViewDashBoardData("SavedJobs");
                    }
                    else {
                        var candidateZoneRequest = {};
                        candidateZoneRequest.PartnerId = $("#partnerId").val();
                        candidateZoneRequest.SiteId = $("#siteId").val();
                        candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                        candidateZoneRequest.SIDValue = $("#SIDValue").val();
                        url = '/TgNewUI/Search/Ajax/CandidateZone';
                        $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                            $scope.bCandidateZone = true;
                            $scope.CandidateZoneData = data;
                            $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                            $scope.bLoggedIn = true;
                            $scope.LoginChangeSecQuestion = false;
                            $scope.bSignInView = false;
                            $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                            $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                            $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                            if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                                $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                                $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                                $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                            }
                            setTimeout(function () { $(".pageFooter").pinToFold() }, 10);

                        });
                        $scope.loadwebtrackerscript("/TGNewUI/CandidateZone", $scope.customScriptRendering.CandidateZone);
                    }
                }
                //$timeout(function () {
                //    $scope.$apply();
                //}, 0);
            });
        },

        standAloneGQApply: function () {
            $scope.jobApplyUrl = "&tqid=" + $scope.standAloneGQ + "&localeid=" + $scope.tgSettings.deflocaleid + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&wbmode=false&loadingViaAjax=true&isStandAloneGQ=true";

            var rft = $("[name='__RequestVerificationToken']").val();
            $http.get("/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl + "&RFT=" + rft)
                .success(function (result) {
                    $scope.bSignInView = false;
                    $scope.showInFullView = false;
                    $scope.LoginChangeSecQuestion = false;
                    setTimeout(function () {
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                        $scope.$apply();
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                        $scope.$root.applyResponse = result;
                        $(".pageFooter").pinToFold();
                        $scope.$apply();
                    }, 0);
                    //scope.loginField = "";
                    //scope.password = "";
                });
        },

        ThrottleSecurityQAValidation: function () {
            if ($scope.ChangeSecQuest.securityQuestion.value1 != $("#optSecurityQuestion1").val() && $("#optSecurityQuestion1").val() != null) {
                $scope.ChangeSecQuest.securityQuestion.value1 = $("#optSecurityQuestion1").val();
                $scope.ChangeSecQuest.submitted1 = false;
            }
            if ($scope.ChangeSecQuest.securityQuestion.value2 != $("#optSecurityQuestion2").val() && $("#optSecurityQuestion2").val() != null) {
                $scope.ChangeSecQuest.securityQuestion.value2 = $("#optSecurityQuestion2").val();
                $scope.ChangeSecQuest.submitted2 = false;
            }
            if ($scope.ChangeSecQuest.securityQuestion.value3 != $("#optSecurityQuestion3").val() && $("#optSecurityQuestion3").val() != null) {
                $scope.ChangeSecQuest.securityQuestion.value3 = $("#optSecurityQuestion3").val();
                $scope.ChangeSecQuest.submitted3 = false;
            }
        },
        SubmitSecurityQuestion: function (scope) {
            $scope.ValidateSecurityQuestion(scope);
            if (scope.SecurityQuestionsForm.$valid && scope.ChangeSecQuest.ErrorMsg == '') {
                $scope.ChangeSecurityQuestionAjax(scope);
            }
        },
        ValidateSecurityQuestion: function (scope) {
            scope.ChangeSecQuest.errorValue1 = false;
            scope.ChangeSecQuest.errorValue2 = false;
            scope.ChangeSecQuest.errorValue3 = false;
            scope.ChangeSecQuest.errorAnswer1 = false;
            scope.ChangeSecQuest.errorAnswer2 = false;
            scope.ChangeSecQuest.errorAnswer3 = false;
            scope.ChangeSecQuest.errorID = '';
            scope.ChangeSecQuest.InvalidAnswers = [];
            scope.ChangeSecQuest.InvalidQuestions = [];
            scope.ChangeSecQuest.ErrorMsg = '';

            //Validation Starts here
            if (scope.SecurityQuestionsForm.$invalid) {

                if (scope.ChangeSecQuest.submitted1 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) || scope.ChangeSecQuest.securityQuestion.value1 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidQuestions.push({
                        "Question": "Question1",
                        "QuestionID": 'optSecurityQuestion1',
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "optSecurityQuestion1";

                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions >= 2 && scope.ChangeSecQuest.submitted2 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) || scope.ChangeSecQuest.securityQuestion.value2 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidQuestions.push({
                        "Question": "Question2",
                        "QuestionID": 'optSecurityQuestion2',
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "optSecurityQuestion2";

                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && scope.ChangeSecQuest.submitted3 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) || scope.ChangeSecQuest.securityQuestion.value3 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidQuestions.push({
                        "Question": "Question3",
                        "QuestionID": 'optSecurityQuestion3'
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "optSecurityQuestion3";
                }
                if (scope.ChangeSecQuest.submitted1 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) || scope.ChangeSecQuest.securityQuestion.answer1 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidAnswers.push({
                        "Answer": "Answer1",
                        "AnswerID": 'txtSecurityQuestion1Answer',
                        "QuestionValue": scope.ChangeSecQuest.securityQuestion.value1
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "txtSecurityQuestion1Answer";
                }

                if (scope.ChangeSecQuest.noOfSecurityQuestions >= 2 && scope.ChangeSecQuest.submitted2 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) || scope.ChangeSecQuest.securityQuestion.answer2 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidAnswers.push({
                        "Answer": "Answer2",
                        "AnswerID": 'txtSecurityQuestion2Answer',
                        "QuestionValue": scope.ChangeSecQuest.securityQuestion.value2
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "txtSecurityQuestion2Answer";
                }

                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && scope.ChangeSecQuest.submitted3 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) || scope.ChangeSecQuest.securityQuestion.answer3 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidAnswers.push({
                        "Answer": "Answer3",
                        "AnswerID": 'txtSecurityQuestion3Answer',
                        "QuestionValue": scope.ChangeSecQuest.securityQuestion.value3
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "txtSecurityQuestion3Answer";
                }
            }
            //End of Validation
            //start of Duplicate QA
            if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 != '') {
                if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value2) {
                    scope.ChangeSecQuest.errorValue1 = true;
                    scope.ChangeSecQuest.errorValue2 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 != '') {
                if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer2) {
                    scope.ChangeSecQuest.errorAnswer1 = true;
                    scope.ChangeSecQuest.errorAnswer2 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) && scope.ChangeSecQuest.securityQuestion.value3 != '') {
                if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value3) {
                    scope.ChangeSecQuest.errorValue1 = true;
                    scope.ChangeSecQuest.errorValue3 = true;
                    $scope.CommonErrorMessage(scope);
                }
                if (scope.ChangeSecQuest.securityQuestion.value2 == scope.ChangeSecQuest.securityQuestion.value3) {
                    scope.ChangeSecQuest.errorValue2 = true;
                    scope.ChangeSecQuest.errorValue3 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) && scope.ChangeSecQuest.securityQuestion.answer3 != '') {
                if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer3) {
                    scope.ChangeSecQuest.errorAnswer1 = true;
                    scope.ChangeSecQuest.errorAnswer3 = true;
                    $scope.CommonErrorMessage(scope);
                }
                if (scope.ChangeSecQuest.securityQuestion.answer2 == scope.ChangeSecQuest.securityQuestion.answer3) {
                    scope.ChangeSecQuest.errorAnswer2 = true;
                    scope.ChangeSecQuest.errorAnswer3 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            return;
        },
        ////Change Security Question Ends here


        LoginWithSocialMedia: function (socialMedia) {
            if (appScope.showVBTWarningAlert(true)) {
                return;
            }
            if (appScope.bCreateAccount && appScope.createAccount.bSocialNetwork)
                $("#SMLoginFlow").val("createaccount");
            else
                $("#SMLoginFlow").val("login");

            if (socialMedia == "12") {
                $('#GoogleRenderedButton').children(":first").trigger('click');
            }
            else if ($scope.standAloneGQ > 0) {
                $("#RedirectToAfterSMLogin").val("");
                $("#hSMJobId").val("");
                var socialMediaUrl = "../../../tgwebhost/SocialMediaIntegration.aspx?action=login&smsid=" + socialMedia + "&clientid=" + $("#partnerId").val() + "&lid=" + $("#smlid").val() + "&callee=TG&tgsiteid=" + $("#siteId").val() + "&invokedBy=responsive";
                window.open(socialMediaUrl, "_blank", "resizable=yes,scrollbar=yes, top=200, left=200");
            }
            else {
                if ($scope.encryptedBruid != "" && window.location.href.indexOf("CreateAccntWithPreload") > -1) {
                    $("#idForNewAcc").val($scope.encryptedBruid);
                }
                var searchCriteria = $scope.GetSearchCriteria();

                var url = '/TgNewUI/Search/Ajax/SaveSearchCriteriaInSessionXML';
                $http.post(url, searchCriteria).success(function (data, status, headers, config) {
                    if ($scope.bSearchResults && !$scope.bJobDetailsShown) {
                        switch ($scope.calledFrom) {
                            case "refer":
                                $("#RedirectToAfterSMLogin").val("referfromsearchresults");
                                break;
                            case "save":
                                $("#RedirectToAfterSMLogin").val("savefromsearchresults");
                                break;
                            case "savesearch":
                                $scope.SaveSearchCriteriaToLocalSession();
                                $("#RedirectToAfterSMLogin").val("savesearchfromsearchresults");
                                break;
                            case "mulapplyvald":
                                $("#RedirectToAfterSMLogin").val("applyfromsearchresults");
                                break;
                            default:
                                var selectedJobsids = [];
                                _.each($scope.jobs, function (job) {
                                    if (job.Selected)
                                        selectedJobsids.push(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString());
                                });
                                $("#hSMJobId").val(selectedJobsids.join(","));
                                $("#RedirectToAfterSMLogin").val("fromsearchresults");
                                break;
                        }
                    }
                    else if ($scope.bJobDetailsShown) {
                        switch ($scope.calledFrom) {
                            case "refer":
                                $("#RedirectToAfterSMLogin").val("referfromjobdetails");
                                break;
                            case "save":
                                $("#RedirectToAfterSMLogin").val("savefromjobdetails");
                                break;
                            case "apply":
                                $("#RedirectToAfterSMLogin").val("applyfromjobdetails");
                                break;
                            default:
                                if ($("#hSMJobId").val() == "")
                                    $("#hSMJobId").val($scope.jobDetailsJobShown.split("_")[0]);
                                $("#RedirectToAfterSMLogin").val("fromjobdetails");
                                break;
                        }

                    }
                    else if ($scope.bWelcome && $scope.$root.workFlow == "welcome") {
                        $("#RedirectToAfterSMLogin").val("home");
                    }
                    else if ($("#pageType").val().length > 0) {
                        switch ($("#pageType").val().toLowerCase()) {
                            case "saveddraftsfromlink":
                                $("#RedirectToAfterSMLogin").val("saveddraftsFromLink");
                                break;
                            case "portal":
                                $("#RedirectToAfterSMLogin").val("portal");
                                break;
                        }
                    }
                    var socialMediaUrl = "../../../tgwebhost/SocialMediaIntegration.aspx?action=login&smsid=" + socialMedia + "&clientid=" + $("#partnerId").val() + "&lid=" + $("#smlid").val() + "&callee=TG&tgsiteid=" + $("#siteId").val() + "&invokedBy=responsive";
                    window.open(socialMediaUrl, "_blank", "resizable=yes,scrollbar=yes, top=200, left=200");
                });
            }


        },

        SaveSearchCriteriaToLocalSession: function () {
            sessionStorage.setItem("jobs", JSON.stringify($scope.jobs));
            sessionStorage.setItem("facets", JSON.stringify($scope.facets));
            sessionStorage.setItem("powersearchquestions", JSON.stringify($scope.powerSearchQuestions));
            sessionStorage.setItem("latitude", $scope.SaveSearchCriteria.Latitude ? $scope.SaveSearchCriteria.Latitude : $scope.latitude);
            sessionStorage.setItem("longitude", $scope.SaveSearchCriteria.Longitude ? $scope.SaveSearchCriteria.Longitude : $scope.longitude);
            sessionStorage.setItem("keyword", $scope.SaveSearchCriteria.Keyword ? $scope.SaveSearchCriteria.Keyword : $scope.keyWordSearch.text);
            sessionStorage.setItem("location", $scope.SaveSearchCriteria.Location ? $scope.SaveSearchCriteria.Location : $scope.locationSearch.text);
            $scope.sortby = ($scope.sortby == null && $scope.sortby == undefined) ? $("#sortBy").val() : $scope.sortby;
            sessionStorage.setItem("sortby", $scope.sortby);
            sessionStorage.setItem("jobsheading", $scope.jobsHeading);
            sessionStorage.setItem('savesearchaftersocialmedialogin', true);
        },

        ClearSaveSearchCriteriaToLocalSession: function () {
            try {
                sessionStorage.setItem("jobs", null);
                sessionStorage.setItem("facets", null);
                sessionStorage.setItem("powersearchquestions", null);
                sessionStorage.setItem("latitude", null);
                sessionStorage.setItem("longitude", null);
                sessionStorage.setItem("keyword", null);
                sessionStorage.setItem("location", null);
                sessionStorage.setItem("sortby", null);
                sessionStorage.setItem("jobsheading", null);
                sessionStorage.setItem('savesearchaftersocialmedialogin', false);
            }
            catch (error) {

            }
        },

        TranslateCandidateZoneLinks: function (data) {
            if ($scope.bresponsiveCandidateZone) {
                _.forEach(data.Links, function (link) {
                    switch (link.CandidateZoneLinkId) {
                        case "dashBoard":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Lbl_DashBoard;
                            break;
                        case "jobProfile":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Profile;
                            break;
                        case "accountSettings":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Lbl_AccountSettings;
                            break;
                        case "viewAssessment":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Assessments;
                            break;
                        case "candidatePortal":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_CandidatePortal;
                            break;
                        case "eventManager":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Events;
                            break;
                        case "communicationHistory":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Communications;
                            break;
                        case "submitGeneralReferral":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_SubmitGeneralReferral;
                            break;
                        case "socialReferralStatus":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_SocialReferralStatus;
                            break;
                        case "ResponsiveAssessment":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Assessments;
                            break;
                        case "messageArchive":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Heading_Message_Archives;
                            break;
                        case "ResponsiveReferrals":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_ResponsiveReferrals;
                            break;
                    }
                })

            }
            else {
                _.forEach(data.Links, function (link) {
                    switch (link.CandidateZoneLinkName) {
                        case "Edit your profile":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Edit_Profile_Menu;
                            break;
                        case "Resume/CV manager":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Resume_CV_Menu;
                            break;
                        case "Search agent manager":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Search_Agent_Menu;
                            break;
                        case "Job cart":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Job_Cart_Menu;
                            break;
                        case "Saved drafts":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Saved_Draft_Menu;
                            break;
                        case "Social networking information":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Social_Config_Menu;
                            link.CandidateZoneLinkDescriptionText = $scope.dynamicStrings.Social_Config_Description;
                            break;
                        case "Submit General Referral":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Submit_Socio_Referral_Menu;
                            link.CandidateZoneLinkDescriptionText = $scope.dynamicStrings.Submit_Socio_Referral_Description;
                            break;
                    }
                })
            }
        },

        TranslatePowerSearchQuestions: function (questions) {
            _.forEach(questions, function (question) {
                switch (question.QuestionDescription) {
                    case "Post Date":
                        question.QuestionDescription = $scope.dynamicStrings.Post_Date
                        break;
                    case "Language":
                        question.QuestionDescription = $scope.dynamicStrings.Language
                        break;
                }
            })
        },

        RefreshSession: function () {
            $scope.bRefreshSession = true;
            if (window.location.href.toLowerCase().indexOf("al=1") > -1)
                $scope.bJobDetailsAPIError = true;
            else
                $scope.bJobDetailsAPIError = false;


            if ($scope.tgSettings.CandRemainsLoggedIn.toLowerCase() == "yes" || (!$scope.bShowBackButton && $scope.bJobDetailsAPIError)) {

                var refreshSessionRequest = {}
                refreshSessionRequest.PartnerId = $("#partnerId").val();
                refreshSessionRequest.SiteId = $("#siteId").val();
                refreshSessionRequest.EncryptedSessionId = $("#CookieValue").val();
                if ($scope.jobDetailsJobShown != "") {
                    refreshSessionRequest.JobIDs = $scope.jobDetailsJobShown.split('_')[0];
                }
                $scope.bWelcome = !($scope.bWelcome);
                url = '/TgNewUI/Search/Ajax/RefreshSession';
                $http.post(url, refreshSessionRequest).success(function (data, status, headers, config) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus.AllowReApply : true;
                    $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus.Applied : false;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.bLoggedIn = true;
                    if (data.RefreshedSession != null)
                        $("#CookieValue").val(data.RefreshedSession);
                    $scope.encryptedBruid = data.EncryptedBruId;
                    $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    if ($scope.bSelectedGroup) {
                        $scope.SelectedGroupAjax($("#partnerId").val(), $("#siteId").val());
                        $scope.bLoggedIn = true;
                    }
                    setTimeout(function () { $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText; $scope.bWelcome = !($scope.bWelcome); $scope.$apply(); }, 10);

                });
            }
            else {
                $scope.logOutCandidate();
            }
        },
        //Clones the given facets and returns the filtered facets collection without modifying input facets collection.
        GetFilteredFacets: function (facets) {
            var clonedFilteredFacets = _.cloneDeep(facets);
            _.remove(clonedFilteredFacets, function (facet) {
                facet.Options = _.filter(facet.Options, { Selected: true });
                return facet.Options.length > 0 ? false : true;
            });
            return clonedFilteredFacets;
        },

        updateSaveSearchCritetia: function (smartSearchRequest) {
            $scope.SaveSearchCriteria = {
                KeyWord: smartSearchRequest.keyword,
                Location: smartSearchRequest.location,
                Latitude: smartSearchRequest.Latitude,
                Longitude: smartSearchRequest.Longitude
            };
        },

        getSavedSearchesMetaDataAndOpenDialog: function () {
            if (!$scope.bLoggedIn && $scope.tgSettings.SSOGateway != "1") {
                $scope.calledFrom = "savesearch";
                $scope.showMobileSignInDialog($scope);
                return;
            }
            var SavedSearchesRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val()
            };
            var url = '/TgNewUI/CandidateZone/Ajax/GetSavedSearchesMetaData';
            $http.post(url, SavedSearchesRequest).success(function (data, status, headers, config) {
                $scope.SavedSearchesMetaData = data;
                $scope.openSaveSearchDialog();
            });
        },

        openSaveSearchDialog: function (existingSavedSearch) {

            $scope.bSearchSaved = false;
            $scope.SaveSearchDialog = {};
            $scope.SaveSearchDialog.isEditFromSavedSearchesTab = false;
            $scope.SaveSearchDialog.bExistingSavedSearch = false;
            if (typeof existingSavedSearch != "undefined") {
                $scope.SaveSearchDialog.isEditFromSavedSearchesTab = true;
                $scope.SaveSearchDialog.InitialSearchName = existingSavedSearch.SearchName;
            }

            if (typeof existingSavedSearch == "undefined" && $scope.searchResultsFromSavedSearch != null) {
                existingSavedSearch = $scope.searchResultsFromSavedSearch;
            }

            if (typeof existingSavedSearch != "undefined") {
                $scope.SaveSearchDialog.SearchName = existingSavedSearch.SearchName;
                $scope.SaveSearchDialog.SearchFrequency = existingSavedSearch.Frequency;
                $scope.SaveSearchDialog.EmailAddress = existingSavedSearch.Email;
                $scope.SaveSearchDialog.SavedSearchId = existingSavedSearch.SavedSearchId;
            }
            else {
                $scope.SaveSearchDialog.SearchName = "";
                $scope.SaveSearchDialog.SearchFrequency = "7";
                $scope.SaveSearchDialog.EmailAddress = "";
            }
            if ($scope.SavedSearchesMetaData != null && typeof existingSavedSearch == "undefined") {
                if (typeof $scope.SavedSearchesMetaData.EmailAddress != "undefined") {
                    $scope.SaveSearchDialog.EmailAddress = $scope.SavedSearchesMetaData.EmailAddress;
                }
            }

            $scope.SaveSearchDialog.Submitted = false;
            //set the placeholder as empty in case if we are starting with frequency: "Never"
            if ($scope.SaveSearchDialog.SearchFrequency == 0) {
                $scope.SaveSearchDialog.placeholder_emailaddress = '';
            }
            else {
                $scope.SaveSearchDialog.placeholder_emailaddress = $scope.dynamicStrings.PlaceHolder_EmailAddress;
            }

            //To track the opening and previous frequency during user-interactions
            $scope.SaveSearchDialog.previousFrequency = $scope.SaveSearchDialog.openingFrequency = $scope.SaveSearchDialog.SearchFrequency;

            $scope.CallApply();
            setTimeout(function () {
                ngDialog.open({
                    preCloseCallback: function (value) {
                    },
                    template: 'SaveSearchDialog', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, ariaRole: "dialog"
                });
            }, 0);

        },
        saveSearchEmailHandler: function () {
            if ($scope.SaveSearchDialog.SearchFrequency == 0) {
                $scope.SaveSearchDialog.EmailAddress_old = $scope.SaveSearchDialog.EmailAddress;
                $scope.SaveSearchDialog.placeholder_emailaddress = '';
                $scope.SaveSearchDialog.EmailAddress = '';
            }
            else {
                if ($scope.SaveSearchDialog.openingFrequency == 0) {
                    if ($scope.ProfileDetails.email != '') {
                        $scope.SaveSearchDialog.EmailAddress = $scope.SaveSearchDialog.EmailAddress_old = $scope.ProfileDetails.email;
                    }
                    else {
                        $scope.SaveSearchDialog.EmailAddress = $scope.SaveSearchDialog.EmailAddress_old = $scope.ProfileDetails.AlternateEmail;
                    }

                    $scope.SaveSearchDialog.openingFrequency = -1;
                }
                else {
                    if ($scope.SaveSearchDialog.previousFrequency == 0) {
                        $scope.SaveSearchDialog.EmailAddress = $scope.SaveSearchDialog.EmailAddress_old;
                    }
                    else {
                        $scope.SaveSearchDialog.EmailAddress_old = $scope.SaveSearchDialog.EmailAddress;
                    }
                }

                $scope.SaveSearchDialog.placeholder_emailaddress = $scope.dynamicStrings.PlaceHolder_EmailAddress;

            }
            $scope.SaveSearchDialog.previousFrequency = $scope.SaveSearchDialog.SearchFrequency
        },

        isExistingSavedSearch: function (scope) {
            var existingSearch = _.find(scope.SavedSearchesMetaData.SavedSearches, function (s) {
                return (typeof scope.SaveSearchDialog.SearchName != "undefined" && s.Name.toLowerCase() == scope.SaveSearchDialog.SearchName.toLowerCase() && (!scope.SaveSearchDialog.isEditFromSavedSearchesTab || (scope.SaveSearchDialog.isEditFromSavedSearchesTab && s.Name.toLowerCase() != scope.SaveSearchDialog.InitialSearchName.toLowerCase())));
            });
            if (typeof existingSearch != "undefined") {
                scope.SaveSearchDialog.bExistingSavedSearch = true;
                $scope.SaveSearchDialog.bSavedSearchesError = true;
            }
            else
                scope.SaveSearchDialog.bExistingSavedSearch = false;
            $scope.CallApply();
        },

        SaveSearch: function (scope) {
            $scope.SaveSearchDialog.Submitted = true;
            $timeout(function () {
                if (scope.SaveSearchForm.$valid && ($scope.SaveSearchDialog.SearchFrequency == 0 || ($scope.SaveSearchDialog.EmailAddress != null && $scope.SaveSearchDialog.EmailAddress.trim() != '' && !scope.SaveSearchForm.SaveSearchEmailAddress.$error.pattern)) && (!$scope.SaveSearchDialog.isEditFromSavedSearchesTab || ($scope.SaveSearchDialog.isEditFromSavedSearchesTab && !$scope.SaveSearchDialog.bExistingSavedSearch))) {
                    if (!$scope.SaveSearchDialog.bExistingSavedSearch && !$scope.SaveSearchDialog.isEditFromSavedSearchesTab && $scope.SavedSearchesMetaData.SavedSearches.length >= 10) {
                        $scope.SaveSearchDialog.MaxLimitExceeded = true;
                    }
                    else {
                        $scope.SaveSearchDialog.bSavedSearchesError = false;
                        scope.oActiveLaddaButton.start();
                        if ($scope.SaveSearchDialog.isEditFromSavedSearchesTab) {
                            $scope.UpdateSavedSearchAjax(scope);
                        }
                        else {
                            $scope.SaveSearchAjax(scope);
                        }
                    }
                }
                else {
                    $scope.SaveSearchDialog.bSavedSearchesError = true;
                }
            }, 0);

        },

        SaveSearchAjax: function (scope) {
            var SaveSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SearchName: $scope.SaveSearchDialog.SearchName,
                Frequency: $scope.SaveSearchDialog.SearchFrequency,
                Email: $scope.SaveSearchDialog.EmailAddress,
                Latitude: $scope.SaveSearchCriteria.Latitude ? $scope.SaveSearchCriteria.Latitude : $scope.latitude,
                Longitude: $scope.SaveSearchCriteria.Longitude ? $scope.SaveSearchCriteria.Longitude : $scope.longitude,
                Keyword: $scope.SaveSearchCriteria.Keyword ? $scope.SaveSearchCriteria.Keyword : $scope.keyWordSearch.text,
                Location: $scope.SaveSearchCriteria.Location ? $scope.SaveSearchCriteria.Location : $scope.locationSearch.text,
                KeywordCustomSolrFields: $scope.keywordFields,
                LocationCustomSolrFields: $scope.locationFields,
                SavedSearchId: 0
            };

            //Find out, if its an existing search 
            if ($scope.SaveSearchDialog.bExistingSavedSearch) {
                var existingSearch = _.find(scope.SavedSearchesMetaData.SavedSearches, function (s) {
                    return (s.Name.toLowerCase() == scope.SaveSearchDialog.SearchName.toLowerCase());
                });
                if (typeof existingSearch != "undefined") {
                    SaveSearchRequest.SavedSearchId = existingSearch.Value;
                }
            }

            var powerSearchOptions = [];
            if ($scope.powerSearchQuestions != "") {
                _.forEach($scope.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    obj.QuestionId = aQuestion.QId;
                    obj.QuestionName = aQuestion.QuestionName;
                    if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.Options = _.where(aQuestion.Options, { Selected: true });
                    }
                    if ((obj.Value != "" && obj.Value != null) || (obj.Options != null && obj.Options.length > 0) || ((obj.OptionCodes != null && obj.OptionCodes.length > 0))) {
                        powerSearchOptions.push(obj);
                    }
                });
            }
            SaveSearchRequest.PowerSearchOptions = powerSearchOptions;
            SaveSearchRequest.Facets = $scope.GetFilteredFacets(appScope.facets);
            $scope.sortby = ($scope.sortby == null && $scope.sortby == undefined) ? $("#sortBy").val() : $scope.sortby;
            SaveSearchRequest.SortType = "";
            if (typeof $scope.sortby != "undefined") {
                SaveSearchRequest.SortType = $scope.sortFields[$scope.sortby].Name;
            }

            var url = '/TgNewUI/CandidateZone/Ajax/SaveSearch';
            $http.post(url, SaveSearchRequest).success(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
                $scope.SaveSearchDialog.MaxLimitExceeded = false;
                $scope.SaveSearchDialog.SearchNameExists = false;
                if (data.Success) {
                    $scope.searchResultsFromSavedSearch = {
                        SearchName: $scope.SaveSearchDialog.SearchName,
                        Frequency: $scope.SaveSearchDialog.SearchFrequency,
                        Email: $scope.SaveSearchDialog.EmailAddress,
                        SavedSearchId: data.SavedSearchId
                    }
                    $scope.bSearchSaved = true;
                    $scope.CloseDialogs();
                    $scope.adjustHeaderStickers();
                }
                else if (data.MaxLimitExceeded) {
                    $scope.SaveSearchDialog.MaxLimitExceeded = true;
                }
                else if (data.SearchNameExists) {
                    appScope.dynamicStrings.Label_SaveSearchUniqueNameUpdated = appScope.dynamicStrings.Label_SaveSearchUniqueName.replace('[SearchName]', SaveSearchRequest.AgentName);
                    $scope.SaveSearchDialog.SearchNameExists = true;
                    $scope.SaveSearchDialog.bSavedSearchesError = true;
                }
            }).error(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
            });
        },

        UpdateSavedSearchAjax: function (scope) {
            var UpdateSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SearchName: $scope.SaveSearchDialog.SearchName,
                Frequency: $scope.SaveSearchDialog.SearchFrequency,
                Email: $scope.SaveSearchDialog.EmailAddress,
                SavedSearchId: $scope.SaveSearchDialog.SavedSearchId
            };

            var url = '/TgNewUI/CandidateZone/Ajax/UpdateSavedSearch';
            $http.post(url, UpdateSavedSearchRequest).success(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
                if (data.Success) {
                    $scope.savedSearchActionCompletion = $scope.enumForSavedSearchActions.Configure;
                    $scope.CloseDialogs();
                    _.find($scope.SavedSearchesMetaData.SavedSearches, { 'Value': UpdateSavedSearchRequest.SavedSearchId }).Name = $scope.SaveSearchDialog.SearchName;
                    var existingSavedSearch = _.find($scope.SavedSearches, { 'SavedSearchId': UpdateSavedSearchRequest.SavedSearchId });
                    existingSavedSearch.SearchName = UpdateSavedSearchRequest.SearchName;
                    existingSavedSearch.Frequency = UpdateSavedSearchRequest.Frequency;
                    existingSavedSearch.Email = UpdateSavedSearchRequest.Email;
                    $scope.CallApply();
                    $scope.adjustHeaderStickers();
                }
            });
        },

        RenewSavedSearchAjax: function (savedSearch) {
            var RenewSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SavedSearchId: savedSearch.SavedSearchId
            };

            var url = '/TgNewUI/CandidateZone/Ajax/RenewSavedSearch';
            $http.post(url, RenewSavedSearchRequest).success(function (data, status, headers, config) {
                if (data.Success) {
                    $scope.savedSearchActionCompletion = $scope.enumForSavedSearchActions.Renew;
                    var existingSavedSearch = _.find($scope.SavedSearches, { 'SavedSearchId': RenewSavedSearchRequest.SavedSearchId });
                    existingSavedSearch.NoOfDaysToExpire = 90;
                    $scope.CallApply();
                    $scope.adjustHeaderStickers();
                }
            });
        },

        DeleteSavedSearchAjax: function (savedSearch) {
            var DeleteSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SavedSearchId: savedSearch.SavedSearchId
            };

            var url = '/TgNewUI/CandidateZone/Ajax/DeleteSavedSearch';
            $http.post(url, DeleteSavedSearchRequest).success(function (data, status, headers, config) {
                if (data.Success) {
                    $scope.savedSearchActionCompletion = $scope.enumForSavedSearchActions.Delete;
                    _.remove($scope.SavedSearches, function (savedSearch) {
                        return savedSearch.SavedSearchId == DeleteSavedSearchRequest.SavedSearchId;
                    });
                    _.remove($scope.SavedSearchesMetaData.SavedSearches, function (savedSearchMeta) {
                        return savedSearchMeta.Value == DeleteSavedSearchRequest.SavedSearchId;
                    });
                    $scope.CandZoneSearchCount = $scope.SavedSearches.length;

                    $scope.CallApply();
                    $scope.adjustHeaderStickers();
                    if (!$scope.utils.isNewHash('SavedSearches', $scope))
                        $scope.utils.updateHistory('SavedSearches');
                    if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
                        $scope.oHistory["SavedJobs"].CandZoneSearchCount = $scope.CandZoneSearchCount;
                    }
                    if (!$scope.utils.isNewHash('Applications', $scope)) {
                        $scope.oHistory["Applications"].CandZoneSearchCount = $scope.CandZoneSearchCount;
                    }
                }
            });
        },

        leaveSiteWarning: function (site) {
            var gqData = angular.fromJson($("#pagemetadata").val());
            var bSaveAsDraft = false;
            var saveaAsDraftButton = $('#saveasdraft');
            if (saveaAsDraftButton.is(":visible"))
                bSaveAsDraft = true;
            if (gqData && bSaveAsDraft) {
                $scope.daysInDraft = gqData.daysdraft;
                $scope.bSaveDraft = true;
            } else {
                $scope.bSaveDraft = false;
            }
            var dialog = ngDialog.open({
                template: 'LeaveApplyTemplate',
                className: 'ngdialog-theme-default leavingWarningContent',
                showClose: true,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog",
                scope: $scope
            });
            $scope.closeTSMenu();
            dialog.closePromise.then(function (data) {
                if (data.value == '1') {
                    if (gqData && bSaveAsDraft) {
                        $timeout(function () {
                            angular.element(saveaAsDraftButton).triggerHandler('click');
                        }, 0);
                    }
                    window.location = site.extURL.indexOf("http") ? "http://" + site.extURL : site.extURL;
                } else {
                    angular.beforeDialogClose();
                }
            });
        },

        closeTSMenu: function () {
            $("#gateway").removeClass("ts-navigation-menu-on");
            $('#swfCoreNavigationControl').mousedown();
            if ($('#swfLeftMenu')) {
                $("#swfLeftMenu").removeClass("ts-navigation-menu-on");
                $("#swfLeftMenu").removeClass("visible");
                $('#swfCoreNavigationControlFin').removeClass("expanded");
            }
            if ($('#swfCoreMobileOverlay'))
                $('#swfCoreMobileOverlay').trigger("click");
        },
        adjustTSHeight: function () {
            if ($scope.bFromTalentSuite) {

                $('.lightAccentBkg.vExpDiv:visible').css('height', 'auto');
                $('body').css({ 'overflow-y': 'visible' });
                $scope.$apply();

                $timeout(function () {
                    var vExpDiv = $('.lightAccentBkg.vExpDiv:visible');
                    if (vExpDiv.length > 0) {
                        var expDiv = $(vExpDiv[0]);
                        var aHeight = window.innerHeight - 90;
                        var expDivTop = expDiv.position().top + parseInt(expDiv.css('marginTop'), 10) + parseInt(expDiv.css('marginBottom'), 10) + parseInt(expDiv.css('paddingTop'), 10) + parseInt(expDiv.css('paddingBottom'), 10);

                        if (expDivTop + expDiv.height() < aHeight) {
                            expDiv.height(aHeight - expDivTop);
                            $('body').height(aHeight).css('overflow-y', 'hidden');
                        }
                        $(".pageFooter").pinToFold();

                    };
                }, 500);
            }
        },
        arrowScrollTop: function () {
            $scope.scrolltop();
            setTimeout(function () {
                $("#gateway").focus();
            }, 500);

        },
        showSMNewAccnt: function () {
            $scope.setHash();
            ngDialog.closeAll();
            ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                    $timeout(function () {
                        $scope.createAccount.bSocialNetwork = true;
                    }, 100);
                },
                template: 'smNewAccntTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: true,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog"

            });
        },
        showInactivityLogoutDialog: function () {
            $scope.ShowTimeoutMessage = false;
            $location.hash("home");
            ngDialog.closeAll();
            $scope.ShowTimeoutMessage = true;
            if ($scope.tgSettings.SSOGateway != "1")
                $scope.showMobileSignInDialog($scope);
            else
                $scope.ShowTimeoutMessage = false;
        },
        showStandAloneJobDetails: function (val) {
            $scope.JobDetailsHash = val;
            var jobid = $scope.queryParams.jobid;
            if (((typeof $scope.queryParams.pagetype == "undefined" ||
                $scope.queryParams.pagetype.toLowerCase() != "jobdetails" ||
                !($scope.queryParams.pagetype.toLowerCase() == "jobdetails" &&
                window.location.hash.toLowerCase().toLowerCase().indexOf('jobdetails=' + jobid + "_" + (typeof $scope.queryParams.jobsiteid != "undefined" ? $scope.queryParams.jobsiteid : $scope.queryParams.siteid)) > -1))
                && window.location.hash.toLowerCase().indexOf('jobdetails') > -1)) {
                $timeout(function () {
                    $scope.bInitialPageLoad = true;
                    $(".MainContent").hide();
                });
                $scope.handlers.jobTitle($scope, true);
            }
        }
    });

    if ($("#pageType").val() == "") {
        $scope.loadwebtrackerscript("/TGNewUI/Home", $scope.customScriptRendering.Search);
    }

    $scope.powerSearchKeyWordSearch = _.clone($scope.keyWordSearch, true);

    $scope.powerSearchKeyWordSearch.labelText = null;

    $scope.powerSearchKeyWordSearch.prompt = null;

    $scope.powerSearchLocationSearch = _.clone($scope.locationSearch, true);

    $scope.powerSearchLocationSearch.prompt = null;

    $scope.powerSearchLocationSearch.labelText = null;

    $scope.$root.historyStateCallback = $scope.historyStateCallback || _.noop;
    $scope.$root.historyApplyCallback = $scope.historyApplyCallback || _.noop;

    $scope.$root.storeHistoryState = $scope.storeHistoryState || _.noop;

    $scope.$root.setPrevHash = $scope.setPrevHash || _.noop;

    //Changing the position to fix this RTC 101142
    $scope.updateCandidateZoneData();

    var savedSearchString = sessionStorage.getItem("savedSearch");
    if (savedSearchString != null) {
        $timeout(function () {
            $(".MainContent").hide();
        });
        var savedSearch = JSON.parse(savedSearchString);
        sessionStorage.removeItem("savedSearch")
        $scope.runSavedSearch(savedSearch);
    } else {
        $scope.showInitialJobs(false);
    }


    if (sessionStorage.getItem('showAssessmentsCompletionMessage') == null) {
        sessionStorage.setItem('showAssessmentsCompletionMessage', true);
    }
    if ($scope.tgSettings.ShowJobSearchHeader.toLowerCase() != 'never' && $(".swfCoreBannerLeft")) {
        $(".swfCoreBannerLeft").addClass("hasTGHeader");
    }


    if ($.queryParams().fromSM && $scope.bLoggedIn && $.queryParams().PageType != "searchresults" && $.queryParams().PageType != "jobdetails" && $.queryParams().PageType != "advancesearch" && $.queryParams().actiontype != "savesearchfromsearchresults" && $scope.standAloneGQ <= 0 && sessionStorage.getItem('pageType') != "portal") {
        $location.hash("home");

        setTimeout(function () {
            $scope.bresponsiveCandidateZone == true ? ($scope.bcandidatezoneSubmenu = true && $scope.responsivecandidateZoneView({ CandidateZoneLinkId: "dashBoard" })) : $scope.candidateZoneView();
        }, 1000);
        $scope.loadwebtrackerscript("/TGNewUI/Login", $scope.customScriptRendering.Search);


    }


    if ($scope.applyPreloadJSON) {
        if ($scope.searchResponse) {
            if (!$scope.applyPreloadJSON.WBMode && $scope.searchResponse.ApplyStatus != null && ($scope.searchResponse.ApplyStatus.Applied || $scope.searchResponse.ApplyDiff <= 0)) {
                $scope.ApplyDifference = $scope.searchResponse.ApplyDiff;
                $scope.AllowReApply = $scope.searchResponse.ApplyStatus != null ? $scope.searchResponse.ApplyStatus.AllowReApply : true;
                $scope.Applied = $scope.searchResponse.ApplyStatus != null ? $scope.searchResponse.ApplyStatus.Applied : false;
                $scope.LimitExceededMessage = $scope.searchResponse.LimitExceededMessage;
                $scope.bWelcome = false;
                $scope.bJobDetailsShown = true;
                $scope.bSearchResults = false;
                $scope.bSidebarVisible = false;


                if ($scope.tgSettings.SMLoginFlow.toLowerCase() != "yes")
                    $scope.bJobDetailsAPIError = true;
                else
                    $scope.bJobDetailsAPIError = false;

                //Job Detail redirection
                $scope.bInitialLoad = false;
                if ($scope.searchResponse.Jobdetails != null) {
                    $scope.jobDetailsFieldsToDisplay = $scope.searchResponse.JobDetailFieldsToDisplay;
                    $scope.jobDetailFields = $scope.searchResponse.Jobdetails;
                    $scope.isHotJob = _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "hotjob" }), "AnswerValue").toString().toLowerCase() == "yes";
                    $scope.searchResultsURL = "";
                    $scope.enableJobDetailsSendToFriend = $scope.tgSettings.SendToFriend.toLowerCase() == "yes" ? true : false;
                    $scope.enablePostToMySocialNetwork = $scope.tgSettings.EnablePostToMySocialNetworkLink.toLowerCase() == "yes" && $scope.tgSettings.SocialMedia != "" ? true : false;
                    $scope.jobDetailsUrlForSocialMedia = $scope.searchResponse.Jobdetails == null ? "" : $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + $("#siteId").val() + "&gqid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString(),
                    //$scope.jobDetailsUrlForSocialMedia = $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value") + "&gqid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString();
                    $scope.jobDetailsButtonText = $scope.tgSettings.JobDetailsSendToFriendButtonText != "" ? $scope.tgSettings.JobDetailsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend;
                }
                $scope.searchResultsURL = "";
                $("#title").nextUntil('meta[name=lcGlobalBaseUrl]', 'meta').remove();
                setTimeout(function () {
                    $scope.$apply();
                }, 0);
                var metaTag = $scope.tgSettings.JobDetailsMetaTagText.replace(/#ClientName#/g, $scope.tgSettings.PartnerName);
                var jobdesc = "";
                var jobtitl = "";
                if ($scope.searchResponse.Jobdetails != null) {
                    jobdesc = _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "jobdescription" }), "AnswerValue").toString();
                    jobdesc = jobdesc.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                    if (jobdesc.length > 50) {
                        jobdesc = jobdesc.substring(0, 50);
                    }
                    jobtitl = $scope.searchResponse.Jobdetails.Title.toString();
                    jobtitl = jobtitl.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                    if (jobtitl.length > 50) {
                        jobtitl = jobtitl.substring(0, 50);
                    }
                }
                $scope.ErrorMessageJobTitle = $scope.searchResponse.ApplyStatus.JobTitle != null ? $scope.searchResponse.ApplyStatus.JobTitle : jobtitl;

                metaTag = metaTag.replace("#JobDescription#", jobdesc);
                $("#title").after(metaTag.replace("#JobTitle#", jobtitl));
                if ($scope.searchResponse.Jobdetails != null && $scope.searchResponse.googlejobsMappingfielddataJson != null) {
                    $("#title").after($scope.searchResponse.googlejobsMappingfielddataJson);
                }
                $scope.JobDetailQuestionsSocialShare = $scope.searchResponse.Jobdetails.JobDetailQuestions;
                //$scope.handlers.JobdetailSocialShare();
                //
                $scope.ShowJobAlert = true;
                setTimeout(function () {
                    $scope.$apply();
                }, 0);
            }
            else {
                $scope.applyPreLoad = true;
                $scope.applyPreload();
            }
        }
    }
    $scope.getReqId = function (value) {
        return value.Value;
    };
    $scope.error_displayForgotPasswordLink = function () {
        if (window.matchMedia('only screen and (max-width: 768px)').matches) {
            setTimeout(function () {
                $(".newMsgContainer .invalidFieldsList").css({
                    display: 'inline'
                });
            }, 100)
        }
    }
    $scope.closeAssessmentCompletionStatus = function (value) {
        if (value) {
            if (sessionStorage.getItem('showAssessmentsCompletionMessage') == "false") {
                sessionStorage.setItem('showAssessmentsCompletionMessage', true);
            }
            else {
                sessionStorage.setItem('showAssessmentsCompletionMessage', false);
            }
        }
        else {
            $scope.currentAssessmentCompleted = false;
        }
    };
    //Track User's Inactivity

    $(window).resize(function () {
        if ($scope.bLoggedIn) {
            $scope.ResetInactivityTimer();
            if (typeof $scope.candidateZoneSubView != 'undefined' && $scope.candidatezoneSubView.toLowerCase() == "messagearchive")
                $scope.alignCards("Communication", "jobCard");
            $scope.adjustTSHeight();
        }
        $scope.mobileScreen = $(window).width() <= 768;
        if (appScope.$root.uiBooleans['bPhoneViewLinksVisible'] && $scope.mobileScreen) {
            $("#headerLinkContainer").css("visibility", "visible");
        }
        if ($(".responsiveCandZoneMenu").is(":visible") && $(window).width() >= 768) {
            $scope.responsivecandidateZoneView();
        }
        if (window.appScope) {
            setTimeout(function () {
                appScope.$apply();
            }, 0);
        }

        if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone) {

            if ($scope.candidatezoneDashBoardView == 'SavedSearches') {
                $scope.alignCards("SavedSearchesContainer", "jobCard");
            }
            else if ($scope.candidatezoneDashBoardView == 'SavedJobs') {
                $scope.alignCards("SavedJobsContainer", "jobCard");
            }
            else if ($scope.candidatezoneDashBoardView == 'Applications') {
                $scope.alignCards("ApplicationsContainer", "jobCard");
            }

            if ($scope.candidatezoneSubView == 'ResponsiveAssessment') {
                $scope.alignCards("AssessmentsContainer", "jobCard");
            }
            else if ($scope.candidatezoneSubView == 'ResponsiveReferrals') {
                $scope.alignCards("ActiveReferrals", "jobCard");
                $scope.alignCards("SentReferrals", "jobCard");
                $scope.$root.utils.ellipsis();
            }
            else if ($scope.candidatezoneSubView == 'applicationDetail') {
                $scope.contructAppDetailActions($scope.appliedApplicationDetail);
                $('select').selectmenu().selectmenu('close');
                if ($scope.AppDetailTab == 'document' || $scope.AppDetailTab == 'form') {
                    if ($scope.candPortalPacketView) {
                        $scope.alignCards("candPortalPocketDocList", "jobCard");
                    } else
                        $scope.alignCards("candPortalTab", "jobCard");
                }
            }
        }
        if ($("#profileBuilder").is(":visible")) {
            window.dynamicResizeIframe();
        }
        if ($scope.createAccount.showForgotPasswordLink) {
            $scope.error_displayForgotPasswordLink();
        }

    });
    $(document).on('click scroll mousedown', function (e) {
        if ($scope.bLoggedIn) {
            $scope.adjustHeaderStickers();
            $scope.ResetInactivityTimer();
        }
    });
    $scope.mobileScreen = $(window).width() <= 768;
    $scope.Inactivitytimer = null;

    $scope.updateCounter = function () {
        $scope.counter--;
        if ($scope.isNonProfileAllowed || $scope.AnonymousLoginType == 'ByPassGQLogin') {
            $scope.TimeoutWarning = $scope.dynamicStrings.IdleWarningSecondsInNonLogIn;
        }
        else {
            $scope.TimeoutWarning = $scope.dynamicStrings.IdleWarningSeconds;
        }
        if ($scope.TimeoutWarning.indexOf("[no of seconds]") > -1)
            $scope.TimeoutWarning = $scope.TimeoutWarning.replace("[no of seconds]", $scope.counter);
        else
            $scope.TimeoutWarning = $scope.dynamicStrings.IdleWarningSeconds + $scope.counter + $scope.dynamicStrings.IdleWarningSeconds2;
        $scope.Inactivitytimer = $timeout($scope.updateCounter, 1000);
        if ($scope.counter == 0) {
            $scope.counter = 0;
            $timeout.cancel($scope.countdown);
            $scope.Inactivitytimer = null;
            ngDialog.closeAll();
            $scope.logOutCandidate();
            if ($scope.tgSettings.SSOGateway != "1" && $scope.tgSettings.TimeOutSec > 0 && !(window.location.href.indexOf("ApplyWithPreLoad") > -1) && !$scope.isNonProfileAllowed && $scope.standAloneGQ <= 0)
                $scope.showMobileSignInDialog($scope);
            if ($scope.tgSettings.TimeOutSec > 0)
                $scope.ShowTimeoutMessage = true;
        }
    };
    $scope.$on('IdleStart', function () {
        if ($scope.Inactivitytimer == null) {
            $log.debug('IdleStart started.with counter' + $scope.counter);
            $timeout.cancel($scope.countdown);
            $scope.counter = 30;
            //ngDialog.closeAll();
            $scope.updateCounter();
            if ($scope.communicationPanelShown) {
                $("#notificationBoxContainer").slideToggle("fast", function () { });
                $scope.communicationPanelShown = false;
            }
            setTimeout(function () {
                $scope.InActivityWarning = ngDialog.open({
                    preCloseCallback: function (value) {
                        $.restoreFocus();
                    },
                    template: 'InActivityWarning', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                }), 0
            });

        }
    });
    $scope.ResetInactivityTimer = function () {
        $timeout.cancel($scope.Inactivitytimer);
        $scope.Inactivitytimer = null;
        Idle.unwatch();
        setTimeout(function () {
            Idle.watch();
            $scope.$apply();
        }, 0);
        if ($scope.InActivityWarning != undefined)
            $scope.InActivityWarning.close();
    };

    $scope.adjustHeaderStickers = function () {
        $timeout(function () {
            if ($(window).scrollTop() > $(".pageHeader").height()) {
                $(".jobSavedStatus, .headerStatusSticker:not(.float)").css('top', 0);
            }
            else if ($(window).scrollTop() < $(".pageHeader").height()) {
                $(".jobSavedStatus, .headerStatusSticker:not(.float)").css('top', $(".pageHeader").height() - $(window).scrollTop());
            }
        }, 10);
    };

    $scope.$watch(
        function ($scope) {
            return $scope.bLoggedIn
        },
     function (newValue, oldValue) {
         if (newValue != oldValue) {
             $scope.CollapsedAppliedApplications = false;
             $scope.CollapsedUnfinishedApplications = false;
             $scope.ActiveReferrals = false;
             $scope.SentReferrals = false;
         }
         if (newValue && typeof (response.ClientSettings.ByPassLoginUser) != "undefined" && $scope.tgSettings.ByPassLoginUser == 'True') {
             $scope.bBypassGQLogin = true;
             $scope.AnonymousLoginType = "ByPassGQLogin";
         }

         if (newValue && $scope.tgSettings.TimeOutSec > 0) {
             $scope.ShowTimeoutMessage = false;
             _.each($scope.oHistory, function (oPriorScope, sName) {
                 oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
             });
             $timeout.cancel($scope.Inactivitytimer);
             $scope.Inactivitytimer = null;
             Idle.setIdle(($scope.tgSettings.TimeOutSec - 30));
             Idle.setTimeout(30);
             Idle.watch();
             $log.debug('Activity track started.');
         }
         else {
             Idle.unwatch();
             $log.debug('Activity track stopped.');
         }
     });

    //End Track User's Inactivity
});
searchApp.config(['$locationProvider', function ($locationProvider) {
    if (typeof $("#AssessQString") != undefined && $("#AssessQString").val() != undefined && $("#AssessQString").val() != "")
        $locationProvider.html5Mode(false);
    else
        $locationProvider.html5Mode(true);
}]);
searchApp.config(function (IdleProvider, KeepaliveProvider) {
    KeepaliveProvider.interval(1);
});
function SocialNetworkReferral(scope, event) {
    if (appScope.bresponsiveCandidateZone && appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
        if (appScope.SocialReferral_READY == "yes") {
            appScope.SocialReferral_READY == "no";
            appScope.ReferrButtonCalledFrom = "";
            scope.LaunchSocialReferralMenu(scope, event.target);
        } else {
            appScope.ReferrButtonCalledFrom = "General Referral Menu";
            appScope.renderReferralQuestions();
        }
    }
    else if (appScope.SocialReferral_READY == "yes") {
        appScope.jobIds = scope.jobIds;
        scope.LaunchSocialReferralMenu(scope, event.target);
    }
    else {
        appScope.jobIds = scope.jobIds;
        redirectPage = "socialnetworkreferral.aspx";
        postValues = { ButtonId: "SubmitGeneralReferral", hdRft: $("#rfToken").val() }
        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
    }
}

searchApp.controller('viewassessments', function ($scope, $http, $timeout, $window, $compile, $location) {

    $scope.alignCards = function (container, elementClass) {

        $("." + container + " ." + elementClass).css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');
        $timeout(function () {
            var heights = $("." + container + " ." + elementClass).map(function () {
                return $(this).height();
            }).get();
            var maxHeight = _.max(heights);
            $("." + container + " ." + elementClass).height(maxHeight).find('.cardFooter').addClass('cardFooterPosition');
        }, 0);

    };

    $scope.renderAssessments = function () {
        $scope.PendingAssessmentsUrl = "/TgNewUI/CandidateZone/Ajax/ViewAssessments?q=" + $("#AssessQString").val();
        window.location.reload();

    };
    $scope.OpenCloseAssessments = function (hrefUrl) {
        var Assesmentwindow = window.open(hrefUrl, "Assessments")
        //, "height=200,width=200,left=0,top=0,directories=0,menubar=0,resizable=1,status=0,titlebar=0,toolbar=0,location=0,personalbar=0,scrollbars=yes,scrollbars=1", false);

        //Assesmentwindow.onunload = function () {
        //    $scope.renderAssessments();
        //};
    };
    $timeout(function () {
        $(".title").css("padding-top", "30px");
    }, 1000);
    $scope.bStandAloneAssessView = true;
    $scope.ExpiredAssessments = $scope.assessresponse.ExpiredAssessments;
    ($scope.ExpiredAssessments != null && $scope.ExpiredAssessments.length > 0) ? $scope.bShowExpiredAssesmentAlert = true : $scope.bShowExpiredAssesmentAlert = false;
    $scope.PendingAssessments = $scope.assessresponse.PendingAssessments;
    $scope.BrandingConfiguration = $scope.assessresponse.BrandingConfiguration;
    $scope.AutoLaunchAssessUrl = $scope.assessresponse.AutoLaunchAssessUrl;
    $timeout(function () {
        $scope.alignCards("AssesmentsCards", "jobCard");
    }, 1000);
    window.AssessmentScope = $scope;
    $scope.$root.AssessmentScope = $scope;
    if ($scope.AutoLaunchAssessUrl != null && $scope.AutoLaunchAssessUrl != "") {
        $scope.OpenCloseAssessments($scope.AutoLaunchAssessUrl);
    }
});

function refreshAssess() {
    if (typeof window.appScope != 'undefined')
    { window.appScope.renderAssessments(""); }
    else if (typeof window.AssessmentScope != 'undefined')
    { window.AssessmentScope.renderAssessments(); }
}
//<!-- This is to refresh the responsive page after a classic GQ apply-->
function reload() { window.appScope.RefreshSession(); }
function createRefFormAutocomplete(event) {
    var $autoinput = $(this).closest(".fieldcontain").find("input[id*='Auto_']");

    var ss = $autoinput.attr('id').replace('Auto_', '').replace("_slt", "").replace("_mslt", "");

    var fieldParams = $autoinput.attr('id').replace('Auto_', '').split("_");
    var questionId = fieldParams[0];
    var questionType = fieldParams[1] == "mslt" ? "multi-select" : "single-select";
    var fieldType = fieldParams[1];
    var optQuestionId = $autoinput.attr('id') + "_listbox";


    window.pageSize = 15;
    this.pageIndex = 0;
    window.isBlanketSearch = 0;
    $(this).removeClass("ui-complete");

    var appScope = window.appScope;
    var tgSettings = window.appScope.tgSettings;

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
            // DomFunc.selectItem(ui, "#" + ss);

            // this is needed to deal with '.' used by adp in the wotc flow
            select = "#" + ss.split(".").join("\\."); //.replace('.', "\\.");
            var $selectControl = $(select);
            var $clearbtn = $("#" + $selectControl.attr("name") + "-input").parent().find("a");


            if (typeof $selectControl.attr("multiple") == "undefined") {
                $selectControl.find("option:selected").each(function () { $(this).removeAttr("selected"); $(this).prop("selected", false); });
            }

            $selectControl.find("option[value='" + ui.item.value + "']").first().prop("selected", "selected");
            $selectControl.change();

            if (typeof $selectControl.attr("multiple") != "undefined") {

                var $group = $selectControl.closest(".fieldcontain").find("fieldset");
                // this.updateMultiSS($group, $selectControl);
            }
            else {
                $clearbtn.removeClass("custom-icon-angle-down");
                $clearbtn.addClass("icon-remove");
            }
            $selectControl.closest(".fieldcontain").find("input.ui-search-widget").removeClass("error");
            //$selectControl.valid();

            if (fieldType == "mslt") {
                angular.element($autoinput).scope().toggleSelection(event, ui);
                $autoinput[0].style.marginBottom = '5px';
            }
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
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSession: $("#CookieValue").val(),
                Localeid: tgSettings.deflocaleid,
                PageNumber: this.pageIndex,
                SearchString: request.term == -1 ? "" : request.term,
                QuestionId: questionId
            });
            $autoinput.autocomplete("option", "minLength", 0);
            if (document.getElementById("autocomplete_" + questionId) != null) {
                var optionsJson = jQuery.parseJSON(document.getElementById("autocomplete_" + questionId).value);
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                var filteredOptionsJson = $.grep(optionsJson, function (item, index) {
                    // return matcher.test(item.Description);
                    if (request.term != "-1")
                        return (item.FieldLabel.toLowerCase().indexOf(request.term.toLowerCase()) >= 0)
                    else
                        return true;
                });
                var listCount = filteredOptionsJson.length;
                var $ss = $("#" + questionId);

                this.pageIndex = this.pageIndex || 0;

                filteredOptionsJson = filteredOptionsJson.slice(this.pageIndex * window.pageSize, this.pageIndex * window.pageSize + window.pageSize);
                response($.map(filteredOptionsJson, function (v, i) {
                    return {
                        label: v.FieldLabel,
                        value: v.FieldName,
                        QBChildren: v.QBChildren
                    };
                }), listCount);
                var opts = "";
                var alreadyPresentoptions = $ss.html();
                $.each($("#" + ss + " option:selected"), function (i, val) {
                    if ($(val).attr("selected") != "selected") {
                        var qbchild = $(val).attr("QBChildren") ? $(val).attr("QBChildren") : "";
                        opts += "<option value='" + $(val).val().replace(/'/g, "&#39;") + "' selected='true'>" + val.label + "</option>";
                    }
                });
                if (request.append)
                    $ss.html(alreadyPresentoptions);
                else
                    opts += alreadyPresentoptions;

                $.each(filteredOptionsJson, function (i, val) {

                    if ($("#" + ss + " option[value='" + val.FieldName.replace(/'/g, "&#39;") + "']:selected").length == 0) {
                        var qbchild = val.QBChildren ? val.QBChildren : "";
                        opts += "<option value='" + val.FieldName.replace(/'/g, "&#39;") + "'>" + val.FieldLabel + "</option>";
                    }
                });

                if (request.append)
                    $ss.append($(opts));
                else
                    $ss.html(opts);

                var AutoList = {};
                $("#" + ss + " > option").each(function () {
                    if (AutoList[this.value]) {
                        $(this).remove();
                    } else {
                        AutoList[this.value] = this.value;
                    }
                });
                $autoinput.removeAttr("placeholder");
            }
            else {
                $.ajax({
                    url: "/TgNewUI/CandidateZone/Ajax/GetAutoCompleteOptionsList",
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
                                var qbchild = $(val).attr("QBChildren") ? $(val).attr("QBChildren") : "";
                                opts += "<option value='" + val.FieldName.replace(/'/g, "&#39;") + "' selected='true' QBChildren='" + qbchild + "'>" + val.FieldLabel + "</option>";
                            });
                        }
                        $.each(data.Options, function (i, val) {

                            if ($("#" + ss + " option[value='" + val.FieldName.replace(/'/g, "&#39;") + "']:selected").length == 0) {
                                var qbchild = val.QBChildren ? val.QBChildren : "";
                                opts += "<option value='" + val.FieldName.replace(/'/g, "&#39;") + "' QBChildren='" + qbchild + "'>" + val.FieldLabel + "</option>";
                            }
                        });

                        response($.map(data.Options, function (v, i) {

                            return {
                                label: v.FieldLabel,
                                value: v.FieldName,
                                QBChildren: v.QBChildren
                            };

                        }
                            ), data.totalcount);

                        if (request.append)
                            $("#" + ss).append($(opts));
                        else
                            $("#" + ss).html(opts);

                        var AutoList = {};
                        $("#" + ss + " > option").each(function () {
                            if (AutoList[this.value]) {
                                $(this).remove();
                            } else {
                                AutoList[this.value] = this.value;
                            }
                        });

                        $autoinput.removeAttr("placeholder");

                    }
                });
            }
        }
    });
    $autoinput.blur(function () {
        if (!$autoinput[0].attributes.hasOwnProperty("multiselect") && $autoinput.val() == "") {
            $('#' + ss).find('option').remove().end();
        }
        $autoinput.attr("placeholder", appScope.dynamicStrings.PlaceHolder_AutoComplete);
        $autoinput.autocomplete("option", "minLength", 1);
    });

    //$(this).change();
}
function ChangetoDefaultDateFormat(inputDate) {
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

/*=== RTC#82416_ to handle private browsing on safari ===*/
function retry(isDone, next) {
    var current_trial = 0, max_retry = 50, interval = 10, is_timeout = false;
    var id = window.setInterval(
        function () {
            if (isDone()) {
                window.clearInterval(id);
                next(is_timeout);
            }
            if (current_trial++ > max_retry) {
                window.clearInterval(id);
                is_timeout = true;
                next(is_timeout);
            }
        },
        10
    );
}
function removeInvalidClass(element) {
    element.find(".fieldcontain").removeClass('invalid');
}
function detectPrivateMode(callback) {
    var is_private;
    if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
        try {
            window.localStorage.setItem('test', 1);
        } catch (e) {
            is_private = true;
        }

        if (typeof is_private === 'undefined') {
            is_private = false;
            window.localStorage.removeItem('test');
        }
    }

    retry(
        function isDone() {
            return typeof is_private !== 'undefined' ? true : false;
        },
        function next(is_timeout) {
            callback(is_private);
        }
    );
}
/*=== RTC#82416_ to handle private browsing on safari ===*/

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
eventer(messageEvent, function (e) {
    if (e.data === "cpformcompleted" || e.message === "cpformcompleted") {
        window.appScope.CloseCandPortalIframe(true);
    } else if (e.data.height) {
        if (typeof window.appScope != 'undefined') {
            window.appScope.bLoadCandPortalForm = false;
            window.appScope.scrolltop();
        }
        $('#PortalForm').height(e.data.height);
    }
})
