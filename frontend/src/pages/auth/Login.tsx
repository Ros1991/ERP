import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { saveRememberMeData, getRememberMeData } from '../../utils/rememberMe';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = getRememberMeData();
    if (savedData) {
      setValue('email', savedData.email);
      setValue('password', savedData.password);
      setValue('rememberMe', savedData.rememberMe);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email: data.email, password: data.password });
      
      if (!response.token) {
        console.error('Token não encontrado na resposta do login');
        toast.error('Erro na autenticação: token não recebido');
        return;
      }
      
      // Save form data for "Remember Me" functionality
      saveRememberMeData(data.email, data.password, data.rememberMe);
      
      login(response.user, response.token, undefined, data.rememberMe);
      toast.success('Login realizado com sucesso!');
      navigate('/companies');
    } catch (error: any) {
      console.error('Erro no login:', error);
      // O axios interceptor já exibe o toast de erro, 
      // mas vamos garantir que o erro seja mostrado
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      
      <div className="glass-card w-full max-w-md p-8 space-y-6 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema ERP
          </h1>
          <p className="text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('email')}
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            error={errors.email?.message}
            className=""
          />

          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Senha"
              placeholder="••••••••"
              error={errors.password?.message}
              className=""
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="rounded border-gray-300 bg-gray-50 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Lembrar de mim
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            icon={<LogIn className="h-5 w-5" />}
          >
            Entrar
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
