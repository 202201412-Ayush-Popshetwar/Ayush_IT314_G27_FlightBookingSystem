import Featured from "./Featured";
import Header from "./Header";
import MailList from "./MailList";
import Navbar from "./Navbar";
import RecommendList from "./RecommendList";
import CarouselList from "./CarouselList";
import Footer from "./Footer";

const Home = ({ loggedInUser , setLoggedInUser  }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar loggedInUser ={loggedInUser } setLoggedInUser ={setLoggedInUser } />
            <Header />
            <CarouselList />
            <div className="flex-grow flex flex-col items-center w-full mt-4"> 
                <Featured />
                <RecommendList />
                <MailList />
            </div>
            <Footer />
        </div>
    );
};

export default Home;