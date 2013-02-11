/************************************************************************************************************************
Copyright (c) 2011, Nathan McIntyre (http://www.natemcintyre.com/)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the 
following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following
     disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
     disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of Nathan McIntyre nor the names of its contributors may be used to endorse or promote products
     derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
************************************************************************************************************************/
enyo.kind({
   name: "SplashScreen",
   kind: "Scrim",
   className: "splashscreen",
   layoutKind: "VFlexLayout",
   pack: "center",
   align: "center",
   components: [
      //SplashScreenDisplay
      {
         name: "SplashScreenDisplay",
         kind: "Control",
         className: "splashscreen-splashscreendisplay",
         layoutKind: "VFlexLayout",
         components: [
            { name: "splashScreenImage", kind: "Image", className: "splashscreen-image" } //splash screen image
         ]
      }
   ],
   
   showSplashScreen : function () 
   {
	  if (enyo.getWindowOrientation() === "left" || enyo.getWindowOrientation() === "right") {
		  //if we're in portrait orientation, show portrait splash
		  this.$.splashScreenImage.setSrc("images/splashscreen_image_portrait.png");
	  }
	  else {
		  //if not in portrait mode, show landscape splash screen
		  this.$.splashScreenImage.setSrc("images/splashscreen_image.png");
	  }
		
      //display the splash screen
      this.show();

      //wait for 3 seconds and then hide the splash screen, image fading is handled in SplashScreen.css
      setTimeout(function (t) { t.hideSplashScreen(); t.startGrouponMain(); }, 3000, this);
   },
   
   hideSplashScreen : function () {
      this.hide();
   },
   
   create : function () {
      this.inherited(arguments);
   },
   
   destroy : function () {
      this.inherited(arguments);
   },
   
   startGrouponMain : function () {
	  //replace the splash screen by starting the actual application
	  new Groupon.Main().renderInto(document.body);
   }
   
});