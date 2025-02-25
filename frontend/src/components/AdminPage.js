import React, { useState, useEffect } from 'react';
import { Music, Youtube, Edit, ArrowLeft, CheckCircle } from 'lucide-react';
import { Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { isAuthenticated, getCurrentUser, logout } from '../services/auth';
import EditSongModal from './EditSongModal';
import backgroundImage from "../assets/background.jpg";
import tiaoCarreiro from "../assets/tiao-carreiro-pardinho.png";

const AdminPage = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [otherSongs, setOtherSongs] = useState([]);
  const [pendingSongs, setPendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = isAuthenticated();
        console.log("Auth status:", authStatus);
        
        if (authStatus) {
          const user = getCurrentUser();
          console.log("Current user:", user);
          setCurrentUser(user);
          
          if (user && user.status == 1) {
            setIsAdmin(true);

            await fetchTopMusicas();
            await fetchMusicas();
            await fetchPendingMusicas();
          } else {
            console.log("User is not admin, redirecting");
            setError("Você não tem permissão para acessar esta página.");
            setLoading(false);
          }
        } else {
          console.log("Not authenticated, redirecting");
          setError("Você precisa estar logado como administrador para acessar esta página.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setError("Erro ao verificar autenticação: " + err.message);
        setLoading(false);
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
      console.error("Error fetching top songs:", err);
      setError("Erro ao carregar músicas top: " + err.message);
      setLoading(false);
    }
  };

  const fetchMusicas = async () => {
    try {
      const response = await api.get('/musica');
      setOtherSongs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching other songs:", err);
      setError("Erro ao carregar músicas: " + err.message);
      setLoading(false);
    }
  };

  const fetchPendingMusicas = async () => {
    try {
      const response = await api.get('/musicaEspera');
      setPendingSongs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pending songs:", err);
      setError("Erro ao carregar músicas em espera: " + err.message);
      setLoading(false);
    }
  };

  const handleEditClick = (song) => {
    setSelectedSong(song);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      const updatedSong = {
        nome: data.nome,
        link: data.link
      };
  
      const response = await api.put(`/musica/${data.id}`, updatedSong);

      fetchTopMusicas();
      fetchMusicas();
      fetchPendingMusicas();
      
      setIsEditModalOpen(false);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar música:', error);
      return { success: false, error: 'Erro ao atualizar a música, verifique as informações preenchidas' };
    }
  };

  const handleDeleteSong = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        await api.put(`/musicaDelete/${id}`);

        fetchTopMusicas();
        fetchMusicas();
        fetchPendingMusicas();
        
        return { success: true };
      } catch (error) {
        console.error('Erro ao excluir música:', error);
        return { success: false, error: 'Erro ao excluir a música' };
      }
    }
  };

  const handleAprovacao = async (id) => {
    if (window.confirm('Tem certeza que deseja aprovar esta música?')) {
      try {
        await api.put(`/musicaAprovacao/${id}`);

        fetchTopMusicas();
        fetchMusicas();
        fetchPendingMusicas();
        
        return { success: true };
      } catch (error) {
        console.error('Erro ao aprovar música:', error);
        return { success: false, error: 'Erro ao aprovar a música' };
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = otherSongs.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastPendingItem = pendingPage * itemsPerPage;
  const indexOfFirstPendingItem = indexOfLastPendingItem - itemsPerPage;
  const currentPendingItems = pendingSongs.slice(indexOfFirstPendingItem, indexOfLastPendingItem);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePendingPageChange = (event, page) => {
    setPendingPage(page);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <p className="text-amber-800 text-lg">Carregando músicas...</p>
    </div>
  );
  
  if (error && !isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
      </div>
      <Link to="/" className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all">
        Voltar para a página inicial
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-amber-100 to-amber-50">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-amber-800/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Music className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-lg sm:text-2xl font-bold font-serif">Viola de Ouro</h1>
              <span className="bg-amber-700 text-white px-2 py-1 rounded-lg text-xs ml-2">ADMIN</span>
            </div>

            <button 
              className="block sm:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
            
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Link to="/" className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para o Site
                </Link>
                <span className="text-amber-100">Olá, {currentUser?.nome}</span>
                <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all">
                  Sair
                </button>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="block sm:hidden bg-amber-800 p-4">
              <div className="flex flex-col space-y-3">
                <Link to="/" className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all text-center">
                  Voltar para o Site
                </Link>
                <span className="text-amber-100">Olá, {currentUser?.nome}</span>
                <button onClick={handleLogout} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-all text-center">
                  Sair
                </button>
              </div>
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
            Painel Administrativo
          </h2>
          <p className="text-sm sm:text-base text-amber-200 italic text-center">
            Gerenciamento de músicas
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
                      <h3 className="text-base sm:text-xl font-semibold text-amber-900 truncate max-w-[150px] sm:max-w-md">
                        {song.nome}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                      <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                    <button 
                      onClick={() => handleEditClick(song)} 
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
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
                    <div className="flex items-center space-x-3">
                      <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                        <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                      <button 
                        onClick={() => handleEditClick(song)} 
                        className="text-amber-600 hover:text-amber-700"
                      >
                        <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-4 sm:mt-6">
              <Pagination
                count={Math.ceil(otherSongs.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                className="scale-75 sm:scale-100"
              />
            </div>
          </div>

          {pendingSongs.length > 0 && (
            <div className="mt-6 sm:mt-12 mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-2xl font-bold text-amber-900 mb-3 sm:mb-6 font-serif">
                Músicas em Espera de Aprovação
              </h3>
              <div className="grid gap-2 sm:gap-3">
                {currentPendingItems.map((song, index) => (
                  <div key={song.id} className="bg-amber-50/90 rounded-lg p-3 sm:p-4 transition-transform hover:scale-[1.01] border border-amber-800/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-lg sm:text-xl font-bold text-amber-700">
                          #{indexOfFirstPendingItem + index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-amber-900 text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                            {song.nome}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                          <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                        </a>
                        <button 
                          onClick={() => handleEditClick(song)} 
                          className="text-amber-600 hover:text-amber-700"
                        >
                          <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingSongs.length > itemsPerPage && (
                <div className="flex justify-center mt-4 sm:mt-6">
                  <Pagination
                    count={Math.ceil(pendingSongs.length / itemsPerPage)}
                    page={pendingPage}
                    onChange={handlePendingPageChange}
                    color="primary"
                    size="small"
                    className="scale-75 sm:scale-100"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <EditSongModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        onDelete={handleDeleteSong}
        onApprove={handleAprovacao}
        song={selectedSong}
      />
    </div>
  );
};

export default AdminPage;