enyo.kind({
  name: "Groupon.DivisionList",
  kind: enyo.VFlexBox,
  events: { 
      onSelect: ""
  },
  components: [
     {
    	 name: "getDivisions", 
    	 kind: "WebService",
    	 onSuccess: "gotDivisions",
    	 onFailure: "gotDivisionsFailure"
     },
     { 
         name: "locationProvider", 
         kind: "Groupon.Location", 
         onNearestDivisionObtained: "divisionObtained" 
     },
     {
     	 name: "divisionSpinner",
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
     	 name: "divisionList",
     	 kind: "VirtualList",
    	 flex: 1,
    	 onSetupRow: "setupDivisionRow",
    	 
    	 components:
    	 [
    	    {
    		    kind: "Item",
    	   	    className: "divisionItem",
    	   	    layoutKind: "HFlexLayout",
    	   	    /* tapHighlight: true, */
    	   	    components: [
    	   	       { name:"divisionName", flex:1},
    	   	       { name:"divisionSubtitle", className:"enyo-item-ternary" }
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
    	    { kind: "ToolSearchInput", name: "toolSearchInput", onchange: "searchInputChange", onCancel:"resetLocations"},
    	    { icon: "images/toolbar-icon-gps.png", name: "gpsButton", onclick: "gpsButtonClick", showing: true },
    	    { kind: "Spinner", name: "gpsSpinner", className: "gpsSpinner", showing: false }
    	 ]
     },
     {
    	 kind: "ModalDialog", 
    	 name: "locationErrorPopup", 
    	 caption: "Location Error", 
    	 components:[
            { content: "Unable to retrieve your location. Please check your location settings in the Location Services application.", className: "enyo-text-error" },
            { kind: "Button", caption: "OK", onclick: "closePopup", style: "margin-top:20px" }
		 ]
     },
     {
    	 kind: "ModalDialog", 
    	 name: "downloadErrorPopup", 
    	 caption: "Download Error", 
    	 components:[
            { content: "An error occured when attempting to download the list of locations. Please check your network settings.", className: "enyo-text-error" },
            {
            	kind: enyo.HFlexBox, 
            	components: [  
            	   { kind: "Button", caption: "Exit", flex: 1, onclick: "exitClicked", style: "margin-top:20px" },
           	       { kind: "Button", caption: "Retry", flex: 1, onclick: "retryClicked", style: "margin-top:20px", className: "enyo-button-dark" }
                ]
            }
		 ]
     }
  ],
  
  
  /* INHERITED METHODS */
  
  create: function() 
  {
      this.inherited(arguments);
      this.initializeAndReloadList();
  },
  
  
  /* PRIVATE METHODS */
  
  setLocationCookie: function(lastLocationDivision) 
  {
	  enyo.setCookie(GROUPON_LAST_LOCATION_KEY, lastLocationDivision.id/*, { "Max-Age": 0 }*/);
  },
  
  getLastLocationDivision: function() 
  {
	  return enyo.getCookie(GROUPON_LAST_LOCATION_KEY);		
  },
  
  loadUpLastLocationsDeals: function(inDivisionID)
  {
	  var  traverseDivisions = this.allDivisions.slice(0);

	  for (var i = 0; i < traverseDivisions.length; i++) 
	  {
		  var division = traverseDivisions[i];
		  if (division.id == inDivisionID)
		  {
			  this.doSelect(division);
			  this.selectedRow = i;
		  }
	  }
  },
  
  initializeAndReloadList: function() 
  {
      this.$.divisionList.setShowing(false);
      this.$.divisionSpinner.setShowing(true);
      this.allDivisions = [];
      this.currentDivisions = [];
      this.$.getDivisions.setUrl(GROUPON_DIVISIONS_URL);
      this.$.getDivisions.call();
  },
  
  
  /* METHOD CALLBACKS */
  
  setupDivisionRow: function(inSender, inIndex) 
  {
      var division = this.currentDivisions[inIndex];

      if (division) 
      {
    	  this.$.divisionName.setContent(division.name);
    	  this.$.divisionSubtitle.setContent(division.country);
   		  this.$.item.applyStyle("background", (this.selectedRow == inIndex) ? "#dde8cf" : null);
    	  
    	  return true;
      }

      return false; 
  },
  
  searchInputChange: function() 
  {
	  this.$.divisionList.$.scroller.punt();
	  var searchTerm = this.$.toolSearchInput.getValue();
	  
	  if (searchTerm == "") {
		  this.currentDivisions = this.allDivisions.slice(0);
	  }
	  else {
		  this.currentDivisions = [];
		  for (i = 0; i < this.allDivisions.length; i++) {
			  var division = this.allDivisions[i]; 
			  if (division.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
				  this.currentDivisions.push(division);
			  }
			  else if (division.country.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
				  this.currentDivisions.push(division);
			  }
		  }
	  }
	  
	  this.$.divisionList.refresh();
  },
  
  resetLocations: function() 
  {
	  this.$.divisionList.$.scroller.punt();	  
	  this.currentDivisions = this.allDivisions.slice(0);
	  this.$.divisionList.refresh();
  },
  
  gotDivisions: function(inSender, inResponse, inRequest) 
  {
      this.$.divisionList.setShowing(true);
      this.$.divisionSpinner.setShowing(false);
      
      if (inResponse.divisions) {
	      this.allDivisions = inResponse.divisions;
	      this.currentDivisions = inResponse.divisions.slice(0);
	      this.selectedRow = -1;
	      this.$.divisionList.refresh();
	
	      var lastDivisionID = this.getLastLocationDivision();
	      if (lastDivisionID) {
	    	  this.loadUpLastLocationsDeals(lastDivisionID);
	      }	
      }
      else {
    	  //if the divisions fail, show the error dialog
          this.$.downloadErrorPopup.openAtCenter();
      }
  },
  
  gotDivisionsFailure: function(inSender, inResponse) 
  {
      enyo.log("gotDivisionFailure: received failure from web service - " + enyo.json.stringify(inResponse));
      this.$.divisionSpinner.setShowing(false);
      this.$.downloadErrorPopup.openAtCenter();
  },
  
  listItemClick: function(inSender, inEvent) 
  {
      var division = this.currentDivisions[inEvent.rowIndex];
      this.selectedRow = inEvent.rowIndex;
      this.doSelect(division);
	  this.setLocationCookie(division);
      this.$.divisionList.refresh();
  },
  
  gpsButtonClick: function(inSender) 
  {
	  this.$.gpsSpinner.setShowing(true);
	  this.$.gpsButton.setShowing(false);

	  this.$.locationProvider.getNearestDivisionFromList(this.allDivisions);
  },
  
  divisionObtained: function(inSender, inDivision, withLocation) 
  {
	  this.$.gpsSpinner.setShowing(false);
	  this.$.gpsButton.setShowing(true);
	  
	  if (inDivision) 
	  {
		  this.currentDivisions = this.allDivisions.slice(0);
		  this.selectedRow = withLocation;
		  this.doSelect(inDivision);
		  this.setLocationCookie(inDivision);
		  this.$.divisionList.refresh();
	  }
	  else {
		  //if no division was selected, show a location error
		  this.$.locationErrorPopup.openAtCenter();
	  }
  },
  
  closePopup: function(inSender, inEvent)
  {
	  //whatever popup we use, this should close it properly
	  inSender.parent.parent.parent.close();
  },
  
  exitClicked: function(inSender, inEvent)
  {
	  //close the download error popup
	  this.$.downloadErrorPopup.close();
	  
	  //close the application programmatically
	  window.close();
  },
  
  retryClicked: function(inSender, inEvent)
  {
	  //close the download error popup
	  this.$.downloadErrorPopup.close();
	  
	  //retry the download of the division list
      this.initializeAndReloadList();
  }
  
});