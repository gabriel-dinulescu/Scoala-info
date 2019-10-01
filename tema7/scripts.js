//array global de studenti
var listaStudenti = [];

//functie de suma
function getSum(total, num){
    return total + num;
}

//functie de scriere a tabelului
function draw(){
    var str = "";
    for(let i = 0; i < listaStudenti.length; i++){
        str += `<tr>
                    <td>${listaStudenti[i].nume}</td>
                    <td>${listaStudenti[i].medie()}</td>
                    <td><button onclick="showNote(${i})">Afiseaza note</button></td>
                </tr>`;
    }
    document.querySelector("#tabel tbody").innerHTML = str;
}

//clasa de student
class Student{
    constructor(nume, note){
        this.nume = nume;
        this.note = note;
    }
    medie(){
        var suma = 0;
        var x = Number(this.note.length);
        var medie = 0;
        
        if(this.note.length === 0){
            return 'N.A.';
        } else if(this.note.length === 1){
            return this.note[0];
        } else{
            for(let i = 0; i < x; i++){
                suma += Number(this.note[i]);
            }
            medie = suma/x;
            medie = Number.parseFloat(medie).toFixed(2);
            return medie;
        }
    }
}

//functie ce adauga studenti la lista
function createStudent(form, event){
    event.preventDefault();
    var alert = document.getElementById("alert-student");
    var nume = form.querySelector("[name='student']").value;
    alert.style.display = "none";
    if(nume !== "" && isNaN(nume)){
        let student = new Student(nume, []);
        listaStudenti.push(student);
        form.reset();
        draw();
    } else {
        alert.style.display = "block";
        alert.innerText = "Camp necompletat, introduceti nume de student!"
    }
}


//deschidere modal
function showNote(id){
    var modal = document.getElementById("myModal");
    var titlu = document.getElementById("titlu-modal");
    var inputID = document.querySelector("[name='id']");
    inputID.value = id;
    modal.style.display = "block";

    titlu.innerText = 'Student: '+listaStudenti[id].nume;

    draw2(id);
}

function  draw2(id){
    var str = "";
    for(let i = 0; i < listaStudenti[id].note.length; i++){
        str += `<tr>
                    <td>${listaStudenti[id].note[i]}</td>
                    <td><button onclick="deleteNota(${id}, ${i})">Sterge</button></td>
                </tr>`;
    }

    document.querySelector("#tabelNote tbody").innerHTML = str;
}

function deleteNota(studentID, notaID){
    //stergem nota
    listaStudenti[studentID].note.splice(notaID, 1);
    //reincarcam tabela de note
    draw2(studentID);
}

function addNota(form, event){
    event.preventDefault();
    var nota = form.querySelector("[name='note']").value;
    var alert = document.getElementById("alert-note");
    var studentID = form.querySelector("[name='id']").value;
    alert.style.display = "none";
    if(isNaN(nota)){
        alert.style.display = "block";
        alert.innerText = "Valoarea introdusa nu este un numar!";
    } else if(nota > 10 && nota > 1) {
        alert.style.display = "block";
        alert.innerText = "Valoarea introdusa nu este in intervalul 1 - 10!";
    } else {
        //adaugam nota
        listaStudenti[studentID].note.push(nota);
        form.querySelector("[name='note']").value = '';
    }
    draw2(studentID);
}