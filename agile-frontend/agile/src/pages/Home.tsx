import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to <span className="font-thin">A G I L E</span></h1>
      <p className="text-xl mb-8">Boost your productivity and workflow</p>
      <Link to="/tasks" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
        Get Started
      </Link>
    </div>
  );
};

export default Home;