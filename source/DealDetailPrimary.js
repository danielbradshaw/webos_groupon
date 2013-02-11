enyo.kind({
	kind: enyo.VFlexBox,
	name: "Groupon.DealDetailPrimary",
	className: "dealDetailPrimary",
	components: [
		{
		    name : "launchBrowserCall",
		    kind : "PalmService",
		    service : "palm://com.palm.applicationManager/",
		    method : "open",
		    onSuccess : "launchFinished",
		    onFailure : "launchFail",
		    subscribe : true
		},
		{
			kind: enyo.HFlexBox,
			components: [
			   { 
				   kind: enyo.VFlexBox,
				   flex: 1,
				   components: [
				      { name: "title", className: "dealDetailTitle", content: "" },
				      { name: "subtitle", className: "dealDetailSubtitle", content: "" }   
				   ]
			   },
			   { name: "dealPrice", className: "dealPriceText", content: "" }
			]
		},
		{ 
			kind: enyo.HFlexBox,
			components: [
			   { 
				   kind: enyo.VFlexBox,
				   flex: 1,
				   components: [
				      { 
				    	  kind: enyo.HFlexBox,
				    	  className: "buyBox",
				    	  components:[
				    	     {
				    	    	 kind: enyo.VFlexBox,
				    	    	 flex: 1,
				    	    	 components: [
				    	    	    { content: "Value", className: "buyBoxTitleText", flex: 1 },
				    	    	    { name: "dealValue", className: "buyBoxContentText", content: "", flex: 1 }
				    	    	 ]
				    	     },
				    	     {
				    	    	 kind: enyo.VFlexBox,
				    	    	 flex: 1,
				    	    	 components: [
				    	    	    { content: "Discount", className: "buyBoxTitleText", flex: 1 },
				    	    	    { name: "dealDiscount", className: "buyBoxContentText", content: "", flex: 1 }
				    	    	 ]
				    	     },
				    	     {
				    	    	 kind: enyo.VFlexBox,
				    	    	 flex: 1.25,
		    	            	 components: [
		    	            	    { content: "You Save", className: "buyBoxTitleText", flex: 1 },
		    	            	    { name: "dealSave", className: "buyBoxContentText", content: "", flex: 1 }      
		    	            	 ]
		    	             }
				    	  ]
				      },
				      { 
				    	  kind: enyo.VFlexBox, 
				    	  className: "timeLeftBox",
				    	  components: [
				    	     { content: "Time Left To Buy", className: "timeLeftTitleText", flex: 1 },
				    	     { name: "dealTimeLeft", className: "timeLeftDateText", content: "", flex: 1 }
				    	  ]
				      },
				      { 
				    	  kind: enyo.VFlexBox, 
				    	  flex: 1,
				    	  className: "amountSoldBox",
				    	  components: [
				    	     { name: "dealAmountSold", className: "amountSoldText", content: "", flex: 1 },
				    	     { content: "The deal is on!", className: "amountSoldSubText", flex: 1 }
				    	  ]
				      },
				      { 
				    	  kind: enyo.HFlexBox,
				    	  className: "buyButton",
				    	  pack: "center",
				    	  flex: 1,
				    	  components: [
				    	     {
						    	 kind: enyo.Image,
						    	 name: "buyButton",
						    	 src: "images/btn_buy.png",  
						    	 onclick: "buyButtonClick"
				    	     }
				    	  ]
				      }
				   ]
			   },
			   { kind: "Image", name: "mainImage", className: "dealDetailImage", flex: 2, width: "440px", height: "267px" }
			]
		}
	],
	
	
	/* PUBLIC METHODS */
	
	populatePrimaryDealDetails: function(inDeal) {
	  	if (inDeal) {
		  	/* setup the view using the deal's details */
	  		this.deal = inDeal;
	  		
	  		//set the main deal area's values
	  		var mainOption = inDeal.options[0];
	    	var locations = mainOption.redemptionLocations;
	  		this.$.title.setContent(inDeal.merchant.name + " - " + ((locations.length > 0) ? locations[0].city : "Online Deal"));
	  		this.$.subtitle.setContent(inDeal.announcementTitle);
	  		this.$.dealPrice.setContent(mainOption.price.formattedAmount);
	  		this.$.dealValue.setContent("$" + (mainOption.value.amount / 100));
	  		this.$.dealDiscount.setContent(mainOption.discountPercent + "%");
	  		this.$.dealSave.setContent("$" + (mainOption.discount.amount / 100));
	  		this.$.dealTimeLeft.setContent(this.calculateTimeLeft(inDeal.endAt));
	  		this.$.dealAmountSold.setContent(inDeal.soldQuantity + " bought");
	  		
	  		//set the image to blank before setting the url so as to not show stale images 
	  		this.$.mainImage.setSrc("$base-themes-default-theme/images/blank.gif");
	  		this.$.mainImage.setSrc(this.deal.largeImageUrl);
	  	}
	},
	
	clearScreen: function() {
		  this.$.title.setContent("");
		  this.$.subtitle.setContent("");
		  this.$.dealValue.setContent("");
		  this.$.dealDiscount.setContent("");
	  	  this.$.dealSave.setContent("");
	  	  this.$.dealTimeLeft.setContent("");
		  this.$.mainImage.setSrc("$base-themes-default-theme/images/blank.gif");
	},
	
	
	/* CALLBACK METHODS */
	
	buyButtonClick: function(inSender) {
		var buyUrl = this.deal.options[0].buyUrl;
		if (buyUrl) {
			//construct the url to support affiliate clicks
			var finalBuyUrl = "http://www.anrdoezrs.net/click-5345321-10804307?url=" + encodeURIComponent(buyUrl);
			
			//launch the browser to the buy url provided in the api
			this.$.launchBrowserCall.call({ id: 'com.palm.app.browser', params: { target:finalBuyUrl }});
		}
		else {
			enyo.log("Error retrieving a buy url.");
		}
	},
	
	launchFinished : function(inSender, inResponse) {
	    console.log("Launch browser success, results = " + enyo.json.stringify(inResponse));
	},
	
	launchFail : function(inSender, inResponse) {
	    console.log("Launch browser failure, results = " + enyo.json.stringify(inResponse));
	}, 
	
	
	/* PRIVATE METHODS */
	
	calculateTimeLeft: function(endAt) {
		var one_day = 1000 * 60 * 60 * 24;
		var endDate = new Date(endAt);
  		var timeLeftMS = endDate - (new Date());
  		var timeLeftDate = new Date(timeLeftMS);
  		var timeLeftHours = timeLeftDate.getUTCHours() + "h and " + timeLeftDate.getUTCMinutes() + "m";
  		var daysLeft = Math.floor(timeLeftMS / one_day); 
		return daysLeft + " day" + ((daysLeft != 1) ? "s " : " ") + timeLeftHours;
	}

});