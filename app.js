(function(){
  "use strict";


  var AutoAed = function(){

    // SINGLETON PATTERN (4 rida)
    if(AutoAed.instance){
      return AutoAed.instance;
    }
      AutoAed.instance = this; // this viitab moosipurgile

    this.routes = AutoAed.routes;

    //Kõik muutujad, mis on üldised ja muudetavad
    this.currentRoute = null; // hoiab meeles mis lehel hetkel on
    this.interval = null;
    this.cars = []; //kõik autod tulevad siia sisse

    console.log(this);
    //console.log('moosipurgi sees');

    // KÕIK MUUTUJAD, mis on üldised ja muudetavad
    this.currentRoute = null; // hoian meeles mis lehel olen (home-view, ...)
    this.interval = null;



    //panen rakenduse tööle
    this.init();
  };

  // kirjeldatud kõik lehed
  AutoAed.routes = {
    "home-view": {
      render: function(){
        // käivitan siis kui jõuan lehele
        console.log('JS avalehel');

        // kui olemas, teen nulliks
        if(this.interval){ clearInterval(this.interval); }

        // kui jõuan avalehele siis käivitub timer, mis hakkab trükkima kulunud sekundeid
        // divi sisse #counter
        // hakkab 0st
        var seconds = 0;
        this.interval = window.setInterval(function(){
          seconds++;
          document.querySelector('#counter').innerHTML = seconds;
        }, 1000); //iga 1000ms tagant käivitub

      }
    },
    "list-view": {
      render: function(){
        console.log('JS loendi lehel');

      }
    },
    "manage-view": {
      render: function(){
        console.log('JS halduse lehel');

      }
    }
  };

  //kõik moosipurgi funktsioonid tulevad siia sisse
  AutoAed.prototype = {
    init: function(){
      console.log('rakendus käivitus');
      // Siia tuleb esialgne loogika

      window.addEventListener('hashchange', this.routeChange.bind(this));

      //vaatan mis lehel olen, kui ei ole hashi lisan avalehe
      console.log(window.location.hash);
      if(!window.location.hash){
        window.location.hash = "home-view";
      }else{
        //hash oli olemas
        this.routeChange();
      }
      //saan kätte purgid localStorage kui on
      if(localStorage.cars){
        //string tagasi objektiks
        this.cars = JSON.parse(localStorage.cars);
        //tekitan loendi htmli
        this.cars.forEach(function(car){

            var new_car = new Car( car.title, car.color, car.seats, car.timeAdded);
            var li = new_car.createHtmlElement();
            document.querySelector('.list-of-cars').appendChild(li);
        });
      }



      // hakka kuulama hiireklõpse
      this.bindMouseEvents();
    },

    bindMouseEvents: function(){
      document.querySelector('.add-new-car').addEventListener('click', this.addNewClick.bind(this));


    },
    delete: function(event){

      var conf = confirm('Oled kindel?');
      if(!conf){return;}
      var ul = event.target.parentNode.parentNode;
      var li = event.target.parentNode;
      ul.removeChild(li);

      for(var i=0; i<this.car.length; i++){
        if(this.car[i].id == event.target.dataset.id){
          //kustuta kohal i objekt ära
          this.books.splice(i, 1);
          //ei lähe edasi
          break;
        }
      }
      localStorage.setItem('cars', JSON.stringify(this.cars));
    },
    addNewClick: function(event){
      // lisa uus purk
      var title =this.trimWord(document.querySelector('.title').value);
      var color = this.trimWord(document.querySelector('.color').value);
      var seats = this.trimWord(document.querySelector('.seats').value);
      var timeAdded = this.writeDate();
      //console.log(title + ' ' + color +''+ seats+''timeAdded);
      //FeedBack




      var className = document.getElementById("show-feedback").className;
      //lisan masiivi purgid


      if(title === '' || color === '' || seats===''){
          if(className == "feedback-success"){
              document.querySelector('.feedback-success').className=document.querySelector('.feedback-success').className.replace('feedback-success','feedback-error');
          }
          document.querySelector('#show-feedback').innerHTML='Kõik read peavad täidetud olema';
      }else{
        if(className == "feedback-error"){
          document.querySelector('.feedback-error').className=document.querySelector('.feedback-error').className.replace('feedback-error','feedback-success');
        }
        document.querySelector('#show-feedback').innerHTML='Salvestamine õnnestus';
        var new_car = new Car(guid(),title, color, seats, timeAdded);
        //lisan massiivi moosipurgi
        this.cars.push(new_car);
        console.log(JSON.stringify(this.cars));
        //JSON'i stringina salvestan local storagisse
        localStorage.setItem('cars', JSON.stringify(this.cars));
        document.querySelector('.list-of-cars').appendChild(new_car.createHtmlElement());
      }
      },

    routeChange: function(event){

      // slice võtab võtab # ära #home-view >> home-view
      this.currentRoute = window.location.hash.slice(1);

      // kas leht on olemas
      if(this.routes[this.currentRoute]){
        //jah

        this.updateMenu();

        console.log('>>> ' + this.currentRoute);
        //käivitan selle lehe jaoks ettenähtud js
        this.routes[this.currentRoute].render();
      }else{
        // 404?
        console.log('404');
        window.location.hash = 'home-view';
      }

    },

    updateMenu: function(){

      //kui on mingil menüül klass active-menu siis võtame ära
      document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace(' active-menu', '');

      //käesolevale lehele lisan juurde
      document.querySelector('.' + this.currentRoute).className += ' active-menu';

    },
    writeDate : function(){
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        //#clock element htmli
        var curTime = this.addZeroBefore(day)+"."+this.addZeroBefore(month+1)+"."+year;
        return curTime;
    },
    addZeroBefore : function(number){
        if(number<10){
        number="0"+number;
        }
        return number;
    },
      trimWord: function (str) {
      str = str.replace(/^\s+/, '');
      for (var i = str.length - 1; i >= 0; i--) {
          if (/\S/.test(str.charAt(i))) {
              str = str.substring(0, i + 1);
              break;
          }
      }
      return str;
  },

  };

  var Car = function(new_title, new_color, new_seats, timeAdded){
    this.title = new_title;
    this.color = new_color;
    this.seats = new_seats;
    this.timeAdded = timeAdded;
  };


  Car.prototype = {
    createHtmlElement: function(){
      // anda tagasi ilus html

      // li
      //   span.letter
      //     M
      //   span.content
      //     Maasikamoos | maasikas, õun

      var li = document.createElement('li');

      var span = document.createElement('span');
      span.className = 'letter';

      var letter = document.createTextNode(this.title.charAt(0));
      span.appendChild(letter);

      li.appendChild(span);

      var content_span = document.createElement('span');
      content_span.className = 'content';

      var content = document.createTextNode(this.title + ' | ' + this.color + ' | ' + this.seats + '  Lisatud  '+this.timeAdded);
      content_span.appendChild(content);

      li.appendChild(content_span);

      console.log(li);

      var delete_span = document.createElement('button');
      delete_span.setAttribute('data-id', this.id);
      delete_span.innerHTML = "Kustuta";
      li.appendChild(delete_span);
      delete_span.addEventListener('click', AutoAed.instance.delete.bind(AutoAed.instance));
      return li;
    }
  };
  //helper
  function guid(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }


  window.onload = function(){
    var app = new AutoAed();
  };

})();
