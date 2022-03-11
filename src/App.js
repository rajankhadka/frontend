import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Layout from "./components/ui/Layout/Layout";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  // const history = useHistory();
  const [isSubmitted, setIsSubmitted] = useState(false);

  //submitted false
  const submittedFalse =() => setIsSubmitted(false);
  const submittedTrue = () => setIsSubmitted(true);

  // console.log("app",isSubmitted);

  return (
    <Router>
      <Switch>
        <Route path="/login" render={(props) => <LoginPage 
            {...props} 
            submittedFalse={submittedFalse}
            submittedTrue={submittedTrue}
            isSubmitted={isSubmitted}
            />} 
          />
        {
          localStorage.getItem('authenticated') || isSubmitted
          ?
            <>
              <Route path="/" render={(props) => <Layout 
            {...props} 
            submittedFalse={submittedFalse}
            submittedTrue={submittedTrue}
            isSubmitted={isSubmitted}
            />}  />

            </>
          :
            
            <Redirect to={'/login'} />
            
        }
        <Route component={PageNotFound}/>
      </Switch>
    </Router>
  );
}

export default App;
