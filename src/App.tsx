import React, { Component } from "react";
import withRouter from "./WithRouter";
// import "./styles/index.scss";
import AppRoutes from "./AppRoutes";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { IUserDataState } from "./types/index";
import Sidebar from "./components/sidebar/Sidebar";
import { RootState } from "./store";
interface IState {
  isFullPageLayout: boolean;
}
interface IProperty {
  user: IUserDataState;
  router: {
    location: Location;
    navigate: typeof Navigate;
    params: string;
  };
}
class App extends Component<IProperty, IState> {
  state: IState = {
    isFullPageLayout: true,
  };

  componentDidMount() {
    this.onRouteChanged();
  }

  render() {
    const navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : "";
    const sidebarComponent = !this.state.isFullPageLayout ? (
      this.props.user.data ? (
        <Sidebar />
      ) : (
        <Navigate to="/login-page" />
      )
    ) : (
      ""
    );
    const footerComponent = !this.state.isFullPageLayout ? <Footer /> : "";
    return (
      <div className="container-scroller">
        {navbarComponent}
        <div className="container-fluid page-body-wrapper">
          {sidebarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes />
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(previousProperties: IProperty) {
    if (this.props.router.location !== previousProperties.router.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [
      "/login-page",
      "/registration-page",
      "/user-pages/lockscreen",
      "/error-pages/error-404",
      "/error-pages/error-500",
      "/error-pages/error-401",
      "/general-pages/landing-page",
    ];
    for (const fullPageLayoutRoute of fullPageLayoutRoutes) {
      console.log(this.props.router.location.pathname);
      if (this.props.router.location.pathname === fullPageLayoutRoute) {
        this.setState({
          isFullPageLayout: true,
        });
        document
          ?.querySelector(".page-body-wrapper")
          ?.classList.add("full-page-wrapper");
        break;
      } else {
        this.setState({
          isFullPageLayout: false,
        });
        document
          ?.querySelector(".page-body-wrapper")
          ?.classList.remove("full-page-wrapper");
      }
    }
  }
}
const mapStateToProperties = (state: RootState) => ({
  user: state.userData,
});
export default connect(mapStateToProperties)(withRouter(App));