enyo.kind({
	name: "Groupon.DailyDealNotifier",
	kind: enyo.Component,
	components: [
	   {
		   name: "dailyDealAlarm",
		   kind: "PalmService",
		   service: "palm://com.palm.power/timeout",
		   method: "set",
		   onSuccess: "alarmSuccess",
		   onFailure: "alarmFailure"
	   },
	   {
		   name: "dailyDealAlarmClear",
		   kind: "PalmService",
		   service: "palm://com.palm.power/timeout",
		   method: "clear",
		   onSuccess: "alarmSuccess",
		   onFailure: "alarmFailure"
	   },
	   {
		   name: "getDeals", 
		   kind: "WebService",
		   onSuccess: "gotDeals",
		   onFailure: "gotDealsFailure"
	   },
	   {
		   name: "dashboard", 
		   kind:"Dashboard", 
		   onIconTap: "", 
		   onMessageTap: "messageTap", 
		   onIconTap: "iconTap", 
		   onUserClose: "dashboardClose", 
		   onLayerSwipe: "layerSwiped"
	   },
	   {
		   kind: "ModalDialog", 
		   name: "dailyDealDialog", 
		   caption: "Groupon Daily Deal", 
		   components:[
		      { content: "Groupon Mobile can now alert you about featured daily deals in your area! Would you like to enable this feature?", className:"enyo-item-ternary", style: "margin-bottom:20px;" },
		      {
		    	  layoutKind: "HFlexLayout", 
		    	  components: [  
		    	     { kind: "Button", caption: "Close", flex: 1, onclick: "disableDailyDealClicked" },
		    	     { kind: "Button", caption: "Enable", flex: 1, onclick: "enableDailyDealClicked", className: "enyo-button-dark" }
		    	  ]
		      }
		   ]
	   }
	],

	  
	/* INHERITED METHODS */  

	create: function() {
		this.inherited(arguments);
	},
	

	/* METHOD CALLBACKS */
	
	enableDailyDealClicked: function(inSender)
	{
		//set cookie true since the dialog has now been shown
		enyo.setCookie(GROUPON_DAILY_DEAL_SHOWN_KEY, "true");
		
		//enable was clicked, set daily alarm
		this.setDailyDealAlarm();
	},
	
	setDailyDealAlarm: function() 
	{
		this.$.dailyDealDialog.close();
		var today = new Date();
		var tomorrow = new Date();
		//tomorrow.setDate(today.getDate() + 1);
		//tomorrow.setHours(6);
		
		// TODO: remove
		tomorrow.setMinutes(tomorrow.getMinutes());
		
		var dateString = this.toDoubleDigits(tomorrow.getUTCMonth() + 1) 
							+ "/" + this.toDoubleDigits(tomorrow.getUTCDate()) 
							+ "/" + tomorrow.getUTCFullYear() 
							+ " " + this.toDoubleDigits(tomorrow.getUTCHours()) + ":00:00";

		this.$.dailyDealAlarm.setParams({
			key: enyo.fetchAppId() + '.dailyDeal',
			at: dateString,
			wakeup: true,
			uri: 'palm://com.palm.applicationManager/launch',
			params: {
				'id': enyo.fetchAppId(),
				'params': {
					action: 'getDailyDeal'
				}
			}
		});
		
		this.$.dailyDealAlarm.call();
		
		//set cookie true since we set the daily alarm
		enyo.setCookie(GROUPON_DAILY_DEAL_ENABLED, "true");
	},
	
	disableDailyDealClicked: function(inSender) 
	{	
		//set cookie true since the dialog has now been shown
		enyo.setCookie(GROUPON_DAILY_DEAL_SHOWN_KEY, "true");
		
		//user chose not to show daily deals, don't show
		this.$.dailyDealDialog.close();
	},
	
	messageTap: function() {
		//relaunch the app without window parameters so it launches normally
		var window = enyo.windows.activate(enyo.fetchAppRootPath() + "/index.html", "groupon", null);
		this.$.dashboard.pop()
	},
	
	alarmSuccess: function(inSender) {
		enyo.log("Alarm set successfully");
	},
	
	alarmFailure: function(inSender, inError, inRequest) {
		enyo.log("Alarm set has failed, details: " + enyo.json.stringify(inError));
	},
	
	gotDeals: function(inSender, inResponse, inRequest) 
	{
		var deals = inResponse.deals;
		if (deals && deals.length > 0) {
			var deal = this.getFeaturedDeal(deals);
				
			if (deal) {
				//show a dashboard with the featured deal
				this.$.dashboard.push({icon:"icon48.png", title:"Groupon Daily Deal", text:deal.announcementTitle});
				enyo.windows.addBannerMessage("New groupon deal!", "{}");
			}
		}
		else {
			//no deals were found, show dashboard 
			this.$.dashboard.push({icon:"icon48.png", title:"Groupon Daily Deal", text:"Unable to retrieve the Groupon daily deal"});
			enyo.windows.addBannerMessage("New groupon deal!", "{}");
		}
		
		//we have finished the daily check, set alarm for next day
		//this.setDailyDealAlarm();
	},
	  
	gotDealsFailure: function(inSender, inResponse) {
		enyo.log("DailyDealNotifier:gotDealsFailure - received failure from web service: " + inResponse); 
	},
	

	/* PUBLIC METHODS */
	
	showInitialAlarmDialog: function() 
	{			
		//if the dialog has not yet been shown, show it
		var dailyDealDialogCookie = enyo.getCookie(GROUPON_DAILY_DEAL_SHOWN_KEY);
		if (!dailyDealDialogCookie || dailyDealDialogCookie != "true") 
		{	
			//the dialog has not yet been shown, so display it
			this.$.dailyDealDialog.openAtCenter();
		}
	},
	
	getDailyDeal: function() 
	{	
		//get the last stored division id
		var lastDivisionID = enyo.getCookie(GROUPON_LAST_LOCATION_KEY);
		
		if (lastDivisionID) 
		{
			//launch a download for the daily deals
			enyo.log("last division: " + GROUPON_DEALS_URL + lastDivisionID);
			this.$.getDeals.setUrl(GROUPON_DEALS_URL + lastDivisionID);
			this.$.getDeals.call();
		}
	},
	
	cancelDailyDealAlarm: function()
	{
		this.$.dailyDealAlarmClear.setParams({
			key: enyo.fetchAppId() + '.dailyDeal',
			params: {
				'id': enyo.fetchAppId(),
			}
		});
				
		this.$.dailyDealAlarmClear.call();
		
		//set cookie false since we canceled the daily alarm
		enyo.setCookie(GROUPON_DAILY_DEAL_ENABLED, "false");
	},
	
	
	/* PRIVATE METHODS */
	
	getFeaturedDeal: function(deals) 
	{
		//if we have deals, find the featured one
		if (deals && deals.length > 0) {
			for (var i = 0; i < deals.length; i++) {
				if (deals[i].placementPriority == "featured") {
					return deals[i];
				}
			}
		}
	},
	
	toDoubleDigits: function(val) 
	{
		if (val >= 10) {
			return val.toString();
		}
		else {
			return "0" + val;
		}
	}
	
});