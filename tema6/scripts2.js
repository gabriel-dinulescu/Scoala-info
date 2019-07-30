var lista = [];

function draw(){
    var string = '';
    for(let i = 0; i<lista.length;i++){
        //daca in index de i valoarea marked este 1 aplic clasa de strikethrough
        if(lista[i].marked === 1){
            string += `<tr><td class="marked">${lista[i].item}</td>`;
        } else {
            string += `<tr><td>${lista[i].item}</td>`;
        }
        //functia marcheaza atribuie valoarea 1 pentru proprietatea marked
        string += `<td><input class="mark" type="button" value="Mark as buyed" onclick="marcheaza(${i});" /></tr>`;
    }
    document.querySelector("#tabel tbody").innerHTML = string;
}

function marcheaza(id){
        lista[id].marked = 1;
        draw();
}


function adauga(form,event){
    //prevenim reincarcarea paginii
    event.preventDefault();
    
    //declar obj
    var obj = {
    };
    //preiau date din form
    obj.item = form.querySelector("[name='item']").value;
    //setez marcaj cu 0
    obj.marked = 0;
    //fac push in lista
    lista.push(obj);
    //apelez draw ptr a afisa tabelul cu date actualizat
    draw();
    //resetez campurile
    form.reset();
}

function sortAsc(){
    //functie de sort ce primeste 2 elemente 
    lista.sort(function(a,b){
        if(a.item>b.item){
            return 1;
        } else if(a.item<b.item){
            return -1;
        } else{
            return 0;
        }
    });
    //apelez draw 
    draw();
}

function sortDesc(){
    lista.sort(function(a,b){
        if(a.item<b.item){
            return 1;
        } else if(a.item>b.item){
            return -1;
        } else{
            return 0;
        }
    });
    //apelez draw
    draw();
}