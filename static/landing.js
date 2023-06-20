function change_content(){
	console.log(document.getElementById("bdy").innerHTML);
	document.getElementById("bdy").innerHTML='<section class="sec1 shadow-left-right" data-aos="flip-left" duration="4000">'+
	'</section>'+
	'<section class="info" data-aos="fade-in" data-aos-duration="5000" data-aos-anchor-placement="center-bottom">'+
		'<h1>"Ship, Manage, Track, Delivery"</h1>'+
	'</section>'+
	'<section class="sec2 shadow-left-right" data-aos="fade-in" data-aos-anchor-placement="top-bottom" data-aos-duration="2000">'+
	'</section>'+
	'<section class="info" data-aos="fade-out" data-aos-duration="4000" data-aos-anchor-placement="center-bottom">'+
		'<h1>"Manage your shipments and returns</h1>'+
	'</section>'+
	'<section class="sec3 shadow-left-right" data-aos="fade-in" data-aos-anchor-placement="top-bottom" data-aos-duration="2000">'+
	'</section>'+
	'<section class="info" data-aos="fade-in" data-aos-duration="4000" data-aos-anchor-placement="center-bottom">'+
		'<h1>"Get started Now! And explore our services"</h1>'+
	'</section>'+
	'<section class="sec4 shadow-left-right"  >'+
		'<div class="div-button"  data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000">'+
			'<a class="button" href="/login" >'+
        		'<span>EXPLORE</span>'+
    		'</a>'+
		'</div>	'+
	'</section>';
}



setTimeout(change_content,3600);