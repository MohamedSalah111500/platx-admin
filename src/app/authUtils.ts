import "firebase/compat/auth";
import "firebase/compat/firestore";

class FirebaseAuthBackend {
  constructor() {}

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {};

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {};

  /**
   * forget Password user with given details
   */
  forgetPassword = (email) => {};

  /**
   * Logout the user
   */
  logout = () => {};

  setLoggeedInUser = (user) => {
    sessionStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!sessionStorage.getItem("authUser")) {
      return null;
    }
    return JSON.parse(sessionStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // tslint:disable-next-line: prefer-const
    var errorMessage = error.message;
    return errorMessage;
  }
}
