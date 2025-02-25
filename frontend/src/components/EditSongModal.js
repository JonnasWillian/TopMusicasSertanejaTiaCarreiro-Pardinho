import React, { useState, useEffect } from 'react';
import { Music, X, Trash, CheckCircle } from 'lucide-react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const EditSongModal = ({ open, onClose, onSubmit, onDelete, onApprove, song }) => {
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    link: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (song) {
      setFormData({
        id: song.id,
        nome: song.nome,
        link: song.link,
        status: song.status
      });
    }
  }, [song]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit(formData);
      
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      setLoading(false);
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao salvar. Tente novamente.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await onDelete(formData.id);
      
      if (!result.success) {
        setError(result.error);
        return;
      }
      
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao excluir. Tente novamente.');
    }
  };

  const handleApprove = async () => {
    try {
      const result = await onApprove(formData.id);
      
      if (!result.success) {
        setError(result.error);
        return;
      }
      
      onClose();
    } catch (err) {
      setError('Ocorreu um erro ao aprovar. Tente novamente.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-song-modal"
      aria-describedby="modal for editing songs"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          maxWidth: '90%',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          outline: 'none',
        }}
      >
        <div className="bg-amber-800 text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <Music className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-bold">
              {formData.status === 0 ? 'Editar Música em Espera' : 'Editar Música'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="nome" className="block text-amber-900 font-medium mb-1">
              Nome da Música
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="link" className="block text-amber-900 font-medium mb-1">
              Link do YouTube
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {formData.status == 0 ? (
              <button
                type="button"
                onClick={handleApprove}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Trash className="w-4 h-4 mr-2" />
                Excluir
              </button>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button type="button" onClick={onClose} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditSongModal;