enyo.kind({
	name: "Groupon.AppMenu",
	kind: enyo.Control,
	components: [
		{
			kind: "AppMenu", 
			components: [
				{kind: "EditMenu"},
				{caption: "Preferences", onclick: "showPrefs"},
			 	{caption: "About Groupon", onclick: "showAbout"},
				{caption: "Help", onclick: "helpClicked"}
			]
		},
		{
			kind: "ModalDialog", 
			name: "prefsPopup",
			caption: "Preferences",
			layoutKind: "VFlexLayout", 
			width: "50%",
			pack: "center", 
			align: "center",
			dismissWithClick: false,
			components: [
			   {
				   kind: "RowGroup", 
				   name: "settingsRowGroup",
				   defaultKind: "HFlexBox",
				   caption: "SETTINGS", 
				   width: "90%",
				   components: [
				      {
				    	  align: "center",
				    	  tapHighlight: true,
				    	  flex: 1,
				    	  components: [
				    	     {content: "Daily Deal Notifications", flex: 1},
				    	     {kind: "ToggleButton", name:"dailDealToggleButton", onChange:"notifToggleChanged" }
				    	  ]
				      }//,
//				      {
//				    	  name: "notifTimeRow",
//				    	  tapHighlight: true,
//				    	  showing: false,
//				    	  flex: 1,
//				    	  components: [
//				    	     {content: "Notification Time", flex: 1},
//				    	     {content: "6:00pm", className: "enyo-label"}
//				    	  ]
//				      }
				   ]
			   },
			   {kind: "Button", caption: "Close", width: "90%", onclick: "prefsClose"}
			]
		},
		{
			kind: "Popup", 
			name: "helpPopup", 
			width: "250px", 
			layoutKind: "VFlexLayout", 
			pack: "center", 
			align: "center",
			dismissWithClick: false,
			components: [
			   {content: "Groupon", style: "font-size: 18px"},
			   {content: "v1.0 by DNS Mobile", style: "color: gray; font-size: 14px;"},
			   {
				   kind: "RowGroup", 
				   caption: "SUPPORT", 
				   components: [
				      { content: "Official Groupon Website", onclick: "launchGrouponSite" },
				      { content: "Support Website", onclick: "launchDNSGrouponSite" },
				      { content: "Send Email", onclick: "launchSupportEmail" }
				   ]
			   },
			   {content: "Copyright 2011 DNS Mobile", style: "color: gray; font-size: 14px;"},
			   {kind: "Button", caption: "Close", style: "margin-top: 20px;", onclick: "helpClose"}
			]
		},
		{
			kind: "Popup", 
			name: "aboutPopup", 
			layoutKind: "VFlexLayout", 
			pack: "center", 
			align: "center",
			dismissWithClick: false,
			components: [
			   {content: "About Groupon for WebOS", style: "font-size: 18px"},
			   {content: "v1.0 by DNS Mobile", style: "color: gray; font-size: 14px;"},
			   {
			     	 name: "splitBox",
			     	 kind: enyo.HFlexBox,
				     height: "130px",
			    	 flex: 1,
				     showing: true,
			    	 components: 
			    	 [
			    	  	{
			    	      layoutKind: "HFlexLayout", 
			    	      align: "center", 
			    	      pack: "center", 
			    	      flex: 1,
			    	      components:
			    	      [ 
			    	         {
			    	        	 kind: "RowGroup", 
			    	             caption: "MORE INFORMATION", 
			    	             components: 
			    	             [
			    	              	{ content: "About Groupon", onclick: "launchGrouponAboutSite" },
			    	                { content: "About DNS Mobile", onclick: "launchDNSSite" },
			    	             ]
			    	         },
			  			     { 
			  			    	 kind: "Image",
			  			    	 src: "images/powered_by_groupon.png",
			  			    	 height:"133px",
			  			    	 width:"432px"
			  			     }

			    	      ]
			    	  	}
			    	  ]
			   },
			   {content: "Built Using The Groupon API V2", style: "color: gray; font-size: 14px;"},
			   {kind: "Button", caption: "Close", style: "margin-top: 20px;", onclick: "aboutClose"}
			]
		},
		{
			kind: "Scrim",
			name: "scrim"
		},
		{
		    name : "launchBrowser",
		    kind : "PalmService",
		    service : "palm://com.palm.applicationManager/",
		    method : "open",
		    onSuccess : "launchFinished",
		    onFailure : "launchFail",
		    subscribe : true
		},
		{
		    name : "openEmailCall",
		    kind : "PalmService",
		    service : "palm://com.palm.applicationManager/",
		    method : "open",
		    subscribe : true
		}
	],
	
	openAppMenu: function() 
	{
		this.$.appMenu.open();
	},

	showPrefs: function() 
	{
		this.$.prefsPopup.openAtCenter();
		
		//initialize the toggle button's state based on the stored cookie
		var dailyDealEnabledCookie = enyo.getCookie(GROUPON_DAILY_DEAL_ENABLED);
		this.$.dailDealToggleButton.setState(dailyDealEnabledCookie && dailyDealEnabledCookie == "true");
	},
	
	prefsClose: function()
	{
		this.$.prefsPopup.close();
	},

	notifToggleChanged: function(inSender, inState)
	{
		var dailyDealNotifier = new Groupon.DailyDealNotifier();
		
		if (inState) 
		{
			//enable the daily deal notifier
			dailyDealNotifier.setDailyDealAlarm(this);
			enyo.log("Enabling daily deal notifications");
			
			/*
			 * Enable this when customizing the timing
			 * 
			//add a row with the current notification time
			this.$.settingsRowGroup.createComponent({
				name: "notifTimeRow",
				tapHighlight: true,
				components: [
				   {content: "Notification Time", flex: 1},
				   {content: "6:00pm", className: "enyo-label"}
				]
			});
			this.$.settingsRowGroup.render();
			*/
		}
		else {
			//remove the daily deal alarm
			dailyDealNotifier.cancelDailyDealAlarm();
			enyo.log("Disabling daily deal notifications");
		}
	},
	
	showAbout: function() 
	{
		this.$.scrim.show();
		this.$.aboutPopup.openAtCenter();
	},
	
	aboutClose: function()
	{
		this.$.scrim.hide();
		this.$.aboutPopup.close();
	},
	
	helpClicked: function()
	{
		this.$.scrim.show();
		this.$.helpPopup.openAtCenter();
	},
	
	helpClose: function()
	{
		this.$.scrim.hide();
		this.$.helpPopup.close();
	},
	
	launchGrouponSite: function()
	{
		//launch to the main website of groupon
		this.$.launchBrowser.call({ id: 'com.palm.app.browser', params: { target:"http://www.groupon.com" }});
	},
	
	launchGrouponAboutSite: function()
	{
		//launch to the About website of groupon
		this.$.launchBrowser.call({ id: 'com.palm.app.browser', params: { target:"http://www.groupon.com/about" }});
	},
	
	launchDNSSite: function()
	{
		//launch to our DNS Mobile support site
		this.$.launchBrowser.call({ id: 'com.palm.app.browser', params: { target:"http://www.dns-mobile.com" }});
	},
	
	launchDNSGrouponSite: function()
	{
		//launch to our DNS Mobile support site
		this.$.launchBrowser.call({ id: 'com.palm.app.browser', params: { target:"http://www.dns-mobile.com/groupon" }});
	},
	
	launchSupportEmail: function()
	{
		//launch the email application to the support email
	    this.$.openEmailCall.call({"target": "mailto: support@dns-mobile.com"});
	}
	
});