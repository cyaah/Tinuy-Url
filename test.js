
  const list = [
               { id: 1, active: false },
               { id: 2, active: false },
               { id: 3, active: true  },
               { id: 4, active: false }
             ];
const i = 2;

function markActive(list, i) {
    list.forEach(function (o) {
        o.active = o.id === i;
    });
    return list;
 }
 
//console.log(list);
console.log(markActive(list,2));
