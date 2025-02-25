import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { register as registerUser } from '../services/auth';

const RegisterModal = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [registerError, setRegisterError] = useState('');

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    try {
      setRegisterError('');
      const response = await registerUser(data);
      onSubmit(response);
      reset();
      onClose();
    } catch (error) {
      if (error.errors) {
        setRegisterError(Object.values(error.errors)[0][0] || 'Erro ao realizar cadastro.');
      } else {
        setRegisterError('Erro ao realizar cadastro. Tente novamente.');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseModal}
      sx={{
        '& .MuiBackdrop-root': { 
          backgroundColor: 'rgba(0, 0, 0, 0.85)', 
          backdropFilter: 'blur(8px)' 
        },
        '& .MuiPaper-root': { 
          width: { xs: '90%', sm: '600px' },
          borderRadius: 6, 
          backgroundColor: '#4E2A0E',
          color: 'white', 
          padding: 3 
        }
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <DialogTitle 
          sx={{
            textAlign: 'center', 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            fontFamily: 'serif', 
            color: '#F5D06A'
          }}
        >
          Cadastro
        </DialogTitle>
        <IconButton onClick={handleCloseModal} sx={{ color: '#FFF' }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          {[
            { label: 'Nome', name: 'nome', type: 'text', validation: { required: 'O nome é obrigatório', minLength: { value: 5, message: 'Mínimo 5 caracteres' } } },
            { label: 'Email', name: 'email', type: 'email', validation: { required: 'O email é obrigatório', pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' } } },
            { label: 'Senha', name: 'password', type: 'password', validation: { required: 'A senha é obrigatória', minLength: { value: 7, message: 'Mínimo 7 caracteres' } } },
          ].map(({ label, name, type, validation }) => (
            <Box key={name}>
              <TextField
                fullWidth
                type={type}
                label={label}
                {...register(name, validation)}
                variant="outlined"
                InputLabelProps={{ sx: { fontWeight: 'bold', color: '#F5D06A' } }}
                sx={{
                  ...inputStyle,
                  border: errors[name] ? '2px solid #FF6B6B' : 'none'
                }}
              />
              {errors[name] && (
                <Typography sx={errorStyle}>
                  {errors[name].message}
                </Typography>
              )}
            </Box>
          ))}

          <DialogActions sx={{ justifyContent: 'center', mt: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={handleCloseModal} 
              sx={{
                backgroundColor: '#8B5A2B', 
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': { backgroundColor: '#8B0000' }
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
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': { backgroundColor: '#E5B55F' }
              }}
            >
              Cadastrar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const inputStyle = {
  bgcolor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 2,
  color: 'white',
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: 2,
    transition: '0.3s',
    '& fieldset': { borderColor: '#F5D06A' },
    '&:hover fieldset': { borderColor: '#FFD700' },
    '&.Mui-focused fieldset': { borderColor: '#F5D06A' },
  },
  '& .MuiInputBase-input': { 
    padding: '12px', 
    fontSize: '1rem' 
  },
};

const errorStyle = {
  color: '#FF6B6B',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  marginTop: '4px',
  textAlign: 'left'
};

export default RegisterModal;
