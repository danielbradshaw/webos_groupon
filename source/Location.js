enyo.kind({
	  name: "Groupon.Location",
	  kind: enyo.Component,
	  events: { 
		  onNearestDivisionObtained: ""
	  },
	  components: [
	    {
            name : "locationProvider",
            kind : "PalmService",
            service : "palm://com.palm.location/",
            method : "getCurrentPosition",
            onSuccess : "posFinished",
            onFailure : "posFail",
            onResponse : "gotResponse",
            subscribe : true
	    }
	  ],

	  
/* INHERITED METHODS */  

create: function() 
{
	this.inherited(arguments);
	this.divisions = [];
	this.closestDivision = [];
},


/* PRIVATE METHODS */

distance:function(x1,y1,x2,y2) 
{
	var x = x2 - x1;
	var y = y2 - y1;
	
	var hyp = Math.sqrt(x*x + y*y);
	return hyp;
},


/* METHOD CALLBACKS */

posFinished : function(inSender, inResponse) 
{
    var listLocation = 0;
    var minDistance = -1;
    for (var i = 0; i < this.divisions.length; i++) 
    {
    	
    	  var division = this.divisions[i];
    	  var currDistance = this.distance(inResponse.latitude,inResponse.longitude,division.lat,division.lng);
    	  
    	  if((currDistance <= minDistance)||(minDistance == -1))
    	  {
    		  listLocation = i;
    		  this.closestDivision=division;
    		  minDistance = currDistance;
    	  }
    }
    this.doNearestDivisionObtained(this.closestDivision, listLocation);
},

posFail : function(inSender, inResponse) 
{
    console.log("getCurrentPosition failure, results=" + enyo.json.stringify(inResponse));
    this.doNearestDivisionObtained(null, 0);
},


/* PUBLIC METHODS */

getNearestDivisionFromList : function(allDivisions)
{
	this.divisions=allDivisions;
    this.$.locationProvider.call({});
}

});
