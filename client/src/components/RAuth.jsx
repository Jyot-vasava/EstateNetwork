import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";


const RAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("${config.BACKEND_API}/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: result.user.email,
          name: result.user.displayName,
          image: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");

      console.log(result);
    } catch (error) {
      console.log("could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="bg-blue-500 text-white p-3 uppercase rounded-lg hover:opacity-75 transition"
    >
      Continue with Google
    </button>
  );
};

export default RAuth;
