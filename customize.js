(function () {
	
   "use strict";   
   
    //Event that triggers when the record list page is displayed
    kintone.events.on('app.record.index.show', function(event) {
		
			console.log("レコード一覧画面を開きました");
			console.log('List displaying event object: ');
			console.log(event);
			
			var appId = kintone.app.getId(); //get current app id
			console.log('Current app id: ' + appId);
			
			var user = kintone.getLoginUser();
			console.log('Current user info: ');
			console.log(user);
	
			//Calling 企業 App to retrieve all records data; AppID = 128
			
			var body = {
			//"fields": "企業名",	
			"app": 128,
			};

			
			kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function(resp) {
				// success
				console.log('企業 App records data');
				console.log(resp);
													
				var records = resp.records;
				var company;
				var total_score = 0;
					  
			   
				for (var i = 0;　i < records.length; i++) {
										  
					company = records[i]['企業名'];
					console.log('Record number ' + i + ', 企業名: ' + company.value);
									 
					var current_score = +records[i].score.value; 
					//console.log('Score value: ' + current_score + ' ' + typeof current_score);		 
					total_score += current_score;
								 
				}	   
							   
					console.log('Total score: ' + total_score.toFixed(10));
							   
				}, function(error) {
					// error
					console.log(error);
			});
	
	
			//Retrieving data about 企業 App
				
			var body2 = {
			"id": 128,
			};
				
			kintone.api(kintone.api.url('/k/v1/app', true), 'GET', body2, function(resp) {
					// success
					console.log('企業 App info');
					console.log(resp);
				}, function(error) {
					// error
					console.log(error);
			});
				
				
			kintone.api(kintone.api.url('/k/v1/app/form/layout', true), 'GET', body, function(resp) {
				// success
				   console.log('企業 App form layout');
				   console.log(resp);
				}, function(error) {
				// error
				   console.log(error);
			});
	
	
		//Adding a button for new 企業 App record creation to the list view when a page is loaded
	
		//Prevent duplication of the button
		
        if (document.getElementById ('my_index_button') != null) {
            return;
        }　　　
        // Set a button
        var myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
		myIndexButton.style = "background-color: #cde3f2; margin: 5px; border: 2px solid #3498db; border-radius: 4px;";
        myIndexButton.innerHTML = 'Add a new record in 企業 App!';
		
        // Retrieve the header menu space element and set the button there
        kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
		
        console.log($("#my_index_button"));
		
			// Button onclick function
			$("#my_index_button").on("click", function(){	
		
				console.log('Button 1 clicked!');		
				
				//send REST POST request to 企業 App
				
				createRecord(user);	
			
			
			});  


		//Adding a button for 企業 App record update to the list view when a page is loaded
	
		//Prevent duplication of the button
        if (document.getElementById ('my_index2_button') != null) {
            return;
        }　　　
        // Set a button
        var myIndexButton2 = document.createElement('button');
        myIndexButton2.id = 'my_index2_button';
		myIndexButton2.style = "background-color: #cde3f2; margin: 5px; border: 2px solid #3498db; border-radius: 4px;";
        myIndexButton2.innerHTML = 'Update the last record in 企業 App!';
		
        // Retrieve the header menu space element and set the button there
        kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton2);
		
        console.log($("#my_index2_button"));
		
			// Button onclick function
			$("#my_index2_button").on("click", function(){	
		
				console.log('Button 2 Clicked!');		
				
				//send REST PUT request to 企業 App

				sendUpdate();		
					
			});   
		
    }); 	
	
	   
    //Event that triggers when the record edit page is displayed
    kintone.events.on('app.record.edit.show', function(eventobject) {
        //Display event Object
        console.log('Editing event object: ');		
		console.log(eventobject);
		
		var recordId = kintone.app.record.getId(); //get current record id
        console.log('Current record id: ' + recordId);
		
	});
	
    //Event that triggers when the record create page is displayed
    kintone.events.on('app.record.create.show', function(eventobject) {
		
        //Display event Object
        console.log('Creating event object: ');
		console.log(eventobject);
		
	});
	
	 //Event that triggers when the 'Assessment' field value is changed
    kintone.events.on('app.record.edit.change.service_assessment', function(eventobject) {
		
        //Display event Object
        console.log('Field changing event object: ');
		console.log(eventobject);
		
	});	
		
	//Event that triggers when the record details page is displayed
    kintone.events.on('app.record.detail.show', function(event) {
		
		console.log("レコード詳細画面を開きました");
		console.log('Record details displaying event object: ');
		console.log(event);
	
    });
	
	
	
	
	
	
	/*--------------- Custom functions -------------------*/
	
	
		function sendUpdate() {
		
				var body = {
					"app": 128,
				};
			
				kintone.api(kintone.api.url('/k/v1/records', true), 'GET', body, function(resp) {
					// success
							   
					var records = resp.records;	     
					var id = records.length;	 
					var score;	   
						   
					for (var i = 0; i < id; i++) {
						if (records[i].$id.value == id) {
							score =  records[i].score.value;
							console.log("Current score of record number " + id + " : " + score);
						}		   
					}	  
			   
					var body = {
						"app": 128,
						"id": id,
						"record": {
							"score": {
							"value":  +score + 1
							}
				  　　　　　　}
				  　 };
		 
			　　　　　　　　kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', body, function(resp) {
				　　　　	// success
						console.log("Updated record number " + id + " in 企業 App");
			   　　　　 	console.log(resp);
			　　　　　　　　}, function(error) {
			   　　　　 	// error
			   　　　　 	console.log(error);
			　　　　　　　　});				   
					   
				}, function(error) {
					// error
					console.log(error);
				});					
		
		}
		
		
		function createRecord(user) {
			
				var name = user.code.toString().substring(0, 3) + user.id;
				console.log(name);
				
				var body = {
					"app": 128,
					"record": {
						"企業名": {
						"value": name
						},
						"score": {
						"value":  "1"
						}
			  　　　　　　}
			  　 };
		 
		　　　　　　　　kintone.api(kintone.api.url('/k/v1/record', true), 'POST', body, function(resp) {
				　　　　// success
					console.log("Added a new record to 企業 App");
			   　　　　 console.log(resp);
		　　　　　　　　}, function(error) {
			   　　　　 // error
			   　　　　 console.log(error);
		　　　　　　　　});			
		}

})();