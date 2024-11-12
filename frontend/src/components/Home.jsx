// Home.jsx
import Featured from "./Featured";
import Header from "./Header";
import MailList from "./MailList";
import Navbar from "./Navbar";
import RecommendList from "./recommendList";
import CarouselList from "./CarouselList";
import "./index.css";
import NavbarAfterLogin from './NavbarAfterLogin'
const Home = ({ isAuthenticated,setAuthenticated }) => {

    
    return (
        <div>
            {!isAuthenticated &&  <Navbar />}
            {isAuthenticated && <NavbarAfterLogin setAuthenticated={setAuthenticated}/>}
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
