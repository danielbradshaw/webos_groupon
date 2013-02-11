enyo.kind({
  name: "Groupon.DealDetail",
  kind: enyo.VFlexBox,
  components:[
	{
		name : "openMapCall",
	    kind : "PalmService",
	    service : "palm://com.palm.applicationManager/",
	    method : "open",
	    onSuccess : "openMapSuccess",
	    onFailure : "openMapFailure",
	    subscribe : true
	}, 
	{
	    name : "openEmailCall",
	    kind : "PalmService",
	    service : "palm://com.palm.applicationManager/",
	    method : "open",
	    subscribe : true
	},
	{
	    name : "openMessagingCall",
	    kind : "PalmService",
	    service : "palm://com.palm.applicationManager/",
	    method : "launch",
	    subscribe : true
	},
	{
	    name : "openFacebookCall",
	    kind : "PalmService",
	    service : "palm://com.palm.applicationManager/",
	    onFailure : "openFacebookFailed",
	    method : "launch",
	    subscribe : true
	},
	{
	    name : "openFacebookCallBrowser",
	    kind : "PalmService",
	    service : "palm://com.palm.applicationManager/",
	    method : "open",
	    subscribe : true
	},
	{
	    name : "openTwitterCall",
	    kind : "PalmService",
	    service : "palm://com.palm.applicationManager/",
	    method : "open",
	    subscribe : true
	},
	{
		kind: "Groupon.DealDetailPrimary",
		name: "dealDetailPrimary",
		className: "dealDetailPrimary",
		showing: false
	},
	{
		kind: "TabGroup",
		name: "radioGroup",
		className: "radioGroup",
		onChange: "radioChanged",
		showing: false, 
		components: [
		   { label: "Description"},//, className: "enyo-radiobutton-dark" },
		   { label: "Highlights"},//, className: "enyo-radiobutton-dark" },
		   { label: "Details"},//, className: "enyo-radiobutton-dark" },
		   { label: "Locations"}//, className: "enyo-radiobutton-dark" }
	    ]
	},
	{
	  kind: "Scroller",
	  name: "tabContentScroller",
	  className: "tabContentScroller",
	  showing: false,
	  flex: 1,
	  components: [
		 { name: "textContent", content: "", style: "padding: 7px", allowHtml: true, flex: 1 },
		 { 
			 name: "locationGroup", 
			 kind: "RowGroup", 
			 caption:"Show On Map",
			 defaultKind: "HFlexBox", 
			 showing: false, 
			 onclick: "locationClicked"
		}
	  ]
	},
	{
		kind: enyo.HFlexBox,
		name: "placeHolder",
		flex: 1,
		showing: true
	},
    { 
		kind: "Toolbar", 
		className: "toolbar", 
		align: "bottom",
		components: [
		   { kind: "GrabButton" },
		   { kind: "Spacer" },
		   { icon: "images/toolbar-icon-discussions.png", onclick: "showDiscussions" },
		   { icon: "images/toolbar-icon-share.png", onclick: "showShareMenu" },
		   { 
			   kind: "Menu",
			   style: "padding-right:15px",
			   components: [
			      { content: "E-mail", icon: "images/share-icon-email.png", onclick: "shareDealEmailClicked" },
				  { content: "Messaging", icon: "images/share-icon-text.png", onclick: "shareDealMessagingClicked" },
				  { content: "Facebook", icon: "images/share-icon-facebook.png", onclick: "shareDealFacebookClicked" },
				  { content: "Twitter", icon: "images/share-icon-twitter.png", onclick: "shareDealTwitterClicked" }
			   ]
		   },
		] 
	},
    {
		kind: "Popup", 
		name: "discussionsPopup",
		scrim: true,
		//style: "-webkit-border-image:none;", //have custom theme
		width: "75%", 
		height: "75%",
		layoutKind: "VFlexLayout", 
		dismissWithClick: false,
		components: [
		   { content: "Discussions", className: "discussionText" },
		   { kind: "Groupon.DiscussionPosts", name: "discussionPosts", flex: 1, width: "100%", height: "100%" },
		   { kind: "Button", caption: "Close", className: "discussionCloseButton", onclick: "discussionsClose" }
		]
	}
  ],
  
  
  /* INHERITED METHODS */
  
  create: function() {
      this.inherited(arguments);
      this.deal = null;
  },
  
  
  /* PUBLIC METHODS */
  
  populateDealDetails: function(inDeal) {
  	if (inDeal) {
  		/* setup the view using the deal's details */
  		this.deal = inDeal;
  		
  		//set the primary deal area's values
  		this.$.dealDetailPrimary.setShowing(true);
  		this.$.dealDetailPrimary.populatePrimaryDealDetails(inDeal);
  		
  		//show the tab group and set the initial textual content values
  		this.$.radioGroup.setShowing(true);
  		this.$.radioGroup.setValue(0);
  		this.$.textContent.setContent(this.deal.pitchHtml);
  		this.$.locationGroup.setShowing(false);
  		this.$.tabContentScroller.setShowing(true);
  		
  		//disable the placeholder which is keeping the toolbar in place
  		this.$.placeHolder.setShowing(false);
  	}
  },
  
  clearScreen: function() {
	  this.$.dealDetailPrimary.setShowing(false);
	  this.$.radioGroup.setShowing(false);
	  this.$.textContent.setContent("");
	  this.$.locationGroup.setShowing(false);
	  
	  //this.$.locationGroup.destroyControls();
	  this.clearLocationRowGroup();
	  
	  this.$.tabContentScroller.setShowing(false);
	  this.$.placeHolder.setShowing(true);
	  this.$.discussionsPopup.close();
  },
  
  
  /* METHOD CALLBACKS */
  
  radioChanged: function(inSender) {
	this.$.textContent.setContent("");
	this.$.locationGroup.setShowing(false);
	this.$.tabContentScroller.setScrollTop(0);
	
	//this.$.locationGroup.destroyControls();
	this.clearLocationRowGroup();
	
  	if (this.deal)
  	{
	    switch(inSender.getValue())
	    {
	    case 0:
	        this.$.textContent.setContent(this.deal.pitchHtml);
	    	break;
	    case 1:
	    	this.$.textContent.setContent(this.deal.highlightsHtml);
	    	break;
	    case 2:
	        this.$.textContent.setContent(this.deal.options[0].details[0].description); 
	    	break;
	    case 3:
	    	var locations = this.deal.options[0].redemptionLocations;
	    	
	    	if (locations.length > 0) {
	    		this.$.locationGroup.setShowing(true);
	    		
		    	//iterate over locations adding them to the row group
		    	for (var i = 0; i < locations.length; i++) {
		    		var singleLineAddress = this.constructLocationString(locations[i]);
		    		this.$.locationGroup.createComponent({ content: singleLineAddress, tapHighlight: true });
		    		this.$.locationGroup.render();
		    	}
	    	}
	    	else { 
	    		this.$.textContent.setContent("No locations available."); 
	    	}
	    	
	    	break;
	    default:
	    	enyo.log("Error: unknown tab selected");
	    }
    }
  },
  
  openMapSuccess: function(inSender, inResponse) {
	  console.log("Open map success, results = " + enyo.json.stringify(inResponse, null, null));
  },
	
  openMapFailure: function(inSender, inResponse) {
	  console.log("Open map failure, results = " + enyo.json.stringify(inResponse, null, null));
  },
  
  locationClicked: function(inSender, inEvent) {
      var locationString = inEvent.dispatchTarget.getContent();
      if (locationString) {
    	  //launch the native maps application using the address as a query
    	  this.$.openMapCall.call({"id":"com.palm.app.maps", "params":{"query":locationString}});
      }
  },
  
  showDiscussions: function(inSender) {
	  if (this.deal) {
		  //show a popup with a list of discussions
		  this.$.discussionsPopup.openAtCenter();
		  this.$.discussionPosts.updatePostsList(this.deal.id);
	  }
  },
  
  discussionsClose: function(inSender) {
	  this.$.discussionsPopup.close();
  },
  
  showShareMenu: function(inSender) {
	  this.$.menu.openAroundControl(inSender);
  },
  
  shareDealEmailClicked: function(inSender) {
	  if (this.deal) {
		  //launch the native email client and auto-populate the body text 
		  this.$.openEmailCall.call({
			  "id": "com.palm.app.email", 
			  "params": {
				  "text": "Check out this deal from Groupon!\n" + this.deal.dealUrl
			  }
		  });
	  }
  },
  
  shareDealMessagingClicked: function(inSender) {
	  if (this.deal) {
		  //launch the native messaging client and auto-populate the body text
		  this.$.openMessagingCall.call({
			  "id": "com.palm.app.messaging", 
			  "params": {
			  	"compose": { "messageText": "Check out this deal from Groupon!\n" + this.deal.dealUrl }
		  	  }
		  });
	  }
  },  
  
  shareDealFacebookClicked: function(inSender) {
	  if (this.deal) {
		  //launch the native facebook client and auto-populate the status field
		  this.$.openFacebookCall.call({
			  "id": "com.palm.app.enyo-facebook",
			  "params": { 
				  "type": "status",
				  "statusText": "Check out this deal from Groupon!\n" + this.deal.dealUrl
			  }
		  });
	  }
  },
  
  openFacebookFailed: function(inSender) {
	  //since the app launch failed, launch to browser
	  var finalFacebookUrl = "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("Check out this deal from Groupon! " + this.deal.dealUrl);
		
		//launch the browser to the Twitter status post url
		this.$.openFacebookCallBrowser.call({ 
			"id": 'com.palm.app.browser', 
			"params": { 
				"target": finalFacebookUrl 
			}
		});
  },
  
  shareDealTwitterClicked: function(inSender) {
	  if (this.deal) {
			//construct the url which allows posting to Twitter
			var finalTwitterUrl = "http://twitter.com/home?status=" + encodeURIComponent("Check out this deal from Groupon! " + this.deal.dealUrl);
			
			//launch the browser to the Twitter status post url
			this.$.openTwitterCall.call({ 
				"id": 'com.palm.app.browser', 
				"params": { 
					"target": finalTwitterUrl 
				}
			});
	  }
  },
  
  
  /* PRIVATE METHODS */
  
  constructLocationString: function(location) {
	  if (location) {
		  //construct a string using a standard comma separated list of the address parts
		  return location.streetAddress1 + ", " + location.city + ", " + location.state + " " + location.postalCode;
	  }
	  return "";
  },
  
  clearLocationRowGroup: function() 
  {
	  //this code is broken in 3.0.2, re-enable when it is fixed 
	  //this.$.locationGroup.destroyControls(); 
	  
	  var controls = this.$.locationGroup.getControls();

	  for(i = 0; i < controls.length; i++) {
		  this.$.locationGroup.removeComponent(controls[i]);
		  controls[i].destroy();
	  }

	  controls = this.$.locationGroup.getComponents();

	  for(i = 0; i < controls.length; i++) {
		  if(controls[i] instanceof enyo.Item) {
			  this.$.locationGroup.removeControl(controls[i]);
			  controls[i].destroy();
		  }
	  }
  }
  
});