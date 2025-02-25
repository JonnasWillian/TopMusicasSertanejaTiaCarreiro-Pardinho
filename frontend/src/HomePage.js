import React, { useState, useEffect } from 'react';
import { Music, Youtube, Plus } from 'lucide-react';
import { Pagination } from '@mui/material';
import api from './services/api';
import { Link } from 'react-router-dom';
import { isAuthenticated as checkAuthStatus, getCurrentUser, logout } from './services/auth';
import SuggestionModal from './components/SuggestionModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import backgroundImage from "./assets/background.jpg";
import tiaoCarreiro from "./assets/tiao-carreiro-pardinho.png";


const App = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [otherSongs, setOtherSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      setUserAuthenticated(false);
      setCurrentUser(null);
    };
    
    window.addEventListener('auth:logout', handleForceLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleForceLogout);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = checkAuthStatus();
      if (authStatus) {
        try {
          const response = await api.get('/me');
          setUserAuthenticated(true);
          setCurrentUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUserAuthenticated(false);
          setCurrentUser(null);
        }
      } else {
        setUserAuthenticated(false);
        setCurrentUser(null);
      }
    };
  
    checkAuth();
  }, []);

  const fetchTopMusicas = async () => {
    try {
      const response = await api.get('/musicaTop5');
      setTopSongs(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMusicas = async () => {
    try {
      const response = await api.get('/musica');
      setOtherSongs(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSuggestionSubmit = async (data) => {
    try {
      const sugestao = {
        nome: data.nome,
        link: data.link,
        usuario_id: currentUser?.id
      };
  
      const response = await api.post('/musica', sugestao);

      setIsSuggestionModalOpen(false);
  
      return { success: true };
    } catch (error) {
      console.error('Erro ao sugerir vídeo:', error);
      return { success: false, error: 'Erro ao enviar a sugestão, verifique as informações preenchidas' };
    }
  };

  const handleLoginSubmit = async (data) => {
    try {
      const credentials = {
        email: data.email,
        password: data.senha
      };
  
      const response = await api.post('/login', credentials);
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
  
      setUserAuthenticated(true);
      setCurrentUser(response.data.user);
      setIsLoginModalOpen(false);
  
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Usuário ou senha incorretos' };
    }
  };

  const handleRegisterSubmit = (data) => {
    setUserAuthenticated(true);
    setCurrentUser(data.user);
    window.location.href = '/';
  };

  const handleLogout = async () => {
    await logout();
    setUserAuthenticated(false);
    setCurrentUser(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = otherSongs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTopMusicas();
    fetchMusicas();
  }, []);

  if (loading) return <p>Carregando músicas...</p>;
  if (error) return <p>Erro ao carregar as músicas: {error}</p>;

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-amber-100 to-amber-50">

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-amber-800/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Music className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-lg sm:text-2xl font-bold font-serif">Viola de Ouro</h1>
            </div>

            <button className="block sm:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>

            <div className="hidden sm:flex items-center space-x-4">
              {userAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-amber-100">Olá, {currentUser?.nome}</span>
                  <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all">
                    Sair
                  </button>
                  {currentUser?.status == 1 ? 
                  <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all">
                    <Link to="/admin">
                        Página Administrativa
                    </Link> 
                  </button>
                    : null}
                </div>
              ) : (
                <>
                  <button onClick={() => setIsRegisterModalOpen(true)} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all">
                    Cadastrar
                  </button>
                  <button onClick={() => setIsLoginModalOpen(true)} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all">
                    Login
                  </button>
                </>
              )}
            </div>
          </div>

          {menuOpen && (
            <div className="block sm:hidden bg-amber-800 p-4">
              {userAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <span className="text-amber-100">Olá, {currentUser?.nome}</span>
                  <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all text-center">
                    Sair
                  </button>
                  {currentUser?.status == 1 ? 
                    <Link to="/admin" className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all block text-center">
                        Página Administrativa
                    </Link> 
                    : null}
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <button onClick={() => {
                    setIsRegisterModalOpen(true);
                    setMenuOpen(false);
                  }} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all text-left">
                    Cadastrar
                  </button>
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setMenuOpen(false);
                    }} 
                    className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all text-left"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="relative h-64 sm:h-96 bg-amber-900 overflow-hidden pt-16 px-4 sm:p-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${backgroundImage})`,filter: "brightness(0.6)"}}/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-900/90" />
        
        <div className="relative max-w-6xl mx-auto h-full flex flex-col items-center justify-center">
          <div className="w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-amber-800 border-4 border-amber-600 overflow-hidden mb-4 sm:mb-6">
            <img src={tiaoCarreiro} alt="Tião Carreiro" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 font-serif text-center">
            Tião Carreiro & Pardinho
          </h2>
          <p className="text-sm sm:text-base text-amber-200 italic text-center">
            Reis da Viola Caipira
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-10 -mt-10 sm:-mt-16 relative">
        <div className="bg-white/90 rounded-xl shadow-xl p-4 sm:p-8 backdrop-blur-sm border border-amber-800/20">
          <h2 className="text-xl sm:text-3xl font-bold text-amber-900 mb-4 sm:mb-8 text-center font-serif">
            Top 5 Músicas Mais Tocadas
          </h2>
          <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-12">
            {topSongs.map((song, index) => (
              <div key={song.id} className="bg-white/80 rounded-lg shadow-md p-3 sm:p-6 transition-transform hover:scale-[1.01] border border-amber-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-xl sm:text-3xl font-bold text-amber-800">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold text-amber-900 truncate max-w-xs sm:max-w-md">
                        {song.nome}
                      </h3>
                    </div>
                  </div>
                  <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 flex-shrink-0">
                    <Youtube className="w-6 h-6 sm:w-8 sm:h-8" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-12">
            <h3 className="text-lg sm:text-2xl font-bold text-amber-900 mb-3 sm:mb-6 font-serif">
              Outras Músicas Populares
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {currentItems.map((song, index) => (
                <div key={song.id} className="bg-white/80 rounded-lg p-3 sm:p-4 transition-transform hover:scale-[1.01] border border-amber-800/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span className="text-lg sm:text-xl font-bold text-amber-700">
                        #{indexOfFirstItem + index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-amber-900 text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                          {song.nome}
                        </h4>
                      </div>
                    </div>
                    <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 flex-shrink-0">
                      <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-4 sm:mt-6">
              <Pagination count={Math.ceil(otherSongs.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" size="small" className="scale-75 sm:scale-100"/>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-40">
          <button
            onClick={() => setIsSuggestionModalOpen(true)}
            className="bg-amber-800 hover:bg-amber-700 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center transition-all"
            aria-label="Sugerir música"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </main>

      <SuggestionModal open={isSuggestionModalOpen} onClose={() => setIsSuggestionModalOpen(false)} onSubmit={handleSuggestionSubmit} isUserAuthenticated={userAuthenticated}/>

      <LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSubmit={handleLoginSubmit}/>

      <RegisterModal open={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSubmit={handleRegisterSubmit}/>
    </div>
  );
};

export default App;