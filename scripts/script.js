var idActual = 0;
var lastID = 0;
var listaServicios = [];
var idSeleccion;
var pagoInicial = 0;
var pagoMeses = 0;
var descuento = 0;

window.onload=function(){
    cargar();

    $("#tblServicios").DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
        },
        createdRow: function (row, data, index) {
            if (data[2] == 0) {
                //Colorear toda la fila cuando la existencia sea 0
                $("td", row).eq(2).addClass("table-danger");
            }
        },
        order: [
            [2, "asc"],
            [0, "asc"],
        ],
        dom: "Bfrtip",
        buttons: [
            
            {
                extend: "excelHtml5",
                text: "Exportar a excel",
            },
            {
                extend: "pdfHtml5",
                text: "Exportar a pdf",
            },
        ],
    });
}

function updateTotal(total){
    document.getElementById("txtTotal").value = total;
}

function seleccionarValorStream(event){
    idSeleccion = event.target.value;
    //console.log(idSeleccion);
    if(idSeleccion === "Netflix"){
        pagoInicial = 100;
 
    }
    if(idSeleccion === "HBO Max"){
        pagoInicial = 110;
    }
    if(idSeleccion === "Amazon Video"){
        pagoInicial = 100;
    }
    if(idSeleccion === "Disney+"){
        pagoInicial = 120;
    }
    if(idSeleccion === "defaultS"){
        pagoInicial = 0;
    }
    updateTotal(pagoInicial);
}

function seleccionarValorTiempo(event){
    idSeleccion = event.target.value;
    if(idSeleccion === "1 mes"){
        pagoMeses = 1;
    }
    if(idSeleccion === "3 meses"){
        pagoMeses = 3;
    }
    if(idSeleccion === "6 meses"){
        pagoMeses = 6;
    }
    if(idSeleccion === "1 año"){
        pagoMeses = 12;
    }
    updateTotal(pagoInicial * pagoMeses);
}

function seleccionarValorDescuento(event){
    idSeleccion = event.target.value;
    console.log(idSeleccion);
    if(idSeleccion === "Periodo Promocional 10%"){
        descuento = 0.9;
    }
    if(idSeleccion === "Cliente Frecuente 5%"){
        descuento = 0.95;
    }
    if(idSeleccion === "Sin descuento"){
        descuento = 1;
    }
    updateTotal(pagoInicial * pagoMeses * descuento);
}

function cargar(){
    lastID = localStorage.getItem("currentID");
    tmpListaServicios = localStorage.getItem("listaServicios");
    console.log(tmpListaServicios);
    if (tmpListaServicios) {
        listaServicios = JSON.parse(tmpListaServicios);
        console.log(listaServicios);
            listaServicios.forEach((ser) => {
                console.log(ser);
                insertarTabla(ser);
            });
    }
    if (lastID) {
        lastID = JSON.parse(lastID);
        console.log(lastID);
    } else {
        lastID = 0;
    }
}

function agregarCliente(){

    var selectStream = document.getElementById("selectStream").value;
    var selectTiempo = document.getElementById("selectTiempo").value;
    var selectDescuento = document.getElementById("selectDescuento").value;
    var nombreCliente = document.getElementById("nombreCliente").value;
    var total = 0;
    var flag = false;
    //validaciones
    if(selectStream === "defaultS"){
        document.getElementById("errorSelect").innerText = "debes seleccionar una opcion";
        flag = true;
        
    }
    else{
        document.getElementById("errorSelect").innerText = "";
        
    }
    if(selectTiempo === "defaultTime"){
        document.getElementById("errorSelectTiempo").innerText = "debes seleccionar una opcion";
        flag = true;
    }
    else{
        document.getElementById("errorSelectTiempo").innerText = "";
    }
    if(selectDescuento === "defaultDescuento"){
        document.getElementById("errorSelectDescuento").innerText = "debes seleccionar una opcion";
        flag = true;
    }
    else{
        document.getElementById("errorSelectDescuento").innerText = "";
    }
    if(nombreCliente.length < 10 || nombreCliente.length > 60){
        document.getElementById("errorInputNombre").innerText = "Debes colocar un nombre de cliente de entre 10 y 60 caracteres";
        flag = true;
    }
    else{
        document.getElementById("errorInputNombre").innerText = "";
    }
    var x = document.getElementById("nombreCliente").value;
    var totalPorTodo = document.getElementById("txtTotal").value;
    console.log(x);
    if(flag){
        return;
    }
    var servicio = {
        id : lastID,
        nombreCliente : nombreCliente,
        nombreStream: selectStream,
        tiempo: selectTiempo,
        descuento: selectDescuento,
        totalS : totalPorTodo
    };
    localStorage.setItem(`${lastID}`, JSON.stringify(servicio));
    lastID ++;
    localStorage.setItem("currentID", JSON.stringify(lastID));
    listaServicios.push(servicio);
    localStorage.setItem("listaServicios", JSON.stringify(listaServicios));
    insertarTabla(servicio);
    location.reload();
}

function insertarTabla(servicio){
    var tr = document.createElement("tr");
    var tdNombreCliente = document.createElement("td");
    var tdNombreStream = document.createElement("td");
    var tdTiempo = document.createElement("td");
    var tdDescuento = document.createElement("td");
    var tdTotal = document.createElement("td");

    tdNombreCliente.innerText = servicio.nombreCliente;
    tdNombreStream.innerText = servicio.nombreStream;
    tdTiempo.innerText = servicio.tiempo;
    tdDescuento.innerText = servicio.descuento;
    tdTotal.innerText = servicio.totalS;

    tr.append(tdNombreCliente);
    tr.append(tdNombreStream);
    tr.append(tdTiempo);
    tr.append(tdDescuento);
    tr.append(tdTotal);

    document.querySelector("#tblServicios tbody").append(tr);
}

/*function insertarTabla(){
    $(document).ready(function() {
        $('#example').DataTable( {
            data: listaServiciosString,
            columns: [
                { title: "ID" },
                { title: "Nombre Cliente" },
                { title: "Nombre Stream" },
                { title: "Tiempo Contratacion" },
                { title: "Descuento" },
                { title: "Total" }
            ]
        } );
    } );
}*/
 
