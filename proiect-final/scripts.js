const animation = '<div class="animation col-xs-12 col-md-12 col-lg-12"><div class="loader"></div></div>';

var products = {};

async function draw(){
    //output ce contine reponse json din fetch
    var output = '';
    //bloc html unde vor aparea produsele
    var items = document.getElementById('items');
    //afisam animatia in pagina
    items.innerHTML = animation;
    //incepe fetch
    await fetch('https://gamergate-63739.firebaseio.com/items/.json',{
        method: 'GET'
    }).then(response => response.json()).then(response =>{

        for (var key in response) {

            output += `<div class="product-container col-xs-12 col-md-6 col-lg-3">
                        <div class="product-block">
                            <div class="product-image">
                                <img src="${response[key].img}" class="col-xs-12 col-md-12 col-lg-12">
                            </div>
                            <div class="product-title">
                                <p>${response[key].name}</p>
                            </div>
                            <hr>
                            <div class="product-description">
                                <div class="price">Price: ${response[key].price} RON</div>
                                <a href="details.html?id=${key}" class="btn btn-primary">Detalii</a>
                            </div>
                        </div>
                    </div>`;
        }
        items.innerHTML = output;


    }).catch(error => console.log(error));
    await numberProducts();

}

async function drawDetails(){
    //output ce contine reponse json din fetch
    var output = '';
    //obtinem id
    url = window.location.search;
    id = url.split("=");
    id = id[1];
    
    var items = document.getElementById('product');
    //afisam animatia in pagina
    items.innerHTML = animation;

    await fetch(`https://gamergate-63739.firebaseio.com/items/${id}.json`,{
        method: 'GET'
    }).then(response => response.json()).then(response =>{
        output = `<div class="product-details col-xs-12 col-md-8 col-lg-8">
                    <div class="image">
                        <img src="${response.img}" />
                    </div>
                    <div class="details">
                        <h3>${response.name}</h3>
                        <p>${response.description}</p>
                        <h5>Pret: ${response.price} RON</h5>
                        <div class="separator"></div>
                        <p>In stoc: ${response.stoc} buc</p>
                        <p>Cantitate: <input class="cantitate" data-stoc="${response.stoc}" data-product="${id}" id="cantitate" type="number" value="1"/></p>
                        <button onclick="addCart()" type="button" class="btn btn-primary"><i class="fas fa-cart-plus"></i> Adauga in cos</button>
                    </div>
                 </div>`;

        items.innerHTML = output;

    }).catch(error => console.log(error));

    await numberProducts();
}

async function addCart(){
    //alert success
    let success = document.getElementById('success');
    //alert failure
    let failure = document.getElementById('failure');
    //input cu attribute
    let input = document.getElementById('cantitate');
    //id
    var id = input.getAttribute('data-product');
    let qty = Number(input.value);
    let stoc = Number(input.getAttribute('data-stoc'));
    //cartProduct contine produsele
    var cartProducts = new Object();
    //verificam daca exista cart in localStorage
    if(localStorage.getItem(id) === null){
        if(qty <= stoc){
            //append la cartProducts
            cartProducts = {qty: qty};
            //salvam ca string cartProducts
            localStorage.setItem(id, JSON.stringify(cartProducts));
            success.classList.remove('hidden_');
            setTimeout(function(){
                success.classList.add('hidden_');
            }, 2000)
            return;
        } else {
            failure.classList.remove('hidden_');
            setTimeout(function(){
                failure.classList.add('hidden_');
            }, 2000)
            return;
        }
    } else {
        //preluam localstorage ca object pentru ca exista
        cartProducts = localStorage.getItem(id);
        cartProducts = JSON.parse(cartProducts);
        let qtyTemp = cartProducts.qty + qty;
        //verificam daca exista produsul in cos
        if(qtyTemp <= stoc){
                cartProducts.qty = qtyTemp;
                localStorage.setItem(id, JSON.stringify(cartProducts));
                success.classList.remove('hidden_');
                setTimeout(function(){
                    success.classList.add('hidden_');
                }, 2000);
                return;
        } else {
            failure.classList.remove('hidden_');
            setTimeout(function(){
                failure.classList.add('hidden_');
            }, 2000)
            return;
        }
    }
    
}

function openAdmin(){
    location.href = "admin.html";
}

function openCart(){
    location.href = "cart.html";
}

async function drawCart(){

    var output = '';
    var cos = document.querySelector('div.tableProducts table.table tbody');
    var nrProduse = document.getElementById('nr');
    var total = document.getElementById('total');
    //afisam animatia in pagina
    ////////////////
    var nrValue = 0;
    var totalValue = 0;
    ////////////////
    cos.innerHTML = animation;
    var cartProducts = new Array();
    var objTmp = new Array();
    objTmp = Object.entries(localStorage);
    for(let i = 0; i < objTmp.length; i++){
        cartProducts[objTmp[i][0]] = JSON.parse(objTmp[i][1]);
    }

    await fetch('https://gamergate-63739.firebaseio.com/items/.json',{
        method: 'GET'
    }).then(response => response.json()).then(response =>{

        for (var key in cartProducts) {

            output += `<tr>
                            <th scope="row">${response[key].name}</th>
                            <td>${response[key].price} RON</td>
                            <td><button onclick="decrease('${key}', this);">-</button> <span data-type="qty">${cartProducts[key].qty}</span> <button onclick="increase('${key}', this);">+</button></td>
                            <td><span data-type="subtotal">${cartProducts[key].qty*response[key].price} RON</span></td>
                            <td><button onclick="remove('${key}');" class="btn btn-danger col-12">Remove</button></td>
                        </tr>`;
                        nrValue += Number(cartProducts[key].qty);
                        totalValue += (nrValue*Number(response[key].price));
        }
        nrProduse.innerText = nrValue;
        total.innerText = totalValue;
        cos.innerHTML = output;
        window.products = JSON.parse(JSON.stringify(response));

    }).catch(error => console.log(error));

    await numberProducts();
}

