const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
	mobile_menu.classList.toggle('active');
});

menu_item.forEach((item) => {
	item.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		mobile_menu.classList.toggle('active');
	});
});

 const slidesWrapper = document.getElementById('slidesWrapper');
 const logoItems = document.querySelectorAll('.logo-item');

 let currentSlide = 0;
 const totalSlides = logoItems.length;

 function goToSlide(index) {
   currentSlide = index;
   slidesWrapper.style.transform = `translateX(-${100 * currentSlide}%)`;

   logoItems.forEach((logo, idx) => {
	 logo.classList.toggle('active', idx === currentSlide);
   });
 }

 logoItems.forEach(logo => {
   logo.addEventListener('click', () => {
	 const index = parseInt(logo.dataset.index, 10);
	 goToSlide(index);
   });
 });

 goToSlide(0);

 
 function isMobileDevice() {
	return /Mobi|Android/i.test(navigator.userAgent);
  }

  const callDiv = document.getElementById('call');
  const phoneNumber = '+48797314398';

  callDiv.addEventListener('click', () => {
	if(isMobileDevice()) {
	  window.location.href = 'tel:' + phoneNumber;
	} else {
	  navigator.clipboard.writeText(phoneNumber)
		.then(() => {
		  alert('Skopiowano numer telefonu: ' + phoneNumber);
		})
		.catch(err => {
		  console.error('Błąd podczas kopiowania', err);
		});
	}
  });

  const mailDiv = document.getElementById('mail');
  const email = "biuro@e-dab.pl";

  mailDiv.addEventListener('click', () => {
	if(isMobileDevice()){
		window.location.href = `mailto:${email}?subject=Oferta&body=Dzień%20dobry.%20Jestem%20zainteresowany,%20proszę%20o%20kontakt.`;
	}else{
		navigator.clipboard.writeText(email)
		.then(()=> alert("Skopiowano adres email: " + email))
		.catch(err => {
			console.error('Błąd podczas kopiowania', err);
		  });
	}
  });

  const mapDiv = document.getElementById('location');

    mapDiv.addEventListener('click', () => {
      window.open(
        `https://maps.app.goo.gl/i3D6GyPJhEfm9fvt6`,
        '_blank'
      );
    });


	document.addEventListener('DOMContentLoaded', function() {
		const tabLinks = document.querySelectorAll('.tab-link');
		const allProjects = document.querySelectorAll('.projects-content');
		
		tabLinks.forEach(link => {
		  link.addEventListener('click', (e) => {
			e.preventDefault();
			
			// Usuwamy klasę 'active' ze wszystkich zakładek
			tabLinks.forEach(link => link.classList.remove('active'));
			// Usuwamy klasę 'active' ze wszystkich sekcji projektów
			allProjects.forEach(section => section.classList.remove('active'));
			
			// Dodajemy 'active' do klikniętej zakładki
			link.classList.add('active');
			// Pobieramy nazwę klasy z data-target i aktywujemy odpowiednią sekcję
			const target = link.dataset.target;
			document.querySelector('.' + target).classList.add('active');
		  });
		});
	  });
  