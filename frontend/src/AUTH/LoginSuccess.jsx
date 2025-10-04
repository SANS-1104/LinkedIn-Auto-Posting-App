import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Navbar/AuthContext";
import { toast } from "react-toastify";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const hasHandledLogin = useRef(false); // ✅ prevent double execution

  useEffect(() => {
    if (hasHandledLogin.current) return; // ✅ skip if already processed
    hasHandledLogin.current = true;

    console.log("🔍 Full URL:", window.location.href);

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const nameParam = params.get("name");
    const decodedName = nameParam ? decodeURIComponent(nameParam) : null;

    // console.log("🔍 Parsed params:", {
    //   accessToken,
    //   refreshToken,
    //   nameParam,
    //   decodedName
    // });

    if (accessToken && refreshToken && decodedName) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      login(accessToken, decodedName);
      toast.success("Logged in with Google!", { autoClose: 1000 });

      // ✅ Replace instead of push so we don't trigger this again
      navigate(`/${decodedName}`, { replace: true });
    } else {
      toast.error("Google login failed", { autoClose: 1000 });
      navigate("/auth", { replace: true });
    }
  }, [navigate, login]);

  return <p>Logging in...</p>;
}
