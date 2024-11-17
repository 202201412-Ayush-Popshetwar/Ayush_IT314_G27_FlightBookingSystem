import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Carousel} from 'react-bootstrap'; 

const CarouselList = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img style={{height:'80vh'}} src="../img/Carousel/first.png" alt="" className="d-block w-100" />

                <Carousel.Caption>
                    <h3> Discover Your Dream Destination</h3>
                    <p>Plan Your Adventure: Explore the world with our best deals on flights to top destinations.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img style={{height:'60vh'}} src="../img/Carousel/second.png" alt="" className="d-block w-100" />
                <Carousel.Caption>
                    <h3>Exclusive Loyalty Program Benefits</h3>
                    <p>Sign Up and Save! Unlock exclusive discounts and special offers on flights</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img style={{height:'80vh'}} src="../img/Carousel/third.jpg" alt="" className="d-block w-100" />
                <Carousel.Caption>
                    <h3>Plan Ahead and Save</h3>
                    <p>
                        Book Early for the Best Rates: Save big by booking in advance.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img style={{height:'80vh'}} src="../img/Carousel/fourth.png" alt="" className="d-block w-100" />
                <Carousel.Caption>
                    <h3>Seasonal Deals and Promotions</h3>
                    <p>
                    Special Seasonal Offers! Get the best prices for your holiday travels.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}

export default CarouselList;