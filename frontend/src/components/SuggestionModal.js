import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';

const SuggestionModal = ({ open, onClose, onSubmit, isUserAuthenticated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  const handleFormSubmit = (data) => {
    if (!isUserAuthenticated) {
      setError('Acesse sua conta para indicar uma música');
      return;
    }
    
    setError('');
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiBackdrop-root': { 
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)'
        },
        '& .MuiPaper-root': { 
          width: '500px', 
          borderRadius: 6, 
          backgroundColor: '#2D1E12',
          color: 'white', 
          padding: 3
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 'bold', color: '#F5D06A' }}>
        Sugerir Nova Música
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {error && (
            <Box sx={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              border: '1px solid #FF6B6B',
              borderRadius: 2,
              p: 2,
              mb: 2,
              color: '#FF6B6B',
              fontWeight: 'bold'
            }}>
              {error}
            </Box>
          )}
          
          {/* Seus campos de formulário aqui */}
          <TextField
            fullWidth
            label="Nome da Música"
            {...register('nome', { required: 'O nome da música é obrigatório' })}
            margin="normal"
            InputLabelProps={{ sx: { color: '#F5D06A' } }}
            sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
          
          <TextField
            fullWidth
            label="Link do YouTube"
            {...register('link', { required: 'O link do YouTube é obrigatório' })}
            margin="normal"
            InputLabelProps={{ sx: { color: '#F5D06A' } }}
            sx={{ '& .MuiOutlinedInput-root': { color: 'white' } }}
            error={!!errors.link}
            helperText={errors.link?.message}
          />
          
          <DialogActions sx={{ justifyContent: 'center', mt: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={onClose} 
              sx={{
                backgroundColor: '#8B5A2B', 
                color: 'white',
                fontWeight: 'bold',
                px: 3
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{
                backgroundColor: '#F5D06A', 
                color: '#4E2A0E',
                fontWeight: 'bold',
                px: 4 
              }}
            >
              Enviar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionModal;