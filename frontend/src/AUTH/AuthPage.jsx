import { useState, useContext } from "react"
import axiosClient from "../api/axiosClient";
import { toast } from 'react-toastify';
import { AuthContext } from "../Navbar/AuthContext"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../STUDIO/LANDING-PAGE/ui/card"
import { Button } from "../STUDIO/LANDING-PAGE/ui/button"
import { Input } from "../STUDIO/LANDING-PAGE/ui/input"
import { Label } from "../STUDIO/LANDING-PAGE/ui/label"
import { Separator } from "../STUDIO/LANDING-PAGE/ui/separator"
import { Checkbox } from "../STUDIO/LANDING-PAGE/ui/checkbox"
import {
    Linkedin,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
    ArrowRight,
    CheckCircle,
    Calendar,
    BarChart3
} from "lucide-react"

export function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        // rememberMe: false,
        // acceptTerms: false
    })
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
    // const handleSubmit = async (e) => {
    //     e.preventDefault()

    //     if (isLogin) {
    //         try {
    //             const res = await axiosClient.post("/login", {
    //                 email: formData.email,
    //                 password: formData.password,
    //             })

    //             const { accessToken, refreshToken, name } = res.data
    //             localStorage.setItem("accessToken", accessToken)
    //             localStorage.setItem("refreshToken", refreshToken)
    //             login(accessToken, name)

    //             toast.success("Logged in successfully!", { autoClose: 1000 })
    //             console.log("Navigating to:", `/dashboard/${name}`)
    //             navigate(`/dashboard/${name}`)
    //             console.log("Could not navigate");
                
    //         } catch (err) {
    //             toast.error("Login failed", { autoClose: 1000 })
    //             console.error("Login error:", err)
    //         }
    //     } else {
    //         if (formData.password !== formData.confirmPassword) {
    //             toast.error("Passwords do not match", { autoClose: 1000 })
    //             return
    //         }

    //         try {
    //             await axiosClient.post("/signup", {
    //                 name: `${formData.firstName} ${formData.lastName}`,
    //                 email: formData.email,
    //                 password: formData.password,
    //             })

    //             toast.success("Account created! Please login.", { autoClose: 1000 })
    //             setIsLogin(true)
    //         } catch (err) {
    //             toast.error("Signup failed", { autoClose: 1000 })
    //             console.error("Signup error:", err)
    //         }
    //     }
    // }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // --- LOGIN FLOW ---
            try {
                const res = await axiosClient.post("/login", {
                    email: formData.email,
                    password: formData.password,
                });

                const { accessToken, refreshToken, name } = res.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                login(accessToken, name);

                toast.success("Logged in successfully!", { autoClose: 1000 });

                // Check if user had selected a plan before login
                const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
                if (selectedPlan) {
                    navigate("/checkout");
                } else {
                    navigate(`/${name}`);
                }

            } catch (err) {
                toast.error("Login failed", { autoClose: 1500 });
                console.error("Login error:", err);
            }

        } else {
            // --- SIGNUP FLOW ---
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match", { autoClose: 1500 });
                return;
            }

            try {
                const res = await axiosClient.post("/signup", {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                });

                toast.success("Account created! Please login.", { autoClose: 1500 });
                setIsLogin(true);

            } catch (err) {
                toast.error("Signup failed", { autoClose: 1500 });
                console.error("Signup error:", err);
            }
        }
    };

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const features = [
        { icon: Calendar, title: "Smart Scheduling", description: "AI-powered optimal posting times", color: "from-blue-500 to-indigo-500" },
        { icon: BarChart3, title: "Advanced Analytics", description: "Track engagement and growth", color: "from-green-500 to-emerald-500" },
        { icon: Zap, title: "AI Content Generation", description: "Create viral content with AI", color: "from-purple-500 to-violet-500" },
        { icon: TrendingUp, title: "Virality Scoring", description: "Predict post performance", color: "from-amber-500 to-orange-500" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left Side - Branding and Features */}
                <div className="space-y-8">
                    {/* Logo and Brand */}
                    <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                                    <span className="font-bold text-lg">LS</span>
                                </div>
                                <div className="absolute -top-1 -right-1 h-4 w-4">
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                    LinkedIn Scheduler
                                </h1>
                                <p className="text-sm text-gray-500">Professional Edition</p>
                            </div>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Supercharge Your LinkedIn
                            <span className="block bg-gradient-to-r py-2 from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Content Strategy
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Join thousands of professionals who use AI-powered scheduling to
                            grow their LinkedIn presence and boost engagement by 300%.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={index}
                                    className="rounded-xl border bg-white/50 backdrop-blur-sm p-4 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 bg-gradient-to-r ${feature.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Social Proof */}
                    <div className="rounded-xl border bg-gradient-to-r from-white to-blue-50/50 p-6 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-gray-600" />
                                <span className="font-semibold text-gray-900">
                                    10,000+  users
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className="text-yellow-500">
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                4.5/5 from 1000+ reviews
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex justify-center">
                    <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
                        <CardHeader className="text-center space-y-4">
                            <CardTitle className="text-2xl font-bold">
                                {isLogin ? "Welcome Back!" : "Create Account"}
                            </CardTitle>
                            
                            <p className="text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200">
                                <a href="/" className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded">
                                    Go Back to Home →
                                </a>
                            </p>


                            <p className="text-gray-600">
                                {isLogin
                                    ? "Sign in to your account to continue"
                                    : "Join thousands of professionals growing on LinkedIn"}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Social Login */}
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300"
                                    onClick={() => onLogin("demo@example.com", "demo")}
                                >
                                    <Linkedin className="h-4 w-4 text-blue-600" />
                                    Continue with LinkedIn
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 hover:bg-gray-50 transition-all duration-300"
                                    onClick={() => window.location.href = "http://localhost:5000/auth/google"}
                                >
                                    <Mail className="h-4 w-4" />
                                    Continue with Google
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleInputChange("firstName")}
                                                required={!isLogin}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleInputChange("lastName")}
                                                // required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john.doe@company.com"
                                            className="pl-10"
                                            value={formData.email}
                                            onChange={handleInputChange("email")}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="pl-10 pr-10"
                                            value={formData.password}
                                            onChange={handleInputChange("password")}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {!isLogin && (
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm your password"
                                                className="pl-10"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange("confirmPassword")}
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isLogin ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                checked={formData.rememberMe}
                                                onCheckedChange={checked =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        rememberMe: checked
                                                    }))
                                                }
                                            />
                                            <Label htmlFor="remember" className="text-sm">
                                                Remember me
                                            </Label>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.acceptTerms}
                                            onCheckedChange={checked =>
                                                setFormData(prev => ({ ...prev, acceptTerms: checked }))
                                            }
                                            // required={!isLogin}
                                        />
                                        <Label htmlFor="terms" className="text-sm">
                                            I agree to the{" "}
                                            <span className="text-blue-600">Terms of Service</span>{" "}
                                            and <span className="text-blue-600">Privacy Policy</span>
                                        </Label>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>

                            {/* Switch Auth Mode */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    {isLogin
                                        ? "Don't have an account?"
                                        : "Already have an account?"}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {isLogin ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>

                            {/* Demo Credentials */}
                            {/* <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">
                                        Demo Access
                                    </span>
                                </div>
                                <p className="text-xs text-green-700">
                                    Try the demo with LinkedIn login button or use any
                                    email/password combination
                                </p>
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
