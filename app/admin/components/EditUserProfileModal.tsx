"use client";

import { useState } from "react";
import type { AdminUser } from "@/app/actions/admin";

interface EditUserProfileModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: { name: string; phone: string; avatar_url: string }) => Promise<void>;
}

export default function EditUserProfileModal({
  user,
  isOpen,
  onClose,
  onSave,
}: EditUserProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave(user.user_id, {
        name,
        phone,
        avatar_url: avatarUrl,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Error al guardar perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nordic/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-nordic hover:bg-gray-100 transition-colors"
        >
          <span className="material-icons text-lg">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-mosque/10 text-mosque flex items-center justify-center">
            <span className="material-icons text-xl">manage_accounts</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-nordic-dark">
              Editar Datos de Contacto
            </h3>
            <p className="text-xs text-nordic-muted truncate max-w-[280px]">
              {user.email}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-nordic-dark mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-nordic-dark mb-1">
              Teléfono / WhatsApp (para contacto en propiedades)
            </label>
            <input
              type="tel"
              placeholder="Ej. +1 604 555 0192 o +54 9 11 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic-dark placeholder-gray-400"
            />
            <p className="text-[11px] text-nordic-muted mt-1">
              Este número se usará para llamadas y chat de WhatsApp en las propiedades que publique este usuario.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-nordic-dark mb-1">
              URL de Avatar / Foto de Perfil
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-mosque text-nordic-dark placeholder-gray-400"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-mosque hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