function decrease(key, btn){
    let objTmp = {};
    objTmp = JSON.parse(localStorage.getItem(key));
    if(objTmp.qty == 1){
        return false;
    } else {
        objTmp.qty -= 1;
        //actualizam localstorage
        localStorage.setItem(key, JSON.stringify(objTmp));
        drawCart();
    }
}

function increase(key, btn){
    let objTmp = {};
    objTmp = JSON.parse(localStorage.getItem(key));
    var curr = Number(objTmp.qty) + 1;
    var stoc = Number(products[key].stoc);
    if(curr > stoc){
        return false;
    } else {
        objTmp.qty += 1;
        //actualizam localstorage
        localStorage.setItem(key, JSON.stringify(objTmp));
        drawCart();
    }
}

function remove(key){

    var result = confirm('Sunteti sigur ca vreti sa stergeti acest produs din cos?');

    if(result == true){

        localStorage.removeItem(key);
        drawCart();
    } else {

        return false;
    }
}

async function numberProducts(){
    var counter = document.getElementById('nrProducts');
    var value = 0;
    var tmp;
    objTmp = Object.entries(localStorage);
    for(let i = 0; i < objTmp.length; i++){
        tmp = JSON.parse(objTmp[i][1]);
        value += Number(tmp.qty);
    }
    if(value == 0){
        return false;
    } else {
        counter.classList.remove('hidden_');
        counter.innerText = value;
    }
}


async function drawAdmin(){
    
    var body = document.querySelector('table.table tbody');
    var output = '';

    await fetch('https://gamergate-63739.firebaseio.com/items/.json', {
        method: 'GET'
    }).then( response => response.json()).then(response => {

        for(var key in response){
            output += `<tr>
                        <th scope="row"><img src="${response[key].img}" height="30" width="auto"/></th>
                        <td><button onclick="Edit('${key}');" type="button" class="btn btn-link">${response[key].name}</button></td>
                        <td>${response[key].price} RON</td>
                        <td>${response[key].stoc}</td>
                        <td><button onclick="delProduct('${key}')" type="button" class="btn btn-danger">Remove</button></td>
                    </tr>`;
        }
        body.innerHTML = output;
        window.products = JSON.parse(JSON.stringify(response));

    }).catch(error => console.log(error));
}

function insert(){
    $('#formular').modal('show');
    var form = document.getElementById('formProduct');
    var btn = document.getElementById('formButton');
    form.reset();
    btn.setAttribute('data-action', 'insert');
}

async function Edit(key){

    $('#formular').modal('show');
    var form = document.getElementById('formProduct');
    var btn = document.getElementById('formButton');
    form.reset();
    document.getElementById('img').value = products[key].img;
    document.getElementById('name').value = products[key].name;
    document.getElementById('price').value = products[key].price;
    document.getElementById('stoc').value = products[key].stoc;
    document.getElementById('description').value = products[key].description;
    document.getElementById('formButton');
    btn.setAttribute('data-action', 'update');
    btn.setAttribute('data-id', key);
}

async function delProduct(key){
    var r = confirm('Sunteti siguri ca vreti sa stergeti acest produs!');
    if(r === true){
        await fetch(`https://gamergate-63739.firebaseio.com/items/${key}.json`,{
            method: 'delete'
        }).then(response => {
            console.log(response);
            drawAdmin();
        }).catch(error => console.log(error));
    } else {
        return false;
    }
}

async function ajax(btn){

    var key = btn.getAttribute('data-id');
    var action = btn.getAttribute('data-action');
    if(action == 'insert'){

        var obj = {
            img: document.getElementById('img').value,
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            stoc: document.getElementById('stoc').value,
            description: document.getElementById('description').value
        }

        await fetch('https://gamergate-63739.firebaseio.com/items/.json', {
            method: 'post',
            body: JSON.stringify(obj)
            }).then(response =>{
                console.log(response);
            }).catch(error => console.log(error));
    } else if(action == 'update'){
        
        var obj = {
            img: document.getElementById('img').value,
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            stoc: document.getElementById('stoc').value,
            description: document.getElementById('description').value
        }

        await fetch(`https://gamergate-63739.firebaseio.com/items/${key}.json`, {
            method: 'put',
            body: JSON.stringify(obj)
            }).then(response => {
                console.log(response);
            }).catch(error => console.log(error));
    }

    await drawAdmin();
    $('#formular').modal('hide');
}



/*

                            <tbody>
                                  <th scope="row">Produs</th>
                                    <td>300</td>
                                    <td><button onclick="decrease();">-</button> <span data-type="qty">100</span> <button onclick="increase();">+</button></td>
                                    <td><span data-type="subtotal"></span>400</td>
                                    <td><button class="btn btn-danger">Remove</button></td>
                            </tbody>



                    <div class="product-container col-xs-12 col-md-6 col-lg-3">
                        <div class="product-block">
                            <div class="product-image">
                                <span class="badge badge-secondary">New!</span>
                                <img src="img/pc1.jpg">
                            </div>
                            <div class="product-title">
                                <p>Gaming PC Raptor</p>
                            
*/