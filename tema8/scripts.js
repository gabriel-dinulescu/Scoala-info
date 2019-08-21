var meniu = [];

async function ajax(){
    var response  = await fetch("https://restaurant-da353.firebaseio.com/.json");
    window.meniu = await response.json();
    draw();
}
console.log(meniu);

function draw(){
    var tabel = document.querySelector("#tabel tbody");
    var search = document.querySelector("[name='search']").value;
    var str = "";
    for (var i in meniu){
        if(meniu[i].ingrediente.indexOf(search) !== -1){
        str += `<tr>
                    <td>
                        <img class="imagine" src="${meniu[i].imagine}" />
                    </td>
                    <td>
                        <div class="container-tabel">
                            <div>
                                ${meniu[i].nume}
                            </div>
                            <div>
                                ${meniu[i].ingrediente}
                            </div>
                        </div>
                   </td>
                   <td>
                       <a href="detalii.html?id=${i}"><input type="button" class="button" value="Detalii"></a>
                   </td>
            </tr>`;
        }
    }
    console.log(str);   
    tabel.innerHTML = str;
};


function cautare(form, event){
    event.preventDefault();
    draw();
    form.reset();
}


function draw2(){
    var url = window.location.href;
}