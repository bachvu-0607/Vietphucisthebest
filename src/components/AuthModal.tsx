import React, { useState } from 'react';
import { api, UserProfile } from '../services/api';
import { ChimLacIcon, TrienSonSeal } from './VietnameseMotifs';
import { X, Lock, Mail, User, KeyRound, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
  promptMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  promptMessage
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [createdRecoveryCode, setCreatedRecoveryCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setLoading(true);
    try {
      const data = await api.register({ email, name, password });
      if (data.user.recoveryCode) {
        setCreatedRecoveryCode(data.user.recoveryCode);
      }
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setLoading(true);
    try {
      const data = await api.forgotPassword({ email, recoveryCode });
      setSuccessMsg(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setMode('reset');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tạo mã khôi phục.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setLoading(true);
    try {
      await api.resetPassword({ resetToken, newPassword });
      setSuccessMsg('Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
      setMode('login');
      setPassword(newPassword);
    } catch (err: any) {
      setError(err.message || 'Đặt lại mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#F4C2CE] overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F4] to-[#FCE7EC] p-6 border-b border-[#F7D6DE] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <TrienSonSeal text="Remix" size="sm" />
            <span className="text-[11px] font-mono text-[#991B1B] font-bold tracking-wider uppercase">
              Tủ Đồ Di Sản Cá Nhân
            </span>
          </div>

          <h3 className="font-serif font-bold text-2xl text-[#1C1917]">
            {mode === 'login' && 'Đăng Nhập'}
            {mode === 'register' && 'Tạo Tài Khoản Mới'}
            {mode === 'forgot' && 'Khôi Phục Mật Khẩu'}
            {mode === 'reset' && 'Đặt Lại Mật Khẩu Mới'}
          </h3>

          <p className="text-xs text-[#78716C] mt-1 font-light">
            {promptMessage || 'Lưu giữ tác phẩm độc bản và hoàn thiện cổ phục cùng AI.'}
          </p>
        </div>

        {/* Tab Selector between Login and Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex border-b border-[#F7D6DE] bg-[#FFFBF8] text-xs font-serif font-semibold">
            <button
              onClick={() => { setMode('login'); resetFormState(); }}
              className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                mode === 'login'
                  ? 'text-[#C84B69] border-b-2 border-[#C84B69] bg-white font-bold'
                  : 'text-[#78716C] hover:text-[#C84B69]'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setMode('register'); resetFormState(); }}
              className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                mode === 'register'
                  ? 'text-[#C84B69] border-b-2 border-[#C84B69] bg-white font-bold'
                  : 'text-[#78716C] hover:text-[#C84B69]'
              }`}
            >
              Đăng ký thành viên
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Notifications */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif font-bold text-[#1C1917]">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); resetFormState(); }}
                    className="text-[11px] text-[#C84B69] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Đăng nhập vào Tủ đồ</span>
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Mật khẩu (Tối thiểu 6 ký tự)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Đăng ký tài khoản</span>
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3 bg-[#FFF5F7] rounded-xl border border-[#F4C2CE] text-xs text-[#881337] leading-relaxed">
                Để bảo vệ an toàn cho tủ đồ và tác phẩm của bạn, hệ thống yêu cầu mã xác minh khôi phục (Recovery Code) được cấp khi đăng ký (không cho phép đổi mật khẩu chỉ bằng email).
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Email đăng ký</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Mã xác minh khôi phục (Recovery Code)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="text"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="REC-XXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8] font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); resetFormState(); }}
                  className="text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  Quay lại đăng nhập
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white font-serif font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Xác thực & Đặt lại'}
                </button>
              </div>
            </form>
          )}

          {/* 4. RESET PASSWORD FORM */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Mã xác thực khôi phục</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Mã xác thực"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-serif font-bold text-[#1C1917]">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F4C2CE] focus:border-[#C84B69] focus:outline-hidden text-sm bg-[#FFFBF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Cập nhật mật khẩu mới</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
