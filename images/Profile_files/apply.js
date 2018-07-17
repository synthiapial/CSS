/*°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸


  Licensed Materials - Property of IBM5725-N92© Copyright IBM Corp.
  2014, 2017.US Government Users Restricted Rights- Use,
  duplication or disclosure restricted by GSA ADP Schedule Contract  with IBM Corp.
  

°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸*/

(function (module) {

    var pageType = {
        introduction: 1,
        custom: 2,
        review: 3,
        thankyou: 4,
        knockout: 5,
        confirmation: 6,
        error: 500


    };
    module.controller('pageController', function ($scope, $http, $compile, $timeout, $location, $sce, ngDialog) {
        $scope.AttachmentBack = false;
        dynamicResizeIframe = function () {
            setTimeout(function () {
                $("#profileBuilder").height($("#profileBuilder").contents().find(".ImportProfile").height() + (-10) + "px");
            }, 10);
        };

        appScope.bCreateAccount = false;
        if (appScope.$root.workFlow == "apply") {
            var omitHistoryNames = [];
            appScope.$root.oHistory = _.omit(appScope.oHistory, ['Applypage']);
            previousHashes = _.without(previousHashes, 'Applypage');
            $location.hash("Applypage");
            if (appScope.bjobInAGroupExpired)
                $scope.bjobInAGroupExpired = true;
           
        }

        var page =
           {

               processing: false,
               knockedout: 0,
               currentpage: 1,
               pagedetails: [],
               progresstracker: 0,
               btnprogress: null,
               errormsgs: [],
               reload: false,
               submitmode: false,
               showSuccessMessage: false,
               readOnlyFieldEncounter: false,
               hiddenFields: {},
               maxJobTitlesToShow: 3,
               importedResumeId: 0,
               importedResumeName: "",
               showBack: function () {
                   if (this.pagetype == pageType.introduction) {
                       var result = false;
                       if ($scope.$root.oHistory != undefined) {
                           for (var property in $scope.$root.oHistory) {
                               if (property.indexOf("jobDetails") >= 0 || appScope.bSelectedGroup || (appScope.bCandidateZone && appScope.bJobCart) || (appScope.bSidebarVisible && appScope.bSearchResults)) {
                                   result = true;
                                   break;
                               }
                           }
                       }
                       if ($.queryParams()["calledFrom"] != undefined) {
                           result = true;
                       }
                       return result;
                   }
                   else {
                       return this.currentpage > 1 && this.pagetype != pageType.thankyou && this.pagetype != pageType.introduction && this.pagetype != pageType.knockout;
                   }
               },
               loadwebtrackerscript: function () {
                   var datascript = "";
                   var cmvalue = 0;
                   var key = "/TGNewUI/GQ";
                   var cmConversionStage = 3;

                   if (this.pagetype == pageType.introduction && page.webtrackerscriptloaded != 2) {
                       cmConversionStage = 1;
                   }
                   else if ((this.pagetype == pageType.confirmation || this.pagetype == pageType.thankyou || this.pagetype == pageType.knockout) && page.webtrackerscriptloaded != 3) {
                       cmConversionStage = 2;
                   }

                   if (page.partnerid != undefined && (page.webtrackerscriptloaded == undefined || page.webtrackerscriptloaded != 1)) {
                       if (this.pagetype == pageType.confirmation || this.pagetype == pageType.thankyou || this.pagetype == pageType.knockout) {
                           page.webtrackerscriptloaded = 3;
                       }
                       else {
                           page.webtrackerscriptloaded = 1;
                       }

                       var webtrackerRequest = {
                           PartnerId: page.partnerid,
                           SiteId: page.siteid,
                           PageId: key,
                           GetBodyTag: true,
                           PageType: this.pagetype
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
                   }
               },
               showNext: function () {

                   return this.pagetype == pageType.custom;
               },
               showDraft: function () {
                   return this.pagetype != pageType.thankyou && this.pagetype != pageType.knockout && this.pagetype != pageType.confirmation && this.pagetype != pageType.error && !this.isReviewEdit;
               },
               showImport: function () {
                   return this.profilewidget == "true" && this.hasreadonlyprofilefields == "false";

               },
               showStart: function () {
                   return this.pagetype == pageType.introduction;
               },
               hashChange: function (next) {
                   var hashPageId = next.split("##pageid=")[1];
                   var pd = this.pagedetails;

                   if (pd[this.currentpage - 1] && hashPageId == pd[this.currentpage - 1].pageid) {
                       this.goBack();
                   }
                   else if (pd[this.currentpage + 1] && hashPageId == pd[this.currentpage + 1].pageid) {
                       this.goNext();
                   }
               },
               backHandler: function () {
                   history.back();
               },
               goBack: function ($event) {

                   if (this.processing || this.wbpagepreview == "true" || this.pagetype == pageType.thankyou || this.pagetype == pageType.knockout) {
                       return false;
                   }
                   var wotc = eval('(' + $("#wotc").val() + ')');
                   if (this.isReviewEdit) {
                       if (wotc) {
                           $scope.AttachmentBack = true;
                           this.nextpageid = this.reviewPageID;
                           this.isReviewEdit = false;
                       }
                       else if ($("form[name='applyForm']").valid()) {
                           $scope.AttachmentBack = true;
                           this.nextpageid = this.reviewPageID;
                           this.isReviewEdit = false;
                       }
                       else {
                           return false;
                       }
                   }
                   else if (this.pagetype == pageType.introduction) {
                       if ($.queryParams()["calledFrom"] != undefined) {
                           if ($.queryParams()["calledFrom"] == "SelectedGroup")
                               window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + page.siteid + "&PageType=selectedgroup";
                           else if ($.queryParams()["calledFrom"] == "JobDetails")
                               window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + page.siteid + "&JobId=" + page.reqid + "&PageType=jobdetails";
                           else if ($.queryParams()["calledFrom"] == "SearchResults")
                               window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + page.siteid + "&PageType=searchresults";
                           else if ($.queryParams()["calledFrom"] == "JobCart")
                               window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + page.siteid + "&PageType=jobcart";
                       }
                       else {

                           $scope.$root.workFlow = "notapply";
                           history.back();
                       }
                   }
                   else if (this.pagedetails[this.currentpage] != undefined && (this.SavedDraftPageID == this.pagedetails[this.currentpage].pageid)) {
                       $scope.$root.workFlow = "notapply";
                       history.back();
                   }
                   else {
                       this.currentpage = this.currentpage - 1;
                       this.nextpageid = this.pagedetails[this.currentpage].pageid;
                       this.nextsectionid = this.pagedetails[this.currentpage].sectionid;
                   }
                   if (this.pagetype != pageType.introduction && $scope.$root.workFlow == "apply") {
                       $scope.AttachmentBack = true;
                       this.errormsgs = [];
                       this.processing = true;
                       this.wotcBack = true;
                       submitPage($event);
                   }

               },

               goBackToApplicationDetail: function () {
                   history.back();
               },

               goWotcOptOut: function ($event) {
                   $.shout("goWotcOptOut", $event);
                   this.wotcOptOut = true;
                   this.goNext($event);
               },

               createAccountAndGoNext: function ($event) {
                   if (!appScope.bLoggedIn) {
                       appScope.CreateAnonymousLogin("NoLogin", function () {
                           page.goNext($event);
                       });
                   }
                   else {
                       page.goNext($event);
                   }
                   
               },

               goNext: function ($event) {
                   $.shout("goNext", $event);
                   getNextAction(this);
                   if (!(this.knockedout > 0))
                   {
                       if ($("#profile_-4_0_mbcountry_slt_0_0-input").is(':visible')) {
                           var mbCountryInputElement = $("#profile_-4_0_mbcountry_slt_0_0");
                           var validTerm = false;
                           if (mbCountryInputElement.find('option:selected').length > 0 && typeof $("#profile_-4_0_mbcountry_slt_0_0-input").val() != "undefined" && typeof mbCountryInputElement.find('option:selected').text() != "undefined" && mbCountryInputElement.find('option:selected').text().trim() == $("#profile_-4_0_mbcountry_slt_0_0-input").val().trim()) {
                               validTerm = true;
                           }

                           if (!validTerm) {
                               mbCountryInputElement.val('');
                           }
                       }
                       if ((this.wotcOptOut || $("form[name='applyForm']").valid()) && !this.processing && this.wbpagepreview != "true") {

                           if (!page.validateEduExp()) { // this validation is needed when there are missing fields in education/experience during profile import

                               $timeout(function () { $("form[name='applyForm']").valid() }, 0);
                               return;
                           }
                       }
                       else {

                           return false;
                       }
                   }
                   $scope.submit = true;
                   if (!this.isReviewEdit) {
                       this.currentpage = this.currentpage + 1;
                       $.shout("currentpage", this.currentpage);
                   }
                   else {
                       this.nextpageid = this.reviewPageID;
                       $.shout("nextpageid", this.nextpageid)
                   }
                   this.processing = true;                   
                   this.errormsgs = [];
                   this.isSaveAndContinue = true;//To Track and hide Save For Later Link, While Save and Continue hit.
                   this.submitmode = (this.pagetype == pageType.review);
                   $.shout("this.submitmode", this.submitmode);
                   $scope.AttachmentBack = false;
                   submitPage($event);

               },
               pageTypeCssClass: function () {
                   return _.findKey(pageType, function (val) {
                       return val == page.pagetype;
                   });
               },
               reviewEdit: function (pageid) {
                   $scope.AttachmentBack = true;
                   this.isReviewEdit = true;
                   this.reviewPageID = this.pageid;
                   this.nextpageid = pageid;
                   submitPage();

               },
               reloadProfile: function (showMessage) {
                   if (window.parent.appScope.$root.workFlow == 'candidateZone' && window.parent.appScope.candidatezoneSubView == "jobProfile") {
                       if (showMessage !== undefined) {
                           window.parent.appScope.profileImportStatus = (showMessage == "300") ? 0 : 1;
                       } else {
                           window.parent.appScope.profileImportStatus = 11;
                       }
                       window.parent.appScope.promptGoogleLogout($("#isFromDrive").val());
                       window.parent.appScope.editProfileView();
                       window.parent.appScope.CloseDialogs();
                       return;
                   }
                   this.reload = true;
                   this.errormsgs = [];
                   this.nextpageid = this.pageid;
                   this.nextsectionid = this.sectionid;
                   this.pageid = this.pagedetails[this.currentpage - 1].pageid;
                   ngDialog.closeAll();
                   submitPage();
                   if (showMessage != undefined) {
                       page.showSuccessMessage = (showMessage == "300") ? false : true;
                   }

               },
               reloadProfileForResume: function (resumeId, resumeName, googleLoggedIn, readOnlyFieldEncounter) {
                   if (resumeId) {
                       page.importedResumeName = resumeName;
                       page.importedResumeId = resumeId;
                   }
                   this.reload = true;
                   this.errormsgs = [];
                   this.nextpageid = this.pageid;
                   this.nextsectionid = this.sectionid;
                   this.pageid = this.pagedetails[this.currentpage - 1].pageid;
                   ngDialog.closeAll();
                   if (googleLoggedIn == "googledrive") {
                       $scope.SubmitAfterGoogleLogout = true;
                       ngDialog.open({
                           preCloseCallback: function (value) {
                               $.restoreFocus();
                           },
                           template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                       });
                   }
                   else {
                       submitPage();
                       page.showSuccessMessage = true;
                       if (readOnlyFieldEncounter !== "undefined" && readOnlyFieldEncounter)
                           page.readOnlyFieldEncounter = true;

                   }

               },
               saveDraft: function ($event) {
                   if (this.wbpagepreview != "true") {
                       this.draftmode = true;
                       this.currentpage = this.currentpage + 1;
                       submitPage($event);
                   }
               },
               showSubmit: function () {
                   return this.pagetype == pageType.review;
               },
               showProgress: function () {
                   return this.pagetype == pageType.introduction || this.pagetype == pageType.custom || this.pagetype == pageType.review || this.pagetype == pageType.thankyou || this.pagetype == pageType.confirmation || this.pagetype == pageType.knockout;
               },
               setPageActions: function () {

                   var metaData = angular.fromJson($("#pagemetadata").val()),
                       testPercentage;

                   _.assign(page, metaData);

                   page.reload = false;
                   page.wotcBack = false;
                   page.wotcOptOut = false;
                   page.wotcErrorNodeMissing = metaData.wotcError;
                   page.wotcPageReviewId = metaData.wotcPageReviewId;

                   if (page.sequence > 1 && !page.isReviewEdit) {
                       if (page.pagedetails.length == 0)
                           page.fromdrafts = true;
                       page.currentpage = page.sequence;
                       page.pagedetails[page.currentpage - 1] = { pageid: page.prevpageid };

                   }

                   //testPercentage = Math.round(((page.currentpage - 2) / (page.pagecount - 2)) * 100);
                   //41839: changed the percent logic so that Review displays as 99% instead of let's say 80%. The latter seems to indicate there is more to do beyond Review when there is only the thank you page
                   //Changed the lower part of the fraction to go till 99% until review
                   testPercentage = Math.round(((page.currentpage - 2) / (page.pagecount - 3)) * 99);

                   if (page.currentpage == 2 || page.pagetype == pageType.introduction) {
                       testPercentage = 0;
                   }
                   $('#menuContainer').empty();
                   if (page.pagetype == pageType.thankyou || page.pagetype == pageType.knockout) {
                       testPercentage = 100;
                   }
                   if (testPercentage >= 0 && testPercentage <= 100)//failsafe to previous value
                       page.progresstracker = testPercentage;

                   page.percentCompletedStyle = { width: page.progresstracker + "%" };


                   if (page.pagedetails.length == 0 || page.fromdrafts) {

                       page.tgSettings = angular.fromJson($("#tgsettings").val());

                       //try catch added for iOS Chrome issue..
                       try {
                           $scope.$apply();
                       }
                       catch (Error) { $.shout("Error", Error, Error.name, Error.message); }

                       setTimeout(function () {
                           initFormsMethods();

                       }, 0)

                       page.fromdrafts = false;
                   }


                   $(".pageFooter").pinToFold(true);
                   if (typeof page.viewSubmittedApplication == "undefined" || page.viewSubmittedApplication == null || page.viewSubmittedApplication.toLowerCase() == "false") {
                       $("#pagecontent, .buttonContainer").setFocus();
                   }
                   //if (window.parent.appScope.$root.workFlow != 'candidateZone' && !page.isReviewEdit) {
                   //    if ($scope.utils.isNewHash("pageid=" + page.pageid, $scope))
                   //        $location.hash("pageid=" + page.pageid);
                   //    else
                   //        history.back();
                   //}
                   page.pagedetails[page.currentpage] = { pageid: page.pageid, sectionid: page.sectionid };

                   parseScriptTags();
                   if (page.isErrorPage != "true") {
                    page.loadwebtrackerscript();
                   }
                   if (!this.isReviewEdit && page.wotcErrorNodeMissing == "WOTC_RESPONSE_MISSING") {
                       page.wotcCompleted = false;
                       page.reviewEdit(page.wotcPageReviewId);
                   }
                   if (page.pagetype == pageType.introduction) {
                       _.delay(function () {
                           $(window).scrollTop(0);
                       });
                   }

                   //Before Creating Auto Complete, Ensuring that View has completely binded -- In IE11 there is an issue in View binding when the data has some accent characters, which causes the autocomplete to directly load.
                   //So, Introducing a delay to create an auto complete, such that all the view related binding operations will be completed by this time.
                   setTimeout(function () {
                       //Updating and Setting ApplyPageData into the hash

                       var applyHashData = {
                           ReqID: page.reqid,
                           TQID: page.tqid,
                           SiteId: page.siteid,
                           SID: page.sid,
                           ApidId: page.aipid,
                           LocaleId: page.localeid,
                           GQSessionID: page.gqsessionid,
                           PageId: page.pageid
                       }
                       appScope.$root.oHistory[$location.hash()].applyHashData = $scope.$root.oHistory[$location.hash()].applyHashData = $scope.oHistory[$location.hash()].applyHashData = applyHashData;
                       // adding this here to make sure the UL for the combo box exists on page load to avoid avt1 violations
                       $("div.ui-autocomplete").each(function () {
                           $scope.utils.createFormAutocomplete(this);
                       });
                   }, 300);
                   setTimeout(function () {
                       appScope.setTitle('apply');
                   }, 400);
               },
               uploadServices: function (calledFrom, AttachmentCat) {
                   if (this.wbpreview == "true" || this.wbpagepreview == "true") {
                       return;
                   }
                   var title = '';
                   if (calledFrom == "profile") {
                       title = appScope.dynamicStrings.CreateProfile;
                   }
                   else if (calledFrom == "resume") {
                       title = appScope.dynamicStrings.Heading_AddResume;
                   }
                   else if (calledFrom == "coverletter") {
                       title = appScope.dynamicStrings.Heading_AddCoverLetter;
                   }
                   else if (calledFrom == "Attachments" && typeof AttachmentCat != "undefined") {
                       var indexOfDot = AttachmentCat.indexOf(".");
                       title = appScope.dynamicStrings.Title_Attachments.replace("[Category]", AttachmentCat.substr(indexOfDot + 1).replace("'", "&apos;"));
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
                       template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='" + title + "' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + page.partnerid + "&siteid=" + page.siteid + "&calledFrom=" + calledFrom + "&AttachmentCat=" + encodeURI(AttachmentCat) + "&NoOfAttachments=" + $scope.NoOfAttachments + "' tabindex='0'> </iframe>",
                       //template: "<iframe 'scrolling=no' allowtransparency='true' id='profileBuilder' height='100%' width='100%' src='../../Profile/Home/ProfileBuilder?partnerId=11713&siteId=6786&encryptedSessionId=^BtwhqVBm/UVWG7f3Yjw2svJgCnSNA7NnRySV08WQSKEMqjVi4dGlZOfwUvw3D1DAm0qvkLv1x0jm0EGxpdnWSUPzOpPqOkVUC6XEjJ3En18='></iframe>",
                       plain: true,
                       className: 'ngdialog-theme-default dialogWithIFrame',
                       showClose: false,
                       closeByDocument: false
                   });
               },

               openSMSConsentPopUp: function () {

                   setTimeout(function () {
                       ngDialog.open({
                           preCloseCallback: function (value) {
                           },
                           template: 'SMSMessagingCandConsentPopupMsg', scope: $scope, className: 'ngdialog-theme-default customDialogue SMSMessagingCandConsentPopup', showClose: true, closeByDocument: false, ariaRole: "dialog"
                       });
                   }, 0);
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

               buildResume: function () {
                   $scope.buildResume = !$scope.buildResume;
                   if ($scope.buildResume) {
                       $scope.attachedResumeName = "ResumeBuildFromProfile";
                       $scope.attachedResumeId = "-5";
                       $("#buildResume").val("1");
                   } else {
                       $scope.attachedResumeName = "";
                       $scope.attachedResumeId = "";
                       $("#buildResume").val("0");
                   }
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
               addRemoveEducation: function (mode, $index, $event, confirmed) {
                   if (mode == "add") {
                       if (!this.education)
                           this.education = [];

                       this.education.unshift(_.assign({ updateMode: true }, this.educationDetails));
                       $timeout(function () {
                           $("html,body").animate({ scrollTop: $(".edu0").offset().top - 50 }, 500);
                       });
                   }
                   else {
                       if (!confirmed) {

                           this.openProfileWarningDialog($index, 'edu', $event);
                       }
                       else {
                           this.education.splice($index, 1);
                           if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                               setTimeout(function () { $("#addEdu").focus(); })
                           }
                           else {
                               setTimeout(function () { $($event.target).focus(); })
                           }
                       }
                   }
               },
               addRemoveExperience: function (mode, $index, $event, confirmed) {

                   if (mode == "add") {
                       if (!this.experience)
                           this.experience = [];

                       this.experience.unshift(_.assign({ updateMode: true }, this.experienceDetails));
                       $timeout(function () { $("html,body").animate({ scrollTop: $(".exp0").offset().top - 50 }, 500); });
                   }
                   else {
                       if (!confirmed) {

                           this.openProfileWarningDialog($index, 'exp', $event);
                       }
                       else {
                           this.experience.splice($index, 1);
                           if ($("#addExp") != undefined && $("#addExp").length > 0) {
                               setTimeout(function () { $("#addExp").focus(); })
                           }
                           else {
                               setTimeout(function () { $($event.target).focus(); })
                           }

                       }
                   }
               },
               saveEducation: function ($index) {
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
                   if (validEdu) {
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
                       $timeout(function () { $("html,body").animate({ scrollTop: $(".edu0").offset().top - 50 }, 500); });
                       if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                           setTimeout(function () { $("#addEdu").focus(); })
                       }
                       else {
                           setTimeout(function () { $("#updateEdu" + $index).focus(); })
                       }
                   }
                   else {
                       $("html,body").animate({ scrollTop: invalidElement.offset().top - 100 }, 500);
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
                   $($event.target).closest(".widgetinner").setFocus();
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
                   removeInvalidClass($(".edu" + $index));
               },
               saveExperience: function ($index) {
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
                   if (validExp) {
                       this.experience[$index].updateMode = false;
                       this.experience[$index].Saved = true;
                       $.htmlEncodeSpecial(this.experience[$index]);
                       for (var k in this.experience[$index]) {
                           if (typeof this.experienceDetails[k] != "undefined") {
                               this.experience[$index][k + "_default"] = this.experience[$index][k];
                           }

                       }
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
                       invalidElement.focus();

                   }
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
               },
               isUpdateEdu: function ($index) {
                   return this.education[$index].updateMode;
               },
               isUpdateExp: function ($index) {
                   return this.experience[$index].updateMode;
               },
               showMostRecent: function (mode, $index) {
                   var recordIndex = -1;

                   if (mode == "edu") {
                       recordIndex = _.findIndex(page.education, function (n) {
                           return n.MostRecent == 1 || n.MostRecent;
                       });

                   }
                   else {
                       recordIndex = _.findIndex(page.experience, function (n) {
                           return n.MostRecent == 1 || n.MostRecent;
                       });

                   }
                   return recordIndex == -1 || recordIndex == $index;
               },
               //Function to update the MostRecent variable to zero for education/experience's apart from current one.
               updateMostRecent: function (mode, currentObj) {
                   currentObj.MostRecent = (currentObj.MostRecent == 1) ? 0 : 1;
                   currentObj.MostRecent_default = currentObj.MostRecent;
                   if (mode == "edu") {
                       _.each(this.education, function (eachEduObj) {
                           if (eachEduObj != currentObj) {
                               eachEduObj.MostRecent = 0;
                               eachEduObj.MostRecent_default = 0;
                           }
                       });
                   } else {
                       _.each(this.experience, function (eachExpObj) {
                           if (eachExpObj != currentObj) {
                               eachExpObj.MostRecent = 0;
                               eachExpObj.MostRecent_default = 0;
                           }
                       });
                   }
               },
               showInvalidDetails: function () {
                   $(".fieldcontain.invalid").eq(0).scrollAndFocus();
               },
               openProfileWarningDialog: function ($index, mode, $event) {
                   ngDialog.open({
                       template: mode + "RemoveTemplate",
                       className: "ngdialog-theme-default profileWarningDialog",
                       controller: ['$scope', function ($scope) {
                           $scope.mode = mode;
                           $scope.currentProfileIndex = $index;
                           $scope.removeProfileData = function () {
                               if ($scope.mode == "edu") {
                                   page.addRemoveEducation('remove', $scope.currentProfileIndex, $event, true)
                               }
                               else {
                                   page.addRemoveExperience('remove', $scope.currentProfileIndex, $event, true)

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
               scrollToInvalidField: function (scope) {
                   $(".fieldcontain.invalid").eq(scope.$index).scrollAndFocus();
               },
               viewSavedDrafts: function () {
                   if (appScope.bresponsiveCandidateZone) {
                       appScope.bCandidateZone = true;
                       if (typeof (appScope.encryptedBruid) == "undefined" || appScope.encryptedBruid == "")
                           appScope.encryptedBruid = page.bruid;
                       appScope.$root.workFlow = appScope.workFlow = "candidateZone";
                       appScope.ViewDashBoardData("Applications", appScope.enumForDashBoardActiveSection.UnfinishedApplications);
                   }
                   else
                       document.location.href = "/tgwebhost/aip.aspx?sid=" + $("#SIDValue").val();
               },
               viewHRStatus: function () {
                   if (appScope.bresponsiveCandidateZone) {
                       appScope.bCandidateZone = true;
                       if (typeof (appScope.encryptedBruid) == "undefined" || appScope.encryptedBruid == "")
                           appScope.encryptedBruid = page.bruid;
                       appScope.$root.workFlow = appScope.workFlow = "candidateZone";
                       appScope.ViewDashBoardData("Applications", appScope.enumForDashBoardActiveSection.FinishedApplications);
                   }
                   else if (this.wbpreview != "true") {
                       document.location.href = "/tgwebhost/statuscheck.aspx?sid=" + $("#SIDValue").val();
                   }
               },
               goToAssessments: function (url) {

                   if (this.wbpreview != "true") {
                       if (appScope.bresponsiveCandidateZone && page.enableResponsiveAssessments.toLowerCase() == 'true' && url.toLowerCase().indexOf('tgnewui/candidatezone/ajax/viewassessments') > -1 || (appScope.isNonProfileAllowed || appScope.AnonymousLoginType=='ByPassGQLogin')) {
                           appScope.bJobDetailsShown = false;
                           if (typeof (appScope.encryptedBruid) == "undefined" || appScope.encryptedBruid == "")
                               appScope.encryptedBruid = page.bruid;
                           appScope.bSelectedGroup = false;
                           appScope.bCandidateZone = true;
                           appScope.candidatezoneSubView = 'ResponsiveAssessment';
                           appScope.$root.workFlow = appScope.workFlow = "Assessments";
                           appScope.setTitle("Assessments");
                           appScope.bInitialLoad = false;
                           appScope.renderAssessments(url);
                       }
                       else {
                           document.location.href = url;
                       }
                   }
               },
               CreateExistingAccount: function () {
                   if (this.wbpreview != "true") {
                       appScope.logOutCandidate("ByPassGQLogin")
                       //document.location.href = "/TGnewUI/Search/Home/CreateAccntWithPreload?partnerid=" + page.partnerid + "&siteid=" + page.siteid + "&Qs=" + appScope.encryptedBruid.replace("+", "_plus_");
                   }
               },
               viewSearch: function () {
                   if (this.wbpreview != "true") {
                       document.location.href = "/TGnewUI/Search/Home/Home?partnerid=" + page.partnerid + "&siteid=" + page.siteid;
                   }
               },
               BacktoSelectedGroup: function () {
                   if ($.queryParams()["calledFrom"] == "SelectedGroup")
                       window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + page.partnerid + "&siteid=" + page.siteid + "&PageType=selectedgroup";
                   else
                       appScope.SelectedGroupAjax(page.partnerid, page.siteid);
               },
               showSaveApplicationTitle: function () {
                   return this.pagetype == pageType.confirmation;
               },
               attachResumeCoverLetter: function (id, name, isResume, googleLoggedIn) {
                   if (id) {
                       if (isResume) {
                           $scope.resumeAttached = true;
                           $scope.attachedResumeName = name;
                           $scope.attachedResumeId = id;
                           $("#savedResumeName").attr("value", name);
                           $("#savedResumeId").attr("value", id);
                       }
                       else {
                           $scope.coverLetterAttached = true;
                           $scope.attachedCoverLetterName = name;
                           $scope.attachedCoverLetterId = id;
                           $("#savedCoverLetterName").attr("value", name);
                           $("#savedCoverLetterId").attr("value", id);
                       }
                   }
                   $scope.$apply();
                   ngDialog.closeAll();
                   if (id) {
                       if (isResume) {
                           $("#resumewidget").find('.fileHolder').focus();
                       }
                       else {
                           $("#clwidget").find('.fileHolder').focus();
                       }
                   }

                   if (googleLoggedIn == "googledrive") {
                       ngDialog.open({
                           preCloseCallback: function (value) {
                               $.restoreFocus();
                           },
                           template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                       });
                   }

               },
               dettachResumeCoverLetter: function (isResume) {
                   if (isResume) {
                       $scope.resumeAttached = false;
                       $scope.attachedResumeName = "";
                       $scope.attachedResumeId = "";
                       $("#savedResumeId").val("");
                       $("#savedResumeName").attr("value", "");
                   }
                   else {
                       $scope.coverLetterAttached = false;
                       $scope.attachedCoverLetterName = "";
                       $scope.attachedCoverLetterId = "";
                       $("#savedCoverLetterId").val("");
                       $("#savedCoverLetterName").attr("value", "");
                   }
                   setTimeout(function () { $scope.$apply(); })
               },
               attachSelectedAttachments: function (Category, SelectedAttachements, NoOfAttachments, googleLoggedIn) {
                   $scope.NoOfAttachments = NoOfAttachments;
                   SelectedAttachements = JSON.parse(SelectedAttachements);
                   var newSelection = true;
                   $.each($scope.SelectedAttachements, function (key, value) {

                       if (value.Name == Category) {
                           $.each(SelectedAttachements, function (key, value2) {
                               value.Attachments.push(value2)
                           });
                           value.Attachments = _.uniq(value.Attachments, function (item, key, a) {
                               return item.Id;
                           });
                           newSelection = false;
                       }
                   });
                   if (newSelection)
                       $scope.SelectedAttachements.push({ "Name": Category, "Attachments": SelectedAttachements });
                   $('#AttachementCatagory').val('');
                   $("#AttachementCatagory-button").children("span.ui-selectmenu-text").text(appScope.dynamicStrings.PlaceHolder_Choose);
                   ngDialog.closeAll();
                   setTimeout(function () { $scope.$apply(); })

                   if (googleLoggedIn == "googledrive") {
                       ngDialog.open({
                           preCloseCallback: function (value) {
                               $.restoreFocus();
                           },
                           template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                       });
                   }

               },
               dettachAttachments: function (Category, SelectedAttachements) {

                   $.each($scope.SelectedAttachements, function (Catkey, Catvalue) {
                       if (Catvalue.Name == Category) {
                           $.each(Catvalue.Attachments, function (Filekey, Filevalue) {
                               if (Filevalue != undefined && Filevalue.Id == SelectedAttachements) {
                                   $scope.NoOfAttachments = (eval($scope.NoOfAttachments) - 1).toString();
                                   Catvalue.Attachments.splice(Filekey, 1);
                                   if (Catvalue.Attachments.length == 0)
                                       $scope.SelectedAttachements.splice(Catkey, 1);
                               }
                           });
                       }
                   });

                   setTimeout(function () { $scope.$apply(); })
               },
               trustedHtml: function (val) {
                   return (val.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>'));
               },
               openPreview: function (resumePath, FileName) {
                   resumePath = resumePath.replace(/\+/g, "_plus_");
                   var BRUID;
                   if (page.bruid.indexOf('+') === -1)
                       BRUID = page.bruid;
                   else
                       BRUID = page.bruid.replace(/\+/g, "_plus_");
                   window.location.href = "/TGNewUI/Profile/Home/PreviewResume?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&EncryptedResumePath=" + resumePath + " &FileName=" + encodeURIComponent(FileName) + "&BRUID=" + BRUID;
               },
               hasRequiredFields: function () {
                   return !!$('.requiredFieldIndicator').not(".requiredFieldsDescription span").length;
               },
               validateEduExp: function ($event) {

                   page.isValidEduExp = true;
                   var isEduExpSaved = true;

                   _.forEach(this.education, function (n) {
                       if (!n.SchoolName || !n.EduMajor || (n.GradYear && !/^\d+$/.test(n.GradYear))) {
                           n.updateMode = true;
                           page.isValidEduExp = false;
                       }
                       else if (n.updateMode) {
                           n.updateMode = false;
                           isEduExpSaved = false;
                       }
                   });

                   _.forEach(this.experience, function (n) {
                       if (!n.EmployerName || !n.PositionTitle || !n.StartDate) {
                           n.updateMode = true;
                           page.isValidEduExp = false;
                       }
                       else if (n.updateMode) {
                           n.updateMode = false;
                           isEduExpSaved = false;
                       }
                   });

                   if (page.isValidEduExp && !isEduExpSaved) {
                       $timeout(function () { page.goNext($event); }, 0);
                       return false;
                   }

                   return page.isValidEduExp;

               },
               addHiddenElements: function (elements) {

                   for (var k in this.hiddenFields) {
                       elements.push({ name: k, value: this.hiddenFields[k] })

                   }
                   //Including hidden elements: hiddenQB and hiddenField
                   var qbhiddenfields = navigationFn.visiblePage().find(".hiddenQB").find("select, textarea, input");
                   _.forEach(qbhiddenfields, function (field){
                       if (typeof (_.find(elements, { 'name': field.name })) == "undefined"){
                           elements.push({ name: field.name, value: field.value})
                   }

                   });

               },
           }
        setTimeout(page.setPageActions, 0);
        $scope.page = page;

        $scope.CloseMessage = function (property) {
            $scope[property] = false;
            $timeout(function () {
                $scope.$apply();
            }, 0);
        };

        $scope.InitialiseResume = function () {
            if ($scope.buildResume)
            {
                $("#savedResumeName").val("ResumeBuildFromProfile")
                $("#savedResumeId").val("-5");
                $("#buildResume").val("1");
            }
            $scope.attachedResumeName = $("#savedResumeName").val();
            $scope.attachedResumeId = $("#savedResumeId").val();
            if ($("#savedResumeName").val() != "") {
                if ($("#savedResumeId").val() == "-5") {
                    $scope.buildResume = true;
                    $scope.resumeAttached = false;
                } else {
                    $scope.resumeAttached = true;
                    var dotLastIndex = $("#savedResumeName").val().lastIndexOf(".");
                    $scope.attachedPreviewResumeName = $("#savedResumeName").val().substr(0, dotLastIndex) + ".pdf";
                }
            }
            else {
                $scope.resumeAttached = false;
            }
        }
        $scope.InitialiseCoverLetter = function () {
            $scope.attachedCoverLetterName = $("#savedCoverLetterName").val();
            $scope.attachedCoverLetterId = $("#savedCoverLetterId").val();
            if ($("#savedCoverLetterName").val() != "") {
                $scope.coverLetterAttached = true;
                var dotLastIndex = $("#savedCoverLetterName").val().lastIndexOf(".");
                $scope.attachedPreviewCoverLetterName = $("#savedCoverLetterName").val().substr(0, dotLastIndex) + ".pdf";
            }
            else {
                $scope.coverLetterAttached = false;
            }
        }
        $scope.InitialiseAttachments = function () {
            $scope.SelectedAttachements = $("#GroupedAttachByCategory").val() == "" ? "" : eval("(" + $("#GroupedAttachByCategory").val() + ")");
            $scope.Categories = "";
            if ($scope.SelectedAttachements == undefined || $scope.SelectedAttachements == "") {
                $scope.SelectedAttachements = [];
            }
            $scope.AttachmentCategory = "";
            $scope.NoOfAttachments = 0;
            $.each($scope.SelectedAttachements, function (Catkey, Catvalue) {
                $.each(Catvalue.Attachments, function (Filekey, Filevalue) {
                    $scope.NoOfAttachments++;
                });
            });
        }

        $scope.datePicker = {
            datepickerConfig: {
                showOn: "button",
                buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                dateFormat: "m/d/yy",
                maxDate: 0,
                localeCode: appScope.response.ClientSettings.LocaleCode,
                shortMonthNames: appScope.shortMonthNames
            }
        }

        $scope.blanketSearch = function (e) {
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
        }

        $scope.toggleRow = function (event, rowIdwithjobId, qname) {
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
        };


        $scope.GoogleLogOut = function () {
            $scope.googleLoggedIn = "";
            win = window.open("https://www.google.com/accounts/Logout", "something", "width=550,height=570");
            setTimeout("win.close();", 3000);
            parent.$.restoreFocus();
            ngDialog.closeAll();
            if ($scope.SubmitAfterGoogleLogout) {
                $scope.SubmitAfterGoogleLogout = !$scope.SubmitAfterGoogleLogout;
                submitPage();
                page.showSuccessMessage = true;
            }
        };
        $scope.noThanksGoogleOut = function () {
            parent.$.restoreFocus();
            ngDialog.closeAll();
            if ($scope.SubmitAfterGoogleLogout) {
                $scope.SubmitAfterGoogleLogout = !$scope.SubmitAfterGoogleLogout;
                submitPage();
                page.showSuccessMessage = true;
            }

        };

        $scope.DownloadAttachments = function (AttchmentName, AttachmentID) {

            var BRUID;
            if (page.bruid.indexOf('+') === -1)
                BRUID = page.bruid;
            else
                BRUID = page.bruid.replace(/\+/g, "_plus_");

            window.location.href = "/GQWeb/DownloadAttachment?partnerid=" + page.partnerid + "&siteid=" + $("#siteId").val() + "&BRUID=" + BRUID + "&FileName=" + encodeURIComponent(AttchmentName) + "&AttachmentId=" + AttachmentID;

        };

        var submitPage = function ($event) {

            $.shout("submitPage", $event);

            page.showSuccessMessage = false;
            $scope.bjobInAGroupExpired = false;
            var applyRequest = {};
            var pagemetadata = angular.fromJson($("#pagemetadata").val());
            applyRequest.RequiredFields = typeof pagemetadata != 'undefined' ? pagemetadata.requiredFields : "";
            applyRequest.PreviousPageType = page.pagetype;
            applyRequest.TQId = page.tqid;
            applyRequest.TQRenderingId = page.tqrenderingid;
            applyRequest.LocaleId = page.localeid;
            applyRequest.PageId = page.nextpageid;
            applyRequest.PrevPageId = page.pageid;
            applyRequest.SectionId = page.nextsectionid;
            applyRequest.Knockedout = page.knockedout;
            applyRequest.ClientID = page.partnerid;
            applyRequest.SiteId = page.siteid;
            applyRequest.ReqId = page.reqid;
            applyRequest.BRUID = page.bruid;
            applyRequest.AIPID = page.aipid;
            applyRequest.GQSessionId = page.gqsessionid;
            applyRequest.JobTitle = page.tgSettings.jobtitle;
            applyRequest.Prefix = page.tgSettings.partnerprefix;
            applyRequest.Submit = page.submitmode;
            applyRequest.WBMode = page.wbpreview;
            applyRequest.DraftMode = page.draftmode;
            applyRequest.WotcCompleted = page.wotcCompleted;
            applyRequest.GoingBack = page.wotcBack
            applyRequest.DaysInDraft = page.daysdraft;
            applyRequest.Wotc = [];
            var wotc = eval('(' + $("#wotc").val() + ')');
            if (wotc) {
                applyRequest.Wotc[0] = wotc;
                if (page.wotcBack) {
                    applyRequest.Wotc[0].WotcBack = page.wotcBack;
                }
                if (page.wotcOptOut) {
                    applyRequest.Wotc[0].WotcOptOut = page.wotcOptOut;
                }
            }

            applyRequest.Elements = [];


            $.shout("page.pagetype", page.pagetype, "page.reload", page.reload);

            if (!page.reload && page.pagetype != pageType.confirmation) {

                $.shout("before populate form elements");
                var formElementsPresent = navigationFn.visiblePage().find("select, textarea, input");
                var dateFields = [];
                $.each(formElementsPresent, function (index, field) {
                    if ($(field).hasClass('datestring')) {
                        dateFields.push({ name: field.name, value: field.value });
                    }
                });
                var formElements = formElementsPresent.serializeArray();
                var dateFieldsWithValidValues = true;
                //Assign the default Date Formats before saving the data to server.
                $.each(dateFields, function (index, dateField) {
                    $.each(formElements, function (index, field) {
                        if (dateField.name == field.name && dateField.value == field.value && dateField.value != "") {
                            field.value = validationObj.getDefaultDateFormat(dateField.value);
                            /*
                                Date field getting undefined in some cases...Logging it for knowing the root cause of the issue...
                                If Date field is required, make it empy and fire the validation again and stop the submission...
                                If Date field is optional, just make it empty and submit...
                            */
                            var inputControl = $("input[name='" + field.name + "']");
                            if (field.value.match(/[a-zA-Z]+/)) {
                                inputControl.val('');
                                field.value = '';
                                var dateFormatSetting = "1";
                                if (typeof appScope != "undefined" && typeof appScope.tgSettings != "undefined" && typeof appScope.tgSettings.DateFormat != "undefined") {
                                    dateFormatSetting = appScope.tgSettings.DateFormat;
                                }
                                LogJSErrors("Invalid date format in responsive apply flow", "", "", "", "Field Name: " + field.name + ", TG Setting: " + dateFormatSetting + ", Input value: " + dateField.value + ", After Converting: " + field.value + ", Initial Loaded Date: " + inputControl.closest('.dateWrapper').attr('y-m-d'));
                                if (inputControl.hasClass('required')) {
                                    dateFieldsWithValidValues = false;
                                    $("form[name='applyForm']").valid();
                                }
                            }
                            
                        }
                    });
                });
                if (!dateFieldsWithValidValues) {
                    page.processing = false;
                    return;
                }
                $scope.page.addHiddenElements(formElements);
                page.hiddenFields = {};

                $.shout("formElements.length", formElements.length);
                try {

                    $.each(formElements, function (index, field) {
                        var fieldValue, isHidden;

                        $.shout(index, field, field && field.tagName, field && field.name);

                        if (!(field.name.indexOf("visible-input-") == 0))
                        {
                           fieldValue = field.value;
                           isHidden = isHiddenField(field.name);
                            
                        }
                        else if (typeof (_.find(formElements, { 'name': field.name.replace("visible-input-", "") })) == "undefined")
                        {
                           fieldValue = '';
                           isHidden = true;
                        }
                        else
                        {
                            return true;
                        }

                        if (field.value == "" && !field.name.match(/profile/gi))
                        { // means some custom question field for which value is empty.
                          //In that case, we will pass it to server only when it is a branched question
						  //Changing this to keep in synch with previous logic
                            var elem = navigationFn.visiblePage().find("[name='" + field.name + "']");
                            if (elem.closest('.fieldcontain').hasClass('hiddenQB'))
                            {
                                fieldValue = '';
                                isHidden = true;
                            }
                            else
                            {
                                return true;
                            }
                        }
                                                   
                        if (field.name.indexOf("_state_") > 0 && (typeof $('#' + field.name + '-input').val() != "undefined" && typeof $('#' + field.name + ' option:selected').text() != "undefined" && $('#' + field.name + '-input').val().trim() != $('#' + field.name + ' option:selected').text().trim() || $('#' + field.name + '-input').val() == '') && !isHidden)
                        {
                            $('#' + field.name + '-input').val('');
                            $('#' + field.name).val('');
                            fieldValue = '';
                            if (!applyRequest.GoingBack && page.knockedout == 0 && !page.draftmode && !$("form[name='applyForm']").valid()) {
                                page.processing = false;
                                throw ("required state missing");
                                return false;
                            }
                        }

                        if (field.name.indexOf("_country_") > 0 && (typeof $('#' + field.name + '-input').val() != "undefined" && typeof $('#' + field.name + ' option:selected').text() !="undefined" && $('#' + field.name + '-input').val().trim() != $('#' + field.name + ' option:selected').text().trim() || $('#' + field.name + '-input').val() == '') && !isHidden) {
                            $('#' + field.name + '-input').val('');
                            $('#' + field.name).val('');
                            fieldValue = '';
                            if (!applyRequest.GoingBack && page.knockedout == 0 && !page.draftmode && !$("form[name='applyForm']").valid()) {
                                page.processing = false;
                                throw ("required country missing");
                                return false;
                            }
                        }

                        applyRequest.Elements.push({ Name: field.name, Value: fieldValue, Desc: getOptionDesc(field.name, fieldValue), Score: getQuestionScore(field.name, fieldValue), OptionId: getOptionId(field.name, fieldValue), Hidden: isHidden })
                        
                    });
                    if (wotc) {
                        var names = _.pluck(applyRequest.Elements, "Name");

                        $('input[type="checkbox"]:not(:checked)').each(function () {
                            if ($.inArray(this.name, names) === -1) {
                                applyRequest.Elements.push({ Name: this.name, Value: 'null' })
                                names.push(this.name);
                            }
                        });
                    }

                } catch (Error) {
                    $.shout("Error", Error, Error.name, Error.message);
                    return false;
                }
                if (applyRequest.WBMode != "true" && applyRequest.Submit && page.educationSettings != null && page.educationSettings.Required && (page.education == null || page.education.length == 0)) {
                    var metaData = angular.fromJson($("#pagemetadata").val());
                    page.education = metaData.education;
                    //Stop the user from submitting the page if education is still empty and if it is marked as required
                    if (page.education == null || page.education.length == 0) {
                        $timeout(function () { $("form[name='applyForm']").valid() }, 0);
                        page.processing = false;
                        return;
                    }
                }

                if (page.education && page.pagetype != pageType.review) {
                    if (page.education.length == 0) {
                        applyRequest.Education = [];
                        applyRequest.Education.push({ Delete: true });
                    }
                    else {
                        applyRequest.Education = page.education;
                        if (typeof applyRequest.Education != "undefined" && applyRequest.Education != null && applyRequest.Education.length > 0) {
                            $.each(applyRequest.Education, function (index, edu) {
                                if (edu.MostRecent) {
                                    edu.MostRecent = 1;
                                }
                                else {
                                    edu.MostRecent = 0;
                                }
                            });
                        }
                    }
                }
                applyRequest.EducationSettings = page.educationSettings;
                if (page.experience && page.pagetype != pageType.review) {
                    if (page.experience.length == 0) {
                        applyRequest.Experience = [];
                        applyRequest.Experience.push({ Delete: true });
                    }
                    else {
                        applyRequest.Experience = page.experience;
                        if (typeof applyRequest.Experience != "undefined" && applyRequest.Experience != null && applyRequest.Experience.length > 0) {
                            $.each(applyRequest.Experience, function (index, exp) {
                                if (exp.MostRecent) {
                                    exp.MostRecent = 1;
                                }
                                else {
                                    exp.MostRecent = 0;
                                }
                            });
                        }
                    }

                }

                applyRequest.ResumeCoverLetters = [];
                if (document.getElementById("savedResumeId") != null && page.pagetype != pageType.review) {
                    applyRequest.ResumeCoverLetters.push({ Type: "resume", Name: $scope.attachedResumeName, Id: $scope.attachedResumeId });
                }
                if (document.getElementById("savedCoverLetterId") != null && page.pagetype != pageType.review) {
                    applyRequest.ResumeCoverLetters.push({ Type: "coverletter", Name: $scope.attachedCoverLetterName, Id: $scope.attachedCoverLetterId });
                }
                if ($scope.AttachmentBack)
                    applyRequest.Attachments = "";
                else
                    applyRequest.Attachments = "-1";
                var att = page.pageid + "%%%";
                if (($scope.SelectedAttachements != null || $scope.SelectedAttachements != undefined && $scope.SelectedAttachements.length > 0) && page.pagetype != pageType.review) {
                    $.each($scope.SelectedAttachements, function (Catkey, Catvalue) {
                        $.each(Catvalue.Attachments, function (Filekey, Filevalue) {
                            if (applyRequest.Attachments == "-1" || applyRequest.Attachments == "") {
                                att += Filevalue.Id;
                                applyRequest.Attachments = att;
                            }
                            else {
                                att += ',' + Filevalue.Id;
                                applyRequest.Attachments = att;
                            }
                        });
                        applyRequest.Attachments = att;
                    });
                }
            }
            if (((!page.reload && document.getElementById("savedResumeId") == null) || (page.reload && document.getElementById("savedResumeId") != null)) && page.importedResumeId != 0 && $("#importprofile").is(":visible")) {
                applyRequest.ResumeCoverLetters = [];
                applyRequest.ResumeCoverLetters.push({ Type: "importedResume", Name: page.importedResumeName, Id: page.importedResumeId });

                if (page.reload) {
                    if (document.getElementById("savedResumeId") != null && $scope.attachedResumeId != "") {
                        applyRequest.ResumeCoverLetters.push({ Type: "resume", Name: $scope.attachedResumeName, Id: $scope.attachedResumeId });
                    }
                    if (document.getElementById("savedCoverLetterId") != null && $scope.attachedCoverLetterId != "") {
                        applyRequest.ResumeCoverLetters.push({ Type: "coverletter", Name: $scope.attachedCoverLetterName, Id: $scope.attachedCoverLetterId });
                    }
                }
            }
            if (typeof(applyRequest.ResumeCoverLetters) != "undefined" && applyRequest.ResumeCoverLetters.length > 0)
            {
                if (page.importedResumeName != "" && page.importedResumeId != 0) {
                    if ((page.importedResumeName == $scope.attachedResumeName) && (page.importedResumeId != $scope.attachedResumeId)) {
                        _.remove(applyRequest.ResumeCoverLetters, function (resumeOrCoverLetter) {
                            return resumeOrCoverLetter.Type == "resume";
                        });
                        applyRequest.ResumeCoverLetters.push({ Type: "resume", Name: $scope.attachedResumeName, Id: page.importedResumeId });
                    }
                }
            }

            $.shout("prior to defining button", "Event", $event);

            if ($event) {
                var applyBtn = $event.target;
                applyBtn = $(applyBtn).parent("a").length ? applyBtn.parentNode : applyBtn;
            }

            $.shout("applyBtn", applyBtn)

            if (applyBtn) {
                if (!page.btnprogress || page.btnprogress.button != $(applyBtn).attr("id")) {
                    page.btnprogress = Ladda.create(applyBtn);
                    page.btnprogress.button = $(applyBtn).attr("id");
                }
                page.btnprogress.start();
            }
            applyRequest.PageReload = page.reload;
            $("#hidQB").val(hidQBFields.join(","));

            var url = "/GQWeb/SaveAndNextPage?partnerid=" + page.partnerid + "&siteid=" + page.siteid + "&localeid=" + page.localeid;

            $http({
                method: 'POST',
                url: url,
                data: { serializedRequest: JSON.stringify(applyRequest) },
                headers: {
                    'Content-Type': 'application/json'

                }

            }).then(submitHandler(), errorHandler());

            return false;

        }

        var submitHandler = function () {
            return function (response) {
                $scope.submit = false;
                if (page.processing && page.isSaveAndContinue && page.isReviewEdit) {
                    page.isReviewEdit = false;
                }
                page.isSaveAndContinue = false;
                page.processing = false;

                if (page.btnprogress) {
                    page.btnprogress.stop();
                }
                if (page.draftmode) {
                    page.pagetype = pageType.confirmation;
                    page.draftmode = false;
                    $http.post("/gqweb/confirmation", formEncode({ mode: "savedraft", partnerid: page.partnerid, siteid: page.siteid, localeid: page.localeid, reqid: page.reqid }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                        .then(function (response) {
                            document.getElementById("pagecontent").innerHTML = response.data;
                            $compile($("#pagecontent").contents())($scope);
                            setTimeout(function () {
                                appScope.setTitle('apply');
                            }, 400);
                            //$location.hash("pageid=-1");
                        });

                    return;
                }
                if (page.submitmode) {
                    document.getElementById("tempPageContent").innerHTML = response.data;
                    var metaData = angular.fromJson($("#tempPageContent").find("#pagemetadata").val());
                    document.getElementById("tempPageContent").innerHTML = '';
                    $scope.SubmissionFailedDueToDuplicateCheck = metaData.SubmissionFailedDueToDuplicateCheck.toLowerCase() == "true";
                    $scope.PartiallySubmittedDueToDuplicateCheck = metaData.PartiallySubmittedDueToDuplicateCheck.toLowerCase() == "true";
                    if (($scope.SubmissionFailedDueToDuplicateCheck || $scope.PartiallySubmittedDueToDuplicateCheck) && metaData.DuplicateCheckResponse != "" && metaData.DuplicateCheckResponse != null) {
                        $scope.ApplyDifference = metaData.DuplicateCheckResponse.ApplyDiff;
                        var CurrentSubmissioForMulApply = (parseInt(metaData.DuplicateCheckResponse.MaxSubmissions) - metaData.DuplicateCheckResponse.CurrentSubmissions) > 0 ? metaData.DuplicateCheckResponse.CurrentSubmissions : "0";
                        $scope.LimitExceededMessage = GetMaxSubmissionMessage(metaData.DuplicateCheckResponse.PeriodMaxforSubmissionsOption, metaData.DuplicateCheckResponse.MaxSubmissions, metaData.DuplicateCheckResponse.NextAllowedApplyDate, CurrentSubmissioForMulApply);
                        $scope.MultipleJobStatus = metaData.DuplicateCheckResponse.DuplicateCheckStatuses != null ? (_.where(metaData.DuplicateCheckResponse.DuplicateCheckStatuses, { "Applied": true })) : "";
                        $scope.NoofJobsApplied = metaData.DuplicateCheckResponse.DuplicateCheckStatuses != null ? (_.where(metaData.DuplicateCheckResponse.DuplicateCheckStatuses, { "Applied": true })).length : 0;
                        $scope.AllJobsApplied = $scope.NoofJobsApplied == page.reqid.split(',').length ? true : false;

                        $scope.responseData = response.data;
                        if ($scope.NoofJobsApplied > 0 || $scope.ApplyDifference <= 0) {
                            $scope.MultipleApplyFormData = $scope;
                            $('body').addClass('noScroll');
                            ngDialog.open({
                                preCloseCallback: function (value) {
                                    $('body').removeClass('noScroll');
                                    redirectToThankYouPage($scope);
                                },
                                template: 'MultipleApplyValidations', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#dialogContainer", ariaRole: "dialog"
                            });
                        }
                        return;
                    }
                }


                document.getElementById("pagecontent").innerHTML = response.data;
                page.webtrackerscriptloaded = 2;
                page.setPageActions();


                $compile($("#pagecontent").contents())($scope);

                DomFunc.enhanceSelects();
                DomFunc.setLabels();

                validationObj.setFieldValidations();
                QBObj.checkQBFA();


                _.delay(function () {
                    $(window).scrollTop(0);
                })


                if (window.getSelection) {
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                }

                if (appScope.standAloneGQ > 0) {
                    if (page.pagetype == pageType.knockout) {
                        appScope.logOutCandidate("standAloneGQKnockedOut");
                    }
                    else if (page.submitmode) {
                        appScope.logOutCandidate("standAloneGQ");
                    }
                }
                
            }
        };


        var GetMaxSubmissionMessage = function (maxSubmissionOption, maxSubmissions, nextApply, CurrentSubmissioForMulApply) {
            var message = "";

            var allowedSubmissions = parseInt(maxSubmissions);
            if (CurrentSubmissioForMulApply == "")//Single Job
            {
                switch (maxSubmissionOption) {
                    case "0":
                        if (allowedSubmissions == 0) {
                            allowedSubmissions = 100;
                        }
                        message = appScope.dynamicStrings.LimitExceeded.replace("[COUNT]", allowedSubmissions);
                        break;
                    case "1":
                        message = appScope.dynamicStrings.LimitExceeded_Month.replace("[COUNT]", maxSubmissions).replace("[DATE]", nextApply);
                        break;
                    case "2":
                        message = appScope.dynamicStrings.LimitExceeded_Year.replace("[COUNT]", maxSubmissions).replace("[DATE]", nextApply);
                        break;
                    case "3":
                        message = appScope.dynamicStrings.LimitExceeded_Days.replace("[COUNT]", maxSubmissions).replace("[DAYS]", nextApply);
                        break;
                }
            }
            else if (CurrentSubmissioForMulApply == "0")// Ful Limit Exceeded
            {
                switch (maxSubmissionOption) {
                    case "0":
                        if (allowedSubmissions == 0) {
                            allowedSubmissions = 100;
                        }
                        message = appScope.dynamicStrings.MulJobFulLimitExceeded.replace("[COUNT]", allowedSubmissions);
                        break;
                    case "1":
                        message = appScope.dynamicStrings.MulJobFulLimitExceeded_Month.replace("[COUNT]", maxSubmissions).replace("[DATE]", nextApply);
                        break;
                    case "2":
                        message = appScope.dynamicStrings.MulJobFulLimitExceeded_Year.replace("[COUNT]", maxSubmissions).replace("[DATE]", nextApply);
                        break;
                    case "3":
                        message = appScope.dynamicStrings.MulJobFulLimitExceeded_Days.replace("[COUNT]", maxSubmissions).replace("[DAYS]", nextApply);
                        break;
                }
            }
            else //Partial Limit Exceeded
            {
                switch (maxSubmissionOption) {
                    case "0":
                        if (allowedSubmissions == 0) {
                            allowedSubmissions = 100;
                        }
                        message = appScope.dynamicStrings.MultiJobLimitExceeded.replace("[COUNT]", allowedSubmissions).replace("[CURRENTSUBMISSION]", CurrentSubmissioForMulApply);
                        break;
                    case "1":
                        message = appScope.dynamicStrings.MultiJobLimitExceeded_Month.replace("[COUNT]", maxSubmissions).replace("[DATE]", nextApply).replace("[CURRENTSUBMISSION]", CurrentSubmissioForMulApply);
                        break;
                    case "2":
                        message = appScope.dynamicStrings.MultiJobLimitExceeded_Year.replace("[COUNT]", maxSubmissions).replace("[DATE]", nextApply).replace("[CURRENTSUBMISSION]", CurrentSubmissioForMulApply);
                        break;
                    case "3":
                        message = appScope.dynamicStrings.MultiJobLimitExceeded_Days.replace("[COUNT]", maxSubmissions).replace("[DAYS]", nextApply).replace("[CURRENTSUBMISSION]", CurrentSubmissioForMulApply);
                        break;
                }
            }
            return message;
        }


        var redirectToThankYouPage = function (scope) {
            document.getElementById("pagecontent").innerHTML = scope.responseData;
            if (scope.SubmissionFailedDueToDuplicateCheck) {
                $("#pagecontent").find(".fieldcontain ").hide();
            }
            page.webtrackerscriptloaded = 2;
            page.setPageActions();


            $compile($("#pagecontent").contents())($scope);

            DomFunc.enhanceSelects();
            DomFunc.setLabels();

            validationObj.setFieldValidations();
            QBObj.checkQBFA();


            _.delay(function () {
                $(window).scrollTop(0);
            })


            if (window.getSelection) {
                var selection = window.getSelection();
                selection.removeAllRanges();
            }

        }

        var errorHandler = function () {
            return function (response) {

                page.processing = false;
                page.btnprogress.stop();
            }
        };

        var parseScriptTags = function () {

            var scriptElement;

            var documentWrite = document.write;

            document.write = function (input) {
                if ($("#pagecontent").children().last().prop("tagName").match(/script/gi)) {
                    $("#pagecontent").append($(input));
                }

            }

            try {
                $("#pagecontent script[type='text/javascript']").each(function (index) {
                    scriptElement = document.createElement("script");
                    scriptElement.text = $(this).html();
                    $("#pagecontent").append(scriptElement);
                    $(this).remove();

                });
            }
            catch (ex) { }
            document.write = documentWrite;

        }

        var getNextAction = function ($scope) {
            $.shout("getNextAction", $scope);
            var $elementCheck = $("[knockout='true']:checked:visible");
            var $elementSelect = $("[knockout='true']option:selected");

            if ($elementCheck.length) {
                $.shout("$element", $elementCheck.val())
                page.nextpageid = $elementCheck.attr("nextpageid");
                page.nextsectionid = $elementCheck.attr("nextsectionid");
                page.knockedout = (page.knockedout == 2) ? 2 : 1;
                $.shout("page.next page/section id", page.nextpageid, page.nextsectionid)
            }
            else if ($elementSelect.length) {
                var selectmenuId = $("[knockout='true']option:selected").parent().attr("id");

                if ($("#" + selectmenuId + "-button").is(':visible') || $("#" + selectmenuId + "-input").is(':visible')) {
                    $.shout("$element", $elementSelect.val())
                    page.nextpageid = $elementSelect.attr("nextpageid");
                    page.nextsectionid = $elementSelect.attr("nextsectionid");
                    page.knockedout = (page.knockedout == 2) ? 2 : 1;
                    $.shout("page.next page/section id", page.nextpageid, page.nextsectionid)
                }
            }

        };
        var getQuestionScore = function (name, value) {
            var $element = $("[name='" + name + "'][value='" + value + "'],[name='" + name + "'] option[value='" + value + "']");
            var score = "";
            if ($element.length && $element.attr("score")) {

                score = $element.attr("score");
            }
            score = (score == null || score == "" ? 0 : score);
            return score;
        };

        var getOptionId = function (name, value) {
            var $element = $("[name='" + name + "'][value='" + value + "'],[name='" + name + "'] option[value='" + value + "']");
            var optionId = "";
            if ($element.length && $element.attr("optionid")) {

                optionId = $element.attr("optionid");
            }
            optionId = (optionId == null || optionId == "" ? 0 : optionId);
            return optionId;
        };


        var getOptionDesc = function (name, value) {

            var desc = "";

            if (value != "" && (name.match(/_country_/gi) || name.match(/_state_/gi))) {

                var $element = $("[name='" + name + "'] option[value='" + value + "']");
                var $autoCompleteElement = $("#" + name + "-input");
                if ($autoCompleteElement.length && $element.text() != $autoCompleteElement.val() && $autoCompleteElement.val() != "") {
                    desc = $autoCompleteElement.val();
                }
                else if ($element.length) {

                    desc = $element.text();
                }
            }

            return desc;
        };

        var isHiddenField = function (name) {

            var $container = $("[name='" + name + "']").closest(".fieldcontain");


            return $container.length ? !$container.is(":visible") || $container.find(".confirmInput").length : false;
        };

        $scope.compileInnerHtml = function (el) {
            //method to update scope externally in forms.js
            $compile($(el).contents())($scope);
        }


        var formEncode = function (data) {
            var pairs = [];
            for (var name in data) {
                pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }
            return pairs.join('&').replace(/%20/g, '+');

        };

        window.applyScope = $scope;


        $(window).on('hashchange', function () {

            applyScope.page.hashChange(window.location.hash);

        });


    });


})(window.searchApp ? window.searchApp : angular.module("submission", ['tgCommon']));







