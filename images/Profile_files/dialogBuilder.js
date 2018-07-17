/*°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸


  Licensed Materials - Property of IBM5725-N92© Copyright IBM Corp.
  2014, 2017.US Government Users Restricted Rights- Use,
  duplication or disclosure restricted by GSA ADP Schedule Contract  with IBM Corp.
  

°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸*/

(function(){
    function dialogBuilderClass() {
        var that = this;

        this.aDialogs = [];

        this.hideDialog = function (index) {
            that.aDialogs[index].elWrapper.style.display = "none";
        };

        this.getTargetCoordinates = function (elContext) {
            //returns top and horizontal center of context element
            var oRectangle = elContext.getBoundingClientRect();

            return [oRectangle.top, oRectangle.left + (oRectangle.right - oRectangle.left) / 2];
        };

        this.setSrcWithCoordinates = function (iframe, elContext, src, index) {
            if (elContext) {
                var aPos = that.getTargetCoordinates(elContext);
                iframe.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "targetY=" + aPos[0] + "&targetX=" + aPos[1] + "&dialogIndex=" + (index || that.aDialogs.length);
            }else
                iframe.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "dialogIndex=" + (index || that.aDialogs.length);
        }

        this.createDialog = function (elContext, src) {
            var iframe = document.createElement("iframe"),
                wrapperDiv = document.createElement("div"),
                oDialog;

            src = src || elContext.getAttribute("src");
            that.setSrcWithCoordinates(iframe, elContext, src);

            with (wrapperDiv.style) {
                position = "fixed";
                top = 0;
                bottom = 0;
                left = 0;
                right = 0;
                margin = 0;
                padding = 0;
                backgroundColor = "transparent";
                zIndex = 100;
            }
            with (iframe.style) {
                minHeight = 0;
                margin = 0;
                padding = 0;
                width = "100%";
                height = "100%";
                display = "block";
                lineHeight = 0;
                backgroundColor = "transparent";
                visibility = "hidden";//IE iframes always have a white background before load so hide them
            }
            iframe.frameBorder = 0;
            iframe.allowTransparency = true;
            iframe.title = elContext ? elContext.value || elContext.textContent || elContext.innerHTML : "dialog container";

            function onIframeLoad() {
                iframe.style.visibility = "visible";
                iframe.contentWindow.focus();
            }

            if (iframe.addEventListener) iframe.addEventListener('load', onIframeLoad, false);
            else if (iframe.attachEvent) iframe.attachEvent('onload', onIframeLoad);

            wrapperDiv.appendChild(iframe);
            // cannot just append to body as this will leave the new DIV outside a landmark region
            var mainLandmark = $("[role=main]");
            if (mainLandmark && mainLandmark.length > 0) {
                mainLandmark[0].appendChild(wrapperDiv);
            }
            else {
                document.body.appendChild(wrapperDiv);
            }
            elContext.dialogIndex = that.aDialogs.length;
            oDialog = { elWrapper: wrapperDiv, elContext: elContext, sBaseSrc: src };
            that.aDialogs.push(oDialog);
            return oDialog;
        };

        this.showDialog = function (elContext, src) {
            var oDialog;
            if (elContext.dialogIndex) {
                oDialog = that.aDialogs[elContext.dialogIndex];
                if (oDialog) {
                    oDialog.elWrapper.style.display = "block";
                    that.setSrcWithCoordinates(oDialog.elWrapper.firstChild, oDialog.elContext, oDialog.sBaseSrc);
                }else
                    that.createDialog(elContext, src);
            } else {
                that.createDialog(elContext, src);
            };
        };

        this.destroyDialog = function (index) {
            that.aDialogs[index].elWrapper.parentNode.removeChild(that.aDialogs[index].elWrapper);
            that.aDialogs.splice(index, 1);
        }
    }
    window.dialogBuilder = new dialogBuilderClass();
})()

