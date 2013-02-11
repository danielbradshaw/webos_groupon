enyo.kind({
  name: "Groupon.Main",
  kind: enyo.VFlexBox,
  components:[
//	{
//		kind: "PageHeader",
//		content: "Groupon"
//	},
	{
		kind:"Groupon.AppMenu",
		name:"mainAppMenu"
	},
	{
		kind: "SlidingPane",
		name: "slidingPane",
		flex: 1,
		components:[
		  {
			  kind: "SlidingView",
			  name: "divisionSlidingView",
			  width: "300px",
			  edgeDragging: true,
			  components:[
			     { kind: "Header", content: "Divisions", className: "header" },
			     { kind: "Groupon.DivisionList", name: "divisionList", flex: 1, onSelect: "divisionSelected" }
			  ]
		  },
		  {
			  kind: "SlidingView",
			  name: "dealSlidingView",
			  width: "350px",
			  edgeDragging: true,
			  components:[
			     { kind: "Header", content: "Deals", className: "header" },
			     {
			    		name: "subHead",
			    		kind: enyo.Control,
						style: "background-image: url(images/confirmprompt-background.png)", height: "40px",
						showing: false,
			    		components: 
			    		[
			    		     {
			    		    	 name: "caption", 
			    		    	 className: "subHeadCaption",
			    		    	 height:"40px"
			    		    },
			    		]
			     },
				 { kind: "Groupon.DealsList", name: "dealsList", flex: 1, onSelect: "dealSelected" }
			  ]
		  },
		  {
			  kind: "SlidingView",
			  name: "detailSlidingView",
			  edgeDragging: true,
			  minWidth: "674px",
			  flex: 1,
			  components:[
			     { kind: "Header", content: "Details", className: "header" },
			     { kind: "Groupon.DealDetail", name: "dealDetail", flex: 1 }
		  	  ]
		  }
		]
	}
  ],
  
  divisionSelected: function(inSender, inDivision) {
 	  if (inDivision) {
		  this.$.dealDetail.clearScreen();
		  this.$.dealsList.updateDealsList(inDivision.id);
		  this.$.slidingPane.selectView(this.$.dealSlidingView);
		  this.$.subHead.setShowing(true);
		  this.$.caption.setContent(inDivision.name+", "+inDivision.country);
		  
	      //show the alarm dialog if it hasn't been shown
	      var dailyDealNotifier = new Groupon.DailyDealNotifier();
	      dailyDealNotifier.showInitialAlarmDialog();
	  }	  	  
  },
  
  dealSelected: function(inSender, inDeal) {
	  if (inDeal) {
		  this.$.dealDetail.populateDealDetails(inDeal);
	  }
  }
  
});