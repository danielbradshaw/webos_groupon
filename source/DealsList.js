enyo.kind({
  name: "Groupon.DealsList",
  kind: enyo.VFlexBox,
  events: { 
      onSelect: ""
  },
  components:[
     {
    	 name: "getDeals", 
    	 kind: "WebService",
    	 onSuccess: "gotDeals",
    	 onFailure: "gotDealsFailure"
     },
     {
     	 name: "dealSpinner",
     	 kind: enyo.VFlexBox,
    	 flex: 1,
	     showing: false,
    	 components: 
    	 [
    	  	{
    	      layoutKind: "VFlexLayout", 
    	      align: "center", 
    	      pack: "center", 
    	      flex: 1, 
    	      components: 
    	      [
    	       	{
    	       		name: "loadingSpinner",
    	       		kind: "SpinnerLarge", 
    	       		showing: true
    	       	}
    	      ]
    	  	}
    	 ]
     },
     {
    	 name: "dealList",
    	 kind: "VirtualList",
    	 flex: 1,
    	 onSetupRow: "setupDealRow",
    	 components:[
    	    {
    		    kind: "Item",
    	   	    className: "dealItem",
    	   	    layoutKind: "HFlexLayout",
    	   	    components: [
    	   	       { 
    	   	    	   kind: enyo.VFlexBox, 
    	   	    	   pack: "center", 
    	   	    	   components: [
    	   	    	      { name:"thumbnail", kind: "Image", className: "imageSidebar", width: "100px", height: "60px" },
    	   	    	      { name:"featuredText", className:"featuredText", content: "FEATURED" }
    	   	    	   ]
    	   	       },
    	   	       {
    	   	    	   kind: enyo.VFlexBox,
    	   	    	   pack: "center",
    	   	    	   flex: 1,
    	   	    	   components: [
    	   	    	      { name:"dealTitle" },
    	   	    	      { name:"dealSubtitle", className:"enyo-item-ternary" }
   	    	      	   ]
    	   	       }
    	   	    ],
    	   	    onclick: "listItemClick"
    	    }
     	 ]
     },
     { 
    	 kind: "Toolbar", 
    	 className: "toolbar",
    	 
    	 components: 
    	 [
    	  	{ kind: "GrabButton" },
    	  	{ kind: "Spacer" },
    	    { icon: "images/menu-icon-refresh.png", name: "refreshButton", onclick: "refreshButtonClick", showing: true },
    	 ]
     },
     {
    	 kind: "ModalDialog", 
    	 name: "downloadErrorPopup", 
    	 caption: "Download Error", 
    	 components:[
            { content: "An error occured when attempting to download the list of current deals. Please check your network settings.", className: "enyo-text-error" },
            {
            	kind: enyo.HFlexBox, 
            	components: [  
            	   { kind: "Button", caption: "Cancel", flex: 1, onclick: "closePopup", style: "margin-top:20px" },
           	       { kind: "Button", caption: "Retry", flex: 1, onclick: "retryClicked", style: "margin-top:20px", className: "enyo-button-dark" }
                ]
            }
		 ]
     }
  ],
  
  
  /* INHERITED METHODS */
  
  create: function() {
      this.inherited(arguments);
      this.deals = [];
      this.currentDivisionId;
  },
  
  
  /* PUBLIC METHODS */
  
  updateDealsList: function(divisionId) {
	  
	  this.$.currentDivisionId = divisionId;
	  
      this.$.dealList.setShowing(false);
      this.$.dealSpinner.setShowing(true);
	  
      if (this.deals.length > 0) {
    	  this.deals = [];
    	  this.$.dealList.$.scroller.punt();	  
    	  this.$.dealList.refresh();
      }
 
      this.$.getDeals.setUrl(GROUPON_DEALS_URL + divisionId);
      this.$.getDeals.call();
  },
  
  
  /* METHOD CALLBACKS */
  
  setupDealRow: function(inSender, inIndex) {
      var deal = this.deals[inIndex];
      if (deal) {
    	  this.$.dealTitle.setContent(deal.announcementTitle);
    	  this.$.dealSubtitle.setContent(deal.title);
    	  this.$.thumbnail.setSrc(deal.sidebarImageUrl);    	  
   		  this.$.item.applyStyle("background", (this.selectedRow == inIndex) ? "#dde8cf" : null);
    	  this.$.featuredText.setShowing(deal.placementPriority == "featured");
    	  return true;
      }
      return false; 
  },
  
  gotDeals: function(inSender, inResponse, inRequest) {
      this.deals = inResponse.deals;
	  if (this.deals) {
		  if (this.deals.length > 0) {
			  this.$.dealList.setShowing(true);
			  this.$.dealSpinner.setShowing(false);
			  this.doSelect(this.deals[0]);
			  this.selectedRow = 0;
			  this.$.dealList.refresh();
		  }
	  }
	  else {
		  this.$.dealSpinner.setShowing(false);
		  this.$.downloadErrorPopup.openAtCenter();
	  }
  },
  
  gotDealsFailure: function(inSender, inResponse) {
      enyo.log("gotDealsFailure: received failure from web service - " + inResponse);
      this.$.dealSpinner.setShowing(false);
      this.$.downloadErrorPopup.openAtCenter();  
  },
  
  listItemClick: function(inSender, inEvent) {
      var deal = this.deals[inEvent.rowIndex];
      this.doSelect(deal);
      this.selectedRow = inEvent.rowIndex;
      this.$.dealList.refresh();
  },
  
  refreshButtonClick: function(inSender) {
	  if(this.$.currentDivisionId) {
		  this.updateDealsList(this.$.currentDivisionId);
	  }
  },
  
  closePopup: function(inSender, inEvent) {
	  //whatever popup we use, this should close it properly
	  this.$.downloadErrorPopup.close();
      this.$.dealList.setShowing(true);
  },
  
  retryClicked: function(inSender, inEvent) {
	  //close the download error popup
	  this.$.downloadErrorPopup.close();
	  
	  //retry the download of the division list
	  this.updateDealsList(this.$.currentDivisionId);
  }
  
});