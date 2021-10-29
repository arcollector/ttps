import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


const db= firebase.firestore(firebase);


export default function saveState (state, nameEmployee, idMedicExam) {

    let  today = new Date();

    var promise= new Promise (function(resolve,reject){
        
        console.log(idMedicExam);
        
        db.collection("states").add({
        name:state,
        employee:nameEmployee,
        day:today.getDay(),
        month:today.getMonth(),
        year:today.getFullYear(),
        idMedicExam:idMedicExam,
        }).then(e=>{
            resolve(e.id);
        })
    }
    )

    return promise;

    
}
