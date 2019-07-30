//array global cu persoane de contact
var lista=[];

//o variabila globala in care sa tin minte pentru ce rand editez, in care contrar ia valoare -1
var idxEditare = -1;
// console.log(idxEditare);


//functia care imi actualizeaza interfata(tabelul) ori de cate ori se actulizeaza sau sorteaza
function draw(){
    var tableContainer = document.getElementById("table-container");
    var str = "";
        if(lista.length > 0){
            for(var i=0;i<lista.length;i++){
                str+=`<tr>
                    <td>${lista[i].nume}</td>
                    <td>${lista[i].telefon}</td>
                    <td width="15%">
                        <input class="edit" type="button" value="Edit" onclick="editeaza(${i});" />
                    </td>
                    <td width="15%">
                        <input class="del" type="button" value="Del" onclick="sterge(${i});" />
                    </td>
                </tr>`;
            }
            tableContainer.classList.remove("hide");
        } else {
            tableContainer.classList.add("hide");
        }
			// console.log(str);
			document.querySelector("#tabel tbody").innerHTML = str;
}

function sterge(idx){
    if(confirm(`Esti sigur ca vrei sa stergi inregistrarea ${lista[idx].nume} ?`)){
        lista.splice(idx,1);
        draw();
    }
}

function editeaza(idx){
    //salvez indexul elementului din lista in variabila globala 
    //ca sa stiu daca trebuie sa adaug la sfarsit sau sa modific
    window.idxEditare = idx;
    
    //preiau elementul din lista
    var obj = lista[idx];
    
    //preiau referinta catre formular
    var form = document.querySelector("#add-form");
    
    //populez formularul cu ce contine persoana mea
    form.querySelector("[name='nume']").value = obj.nume;
    form.querySelector("[name='telefon']").value = obj.telefon;
    console.log('id selectat este '+idxEditare);
}

function adauga(form,event){
    //prevenim reincarcarea paginii
    event.preventDefault();
    
    //preiau info din formular
    var obj = {
    };
    obj.nume = form.querySelector("[name='nume']").value;
    obj.telefon = form.querySelector("[name='telefon']").value;
    
    //daca index editare e -1 inseamna ca nu editez nimic, ci adaug ceva nou (la sfarsit)
    if(idxEditare===-1){
        //cand este idxEditare -1 atunci inseamna ca adaug
        lista.push(obj);
    }else{
        //cand este idxEditare diferit de -1 atunci inseamna ca editez pozitia idxEditare
        lista[idxEditare] = obj;
        //resetam idxEditare in -1 pentru ca am terminat cu editarea
        idxEditare = -1;
    }
    form.reset();
    draw();
}

//buton de resetare formular si atribuim -1 la idxEditare
function reset(idx){
    //resetam campurile formularului
    document.querySelector("#add-form").reset();
    //atribuim valoarea -1 la idxEditare
    window.idxEditare = idx;
    //console.log ptr a avea daca s-a resetat
    console.log('a fost resetat id la '+idxEditare);
    
}