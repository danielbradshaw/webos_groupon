enyo.kind({
  name: "Groupon.DiscussionPosts",
  className: "discussionPosts",
  kind: enyo.VFlexBox,
  components: [
	 {
		 name: "getPosts", 
		 kind: "WebService",
		 onSuccess: "gotPosts",
		 onFailure: "gotPostsFailure"
	 },
	 {
		 name: "discussionPostList",
		 kind: "VirtualList",
		 flex: 1,
		 onSetupRow: "setupPostRow",
		 components:[
		    {
		    	kind: "Item",
		    	className: "postItem",
		    	layoutKind: "HFlexLayout",
		    	components: [
		    	   { 
		    		   kind: enyo.VFlexBox, 
		    		   pack: "center", 
		    		   components: [
		    		      { name:"thumbnail", kind: "Image", className: "posterImage", width: "50px", height: "50px" },
		    		   ]
		    	   },
  	   	       	   {
		    		   kind: enyo.VFlexBox,
		    		   pack: "center",
		    		   flex: 1,
		    		   components: [
		    		      { 
		    		    	  kind: enyo.HFlexBox, 
		    		    	  pack: "center",
		    		    	  align: "center",
		    		    	  components: [
		    		    	     { name:"posterName", className:"posterName", flex:1, content: "" },
		    		    	     { name:"postTime", className:"enyo-item-ternary", content:"" }
		    		    	  ] 
		    		      },
		    		      { name:"postBody", className: "postBody", content:"" }
 	    	      	   ]
  	   	       	   }
		    	]
		    }
		 ]
	 },
	 {
		 kind: enyo.VFlexBox,
		 name: "discussionPostErrorBox",
		 showing: false,
		 flex: 1,
		 components: [
		    {
		    	layoutKind: "VFlexLayout", 
		    	align: "center", 
		    	pack: "center", 
		    	flex: 1, 
		    	components: [
	    	       	{ name: "discussionPostError", className: "discussionPostError", content: "" }
	    	    ]
		    }
		 ]
	 },
     {
     	 name: "postSpinner",
     	 kind: enyo.VFlexBox,
    	 flex: 1,
	     showing: false,
    	 components: [
    	  	{
    	      layoutKind: "VFlexLayout", 
    	      align: "center", 
    	      pack: "center", 
    	      flex: 1, 
    	      components: [
    	       	{
    	       		name: "loadingSpinner",
    	       		kind: "SpinnerLarge", 
    	       		showing: true
    	       	}
    	      ]
    	  	}
    	 ]
      }
  ],
  
  
  /* INHERITED METHODS */
  
  create: function() {
      this.inherited(arguments);
      this.posts = [];
  },
  
  
  /* PUBLIC METHODS */
  
  updatePostsList: function(dealId) {  
	  this.$.discussionPostList.setShowing(false);
	  this.$.discussionPostErrorBox.setShowing(false);
      this.$.postSpinner.setShowing(true);
	  
      if (this.posts.length > 0) {
    	  this.posts = [];
		  this.$.discussionPostList.$.scroller.punt();	  
		  this.$.discussionPostList.refresh();
      }
	  	
	  var url = "http://api.groupon.com/v2/deals/" + dealId + "/posts.json?client_id=" + GROUPON_CLIENT_ID;
      this.$.getPosts.setUrl(url);
      this.$.getPosts.call();
  },
  
  
  /* METHOD CALLBACKS */
  
  setupPostRow: function(inSender, inIndex) {
      var post = this.posts[inIndex];
      if (post) {
    	  this.$.postBody.setContent(post.body);
    	  this.$.postTime.setContent(new Date(post.createdAt).toLocaleDateString());
    	  this.$.posterName.setContent(post.posterName);
    	  this.$.thumbnail.setSrc(post.posterAvatar);    	  
    	  return true;
      }
      return false; 
  },
  
  gotPosts: function(inSender, inResponse, inRequest) {
	  this.posts = inResponse.posts.reverse();
	  this.$.postSpinner.setShowing(false);
	  
	  if (this.posts) {
		  if (this.posts.length > 0) {
			  this.$.discussionPostErrorBox.setShowing(false);
			  this.$.discussionPostList.setShowing(true);
			  this.$.discussionPostList.punt();
			  this.$.discussionPostList.refresh();
		  }
		  else {
			  //no posts for this particular deal, show message
			  this.$.discussionPostError.setContent("No Discussion Posts");
			  this.$.discussionPostErrorBox.setShowing(true);
			  this.$.discussionPostList.setShowing(false);
		  }
	  }
	  else {
		  //error getting posts, change to show an error message
		  this.$.discussionPostError.setContent("Error Retrieving Discussion Posts");
		  this.$.discussionPostErrorBox.setShowing(true);
		  this.$.discussionPostList.setShowing(false);
	  }
  },
  
  gotPostsFailure: function(inSender, inResponse) {
	  //error getting posts, change to show an error message
	  this.$.discussionPostError.setContent("Error Retrieving Discussion Posts");
	  this.$.discussionPostErrorBox.setShowing(true);
	  this.$.discussionPostList.setShowing(false);
      this.$.postSpinner.setShowing(false);
  }
  
});