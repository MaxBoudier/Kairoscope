import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const { setTheme } = useTheme()

    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        sessionStorage.removeItem('settingsUnlocked');
        navigate('/login');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isHomePage = location.pathname === '/';

    if (isHomePage) {
        return (
            <div>
                <nav className="sticky top-0 z-50 flex w-full items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur-md font-['Space_Grotesk'] dark:border-white/12 dark:bg-[#080b10]/90 shadow-sm dark:shadow-none transition-colors duration-300 md:px-10">
                    <div className="flex items-center gap-4">
                        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl text-[#111] font-bold text-lg bg-slate-100 dark:bg-transparent">
                            <img src="/Images/logo.png" alt="Logo Kairoscope" className="block h-[70%] w-[70%] object-contain" />
                        </div>
                        <div className="">
                            <span className="block font-['Funnel_Display'] text-lg tracking-[0.5px] text-slate-900 dark:text-[#f5f7fb]">Kairoscope</span>
                            <small className="text-slate-500 text-xs uppercase tracking-[1.2px] dark:text-[#b0b8c5]">Le 6e sens de votre commerce</small>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3.5 text-sm text-slate-500 dark:text-[#b0b8c5]">
                        <a href="#projet" className="relative cursor-pointer font-medium tracking-wide text-inherit no-underline transition-colors hover:text-slate-900 dark:hover:text-[#f5f7fb] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-[#e8ff6a] after:transition-[width] after:duration-300 hover:after:w-full">Le Projet</a>
                        <a href="#membres" className="relative cursor-pointer font-medium tracking-wide text-inherit no-underline transition-colors hover:text-slate-900 dark:hover:text-[#f5f7fb] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-[#e8ff6a] after:transition-[width] after:duration-300 hover:after:w-full">Les Membres</a>
                        <a href="#fonctionnement" className="relative cursor-pointer font-medium tracking-wide text-inherit no-underline transition-colors hover:text-slate-900 dark:hover:text-[#f5f7fb] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-[#e8ff6a] after:transition-[width] after:duration-300 hover:after:w-full">Le Fonctionnement</a>
                        <a href="#contact" className="relative cursor-pointer font-medium tracking-wide text-inherit no-underline transition-colors hover:text-slate-900 dark:hover:text-[#f5f7fb] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-[#e8ff6a] after:transition-[width] after:duration-300 hover:after:w-full">Contact</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-500 dark:text-[#b0b8c5] hover:text-lime-600 dark:hover:text-[#e8ff6a] hover:bg-transparent dark:hover:border-[#e8ff6a] border border-transparent transition-all">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="relative" ref={dropdownRef}>
                            {user ? (
                                <>
                                    <div
                                        className="flex items-center gap-3 px-4 py-1.5 rounded-full cursor-pointer bg-gray-50 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors border border-gray-100 dark:border-neutral-700"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <div className="w-[35px] h-[35px] bg-blue-50 dark:bg-slate-700 rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-600 text-blue-500 dark:text-blue-400">
                                            <User size={20} />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {user.firstname}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </div>

                                    {isOpen && (
                                        <div className="absolute top-[60px] right-0 min-w-[200px] bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 py-2 overflow-hidden z-50">
                                            <div className="px-4 py-3 text-sm">
                                                <strong className="block text-slate-900 dark:text-slate-100">{user.firstname} {user.lastname}</strong>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.roles?.[0]}</div>
                                            </div>

                                            <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1" />

                                            <div
                                                className="flex items-center px-4 py-3 cursor-pointer text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                                onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                                            >
                                                <LayoutDashboard size={16} className="mr-3" />
                                                Tableau de Bord
                                            </div>

                                            <div
                                                className="flex items-center px-4 py-3 cursor-pointer text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                                onClick={() => { navigate('/settings'); setIsOpen(false); }}
                                            >
                                                <Settings size={16} className="mr-3" />
                                                Paramètres
                                            </div>

                                            <div
                                                className="flex items-center px-4 py-3 cursor-pointer text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={16} className="mr-3" />
                                                Déconnexion
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="w-[35px] h-[35px] bg-transparent border border-slate-200 dark:border-white/12 rounded-full flex justify-center items-center text-slate-500 dark:text-[#f5f7fb] cursor-pointer hover:border-lime-500 hover:text-lime-600 dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a] transition-all">
                                            <User size={20} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => navigate('/login')} className="cursor-pointer">
                                            Se connecter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/register')} className="cursor-pointer">
                                            Créer un compte
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    return (
        <nav className="fixed top-0 left-0 right-0 h-[70px] flex justify-between items-center px-10 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm z-50 font-sans text-slate-800 dark:text-slate-100">
            <div className="flex items-center">
                <Link to="/" className="flex items-center text-xl font-bold text-slate-800 dark:text-slate-100 hover:opacity-80 transition-opacity decoration-0">
                    <img src="/Images/logo.png" alt="Kairoscope" className="h-8 w-8 mr-2.5 rounded-lg" />
                    Kairoscope
                </Link>

            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative" ref={dropdownRef}>
                    {user ? (
                        <>
                            <div
                                className="flex items-center gap-3 px-4 py-1.5 rounded-full cursor-pointer bg-gray-50 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors border border-gray-100 dark:border-neutral-700"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="w-[35px] h-[35px] bg-blue-50 dark:bg-slate-700 rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-600 text-blue-500 dark:text-blue-400">
                                    <User size={20} />
                                </div>
                                <span className="text-sm font-medium">
                                    {user.firstname}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </div>

                            {isOpen && (
                                <div className="absolute top-[60px] right-0 min-w-[200px] bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 py-2 overflow-hidden z-50">
                                    <div className="px-4 py-3 text-sm">
                                        <strong className="block text-slate-900 dark:text-slate-100">{user.firstname} {user.lastname}</strong>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.roles?.[0]}</div>
                                    </div>

                                    <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1" />

                                    <div
                                        className="flex items-center px-4 py-3 cursor-pointer text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                        onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                                    >
                                        <LayoutDashboard size={16} className="mr-3" />
                                        Tableau de Bord
                                    </div>

                                    <div
                                        className="flex items-center px-4 py-3 cursor-pointer text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                        onClick={() => { navigate('/settings'); setIsOpen(false); }}
                                    >
                                        <Settings size={16} className="mr-3" />
                                        Paramètres
                                    </div>

                                    <div
                                        className="flex items-center px-4 py-3 cursor-pointer text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} className="mr-3" />
                                        Déconnexion
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="w-[35px] h-[35px] bg-gray-50 dark:bg-neutral-800 rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                                    <User size={20} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => navigate('/login')} className="cursor-pointer">
                                    Se connecter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/register')} className="cursor-pointer">
                                    Créer un compte
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
