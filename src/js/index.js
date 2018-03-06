import '../sass/styles.scss';
import '../../node_modules/owl.carousel/dist/owl.carousel.min.js';
$('.owl-carousel').owlCarousel({
    loop: true,
    dots: false,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            margin: 7
        },
        320: {
            items: 2,
            margin: 7
        },
        992: {
            nav:true,
            items: 3,
            margin: 16
        },
        1500: {
            nav:true,
            items: 4,
            margin: 16
        }
    }
});

// delete text in buttons in owl carousel

$(".owl-prev").html("");
$(".owl-next").html("");
