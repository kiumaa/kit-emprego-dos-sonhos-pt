'use client';

import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  FileText,
  FolderOpen,
  Send,
  Briefcase,
  Calendar,
  UserCheck,
  Share2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function MemberAreaLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Visão Geral', href: '/area', icon: <Home size={18} /> },
    { label: '10 Lições do Kit', href: '/area/licoes/01-objetivo', icon: <BookOpen size={18} /> },
    { label: 'Modelos de CV (DOCX)', href: '/area/modelos-cv', icon: <FileText size={18} /> },
    { label: 'Biblioteca de Recursos', href: '/area/biblioteca', icon: <FolderOpen size={18} /> },
    { label: 'Cartas & Mensagens', href: '/area/mensagens', icon: <Send size={18} /> },
    { label: 'Gestor de Candidaturas', href: '/area/candidaturas', icon: <Briefcase size={18} /> },
    { label: 'Plano 7 Dias', href: '/area/plano', icon: <Calendar size={18} /> },
    { label: 'Entrevista dos Sonhos', href: '/area/entrevista', icon: <UserCheck size={18} />, bump: true },
    { label: 'LinkedIn dos Sonhos', href: '/area/linkedin', icon: <Share2 size={18} />, bump: true },
    { label: 'Conta & Privacidade', href: '/area/conta', icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '260px',
          borderRight: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          padding: 'var(--space-6) var(--space-4)',
        }}
        className="hidden-mobile"
      >
        <div>
          <div style={{ padding: '0 var(--space-2) var(--space-6) var(--space-2)' }}>
            <a
              href="/"
              style={{
                fontSize: '18px',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Emprego dos Sonhos
            </a>
            <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)' }}>
              Área do Comprador
            </span>
          </div>

          <nav aria-label="Navegação da área de membro" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-control)',
                  fontSize: 'var(--type-small)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  transition: 'background-color 160ms ease',
                }}
                className="member-nav-link"
              >
                <span style={{ color: item.bump ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--type-small)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '8px 12px',
            }}
          >
            <LogOut size={16} />
            <span>Voltar ao site público</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        <header
          style={{
            height: '60px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-raised)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--layout-mobile-gutter)',
            position: 'sticky',
            top: 0,
            zIndex: 90,
          }}
          className="visible-mobile"
        >
          <a href="/area" style={{ fontSize: '16px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)', textDecoration: 'none' }}>
            Área do Membro
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
            aria-label="Alternar menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
            className="visible-mobile"
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-control)',
                  fontSize: 'var(--type-body)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}

        <main style={{ flex: 1, padding: 'var(--space-8) var(--layout-mobile-gutter)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
