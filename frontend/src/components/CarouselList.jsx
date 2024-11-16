
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap'; 

const CarouselList = () => {
    return (
        <Carousel interval={5000} wrap={true}>
            <Carousel.Item>
                <img
                    src="../img/Carousel/first.png"
                    alt="First slide"
                    className="d-block w-full h-[60vh] object-cover"
                />
                <Carousel.Caption className="bg-black bg-opacity-50 p-4 rounded">
                    <h3 className="text-white text-2xl">Discover Your Dream Destination</h3>
                    <p className="text-white">Plan Your Adventure: Explore the world with our best deals on flights to top destinations.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    src="../img/Carousel/second.png"
                    alt="Second slide"
                    className="d-block w-full h-[60vh] object-cover"
                />
                <Carousel.Caption className="bg-black bg-opacity-50 p-4 rounded">
                    <h3 className="text-white text-2xl">Exclusive Loyalty Program Benefits</h3>
                    <p className="text-white">Sign Up and Save! Unlock exclusive discounts and special offers on flights</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    src="../img/Carousel/third.jpg"
                    alt="Third slide"
                    className="d-block w-full h-[60vh] object-cover"
                />
                <Carousel.Caption className="bg-black bg-opacity-50 p-4 rounded">
                    <h3 className="text-white text-2xl">Plan Ahead and Save</h3>
                    <p className="text-white">Book Early for the Best Rates: Save big by booking in advance.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    src="../img/Carousel/fourth.png"
                    alt="Fourth slide"
                    className="d-block w-full h-[60vh] object-cover"
                />
                <Carousel.Caption className="bg-black bg-opacity-50 p-4 rounded">
                    <h3 className="text-white text-2xl">Seasonal Deals and Promotions</h3>
                    <p className="text-white">Special Seasonal Offers! Get the best prices for your holiday travels.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselList;