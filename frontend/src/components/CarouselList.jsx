import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap'; 

const carouselItems = [
    {
        src: "../img/Carousel/first.png",
        alt: "First slide",
        title: "Discover Your Dream Destination",
        text: "Plan Your Adventure: Explore the world with our best deals on flights to top destinations."
    },
    {
        src: "../img/Carousel/second.png",
        alt: "Second slide",
        title: "Exclusive Loyalty Program Benefits",
        text: "Sign Up and Save! Unlock exclusive discounts and special offers on flights"
    },
    {
        src: "../img/Carousel/third.jpg",
        alt: "Third slide",
        title: "Plan Ahead and Save",
        text: "Book Early for the Best Rates: Save big by booking in advance."
    },
    {
        src: "../img/Carousel/fourth.png",
        alt: "Fourth slide",
        title: "Seasonal Deals and Promotions",
        text: "Special Seasonal Offers! Get the best prices for your holiday travels."
    }
];

const CarouselList = () => {
    return (
        <Carousel interval={5000} wrap={true}>
            {carouselItems.map((item, index) => (
                <Carousel.Item key={index}>
                    <img
                        src={item.src}
                        alt={item.alt}
                        className="d-block w-full h-[60vh] object-cover"
                    />
                    <Carousel.Caption className="bg-black bg-opacity-50 p-4 rounded">
                        <h3 className="text-white text-2xl">{item.title}</h3>
                        <p className="text-white">{item.text}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CarouselList;