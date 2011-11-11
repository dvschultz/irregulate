// Define the values object, declaring default values and also
// receiving the user changes, for simpler further reference:
var values = {
    tolerance: '10',
    type: 'Random',
    rotation: false,
    smooth: false
};

// Define the interface components to edit each value. Note that they
// need to use the same names as the properties in the values object:
var components = {
    tolerance: { type: 'number', label: 'Tolerance (percent of shape)',
    			range: [1, 100], steppers: true
    			 },
    			 
    type: { type: 'list', label: 'Distortion Type', 
    		options: ['Shifty', 'Screwy', 'Shifty and Screwy', 'Squatty', 'Skinny', 'Random']
    	},
    
    rotation: { type: 'boolean', label: 'Rotate Shapes'
     			},
     			
    smooth: { type: 'boolean', label: 'Round Points'
     			},

    // Define button:
    doItToIt: {
        type: 'button', value: 'Do It',
        onClick: function() {
        
			letsDoThis(values.tolerance,components.type.selectedIndex,values.rotation, values.smooth);
        
        }
    }
};

// Now we create the palette window using the components
// and values definitions:
var palette = new Palette('Irregulate', components, values);







//Main Function

function letsDoThis(tolerance,toolType,rotation, smooth) {
	var odd;
	var selectedItems = document.getItems({ 
	    type: Path,
	    //type: Group,
	    selected: true 
	}); 

	tolerance = tolerance/100;
	var skinnyX, squattyY;
	
	
	
	
	
	if (selectedItems.length > 0) { 

		for (y = 0; y < selectedItems.length; y++){
			var pts = new Array();
			var item = selectedItems[y];
			var tempToolType;
			
			itemW = item.bounds.width;
			itemH = item.bounds.height;
			
			
			if (toolType == 5) {
				tempToolType = getRandomTool();
				print(tempToolType);
			} else {
				tempToolType = toolType;
			}
			
			
			for (i = 0; i < item.segments.length; i++){
			
	    		//print('point:'+item.segments[i].point+', handleIn:'+item.segments[i].handleIn+', handleOut:'+item.segments[i].handleOut.x);
	    		
	    		segment = item.segments[i]
	    		
	    		switch(tempToolType) {
	    			case 0:
	    				//Shifty
		    			shifty(segment.point, itemH, itemW, tolerance);
						break;
					
					case 1:
						//Screwy
						screwy(segment.handleIn, segment.handleOut, itemW, tolerance);
						break;
					
					case 2:
						shifty(segment.point, itemH, itemW, tolerance);
						screwy(segment.handleIn, segment.handleOut, itemW, tolerance);
						break;
						
					case 3:
						if (i == 1) {
							squattyY = getSquishDist(itemH, tolerance);
							segment.point.y -= squattyY;
						} else if (i == 3) {
							segment.point.y += squattyY;
						}
						break;
						
					case 4:
						//Move opposite points

						if (i == 0) {
							skinnyX = getSquishDist(itemH, tolerance);
							print(skinnyX);
							segment.point.x -= skinnyX;
						} else if (i == 2) {
							segment.point.x += skinnyX;
						}
						break;
						
					case 5:
						Dialog.alert('Not yet!');
						break;
						
					default:
						Dialog.alert('Derrick is a shitty programmer. He can\'t even write a switch statement correctly');
	    		}
	
	    	}
	    	
	    	if (rotation == true){
	    		item.rotate(getRotation());
	    	}
	    	
	    	if (smooth == true){
	    		item.smooth();
	    	}
			
		}
	    
	} else { 
	    Dialog.alert('Please select something first!'); 
	}

}


function getRandomTool() {
	//we've got to manually update this :(
	var toolType= Math.floor(Math.random() * 5);
	return toolType;
}

function getRandomDist(dim, tolerance) {
	//this returns a positive/negative tolerance
	var dist = (Math.random() * (tolerance*dim)) - tolerance;
	return dist;
}

function getSquishDist(dim, tolerance) {
	//this returns a positive/negative tolerance
	var dist = (Math.random() * (tolerance*dim));
	return dist;
}

function getRotation() {
	var rotation=Math.random() * 360;
	return rotation;
}

function shifty(point, itemH, itemW, tolerance) {
	var moveX = getRandomDist(itemH, tolerance);
	var moveY = getRandomDist(itemW, tolerance);
	point.x += moveX;
	point.y += moveY;
}

function screwy(handleIn, handleOut, itemW, tolerance) {
	var moveHandleX = getRandomDist(itemW, tolerance);
	handleIn.x += moveHandleX;
	handleOut.x -= moveHandleX;
}