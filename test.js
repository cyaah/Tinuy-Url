
  const list = [
               { id: 1, active: false },
               { id: 2, active: false },
               { id: 3, active: true  },
               { id: 4, active: false }
             ];
const i = 2;

function markActive(list, i) {
var index = i - 1;
  for(var j = 0; j < list.length; j++){ 
    if(list[index].id === i ){
    	 list[index].active = true;
    } 
    else{
    	list[index].active = false;
    	console.log(list[index].active);
    }
  }
  return (list);

 }
//console.log(list);
markActive(list,2)
