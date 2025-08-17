import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Building2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth/auth.service';
import { useAuthStore } from '../../stores/auth.store';

const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando registro com dados:', data);
      
      const { confirmPassword, ...formData } = data;
      const registerData = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password
      };
      console.log('📤 Enviando para API:', registerData);
      
      const response = await authService.register(registerData);
      console.log('✅ Resposta da API:', response);
      
      console.log('🔐 Fazendo login com:', { user: response.user, token: response.token });
      login(response.user as any, response.token);
      
      toast.success('Conta criada com sucesso!');
      
      // Wait for state to persist before navigation
      setTimeout(() => {
        const currentState = useAuthStore.getState();
        console.log('🏪 Store state before navigation:', {
          user: currentState.user,
          token: currentState.token,
          isAuthenticated: currentState.isAuthenticated
        });
        console.log('🔄 Navegando para /companies');
        navigate('/companies');
      }, 200);
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error);
      console.error('📋 Detalhes do erro:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      // Exibir erro para o usuário
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
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
            Criar Conta
          </h1>
          <p className="text-gray-600">
            Preencha os dados para criar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('nome')}
            type="text"
            label="Nome completo"
            placeholder="João Silva"
            error={errors.nome?.message}
            className=""
          />

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

          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar senha"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              className=""
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            icon={<UserPlus className="h-5 w-5" />}
          >
            Criar conta
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
