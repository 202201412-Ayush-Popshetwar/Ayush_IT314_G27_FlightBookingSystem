import Featured from "./Featured";
import Header from "./Header";
import MailList from "./MailList";
import Navbar from "./Navbar";
import RecommendList from "./recommendList";
import CarouselList from "./CarouselList";
import "./index.css";


const Home = () => {
    return (
        <div>
            <Navbar />
            <Header />
            <CarouselList />
            <div className="homeContainer">
                <Featured />
                <h1 className="homeTitle">Recommended for you</h1>
                <RecommendList />
                <MailList />
            </div>
        </div>
    )
}

export default Home;