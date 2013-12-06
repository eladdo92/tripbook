$(document).ready(function()
{
	$.get('tracks/all', function(data)
	{
		$.each(data, function(key, value) {
			console.log(value)   ;
			$('#tracks')
			.append($("<option></option>")
				.attr("value",value._id)
				.text(value.content)); 
		});
	});

	$.get('places/all', function(data)
	{
		$.each(data, function(key, value) {
			var valueAsJSON = JSON.stringify(value);
			console.log(value)   ;
			$('#places')
			.append($("<option></option>")
				.attr("value",valueAsJSON)
				.text(value.name)); 
		});
	});	

	$("#tagbutton").click(function() {  		
		var trackId = $( "#tracks option:selected" ).val();
		var placeJSON = $( "#places option:selected" ).val();

		console.log('trackid = ' + trackId);
		console.log('place log:' + place);
		console.log("Sending request to server");

		var place = JSON.parse(placeJSON);

		$.ajax({
			type: 'PUT',
			url: 'track/place/tag/' + trackId,
			data: place
		});

	});
});
