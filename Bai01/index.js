document.addEventListener("DOMContentLoaded", function() {
  var khungvien = document.getElementById('darius');
  khungvien.classList.add('khungvien');
  khungvien.classList.remove('border-image');
  khungvien.parentNode.setAttribute('style', 'opacity: 1');
}, false)


var status = 0;
var show = 0;
var arrayImage = ['darius', 'viktor', 'syndra', 'yasuo', 'zed'];
var run = null;

var Choose = function(r) {
  removeAll();
  r.classList.add('khungvien');
  r.classList.remove('border-image');
  r.parentNode.setAttribute('style', 'opacity: 1');

  var main = document.getElementById('mainPic');
  var newOne = main.cloneNode(true);
  main.parentNode.replaceChild(newOne, main);

  var string = r.id;
  switch (string) {
    case 'darius':
      newOne.setAttribute('src', './image/main_darius.jpg');
      show = 0;
      break;
    case 'viktor':
      newOne.setAttribute('src', './image/main_viktor.jpg');
      show = 1;
      break;
    case 'syndra':
      newOne.setAttribute('src', './image/main_syndra.jpg');
      show = 2;
      break;
    case 'yasuo':
      newOne.setAttribute('src', './image/main_yasuo.jpg');
      show = 3;
      break;
    case 'zed':
      newOne.setAttribute('src', './image/main_zed.jpg');
      show = 4;
      break;
  }
}

var removeAll = function() {
  for(var i = 0; i < arrayImage.length; i++)
  {
    var khungvienHinh = document.getElementById(arrayImage[i]);
    khungvienHinh.classList.remove('khungvien');
    khungvienHinh.classList.add('border-image');
    khungvienHinh.parentNode.setAttribute('style', 'opacity: 0.5');
  }
}

var PlayShow = function()
{
  var nutPlay = document.getElementById('play_pause');
  if(status == 0)
  {
    nutPlay.setAttribute('src', './image/pause.png');
    status = 1;
    run = setInterval(function(){
      show++;
      if(show == 5)
      {
        show = 0;
      }
      var change = document.getElementById(arrayImage[show]);
      Choose(change);
    }, 1000);
  }
  else
  {
    nutPlay.setAttribute('src', './image/play.png');
    status = 0;
    window.clearInterval(run);
    run = null;
  }
}
