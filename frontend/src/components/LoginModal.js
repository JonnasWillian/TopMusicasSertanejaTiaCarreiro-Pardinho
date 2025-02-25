import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from '@mui/material';

const LoginModal = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');

  const handleFormSubmit = async (data) => {
    try {
      setLoginError('');
      const result = await onSubmit(data);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      setLoginError('Usuário ou senha incorretos');
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
      setLoginError('');
    }
  }, [open, reset]);

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
          width: '90%', 
          maxWidth: '500px',
          borderRadius: 6, 
          backgroundColor: '#2D1E12',
          color: 'white', 
          padding: 3,
          boxShadow: '0px 0px 20px rgba(0,0,0,0.3)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 'bold', fontFamily: 'serif', color: '#F5D06A' }}>
        Bem-vindo de volta!
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {loginError && (
            <Box sx={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              border: '1px solid #FF6B6B',
              borderRadius: 2,
              p: 2,
              mb: 2,
              color: '#FF6B6B',
              fontWeight: 'bold'
            }}>
              {loginError}
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Email"
            {...register('email', { required: 'O email é obrigatório' })}
            margin="normal"
            InputLabelProps={{
              sx: { fontWeight: 'bold', color: '#F5D06A' },
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F5D06A' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              '& .Mui-focused': { color: '#F5D06A' }
            }}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            {...register('senha', { required: 'A senha é obrigatória' })}
            margin="normal"
            InputLabelProps={{
              sx: { fontWeight: 'bold', color: '#F5D06A' },
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#F5D06A' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              '& .Mui-focused': { color: '#F5D06A' }
            }}
            error={!!errors.senha}
            helperText={errors.senha?.message}
          />
          <DialogActions sx={{ justifyContent: 'center', mt: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 } }}>
            <Button onClick={onClose} 
              sx={{
                backgroundColor: '#8B5A2B', 
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { backgroundColor: '#8B0000' }
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" 
              sx={{
                backgroundColor: '#F5D06A', 
                color: '#4E2A0E',
                fontWeight: 'bold',
                px: 4,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { backgroundColor: '#E5B55F' } 
              }}
            >
              Entrar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;